# Roblox API Viewer

A fast, modular web application for searching and filtering through the Roblox API using custom query expressions.

## Features

- **Powerful Query System** - Filter API members using JavaScript-like expressions
- **Fast Performance** - Web Worker for non-blocking filtering, virtual scrolling for smooth UX
- **Comprehensive Data** - Search through classes, properties, methods, events, and enums
- **Modern Architecture** - Modular ES6 design with clear separation of concerns
- **Responsive UI** - Clean interface that works on desktop and mobile

## Quick Start

Visit **[https://riptxde.github.io/roblox_api_viewer/](https://riptxde.github.io/roblox_api_viewer/)** to start using the application immediately.

### For Developers

To run locally or contribute:
1. Clone this repository
```bash
git clone https://github.com/riptxde/roblox_api_viewer.git
```

2. `cd` into the project directory
```bash
cd roblox_api_viewer
```
3. Run the server, for example, via:
```bash
python3 -m http.server 8000
```

4. Open the hosted application in your browser, for example at **[http://localhost:8000](http://localhost:8000)**.

## Query Syntax

The query box accepts JavaScript expressions that evaluate to `true` or `false`. Each API member is tested against your query.

### Available Fields

#### For API Members (Properties, Methods, Events)
- `type` - Member type: `'Property'`, `'Function'`, `'Event'`, `'Callback'`
- `name` - Member name (e.g., `'Humanoid'`, `'Touched'`)
- `className` - Class the member belongs to (e.g., `'Part'`, `'Player'`)
- `valueType` - Value/return type (e.g., `'string'`, `'number'`, `'RBXScriptSignal'`)
- `security` - Security level (e.g., `'None'`, `'LocalUserSecurity'`)
- `deprecated` - Boolean indicating if deprecated
- `hidden` - Boolean indicating if hidden
- `unreplicated` - Boolean indicating if not replicated (properties only)
- `unscriptable` - Boolean indicating if not accessible from scripts
- `inheritance` - Array of parent classes (e.g., `['BasePart', 'PVInstance', 'Instance']`)

#### For Enums
- `type` - Always `'Enum'`
- `name` - Enum name (e.g., `'KeyCode'`, `'Material'`)
- `items` - Array of enum items with `name` and `value` properties

### Query Examples

```javascript
// All events
type == 'Event'

// All properties that are possibly replicated
type == 'Property' && !unreplicated

// Members with "Network" in the name
name.includes('Network')

// Only members from the Player class
className == 'Player'

// Touch-related events
type == 'Event' && name.includes('Touch')

// Hidden or unscriptable members
hidden || unscriptable

// Non-deprecated functions
type == 'Function' && !deprecated

// Classes that inherit from BasePart
inheritance.includes('BasePart')

// All enums
type == 'Enum'

// Enums with more than 50 items
type == 'Enum' && items.length > 50
```

### Advanced Queries

```javascript
// Properties that are both hidden and deprecated
type == 'Property' && hidden && deprecated

// Events from classes starting with "Remote"
type == 'Event' && className.startsWith('Remote')

// Functions with specific security levels
type == 'Function' && (security == 'RobloxScriptSecurity' || security == 'PluginSecurity')

// Properties with numeric value types
type == 'Property' && (valueType == 'int' || valueType == 'float' || valueType == 'double')
```

## Project Structure

```
roblox_api_viewer/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── main.js            # Application entry point and coordinator
│   ├── config.js          # Configuration and constants
│   ├── utils.js           # Utility functions
│   ├── dataLoader.js      # Data fetching and worker management
│   ├── queryHandler.js    # Query processing and validation
│   ├── renderer.js        # UI rendering (cards, error states)
│   ├── virtualScroll.js   # Virtual scrolling implementation
│   ├── stats.js           # Statistics calculation and display
│   └── worker.js          # Web Worker for filtering
├── resources/
│   ├── roblox_api.msgpack # API data (MessagePack format)
│   ├── msgpack.min.js     # MessagePack decoder library
│   ├── Geist[wght].woff2  # Font files
│   └── GeistMono[wght].woff2
└── README.md              # This file
```

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Modules

**`main.js`** - Application Coordinator
- Initializes all modules
- Coordinates communication between modules
- Manages application lifecycle
- Exposes global functions for UI interactions

**`config.js`** - Configuration
- Application settings (batch sizes, timeouts, URLs)
- Element IDs for DOM access
- Message types for worker communication
- External URLs

**`utils.js`** - Utilities
- Date formatting
- Debouncing
- DOM helpers
- HTML escaping for security

### Feature Modules

**`dataLoader.js`** - Data Management
- Fetches API data from MessagePack file
- Manages web worker lifecycle
- Handles worker communication
- Provides callbacks for filter results and errors

**`queryHandler.js`** - Query Processing
- Manages query input
- Validates query expressions
- Debounces user input for performance
- Displays query errors

**`renderer.js`** - UI Rendering
- Creates result cards for members and enums
- Renders items in batches
- Handles no-results and error states
- Escapes HTML to prevent XSS attacks

**`virtualScroll.js`** - Virtual Scrolling
- Implements lazy loading of results
- Uses Intersection Observer API
- Renders items in configurable batches
- Updates loading indicators

**`stats.js`** - Statistics
- Calculates result statistics
- Updates stats display
- Handles enum item counting

**`worker.js`** - Web Worker
- Runs filter queries in background thread
- Prevents UI blocking during filtering
- Evaluates query expressions safely
- Returns filtered results to main thread

### Module Dependencies

```
main.js
├── config.js
├── utils.js
├── dataLoader.js
│   └── config.js
├── queryHandler.js
│   ├── config.js
│   └── utils.js
├── virtualScroll.js
│   ├── config.js
│   ├── utils.js
│   └── renderer.js
├── renderer.js
│   ├── config.js
│   └── utils.js
└── stats.js
    ├── config.js
    └── utils.js
```

## Design Principles

1. **Separation of Concerns** - Each module has a single, well-defined responsibility
2. **Encapsulation** - Implementation details are hidden within modules
3. **Modularity** - Modules can be tested and maintained independently
4. **Clear Dependencies** - ES6 imports make dependencies explicit
5. **Security** - HTML escaping prevents XSS attacks, query validation prevents code injection
6. **Performance** - Web Workers and virtual scrolling ensure smooth UX even with large datasets

## Configuration

Edit `js/config.js` to customize application behavior:

```javascript
export const CONFIG = {
  ITEMS_PER_BATCH: 50,              // Items rendered per batch
  SCROLL_THRESHOLD: 0.8,            // Scroll threshold for loading more
  SCROLL_ROOT_MARGIN: "200px",      // Intersection observer margin
  QUERY_DEBOUNCE_MS: 300,           // Query input debounce delay
  DATA_URL: "resources/roblox_api.msgpack",
  WORKER_URL: "js/worker.js",
  API_BASE_URL: "https://robloxapi.github.io/ref",
};
```

## Browser Compatibility

Requires a modern browser with support for:
- ES6 Modules
- Web Workers
- Intersection Observer API
- Fetch API
- Promises/Async-Await

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Format

The API data is stored in MessagePack format for efficient loading. The data structure includes:

```javascript
{
  metadata: {
    version: "0.624.0.6240570",
    updated: "2025-01-15T12:00:00Z"
  },
  members: [
    {
      type: "Property" | "Function" | "Event" | "Callback",
      name: "MemberName",
      className: "ClassName",
      valueType: "string",
      security: "None",
      deprecated: false,
      hidden: false,
      unreplicated: false,
      unscriptable: false,
      inheritance: ["ParentClass", "GrandparentClass"]
    }
  ],
  enums: [
    {
      type: "Enum",
      name: "EnumName",
      items: [
        { name: "ItemName", value: 0 }
      ]
    }
  ]
}
```

## Performance

- **Lazy Loading** - Results are rendered in batches as you scroll
- **Web Worker** - Filtering runs in a background thread to keep UI responsive
- **Virtual Scrolling** - Only visible items are rendered in the DOM
- **Debouncing** - Query input is debounced to reduce unnecessary filtering
- **MessagePack** - Compact binary format reduces download size and parsing time

## Security

- **HTML Escaping** - All user-generated content is escaped before rendering
- **Content Security Policy Ready** - No inline scripts or styles
- **No Global Pollution** - ES6 modules prevent global namespace conflicts
- **Sandboxed Evaluation** - Query evaluation happens in a Web Worker

## Development

To modify or extend the application:

1. Edit modules in the `js/` directory
2. Each module exports functions/classes and imports its dependencies
3. Test changes by refreshing `index.html` in your browser

### Adding New Features

1. Create a new module in `js/` if needed
2. Export functionality from the new module
3. Import and initialize in `main.js`

### Module Template

```javascript
/**
 * Module description
 */

import { CONFIG } from './config.js';
import { utilityFunction } from './utils.js';

export class MyModule {
  constructor() {
    // Initialize
  }

  myMethod() {
    // Implementation
  }
}

export function myFunction() {
  // Implementation
}
```

## Credits

- **Fonts** - Geist and Geist Mono by Vercel
- **MessagePack** - [ygoe/msgpack.js](https://github.com/ygoe/msgpack.js/)

## License

This project is provided as-is for educational and reference purposes.

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing modular architecture
- HTML content is properly escaped
- No breaking changes to the query syntax without discussion

## Troubleshooting

**Query errors**: Check your syntax - queries must be valid JavaScript expressions

**No results**: Verify your query logic - try starting with a simple query like `type == 'Event'`

**Slow performance**: Reduce `ITEMS_PER_BATCH` in `config.js` or simplify your query

**Worker errors**: Check browser console for details - ensure `worker.js` is accessible

## Contact

Created by Riptxde
