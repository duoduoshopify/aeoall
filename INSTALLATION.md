# Installation Guide

Complete guide to installing AEOall Pro on your Shopify store.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Method 1: Shopify CLI (Recommended)](#method-1-shopify-cli-recommended)
- [Method 2: Manual Upload](#method-2-manual-upload)
- [Method 3: GitHub Integration](#method-3-github-integration)
- [Post-Installation Setup](#post-installation-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing, ensure you have:

- ✅ A Shopify store (any plan except Starter)
- ✅ Admin access to your store
- ✅ Basic understanding of Shopify themes

**Recommended:**
- Node.js 16+ (for CLI installation)
- Git (for version control)
- Code editor (VS Code recommended)

---

## Method 1: Shopify CLI (Recommended)

### Step 1: Install Shopify CLI

```bash
# Using npm
npm install -g @shopify/cli @shopify/theme

# Using Homebrew (Mac)
brew tap shopify/shopify
brew install shopify-cli

# Verify installation
shopify version
```

### Step 2: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/duoduoshopify/aeoall.git

# Navigate to theme directory
cd aeoall
```

### Step 3: Connect to Your Store

```bash
# Login to Shopify
shopify auth login

# Connect to your store
shopify theme dev --store your-store.myshopify.com
```

You'll be prompted to:
1. Log in to your Shopify Partner account
2. Select your store
3. Authorize the connection

### Step 4: Preview the Theme

```bash
# Start development server
shopify theme dev
```

This will:
- Start a local server at `http://127.0.0.1:9292`
- Watch for file changes
- Hot reload on save

### Step 5: Push to Your Store

```bash
# Push theme to your store
shopify theme push

# Or push and publish immediately
shopify theme push --publish
```

**Options:**
- `--unpublished` - Upload as unpublished theme
- `--development` - Upload to development theme slot
- `--live` - Push to currently published theme (use with caution!)

---

## Method 2: Manual Upload

### Step 1: Download the Theme

1. Go to [Releases](https://github.com/duoduoshopify/aeoall/releases)
2. Download the latest `aeoall-v1.3.0.zip`
3. Save to your computer

### Step 2: Upload to Shopify

1. Log in to your Shopify admin
2. Navigate to **Online Store > Themes**
3. Click **Add theme** button
4. Select **Upload zip file**
5. Choose the downloaded `aeoall-v1.3.0.zip`
6. Wait for upload to complete

### Step 3: Preview the Theme

1. Find "AEOall Pro" in your Theme Library
2. Click **Actions > Preview**
3. Review the theme on your store
4. Test on mobile devices

### Step 4: Publish the Theme

When ready:
1. Click **Actions > Publish**
2. Confirm the action
3. Your theme is now live! 🚀

---

## Method 3: GitHub Integration

### Step 1: Fork the Repository

1. Go to [github.com/duoduoshopify/aeoall](https://github.com/duoduoshopify/aeoall)
2. Click **Fork** button
3. Select your account

### Step 2: Connect GitHub to Shopify

1. In Shopify admin, go to **Online Store > Themes**
2. Click **Add theme > Connect from GitHub**
3. Authorize GitHub access
4. Select your forked repository
5. Choose the branch (usually `main`)

### Step 3: Auto-Deploy

Now, every time you push to GitHub:
- Shopify automatically updates your theme
- Changes appear in your development theme
- You can preview before publishing

---

## Post-Installation Setup

### 1. Configure Theme Settings

Navigate to **Theme Settings** and configure:

#### Colors
- **Text Color**: #121212 (or your brand color)
- **Background**: #FFFFFF
- **Accent Color**: #2563EB (or your brand color)
- **Button Color**: #1D1D1F

#### Typography
- **Heading Font**: Choose from Google Fonts
- **Body Font**: Choose from Google Fonts
- **Font Scale**: 100% (adjust as needed)

#### Layout
- **Page Width**: 1400px (recommended)
- **Grid Gutter**: 2rem

#### Marketing
- **Exit Intent Popup**: Enable/Disable
- **Exit Intent Discount Code**: SAVE50 (or your code)

#### Social Media
- Add your social media links

### 2. Create Navigation Menus

#### Main Menu
1. Go to **Navigation > Main menu**
2. Add links:
   - Home
   - Shop (link to /collections/all)
   - About (link to /pages/about)
   - Blog (link to /blogs/news)
   - Contact (link to /pages/contact)

#### Footer Menu
1. Go to **Navigation > Footer menu**
2. Add links:
   - Search
   - Privacy Policy
   - Terms of Service
   - Refund Policy

### 3. Add Essential Pages

Create these pages in **Pages**:

#### About Us
- Title: About Us
- Content: Your brand story

#### Contact
- Title: Contact
- Template: page.contact (if available)
- Content: Contact information

#### FAQ
- Title: FAQ
- Content: Use accordion blocks for Q&A

### 4. Set Up Blog

1. Go to **Blog posts**
2. Create your first post
3. Add featured image
4. Publish

### 5. Configure Products

For each product:
- ✅ Add high-quality images (1200x1200px minimum)
- ✅ Write detailed descriptions
- ✅ Set up variants (if applicable)
- ✅ Add inventory tracking
- ✅ Set pricing
- ✅ Add to collections

### 6. Customize Homepage

1. Go to **Online Store > Themes**
2. Click **Customize** on AEOall Pro
3. Edit sections:
   - **Hero Banner**: Add image and text
   - **Featured Collection**: Select collection
   - **Image with Text**: Add content
   - **Newsletter**: Configure signup

### 7. Test Everything

Before going live, test:
- ✅ Add to cart functionality
- ✅ Checkout process
- ✅ Search functionality
- ✅ Mobile responsiveness
- ✅ All links work
- ✅ Forms submit correctly
- ✅ Blog displays properly

---

## Troubleshooting

### Theme Won't Upload

**Problem**: Upload fails or times out

**Solutions**:
1. Check file size (should be under 50MB)
2. Ensure zip file is properly formatted
3. Try uploading during off-peak hours
4. Contact Shopify Support if issue persists

### Images Not Displaying

**Problem**: Placeholder images or broken images

**Solutions**:
1. Clear browser cache
2. Check image URLs in theme settings
3. Re-upload images
4. Ensure images are in correct format (JPG, PNG, WebP)

### Sections Not Appearing

**Problem**: Sections missing in theme editor

**Solutions**:
1. Refresh the page
2. Check if sections are in correct directory
3. Validate JSON syntax in section files
4. Re-upload theme

### JavaScript Not Working

**Problem**: Interactive features not functioning

**Solutions**:
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Clear browser cache
4. Try different browser
5. Check for conflicting apps

### Slow Performance

**Problem**: Theme loads slowly

**Solutions**:
1. Optimize images (use Shopify's image optimization)
2. Reduce number of products on homepage
3. Disable unused apps
4. Enable Shopify CDN
5. Check with Shopify's speed report

### Translation Issues

**Problem**: Text not translating

**Solutions**:
1. Check locale files exist
2. Verify translation keys match
3. Clear theme cache
4. Re-save language settings

---

## Getting Help

### Documentation
- [User Guide](USER_GUIDE.md)
- [Developer Docs](DEVELOPER.md)
- [FAQ](FAQ.md)

### Support Channels
- [GitHub Issues](https://github.com/duoduoshopify/aeoall/issues)
- [Discussions](https://github.com/duoduoshopify/aeoall/discussions)
- Email: support@example.com

### Professional Services
Need help with installation or customization?
- Custom development
- Theme setup service
- Priority support

Contact: [your-email@example.com]

---

## Next Steps

After installation:
1. ✅ Complete [Post-Installation Setup](#post-installation-setup)
2. ✅ Read the [User Guide](USER_GUIDE.md)
3. ✅ Customize your theme
4. ✅ Add products and content
5. ✅ Test thoroughly
6. ✅ Launch your store! 🚀

---

**Need more help?** Check out our [complete documentation](https://github.com/duoduoshopify/aeoall/wiki) or [ask a question](https://github.com/duoduoshopify/aeoall/discussions).
