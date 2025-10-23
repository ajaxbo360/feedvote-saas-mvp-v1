# Feedvote Widget Feature Architecture

## Overview

The widget feature allows users to embed a feedback form on their website. It collects feedback and syncs it with Feedvote's Supabase backend, adding submissions to the "Open" column of a project's Kanban board.

## Tech Stack

- **Frontend**: Next.js (React) for the widget UI, bundled as a standalone script
- **Backend**: Supabase for database (storing feedback) and authentication (validating widget requests)
- **Styling**: Tailwind CSS for consistent branding (teal #2dd4bf, coral #ff6f61)

## File and Folder Structure

/feedvote
├── /app
│ ├── /api
│ │ └── /widget
│ │ ├── /submit.js # API route to handle feedback submissions
│ │ └── /config/[slug].js # API route to fetch widget config (e.g., project details)
├── /public
│ ├── /widget
│ │ └── feedvote-widget.js # Bundled widget script for embedding
├── /components
│ │ └── /widget
│ │ ├── WidgetButton.js # Floating button component
│ │ ├── WidgetForm.js # Feedback form component
│ │ └── WidgetWrapper.js # Wrapper for widget state and logic
├── /lib
│ │ └── supabaseClient.js # Supabase client for API routes
└── /styles
└── widget.css # Tailwind CSS for widget styling

## Component Breakdown

- **WidgetButton.js**: A floating button (teal, circular) that toggles the feedback form. Includes a hover effect (scale 1.05, glow).
- **WidgetForm.js**: A form with fields for feedback (title, description) and a submit button (coral). Submits to `/api/widget/submit`.
- **WidgetWrapper.js**: Manages widget state (e.g., form visibility) and fetches project config from `/api/widget/config/[slug]`.
- **feedvote-widget.js**: A standalone script that mounts the widget on the user's website. It loads the button and form components dynamically.
- **/api/widget/submit.js**: Handles feedback submissions, validates the project slug, and inserts feedback into Supabase (table: `feedback`, column: `status='Open'`).
- **/api/widget/config/[slug].js**: Returns project config (e.g., project ID, branding) based on the slug.

## State Management

- **Widget State**: Managed locally in `WidgetWrapper.js` using React's `useState` (e.g., form visibility, loading state).
- **Backend State**: Feedback is stored in Supabase's `feedback` table with columns: `id`, `project_id`, `title`, `description`, `status` (default: 'Open'), `votes` (default: 0).

## Service Connections

- **Widget to API**: The widget script (`feedvote-widget.js`) makes HTTP requests to `/api/widget/config/[slug]` (to fetch project config) and `/api/widget/submit` (to submit feedback).
- **API to Supabase**: API routes use the Supabase client (`supabaseClient.js`) to query the `projects` table (for config) and insert into the `feedback` table (for submissions).
- **Security**: API routes validate the project slug and use Supabase's Row Level Security (RLS) to ensure only authorized projects can receive feedback.

## Deployment

- The widget script (`feedvote-widget.js`) is bundled using Next.js's static export and hosted at `/public/widget/feedvote-widget.js`.
- Users embed it with a `<script src="https://feedvote.com/widget/feedvote-widget.js?slug=project-slug"></script>` tag.
