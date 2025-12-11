# WordPress-like CMS Admin Panel

A comprehensive content management system built with Next.js, MongoDB, and React that provides WordPress-like functionality for managing pages, media, menus, and more.

## Features

### Core Functionality
- ✅ **Pages System**: Create, edit, and manage pages with custom slugs
- ✅ **Visual Page Builder**: Drag-and-drop block-based editor
- ✅ **Media Library**: Upload, manage, and organize media files
- ✅ **Menu Manager**: Create and manage navigation menus with drag-and-drop
- ✅ **Role-Based Access**: SuperAdmin, Admin, Editor, and Operator roles
- ✅ **Revision History**: Track and restore page versions
- ✅ **SEO Fields**: Meta titles, descriptions, canonical URLs, robots settings
- ✅ **Publish Scheduling**: Schedule pages for future publication
- ✅ **Export/Import**: Export and import page JSON
- ✅ **Responsive Preview**: Preview pages in desktop, tablet, and mobile views

### Content Blocks
- Rich Text Editor (WYSIWYG with HTML source toggle)
- Image (with alt text, caption, alignment, sizing)
- Gallery (grid layout with lightbox)
- Carousel/Slider (autoplay, transitions, arrows, dots, captions)
- Video (embeds with controls)
- Button (customizable styles and links)
- Form Builder (contact forms)
- HTML Block (raw HTML with sanitization)
- Spacer (customizable height)
- Columns (responsive column layouts)
- Hero Section (with background images, gradients, overlays)
- Background Image Section

### Theme & Styling
- Global theme settings (colors, fonts, spacing)
- Per-page theme overrides
- Color picker and gradient options
- Prebuilt theme templates

### API
- RESTful JSON API for all resources
- JWT-based authentication
- CRUD operations for pages, media, menus, users, themes

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

3. Create an admin user:
```bash
npm run create-admin
```

4. Seed initial data (optional):
```bash
npm run seed-initial
npm run seed-dummy
```

5. Start the development server:
```bash
npm run dev
```

### Accessing the Admin Panel

1. Navigate to `/login` and log in with your admin credentials
2. Access the dashboard at `/admin`
3. Create pages at `/admin/pages`
4. Manage media at `/admin/media`
5. Configure menus at `/admin/menus`

## Usage

### Creating a Page

1. Go to **Pages** → **New Page**
2. Enter a title and slug
3. Add blocks from the left sidebar
4. Configure block settings in the right panel
5. Set SEO metadata
6. Save and publish

### Using the Page Builder

- **Add Blocks**: Click any block type in the left sidebar
- **Select Block**: Click on a block to edit its settings
- **Move Blocks**: Use the up/down arrows or drag handles
- **Duplicate**: Click the copy icon
- **Delete**: Click the trash icon
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + S`: Save
  - `Ctrl/Cmd + Z`: Undo
  - `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo

### Media Library

- Upload multiple files at once
- Search and filter media
- Edit alt text and captions
- Delete unused media
- Use dummy images for testing

### Menu Manager

1. Go to **Menus**
2. Select a menu or create a new one
3. Add pages or custom links
4. Drag and drop to reorder
5. Configure menu item settings

## API Endpoints

### Pages
- `GET /api/pages` - List all pages
- `GET /api/pages/:id` - Get single page
- `GET /api/pages/slug/:slug` - Get page by slug (public)
- `POST /api/pages` - Create page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `GET /api/pages/:id/revisions` - Get revisions
- `POST /api/pages/:id/revisions/restore` - Restore revision

### Media
- `GET /api/media` - List all media
- `GET /api/media/:id` - Get single media
- `POST /api/media` - Upload media
- `PUT /api/media/:id` - Update media
- `DELETE /api/media/:id` - Delete media

### Menus
- `GET /api/menus` - List all menus
- `GET /api/menus/:id` - Get single menu
- `POST /api/menus` - Create menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user

### Themes
- `GET /api/themes` - List all themes
- `POST /api/themes` - Create theme

## Page JSON Structure

```json
{
  "title": "Page Title",
  "slug": "page-slug",
  "status": "published",
  "contentBlocks": [
    {
      "id": "block-1",
      "type": "richtext",
      "props": {
        "content": "<p>Content here</p>"
      },
      "order": 0
    }
  ],
  "meta": {
    "title": "SEO Title",
    "description": "SEO Description",
    "canonical": "https://example.com/page",
    "robots": {
      "index": true,
      "follow": true
    }
  },
  "settings": {
    "layout": "default",
    "theme": "default",
    "showHeader": true,
    "showFooter": true
  }
}
```

## Roles & Permissions

- **SuperAdmin**: Full access to everything
- **Admin**: Can manage pages, media, menus, and users
- **Editor**: Can create and edit pages, but cannot publish (unless granted permission)
- **Operator**: Limited create/edit access, cannot publish

## Frontend Rendering

Pages are rendered at `/pages/[slug]` using the `PageRenderer` component, which reads the page JSON and renders each block type accordingly.

## Development

### Project Structure

```
app/
  admin/          # Admin panel pages
  api/            # API routes
  pages/          # Frontend page routes
components/
  admin/          # Admin components
  PageRenderer.jsx # Frontend page renderer
models/           # MongoDB models
scripts/          # Utility scripts
```

### Adding New Block Types

1. Add block type to `BLOCK_TYPES` in `PageEditor.jsx`
2. Add default props in `getDefaultBlockProps()`
3. Add renderer in `BlockRenderer` component
4. Add settings panel in `BlockSettings` component
5. Add frontend renderer in `PageRenderer.jsx`

## License

MIT

