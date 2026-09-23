# Testing

Meridian uses Vitest for unit and component-level tests.

## Commands

```bash
npm test
npm run test:coverage
```

The test suite covers domain engines, state management, the widget registry, event communication, theme behavior, query states, error boundaries, and reusable dashboard components.

## What to validate before a production deployment

- `npm run build`
- `npm test`
- `npm run test:coverage`
- `npm run storybook`
- `npm run build-storybook`
- Responsive behavior at desktop, tablet, and mobile breakpoints
- Keyboard navigation and focus states
- Light, dark, and high-contrast themes
- Empty, loading, and error states
