import { categorizeService } from "../../ml/categorizationService.js";
import { generateForecast } from "../../ml/forecastService.js";
import { generateRecommendations } from "../../ml/recommendationService.js";
import Subscription from "../models/Subscription.js";

export const categorize = async (req, res) => {
  try {
    const { serviceName } = req.body;

    if (!serviceName) {
      return res.status(400).json({ message: "Service name is required." });
    }

    const { category, confidence } = categorizeService(serviceName);

    res.status(200).json({
      category,
      confidence: parseFloat(confidence.toFixed(2))
    });

  } catch (error) {
    console.error("AI Categorization Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @route   GET /api/ai/forecast
 * @desc    Get AI-predicted monthly subscription spend
 * @access  Private
 */
export const getForecast = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const forecastData = await generateForecast(userId);

    res.status(200).json(forecastData);

  } catch (error) {
    console.error("AI Forecast Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get AI cancellation suggestions
 * @access  Private
 */
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const subs = await Subscription.find({ userId, status: "Active" });

    const results = generateRecommendations(subs);

    res.status(200).json(results);

  } catch (error) {
    console.error("AI Recommendations Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
