# AEOall Shopify Theme

A modern, high-conversion Shopify 2.0 theme designed for e-commerce excellence.

![Shopify Version](https://img.shields.io/badge/Shopify-2.0-blue)
![Version](https://img.shields.io/badge/Version-1.2.1-green)

## Features

### Header & Navigation
- **Announcement Bar** - Customizable top banner with promotional text
- **Mega Menu** - Support for large dropdown menus with promo images
- **Predictive Search** - Real-time search suggestions
- **Mobile Responsive** - Full mobile navigation drawer

### Product Display
- **Product Gallery** - Multiple media support with responsive images
- **Theme Blocks** - Modular product page components:
  - Product Title, Price, Vendor, SKU
  - Variant Picker with options
  - Buy Buttons (Add to Cart)
  - Product Rating
  - Inventory Status
  - Product Description
  - Comparison Table
  - Share Buttons

### Collections
- **Featured Collection** - Display products from any collection
- **Collection Banner** - Customizable collection headers
- **Product Grid** - Responsive grid layout (2-col mobile, 4-col desktop)
- **View All Button** - Link to full collection

### Marketing & Conversion
- **Exit Intent Popup** - Capture leaving visitors with discount codes
- **Social Media Links** - Facebook, Instagram integration
- **Cart Drawer** - Slide-out shopping cart

### Customization

#### Color System
| Setting | Description | Default |
|---------|-------------|---------|
| `colors_text` | Body text color | #1d1d1f |
| `colors_background` | Page background | #ffffff |
| `colors_button` | Button background | #000000 |
| `colors_button_text` | Button text | #ffffff |
| `colors_accent` | Accent/selection color | #2563eb |
| `colors_urgency` | Urgency color (low stock) | #db2777 |
| `colors_success` | Success color (savings) | #059669 |

#### Typography
- Customizable header and body fonts
- Header scale adjustment (80%-150%)

## Quick Start

```bash
# Login to Shopify
shopify auth login

# Pull theme from store
shopify theme pull --store your-store.myshopify.com

# Development mode (live reload)
shopify theme dev --store your-store.myshopify.com

# Push changes to store
shopify theme push --store your-store.myshopify.com
```

## Theme Configuration

### settings_schema.json
Theme settings are defined in `config/settings_schema.json`:
- Color palette customization
- Typography settings
- Marketing features (exit intent, social links)

### Available Sections
- `header.liquid` - Header with navigation
- `footer.liquid` - Site footer
- `featured-collection.liquid` - Product collections
- `main-product.liquid` - Product detail page
- `main-collection-product-grid.liquid` - Collection pages
- `main-search.liquid` - Search results
- `cart-drawer.liquid` - Slide-out cart

### Available Blocks (Product Page)
- `product-title` - Product title
- `product-price` - Price display
- `variant-picker` - Variant/option selector
- `buy-buttons` - Add to cart button
- `product-description` - Product description
- `product-rating` - Customer reviews rating
- `product-vendor` - Vendor/brand
- `product-sku` - SKU number
- `inventory-status` - Stock status
- `comparison-table` - Product comparison
- `product-share` - Social sharing
- `button` - Custom button
- `heading` - Custom heading
- `text` - Custom text block
- `spacer` - Spacing element

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
└── README.md         # This file
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT License - Feel free to use and modify for your store.

## Support
- Documentation: https://synergify.myshopify.com/docs
- Support: https://synergify.myshopify.com/support
