/**
 * @file failure-classifier.util.js
 * @module notifications/utils/failure-classifier.util
 * @description Classifies delivery errors into TRANSIENT vs PERMANENT categories.
 */

export const FailureType = Object.freeze({
  TRANSIENT: 'TRANSIENT',
  PERMANENT: 'PERMANENT'
});

export class FailureClassifier {
  /**
   * Classifies an error as TRANSIENT or PERMANENT.
   * @param {Error|Object} error
   * @returns {string} FailureType.TRANSIENT or FailureType.PERMANENT
   */
  static classify(error) {
    if (!error) return FailureType.TRANSIENT;

    const msg = (error.message || '').toLowerCase();
    const code = (error.code || '').toLowerCase();

    // Permanent errors
    if (
      msg.includes('invalid email') ||
      msg.includes('user preference disabled') ||
      msg.includes('invalid payload') ||
      msg.includes('template not found') ||
      code === 'EAUTH' ||
      code === 'EENVELOPE'
    ) {
      return FailureType.PERMANENT;
    }

    // Transient errors (network timeout, rate limit, temporary socket error)
    return FailureType.TRANSIENT;
  }
}

export default FailureClassifier;
