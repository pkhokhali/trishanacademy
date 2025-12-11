# CMS Quick Start Guide

## Why Pages Aren't Showing

Pages created in the CMS will only show on the frontend if:
1. ✅ **Page has a slug** (e.g., "about", "contact")
2. ✅ **Page status is "Published"** (not "Draft")
3. ✅ **Page has content blocks** added
4. ✅ **Page is accessed at `/pages/[slug]`** (not `/`)

## Step-by-Step: Create Your First Page

### 1. Create a New Page
- Go to `/admin/pages`
- Click "New Page"
- Enter a title (e.g., "About Us")
- In the right sidebar, set the slug (e.g., "about")
- Set status to "Published"

### 2. Add Content Blocks
- Click block types from the left sidebar:
  - **Rich Text**: For paragraphs, headings, lists
  - **Hero**: For hero sections with background images
  - **Image**: For single images
  - **Gallery**: For image grids
  - **Carousel**: For image sliders
  - **Button**: For call-to-action buttons

### 3. Configure Blocks
- Click on any block to edit its settings in the right sidebar
- For images: Click "Select Image" to choose from media library
- For rich text: Use the editor toolbar

### 4. Save and Publish
- Click "Save" button (or Ctrl/Cmd + S)
- Make sure status is set to "Published"
- Click "Preview" to see the page

### 5. View Your Page
- Published pages are available at: `/pages/[your-slug]`
- Example: If slug is "about", visit `/pages/about`

## Common Issues

### Page Not Showing?
1. **Check Status**: Must be "Published" (not "Draft")
2. **Check Slug**: Must be set and valid (lowercase, hyphens only)
3. **Check URL**: Visit `/pages/[slug]`, not just `/`
4. **Check Content**: Page needs at least one content block

### Content Blocks Not Showing?
1. **Check Block Props**: Make sure image URLs are set, text content is added
2. **Check Block Order**: Blocks are sorted by `order` field
3. **Check Browser Console**: Look for JavaScript errors

### Can't Save Page?
1. **Title Required**: Must have a title
2. **Slug Required**: Must have a slug (auto-formatted to lowercase)
3. **Slug Format**: Only lowercase letters, numbers, and hyphens
4. **Check Permissions**: Make sure you have edit permissions

## Example: Create an "About" Page

1. Go to `/admin/pages` → "New Page"
2. Title: "About Us"
3. Slug: "about" (auto-formatted)
4. Status: "Published"
5. Add blocks:
   - Hero block with title "About Us" and subtitle
   - Rich Text block with your about content
   - Image block with a photo
6. Click "Save"
7. Visit `/pages/about` to see it

## Homepage vs CMS Pages

- **Homepage** (`/`): Still uses the old system (`/api/settings`)
- **CMS Pages** (`/pages/[slug]`): Uses the new page builder system

To use CMS for homepage:
1. Create a page with slug "home"
2. Set it to "Published"
3. Modify `app/page.jsx` to check for CMS page first (optional)

## Testing Your Pages

1. Create a test page:
   - Slug: "test"
   - Status: "Published"
   - Add a Rich Text block with "Hello World"
2. Save the page
3. Visit `/pages/test`
4. You should see "Hello World"

## Need Help?

- Check browser console for errors
- Check network tab for API errors
- Verify MongoDB connection
- Make sure pages are saved with status "published"

