# Feedvote Widget MVP Development Plan

## Test-Driven Development (TDD) Plan

Before implementing any widget functionality, we will write tests to cover all critical aspects of the widget feature. The following outlines the test strategy and what each test will verify:

### 1. API Tests

- **Widget Config API (`/api/widget/config/[slug]`)**
  - Returns correct project config for a valid slug
  - Returns 404 for an invalid slug
  - Returns correct branding/colors in response
- **Widget Submit API (`/api/widget/submit`)**
  - Accepts valid feedback submissions and inserts into Supabase
  - Rejects submissions with missing/invalid fields
  - Returns error for invalid or missing project_id
  - Ensures feedback is created with status 'Open' and votes 0

### 2. Component/Integration Tests

- **WidgetButton**
  - Renders with correct styles and icon
  - Calls onClick handler when clicked
  - Toggles between open/close state
- **WidgetForm**
  - Renders input fields and submit button
  - Validates required fields (title, description)
  - Calls submit handler with correct data
  - Shows success message on successful submission
  - Shows error message on failed submission
- **WidgetWrapper**
  - Fetches project config on mount
  - Passes config to child components
  - Manages form visibility state
  - Integrates WidgetButton and WidgetForm correctly

### 3. End-to-End (E2E) Tests

- Embedding the widget on a test page displays the button
- Clicking the button opens the feedback form
- Submitting feedback with valid data creates a new feedback entry in Supabase
- Submitting feedback with invalid data shows validation errors
- Feedback submitted via the widget appears in the "Open" column of the Kanban board
- Session/user tracking: feedback is associated with sessionKey or user if logged in

### 4. Analytics/Event Tracking Tests

- Widget fires analytics events for load, open, close, submit, file upload, and errors.
- Events contain correct metadata (project, sessionKey, user, etc.).
- Opt-in/out logic works as expected.

### 5. Customization Tests

- Widget renders in all supported positions.
- Custom colors, text, and fields are applied from config.
- Localization works if enabled.

### 6. Advanced Modal Tests

- Modal is accessible (ARIA, keyboard, focus trap).
- File upload works (valid/invalid, progress, error).
- Inline validation and error messages display correctly.
- Modal is responsive on all screen sizes.
- Modal content is customizable.

---

## Task List

Each task is designed to be small, testable, and focused on one concern. Complete one task at a time, test, and commit before proceeding.

### Task 1: Set Up Supabase Table for Feedback

- **Start**: No `feedback` table exists in Supabase.
- **End**: `feedback` table is created with necessary columns.
- **Steps**:
  1. In Supabase dashboard, create a new table named `feedback`.
  2. Add columns: `id` (uuid, primary key), `project_id` (uuid, foreign key to `projects(id)`), `title` (text), `description` (text), `status` (text, default 'Open'), `votes` (integer, default 0), `created_at` (timestamp, default now()).
  3. Enable Row Level Security (RLS) with a policy: Allow inserts if `project_id` matches a valid project.
- **Test**: Verify the table exists and you can insert a sample row via Supabase dashboard.

### Task 2: Create API Route to Fetch Widget Config (`/app/api/widget/config/[slug].js`)

