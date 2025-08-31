import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencyRates } from "../../redux/monobank/operations";
import {
  selectCurrencies,
  selectCurrencyLoading,
  selectCurrencyError,
} from "../../redux/monobank/selectors";
import styles from "./Currency.module.css";

const Currency = () => {
  const dispatch = useDispatch();
  const currencies = useSelector(selectCurrencies) || [];
  const loading = useSelector(selectCurrencyLoading);
  const error = useSelector(selectCurrencyError);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  // Görsel referans: grafiğin 0'dan değil buradan başlaması isteniyor
  const baseValues = { USD: 20.0, EUR: 30.0 };

  // SVG ölçüleri
  const VIEW_W = 431;
  const VIEW_H = 281;
  const CHART_H = 200; // dikey çizim alanı
  const TOP_PAD = 28;  // etiketler için üst boşluk
  const X_FACTOR = 4.31;

  // Güncel kurlar (boşsa fallBack)
  const getValues = () => {
    const find = (code) =>
      parseFloat(
        currencies.find((c) => c.currency === code)?.purchase ??
          (code === "USD" ? 27.55 : 30.0)
      );
    return { usdValue: find("USD"), eurValue: find("EUR") };
  };

  // Grafik noktaları
  const generateGraphPoints = () => {
    const { usdValue, eurValue } = getValues();

    return [
      { x: 0, y: baseValues.USD, label: "", currency: "USD", showLabel: false },
      {
        x: 30,
        y: usdValue,
        label: `USD ${usdValue.toFixed(2)}`,
        currency: "USD",
        showLabel: true,
      },
      { x: 70, y: baseValues.EUR, label: "", currency: "EUR", showLabel: false },
      {
        x: 95,
        y: eurValue,
        label: `EUR ${eurValue.toFixed(2)}`,
        currency: "EUR",
        showLabel: true,
      },
    ];
  };

  const pts = generateGraphPoints();

  // --- Y ölçek: minimumu 22'ye sabitle (0 yerine)
  const MIN_Y = 12;
  const MAX_Y = Math.max(...pts.map((p) => p.y), baseValues.EUR);
  const yScale = (y) => {
    const t = (y - MIN_Y) / Math.max(1e-6, MAX_Y - MIN_Y);
    const yPx = VIEW_H - TOP_PAD - t * CHART_H;
    return Math.max(TOP_PAD, Math.min(VIEW_H, yPx));
  };
  const xScale = (x) => x * X_FACTOR;

  // --- Yumuşak eğri (Catmull-Rom -> Bezier)
  const smoothPathD = (points) => {
    if (!points || points.length < 2) return "";
    const p = points.map((pt) => ({ x: xScale(pt.x), y: yScale(pt.y) }));
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] || p[i + 1];

      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Alan dolgusu için kapalı path
  const areaPathD = (points) => {
    if (!points || points.length < 2) return "";
    const p = points.map((pt) => ({ x: xScale(pt.x), y: yScale(pt.y) }));
    const top = smoothPathD(points);
    return `${top} L ${p[p.length - 1].x} ${VIEW_H} L ${p[0].x} ${VIEW_H} Z`;
  };

  if (loading) {
    return (
      <div className={styles.currencySection}>
        <div className={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.currencySection}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.currencySection}>
      {/* Tablo */}
      <div className={styles.currencyTable}>
  <div className={styles.currencyHeader}>
    <span className={styles.hCurrency}>Currency</span>
    <span className={styles.hCol}>Purchase</span>
    <span className={styles.hCol}>Sale</span>
  </div>

  {(currencies || []).map((c, i) => {
    const purchase = Number(c.purchase ?? 0);
    const sale = Number(c.sale ?? 0);
    return (
      <div key={i} className={styles.currencyRow}>
        <span className={styles.cellCurrency}>{c.currency}</span>
        <span className={styles.cellCenter}>
          {isFinite(purchase) ? purchase.toFixed(2) : "-"}
        </span>
        <span className={styles.cellCenter}>
          {isFinite(sale) ? sale.toFixed(2) : "-"}
        </span>
      </div>
    );
  })}
</div>

      {/* Grafik */}
      <div className={styles.graphContainer}>
        <svg
          className={styles.graphSvg}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradient tanımları */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(245,158,11,0.35)" />
              <stop offset="60%" stopColor="rgba(236,72,153,0.18)" />
              <stop offset="100%" stopColor="rgba(236,72,153,0.06)" />
            </linearGradient>
          </defs>

          {/* Alan dolgusu */}
          {pts.length > 1 && (
            <path d={areaPathD(pts)} fill="url(#areaGradient)" />
          )}

          {/* Yumuşak ana çizgi */}
          {pts.length > 1 && (
            <path
              d={smoothPathD(pts)}
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Noktalar & etiketler (akıllı hizalama) */}
          {pts.map((point, i) => {
            const cx = xScale(point.x);
            const cy = yScale(point.y);
            const nearLeft = cx < 24;
            const nearRight = cx > VIEW_W - 24;
            const labelDx = nearRight ? -8 : nearLeft ? 8 : 0;
            const anchor = nearRight ? "end" : nearLeft ? "start" : "middle";

            return (
              <React.Fragment key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                {point.showLabel && (
                  <text
                    x={cx + labelDx}
                    y={cy - 18}
                    fontSize="16"
                    fill="#f59e0b"
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontWeight="600"
                  >
                    {point.label}
                  </text>
                )}
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Currency;
