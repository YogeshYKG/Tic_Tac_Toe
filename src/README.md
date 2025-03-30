## 📂 App Structure

```
📂 src
├── 📜 App.jsx         # Main application component
├── 📂 components/     # Reusable UI components
│   ├── 📜 Board.jsx   # Game board component
│   └── 📜 Settings.jsx # Settings component for game customization
├── 📂 utils/          # Utility functions for game logic and theme management
│   ├── 📜 gameLogic.js # Core game logic (handling turns, checking winners, etc.)
│   └── 📜 theme.js    # Theme management utility
├── 📂 styles/         # Modular CSS styling
│   ├── 📜 App.module.css   # Styles for App component
│   ├── 📜 Board.module.css # Styles for Board component
│   └── 📜 Settings.module.css # Styles for Settings component
└── 📜 main.jsx        # Main entry point to initialize and render App.jsx
```

## 📌 Notes:
- **Component-Based Architecture:** The `components/` folder contains reusable UI elements.
- **Separation of Concerns:** Utility functions related to game logic and themes are placed in `utils/`.
- **Modular Styling:** Each component has its own CSS module in the `styles/` folder for scoped styling.
- **Main Entry Point:** `main.jsx` initializes the React app and renders `App.jsx`. 
