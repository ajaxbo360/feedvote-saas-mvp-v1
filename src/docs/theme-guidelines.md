# Feedvote UI - Theme and Color Guidelines

This document outlines the color schemes, component styling, and theme variables to be used consistently across the Feedvote application.

## Color Palette

Our application uses a system of CSS variables for colors that respect both light and dark modes. Always use these semantic color tokens instead of hardcoded hex values.

### Primary Colors

| Name       | Light Mode                  | Dark Mode                  | CSS Variable         | Tailwind Class          |
| ---------- | --------------------------- | -------------------------- | -------------------- | ----------------------- |
| Background | White (`#ffffff`)           | Dark slate (`#0f172a`)     | `--background`       | `bg-background`         |
| Foreground | Dark slate (`#0f172a`)      | White (`#f8fafc`)          | `--foreground`       | `text-foreground`       |
| Primary    | Dark slate (`#0f172a`)      | White (`#f8fafc`)          | `--primary`          | `text-primary`          |
| Secondary  | Light blue/gray (`#f1f5f9`) | Dark blue/gray (`#1e293b`) | `--secondary`        | `bg-secondary`          |
| Muted      | Light gray (`#f1f5f9`)      | Dark gray (`#334155`)      | `--muted`            | `bg-muted`              |
| Muted text | Mid gray (`#64748b`)        | Light gray (`#94a3b8`)     | `--muted-foreground` | `text-muted-foreground` |
| Accent     | Light blue/gray (`#f1f5f9`) | Dark blue/gray (`#1e293b`) | `--accent`           | `bg-accent`             |
| Border     | Light gray (`#e2e8f0`)      | Dark gray (`#334155`)      | `--border`           | `border-border`         |

### Brand Colors

| Purpose     | Light Mode                   | Dark Mode                    | Usage                           |
| ----------- | ---------------------------- | ---------------------------- | ------------------------------- |
| Brand Green | `#16a34a`                    | `#4ade80`                    | Primary actions, success states |
| Brand Blue  | `#2563eb`                    | `#60a5fa`                    | Secondary actions, links, info  |
| Gradient    | `from-green-500 to-blue-500` | `from-green-600 to-blue-600` | Buttons, highlights, headers    |

## Theme Classes

The application uses the `next-themes` library to manage theme switching. The theme is stored in local storage and can be accessed via the `useTheme` hook.

```tsx
import { useTheme } from 'next-themes';

const Component = () => {
  const { theme, setTheme } = useTheme();

  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle theme</button>;
};
```

## Component Styling Guidelines

### Buttons

Always use our gradients for primary actions:

```tsx
// Primary action button
<button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-md">
  Primary Action
</button>

// Secondary action button
<button className="px-4 py-2 border border-border text-foreground hover:bg-secondary/50 rounded-md">
  Secondary Action
</button>

// Text button
<button className="text-muted-foreground hover:text-foreground transition-colors">
  Text Action
</button>
```

### Cards and Containers

Always use the theme variables for cards:

```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">Card content</div>
```

### Modal and Overlay Components

For consistent overlays:

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div className="bg-card text-card-foreground rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden border border-border">
    Modal content
  </div>
</div>
```

### Animations

Use Framer Motion for consistent animations:

```tsx
import { motion } from 'framer-motion';

// Standard hover effect for interactive elements
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
  Button text
</motion.button>;
```

## Onboarding Components

All onboarding components should follow these guidelines:

1. Use CSS variables and Tailwind classes for colors
2. Support both light and dark modes
3. Include smooth animations for better UX
4. Be consistent with the overall application design

## Light/Dark Mode Toggle

The application includes a theme toggle component at `src/components/ui/theme-toggle.tsx`. Use this component to allow users to switch themes.

## Responsive Design

Always build components with responsiveness in mind:

```tsx
<div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8">Responsive content</div>
```

Use the `useWindowSize` hook to get the current window dimensions for responsive components:

```tsx
import { useWindowSize } from '@/hooks/useWindowSize';

const Component = () => {
  const { width, height } = useWindowSize();

  return <div>{width < 768 ? <MobileView /> : <DesktopView />}</div>;
};
```

## Documentation for UI Components

All future UI components should include:

1. Proper TypeScript typing
2. JSDoc comments explaining the component's purpose and usage
3. Support for light/dark mode
4. Proper theme variable usage
