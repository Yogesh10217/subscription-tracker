import FailureClassifier, { FailureType } from '#notifications/utils/failure-classifier.util.js';

describe('FailureClassifier Unit Tests', () => {
  test('should classify invalid email as PERMANENT', () => {
    const res = FailureClassifier.classify(new Error('invalid email address provided'));
    expect(res).toBe(FailureType.PERMANENT);
  });

  test('should classify network timeout as TRANSIENT', () => {
    const res = FailureClassifier.classify(new Error('ETIMEDOUT connection failed'));
    expect(res).toBe(FailureType.TRANSIENT);
  });
});
