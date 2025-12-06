interface LogoProps {
  height?: number;
}

export const AmazonLogo = ({ height = 28 }: LogoProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <span style={{ 
      fontSize: `${height * 0.8}px`, 
      fontWeight: 700, 
      color: '#232F3E',
      fontFamily: "'Amazon Ember', Arial, sans-serif",
      letterSpacing: '-0.5px',
      lineHeight: 1,
    }}>
      amazon
    </span>
    <svg 
      width={height * 2.5} 
      height={height * 0.35} 
      viewBox="0 0 70 12" 
      style={{ marginTop: '-1px', marginLeft: '2px' }}
    >
      <path 
        d="M1 9 Q35 15 69 3" 
        stroke="#FF9900" 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round"
      />
      <polygon points="63,1 69,3.5 65,7" fill="#FF9900"/>
    </svg>
  </div>
);

export const WalmartLogo = ({ height = 28 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: `${height * 0.2}px` }}>
    <svg width={height * 0.85} height={height * 0.85} viewBox="0 0 28 28">
      <path d="M14 2 L14.6 9 L14 14 L13.4 9 Z" fill="#FFC220"/>
      <path d="M14 26 L13.4 19 L14 14 L14.6 19 Z" fill="#FFC220"/>
      <path d="M2 14 L9 13.4 L14 14 L9 14.6 Z" fill="#FFC220"/>
      <path d="M26 14 L19 14.6 L14 14 L19 13.4 Z" fill="#FFC220"/>
      <path d="M5.5 5.5 L10 10.5 L14 14 L10 10.5 Z" fill="#FFC220"/>
      <path d="M22.5 22.5 L18 17.5 L14 14 L18 17.5 Z" fill="#FFC220"/>
      <path d="M5.5 22.5 L10.5 18 L14 14 L10.5 18 Z" fill="#FFC220"/>
      <path d="M22.5 5.5 L17.5 10 L14 14 L17.5 10 Z" fill="#FFC220"/>
    </svg>
    <span style={{ 
      fontSize: `${height * 0.75}px`, 
      fontWeight: 600, 
      color: '#0071CE',
      fontFamily: "'Bogle', 'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '0.5px',
    }}>
      Walmart
    </span>
  </div>
);

export const TargetLogo = ({ height = 28 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: `${height * 0.25}px` }}>
    <svg width={height} height={height} viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="#CC0000"/>
      <circle cx="14" cy="14" r="8.5" fill="#FFFFFF"/>
      <circle cx="14" cy="14" r="4.5" fill="#CC0000"/>
    </svg>
    <span style={{ 
      fontSize: `${height * 0.65}px`, 
      fontWeight: 700, 
      color: '#CC0000',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '0.5px',
    }}>
      Target
    </span>
  </div>
);

export const EtsyLogo = ({ height = 24 }: LogoProps) => (
  <span style={{ 
    fontSize: `${height}px`, 
    fontWeight: 500, 
    color: '#F56400',
    fontFamily: "Georgia, 'Times New Roman', serif",
    letterSpacing: '0.5px',
    fontStyle: 'normal',
  }}>
    Etsy
  </span>
);

export const EbayLogo = ({ height = 24 }: LogoProps) => (
  <span style={{ 
    fontSize: `${height}px`, 
    fontWeight: 700, 
    fontFamily: "'Market Sans', Arial, sans-serif",
    letterSpacing: '-0.5px',
  }}>
    <span style={{ color: '#E53238' }}>e</span>
    <span style={{ color: '#0064D2' }}>b</span>
    <span style={{ color: '#F5AF02' }}>a</span>
    <span style={{ color: '#86B817' }}>y</span>
  </span>
);

