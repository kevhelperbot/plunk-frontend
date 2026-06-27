# Plunk

Binary options trading platform mockup built with React, Tailwind CSS, and Recharts.

## What it does

Plunk lets users bet on whether an asset's price will go **up** or **down** within a fixed time window (5 min, 15 min, or end-of-day). Prices for crypto assets stream live from Binance; equities use a realistic simulation. All timers are wall-clock aligned — a 5-minute market always expires at :00, :05, :10, etc.

### Markets

- **Crypto** (8 assets): BTC, ETH, BNB, SOL, XRP, TON, DOGE, ADA — live prices via Binance WebSocket + REST klines
- **US Equities** (10 assets): NVDA, AAPL, MSFT, TSLA, GOOGL, AMZN, META, COIN, SPY, QQQ — simulated prices
- **Asian Equities** (10 assets): BABA, TCEHY, TSM, TM, SONY, SSNLF, BIDU, NTES, MUFG, NKY — simulated prices

### Trading mechanics

- Options are priced between $0.01 and $0.99, reflecting the implied probability of the price finishing higher
- Pricing uses a time-weighted model: small moves early in a period barely shift odds, but the same move near expiry pushes pricing toward extremes
- Trade size is deducted from balance on entry. If you win, each share pays out $1. Example: buy at $0.40, win → payout $1.00, net profit $0.60 per share
- Positions settle automatically when the period timer hits zero
- Balance cannot go negative — trades that exceed available funds are rejected with an error toast

### Responsive design

A single `PlunkApp.tsx` component detects screen width and renders either:

- **Desktop**: three-panel layout (market selector | chart | execution panel) with full keyboard shortcuts
- **Mobile**: swipe-card UI with bottom tab navigation

### Onboarding

A 5-step interactive tutorial launches after login, with small positioned tooltips that walk through markets, timeframes, trading, and settlement. Dismissable via X button or Escape key.

### Keyboard shortcuts (desktop)

| Action           | Keys              |
|------------------|-------------------|
| Buy / Sell       | `↑` `↓`           |
| Cycle assets     | `←` `→`           |
| Adjust size ±$50 | `Shift + ↑↓`      |
| Cycle durations  | `Shift + ←→`      |
| Cycle categories | `⌘ + Shift + ←→`  |
| Confirm trade    | `Enter`           |

A semi-transparent hotkey cheat sheet is always visible in the bottom-right corner.

## Running locally

```bash
cd /Users/orchestrator/Documents/plunk
npm install
npx vite --port 3000
```

Then open http://localhost:3000.

## Tech stack

- **React 18** with hooks (single-file component)
- **Tailwind CSS 3** for styling
- **Recharts** for the price chart (AreaChart)
- **Binance API** — REST (`/api/v3/klines`) for historical data, WebSocket (`@miniTicker`) for live ticks
- **Vite 5** for dev server and bundling

## File structure

```
plunk/
├── PlunkApp.tsx              ← main app (single component, ~1400 lines)
├── index.html                ← entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx              ← React mount point
│   └── index.css             ← Tailwind directives
├── plunk_terminal_web_app.tsx ← original desktop-only version (reference)
└── plunk_mobile_ui.tsx       ← original mobile-only version (reference)
```
