// utils/reminderCron.js
import cron from "node-cron";
import express from "express";
import Subscription from "../models/Subscription.js";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: format a Date to 'YYYY-MM-DD' (local)
function formatDateYMD(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper: create start & end for a local date
function dayRange(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Main send function
async function sendRemindersForDate(targetDate, daysBeforeLabel) {
  const targetStr = formatDateYMD(targetDate);
  const { start, end } = dayRange(targetDate);

  try {
    // find subscriptions whose nextRenewalDate is on targetDate
    const subs = await Subscription.find({
      nextRenewalDate: { $gte: start, $lte: end }
    });

    if (!subs.length) {
      console.log(`No subscriptions to remind for ${targetStr} (${daysBeforeLabel})`);
      return;
    }

    console.log(`Found ${subs.length} subscription(s) for ${targetStr} (${daysBeforeLabel})`);

    for (const sub of subs) {
      if (sub.lastReminderDate === targetStr) {
        console.log(`Skipping duplicate reminder for ${sub._id}`);
        continue;
      }

      const to = sub.userEmail;
      if (!to) {
        console.warn(`Skipping ${sub._id} because userEmail is missing`);
        continue;
      }

      const subject = daysBeforeLabel === "0"
        ? `${sub.serviceName} renews today`
        : `${sub.serviceName} renews in ${daysBeforeLabel} day(s)`;

      const text = `Hi,

This is a reminder that your subscription to ${sub.serviceName} (${sub.category || "service"})
for ₹${sub.amount ?? "N/A"} renews on ${targetStr}.

${daysBeforeLabel === "0" 
  ? "Please verify your payment method to avoid service interruption."
  : `This reminder is sent ${daysBeforeLabel} day(s) before renewal.`}

Thanks,
Smart Subscription Manager`;

      // ---- RESEND EMAIL SENDING ----
      try {
        await resend.emails.send({
          from: "Smart Subscription Manager <onboarding@resend.dev>",
          to: to,
          subject: subject,
          text: text
        });

        sub.lastReminderDate = targetStr;
        await sub.save();

        console.log(`✔ Email sent to ${to} for ${sub.serviceName}`);
      } catch (err) {
        console.error(`✖ Failed sending to ${to}:`, err);
      }
    }
  } catch (err) {
    console.error("Error querying subscriptions:", err);
  }
}

// ---- Cron schedule: run daily at 09:00 AM IST ----
cron.schedule("* * * * *", async () => {
  console.log("⏰ Running daily reminder job:", new Date().toString());

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const in3 = new Date(today);
  in3.setDate(in3.getDate() + 3);

  await sendRemindersForDate(in3, "3");
  await sendRemindersForDate(today, "0");

}, { timezone: "Asia/Kolkata" });

// ---- Optional test route ----
try {
  const testApp = express();

  testApp.get("/__cron/test-email", async (req, res) => {
    const to = req.query.to || "test@example.com";

    try {
      await resend.emails.send({
        from: "Smart Subscription Manager <onboarding@resend.dev>",
        to,
        subject: "Test Email",
        text: "If you received this, Resend email system is working!"
      });

      return res.json({ ok: true, message: `Test email sent to ${to}` });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err });
    }
  });

  const TEST_PORT = process.env.CRON_TEST_PORT || 5544;
  testApp.listen(TEST_PORT, () => {
    console.log(`🧪 Test email endpoint: http://localhost:${TEST_PORT}/__cron/test-email?to=your@email.com`);
  });

} catch (e) {
  console.warn("Test endpoint failed:", e);
}