export const BestBuyLogo = ({ height = 24 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: `${height * 0.25}px` }}>
    <svg width={height * 1.4} height={height * 1.4} viewBox="0 0 48 48">
      <rect x="2" y="2" width="44" height="44" rx="4" fill="#0046BE"/>
      <path d="M12 14h12c4 0 7 2 7 6 0 2-1 3.5-2.5 4.5 2.5 1 4 3 4 5.5 0 4-3 6-8 6H12V14zm6 8h5c2 0 3-1 3-2.5s-1-2.5-3-2.5h-5v5zm0 9h6c2.5 0 4-1 4-3s-1.5-3-4-3h-6v6z" fill="#FFF200"/>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
      <span style={{ 
        fontSize: `${height * 0.65}px`, 
        fontWeight: 800, 
        color: '#0046BE',
        fontFamily: "Arial, sans-serif",
        letterSpacing: '-0.5px',
      }}>
        Best Buy
      </span>
    </div>
  </div>
);

export const MacysLogo = ({ height = 22 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <svg width={height * 0.6} height={height * 0.6} viewBox="0 0 24 24" style={{ marginRight: '2px' }}>
      <polygon points="12,2 14,9 21,9 15,14 17,21 12,17 7,21 9,14 3,9 10,9" fill="#E21A2C"/>
    </svg>
    <span style={{ 
      fontSize: `${height}px`, 
      fontWeight: 400, 
      color: '#E21A2C',
      fontFamily: "'Times New Roman', Georgia, serif",
      fontStyle: 'italic',
      letterSpacing: '0.5px',
    }}>
      macy's
    </span>
  </div>
);

export const HomeDepotLogo = ({ height = 24 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
    <div style={{
      width: `${Math.min(height, 20)}px`,
      height: `${Math.min(height, 20)}px`,
      background: '#F96302',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        color: '#FFFFFF',
        fontSize: `${Math.min(height * 0.5, 10)}px`,
        fontWeight: 800,
        fontFamily: "Arial, sans-serif",
      }}>
        HD
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ 
        fontSize: `${Math.min(height * 0.4, 9)}px`, 
        fontWeight: 700, 
        color: '#F96302',
        fontFamily: "Arial, sans-serif",
        whiteSpace: 'nowrap',
      }}>
        Home
      </span>
      <span style={{ 
        fontSize: `${Math.min(height * 0.4, 9)}px`, 
        fontWeight: 700, 
        color: '#F96302',
        fontFamily: "Arial, sans-serif",
        whiteSpace: 'nowrap',
      }}>
        Depot
      </span>
    </div>
  </div>
);

export const NikeLogo = ({ height = 20 }: LogoProps) => (
  <svg width={Math.min(height * 2, 45)} height={Math.min(height * 0.8, 18)} viewBox="0 0 100 40">
    <path 
      d="M10 32 C6 32 2 30 2 28 C2 26 6 24 14 20 L78 4 C84 2 90 2 94 4 C98 6 98 10 94 12 L36 28 C28 30 20 32 14 32 L10 32 Z" 
      fill="#111111"
    />
  </svg>
);

export const AdidasLogo = ({ height = 24 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
    <svg width={Math.min(height, 20)} height={Math.min(height * 0.8, 16)} viewBox="0 0 36 32">
      <path d="M0 32 L10 10 L14 10 L4 32 Z" fill="#000000"/>
      <path d="M10 32 L20 10 L24 10 L14 32 Z" fill="#000000"/>
      <path d="M20 32 L30 10 L34 10 L24 32 Z" fill="#000000"/>
    </svg>
    <span style={{ 
      fontSize: `${Math.min(height * 0.55, 12)}px`, 
      fontWeight: 700, 
      color: '#000000',
      fontFamily: "'adineue', 'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '1px',
      textTransform: 'lowercase',
      whiteSpace: 'nowrap',
    }}>
      adidas
    </span>
  </div>
);

export const KohlsLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 18)}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    KOHL'S
  </span>
);

export const UberLogo = ({ height = 20 }: LogoProps) => (
  <span style={{ 
    fontSize: `${height}px`, 
    fontWeight: 600, 
    color: '#000000',
    fontFamily: "'UberMove', 'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0.5px',
  }}>
    Uber
  </span>
);

