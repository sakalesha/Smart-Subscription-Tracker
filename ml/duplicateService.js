/**
 * Calculates the similarity between two strings using Sørensen–Dice coefficient
 * @param {string} first - First string to compare
 * @param {string} second - Second string to compare
 * @returns {number} Similarity score between 0 and 1
 */
const getSimilarity = (first, second) => {
  if (!first || !second) return 0;
  
  first = first.replace(/\s+/g, "").toLowerCase();
  second = second.replace(/\s+/g, "").toLowerCase();

  if (first === second) return 1.0;
  if (first.length < 2 || second.length < 2) return 0;

  const firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
};

/**
 * Checks for potential duplicate subscriptions for a user
 * @param {object} newSub - The subscription being added
 * @param {Array} existingSubs - The user's current subscriptions
 * @returns {Array} Array of warning messages
 */
export const checkDuplicates = (newSub, existingSubs) => {
  const warnings = [];
  const similarityThreshold = 0.75;

  if (!existingSubs || existingSubs.length === 0) return warnings;

  for (const existing of existingSubs) {
    // Skip if comparing to itself (in case of updates)
    if (existing._id.toString() === newSub._id?.toString()) continue;

    const similarity = getSimilarity(newSub.serviceName, existing.serviceName);

    if (similarity >= similarityThreshold) {
      warnings.push({
        type: "DUPLICATE_RISK",
        message: `Potential duplicate: You already have '${existing.serviceName}' (₹${existing.amount}/mo). Is this different?`,
        conflictingId: existing._id,
        similarity: parseFloat(similarity.toFixed(2))
      });
    }
  }

  return warnings;
};
