# ProjectMate Frontend

React frontend for ProjectMate, a developer collaboration portal for finding projects, matching with teammates, and managing project applications.

## ✨ Modern UI Redesign Features

We have completely overhauled the user interface to meet modern premium web standards:

- **Elegant Dual Themes**: Configurable dark (default) and light themes using standard CSS custom variables with a smooth `0.25s` transition. User theme selections are stored inside React state and persistent `localStorage` caches.
- **Minimal Classic Top Navbar**: Replaced the bulky vertical sidebar layout with a clean horizontal header:
  - **Direct Navigations**: The **ProjectMate brand logo** goes directly to the Dashboard, the **bell icon** navigates directly to Notifications (with active badges), and the **user profile avatar/name** leads directly to Settings.
  - **Filtered Links**: Primary navigation links are limited to **Projects**, **Developers**, and **My Projects**, freeing up display space.
  - **Actions Group**: Side-by-side positioning of Search inputs, Sun/Moon theme toggler buttons, and Logout triggers.
- **Custom SVG Branding**: Designed a custom geometric vector logo (`public/logo.svg` and `src/components/Logo.js` React inline component) that unifies branding across browser tab favicons, auth pages, and layouts.
- **Aesthetic Surfaces**: Built cards and panels using semi-transparent glassmorphic rules (`rgba(16, 18, 30, 0.75)` with backdrop blurs and micro-border gradients).
- **Responsive Layouts**: Designed mobile screen styles that hide descriptive text buttons (like username and logout labels) under tablet/phone widths, keeping only core interactive SVGs on a clean horizontal row.

## Scripts

```bash
npm start
# Runs the app locally at http://localhost:3000

npm run build
# Creates an optimized production build in the build/ directory
```
