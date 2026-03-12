# SaaSForge Control Panel (Admin Frontend)

This is the administrative control panel for the Micro-SaaS Builder Platform. It provides a comprehensive interface for platform owners to manage tenants, view analytics, and oversee billing operations.

## Technology Stack

*   **Framework**: React (Vite)
*   **Routing**: React Router DOM
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Styling**: Pure semantic CSS (Zero dependencies on utility frameworks like Tailwind CSS)
*   **HTTP Client**: Axios

## Design System

The application utilizes a bespoke, modern design system built entirely from scratch using pure CSS variables. 

*   **Color Palette**: The theme is strictly built around high-contrast Indigos, vibrant Emeralds, Fuchsias, and Blues. **Grays/Slates are intentionally avoided** to create a distinct, premium, and colorful aesthetic.
*   **Typography**: 
    *   **Body Text**: `Plus Jakarta Sans` - Optimized for clean, precise legibility in high-density data tables.
    *   **Headings**: `Space Grotesk` - Used for primary metrics and page titles to provide a tech-forward, modern feel.
*   **Effects**: Heavy use of custom `.glass-panel` effects, crisp borders (`border-indigo-200`), and layered drop shadows (`--shadow-xl`) over grid-pattern backgrounds to establish depth.

## Project Structure

*   `/src/assets`: Static assets like standard grids and icons.
*   `/src/components/layout`: Core structural components (`Sidebar.jsx`, `TopHeader.jsx`).
*   `/src/pages`: Distinct administrative views (`Dashboard.jsx`, `Users.jsx`, `Billing.jsx`, etc.).
*   `/src/*.css`: The semantic CSS architecture.
    *   `index.css`: Global base styles, resets, and core `--color-*` root variables.
    *   `admin-layout.css`: Sidebar and structural layout grids.
    *   `auth.css`: Login and registration page specifics.
    *   `dashboard.css`: Dashboard-specific grid layouts and card animations.
    *   `users-table.css`: highly customized data layout rules.
    *   `feature-pages.css`: Shared patterns for analytics, security, and ecosystem views.

## Getting Started

1.  Ensure you have Node.js installed.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  The application will run with Vite's rapid HMR. By default, it communicates with the local backend running at `http://localhost:5000/api/v1`.
