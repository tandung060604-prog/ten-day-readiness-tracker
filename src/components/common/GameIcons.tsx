import React from 'react'

export type GameIconName =
  | 'heart'
  | 'star'
  | 'gem'
  | 'energy'
  | 'home'
  | 'gym'
  | 'water'
  | 'journal'
  | 'album'
  | 'sleep'
  | 'quest'
  | 'market'
  | 'restaurant'
  | 'townhall'
  | 'airport'
  | 'beach'
  | 'map'
  | 'bag'
  | 'bell'
  | 'gear'
  | 'lock'
  | 'target'
  | 'trophy'
  | 'strawberry'
  | 'pudding'
  | 'ribbon'
  | 'sound'
  | 'scroll'
  | 'speech'
  | 'check'
  | 'cross'
  | 'plus'
  | 'flame'
  | 'calendar'
  | 'sparkle'
  | 'friends'
  | 'shop'
  | 'event'

interface Props extends React.SVGProps<SVGSVGElement> {
  name: GameIconName
  size?: number
  className?: string
  color?: string
}

export function GameIcon({ name, size = 20, className = '', color, style, ...props }: Props) {
  const customStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0,
    ...style
  }

  switch (name) {
    case 'heart':
      return (
        <svg viewBox="0 0 32 32" style={customStyle} className={`game-icon-svg icon-heart ${className}`} {...props}>
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff758f" />
              <stop offset="60%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#c9184a" />
            </linearGradient>
            <linearGradient id="heartShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ff4d6d" floodOpacity="0.45" />
            </filter>
          </defs>
          <path
            d="M16 27s-10-6.8-10-13.8C6 7.8 10 5 14 5c2.3 0 3.8 1.1 5 2.5 1.2-1.4 2.7-2.5 5-2.5 4 0 8 2.8 8 8.2 0 7-10 13.8-10 13.8z"
            fill="url(#heartGrad)"
            filter="url(#heartShadow)"
          />
          <ellipse cx="11.5" cy="10" rx="3" ry="1.8" fill="url(#heartShine)" transform="rotate(-30 11.5 10)" />
        </svg>
      )

    case 'star':
      return (
        <svg viewBox="0 0 32 32" style={customStyle} className={`game-icon-svg icon-star ${className}`} {...props}>
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3bf" />
              <stop offset="40%" stopColor="#ffd43b" />
              <stop offset="100%" stopColor="#f59f00" />
            </linearGradient>
            <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f59f00" floodOpacity="0.4" />
            </filter>
          </defs>
          <path
            d="M16 2.5l4.1 8.3 9.2 1.3-6.6 6.5 1.6 9.1L16 23.4l-8.3 4.3 1.6-9.1-6.6-6.5 9.2-1.3z"
            fill="url(#starGrad)"
            filter="url(#starGlow)"
          />
          <path
            d="M16 5.5l2.8 5.6 6.2.9-4.5 4.4 1.1 6.2L16 19.5l-5.6 2.9 1.1-6.2-4.5-4.4 6.2-.9z"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      )

    case 'gem':
      return (
        <svg viewBox="0 0 32 32" style={customStyle} className={`game-icon-svg icon-gem ${className}`} {...props}>
          <defs>
            <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe066" />
              <stop offset="50%" stopColor="#fcc419" />
              <stop offset="100%" stopColor="#e67700" />
            </linearGradient>
            <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f59f00" floodOpacity="0.45" />
            </filter>
          </defs>
          <circle cx="16" cy="16" r="13" fill="url(#coinGrad)" filter="url(#coinShadow)" />
          <circle cx="16" cy="16" r="10" fill="none" stroke="#fff3bf" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M16 19.5s-4-2.6-4-5.3c0-2 1.5-3.2 3-3.2 1 0 1.6.5 2 1.1.4-.6 1-1.1 2-1.1 1.5 0 3 1.2 3 3.2 0 2.7-4 5.3-4 5.3z" fill="#ffffff" />
        </svg>
      )

    case 'energy':
      return (
        <svg viewBox="0 0 32 32" style={customStyle} className={`game-icon-svg icon-energy ${className}`} {...props}>
          <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe066" />
              <stop offset="50%" stopColor="#ff922b" />
              <stop offset="100%" stopColor="#e8590c" />
            </linearGradient>
            <filter id="energyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ff922b" floodOpacity="0.5" />
            </filter>
          </defs>
          <path
            d="M18 2L7 17h8l-2 13 12-16h-9l3-12z"
            fill="url(#energyGrad)"
            filter="url(#energyGlow)"
          />
          <path
            d="M17 5l-8 11h6l-1 8 8-11h-7l2-8z"
            fill="rgba(255,255,255,0.4)"
          />
        </svg>
      )

    case 'home':
      return (
        <img
          src="./assets/buildings/house.png"
          alt="Home"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-home ${className}`}
        />
      )

    case 'gym':
      return (
        <img
          src="./assets/buildings/gym.png"
          alt="Gym"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-gym ${className}`}
        />
      )

    case 'water':
      return (
        <img
          src="./assets/buildings/water.png"
          alt="Water"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-water ${className}`}
        />
      )

    case 'journal':
      return (
        <img
          src="./assets/buildings/library.png"
          alt="Library Journal"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-journal ${className}`}
        />
      )

    case 'album':
      return (
        <img
          src="./assets/buildings/album.png"
          alt="Photo Album"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-album ${className}`}
        />
      )

    case 'sleep':
      return (
        <img
          src="./assets/buildings/sleep.png"
          alt="Sleep Haven"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-sleep ${className}`}
        />
      )

    case 'quest':
      return (
        <img
          src="./assets/buildings/quest.png"
          alt="Quest"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-quest ${className}`}
        />
      )

    case 'market':
      return (
        <img
          src="./assets/buildings/market.png"
          alt="Market"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-market ${className}`}
        />
      )

    case 'restaurant':
      return (
        <img
          src="./assets/buildings/restaurant.png"
          alt="Restaurant"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-restaurant ${className}`}
        />
      )

    case 'townhall':
      return (
        <img
          src="./assets/buildings/townhall.png"
          alt="Town Hall"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-townhall ${className}`}
        />
      )

    case 'airport':
      return (
        <img
          src="./assets/buildings/airport.png"
          alt="Airport"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-airport ${className}`}
        />
      )

    case 'beach':
      return (
        <img
          src="./assets/buildings/beach.png"
          alt="Beach"
          style={{ ...customStyle, objectFit: 'contain' }}
          className={`game-icon-img icon-beach ${className}`}
        />
      )

    case 'map':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-map ${className}`} {...props}>
          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill={color || '#38d9a9'} />
        </svg>
      )

    case 'bag':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-bag ${className}`} {...props}>
          <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-2h4v2h-4V4zm10 15H4V8h16v11z" fill={color || '#fab005'} />
        </svg>
      )

    case 'bell':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-bell ${className}`} {...props}>
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill={color || '#fd7e14'} />
        </svg>
      )

    case 'gear':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-gear ${className}`} {...props}>
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill={color || '#868e96'} />
        </svg>
      )

    case 'lock':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-lock ${className}`} {...props}>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill={color || '#f59f00'} />
        </svg>
      )

    case 'target':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-target ${className}`} {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill={color || '#fa5252'} />
        </svg>
      )

    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-trophy ${className}`} {...props}>
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill={color || '#f59f00'} />
        </svg>
      )

    case 'strawberry':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-strawberry ${className}`} {...props}>
          <path d="M12 3c-1.5 0-3 .5-4.2 1.5C6.3 3.3 4.5 3 3 3.5c-.3.1-.4.4-.3.7.8 2.4 2.4 4.3 4.5 5.2C7 13.5 8.5 18.5 12 21c3.5-2.5 5-7.5 4.8-11.6 2.1-.9 3.7-2.8 4.5-5.2.1-.3 0-.6-.3-.7-1.5-.5-3.3-.2-4.8 1C15 3.5 13.5 3 12 3z" fill={color || '#e03131'} />
          <circle cx="10" cy="11" r="0.8" fill="#ffd8a8" />
          <circle cx="14" cy="11" r="0.8" fill="#ffd8a8" />
          <circle cx="12" cy="15" r="0.8" fill="#ffd8a8" />
        </svg>
      )

    case 'pudding':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-pudding ${className}`} {...props}>
          <path d="M4 17l2-10h12l2 10H4z" fill={color || '#ffe066'} />
          <path d="M6 7c1 2 3 2 4 1s3 1 4 0 3-1 4 0l.5-1H6z" fill="#d9480f" />
          <ellipse cx="12" cy="18" rx="9" ry="2" fill="#adb5bd" />
        </svg>
      )

    case 'ribbon':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-ribbon ${className}`} {...props}>
          <circle cx="12" cy="9" r="3.5" fill="#f783ac" />
          <path d="M12 12.5L7 22l5-2 5 2-5-9.5z" fill={color || '#e64980'} />
        </svg>
      )

    case 'sound':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-sound ${className}`} {...props}>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill={color || '#20bf6b'} />
        </svg>
      )

    case 'scroll':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-scroll ${className}`} {...props}>
          <path d="M19 3H7c-1.66 0-3 1.34-3 3v12c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3zm-1 14H8c-.55 0-1-.45-1-1s.45-1 1-1h10v2zm0-4H8c-.55 0-1-.45-1-1s.45-1 1-1h10v2zm0-4H8c-.55 0-1-.45-1-1s.45-1 1-1h10v2z" fill={color || '#e599f7'} />
        </svg>
      )

    case 'speech':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-speech ${className}`} {...props}>
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill={color || '#69db7c'} />
        </svg>
      )

    case 'friends':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-friends ${className}`} {...props}>
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill={color || '#ff922b'} />
        </svg>
      )

    case 'shop':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-shop ${className}`} {...props}>
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" fill={color || '#f76707'} />
        </svg>
      )

    case 'event':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-event ${className}`} {...props}>
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill={color || '#f06595'} />
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg ${className}`} {...props}>
          <circle cx="12" cy="12" r="8" fill={color || '#adb5bd'} />
        </svg>
      )
  }
}
