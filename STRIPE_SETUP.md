# Stripe Integration Setup Guide

This guide will help you complete the Stripe integration for your Contestra website.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. PHP support on your web server
3. SSL certificate (https://) on your domain

## Setup Steps

### 1. Install Stripe PHP Library

**IMPORTANT: The stripe-php library is NOT included in this repository for security reasons.**

Download the Stripe PHP SDK from: https://github.com/stripe/stripe-php/releases

1. Download the latest release ZIP file
2. Extract the ZIP file
3. Upload ONLY the `stripe-php` folder to your website root directory
4. The `stripe-php` folder is already in `.gitignore` - DO NOT commit it to Git

Your directory structure should look like:
```
/
├── stripe-php/              # This folder is gitignored
│   ├── init.php
│   ├── lib/
│   └── ...
├── create-checkout-session.php
├── config.php               # This file is also gitignored
├── pricing.html
└── success.html
```

### 2. Configure Stripe Keys

1. Log in to your Stripe Dashboard
2. Navigate to Developers > API keys
3. Copy your keys (use test keys for testing):
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3. Configure Your Secret Key

1. The `config.php` file already contains your live secret key
2. This file is in `.gitignore` and should NEVER be committed to Git
3. Update `create-checkout-session.php` to ensure your domain is correct:
   - Replace `https://contestra.com` with your actual domain in:
     - CORS header (line 6)
     - success_url (line 43)
     - cancel_url (line 44)

### 4. Create Stripe Products and Prices

In your Stripe Dashboard:

1. Go to Products > Add product
2. Create three products:
   - **Essential Plan** ($4,990/month or $47,904/year)
   - **Business Plan** ($7,990/month or $76,704/year)
   - **Enterprise Plan** ($19,990/month or $191,904/year)

3. For each product, create two prices:
   - Monthly recurring price
   - Yearly recurring price (with the discounted amount)

4. Copy each price ID (looks like `price_1234567890abcdef`)

### 5. Update the Pricing Page

Edit `pricing.html` and replace the TODO items:

1. Replace `pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your publishable key
2. Replace the price IDs in the `stripePrices` object with your actual price IDs:
   ```javascript
   const stripePrices = {
       essential: {
           monthly: 'price_YOUR_ESSENTIAL_MONTHLY_ID',
           annual: 'price_YOUR_ESSENTIAL_ANNUAL_ID'
       },
       business: {
           monthly: 'price_YOUR_BUSINESS_MONTHLY_ID',
           annual: 'price_YOUR_BUSINESS_ANNUAL_ID'
       },
       enterprise: {
           monthly: 'price_YOUR_ENTERPRISE_MONTHLY_ID',
           annual: 'price_YOUR_ENTERPRISE_ANNUAL_ID'
       }
   };
   ```

### 6. Test the Integration

1. Use Stripe's test card: `4242 4242 4242 4242`
2. Use any future expiration date and any 3-digit CVC
3. Click a "Subscribe" button on your pricing page
4. Complete the checkout process
5. Check your Stripe Dashboard for the test subscription

### 7. Go Live

When ready to accept real payments:
1. Replace test keys with live keys in both files
2. Update your Stripe products with live prices
3. Test with a real card (you can refund yourself)

## Security Notes

- **Never commit API keys to Git** - use environment variables in production
- Keep your secret key secure - never expose it in client-side code
- Consider adding webhook handling for subscription events
- Enable HTTPS on your entire site

## Troubleshooting

**CORS errors**: Make sure the domain in `create-checkout-session.php` matches your site

**404 errors**: Ensure `create-checkout-session.php` is accessible at the correct path

**Stripe errors**: Check the browser console and Stripe Dashboard logs

## Next Steps

Consider implementing:
- Customer portal for subscription management
- Webhook handling for subscription updates
- Email notifications for successful subscriptions
- Usage tracking for credit-based features