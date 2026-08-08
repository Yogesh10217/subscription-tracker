/**
 * @file frequency-normalizer.js
 * @module analytics/calculators/frequency-normalizer
 * @description Deterministic normalization engine converting any subscription frequency to Monthly and Yearly equivalents.
 */

export class FrequencyNormalizer {
  /**
   * Calculates monthly and yearly equivalent prices.
   * @param {number} price
   * @param {string} frequency - 'Daily'|'Weekly'|'Monthly'|'Quarterly'|'Yearly'|'Custom'
   * @param {string} [customIntervalUnit='month'] - 'day'|'week'|'month'|'year'
   * @param {number} [customIntervalValue=1]
   * @returns {{ monthlyEquivalent: number, yearlyEquivalent: number }}
   */
  static normalize(
    price = 0,
    frequency = 'Monthly',
    customIntervalUnit = 'month',
    customIntervalValue = 1
  ) {
    const numPrice = Number(price) || 0;
    if (numPrice <= 0) {
      return { monthlyEquivalent: 0, yearlyEquivalent: 0 };
    }

    let monthlyEquivalent = 0;
    let yearlyEquivalent = 0;

    switch (frequency) {
      case 'Daily':
        yearlyEquivalent = numPrice * 365;
        monthlyEquivalent = yearlyEquivalent / 12;
        break;

      case 'Weekly':
        yearlyEquivalent = numPrice * 52;
        monthlyEquivalent = yearlyEquivalent / 12;
        break;

      case 'Monthly':
        monthlyEquivalent = numPrice;
        yearlyEquivalent = numPrice * 12;
        break;

      case 'Quarterly':
        monthlyEquivalent = numPrice / 3;
        yearlyEquivalent = numPrice * 4;
        break;

      case 'Yearly':
        yearlyEquivalent = numPrice;
        monthlyEquivalent = numPrice / 12;
        break;

      case 'Custom': {
        const val = Math.max(1, Number(customIntervalValue) || 1);
        const unit = (customIntervalUnit || 'month').toLowerCase();

        let multiplierToYearly = 12;
        if (unit === 'day') multiplierToYearly = 365 / val;
        else if (unit === 'week') multiplierToYearly = 52 / val;
        else if (unit === 'month') multiplierToYearly = 12 / val;
        else if (unit === 'year') multiplierToYearly = 1 / val;

        yearlyEquivalent = numPrice * multiplierToYearly;
        monthlyEquivalent = yearlyEquivalent / 12;
        break;
      }

      default:
        monthlyEquivalent = numPrice;
        yearlyEquivalent = numPrice * 12;
        break;
    }

    return {
      monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
      yearlyEquivalent: Math.round(yearlyEquivalent * 100) / 100
    };
  }
}

export default FrequencyNormalizer;
