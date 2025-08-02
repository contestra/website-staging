# Development Notes

## Stripe Integration - Dual Mode Setup

The pricing page has been configured to work in two modes:

### 1. Development Mode (GitHub Pages)
- Detects when running on `github.io` domains
- Shows demo alerts when Subscribe buttons are clicked
- Displays the plan type and price ID that would be used
- No actual Stripe checkout occurs

### 2. Production Mode (Your Server)
- Uses the PHP backend (`create-checkout-session.php`)
- Full Stripe Checkout with promotion codes support
- Secure server-side session creation
- Real payment processing

## How It Works

The JavaScript checks the hostname:
```javascript
const isGitHubPages = window.location.hostname.includes('github.io');
```

- **On GitHub Pages**: Shows a demo alert
- **On Your Server**: Makes a request to `/create-checkout-session.php`

## Deployment Checklist

When moving to your production server:

1. ✅ PHP support is required
2. ✅ Upload `stripe-php/` library (download separately, not in Git)
3. ✅ Upload `config.php` with your Stripe secret key (not in Git)
4. ✅ Ensure `create-checkout-session.php` is accessible
5. ✅ Update CORS header in PHP file if needed
6. ✅ The JavaScript will automatically use production mode

## Testing

- **On GitHub Pages**: Click Subscribe buttons to see demo alerts
- **On Local Server**: Use XAMPP/WAMP/MAMP to test PHP integration
- **On Production**: Full Stripe checkout with real/test payments

## Security Notes

- `config.php` - Contains secret key, never commit to Git
- `stripe-php/` - Library folder, excluded from Git
- Price IDs are visible in JavaScript (this is normal and safe)
- Secret key is only used server-side