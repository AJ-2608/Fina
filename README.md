name: Fina Landing Page
version: 1.0.0
description: Deployment-ready landing page for Fina project with GitHub Pages configuration

# GitHub Pages Configuration
This repository is configured for GitHub Pages deployment with the following structure:

## Deployment Structure
- `index.html` - Main landing page
- `404.html` - SPA routing fallback
- `web-app/` - React application (built for GitHub Pages)
- `app-debug.apk` - Mobile app download
- `Fina 0.0.0.exe` - Desktop app download

## GitHub Pages Settings
- Source: Deploy from a branch
- Branch: main (or gh-pages)
- Folder: / (root)
- Custom domain: Optional

## Build Process
1. React app is built with `base: '/Fina/web-app/'` for GitHub Pages
2. Landing page links use relative paths `/Fina/...`
3. 404.html handles SPA routing for React app

## URLs After Deployment
- Landing: `https://username.github.io/Fina/`
- Web App: `https://username.github.io/Fina/web-app/`
- APK: `https://username.github.io/Fina/app-debug.apk`
- EXE: `https://username.github.io/Fina/Fina%200.0.0.exe`
