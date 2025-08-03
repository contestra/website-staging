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

The JavaScript automatically detects the environment and adjusts behavior:

```javascript
const isGitHubPages = window.location.hostname.includes('github.io');
const isProduction = window.location.hostname === 'contestra.com' || window.location.hostname === 'www.contestra.com';
```

### Environment Detection:

1. **GitHub Pages** (`*.github.io`): 
   - Shows demo alerts
   - No API calls made

2. **Production** (`contestra.com`):
   - Calls API at `https://api.contestra.com/create-checkout-session.php`
   - Full Stripe checkout functionality

3. **Local Development** (any other domain):
   - Calls local PHP at `/create-checkout-session.php`
   - For testing with XAMPP/MAMP/etc

## Production Architecture

The production setup uses a distributed architecture:

- **Main Website**: Hosted on Cloudflare Pages (contestra.com)
- **API Server**: Digital Ocean Droplet (api.contestra.com) - ✅ DEPLOYED
- **Payment Processing**: PHP backend on the API server - ✅ WORKING

## Deployment Checklist

### Cloudflare Pages Setup (contestra.com)

1. ✅ Deploy all static files (HTML, CSS, JS, images)
2. ✅ No PHP files needed here
3. ✅ JavaScript will automatically detect production domain

### Digital Ocean Droplet Setup (api.contestra.com) - ✅ COMPLETED

1. ✅ Configure subdomain `api.contestra.com` to point to your droplet
2. ✅ Install PHP 8.4 and required extensions:
   ```bash
   sudo apt update
   sudo apt install php8.4 php8.4-curl php8.4-json php8.4-fpm
   ```
3. ✅ Files uploaded to `/var/www/html/`:
   - `create-checkout-session.php`
   - `config.php` (with your Stripe secret key)
   - `stripe-php/` library folder
4. ✅ Configure NGINX:
   - Server block for api.contestra.com configured
   - PHP-FPM socket: `/var/run/php/php8.4-fpm.sock`
   - Root directory: `/var/www/html`
5. ✅ Install SSL certificate:
   ```bash
   sudo certbot --nginx -d api.contestra.com
   ```
6. ✅ Set proper permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/html/stripe-php
   sudo chmod -R 755 /var/www/html/stripe-php
   sudo chmod 640 /var/www/html/config.php
   ```

## Testing

- **On GitHub Pages**: Click Subscribe buttons to see demo alerts
- **On Local Server**: Use XAMPP/WAMP/MAMP to test PHP integration
- **On Production**: Full Stripe checkout with real/test payments

## Security Notes

- `config.php` - Contains secret key, never commit to Git
- `stripe-php/` - Library folder, excluded from Git
- Price IDs are visible in JavaScript (this is normal and safe)
- Secret key is only used server-side