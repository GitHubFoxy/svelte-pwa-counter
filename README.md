# Neck Counter

A minimal installable PWA counter for exercise reps.

Built with:
- Svelte 5
- TypeScript
- Vite
- Tailwind CSS
- `vite-plugin-pwa`

## Features

- Large tap target to increment the counter
- 1 second increment cooldown
- Smaller decrement button
- Local persistence with `localStorage`
- Installable PWA with offline support

## Development

```bash
pnpm install
pnpm dev -- --host
```

Open the app locally at:
- `http://localhost:5173`

To test from another device on the same network, use your computer's LAN IP:
- `http://<your-lan-ip>:5173`

## Production Build

```bash
pnpm build
pnpm preview -- --host
```

## Deployment

The app is configured for GitHub Pages and deploys via GitHub Actions.

Production URL:
- `https://githubfoxy.github.io/svelte-pwa-counter/`
