# OpenGraph Social Sharing Setup

This document explains the OpenGraph implementation for Mana League social sharing.

## What's Included

### 1. Root Layout Metadata (`src/app/layout.tsx`)
- **OpenGraph tags**: title, description, images, URL, site name
- **Twitter Card tags**: for enhanced Twitter/X sharing
- **Dynamic OG image**: Automatically generated at `/opengraph-image`

### 2. Dynamic OpenGraph Image (`src/app/opengraph-image.tsx`)
- Generated at build time using Next.js `ImageResponse` API
- Size: 1200x630px (optimal for all social platforms)
- Branded with Mana League styling and colors
- Features:
  - Your Mana League logo prominently displayed
  - Gradient text effects
  - Dark themed background with pattern
  - "MANA LEAGUE" title and tagline
  - Purple drop shadow on logo for visual depth

### 3. Page-Specific Metadata
- **Standings page**: Custom metadata with specific description

## Environment Configuration

For OpenGraph to work properly in production, you need to set your site URL:

Create a `.env.local` file (or add to your existing one):

```bash
# Required for OpenGraph metadata
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# For local development
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing OpenGraph Tags

### 1. Local Testing
- Start your dev server: `npm run dev`
- Visit: `http://localhost:3000/opengraph-image` to see the generated image
- View page source to see the meta tags

### 2. Social Platform Testing Tools

Use these tools to test how your site appears when shared:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/
- **General**: https://www.opengraph.xyz/

### 3. What to Test
1. Paste your URL into the testing tool
2. Click "Fetch new information" or "Preview card"
3. Verify:
   - Title appears correctly
   - Description is displayed
   - Image loads and looks good
   - No errors in the meta tags

## Customization

### Changing the OpenGraph Image

Edit `src/app/opengraph-image.tsx` to customize:
- Colors and gradients
- Text content
- Layout and styling
- Logo size and positioning (currently 280x280px)
- Logo effects (drop shadow, etc.)

**To change the logo**: Replace `public/logo.png` with your new logo image.

### Adding Page-Specific Metadata

For Server Components (like `standings/page.tsx`):

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Page Title - Mana League",
  description: "Your page description here",
  openGraph: {
    title: "Your Page Title",
    description: "Your page description",
    url: '/your-page-url',
  },
};
```

For Client Components (`"use client"`):
- Metadata exports don't work in client components
- The root layout metadata will be used
- Consider using the Next.js `<Head>` component with `next/head`

## How OpenGraph Works

When you share a link on social media:

1. Platform scraper requests your URL
2. Reads the `<meta>` tags from your HTML
3. Extracts title, description, and image
4. Displays a rich preview card

### Meta Tags Added

```html
<!-- Basic metadata -->
<title>Mana League - Basketball League</title>
<meta name="description" content="Adult basketball league..." />

<!-- OpenGraph -->
<meta property="og:title" content="Mana League - Basketball League" />
<meta property="og:description" content="Adult basketball league..." />
<meta property="og:image" content="https://your-site.com/opengraph-image" />
<meta property="og:url" content="https://your-site.com/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Mana League" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Mana League - Basketball League" />
<meta name="twitter:description" content="Adult basketball league..." />
<meta name="twitter:image" content="https://your-site.com/opengraph-image" />
```

## Troubleshooting

### Image Not Showing
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
- Check that `/opengraph-image` route is accessible
- Social platforms cache images - use their debug tools to refresh

### Wrong Information Displayed
- Social platforms cache heavily (up to 7 days)
- Use platform-specific debugger tools to force a refresh
- For Facebook: use the Sharing Debugger and click "Scrape Again"

### Client Components
- Can't export `metadata` from client components
- Use root layout metadata as fallback
- Or implement dynamic meta tags with `next/head`

## Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