- **Start**: No API route for widget config.
- **End**: API route returns project config based on slug.
- **Steps**:
  1. Create `/app/api/widget/config/[slug].js`.
  2. Use Supabase client to query the `projects` table for the given slug.
  3. Return JSON with `project_id` and branding (e.g., colors: teal #2dd4bf, coral #ff6f61).
  4. Add error handling for invalid slugs (return 404).
- **Test**: Call `/api/widget/config/myapp` and verify it returns the correct project data or a 404.

### Task 3: Create API Route to Submit Feedback (`/app/api/widget/submit.js`)

- **Start**: No API route for feedback submission.
- **End**: API route accepts feedback and inserts it into Supabase.
- **Steps**:
  1. Create `/app/api/widget/submit.js`.
  2. Parse POST request body: `{ project_id, title, description }`.
  3. Validate `project_id` exists in `projects` table.
  4. Insert feedback into `feedback` table with `status='Open'`.
  5. Return success response or error (400 if invalid).
- **Test**: Send a POST request to `/api/widget/submit` with sample data and verify the feedback appears in Supabase.

### Task 4: Create Widget Button Component (`/components/widget/WidgetButton.js`)

- **Start**: No widget button component.
- **End**: A reusable button component that toggles the form.
- **Steps**:
  1. Create `/components/widget/WidgetButton.js`.
  2. Build a teal circular button (Tailwind: `bg-teal-500`, `rounded-full`, `p-4`) with a plus icon.
  3. Add a hover effect (scale 1.05, glow shadow).
  4. Add an `onClick` prop to toggle form visibility.
- **Test**: Render the button in a test page and verify it displays correctly and responds to clicks.

### Task 5: Create Widget Form Component (`/components/widget/WidgetForm.js`)

- **Start**: No widget form component.
- **End**: A form component to collect feedback.
- **Steps**:
  1. Create `/components/widget/WidgetForm.js`.
  2. Build a form with `title` (input) and `description` (textarea), styled with Tailwind (teal borders, coral submit button).
  3. Add a submit handler that sends data to `/api/widget/submit`.
  4. Show a success message on submission.
- **Test**: Render the form, submit sample feedback, and verify it reaches Supabase.

### Task 6: Create Widget Wrapper Component (`/components/widget/WidgetWrapper.js`)

- **Start**: No widget wrapper component.
- **End**: A wrapper that manages widget state and integrates components.
- **Steps**:
  1. Create `/components/widget/WidgetWrapper.js`.
  2. Fetch project config from `/api/widget/config/[slug]` using the slug from URL query.
  3. Manage form visibility state (`useState`).
  4. Render `WidgetButton` and conditionally render `WidgetForm` when toggled.
- **Test**: Render the wrapper with a test slug, verify the button toggles the form, and form submissions work.

### Task 7: Bundle Widget Script (`/public/widget/feedvote-widget.js`)

- **Start**: No widget script.
- **End**: A standalone script that mounts the widget.
- **Steps**:
  1. Create `/public/widget/feedvote-widget.js`.
  2. Write a script that extracts the `slug` from the script tag's `src` (e.g., `?slug=myapp`).
  3. Dynamically mount `WidgetWrapper` into a div on the user's page.
  4. Include Tailwind CSS for styling (via `widget.css`).
- **Test**: Embed the script in a test HTML page (`<script src="/widget/feedvote-widget.js?slug=myapp"></script>`) and verify the widget appears and functions.

### Task 8: Test End-to-End Flow

- **Start**: Widget components are built but untested together.
- **End**: Full widget flow is tested.
- **Steps**:
  1. Embed the widget on a test page with a valid project slug.
  2. Submit feedback through the widget.
  3. Verify the feedback appears in the "Open" column of the project's Kanban board in Feedvote.
- **Test**: Ensure the entire flow (embed → submit → sync) works without errors.

### Task 9: Implement Widget Analytics/Event Tracking

- **Start**: No analytics.
- **End**: All key widget events are tracked and sent to backend or analytics service.
- **Steps**:
  1. Define analytics events and payloads.
  2. Integrate event tracking in widget components.
  3. Add opt-in/out logic via config.
  4. Test event firing and payloads.
- **Test**: All events are tracked and sent as expected; opt-in/out works.

### Task 10: Add Widget Customization Options

- **Start**: No customization.
- **End**: Widget supports config for position, colors, text, fields, and localization.
- **Steps**:
  1. Define config schema.
  2. Implement config parsing (from script tag or backend).
  3. Apply config to widget UI and behavior.
  4. Test all customization options.
- **Test**: Widget renders and behaves according to config.

### Task 11: Advanced Modal Features

- **Start**: Basic modal.
- **End**: Modal meets all advanced requirements (accessibility, file upload, validation, responsive, customizable).
- **Steps**:
  1. Implement accessibility and keyboard navigation.
  2. Add file upload with progress and validation.
  3. Add inline validation and error handling.
  4. Make modal responsive and customizable.
  5. Integrate modal analytics.
  6. Test all features.
- **Test**: Modal passes accessibility, usability, and validation tests.
