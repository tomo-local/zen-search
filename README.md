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
  assets/         # Global styles and shared assets
  components/     # UI building blocks for the popup and content scripts
    content/      # Components rendered inside content scripts
    modules/      # Layout modules and common UI patterns
    widgets/      # Popup widgets such as search results and history items
  context/        # React context providers (e.g., ThemeProvider)
  entrypoints/    # Extension entry points (popup, background, content)
  hooks/          # Custom hooks for keyboard shortcuts and state handling
  services/       # Business logic and Chrome extension APIs
  utils/          # Shared helper and algorithm functions
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

## Roadmap

Here's how we're organizing upcoming work based on impact and theme:

### ✅ Shipped
- [x] Add support for dark mode.

### 🏁 Next Up
- [ ] Add unit tests for critical components.
- [ ] Enhance search result filtering options.
- [ ] Optimize performance for large datasets.

### 🌐 Search Experience
- [ ] Add support for multiple search engines (Google, Bing, DuckDuckGo, etc.).
- [ ] Implement multi-language support for the UI.

### ⚙️ Workflow & Automation
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
- [ ] Allow users to define and add custom actions.

### 🛠 Settings & Personalization
- [ ] Implement a settings page to configure:
  - [ ] Default search engine.
  - [ ] Custom actions.

## License

This project is licensed under the MIT License.
