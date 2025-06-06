# Projects Schema Documentation

## Database Structure

The projects table is the central entity for managing user projects in FeedVote. Each project has its own public voting board.

### Table: projects

| Column      | Type                     | Description                                     |
| ----------- | ------------------------ | ----------------------------------------------- |
| id          | UUID                     | Primary key, automatically generated            |
| name        | TEXT                     | Project name (required)                         |
| slug        | TEXT                     | URL-friendly identifier (required, unique)      |
| description | TEXT                     | Optional project description                    |
| user_id     | UUID                     | Foreign key to auth.users (project owner)       |
| created_at  | TIMESTAMP WITH TIME ZONE | Timestamp of creation, automatically set        |
| updated_at  | TIMESTAMP WITH TIME ZONE | Timestamp of last update, automatically updated |

## Row-Level Security Policies

The following RLS policies are applied to the projects table:

1. **Projects are viewable by everyone:** Anyone can view any project.
2. **Projects can be inserted by authenticated users:** Only authenticated users can create projects.
3. **Projects can be updated by the project owner:** Only the project owner can update their projects.
4. **Projects can be deleted by the project owner:** Only the project owner can delete their projects.

## Indexes

| Index Name           | Columns | Purpose                           |
| -------------------- | ------- | --------------------------------- |
| idx_projects_user_id | user_id | Speeds up lookups by user         |
| idx_projects_slug    | slug    | Speeds up lookups by project slug |

## Related UI Components

### Projects Page

The `/app` route displays a list of all projects belonging to the current user, with the ability to:

- View project details
- Create new projects
- Navigate to a project's home page

### Create Project Modal

Accessible from the Projects Page, this modal allows users to create new projects by providing:

- Project name (required)
- Project slug (auto-generated from name, but editable)
- Project description (optional)

## URL Structure

Projects follow this URL pattern:

- **Projects List:** `/app`
- **Project Home:** `/app/{slug}/home`

## API Endpoints (Client-side Supabase)

### Fetch Projects

```typescript
// Get projects for the current user
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### Create Project

```typescript
// Insert a new project
const { data, error } = await supabase
  .from('projects')
  .insert({
    name: projectName,
    slug: projectSlug,
    description: projectDescription,
    user_id: user.id,
  })
  .select()
  .single();
```

### Update Project

```typescript
// Update an existing project
const { data, error } = await supabase
  .from('projects')
  .update({
    name: updatedName,
    description: updatedDescription,
  })
  .eq('id', projectId)
  .select()
  .single();
```

### Delete Project

```typescript
// Delete a project
const { error } = await supabase.from('projects').delete();
```