export const SephoraLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 14)}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    SEPHORA
  </span>
);

export const UltaLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 18)}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
  }}>
    ULTA
  </span>
);

export const LululemonLogo = ({ height = 20 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
    <svg width={Math.min(height, 16)} height={Math.min(height, 16)} viewBox="0 0 24 24">
      <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7zm0 10c-2 0-3.5-1.5-3.5-3.5S10 5 12 5s3.5 1.5 3.5 3.5S14 12 12 12z" fill="#CC0000"/>
    </svg>
    <span style={{ 
      fontSize: `${Math.min(height * 0.55, 11)}px`, 
      fontWeight: 400, 
      color: '#000000',
      fontFamily: "Georgia, serif",
      whiteSpace: 'nowrap',
    }}>
      lululemon
    </span>
  </div>
);

export const NordstromLogo = ({ height = 20 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height * 0.5, 11)}px`, 
    fontWeight: 400, 
    color: '#000000',
    fontFamily: "'Times New Roman', Georgia, serif",
    letterSpacing: '0px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    NORDSTROM
  </span>
);

export const ZaraLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 18)}px`, 
    fontWeight: 400, 
    color: '#000000',
    fontFamily: "'Times New Roman', Georgia, serif",
    letterSpacing: '2px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    ZARA
  </span>
);

export const HMlogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${height}px`, 
    fontWeight: 700, 
    color: '#CC0000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '2px',
  }}>
    H&M
  </span>
);

export const GapLogo = ({ height = 22 }: LogoProps) => (
  <div style={{
    background: '#000066',
    padding: `${height * 0.2}px ${height * 0.4}px`,
    borderRadius: '2px',
  }}>
    <span style={{ 
      fontSize: `${height}px`, 
      fontWeight: 400, 
      color: '#FFFFFF',
      fontFamily: "serif",
      letterSpacing: '1px',
    }}>
      GAP
    </span>
  </div>
);

export const CoachLogo = ({ height = 20 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 16)}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Times New Roman', Georgia, serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    COACH
  </span>
);

export const AppleLogo = ({ height = 24 }: LogoProps) => (
  <svg width={height} height={height * 1.2} viewBox="0 0 24 30">
    <path d="M18.7 15.2c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.8 1.2-4.8 1.2s-2.5-1.2-4.2-1.1c-2.1 0-4.1 1.3-5.2 3.2-2.2 3.9-.6 9.6 1.6 12.8 1.1 1.5 2.3 3.3 4 3.2 1.6-.1 2.2-1 4.1-1s2.5 1 4.2 1c1.7 0 2.8-1.6 3.9-3.1 1.2-1.8 1.7-3.5 1.8-3.6 0-.1-3.4-1.3-3.5-5.3zM15.4 5.5c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.9-3.7 1.9-.8.9-1.5 2.5-1.3 3.9 1.4.1 2.8-.7 3.7-1.7z" fill="#000000"/>
  </svg>
);

export const SamsungLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 14)}px`, 
    fontWeight: 700, 
    color: '#1428A0',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    SAMSUNG
  </span>
);

export const SonyLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 18)}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }}>
    SONY
  </span>
);

export const LowesLogo = ({ height = 22 }: LogoProps) => (
  <div style={{
    background: '#004990',
    padding: `${height * 0.2}px ${height * 0.4}px`,
    borderRadius: '2px',
  }}>
    <span style={{ 
      fontSize: `${height}px`, 
      fontWeight: 700, 
      color: '#FFFFFF',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      Lowe's
    </span>
  </div>
);

export const CostcoLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 16)}px`, 
    fontWeight: 700, 
    color: '#E31837',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  }}>
    COSTCO
  </span>
);

export const WayfairLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${Math.min(height, 14)}px`, 
    fontWeight: 400, 
    color: '#7B189F',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0px',
    whiteSpace: 'nowrap',
  }}>
    Wayfair
  </span>
);
