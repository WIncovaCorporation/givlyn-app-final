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
  <div style={{ display: 'flex', alignItems: 'center', gap: `${height * 0.15}px` }}>
    <div style={{
      width: `${height * 1.2}px`,
      height: `${height * 1.2}px`,
      background: '#F96302',
      borderRadius: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: '#FFFFFF',
        fontSize: `${height * 0.7}px`,
        fontWeight: 800,
        fontFamily: "Arial, sans-serif",
      }}>
        HD
      </span>
    </div>
    <span style={{ 
      fontSize: `${height * 0.65}px`, 
      fontWeight: 700, 
      color: '#F96302',
      fontFamily: "Arial, sans-serif",
    }}>
      Home Depot
    </span>
  </div>
);

export const NikeLogo = ({ height = 20 }: LogoProps) => (
  <svg width={height * 3} height={height * 1.2} viewBox="0 0 100 40">
    <path 
      d="M10 32 C6 32 2 30 2 28 C2 26 6 24 14 20 L78 4 C84 2 90 2 94 4 C98 6 98 10 94 12 L36 28 C28 30 20 32 14 32 L10 32 Z" 
      fill="#111111"
    />
  </svg>
);

export const AdidasLogo = ({ height = 24 }: LogoProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${height * 0.3}px` }}>
    <svg width={height * 1.2} height={height} viewBox="0 0 36 32">
      <path d="M0 32 L10 10 L14 10 L4 32 Z" fill="#000000"/>
      <path d="M10 32 L20 10 L24 10 L14 32 Z" fill="#000000"/>
      <path d="M20 32 L30 10 L34 10 L24 32 Z" fill="#000000"/>
    </svg>
    <span style={{ 
      fontSize: `${height * 0.75}px`, 
      fontWeight: 700, 
      color: '#000000',
      fontFamily: "'adineue', 'Helvetica Neue', Arial, sans-serif",
      letterSpacing: '2px',
      textTransform: 'lowercase',
    }}>
      adidas
    </span>
  </div>
);

export const KohlsLogo = ({ height = 22 }: LogoProps) => (
  <span style={{ 
    fontSize: `${height}px`, 
    fontWeight: 700, 
    color: '#000000',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
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
