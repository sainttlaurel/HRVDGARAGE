# Analytics Integration Setup Guide

This document provides a comprehensive guide for the Google Analytics and Vercel Analytics integration implemented in the Sacred Garage project.

## Overview

The project now includes:
- **Google Analytics 4 (GA4)** - Comprehensive user behavior tracking
- **Vercel Analytics** - Web Vitals and performance monitoring
- **Analytics Consent Banner** - GDPR-compliant user consent management
- **Custom Event Tracking** - Specific business events (vehicle views, part purchases, inquiries)

## Setup Instructions

### 1. Google Analytics Setup

#### Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Create" to set up a new property
4. Fill in the property details:
   - Property name: "Sacred Garage"
   - Reporting timezone: Select your timezone
   - Currency: PHP (Philippine Peso)
5. Click "Create"

#### Step 2: Get Your Tracking ID

1. In Google Analytics, go to **Admin** → **Property Settings**
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Add it to your `.env.local` file:

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

#### Step 3: Configure Data Streams

1. Go to **Admin** → **Data Streams**
2. Click on your web stream
3. Note the Stream ID and Measurement ID
4. Enable "Enhanced measurement" for automatic tracking of:
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

### 2. Vercel Analytics Setup

Vercel Analytics is automatically enabled when you deploy to Vercel. No additional configuration is needed.

#### To Enable Locally:

1. The `@vercel/analytics/react` package is already installed
2. The `<Analytics />` component is integrated in `App.tsx`
3. Web Vitals are automatically tracked

### 3. Environment Variables

Update your `.env.local` file with:

```env
# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

The `.env.example` file has been updated with this template.

## Tracked Events

### Page Views
- Automatically tracked when users navigate
- Includes page path and title

### Vehicle Events
- **vehicle_view**: When a user clicks on a vehicle card
- **view_item**: When a user views vehicle details
  - Includes: vehicle_id, brand, model

### Part Events
- **view_item**: When a user views a part
  - Includes: part_id, name, brand, price
- **purchase**: When a user submits a part order
  - Includes: part_id, name, price, quantity, total value

### Inquiry Events
- **generate_lead**: When a user submits the contact form
  - Includes: inquiry_type, source

### Gallery Events
- **gallery_view**: When a user clicks on a gallery image
  - Includes: image_index, total_images

### Admin Events
- **admin_login**: When an admin logs into the portal
  - Includes: admin_id, timestamp

### Engagement Events
- **engagement**: General user engagement tracking
  - Includes: engagement_type, section

### Error Events
- **error**: When errors occur in the application
  - Includes: error_type, error_message

### Web Vitals
- **web_vital**: Performance metrics
  - Includes: metric_name, metric_value, metric_rating

## Analytics Consent Banner

The application includes a GDPR-compliant consent banner that:

1. **Appears after 2 seconds** on first visit
2. **Stores user preference** in localStorage
3. **Only initializes GA4** if user accepts
4. **Respects user choice** on subsequent visits

### User Options:
- **Accept**: Enables Google Analytics tracking
- **Reject**: Disables analytics (only Vercel Analytics runs)

### Consent Storage:
- Key: `analytics_consent`
- Values: `'accepted'` or `'rejected'`

## Analytics Utilities

All analytics functions are in `src/lib/analytics.ts`:

### Core Functions

```typescript
// Initialize Google Analytics
initializeGoogleAnalytics()

// Track page views
trackPageView(path: string, title: string)

// Track custom events
trackEvent(eventName: string, eventData?: Record<string, any>)

// Vehicle tracking
trackVehicleView(vehicleId, brand, model, year)
trackVehicleDetailsView(vehicleId, brand, model)

// Part tracking
trackPartView(partId, partName, partBrand, partPrice)
trackPartPurchase(partId, partName, partPrice, quantity)

// Inquiry tracking
trackInquirySubmission(inquiryType?, source?)

// Gallery tracking
trackGalleryInteraction(imageIndex, totalImages)

// Admin tracking
trackAdminLogin(adminId)

// Engagement tracking
trackEngagement(engagementType, section)

// Conversion tracking
trackConversion(conversionType, value?)

// Error tracking
trackError(errorType, errorMessage)

// Time tracking
trackTimeOnPage(page, timeInSeconds)

// User properties
setUserProperties(userId, properties?)

