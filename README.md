# Zen Search

Zen Search is a lightweight and intuitive browser extension designed to enhance your search experience. With its modern UI and powerful shortcuts, it helps you search faster and more efficiently.

## Features

- **Customizable Search Engines**: Switch between your favorite search engines with ease.
- **Keyboard Shortcuts**: Navigate results and perform actions using arrow keys, Enter, and more.
- **Lightweight and Fast**: Minimal resource usage ensures smooth performance.
- **Modern Design**: Built with Tailwind CSS for a sleek and responsive interface.

## Directory Structure

Here's an overview of the project's structure:

```
src/
  assets/         # Global CSS and assets like images
  components/     # Reusable UI components
  entrypoints/    # Main entry points (e.g., popup, background)
  hooks/          # Custom React hooks
  types/          # TypeScript type definitions
  utils/          # Utility functions
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/zen-search.git
   cd zen-search
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Load the extension in your browser and enjoy Zen Search!

## TODO for Next Release

- [ ] Add support for dark mode.
- [ ] Implement multi-language support for the UI.
- [ ] Enhance search result filtering options.
- [ ] Optimize performance for large datasets.
- [ ] Add unit tests for critical components.
- [ ] Add new Action types:
  - [ ] Close a window.
  - [ ] Open a window.
  - [ ] Open a tab.
  - [ ] Reload a tab.
  - [ ] Duplicate a tab.
  - [ ] Pin or unpin a tab.
  - [ ] Create a new tab group.
  - [ ] Add tabs to a group.
  - [ ] Remove tabs from a group.
  - [ ] Rename a tab group.
  - [ ] Close a tab group.
- [ ] Enable deleting a tab with Command + Backspace when selected.
- [ ] Add support for multiple search engines (Google, Bing, DuckDuckGo, etc.).
- [ ] Implement a settings page to configure:
  - [ ] Default search engine.
  - [ ] Custom actions.
- [ ] Allow users to define and add custom actions.

## License

This project is licensed under the MIT License.
