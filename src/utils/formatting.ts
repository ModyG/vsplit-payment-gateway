/**
 * Formatting utilities
 */

/**
 * Format amount for display
 */
export function formatAmount(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in cents
  } catch (error) {
    // Fallback formatting
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${(amount / 100).toFixed(2)}`;
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
  };

  return symbols[currency.toUpperCase()] || currency.toUpperCase();
}

/**
 * Convert amount to smallest currency unit (cents)
 */
export function convertToSubcurrency(
  amount: number,
  currency: string = 'USD'
): number {
  // Most currencies use 2 decimal places, but some exceptions exist
  const zeroDecimalCurrencies = [
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'JPY',
    'KMF',
    'KRW',
    'MGA',
    'PYG',
    'RWF',
    'UGX',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
  ];

  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return Math.round(amount);
  }

  return Math.round(amount * 100);
}

/**
 * Convert from smallest currency unit to major unit
 */
export function convertFromSubcurrency(
  amount: number,
  currency: string = 'USD'
): number {
  const zeroDecimalCurrencies = [
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'JPY',
    'KMF',
    'KRW',
    'MGA',
    'PYG',
    'RWF',
    'UGX',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
  ];

  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return amount;
  }

  return amount / 100;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(
  phone: string,
  country: string = 'US'
): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  switch (country.toUpperCase()) {
    case 'US':
    case 'CA':
      if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
          7
        )}`;
      } else if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
          6
        )}`;
      }
      break;
    case 'GB':
    case 'UK':
      if (digits.length === 11 && digits.slice(0, 2) === '44') {
        return `+44 ${digits.slice(2, 6)} ${digits.slice(6)}`;
      } else if (digits.length === 11 && digits[0] === '0') {
        return `${digits.slice(0, 5)} ${digits.slice(5)}`;
      }
      break;
  }

  // Default formatting
  return phone;
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | number | string,
  locale: string = 'en-US'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    // Fallback formatting
    return dateObj.toLocaleString();
  }
}

/**
 * Mask sensitive data (like card numbers)
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) {
    return cardNumber;
  }

  const lastFour = cardNumber.slice(-4);
  const masked = '*'.repeat(Math.max(0, cardNumber.length - 4));

  return `${masked}${lastFour}`;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: string | Error): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Format status for display
 */
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    requires_action: 'Requires Action',
    succeeded: 'Succeeded',
    failed: 'Failed',
    canceled: 'Canceled',
    partial: 'Partially Completed',
    refunded: 'Refunded',
  };

  return statusMap[status.toLowerCase()] || status;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}