// Web Vitals
trackWebVital(metric)
```

## Integration Points

### Components Modified

1. **App.tsx**
   - Initializes analytics on app load
   - Checks consent preference
   - Renders consent banner

2. **VehicleCard.tsx**
   - Tracks vehicle details view when "View Details" is clicked
   - Requires `vehicleId` prop

3. **PartCard.tsx**
   - Tracks part view when "Inquire" is clicked
   - Requires `partId` prop

4. **Contact.tsx**
   - Tracks inquiry submission
   - Fires on successful form submission

5. **PartsPurchaseModal.tsx**
   - Tracks part purchase
   - Fires on successful order submission

6. **GalleryWall.tsx**
   - Tracks gallery image views
   - Fires when user clicks on an image

7. **AdminPortal.tsx**
   - Tracks admin login
   - Fires on successful authentication

## Testing Analytics

### In Development

1. **Enable Google Analytics Debug Mode:**
   ```javascript
   // In browser console
   window.gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true });
   ```

2. **Check Real-Time Reports:**
   - Go to Google Analytics → Real-time
   - Perform actions on the site
   - Events should appear within seconds

3. **Use Google Analytics Debugger Extension:**
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcicakijjlmejbhbff)
   - View detailed event information in browser console

### Verifying Events

1. **Vehicle View Event:**
   - Click on a vehicle card
   - Check GA4 Real-time → Events

2. **Part Purchase Event:**
   - Fill out part purchase form
   - Submit order
   - Check GA4 Real-time → Events

3. **Inquiry Event:**
   - Fill out contact form
   - Submit inquiry
   - Check GA4 Real-time → Events

4. **Gallery Event:**
   - Click on gallery images
   - Check GA4 Real-time → Events

## Privacy & Compliance

### GDPR Compliance

- ✅ Consent banner shown before tracking
- ✅ User can opt-out of analytics
- ✅ Preference stored locally
- ✅ IP anonymization enabled
- ✅ No personal data collected without consent

### Data Collection

The analytics system collects:
- **Allowed:** Page views, events, user interactions, device info
- **Not Collected:** Personal identifiable information (PII)
- **Anonymized:** IP addresses

### Privacy Policy

Add the following to your privacy policy:

> We use Google Analytics to understand how visitors use our site. This helps us improve your experience. We respect your privacy and only collect anonymized data. You can opt-out of analytics tracking through our consent banner.

## Troubleshooting

### Events Not Appearing in GA4

1. **Check Tracking ID:**
   - Verify `VITE_GA_TRACKING_ID` is set correctly
   - Format should be `G-XXXXXXXXXX`

2. **Check Consent:**
   - Open browser DevTools → Application → Local Storage
   - Look for `analytics_consent` key
   - Should be set to `'accepted'`

3. **Check Network:**
   - Open DevTools → Network tab
   - Look for requests to `google-analytics.com`
   - Should see successful requests (200 status)

4. **Enable Debug Mode:**
   - Add `debug_mode: true` to GA4 config
   - Check browser console for GA4 messages

### Consent Banner Not Showing

1. **Check localStorage:**
   - Clear `analytics_consent` from localStorage
   - Refresh page
   - Banner should appear after 2 seconds

2. **Check Component:**
   - Verify `AnalyticsConsent` is imported in App.tsx
   - Verify it's rendered in the JSX

### Build Errors

If you encounter TypeScript errors:

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Rebuild the project:
   ```bash
   npm run build
   ```

## Performance Impact

- **Google Analytics Script:** ~15KB (gzipped)
- **Vercel Analytics:** Minimal overhead
- **Load Time Impact:** <100ms
- **No blocking:** Analytics loads asynchronously

## Next Steps

1. **Set Up GA4 Goals:**
   - Go to Admin → Conversions
   - Create goals for key events (purchases, inquiries)

2. **Create Custom Reports:**
   - Track vehicle views by brand
   - Track part purchases by category
   - Monitor inquiry sources

3. **Set Up Alerts:**
   - Alert on unusual traffic patterns
   - Alert on conversion spikes

4. **Monitor Web Vitals:**
   - Check Vercel Analytics dashboard
   - Monitor Core Web Vitals
   - Optimize for better performance

## Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [GDPR Compliance Guide](https://support.google.com/analytics/answer/9019185)
- [Web Vitals Guide](https://web.dev/vitals/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Analytics documentation
3. Check browser console for errors
4. Verify environment variables are set correctly
