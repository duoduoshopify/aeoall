# AEOall Pro User Guide

Complete guide to using and customizing AEOall Pro.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Theme Customization](#theme-customization)
3. [Homepage Setup](#homepage-setup)
4. [Product Pages](#product-pages)
5. [Collections](#collections)
6. [Blog](#blog)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)

---

## Getting Started

### Accessing Theme Editor

1. Log in to Shopify admin
2. Go to **Online Store > Themes**
3. Click **Customize** on AEOall Pro
4. You'll see:
   - **Left Panel**: Sections and settings
   - **Center**: Live preview
   - **Top Bar**: Device preview, save, publish

### Understanding the Interface

#### Sections
Sections are large content blocks (header, hero, footer, etc.)
- Add sections with **+ Add section**
- Reorder by dragging
- Delete with trash icon

#### Blocks
Blocks are smaller content pieces within sections
- Add blocks with **+ Add block**
- Configure in right panel
- Each block has unique settings

---

## Theme Customization

### Theme Settings

Access via **Theme settings** at bottom of left panel.

#### Colors

**Text & Background**
- Text Color: #121212 (dark gray)
- Background: #FFFFFF (white)
- Secondary Background: #F5F5F5 (light gray)

**Accent & Buttons**
- Accent Color: #2563EB (blue) - for links, highlights
- Button Background: #1D1D1F (dark)
- Button Text: #FFFFFF (white)
- Border Color: #E5E7EB (light gray)

**Tips:**
- Use your brand colors
- Ensure good contrast (4.5:1 minimum)
- Test on mobile devices

#### Typography

**Heading Font**
- Choose bold, impactful fonts
- Examples: Montserrat, Poppins, Playfair Display
- Weight: 700 (Bold)

**Body Font**
- Choose readable fonts
- Examples: Inter, Open Sans, Roboto
- Weight: 400 (Regular)

**Font Scale**
- 80%: Smaller headings
- 100%: Default (recommended)
- 150%: Larger headings

#### Layout

**Page Width**
- 1200px: Narrow (blog-focused)
- 1400px: Standard (recommended)
- 1600px: Wide (product-focused)

**Spacing**
- Adjust section padding
- Mobile vs desktop spacing

#### Marketing

**Exit Intent Popup**
- Enable: ✓
- Discount Code: SAVE50
- Message: "Wait! Get 50% off your first order"

**Social Media**
- Facebook: https://facebook.com/yourpage
- Instagram: https://instagram.com/yourhandle
- Twitter: https://twitter.com/yourhandle

---

## Homepage Setup

### Recommended Structure

```
Announcement Bar (optional)
Header
Hero Banner
Featured Collection
Image with Text
Featured Collection 2
Newsletter
Footer
```

### Hero Banner

**Settings:**
- Image: 1920x800px (recommended)
- Heading: "Welcome to Our Store"
- Subheading: "Discover amazing products"
- Button Label: "Shop Now"
- Button Link: /collections/all
- Text Alignment: Center
- Overlay Opacity: 30%

**Tips:**
- Use high-quality images
- Keep text concise
- Strong call-to-action
- Test on mobile

### Featured Collection

**Settings:**
- Title: "Best Sellers"
- Collection: Select from dropdown
- Products to Show: 4-8
- Columns (Desktop): 4
- Columns (Mobile): 2
- Show Product Vendor: No
- Show Product Rating: Yes
- Image Ratio: Square

**Tips:**
- Feature your best products
- Update seasonally
- Use consistent product images

### Image with Text

**Settings:**
- Image: 800x800px
- Heading: "About Our Brand"
- Text: Your brand story
- Button Label: "Learn More"
- Button Link: /pages/about
- Layout: Image First / Text First
- Image Width: 50%

**Use Cases:**
- Brand story
- Value propositions
- Product features
- Testimonials

### Newsletter

**Settings:**
- Heading: "Stay Updated"
- Subheading: "Get exclusive offers and updates"
- Button Label: "Subscribe"
- Success Message: "Thanks for subscribing!"

**Tips:**
- Offer incentive (10% off)
- Keep form simple
- Clear privacy policy

---

## Product Pages

### Product Blocks

AEOall Pro includes 16 product blocks:

#### Essential Blocks

1. **Product Title**
   - Settings: None (auto-displays title)

2. **Product Price**
   - Show Compare Price: Yes
   - Show Unit Price: Yes
   - Show Tax Info: Yes

3. **Variant Picker**
   - Picker Style: Button / Dropdown / Swatch
   - Show Unavailable: Yes

4. **Quantity Selector**
   - Min Quantity: 1
   - Max Quantity: 10 (or inventory)

5. **Buy Buttons**
   - Show Dynamic Checkout: Yes (Apple Pay, etc.)
   - Show Gift Card Recipient: Yes (for gift cards)
   - Button Text: "Add to Cart"

#### Enhanced Blocks

6. **Product Rating**
   - Requires: Product reviews app
   - Shows: Star rating and count

7. **Inventory Status**
   - Low Stock Threshold: 10
   - Show "In Stock": Yes
   - Show "Low Stock": Yes
   - Show "Out of Stock": Yes
   - Messages: Customizable

8. **Comparison Table**
   - Spec 1: Material | Cotton
   - Spec 2: Weight | 200g
   - Spec 3: Dimensions | 10x10x5cm
   - Spec 4: Care | Machine wash
   - Spec 5: Origin | Made in USA

9. **Product Description**
   - Collapsible: Yes/No
   - Icon: Optional

10. **Product Share**
    - Platforms: Facebook, Twitter, Pinterest
    - Share Label: "Share this product"

#### Content Blocks

11. **Accordion**
    - Heading: "Shipping Information"
    - Content: Your shipping details
    - Open by Default: No

12. **Tabs**
    - Tab 1: Description
    - Tab 2: Specifications
    - Tab 3: Shipping & Returns

13. **Custom Liquid**
    - Use for: Custom code, apps, widgets

### Recommended Layout

1. Product Images (left, 50%)
2. Product Info (right, 50%)
   - Title
   - Rating
   - Price
   - Variant Picker
   - Inventory Status
   - Quantity
   - Buy Buttons
   - Description (tabs)
   - Comparison Table
   - Accordion (Shipping, Returns)
   - Share

---

## Collections

### Collection Banner

**Settings:**
- Show Collection Image: Yes
- Show Collection Description: Yes
- Show Product Count: Yes
- Text Alignment: Center

### Product Grid

**Settings:**
- Products per Page: 12, 24, 36
- Columns (Desktop): 3 or 4
- Columns (Mobile): 2
- Enable Filtering: Yes
- Enable Sorting: Yes
- Image Ratio: Square / Portrait
- Show Quick View: Yes
- Show Vendor: No
- Show Rating: Yes

### Filtering & Sorting

**Available Filters:**
- Price range
- Product type
- Vendor
- Tags
- Availability
- Custom metafields

**Sort Options:**
- Featured
- Best selling
- Alphabetically (A-Z, Z-A)
- Price (Low to High, High to Low)
- Date (New to Old, Old to New)

---

## Blog

### Blog Settings

**Layout:**
- Posts per Page: 12
- Layout: Grid / List
- Columns: 3
- Show Featured Image: Yes
- Show Author: Yes
- Show Date: Yes
- Show Excerpt: Yes
- Show Reading Time: Yes
- Show Tags: Yes

### Article Page

**Blocks:**
1. Featured Image
2. Title
3. Meta (Author, Date, Reading Time)
4. Content
5. Tags
6. Share Buttons
7. Comments (if enabled)
8. Related Articles

### Related Articles

**Settings:**
- Heading: "Related Articles"
- Articles to Show: 3
- Match by Tags: Yes
- Show Image: Yes
- Show Date: Yes
- Show Excerpt: Yes

---

## Advanced Features

### Countdown Timer

**Use Cases:**
- Flash sales
- Product launches
- Limited offers

**Settings:**
- Heading: "Sale Ends In:"
- End Date: 2026-12-31
- End Time: 23:59:59
- Show Days: Yes
- Show Hours: Yes
- Show Minutes: Yes
- Show Seconds: Yes

### Dialog/Modal

**Use Cases:**
- Size guides
- Shipping information
- Video popups
- Promotions

**Setup:**
1. Add Dialog block
2. Add Dialog Trigger block
3. Link trigger to dialog ID

### Exit Intent Popup

**Settings:**
- Enable: Yes
- Trigger: Mouse leaves viewport
- Delay: 5 seconds
- Discount Code: SAVE50
- Message: "Don't leave empty-handed!"
- Show Once Per Session: Yes

### Mobile Sticky CTA

Automatically shows on mobile:
- Product name
- Price
- Add to Cart button
- Appears when scrolling past fold

---

## Best Practices

### Images

**Product Images:**
- Size: 2048x2048px
- Format: JPG or WebP
- Background: White or transparent
- Multiple angles: Front, back, detail, lifestyle

**Banner Images:**
- Homepage Hero: 1920x800px
- Collection Banner: 1920x600px
- Blog Featured: 1200x630px

**Optimization:**
- Use Shopify's image optimization
- Compress before upload
- Use WebP when possible
- Add descriptive alt text

### SEO

**Product Pages:**
- Title: Product Name | Your Store
- Description: 150-160 characters
- URL: /products/product-name
- Alt Text: Descriptive image text

**Collection Pages:**
- Title: Collection Name | Your Store
- Description: What's in this collection
- URL: /collections/collection-name

**Blog Posts:**
- Title: Article Title | Blog Name
- Description: Article summary
- URL: /blogs/news/article-title
- Featured Image: 1200x630px

### Performance

**Tips:**
- Limit homepage products to 8-12
- Use lazy loading (automatic)
- Optimize images
- Minimize apps
- Use Shopify CDN

### Accessibility

**Checklist:**
- ✅ All images have alt text
- ✅ Sufficient color contrast
- ✅ Keyboard navigation works
- ✅ Forms have labels
- ✅ Headings in logical order
- ✅ Skip to content link

### Mobile Optimization

**Test on:**
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

**Check:**
- Touch targets (44x44px minimum)
- Text readability (16px minimum)
- Forms easy to fill
- Navigation accessible
- Images load properly

---

## Troubleshooting

### Common Issues

**Q: Changes not showing**
A: Clear cache, hard refresh (Ctrl+Shift+R)

**Q: Images not loading**
A: Check file size, format, and URL

**Q: Sections missing**
A: Refresh editor, check template

**Q: Slow loading**
A: Optimize images, reduce apps

**Q: Mobile issues**
A: Test on real device, check responsive settings
