import React from "react";
import css from "./EmptyTransactions.module.css";

const EmptyTransactions = ({ onAdd }) => {
  return (
    <div className={css.wrap}>
      <div className={css.glow} aria-hidden="true" />
      <svg
        className={css.illu}
        viewBox="0 0 360 200"
        fill="none"
        role="img"
        aria-labelledby="emptyTitle emptyDesc"
      >
        <title id="emptyTitle">No transactions yet</title>
        <desc id="emptyDesc">Wallet illustration with a plus badge</desc>

        
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5E2CD3" />
            <stop offset="55%" stopColor="#6D36E3" />
            <stop offset="100%" stopColor="#C44CCB" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#FF7E6B" />
          </linearGradient>
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="20" y="24" width="320" height="152" rx="24" fill="url(#g1)" opacity="0.18" />

        <g filter="url(#soft)">
          <rect x="88" y="70" width="184" height="86" rx="14" fill="url(#g1)" opacity="0.6" />
          <rect x="96" y="60" width="168" height="64" rx="12" fill="#2B1A63" opacity="0.9" />
          <rect x="96" y="60" width="168" height="64" rx="12" stroke="white" opacity="0.12" />
        
          <rect x="238" y="82" width="30" height="20" rx="6" fill="#3A2385" />
          <circle cx="252.5" cy="92" r="3.5" fill="#FFD166" />
        </g>

    
        <g transform="translate(250,110)">
          <circle r="22" fill="url(#g2)" />
          <path d="M-8 0h16M0 -8v16" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        </g>

    
        <path
          d="M110 128 H250"
          stroke="white"
          strokeOpacity="0.25"
          strokeDasharray="4 8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className={css.text}>
        <h3>No transactions yet</h3>
        <p>A new beginning 🪄 Click the + button at the bottom right to add your first income or expense.</p>
       
      </div>
    </div>
  );
};

export default EmptyTransactions;
