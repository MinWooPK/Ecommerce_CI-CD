# ProjectFlow

Frontend-only practice project built with React, TypeScript, Vite, Tailwind CSS and React Router DOM.

## Start it

```bash
npm install
npm run dev
```

## Deliberately not included

- Zustand / TanStack Query / Redux
- APIs, json-server, Axios, backend or database
- Real authentication

All content lives in `src/data`. This makes the next learning step straightforward: replace local reads with TanStack Query and introduce Zustand only where client state is useful.

## Shop practice area

The `/shop`, `/shop/products/:id` and `/shop/cart` routes are entirely visual. A later progression is: product queries and product details with TanStack Query; cart, quantities and totals with Zustand.
# Ecommerce_CI-CD
