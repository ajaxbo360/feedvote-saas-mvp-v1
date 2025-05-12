## Feedvote.com: User Flow and Initial User Journey

This document outlines the primary user flows for Feedvote.com, focusing on the initial journey for both SaaS Product Owners (Feedvote clients) and their End-Users. This is based on the PRD outline and competitor analysis.

### I. SaaS Product Owner (Feedvote Client) Journey

**Goal:** Sign up for Feedvote, create a project for their SaaS product, configure a feedback board, and start collecting feedback.

**1. Onboarding & Sign-up:**

- **Step 1.1: Visit Landing Page (`www.feedvote.com`)**
  - Learns about Feedvote's features and benefits.
  - Clicks on "Sign Up" or "Try Feedvote for Free."
- **Step 1.2: Sign-up Process**
  - User is directed to the sign-up page (`www.feedvote.com/signup` or `/auth/signup`).
  - Provides email and password, or chooses OAuth (Google/GitHub).
  - Agrees to Terms of Service and Privacy Policy.
  - Submits sign-up form.
  - (If email/password) Receives a verification email. Clicks verification link.
- **Step 1.3: Initial Login & Welcome**
  - After verification (or successful OAuth), user is logged in and redirected to the main application dashboard (`www.feedvote.com/app` or `/app/dashboard`).
  - May see a brief welcome modal or onboarding guide.

**2. Project Creation & Initial Setup:**

- **Step 2.1: Projects Dashboard (Empty State)**
  - Dashboard shows "No projects yet. Create your first project!"
  - Prominent "Create Project" button.
- **Step 2.2: Create New Project Modal/Page**
  - Clicks "Create Project."
  - Inputs:
    - **Project Name:** (e.g., "My Awesome SaaS App")
    - **Project Slug:** (e.g., "my-awesome-saas-app" - auto-generated from name, editable). This will form part of the public board URL (e.g., `my-awesome-saas-app.feedvote.com` or `feedvote.com/b/my-awesome-saas-app`).
  - Clicks "Create Project."
- **Step 2.3: Project Created Confirmation & Redirect**
  - Sees a success notification ("Project created successfully!").
  - Redirected to the newly created project's main board/dashboard (e.g., `/app/projects/{projectId}/board`).
- **Step 2.4: Onboarding Checklist (Optional - as seen in competitor)**
  - A simple checklist might guide the user through initial setup steps:
    - Customize your board appearance.
    - Learn how to embed the widget.
    - Add your first feature request (as an example).

**3. Feedback Board Configuration & Widget Embedding:**

- **Step 3.1: Navigate to Project Settings**
  - From the project board, navigates to "Settings & Team" or a similar section.
  - Sub-sections for:
    - General (Name, Slug, Logo, Website URL, Meta Description)
    - Theming (Primary Colors, Light/Dark Mode)
    - Widget Customization (Voting board title, post labels, pop-up messages)
    - Security (Whitelisted URLs, JWT options)
- **Step 3.2: Configure Board Appearance & Text**
  - Updates titles, labels, and messages as needed.
  - Saves changes.
- **Step 3.3: Navigate to "Share & Embed"**
  - Finds options to embed various widgets:
    - Full Voting Board
    - Roadmap View
    - Changelog View
    - "Suggest a Feature" Popup/Button
- **Step 3.4: Get Widget Code Snippet**
  - Selects desired widget type (e.g., "Suggest a Feature" popup).
  - Copies the provided JavaScript (or React/Next.js, Flutter, etc.) code snippet.
  - The snippet includes the project's unique `slug` or `api_key`.
  - Instructions on optional parameters (`user_id`, `user_email`, etc.) are visible.
- **Step 3.5: Integrate Widget into their SaaS Product**
  - Product Owner pastes the code snippet into their own SaaS application's codebase.

**4. Managing Feedback:**

- **Step 4.1: View Feedback Board**
  - Navigates to their project's board within the Feedvote dashboard.
  - Sees feedback items submitted by their end-users appearing in the "Pending" (or default) column.
- **Step 4.2: Interact with Feedback**
  - Clicks on a feedback item to view details.
  - Adds internal comments, assigns tags.
  - Changes status (e.g., drag from "Pending" to "Approved" or "In Progress").
  - Votes on items.
- **Step 4.3: View Public Board (as an end-user would see it)**
  - Clicks a link like "View Public Board" to see how it appears to their users.

### II. End-User (of Client's SaaS Product) Journey

**Goal:** Submit feedback for the SaaS product they are using, via the embedded Feedvote widget.

**1. Encountering the Feedback Widget:**

- **Step 1.1: Using the Client's SaaS Product**
  - The end-user is on the website or application of a SaaS product that has integrated Feedvote.
- **Step 1.2: Interacting with the Widget Trigger**
  - Sees a "Request a Feature," "Feedback," or similar button/tab (the Feedvote widget trigger).
  - Clicks the trigger.

**2. Submitting Feedback (e.g., "Suggest a Feature" Popup Widget):**

- **Step 2.1: Feedback Form Appears**
  - A modal/popup appears (the Feedvote widget UI).
  - Fields are presented:
    - Title (for the feature request/bug)
    - Description (rich text editor potentially)
    - Tags (optional, if configured by Product Owner)
    - Attach File (optional)
  - _(Behind the scenes: The widget script may have passed the end-user's `user_id`, `email`, `name` from the client SaaS if the Product Owner configured it. If not, the submission will be anonymous from the client's perspective, but Feedvote might use its own anonymous tracking.)_
- **Step 2.2: Fill and Submit Form**
  - End-user fills in the details.
  - Clicks "Submit."
- **Step 2.3: Confirmation**
  - Sees a success message (e.g., "Thank you for your feedback! We'll get back to you shortly.").
  - The modal/popup closes, or offers a link to view the main feedback board.

**3. Interacting with the Public Feedback Board (Optional Flow):**

- **Step 3.1: Visit Public Board**
  - The end-user might navigate directly to the public feedback board URL (e.g., `client-project.feedvote.com`) or be linked from the widget/client SaaS.
- **Step 3.2: View Existing Feedback**
  - Sees a list/board of feedback items, often filtered by status (e.g., Open, Planned, In Progress).
- **Step 3.3: Vote on Feedback**
  - Clicks an "Upvote" button on feedback items they agree with.
- **Step 3.4: Add Comments (if enabled)**
  - Adds comments to existing feedback items.
- **Step 3.5: Submit New Feedback (if not done via widget)**
  - Clicks an "Add Feedback" or "Suggest Feature" button on the public board itself, leading to a similar submission form as the widget.
- **Step 3.6: Authentication on Public Board (Optional, if configured by Product Owner)**
  - If the Product Owner has enabled "Login with Google" on the public board, users might be prompted to log in to vote/comment/submit, which can help reduce spam and link their activities. Otherwise, these actions might be anonymous or use Feedvote's internal anonymous tracking.

### Initial User Journey Focus for MVP Development:

1.  **Product Owner:** Sign-up -> Create Project -> Get Basic Widget Snippet -> View Submitted Feedback on a Simple Board.
2.  **End-User:** See Widget -> Submit Feedback via Widget -> Get Confirmation.

This initial flow covers the core value proposition and provides a foundation for adding more advanced features like detailed board customization, AI insights, and gamification later.
