/**
 * Validation utilities
 */
import { PaymentSessionConfig } from '../types';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate amount (positive number)
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

/**
 * Validate currency code (ISO 4217)
 */
export function isValidCurrency(currency: string): boolean {
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(currency);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate postal code (flexible format)
 */
export function isValidPostalCode(
  postalCode: string,
  country?: string
): boolean {
  if (!postalCode || postalCode.trim().length === 0) {
    return false;
  }

  // Country-specific validation can be added here
  switch (country?.toUpperCase()) {
    case 'US':
      return /^\d{5}(-\d{4})?$/.test(postalCode);
    case 'GB':
    case 'UK':
      return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postalCode);
    case 'CA':
      return /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i.test(postalCode);
    default:
      // Basic validation for other countries
      return postalCode.trim().length >= 3;
  }
}

/**
 * Validate order ID format
 */
export function isValidOrderId(orderId: string): boolean {
  return typeof orderId === 'string' && orderId.trim().length > 0;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate split payment configuration
 */
export function validateSplitPayments(
  splits: Array<{ amount: number }>,
  totalAmount: number
): {
  valid: boolean;
  error?: string;
} {
  if (!Array.isArray(splits) || splits.length === 0) {
    return { valid: false, error: 'At least one split payment is required' };
  }

  if (splits.length > 10) {
    return { valid: false, error: 'Maximum 10 split payments allowed' };
  }

  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);

  if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
    return { valid: false, error: 'Split amounts must equal total amount' };
  }

  for (let i = 0; i < splits.length; i++) {
    if (!isValidAmount(splits[i].amount)) {
      return { valid: false, error: `Invalid amount for split ${i + 1}` };
    }
  }

  return { valid: true };
}

/**
 * Validate payment configuration
 */
export function validatePaymentConfig(config: PaymentSessionConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isValidAmount(config.amount)) {
    errors.push('Invalid payment amount');
  }

  if (!isValidCurrency(config.currency)) {
    errors.push('Invalid currency code');
  }

  if (!isValidOrderId(config.orderId)) {
    errors.push('Invalid order ID');
  }

  if (config.customer?.email && !isValidEmail(config.customer.email)) {
    errors.push('Invalid customer email');
  }

  if (config.customer?.phone && !isValidPhoneNumber(config.customer.phone)) {
    errors.push('Invalid customer phone number');
  }

  if (config.returnUrl && !isValidUrl(config.returnUrl)) {
    errors.push('Invalid return URL');
  }

  if (config.webhookUrl && !isValidUrl(config.webhookUrl)) {
    errors.push('Invalid webhook URL');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
