# AEOall Theme Documentation

## Table of Contents
1. [Theme Settings](#theme-settings)
2. [Page Sections](#page-sections)
3. [Product Page Blocks](#product-page-blocks)
4. [Marketing Features](#marketing-features)
5. [Custom Development](#custom-development)
6. [Technical Documentation](./TECHNICAL.md)

---

## Theme Settings

### Color System
Navigate to: Shopify Admin → Online Store → Themes → Customize → Theme Settings → Colors

| Setting | Description | Default |
|---------|-------------|---------|
| Body Text | Main content color | #1d1d1f |
| Page Background | Overall background | #ffffff |
| Button Background | Primary CTA color | #000000 |
| Button Text | Button text color | #ffffff |
| Accent Color | Selection/links | #2563eb |
| Urgency Color | Low stock badges | #db2777 |
| Success Color | Savings/discounts | #059669 |

### Typography
- **Header Font** - Choose from Shopify font library
- **Header Scale** - 80% to 150% adjustment
- **Body Font** - Choose from Shopify font library

### Marketing Settings
- Enable/disable exit intent popup
- Popup discount code
- Social media links (Facebook, Instagram)

---

## Page Sections

### Header (`sections/header.liquid`)
- Announcement bar with customizable text
- Logo upload
- Main navigation menu
- Predictive search
- Cart icon with item count
- Mobile navigation drawer

### Footer (`sections/footer.liquid`)
- Multi-column layout
- Social media icons
- Payment icons

### Featured Collection (`sections/featured-collection.liquid`)
- Display products from any collection
- Responsive grid (2-col mobile, 4-col desktop)
- "View All" button option
- Configurable title, collection, product limit, spacing

### Product Page (`sections/main-product.liquid`)
- Product media gallery
- Modular block system
- Sticky info on mobile

---

## Product Page Blocks

### Available Blocks

| Block | Description |
|-------|-------------|
| `product-title` | Product title |
| `product-price` | Price display with sale support |
| `variant-picker` | Variant/option selector |
| `buy-buttons` | Add to cart button |
| `product-description` | Product description |
| `product-rating` | Customer review rating |
| `product-vendor` | Vendor/brand name |
| `product-sku` | SKU number |
| `inventory-status` | Stock status indicator |
| `comparison-table` | Product comparison table |
| `product-share` | Social sharing buttons |
| `button` | Custom button |
| `heading` | Custom heading |
| `text` | Custom text block |
| `spacer` | Spacing element |

### Customizing Layout
Edit `templates/product.json` and rearrange the `block_order` array to change block order.

---

## Marketing Features

### Exit Intent Popup
- Detects when user mouse leaves browser
- Shows discount offer
- Configurable discount code

### Social Sharing
- Facebook
- Pinterest
- Twitter

---

## Custom Development

### Adding Custom CSS
Add CSS file to `assets/` directory, then include in section:

```liquid
{{ 'your-custom.css' | asset_url | stylesheet_tag }}
```

### Adding Custom JavaScript
Add JS file to `assets/` directory:

```liquid
{{ 'your-custom.js' | asset_url | script_tag }}
```

### Creating New Sections
1. Create `.liquid` file in `sections/`
2. Add `{% schema %}` with configuration options
3. Use in Theme Editor

### Creating New Blocks
1. Create `.liquid` file in `blocks/`
2. Reference in product template

---

## File Structure

```
AEOall/
├── assets/           # CSS, JavaScript, images
├── blocks/           # Reusable theme blocks
├── config/           # Theme settings
├── layout/           # Base templates
├── locales/          # Translation files
├── sections/         # Theme sections
├── snippets/         # Reusable code snippets
├── templates/        # Page templates
├── README.md         # English overview
└── docs/
    ├── FEATURES.md   # Chinese documentation
    └── README.md     # English documentation
```

---

## Quick Commands

```bash
# Login
shopify auth login

# Pull theme
shopify theme pull --store your-store.myshopify.com

# Development
shopify theme dev --store your-store.myshopify.com

# Push changes
shopify theme push --store your-store.myshopify.com
```

---

## Changelog

### v1.2.0
- Added modular product page block system
- Added predictive search
- Improved mobile experience
- Added exit intent popup

### v1.1.0
- Added comparison table block
- Added inventory status display
- Optimized product gallery

### v1.0.0
- Initial release
