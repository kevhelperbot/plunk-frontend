import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, ReferenceLine } from 'recharts';

// ─── Asset Lists ─────────────────────────────────────────────────────────────
const assets = [
  { ticker: 'BTC',  name: 'Bitcoin',  symbol: 'BTCUSDT',  price: 65420.50, logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',        odds: 52 },
  { ticker: 'ETH',  name: 'Ethereum', symbol: 'ETHUSDT',  price: 3450.25,  logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',      odds: 48 },
  { ticker: 'BNB',  name: 'BNB',      symbol: 'BNBUSDT',  price: 605.10,   logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',  odds: 15 },
  { ticker: 'SOL',  name: 'Solana',   symbol: 'SOLUSDT',  price: 145.20,   logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',       odds: 82 },
  { ticker: 'XRP',  name: 'XRP',      symbol: 'XRPUSDT',  price: 0.52,     logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', odds: 35 },
  { ticker: 'TON',  name: 'Toncoin',  symbol: 'TONUSDT',  price: 6.80,     logo: 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png',  odds: 60 },
  { ticker: 'DOGE', name: 'Dogecoin', symbol: 'DOGEUSDT', price: 0.12,     logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',        odds: 12 },
  { ticker: 'ADA',  name: 'Cardano',  symbol: 'ADAUSDT',  price: 0.45,     logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',       odds: 91 },
];

const usEquities = [
  { ticker: 'NVDA',  name: 'NVIDIA',      price: 920.50,  logo: 'https://logo.clearbit.com/nvidia.com',    odds: 78 },
  { ticker: 'AAPL',  name: 'Apple',       price: 173.25,  logo: 'https://logo.clearbit.com/apple.com',     odds: 55 },
  { ticker: 'MSFT',  name: 'Microsoft',   price: 415.50,  logo: 'https://logo.clearbit.com/microsoft.com', odds: 62 },
  { ticker: 'TSLA',  name: 'Tesla',       price: 175.10,  logo: 'https://logo.clearbit.com/tesla.com',     odds: 34 },
  { ticker: 'GOOGL', name: 'Alphabet',    price: 178.20,  logo: 'https://logo.clearbit.com/google.com',    odds: 58 },
  { ticker: 'AMZN',  name: 'Amazon',      price: 195.80,  logo: 'https://logo.clearbit.com/amazon.com',    odds: 61 },
  { ticker: 'META',  name: 'Meta',        price: 505.00,  logo: 'https://logo.clearbit.com/meta.com',      odds: 67 },
  { ticker: 'COIN',  name: 'Coinbase',    price: 225.40,  logo: 'https://logo.clearbit.com/coinbase.com',  odds: 44 },
  { ticker: 'SPY',   name: 'S&P 500 ETF', price: 512.80,  logo: 'https://logo.clearbit.com/ssga.com',      odds: 53 },
  { ticker: 'QQQ',   name: 'Nasdaq 100 ETF', price: 442.20, logo: 'https://logo.clearbit.com/invesco.com', odds: 57 },
];

const asianEquities = [
  { ticker: 'BABA',  name: 'Alibaba',        price: 78.50,    logo: 'https://logo.clearbit.com/alibaba.com',    odds: 38 },
  { ticker: 'TCEHY', name: 'Tencent',        price: 48.20,    logo: 'https://logo.clearbit.com/tencent.com',    odds: 45 },
  { ticker: 'TSM',   name: 'TSMC',           price: 165.30,   logo: 'https://logo.clearbit.com/tsmc.com',       odds: 72 },
  { ticker: 'TM',    name: 'Toyota',         price: 210.40,   logo: 'https://logo.clearbit.com/toyota.com',     odds: 50 },
  { ticker: 'SONY',  name: 'Sony',           price: 88.60,    logo: 'https://logo.clearbit.com/sony.com',       odds: 54 },
  { ticker: 'SSNLF', name: 'Samsung',        price: 58.90,    logo: 'https://logo.clearbit.com/samsung.com',    odds: 49 },
  { ticker: 'BIDU',  name: 'Baidu',          price: 102.30,   logo: 'https://logo.clearbit.com/baidu.com',      odds: 36 },
  { ticker: 'NTES',  name: 'NetEase',        price: 95.10,    logo: 'https://logo.clearbit.com/netease.com',    odds: 42 },
  { ticker: 'MUFG',  name: 'Mitsubishi UFJ', price: 11.20,    logo: 'https://logo.clearbit.com/mufg.jp',        odds: 47 },
  { ticker: 'NKY',   name: 'Nikkei 225',     price: 38500.00, logo: 'https://logo.clearbit.com/nikkei.com',     odds: 55 },
];

const marketData = { crypto: assets, us: usEquities, asia: asianEquities };

// Mock data for desktop portfolio history tab
const mockHistory = [
  { id: '1', asset: 'BTC', duration: '5m',  direction: 'BUY',  size: 500, entry: 65420.50, pnl: 45.50,  date: 'Today, 10:42 AM' },
  { id: '2', asset: 'ETH', duration: '15m', direction: 'SELL', size: 250, entry: 3450.25,  pnl: -15.20, date: 'Yesterday, 2:15 PM' },
  { id: '3', asset: 'SOL', duration: '5m',  direction: 'BUY',  size: 300, entry: 145.20,   pnl: 18.40,  date: 'Jun 15, 4:00 PM' },
];
const mockTransfers = [
  { id: 't1', type: 'Deposit',    method: 'ACH Transfer',  amount: 5000,  status: 'Completed', date: 'Jun 14, 9:00 AM' },
  { id: 't2', type: 'Withdrawal', method: 'Crypto Wallet', amount: -1500, status: 'Completed', date: 'Jun 10, 6:30 PM' },
  { id: 't3', type: 'Deposit',    method: 'Crypto Wallet', amount: 2500,  status: 'Completed', date: 'Jun 01, 11:15 AM' },
];

const generateInitialData = (basePrice = 15420) => {
  let base = basePrice;
  const data = [];
  const volatility = basePrice * 0.005;
  for (let i = 20; i >= 0; i--) {
    data.push({ time: i, value: base });
    base -= (Math.random() * volatility) - (volatility / 2);
  }
  return data.reverse();
};

// Returns seconds until the next period boundary (wall-clock aligned)
const getSecondsRemainingForDuration = (duration) => {
  const now = new Date();
  const s = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (duration === '5m')  return 300  - (s % 300);
  if (duration === '15m') return 900  - (s % 900);
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
};

// Returns a monotonically increasing index for the current period (changes when period rolls over)
const getPeriodIndex = (duration) => {
  const now = new Date();
  const s = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (duration === '5m')  return Math.floor(s / 300);
  if (duration === '15m') return Math.floor(s / 900);
  return 0; // single daily period for EOD
};

// Module-level cache so broken-logo state survives inner-component remounts
const brokenLogos = new Set<string>();

const AssetIcon = ({ asset }) => {
  const [, forceUpdate] = useState(0);
  if (!asset.logo || brokenLogos.has(asset.logo)) {
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0">
        {asset.ticker[0]}
      </div>
    );
  }
  return (
    <img
      src={asset.logo}
      alt={asset.ticker}
      className="w-10 h-10 rounded-full object-contain shrink-0 border border-neutral-200 bg-white p-1"
      onError={() => { brokenLogos.add(asset.logo); forceUpdate(n => n + 1); }}
    />
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PlunkApp() {

  // Device detection — drives which render path is used
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // ── Shared state ────────────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState('login');
  const [activeCategory, setActiveCategory] = useState('crypto');
  const [activeDuration, setActiveDuration] = useState('5m');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [depositMethod, setDepositMethod] = useState('crypto');

  const [data, setData] = useState(() => generateInitialData(assets[0].price));
  const [currentValue, setCurrentValue] = useState(data[data.length - 1].value);
  const [previousValue, setPreviousValue] = useState(data[data.length - 2].value);
  const [referencePrice, setReferencePrice] = useState(assets[0].price);

  const [tradeSize, setTradeSize] = useState(100);
  const [balance, setBalance] = useState(12540.50);
  const [timeLeft, setTimeLeft] = useState(() => getSecondsRemainingForDuration('5m'));
  const [periodOpenPrice, setPeriodOpenPrice] = useState(assets[0].price);
  const [liveOdds, setLiveOdds] = useState<Record<string,number>>(() => {
    const map: Record<string,number> = {};
    [...assets, ...usEquities, ...asianEquities].forEach(a => { map[a.ticker] = a.odds; });
    return map;
  });

  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);       // mobile: full order log
  const [portfolioTab, setPortfolioTab] = useState('positions');
  const [pendingOrder, setPendingOrder] = useState(null);
  const [confirmDrag, setConfirmDrag] = useState(0);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [noticeQueue, setNoticeQueue] = useState([]);
  const [activeNotice, setActiveNotice] = useState(null);
  const [sizeAdjustCue, setSizeAdjustCue] = useState(null);

  // Desktop-only UI state
  const [portfolioActiveTab, setPortfolioActiveTab] = useState('open');
  const [hotkeysEnabled, setHotkeysEnabled] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0); // 0 = off, 1-5 = active step

  // ── Refs ────────────────────────────────────────────────────────────────────
  const dataRef = useRef(data);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const confirmDragStart = useRef(0);
  const wsRef = useRef(null);
  const containerRef = useRef(null);
  const currentValueRef = useRef(currentValue);
  const activeDurationRef = useRef(activeDuration);
  const lastWsUpdateRef = useRef(0);
  const positionsRef = useRef([]);
  const periodOpenPriceRef = useRef(assets[0].price);
  const selectedAssetTickerRef = useRef(assets[0].ticker);
  const noticeTimerRef = useRef(null);
  const sizeCueTimerRef = useRef(null);

  // Keep refs in sync so callbacks always see current values
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { currentValueRef.current = currentValue; }, [currentValue]);
  useEffect(() => { activeDurationRef.current = activeDuration; }, [activeDuration]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);
  useEffect(() => { periodOpenPriceRef.current = periodOpenPrice; }, [periodOpenPrice]);
  useEffect(() => { selectedAssetTickerRef.current = selectedAsset.ticker; }, [selectedAsset.ticker]);

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Countdown timer — wall-clock aligned; detects period rollovers to reset odds reference price
  useEffect(() => {
    if (currentView === 'login') return;
    let lastIdx = getPeriodIndex(activeDuration);
    const tick = () => {
      const newIdx = getPeriodIndex(activeDurationRef.current);
      if (newIdx !== lastIdx) {
        const settlementPrice = currentValueRef.current;
        const openPrice       = periodOpenPriceRef.current;
        const dur             = activeDurationRef.current;
        lastIdx = newIdx;
        setPeriodOpenPrice(settlementPrice);

        // Settle all positions for the expired duration
        const allPos = positionsRef.current;
        const expiring = allPos.filter(p => p.duration === dur);
        if (expiring.length > 0) {
          let payout = 0;
          expiring.forEach(pos => {
            // Use real price movement for the selected asset; probabilistic sim for others
            const useLivePrice = pos.asset.symbol !== undefined
              ? pos.asset.ticker === selectedAssetTickerRef.current
              : false;
            const won = useLivePrice
              ? (pos.direction === 'BUY' ? settlementPrice > openPrice : settlementPrice < openPrice)
              : (Math.random() < (pos.direction === 'BUY' ? pos.price : 1 - pos.price));
            if (won) payout += pos.shares;
            const profit = won ? Math.max(0, pos.shares - pos.size) : 0;
            enqueueNotice({
              type: won ? 'success' : 'settlement',
              title: `${pos.duration.toUpperCase()} ${pos.asset.ticker} settled at $${formatAssetPrice(settlementPrice, settlementPrice)}`,
              body: won ? `Won ${profit > 0 ? `+$${profit.toFixed(2)}` : 'this market'}` : 'Lost this market'
            });
          });
          setPositions(prev => prev.filter(p => p.duration !== dur));
          if (payout > 0) setBalance(b => Math.max(0, b + payout));
        }
      }
      setTimeLeft(getSecondsRemainingForDuration(activeDurationRef.current));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentView, activeDuration]);

  // Slowly drift odds for non-selected assets so the list feels live
  useEffect(() => {
    if (currentView === 'login') return;
    const id = setInterval(() => {
      setLiveOdds(prev => {
        const next = { ...prev };
        [...assets, ...usEquities, ...asianEquities].forEach(a => {
          if (a.ticker === selectedAsset.ticker) return;
          const delta = (Math.random() - 0.5) * 3;
          next[a.ticker] = Math.max(5, Math.min(95, (prev[a.ticker] ?? a.odds) + delta));
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [currentView, selectedAsset.ticker]);

  // Price feed — Binance WebSocket for crypto, simulation for equities
  useEffect(() => {
    if (currentView === 'login') return;
    let priceInterval = null;

    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }

    // latestWsPrice caches the most recent WebSocket tick.
    // A single 1-second interval is the only thing that ever calls setState,
    // so the update rate is exactly 1/s regardless of WebSocket message frequency.
    let latestWsPrice: number | null = null;

    if (selectedAsset.symbol) {
      // Seed chart with real 1-minute klines
      fetch(`https://api.binance.com/api/v3/klines?symbol=${selectedAsset.symbol}&interval=1m&limit=21`)
        .then(res => res.json())
        .then(klines => {
          if (!Array.isArray(klines)) return;
          const historicalData = klines.map((k, i) => ({ time: i, value: parseFloat(k[4]) }));
          setData(historicalData);
          setReferencePrice(historicalData[0].value);
          setPreviousValue(historicalData[historicalData.length - 2].value);
          setCurrentValue(historicalData[historicalData.length - 1].value);
          const now = new Date();
          const dur = activeDurationRef.current;
          const minuteOffset = dur === '5m' ? now.getMinutes() % 5 : dur === '15m' ? now.getMinutes() % 15 : 0;
          const startIdx = Math.max(0, historicalData.length - 1 - minuteOffset);
          setPeriodOpenPrice(historicalData[startIdx].value);
        })
        .catch(err => console.warn('Binance klines fetch failed:', err));

      const ws = new WebSocket(`wss://stream.binance.com:443/ws/${selectedAsset.symbol.toLowerCase()}@miniTicker`);
      wsRef.current = ws;
      // Just cache the price — don't setState here
      ws.onmessage = (event) => {
        const tick = JSON.parse(event.data);
        latestWsPrice = parseFloat(tick.c);
      };
      ws.onerror = () => console.warn('Binance WebSocket error — interval will simulate');
    }

    // Single interval owns all state updates: uses WS price when available, simulates otherwise
    priceInterval = setInterval(() => {
      const currentData = dataRef.current;
      const lastPoint = currentData[currentData.length - 1];
      const prevPoint = currentData[currentData.length - 2];
      let newValue: number;
      if (latestWsPrice !== null) {
        newValue = latestWsPrice;
        latestWsPrice = null;
      } else {
        const volatility = lastPoint.value * 0.0003;
        const randomChange = (Math.random() * volatility) - (volatility / 2);
        newValue = lastPoint.value + randomChange + (lastPoint.value - prevPoint.value) * 0.2;
      }
      setPreviousValue(lastPoint.value);
      setCurrentValue(newValue);
      setData([...currentData.slice(1), { time: lastPoint.time + 1, value: newValue }]);
    }, 1000);

    return () => {
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
      if (priceInterval) clearInterval(priceInterval);
    };
  }, [currentView, selectedAsset.ticker]);

  useEffect(() => {
    if (activeNotice || noticeQueue.length === 0) return;
    setActiveNotice(noticeQueue[0]);
    setNoticeQueue(prev => prev.slice(1));
  }, [noticeQueue, activeNotice]);

  useEffect(() => {
    if (!activeNotice) return;
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setActiveNotice(null), activeNotice.durationMs ?? 2600);
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, [activeNotice]);

  // Keyboard shortcuts (desktop-focused, but shared handler)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      if (currentView === 'login') return;

      if (tutorialStep > 0 && e.key === 'Escape') {
        e.preventDefault();
        setTutorialStep(0);
        return;
      }

      if (pendingOrder) {
        if (e.key === 'Enter')  { e.preventDefault(); executeOrder(); }
        if (e.key === 'Escape') { e.preventDefault(); setPendingOrder(null); setConfirmDrag(0); }
        return;
      }

      if (currentView !== 'trade' && currentView !== 'products') return;

      if (e.metaKey && e.shiftKey) {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); cycleCategory(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); cycleCategory(1);  return; }
        if (e.key === 'ArrowUp')    { e.preventDefault(); adjustTradeSizeByPercent(0.10, 'up'); return; }
        if (e.key === 'ArrowDown')  { e.preventDefault(); adjustTradeSizeByPercent(0.10, 'down'); return; }
      }
      if (e.shiftKey) {
        if (e.key === 'ArrowUp')    { e.preventDefault(); adjustTradeSizeByPercent(0.01, 'up'); return; }
        if (e.key === 'ArrowDown')  { e.preventDefault(); adjustTradeSizeByPercent(0.01, 'down'); return; }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); cycleDuration(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); cycleDuration(1);  return; }
      }
      if (e.key === 'ArrowUp')    { e.preventDefault(); triggerOrderIntent('BUY'); return; }
      if (e.key === 'ArrowDown')  { e.preventDefault(); triggerOrderIntent('SELL'); return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); cycleMarket(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); cycleMarket(1);  }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, pendingOrder, tutorialStep, balance, tradeSize, hotkeysEnabled, noticeQueue, activeNotice]);

  // ── Helpers & computed values ────────────────────────────────────────────────
  const getDecimals = (refPrice) => {
    if (refPrice >= 1000) return 0;
    if (refPrice >= 1)    return 2;
    return 4;
  };
  const formatAssetPrice = (price, refPrice) => {
    const decimals = getDecimals(refPrice);
    return price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };
  const calculateSpreadPercent = (size) => {
    const slippageBps = Math.floor(size / 30);
    return (2.0 + slippageBps * 0.01) / 100;
  };

  const difference     = currentValue - referencePrice;
  const percentChange  = (difference / referencePrice) * 100;
  const isPositive     = difference >= 0;
  const spreadPercent  = calculateSpreadPercent(tradeSize);

  // Time-weighted binary option probability:
  // Near the start of a period, price has barely moved → ~50/50.
  // As price drifts and time runs out, the side that's winning converges toward certainty.
  const totalPeriodSeconds = activeDuration === '15m' ? 900 : activeDuration === 'eod' ? 86400 : 300;
  const timeRemainingFraction = Math.max(0.005, timeLeft / totalPeriodSeconds);
  const impliedVol = 0.015; // ~1.5% annualized-scaled per-period vol
  const periodReturn = periodOpenPrice > 0 ? (currentValue - periodOpenPrice) / periodOpenPrice : 0;
  const denom = impliedVol * Math.sqrt(timeRemainingFraction);
  const zScore = denom > 0 ? periodReturn / denom : 0;
  const rawProb = 1 / (1 + Math.exp(-zScore * 2));
  const baseProbBuy    = Math.max(0.01, Math.min(0.99, rawProb));
  const baseProbSell   = 1 - baseProbBuy;
  const optionBuyPrice  = baseProbBuy  + (spreadPercent / 2);
  const optionSellPrice = baseProbSell + (spreadPercent / 2);
  const formattedBuy   = optionBuyPrice.toFixed(2);
  const formattedSell  = optionSellPrice.toFixed(2);

  // Keep selected asset's live odds in sync with the computed probability (must be after baseProbBuy)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLiveOdds(prev => ({ ...prev, [selectedAsset.ticker]: Math.round(baseProbBuy * 100) }));
  }, [baseProbBuy]);

  // Unified PnL using mobile's shares model
  const calculatePositionPnL = (pos) => {
    const currentPriceForSide = pos.direction === 'BUY' ? optionBuyPrice : optionSellPrice;
    return (currentPriceForSide - pos.price) * pos.shares;
  };

  const enqueueNotice = (notice) => setNoticeQueue(prev => [...prev, { id: Date.now() + Math.random(), durationMs: 2600, ...notice }]);

  const flashSizeAdjustCue = (direction, pct) => {
    setSizeAdjustCue({ direction, pct });
    if (sizeCueTimerRef.current) clearTimeout(sizeCueTimerRef.current);
    sizeCueTimerRef.current = setTimeout(() => setSizeAdjustCue(null), 1000);
  };

  const adjustTradeSizeByPercent = (pct, direction) => {
    const delta = balance * pct;
    const minSize = balance <= 0 ? 0 : Math.min(1, balance);
    setTradeSize(prev => {
      const next = direction === 'up' ? prev + delta : prev - delta;
      return Math.max(minSize, Math.min(balance, Math.round(next)));
    });
    flashSizeAdjustCue(direction, pct);
  };

  const setSizePercent = (pct) => setTradeSize(Math.floor(balance * pct));

  // ── Navigation handlers ──────────────────────────────────────────────────────
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    const newData = generateInitialData(asset.price);
    setData(newData);
    setReferencePrice(asset.price);
    setPeriodOpenPrice(asset.price); // placeholder until real price loads
    setPreviousValue(newData[newData.length - 2].value);
    setCurrentValue(newData[newData.length - 1].value);
    if (isMobile) setCurrentView('trade');
  };

  const cycleMarket = (direction) => {
    const list = marketData[activeCategory];
    const idx  = list.findIndex(a => a.ticker === selectedAsset.ticker);
    if (idx === -1) return;
    let next = idx + direction;
    if (next < 0) next = list.length - 1;
    if (next >= list.length) next = 0;
    handleAssetSelect(list[next]);
  };

  const cycleCategory = (direction) => {
    const cats = ['crypto', 'us', 'asia'];
    let next = cats.indexOf(activeCategory) + direction;
    if (next < 0) next = cats.length - 1;
    if (next >= cats.length) next = 0;
    const newCat = cats[next];
    setActiveCategory(newCat);
    handleAssetSelect(marketData[newCat][0]);
  };

  const changeDuration = (dur) => {
    setActiveDuration(dur);
    setPeriodOpenPrice(currentValueRef.current);
  };

  const cycleDuration = (direction) => {
    const durs = ['5m', '15m', 'eod'];
    let next = durs.indexOf(activeDuration) + direction;
    if (next < 0) next = durs.length - 1;
    if (next >= durs.length) next = 0;
    changeDuration(durs[next]);
  };

  // ── Order flow ───────────────────────────────────────────────────────────────
  const showError = (msg: string) => {
    enqueueNotice({ type: 'error', title: 'Order error', body: msg });
  };

  const triggerOrderIntent = (direction) => {
    if (tradeSize <= 0 || tradeSize > balance) {
      showError(`Insufficient funds — you need $${tradeSize.toLocaleString()} but only have $${balance.toFixed(2)}`);
      return;
    }
    const price     = direction === 'BUY' ? optionBuyPrice  : optionSellPrice;
    const formatted = direction === 'BUY' ? formattedBuy    : formattedSell;
    setPendingOrder({ direction, price, size: tradeSize, asset: selectedAsset, duration: activeDuration, formattedPrice: formatted, id: Date.now().toString() });
  };

  // Mobile swipe card → pending order (with fly-out animation)
  const handleChoice = (choice, manualDirection = null) => {
    if (manualDirection) setDragPos({ x: manualDirection === 'right' ? 400 : -400, y: 0 });
    setTimeout(() => {
      setDragPos({ x: 0, y: 0 });
      triggerOrderIntent(choice === 'B' ? 'BUY' : 'SELL');
    }, 250);
  };

  // Unified executeOrder — uses mobile's richer shares model (works for both layouts)
  const executeOrder = () => {
    if (!pendingOrder) return;
    if (pendingOrder.size > balance) {
      setPendingOrder(null);
      showError(`Insufficient funds — you need $${pendingOrder.size.toFixed(2)} but only have $${balance.toFixed(2)}`);
      return;
    } // funds depleted since intent
    const orderShares = pendingOrder.size / pendingOrder.price;
    setOrders(prev => [{ id: Date.now(), ...pendingOrder, shares: orderShares, timestamp: new Date() }, ...prev]);

    const existingIdx = positions.findIndex(p => p.asset.ticker === pendingOrder.asset.ticker && p.duration === pendingOrder.duration);
    let newBalance   = balance;
    let newPositions = [...positions];

    if (existingIdx >= 0) {
      const existing = positions[existingIdx];
      if (existing.direction === pendingOrder.direction) {
        // Add to position — track avg entry
        newBalance -= pendingOrder.size;
        const totalShares    = existing.shares + orderShares;
        const totalCostBasis = (existing.shares * existing.price) + pendingOrder.size;
        newPositions[existingIdx] = { ...existing, shares: totalShares, size: totalCostBasis, price: totalCostBasis / totalShares };
      } else {
        if (orderShares < existing.shares) {
          // Partial close
          newBalance += orderShares * pendingOrder.price;
          newPositions[existingIdx] = { ...existing, shares: existing.shares - orderShares, size: (existing.shares - orderShares) * existing.price };
        } else if (orderShares === existing.shares) {
          // Full close
          newBalance += orderShares * pendingOrder.price;
          newPositions.splice(existingIdx, 1);
        } else {
          // Flip
          newBalance += existing.shares * pendingOrder.price;
          const remaining = orderShares - existing.shares;
          newBalance -= remaining * pendingOrder.price;
          newPositions[existingIdx] = { id: Date.now(), asset: pendingOrder.asset, duration: pendingOrder.duration, direction: pendingOrder.direction, shares: remaining, price: pendingOrder.price, size: remaining * pendingOrder.price };
        }
      }
    } else {
      newBalance -= pendingOrder.size;
      newPositions.unshift({ id: Date.now(), asset: pendingOrder.asset, duration: pendingOrder.duration, direction: pendingOrder.direction, shares: orderShares, price: pendingOrder.price, size: pendingOrder.size });
    }

    setBalance(newBalance);
    setPositions(newPositions);
    enqueueNotice({
      type: 'success',
      title: `${pendingOrder.duration.toUpperCase()} ${pendingOrder.asset.ticker} filled`,
      body: `${pendingOrder.direction === 'BUY' ? 'YES' : 'NO'} • $${pendingOrder.size.toFixed(2)} @ $${pendingOrder.formattedPrice}`
    });
    setPendingOrder(null);
    setConfirmDrag(0);
    setDragPos({ x: 0, y: 0 });
  };

  // ── Pointer / gesture handlers ────────────────────────────────────────────────
  // Swipe trade card (mobile only)
  const onPointerDown = (e) => {
    if (!isMobile || pendingOrder) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!isDragging || !isMobile) return;
    setDragPos({ x: e.clientX - dragStartPos.current.x, y: 0 });
  };
  const onPointerUp = () => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);
    if      (dragPos.x >  100) handleChoice('B', 'right');
    else if (dragPos.x < -100) handleChoice('A', 'left');
    else setDragPos({ x: 0, y: 0 });
  };

  // Swipe-up confirm drawer
  const onConfirmDown = (e) => {
    if (!pendingOrder) return;
    confirmDragStart.current = e.clientY;
    setConfirmDrag(0);
    if (e.currentTarget?.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onConfirmMove = (e) => {
    if (!pendingOrder || confirmDragStart.current === 0) return;
    const delta = e.clientY - confirmDragStart.current;
    setConfirmDrag(Math.min(0, delta));
  };
  const onConfirmUp = (e) => {
    if (e?.currentTarget?.releasePointerCapture && e.pointerId !== undefined) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    }
    if (confirmDragStart.current === 0) return;
    const shouldConfirm = confirmDrag < -80;
    confirmDragStart.current = 0;
    if (shouldConfirm) executeOrder();
    else setConfirmDrag(0);
  };

  // Mobile card transform values
  const rotation      = dragPos.x * 0.1;
  const isSwipingRight = dragPos.x > 20;
  const isSwipingLeft  = dragPos.x < -20;
  const swipeOpacity   = Math.min(Math.abs(dragPos.x) / 100, 1);
  const cardStyle = {
    transform:  `translate(${dragPos.x}px, ${dragPos.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    touchAction: 'none',
  };

  // Convenience — current asset's positions
  const activePosition  = positions.find(p => p.asset.ticker === selectedAsset.ticker && p.duration === activeDuration);
  const activePositions = positions.filter(p => p.asset.ticker === selectedAsset.ticker && p.duration === activeDuration);

  // ── Desktop sub-components (close over state) ────────────────────────────────
  const HeaderNav = () => (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white md:bg-transparent md:border-b-0">
      <div className="flex items-center gap-3">
        <div className="bg-neutral-900 text-white px-3 py-1.5 rounded-md font-black text-[10px] tracking-widest flex items-center shadow-sm">PLUNK</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setCurrentView('deposit')} className="bg-white px-3 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5 shadow-sm hover:bg-neutral-50 transition-all text-sm md:text-xs">
          <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest hidden sm:inline-block">Bal</span>
          <span className="text-neutral-900 font-black tabular-nums">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </button>
        <button onClick={() => setCurrentView('portfolio')} className={`p-2 rounded-full transition-colors ${currentView === 'portfolio' ? 'bg-neutral-900 text-white' : 'text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-sm'}`}>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </button>
        <button onClick={() => setCurrentView('profile')} className={`p-2 rounded-full transition-colors ${currentView === 'profile' ? 'bg-neutral-900 text-white' : 'text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-sm'}`}>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </button>
      </div>
    </div>
  );

  const MarketSelectorPanel = () => (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6 md:hidden">
        <button onClick={() => setCurrentView('trade')} className="p-2 rounded-full border border-neutral-200 bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-neutral-900 font-black tracking-tight text-2xl">Markets</h2>
      </div>
      <div className="flex justify-between items-center mb-4 hidden md:flex px-1">
        <h2 className="text-neutral-900 font-black tracking-tight text-xl">Select Market</h2>
      </div>
      <div className="flex bg-neutral-100 p-1 rounded-xl mb-3 border border-neutral-200">
        <button onClick={() => { setActiveCategory('crypto'); handleAssetSelect(marketData['crypto'][0]); }} className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all ${activeCategory === 'crypto' ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Crypto</button>
        <button onClick={() => { setActiveCategory('us');     handleAssetSelect(marketData['us'][0]);     }} className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all ${activeCategory === 'us'     ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>US Equities</button>
        <button onClick={() => { setActiveCategory('asia');   handleAssetSelect(marketData['asia'][0]);   }} className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all ${activeCategory === 'asia'   ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Asian Eq</button>
      </div>
      <div className="flex bg-neutral-100 p-1 rounded-xl mb-5 border border-neutral-200">
        <button onClick={() => changeDuration('5m')}  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeDuration === '5m'  ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>5 Min</button>
        <button onClick={() => changeDuration('15m')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeDuration === '15m' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>15 Min</button>
        <button onClick={() => changeDuration('eod')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeDuration === 'eod' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Close (EOD)</button>
      </div>
      <div className="flex flex-col gap-2">
        {marketData[activeCategory].map(asset => (
          <button key={asset.ticker} onClick={() => handleAssetSelect(asset)} className={`flex items-center justify-between p-3 bg-white border rounded-xl transition-all ${selectedAsset.ticker === asset.ticker ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900/10' : 'border-neutral-200 shadow-sm hover:border-neutral-400'}`}>
            <div className="flex items-center gap-3">
              <AssetIcon asset={asset} />
              <div className="text-left">
                <div className="font-bold text-neutral-900 tracking-tight text-sm">{asset.ticker}</div>
                <div className="text-[10px] text-neutral-500 font-medium">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-neutral-900 text-xs tabular-nums">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-[9px] text-neutral-500 font-bold mt-0.5"><span className={(liveOdds[asset.ticker] ?? asset.odds) > 50 ? 'text-green-600' : 'text-neutral-900'}>{Math.round(liveOdds[asset.ticker] ?? asset.odds)}%</span> / <span className={100 - (liveOdds[asset.ticker] ?? asset.odds) > 50 ? 'text-red-500' : 'text-neutral-900'}>{100 - Math.round(liveOdds[asset.ticker] ?? asset.odds)}%</span></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const PortfolioView = () => {
    const activeTab = portfolioActiveTab;
    const setActiveTab = setPortfolioActiveTab;
    return (
      <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar z-10 bg-[#fdfcf8] relative">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-neutral-900 font-black tracking-tight text-3xl md:text-4xl">Portfolio</h2>
          <button onClick={() => setCurrentView('trade')} className="bg-white border border-neutral-200 text-neutral-900 font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
            Back to Trading
          </button>
        </div>
        <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 md:p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs uppercase font-bold text-neutral-500 tracking-widest mb-1">Total Balance</div>
          <div className="text-5xl font-black text-neutral-900 tabular-nums mb-6">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="flex gap-4">
            <button onClick={() => setCurrentView('deposit')} className="flex-1 bg-neutral-900 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-neutral-800 transition-colors shadow-md active:translate-y-px">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Deposit
            </button>
            <button className="flex-1 bg-white border border-neutral-200 text-neutral-900 font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm active:translate-y-px">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Withdraw
            </button>
          </div>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200 w-full max-w-md">
          <button onClick={() => setActiveTab('open')}      className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'open'      ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Open Pos</button>
          <button onClick={() => setActiveTab('history')}   className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history'   ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>History</button>
          <button onClick={() => setActiveTab('transfers')} className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'transfers' ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}>Transfers</button>
        </div>
        <div className="flex flex-col gap-3 pb-6">
          {activeTab === 'open' && (
            positions.length === 0
              ? <div className="text-center py-10 text-neutral-400 font-bold text-sm border-2 border-dashed border-neutral-200 rounded-xl">No open positions.</div>
              : positions.map(pos => {
                  const pnl   = calculatePositionPnL(pos);
                  const isPos = pnl >= 0;
                  return (
                    <div key={pos.id} className="flex justify-between items-center p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-neutral-400 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-xs border ${pos.direction === 'BUY' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{pos.direction}</div>
                        <div>
                          <div className="font-bold text-sm text-neutral-900">{pos.duration.toUpperCase()} {pos.asset.ticker}</div>
                          <div className="text-[11px] font-bold text-neutral-500">${pos.size.toFixed(2)} @ ${pos.price.toFixed(4)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black text-sm ${isPos ? 'text-green-600' : 'text-red-500'}`}>{isPos ? '+' : ''}${pnl.toFixed(2)}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">Unrealized</div>
                      </div>
                    </div>
                  );
                })
          )}
          {activeTab === 'history' && mockHistory.map(trade => (
            <div key={trade.id} className="flex justify-between items-center p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-neutral-400 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-black text-xs border border-neutral-200">{trade.direction}</div>
                <div>
                  <div className="font-bold text-sm text-neutral-900">{trade.duration.toUpperCase()} {trade.asset}</div>
                  <div className="text-[11px] font-bold text-neutral-500">{trade.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-black text-sm ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>{trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}</div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">Settled</div>
              </div>
            </div>
          ))}
          {activeTab === 'transfers' && mockTransfers.map(transfer => (
            <div key={transfer.id} className="flex justify-between items-center p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-neutral-400 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center border border-neutral-200">
                  {transfer.amount > 0
                    ? <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
                    : <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>}
                </div>
                <div>
                  <div className="font-bold text-sm text-neutral-900">{transfer.type} via {transfer.method}</div>
                  <div className="text-[11px] font-bold text-neutral-500">{transfer.date} • {transfer.status}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-black text-sm ${transfer.amount > 0 ? 'text-green-600' : 'text-neutral-900'}`}>{transfer.amount > 0 ? '+' : ''}${Math.abs(transfer.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProfileView = () => (
    <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar z-10 bg-[#fdfcf8] relative">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-neutral-900 font-black tracking-tight text-3xl md:text-4xl">Profile</h2>
        <button onClick={() => setCurrentView('trade')} className="bg-white border border-neutral-200 text-neutral-900 font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
          Back to Trading
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-[2rem] p-6 md:p-8 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-neutral-900 rounded-full text-white flex items-center justify-center font-black text-2xl shadow-md">K</div>
          <div>
            <div className="text-xl font-black text-neutral-900">Kevin</div>
            <div className="text-sm font-bold text-neutral-500">Account Profile</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Nickname</div>
            <div className="text-lg font-black text-neutral-900">Kevin</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Email</div>
            <div className="text-lg font-black text-neutral-900 break-all">derp@plunk.fi</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Crypto Address</div>
            <div className="text-lg font-black text-neutral-900 break-all">0x7f3A9cB1E4D8F2609A12C53b91d7E6aa41F2c8D4</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
              <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">30D Volume</div>
              <div className="text-lg font-black text-neutral-900">$62,601</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
              <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Fee Tier</div>
              <div className="text-lg font-black text-neutral-900">VIP 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ExecutionPanel = () => (
    <div className="p-5 flex flex-col gap-4 bg-white md:bg-transparent h-full">
      <div className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
            Trade Size {hotkeysEnabled && <span className="text-neutral-300 font-normal ml-1 hidden lg:inline-block">(Shift 1% · ⌘Shift 10%)</span>}
          </span>
          {sizeAdjustCue && (
            <div className={`pointer-events-none flex items-center gap-1 text-[10px] font-black tracking-widest uppercase animate-bounce ${sizeAdjustCue.direction === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              <span>{sizeAdjustCue.direction === 'up' ? '↑' : '↓'}</span>
              <span>{Math.round(sizeAdjustCue.pct * 100)}%</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSizePercent(0.25)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">25%</button>
          <button onClick={() => setSizePercent(0.50)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">50%</button>
          <button onClick={() => setSizePercent(1.00)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">100%</button>
          <div className="flex-[1.5] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-neutral-500 text-sm font-bold">$</span></div>
            <input type="number" value={tradeSize || ''} onChange={e => setTradeSize(Number(e.target.value))} className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl block pl-7 pr-3 py-2.5 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all outline-none shadow-sm" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => triggerOrderIntent('SELL')} className="flex-1 py-4 flex flex-col items-center justify-center text-red-500 bg-white hover:bg-red-50 transition-colors border border-neutral-200 shadow-sm rounded-xl active:bg-red-100 active:translate-y-px">
          <span className="text-[10px] font-black tracking-widest uppercase mb-0.5 opacity-80 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Sell</span>
          <span className="text-xl font-black tracking-tighter text-neutral-900">${formattedSell}</span>
        </button>
        <button onClick={() => triggerOrderIntent('BUY')} className="flex-1 py-4 flex flex-col items-center justify-center text-green-600 bg-white hover:bg-green-50 transition-colors border border-neutral-200 shadow-sm rounded-xl active:bg-green-100 active:translate-y-px">
          <span className="text-[10px] font-black tracking-widest uppercase mb-0.5 opacity-80 flex items-center gap-1">Buy<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span>
          <span className="text-xl font-black tracking-tighter text-neutral-900">${formattedBuy}</span>
        </button>
      </div>
      <div className="mt-4 flex-1 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3 border-b border-neutral-200 pb-2">Open Positions</h3>
        {positions.length === 0
          ? <div className="text-center py-8 text-neutral-400 text-xs font-bold">No open positions.</div>
          : <div className="flex flex-col gap-2">
              {positions.map(pos => {
                const pnl   = calculatePositionPnL(pos);
                const isPos = pnl >= 0;
                return (
                  <div key={pos.id} className="bg-white border border-neutral-200 p-3 rounded-xl shadow-sm text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-neutral-900">{pos.duration.toUpperCase()} {pos.asset.ticker}</span>
                      <span className={`font-black text-[10px] px-2 py-0.5 rounded border ${pos.direction === 'BUY' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{pos.direction}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase">Size / Entry</div>
                        <div className="font-bold text-neutral-900">${pos.size.toFixed(2)} @ ${pos.price.toFixed(4)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase">Unrealized PnL</div>
                        <div className={`font-black ${isPos ? 'text-green-600' : 'text-red-500'}`}>{isPos ? '+' : ''}${pnl.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );

  // ── Tutorial tooltips ───────────────────────────────────────────────────────
  const TUTORIAL_TOTAL = 5;
  const tutorialContent = [
    null,
    {
      title: isMobile ? 'Swipe to Trade' : 'Use Hotkeys',
      body: isMobile
        ? 'Swipe to trade: swipe right to buy YES, swipe left to buy NO, and swipe up to confirm your order.'
        : 'Use hotkeys to navigate and trade faster: ↑ buy yes, ↓ buy no, ← → switch markets, Shift+←→ change duration, and Shift/⌘Shift+↑↓ adjust size. You can find this cheat sheet in the bottom-right corner.'
    },
    { title: 'Markets', body: 'Switch between Crypto, US, and Asian markets, then pick the contract you want to trade.' },
    { title: 'Timeframe', body: 'Pick the duration you want to trade. The countdown is synced to real time and contracts settle when it hits zero.' },
    { title: 'Sizing', body: isMobile ? 'Set your trade size above the card before you swipe into a position.' : 'Set your trade size in the right panel before entering the trade.' },
    { title: 'Confirm', body: isMobile ? 'After choosing a side, the confirmation screen takes over so you can review and swipe up anywhere to place the order.' : 'Review the confirmation screen, then press Enter or click the Buy Yes / Buy No action button to place the trade.' },
  ];
  // Position classes per step: [mobile, desktop]
  const tipPosition = [
    '',
    'top-20 left-1/2 -translate-x-1/2 md:top-24 md:left-1/2 md:-translate-x-1/2',  // welcome: top center
    'top-20 left-4 md:top-24 md:left-8',                                              // markets: top left
    'top-20 right-4 md:top-1/3 md:left-1/2 md:-translate-x-1/2',                     // timeframe: center
    'bottom-24 left-1/2 -translate-x-1/2 md:bottom-16 md:right-8 md:left-auto md:translate-x-0', // trade: bottom right
    'top-20 right-4 md:top-24 md:right-8',                                            // settlement: top right
  ];

  const tutorialOverlay = tutorialStep > 0 && tutorialStep <= TUTORIAL_TOTAL ? (
    <div className={`fixed z-[1000] ${tipPosition[tutorialStep]}`}>
      <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl px-5 py-4 max-w-[280px] border border-neutral-700">
        <button onClick={() => setTutorialStep(0)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="flex gap-1 mb-3">
          {Array.from({ length: TUTORIAL_TOTAL }, (_, i) => (
            <div key={i} className={`h-0.5 flex-1 rounded-full ${i < tutorialStep ? 'bg-white' : 'bg-neutral-600'}`}></div>
          ))}
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">{tutorialContent[tutorialStep]?.title}</div>
        <p className="text-[13px] text-neutral-200 font-medium leading-snug mb-3">{tutorialContent[tutorialStep]?.body}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-neutral-500">{tutorialStep}/{TUTORIAL_TOTAL} · Esc to skip</span>
          <button
            onClick={() => setTutorialStep(s => s < TUTORIAL_TOTAL ? s + 1 : 0)}
            className="text-xs font-bold bg-white text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors active:scale-95"
          >
            {tutorialStep < TUTORIAL_TOTAL ? 'Next' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // ── Persistent hotkeys cheat sheet (desktop only) ──────────────────────────
  const hotkeysCheatSheet = !isMobile && currentView !== 'login' ? (
    <div className="fixed bottom-4 right-4 z-50 bg-neutral-900/60 backdrop-blur-sm text-white/70 rounded-xl px-3 py-2.5 text-[10px] font-mono pointer-events-none select-none hidden md:block">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-4"><span className="text-white/40">buy/sell</span><span>↑ ↓</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/40">assets</span><span>← →</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/40">size</span><span>Shift / ⌘Shift</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/40">duration</span><span>Shift+ ←→</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/40">category</span><span>⌘Shift+ ←→</span></div>
        <div className="flex justify-between gap-4"><span className="text-white/40">confirm</span><span>Enter</span></div>
      </div>
    </div>
  ) : null;

  // ── Shared style ─────────────────────────────────────────────────────────────
  const sharedStyle = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e5e5; border-radius: 10px; }
    .dot-pattern { background-image: radial-gradient(circle, #000000 1px, transparent 1px); background-size: 16px 16px; background-position: center; }
  `;

  // ════════════════════════════════════════════════════════════════════════════
  // MOBILE RENDER
  // ════════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#efece5] flex items-center justify-center p-4 font-sans selection:bg-black/10">
        <div className="w-full max-w-[400px] h-[800px] max-h-[90vh] bg-[#fdfcf8] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative border border-neutral-300">

          {/* Status bar */}
          <div className="flex justify-between items-center px-6 pt-4 pb-2 text-black text-xs font-semibold z-20 bg-[#fdfcf8]">
            <span>9:41</span>
            <div className="flex space-x-2 items-center text-neutral-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4v16h-16l16-16z"/></svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 4h-3v-2h-4v2h-3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm-2 16h-6v-12h6v12z"/></svg>
            </div>
          </div>

          {/* App header */}
          {currentView !== 'login' && (
            <div className="px-4 py-3 flex items-center z-20 bg-[#fdfcf8] border-b border-neutral-200">
              <div className="flex-1 flex justify-start">
                <button onClick={() => setCurrentView('products')} disabled={currentView === 'products'} className={`p-1.5 rounded-full transition-colors ${currentView === 'products' ? 'opacity-0 cursor-default' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
              </div>
              <div className="flex-none flex items-center gap-3">
                <div className="bg-neutral-900 text-white px-3 py-1.5 rounded-md font-black text-[10px] tracking-widest flex items-center shadow-sm border border-neutral-800">PLUNK</div>
                <button onClick={() => setCurrentView('deposit')} className="bg-white px-3 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5 shadow-sm hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Bal</span>
                  <span className="text-black font-black text-xs tabular-nums">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </button>
              </div>
              <div className="flex-1 flex justify-end gap-1">
                <button onClick={() => setCurrentView('positions')} className={`p-1.5 rounded-full transition-colors ${currentView === 'positions' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z"/></svg>
                </button>
                <button onClick={() => setCurrentView('profile')} className={`p-1.5 rounded-full transition-colors ${currentView === 'profile' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'}`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* View router */}
          <div className="flex-1 relative flex flex-col overflow-hidden">

            {/* ── Login ── */}
            {currentView === 'login' && (
              <div className="flex-1 flex flex-col p-6 bg-[#fdfcf8] items-center justify-center relative z-10">
                <div className="w-full max-w-sm flex flex-col gap-6">
                  <div className="text-left mb-6">
                    <div className="bg-neutral-900 text-white px-5 py-2 rounded-lg font-black text-xl tracking-widest inline-block mb-6 shadow-md border border-neutral-800">PLUNK</div>
                    <h1 className="text-[2.5rem] font-black tracking-tighter text-black leading-[1.05] mb-4 uppercase">Markets<br/>Without<br/>Limits.</h1>
                    <p className="text-neutral-600 font-bold text-sm leading-relaxed pr-6">Bet on anything with size at the best all-in price across any prediction market.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { setCurrentView('products'); setTutorialStep(1); }} className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-black font-bold py-3.5 rounded-xl hover:bg-neutral-50 hover:shadow-md transition-all shadow-sm active:scale-[0.98]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                    <button onClick={() => { setCurrentView('products'); setTutorialStep(1); }} className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-black font-bold py-3.5 rounded-xl hover:bg-neutral-50 hover:shadow-md transition-all shadow-sm active:scale-[0.98]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                      Connect Wallet
                    </button>
                    <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-neutral-200"></div><span className="flex-shrink-0 mx-4 text-neutral-400 text-xs font-bold uppercase tracking-wider">Or</span><div className="flex-grow border-t border-neutral-200"></div></div>
                    <div className="flex gap-2">
                      <input type="email" placeholder="Email address" className="flex-1 bg-white border border-neutral-200 text-black text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400 outline-none shadow-sm transition-all" />
                      <button onClick={() => { setCurrentView('products'); setTutorialStep(1); }} className="bg-neutral-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-sm active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 dot-pattern z-[-1] pointer-events-none opacity-40"></div>
              </div>
            )}

            {/* ── Profile ── */}
            {currentView === 'profile' && (
              <div className="flex-1 flex flex-col p-6 bg-[#fdfcf8] overflow-y-auto custom-scrollbar z-10 relative">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setCurrentView('trade')} className="p-2 rounded-full border border-neutral-200 bg-white shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <h2 className="text-black font-black tracking-tight text-3xl">Profile</h2>
                </div>

                <div className="bg-white border border-neutral-200 rounded-[2rem] p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-neutral-900 rounded-full text-white flex items-center justify-center font-black text-2xl shadow-md">K</div>
                    <div>
                      <div className="text-xl font-black text-black">Kevin</div>
                      <div className="text-sm font-bold text-neutral-500">Account Profile</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Nickname</div>
                      <div className="text-lg font-black text-neutral-900">Kevin</div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Email</div>
                      <div className="text-lg font-black text-neutral-900 break-all">derp@plunk.fi</div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Crypto Address</div>
                      <div className="text-lg font-black text-neutral-900 break-all">0x7f3A9cB1E4D8F2609A12C53b91d7E6aa41F2c8D4</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                        <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">30D Volume</div>
                        <div className="text-lg font-black text-neutral-900">$62,601</div>
                      </div>
                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                        <div className="text-[11px] uppercase tracking-[0.2em] font-black text-neutral-500 mb-1">Fee Tier</div>
                        <div className="text-lg font-black text-neutral-900">VIP 3</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Positions ── */}
            {currentView === 'positions' && (
              <div className="flex-1 flex flex-col p-6 bg-[#fdfcf8] overflow-y-auto custom-scrollbar z-10 relative">
                <h2 className="text-neutral-900 font-black tracking-tight text-3xl mb-4">Portfolio</h2>
                <div className="flex bg-[#f3f1e9] p-1 rounded-xl mb-6 border border-neutral-200 shadow-inner">
                  <button onClick={() => setPortfolioTab('positions')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${portfolioTab === 'positions' ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Open Positions</button>
                  <button onClick={() => setPortfolioTab('orders')}    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${portfolioTab === 'orders'    ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Order History</button>
                </div>
                {portfolioTab === 'positions' ? (
                  positions.length === 0
                    ? <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10"><svg className="w-16 h-16 text-neutral-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg><p className="font-bold text-neutral-600 text-sm">No open positions.</p><p className="font-medium text-neutral-400 text-xs mt-1">Execute a trade to see it here.</p></div>
                    : <div className="flex flex-col gap-4">
                        {positions.map(p => {
                          const isCurrentAsset = p.asset.ticker === selectedAsset.ticker && p.duration === activeDuration;
                          let currentP = p.price;
                          if (isCurrentAsset) { currentP = p.direction === 'BUY' ? optionBuyPrice : optionSellPrice; }
                          else { currentP = Math.max(0.01, Math.min(0.99, p.price + (Math.random() * 0.1 - 0.05))); }
                          const pnl   = (currentP - p.price) * p.shares;
                          const isPos = pnl >= 0;
                          return (
                            <div key={p.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                <div className="font-black text-neutral-900 text-lg">{p.duration.toUpperCase()} {p.asset.ticker}</div>
                                <div className={`font-black text-xs px-2.5 py-1 rounded-md tracking-widest uppercase ${p.direction === 'BUY' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{p.direction}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm font-bold mt-2">
                                <div><div className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Net Size</div><div className="text-neutral-900">${p.size.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
                                <div><div className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Avg Entry</div><div className="text-neutral-900">${p.price.toFixed(4)}</div></div>
                                <div><div className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Current Mid</div><div className="text-neutral-900">${currentP.toFixed(4)}</div></div>
                                <div><div className="text-neutral-400 text-[10px] uppercase tracking-widest mb-1">Unrealized PnL</div><div className={`text-base font-black ${isPos ? 'text-green-600' : 'text-red-600'}`}>{isPos ? '+' : ''}${pnl.toFixed(2)}</div></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                ) : (
                  orders.length === 0
                    ? <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10"><svg className="w-16 h-16 text-neutral-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p className="font-bold text-neutral-600 text-sm">No order history.</p></div>
                    : <div className="flex flex-col gap-3">
                        {orders.map(o => (
                          <div key={o.id} className="flex justify-between items-center p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-black text-[10px] px-1.5 py-0.5 rounded tracking-widest uppercase ${o.direction === 'BUY' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{o.direction}</span>
                                <span className="font-bold text-sm text-neutral-900">{o.duration.toUpperCase()} {o.asset.ticker}</span>
                              </div>
                              <div className="text-[11px] font-bold text-neutral-400">{o.timestamp.toLocaleDateString()} {o.timestamp.toLocaleTimeString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-sm text-neutral-900">${o.size.toFixed(2)}</div>
                              <div className="text-[11px] font-bold text-neutral-500">Fill @ ${o.price.toFixed(4)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                )}
              </div>
            )}

            {/* ── Deposit ── */}
            {currentView === 'deposit' && (
              <div className="flex-1 flex flex-col p-6 bg-[#fdfcf8] overflow-y-auto custom-scrollbar z-10 relative">
                <h2 className="text-black font-black tracking-tight text-3xl mb-6">Deposit</h2>
                <div className="flex bg-[#f3f1e9] p-1 rounded-xl mb-6 border border-neutral-200 shadow-inner">
                  <button onClick={() => setDepositMethod('crypto')} className={`flex-1 py-2.5 px-1 text-sm font-bold rounded-lg transition-all ${depositMethod === 'crypto' ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Crypto</button>
                  <button onClick={() => setDepositMethod('bank')}   className={`flex-1 py-2.5 px-1 text-sm font-bold rounded-lg transition-all ${depositMethod === 'bank'   ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Bank (ACH)</button>
                </div>
                {depositMethod === 'crypto' ? (
                  <div className="flex flex-col gap-6">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                      <div className="text-center mb-6">
                        <div className="inline-block p-4 border border-neutral-200 rounded-xl bg-neutral-50 mb-4 shadow-sm"><svg className="w-24 h-24 text-neutral-800" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm0 6h4v4H4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z"/></svg></div>
                        <div className="text-xs uppercase font-bold tracking-widest text-neutral-400 mb-2">Your Deposit Address</div>
                        <div className="font-mono font-black text-xs break-all bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex justify-between items-center gap-2">0x71C...9A23<span className="text-neutral-700 font-bold cursor-pointer hover:bg-neutral-100 bg-white border border-neutral-200 px-2 py-1 rounded text-[10px] uppercase tracking-widest shadow-sm transition-transform active:scale-95">Copy</span></div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-xs font-bold mb-2 uppercase tracking-widest text-neutral-400">Supported Assets</div>
                        <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors shadow-sm cursor-pointer group"><div className="w-8 h-8 rounded-full bg-[#26A17B] border border-black/5 text-white flex items-center justify-center font-bold text-[10px]">USDT</div><div className="font-bold text-sm text-neutral-800">Tether (USDT)</div><div className="ml-auto text-xs text-neutral-500 font-bold border border-neutral-200 px-2 py-1 rounded shadow-sm group-hover:bg-neutral-50 transition-colors">ERC20</div></div>
                        <div className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors shadow-sm cursor-pointer group"><div className="w-8 h-8 rounded-full bg-[#2775CA] border border-black/5 text-white flex items-center justify-center font-bold text-[10px]">USDC</div><div className="font-bold text-sm text-neutral-800">USD Coin (USDC)</div><div className="ml-auto text-xs text-neutral-500 font-bold border border-neutral-200 px-2 py-1 rounded shadow-sm group-hover:bg-neutral-50 transition-colors">ERC20</div></div>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.98]"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>Connect Wallet directly</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm text-center">
                      <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"><svg className="w-8 h-8 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg></div>
                      <h3 className="font-black text-xl mb-2 text-neutral-900">Instant Bank Transfers</h3>
                      <p className="text-sm font-bold text-neutral-500 mb-6">Connect your bank account to deposit USD instantly with zero fees.</p>
                      <button className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.98]"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>Link Bank via Plaid</button>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white border border-neutral-200 rounded-xl text-black shadow-sm"><svg className="w-5 h-5 shrink-0 mt-0.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p className="text-xs font-bold leading-relaxed text-neutral-500">Transfers are settled instantly. Max daily limit for linked bank accounts is $50,000.</p></div>
                  </div>
                )}
              </div>
            )}

            {/* ── Products (market selector) ── */}
            {currentView === 'products' && (
              <div className="flex-1 flex flex-col px-4 pt-6 pb-6 overflow-y-auto custom-scrollbar bg-[#fdfcf8]">
                <h2 className="text-black font-black tracking-tight text-3xl mb-6 px-1">Select Market</h2>
                <div className="flex bg-[#f3f1e9] p-1 rounded-xl mb-3 border border-neutral-200 shadow-inner">
                  <button onClick={() => { setActiveCategory('crypto'); handleAssetSelect(marketData['crypto'][0]); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeCategory === 'crypto' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Crypto</button>
                  <button onClick={() => { setActiveCategory('us');     handleAssetSelect(marketData['us'][0]);     }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeCategory === 'us'     ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-black'}`}>US</button>
                  <button onClick={() => { setActiveCategory('asia');   handleAssetSelect(marketData['asia'][0]);   }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeCategory === 'asia'   ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Asia</button>
                </div>
                <div className="flex bg-[#f3f1e9] p-1 rounded-xl mb-6 border border-neutral-200 shadow-inner">
                  <button onClick={() => changeDuration('5m')}  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeDuration === '5m'  ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>5 Min</button>
                  <button onClick={() => changeDuration('15m')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeDuration === '15m' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>15 Min</button>
                  <button onClick={() => changeDuration('eod')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeDuration === 'eod' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'}`}>Close (EOD)</button>
                </div>
                <div className="flex flex-col gap-3">
                  {marketData[activeCategory].map(asset => (
                    <button key={asset.ticker} onClick={() => handleAssetSelect(asset)} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-neutral-300 hover:shadow-md transition-all active:scale-[0.98]">
                      <div className="flex items-center gap-3"><AssetIcon asset={asset} /><div className="text-left"><div className="font-bold text-neutral-900 tracking-tight text-sm">{asset.ticker}</div><div className="text-xs text-neutral-500 font-medium">{asset.name}</div></div></div>
                      <div className="text-right"><div className="font-black text-neutral-900 text-sm tabular-nums">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-[10px] text-neutral-500 font-bold mt-0.5">Odds: <span className={(liveOdds[asset.ticker] ?? asset.odds) > 50 ? 'text-green-600' : 'text-neutral-800'}>{Math.round(liveOdds[asset.ticker] ?? asset.odds)}%</span> / <span className={100 - (liveOdds[asset.ticker] ?? asset.odds) > 50 ? 'text-red-500' : 'text-neutral-800'}>{100 - Math.round(liveOdds[asset.ticker] ?? asset.odds)}%</span></div></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Trade (swipe card) ── */}
            {currentView === 'trade' && (
              <div className="flex-1 flex flex-col relative h-full bg-[#fdfcf8]">
                {/* Size controls */}
                <div className="px-5 pb-2 pt-5 flex flex-col z-10 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end px-1"><span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Trade Size <span className="text-neutral-300 font-normal ml-1 hidden sm:inline-block">(Shift 1% · ⌘Shift 10%)</span></span></div>
                    <div className="flex gap-2">
                      <button onClick={() => setSizePercent(0.25)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-800 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">25%</button>
                      <button onClick={() => setSizePercent(0.50)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-800 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">50%</button>
                      <button onClick={() => setSizePercent(1.00)} className="flex-1 bg-white hover:bg-neutral-50 text-neutral-800 font-bold py-2.5 rounded-xl text-xs transition-colors border border-neutral-200 shadow-sm">100%</button>
                      <div className="flex-[1.5] relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-neutral-400 text-sm font-bold">$</span></div>
                        <input type="number" value={tradeSize || ''} onChange={e => setTradeSize(Number(e.target.value))} className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl block pl-7 pr-3 py-2.5 focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400 transition-all outline-none shadow-sm" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 top-[110px] bottom-0 dot-pattern z-0 pointer-events-none"></div>

                <div className="flex-1 relative mx-5 mb-5 mt-4 z-10" ref={containerRef}>
                  {/* Swipe card */}
                  <div className="absolute inset-0 bg-white rounded-3xl border border-neutral-200 ring-1 ring-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden cursor-grab active:cursor-grabbing will-change-transform"
                    style={cardStyle} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

                    {isSwipingLeft  && <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 bg-white/90 backdrop-blur-sm font-black text-2xl px-4 py-2 rounded-xl rotate-12 z-20 tracking-wider pointer-events-none shadow-sm" style={{ opacity: swipeOpacity }}>NO<br/><span className="text-lg">${formattedSell}</span></div>}
                    {isSwipingRight && <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 bg-white/90 backdrop-blur-sm font-black text-2xl px-4 py-2 rounded-xl -rotate-12 z-20 tracking-wider pointer-events-none shadow-sm" style={{ opacity: swipeOpacity }}>YES<br/><span className="text-lg">${formattedBuy}</span></div>}

                    {/* Price display */}
                    <div className="flex-1 flex flex-col items-center justify-center pt-8 w-full">
                      <div className="flex flex-col items-center gap-1.5 mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-neutral-800 text-[11px] uppercase font-black tracking-widest flex items-center gap-1"><span className="text-neutral-300 hidden sm:inline-block">←</span>{activeDuration.toUpperCase()} {selectedAsset.ticker} OPTION<span className="text-neutral-300 hidden sm:inline-block">→</span></p>
                          <span className="text-neutral-300">•</span>
                          <p className="text-neutral-500 text-[11px] uppercase font-bold tracking-widest">REF: ${formatAssetPrice(referencePrice, referencePrice)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 px-4 mt-2">
                        <span className="text-neutral-400 text-3xl font-light">$</span>
                        <h2 className="text-6xl font-black text-neutral-900 tracking-tighter tabular-nums">{formatAssetPrice(currentValue, referencePrice)}</h2>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div><span className="text-neutral-800 text-xs font-mono font-bold tracking-wider tabular-nums">{formatTime(timeLeft)}</span></div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm text-xs font-bold ${isPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                          {isPositive ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>}
                          <span>{formatAssetPrice(Math.abs(difference), referencePrice)} ({Math.abs(percentChange).toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="h-40 w-full mt-2 pointer-events-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                          <defs><linearGradient id="mColorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.2}/><stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.02}/></linearGradient></defs>
                          <YAxis domain={['auto', 'auto']} hide />
                          <ReferenceLine y={referencePrice} stroke="#a3a3a3" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} label={{ position: 'insideTopLeft', value: 'REF', fill: '#737373', fontSize: 10, fontWeight: 'bold', opacity: 0.8 }} />
                          <Area type="monotone" dataKey="value" stroke={isPositive ? '#34d399' : '#fb7185'} strokeWidth={3} fillOpacity={1} fill="url(#mColorValue)" isAnimationActive={true} animationDuration={300} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Buy / Sell buttons */}
                    <div className="flex border-t border-neutral-200 bg-white">
                      <button onClick={e => { e.stopPropagation(); handleChoice('A', 'left');  }} className="flex-1 py-4 flex flex-col items-center justify-center text-red-500 hover:bg-red-50 transition-colors border-r border-neutral-200 active:bg-red-100"><span className="text-[10px] font-black tracking-widest uppercase mb-0.5 opacity-80 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Buy No</span><span className="text-xl font-black tracking-tighter text-neutral-900">${formattedSell}</span></button>
                      <button onClick={e => { e.stopPropagation(); handleChoice('B', 'right'); }} className="flex-1 py-4 flex flex-col items-center justify-center text-green-700 hover:bg-green-50 transition-colors active:bg-green-100"><span className="text-[10px] font-black tracking-widest uppercase mb-0.5 opacity-80 flex items-center gap-1">Buy Yes<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span><span className="text-xl font-black tracking-tighter">${formattedBuy}</span></button>
                    </div>

                    {/* Active position indicator */}
                    {activePositions.length > 0 && (
                      <div className="bg-neutral-50 p-3 border-t border-neutral-200 flex flex-col gap-1.5">
                        <div className="font-black text-neutral-400 uppercase tracking-widest text-[9px] mb-1">Your Net Position</div>
                        {activePositions.map(p => {
                          const cp  = p.direction === 'BUY' ? optionBuyPrice : optionSellPrice;
                          const pnl = (cp - p.price) * p.shares;
                          return (
                            <div key={p.id} className="flex justify-between items-center bg-white border border-neutral-200 rounded-lg py-2.5 px-3 shadow-sm">
                              <div className="flex items-center gap-2.5"><span className={`font-black text-[10px] px-2 py-0.5 rounded border ${p.direction === 'BUY' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>{p.direction}</span><div className="flex flex-col"><span className="text-neutral-900 font-bold text-xs">${p.size.toFixed(2)}</span><span className="text-neutral-400 font-bold text-[10px]">Avg ${p.price.toFixed(4)}</span></div></div>
                              <div className="flex flex-col items-end"><span className={`font-black text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</span><span className="text-neutral-400 font-bold text-[10px]">Unrealized</span></div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
          {pendingOrder && currentView === 'trade' && (
            <div
              className="absolute inset-0 z-[120] bg-neutral-950/75 backdrop-blur-md flex flex-col overflow-hidden pointer-events-auto touch-none"
              onPointerDown={onConfirmDown}
              onPointerMove={onConfirmMove}
              onPointerUp={onConfirmUp}
              onPointerCancel={onConfirmUp}
            >
              <div className="px-6 pt-8 pb-4 text-center">
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60 mb-2">Confirm</div>
                <h2 className="text-white text-2xl font-black tracking-tight">Swipe up to confirm order</h2>
                <p className="text-white/70 text-sm font-medium mt-2">Swipe up anywhere on this page to place the trade.</p>
              </div>
              <div className="flex-1 flex flex-col justify-end px-4 pb-4 select-none" style={{ transform: `translateY(${Math.min(0, confirmDrag * 0.35)}px)`, transition: confirmDrag === 0 ? 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                <div className="bg-white rounded-[2rem] p-6 pb-6 border border-white/60 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-2xl text-neutral-900 tracking-tight">Confirm Order</h3>
                    <button onClick={(e) => { e.stopPropagation(); setPendingOrder(null); }} className="p-2 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                  </div>
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 mb-6 shadow-inner">
                    <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Contract</span><span className="font-black text-base text-neutral-900">{pendingOrder.duration.toUpperCase()} {pendingOrder.asset.ticker}</span></div>
                    <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Side</span><span className={`font-black text-sm px-2.5 py-0.5 rounded-md ${pendingOrder.direction === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{pendingOrder.direction === 'BUY' ? 'YES' : 'NO'}</span></div>
                    <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Size</span><span className="font-black text-base text-neutral-900">${pendingOrder.size.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Avg Price</span><span className="font-black text-base text-neutral-900">${pendingOrder.formattedPrice}</span></div>
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-200"><span className="text-neutral-900 font-black text-sm uppercase tracking-widest">Est. Payout</span><span className="font-black text-2xl text-green-600">${(pendingOrder.size / pendingOrder.price).toFixed(2)}</span></div>
                  </div>
                  <div className={`rounded-2xl border px-5 py-4 text-center shadow-md transition-transform ${pendingOrder.direction === 'BUY' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'}`} style={{ transform: `translateY(${Math.min(0, confirmDrag * 0.25)}px)`, transition: confirmDrag === 0 ? 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] opacity-80 mb-1">Swipe Up</div>
                    <div className="text-xl font-black tracking-tight">{pendingOrder.direction === 'BUY' ? 'Buy Yes' : 'Buy No'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {activeNotice && (
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-[999] max-w-[360px] w-[calc(100vw-2rem)] rounded-2xl px-4 py-3 shadow-2xl border backdrop-blur-sm ${activeNotice.type === 'error' ? 'bg-red-600 text-white border-red-500' : activeNotice.type === 'success' ? 'bg-neutral-900 text-white border-neutral-800' : 'bg-white/95 text-neutral-900 border-neutral-200'}`}>
            <div className="text-xs font-black uppercase tracking-widest opacity-80">{activeNotice.title}</div>
            <div className={`text-sm font-bold mt-1 ${activeNotice.type === 'error' ? 'text-white' : activeNotice.type === 'success' ? 'text-white/85' : 'text-neutral-600'}`}>{activeNotice.body}</div>
          </div>
        )}
        {tutorialOverlay}
      {hotkeysCheatSheet}
        <style dangerouslySetInnerHTML={{ __html: sharedStyle }} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DESKTOP RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#efece5] flex items-center justify-center md:p-6 font-sans selection:bg-neutral-900/10">

      {currentView === 'login' ? (
        <div className="w-full max-w-[400px] h-[100dvh] md:h-auto md:min-h-[600px] bg-[#fdfcf8] md:rounded-[2rem] shadow-2xl flex flex-col p-8 items-center justify-center relative overflow-hidden border-0 md:border-2 border-neutral-200">
          <div className="w-full max-w-sm flex flex-col gap-6 z-10 relative">
            <div className="text-left mb-6">
              <div className="bg-neutral-900 text-white px-5 py-2 rounded-lg font-black text-xl tracking-widest inline-block mb-6 shadow-md border border-neutral-800">PLUNK</div>
              <h1 className="text-[2.5rem] font-black tracking-tighter text-neutral-900 leading-[1.05] mb-4 uppercase">Markets<br/>Without<br/>Limits.</h1>
              <p className="text-neutral-600 font-bold text-sm leading-relaxed pr-6">Bet on anything with size at the best all-in price across any prediction market.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setCurrentView('trade'); setTutorialStep(1); }} className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm active:translate-y-px">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <button onClick={() => { setCurrentView('trade'); setTutorialStep(1); }} className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm active:translate-y-px">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                Connect Wallet
              </button>
            </div>
          </div>
          <div className="absolute inset-0 dot-pattern z-0 opacity-40"></div>
        </div>
      ) : (
        <div className="w-full h-[100dvh] md:max-w-[1400px] md:h-[85vh] bg-[#fdfcf8] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-0 md:border-2 border-neutral-200 relative">

          {/* Left panel — market selector */}
          <div className={`w-full md:w-[320px] bg-[#fdfcf8] border-r border-neutral-200 flex flex-col ${['trade', 'products'].includes(currentView) ? 'flex' : 'hidden'}`}>
            <MarketSelectorPanel />
          </div>

          {/* Center — chart / portfolio / profile */}
          <div className={`flex-1 relative flex flex-col bg-[#fdfcf8] overflow-hidden ${['trade', 'portfolio', 'profile'].includes(currentView) ? 'flex' : 'hidden md:flex'}`}>
            {currentView === 'portfolio' ? (
              <PortfolioView />
            ) : currentView === 'profile' ? (
              <ProfileView />
            ) : (
              <>
                <div className="absolute inset-0 dot-pattern z-0 opacity-60"></div>
                <div className="flex-1 relative mx-4 md:mx-10 my-4 md:my-8 z-10 flex flex-col">
                  <div className="flex-1 bg-white rounded-3xl border border-neutral-200 shadow-xl flex flex-col overflow-hidden relative"
                    style={{ transform: `translate(${dragPos.x}px, ${dragPos.y}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', touchAction: 'auto' }}
                    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

                    <div className="flex-1 flex flex-col items-center justify-center pt-8 md:pt-12 w-full z-10">
                      <div className="flex flex-col items-center gap-1.5 mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-neutral-900 text-[11px] uppercase font-black tracking-widest flex items-center gap-1"><span className="text-neutral-300 hidden md:inline-block">←</span>{activeDuration.toUpperCase()} {selectedAsset.ticker} OPTION<span className="text-neutral-300 hidden md:inline-block">→</span></p>
                          <span className="text-neutral-300">•</span>
                          <p className="text-neutral-500 text-[11px] uppercase font-bold tracking-widest">REF: ${formatAssetPrice(referencePrice, referencePrice)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 px-4 mt-2">
                        <span className="text-neutral-400 text-4xl font-light">$</span>
                        <h2 className="text-7xl md:text-8xl font-black text-neutral-900 tracking-tighter tabular-nums drop-shadow-sm">{formatAssetPrice(currentValue, referencePrice)}</h2>
                      </div>
                      <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-neutral-900 text-sm font-mono font-bold tracking-wider tabular-nums">{formatTime(timeLeft)}</span></div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm text-sm font-bold ${isPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}><span>{formatAssetPrice(Math.abs(difference), referencePrice)} ({Math.abs(percentChange).toFixed(2)}%)</span></div>
                      </div>
                    </div>

                    <div className="h-48 md:h-64 w-full mt-4 md:mt-8 pointer-events-none z-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                          <defs><linearGradient id="dColorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.15}/><stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.0}/></linearGradient></defs>
                          <YAxis domain={['auto', 'auto']} hide />
                          <ReferenceLine y={referencePrice} stroke="#a3a3a3" strokeWidth={1} strokeDasharray="4 4" opacity={0.5} label={{ position: 'insideTopLeft', value: 'REF', fill: '#737373', fontSize: 10, fontWeight: 'bold' }} />
                          <Area type="monotone" dataKey="value" stroke={isPositive ? '#10b981' : '#f43f5e'} strokeWidth={3} fillOpacity={1} fill="url(#dColorValue)" isAnimationActive={true} animationDuration={300} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {activePosition && (
                      <div className="bg-neutral-50 border-t border-neutral-200 p-3 flex justify-between items-center text-xs">
                        <div><span className="font-bold text-neutral-500 uppercase">Pos: </span><span className={`font-black ${activePosition.direction === 'BUY' ? 'text-green-600' : 'text-red-500'}`}>{activePosition.direction} ${activePosition.size.toFixed(2)}</span></div>
                        <div className="font-black text-neutral-900">PnL: <span className={calculatePositionPnL(activePosition) >= 0 ? 'text-green-600' : 'text-red-500'}>${calculatePositionPnL(activePosition).toFixed(2)}</span></div>
                      </div>
                    )}

                    {/* Confirm modal */}
                    {pendingOrder && (
                      <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0">
                        <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-md pointer-events-auto" onClick={() => setPendingOrder(null)}></div>
                        <div className="w-full max-w-md bg-white rounded-[2rem] border border-white/60 shadow-2xl p-6 pointer-events-auto z-10 flex flex-col gap-6 animate-in slide-in-from-bottom-10 md:zoom-in-95">
                          <div className="text-center">
                            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-neutral-400 mb-2">Confirm</div>
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Press Enter or click to confirm</h3>
                            <p className="text-sm font-medium text-neutral-500 mt-2">Review the trade, then place it with the action button below.</p>
                          </div>

                          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 shadow-inner">
                            <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Contract</span><span className="font-black text-base text-neutral-900">{pendingOrder.duration.toUpperCase()} {pendingOrder.asset.ticker}</span></div>
                            <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Side</span><span className={`font-black text-sm px-2.5 py-0.5 rounded-md ${pendingOrder.direction === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{pendingOrder.direction === 'BUY' ? 'YES' : 'NO'}</span></div>
                            <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Size</span><span className="font-black text-base text-neutral-900">${pendingOrder.size.toFixed(2)}</span></div>
                            <div className="flex justify-between items-center mb-3"><span className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Avg Price</span><span className="font-black text-base text-neutral-900">${pendingOrder.formattedPrice}</span></div>
                            <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-200"><span className="text-neutral-900 font-black text-sm uppercase tracking-widest">Est. Payout</span><span className="font-black text-2xl text-green-600">${(pendingOrder.size / pendingOrder.price).toFixed(2)}</span></div>
                          </div>

                          <div className={`rounded-2xl border px-5 py-4 text-center shadow-md ${pendingOrder.direction === 'BUY' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
                            <div className="text-[11px] font-black uppercase tracking-[0.24em] opacity-80 mb-1">Action</div>
                            <button onClick={executeOrder} className="w-full text-xl font-black tracking-tight">
                              {pendingOrder.direction === 'BUY' ? 'Buy Yes' : 'Buy No'}
                            </button>
                          </div>

                          <button onClick={() => setPendingOrder(null)} className="w-full bg-white text-neutral-500 font-bold py-3 rounded-xl hover:bg-neutral-50 border border-neutral-200 transition-all text-sm">Cancel (Esc)</button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right panel — header + execution */}
          <div className={`w-full md:w-[350px] bg-[#fdfcf8] border-l border-neutral-200 flex flex-col z-20 ${currentView === 'trade' ? 'flex' : 'hidden'}`}>
            <div className="hidden md:block"><HeaderNav /></div>
            <ExecutionPanel />
          </div>

        </div>
      )}

      {activeNotice && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-[999] max-w-[420px] w-[calc(100vw-2rem)] rounded-2xl px-4 py-3 shadow-2xl border backdrop-blur-sm ${activeNotice.type === 'error' ? 'bg-red-600 text-white border-red-500' : activeNotice.type === 'success' ? 'bg-neutral-900 text-white border-neutral-800' : 'bg-white/95 text-neutral-900 border-neutral-200'}`}>
          <div className="text-xs font-black uppercase tracking-widest opacity-80">{activeNotice.title}</div>
          <div className={`text-sm font-bold mt-1 ${activeNotice.type === 'error' ? 'text-white' : activeNotice.type === 'success' ? 'text-white/85' : 'text-neutral-600'}`}>{activeNotice.body}</div>
        </div>
      )}
      {tutorialOverlay}
      {hotkeysCheatSheet}
      <style dangerouslySetInnerHTML={{ __html: sharedStyle }} />
    </div>
  );
}


