/**
 * Formats a number as Indian Rupee (INR) currency.
 * @param amount - The number to format
 * @returns A string in the format "₹1,234.56"
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // SwiftCart often skips paise for main prices
  }).format(amount);
};

export const formatPriceParts = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount);
    
    // Extract currency symbol (₹), whole number, and decimal
    const match = formatted.match(/^(₹)\s?([\d,]+)\.?(\d+)?$/);
    if (!match) return { symbol: '₹', whole: Math.floor(amount).toString(), fraction: '00' };

    return {
        symbol: match[1],
        whole: match[2],
        fraction: match[3] || '00'
    };
};
