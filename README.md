# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Development API Proxy & HSTS Note

This project configures a Vite dev proxy for API calls so the frontend can call the backend without hardcoding a potentially problematic development domain.

### Why a proxy?

The backend originally used a custom domain like `local-api.dev`. The `.dev` TLD is on the HSTS preload list, so browsers _force_ HTTPS for any `http://...dev` request. If your backend only serves plain HTTP, the browser will upgrade to HTTPS and fail (e.g. `ERR_NAME_NOT_RESOLVED` or TLS errors). A local proxy avoids this by keeping requests relative.

### How it works

- In `vite.config.ts`, a proxy maps `^/api` to the backend target (default `http://local-api.dev:8080`).
- In development on `localhost`, `API_CONFIG` sets `BASE_URL` to an empty string so API calls become relative: `/api/v1/...`.
- The dev server intercepts those calls and forwards them to the backend.

### Changing the backend target

Edit `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_PROXY_TARGET || 'http://local-api.dev:8080',
      changeOrigin: true,
    }
  }
}
```

Or export an environment variable before running dev:

```bash
VITE_API_PROXY_TARGET=http://localhost:8081 pnpm dev
```

### Production / Deployment

For production builds you usually want a concrete `VITE_API_BASE_URL` (e.g. `https://api.example.com`). When `BASE_URL` is not empty, the code builds absolute URLs and the proxy is irrelevant (proxy only runs in dev). Make sure your deployment environment sets `VITE_API_BASE_URL` appropriately.

### Local HTTPS Option

If you truly need to keep a `.dev` domain locally, you must run the backend with HTTPS (e.g. using `mkcert` + a reverse proxy like Caddy or Nginx). Otherwise prefer a non‑preloaded TLD (e.g. `.test`, `.localhost`, `.internal`).

### Quick Checklist If Requests Fail

- Open browser console: `console.log(API_CONFIG.API_BASE)` should show `/api/v1` in dev.
- Network tab: requests should be `http://localhost:<vite-port>/api/v1/...`.
- Backend reachable directly: `curl http://<target-host>:8080/api/v1/health` (or similar endpoint).
- If you changed target, restart Vite so proxy picks it up.

This setup removes the friction of HSTS force-upgrades and keeps local development simple.
