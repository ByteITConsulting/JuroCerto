/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Analytics Tracker Service
 *
 * Provides a unified interface for tracking user events with Google Analytics 4.
 * On production (GitHub Pages with VITE_GOOGLE_ANALYTICS_ID), sends real events to GA4.
 * On localhost dev (no VITE_GOOGLE_ANALYTICS_ID), logs events to console instead.
 *
 * Events tracked:
 * - page_view: User navigates to a tab (e.g., "DashboardTab", "ComparisonsTab")
 * - calculator_run: User executes a financial calculator with calculator type
 *
 * Usage:
 *   import { trackPageView, trackCalculatorUsage } from '@/utils/analyticsTracker';
 *   trackPageView('DashboardTab');
 *   trackCalculatorUsage('compound_interest', 15234.50);
 */

/**
 * Check if GA is initialized (Measurement ID is available)
 */
export const isGAInitialized = (): boolean => {
  return !!(import.meta.env.VITE_GOOGLE_ANALYTICS_ID && window.gtag);
};

/**
 * Track a page view event when user navigates to a tab
 * @param pageName - The name of the tab/page (e.g., "DashboardTab", "ComparisonsTab")
 * @param properties - Optional additional properties to track
 */
export const trackPageView = (pageName: string, properties?: Record<string, unknown>): void => {
  if (isGAInitialized()) {
    window.gtag?.('event', 'page_view', {
      page_title: pageName,
      page_path: `/${pageName.toLowerCase()}`,
      ...properties,
    });
  } else {
    // Fallback: log to console on localhost for debugging
    console.log('[GA (disabled on localhost)] page_view:', { pageName, ...properties });
  }
};

/**
 * Track a generic event
 * @param eventName - The name of the event (e.g., "calculator_run", "comparison_saved")
 * @param eventData - Optional event properties
 */
export const trackEvent = (eventName: string, eventData?: Record<string, unknown>): void => {
  if (isGAInitialized()) {
    window.gtag?.('event', eventName, eventData || {});
  } else {
    console.log(`[GA (disabled on localhost)] ${eventName}:`, eventData);
  }
};

/**
 * Track calculator usage
 * @param calculatorName - Type of calculator: "compound_interest", "tax_equivalence", "inflation"
 * @param resultValue - Optional: the calculated result to track
 */
export const trackCalculatorUsage = (
  calculatorName: 'compound_interest' | 'tax_equivalence' | 'inflation',
  resultValue?: number
): void => {
  trackEvent('calculator_run', {
    calculator_type: calculatorName,
    result_value: resultValue,
  });
};

/**
 * Track a comparison save event
 * @param assetCount - Number of assets in the comparison
 */
export const trackComparisonSaved = (assetCount: number): void => {
  trackEvent('comparison_saved', {
    asset_count: assetCount,
  });
};

/**
 * Track AI Advisor usage
 * @param messageType - Type of message: "text" or "image"
 */
export const trackAIAdvisorUsage = (messageType: 'text' | 'image' = 'text'): void => {
  trackEvent('ai_advisor_query', {
    message_type: messageType,
  });
};
