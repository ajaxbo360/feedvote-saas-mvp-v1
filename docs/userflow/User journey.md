User Journey for Feedvote.com

1. Landing Page (Post-Login Redirect)
   Description: After successful Google OAuth login, users are redirected to the Projects Page at feedvote.com/app#.
   UI/UX Design:
   Layout: Full-screen container with a centered card-based project list.
   Header:
   Title: “Projects” (bold, teal text, e.g., #2dd4bf).
   Subtitle: “Each project has its own public voting board on Feedvote.” (gray text, e.g., #6b7280).
   Main Section:
   Grid of project cards (if any exist) with a green checkmark (✔), project ID (e.g., feedvote.com#app1), and buttons: “View Dashboard,” “Edit,” “Share/Embed” (teal and gray buttons).
   A “+ Create Project” card (centered, teal text with a plus icon) to trigger the creation modal.
   Styling: Light background (e.g., #f3f4f6), rounded cards with shadows, responsive with Tailwind’s grid gap-4.
   Interaction: Clicking “+ Create Project” opens a modal; no navigation needed here as it’s the landing page.
   Purpose: Serves as the entry point to manage projects, mirroring Features.Vote’s Projects page.
   Cursor Prompt:
   “Design a Projects Page as the landing screen after Google OAuth login, redirecting to feedvote.com/app#. Use a full-screen layout with a teal ‘Projects’ title, gray subtitle ‘Each project has its own public voting board on Feedvote.’ Include a grid of project cards with a green checkmark, project ID (e.g., feedvote.com#app1), and buttons ‘View Dashboard,’ ‘Edit,’ ‘Share/Embed’ (teal and gray). Add a centered ‘+ Create Project’ card with a plus icon. Style with a light background, rounded cards with shadows, and Tailwind CSS responsiveness (e.g., grid gap-4). Ensure it’s the first screen users see post-login.”
2. Create Project Modal
   Description: Triggered by clicking “+ Create Project” on the Projects Page, this popup allows users to input project details and create a new project, redirecting to the Dashboard afterward.
   UI/UX Design:
   Layout: Centered modal overlay with a semi-transparent black background (e.g., bg-black bg-opacity-50).
   Header:
   Title: “Create New Project” (bold, dark text).
   Close button (×) in the top-right corner.
   Form:
   Project Name: Text input with placeholder “Enter your project’s name” (e.g., MyApp).
   Project Slug: Text input with placeholder “your-project-slug” (e.g., myapp), displaying a generated URL below (e.g., https://feedvote.com/app/myapp/board).
   Both inputs with light borders and padding, styled like Features.Vote’s inputs.
   Footer:
   “Cancel” button (gray) and “Create Project” button (teal, e.g., #2dd4bf).
   Styling: White modal with rounded corners, shadow, and responsive width (e.g., w-full max-w-md).
   Interaction: Submitting the form saves the project to Supabase, shows a success toast (e.g., “Successfully added new project!” with a checkmark), and redirects to https://feedvote.com/app/[slug]/home.
   Purpose: Simplifies project creation, inspired by Features.Vote’s modal, ensuring a seamless transition to the Dashboard.
   Cursor Prompt:
   “Design a Create Project modal triggered by a ‘+ Create Project’ button on the Projects Page. Use a centered overlay with a semi-transparent black background. Include a bold ‘Create New Project’ title, a close (×) button, and a form with ‘Project Name’ (placeholder: ‘Enter your project’s name’) and ‘Project Slug’ (placeholder: ‘your-project-slug’, showing URL like https://feedvote.com/app/myapp/board below). Add ‘Cancel’ (gray) and ‘Create Project’ (teal) buttons. Style with a white modal, rounded corners, shadow, and Tailwind CSS (e.g., w-full max-w-md). On submit, show a success toast and redirect to https://feedvote.com/app/[slug]/home.”
3. Dashboard (Home Board with Kanban)
   Description: After creating a project, users are redirected to the Dashboard at https://feedvote.com/app/[slug]/home, featuring a Kanban board for managing feedback.
   UI/UX Design:
   Layout: Sidebar navigation on the left, main Kanban board on the right.
   Sidebar:
   Logo/Title: “Feedvote” (teal).
   Navigation: “Home” (active), “Activity,” “Users,” “Releases,” “Share & Embed,” “Settings & Team” (links, styled like Features.Vote’s sidebar).
   Main Section:
   Title: “Your Board” (bold, dark text) with a “+ Add” button (blue) for new feedback.
   Kanban Board: Columns labeled “Open,” “In Progress,” “Done” (with counts, e.g., Open: 2, In Progress: 1, Done: 0).
   Cards: Each column contains draggable cards with titles (e.g., “This is a sample request”), vote counts (e.g., 4), and status icons (e.g., 👍 for Open, ⚙️ for In Progress, ✅ for Done), inspired by Features.Vote’s board.
   Empty state text (e.g., “No posts yet”) if no cards exist.
   Styling: Light background, column dividers, card shadows, responsive with Tailwind’s flex and grid.
   Interaction: Drag-and-drop cards between columns (using react-beautiful-dnd), add new feedback via the “+ Add” button (opens a modal like Features.Vote’s).
   Purpose: Central hub for feedback management, mirroring Features.Vote’s board with a Kanban twist for prioritization.
   Cursor Prompt:
   “Design a Dashboard (Home Board) at https://feedvote.com/app/[slug]/home with a sidebar and Kanban board. Include a teal ‘Feedvote’ logo, sidebar links (‘Home,’ ‘Activity,’ ‘Users,’ ‘Releases,’ ‘Share & Embed,’ ‘Settings & Team’). Main section has a bold ‘Your Board’ title with a blue ‘+ Add’ button. Feature a Kanban board with ‘Open,’ ‘In Progress,’ ‘Done’ columns (with counts), draggable cards (e.g., title, vote count, status icons: 👍, ⚙️, ✅), and empty state text. Style with a light background, column dividers, card shadows, and Tailwind CSS (e.g., flex, grid). Enable drag-and-drop and a modal for adding feedback.”
   Visualization of Pages
   Projects Page:
   text

Copy
[Header: "Projects" (teal), "Each project has its own public voting board on Feedvote" (gray)]
[Grid Layout]
[Card: ✔ feedvote.com#app1 | View Dashboard (teal) Edit (gray) Share/Embed (gray)]
[Card: + Create Project (teal with + icon)]
Create Project Modal:
text

Copy
[Overlay: Semi-transparent black]
[Modal: White, rounded]
[Title: "Create New Project" (bold)]
[Close: ×]
[Input: "Project Name" (placeholder: "Enter your project’s name")]
[Input: "Project Slug" (placeholder: "your-project-slug", URL: "https://feedvote.com/app/myapp/board")]
[Buttons: Cancel (gray) | Create Project (teal)]
[Toast: "Successfully added new project!" (green with ✔)]
Dashboard (Home Board):
text

Copy
[Sidebar: Feedvote (teal), Home (active), Activity, Users, Releases, Share & Embed, Settings & Team]
[Main: "Your Board" (bold) + Add (blue)]
[Kanban:
[Column: Open (2) | Card: "This is a sample request" (4 👍)]
[Column: In Progress (1) | Card: "This is an in-progress feature" (8 ⚙️)]
[Column: Done (0) | "No posts yet"]
]
