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
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-heart ${className}`} {...props}>
          <defs>
            <linearGradient id="gHeart" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff758c" />
              <stop offset="100%" stopColor="#ff4b72" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color || 'url(#gHeart)'}
            filter="drop-shadow(0 2px 4px rgba(255, 75, 114, 0.35))"
          />
          <circle cx="7.5" cy="7.5" r="1.5" fill="rgba(255,255,255,0.7)" />
        </svg>
      )

    case 'star':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-star ${className}`} {...props}>
          <defs>
            <linearGradient id="gStar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe066" />
              <stop offset="100%" stopColor="#f59f00" />
            </linearGradient>
          </defs>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={color || 'url(#gStar)'}
            stroke="#f59f00"
            strokeWidth="0.8"
            filter="drop-shadow(0 2px 4px rgba(245, 159, 0, 0.35))"
          />
          <polygon points="12,5 13.5,9 18,9.7 14.5,13.1 15.3,17.5 12,15.2 8.7,17.5 9.5,13.1 6,9.7 10.5,9" fill="rgba(255,255,255,0.4)" />
        </svg>
      )

    case 'gem':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-gem ${className}`} {...props}>
          <defs>
            <linearGradient id="gGem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#74c0fc" />
              <stop offset="100%" stopColor="#1c7ed6" />
            </linearGradient>
          </defs>
          <polygon
            points="6,3 18,3 22,9 12,22 2,9"
            fill={color || 'url(#gGem)'}
            stroke="#1c7ed6"
            strokeWidth="0.8"
            filter="drop-shadow(0 2px 4px rgba(28, 126, 214, 0.35))"
          />
          <polygon points="6,3 12,9 18,3" fill="#a5d8ff" />
          <polygon points="2,9 12,9 6,3" fill="#4dabf7" />
          <polygon points="18,3 12,9 22,9" fill="#339af0" />
          <polygon points="2,9 12,22 12,9" fill="#228be6" />
          <polygon points="12,9 12,22 22,9" fill="#1864ab" />
        </svg>
      )

    case 'energy':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-energy ${className}`} {...props}>
          <defs>
            <linearGradient id="gEnergy" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd43b" />
              <stop offset="100%" stopColor="#f08c00" />
            </linearGradient>
          </defs>
          <polygon
            points="13,2 4,14 11,14 9,22 20,9 13,9"
            fill={color || 'url(#gEnergy)'}
            stroke="#e67700"
            strokeWidth="0.8"
            filter="drop-shadow(0 2px 4px rgba(240, 140, 0, 0.4))"
          />
        </svg>
      )

    case 'home':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-home ${className}`} {...props}>
          <defs>
            <linearGradient id="gHome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8787" />
              <stop offset="100%" stopColor="#fa5252" />
            </linearGradient>
          </defs>
          <path d="M12 2L2 10h3v10h14V10h3L12 2z" fill={color || 'url(#gHome)'} />
          <rect x="9" y="13" width="6" height="7" rx="1.5" fill="#ffe3e3" />
          <circle cx="13.5" cy="16.5" r="0.8" fill="#e03131" />
        </svg>
      )

    case 'gym':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-gym ${className}`} {...props}>
          <path d="M20 7h-2V5c0-.55-.45-1-1-1s-1 .45-1 1v2h-8V5c0-.55-.45-1-1-1s-1 .45-1 1v2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h8v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM4 15V9h2v6H4zm14 0h-2V9h2v6z" fill={color || '#f59f00'} />
        </svg>
      )

    case 'water':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-water ${className}`} {...props}>
          <defs>
            <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4dabf7" />
              <stop offset="100%" stopColor="#1971c2" />
            </linearGradient>
          </defs>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill={color || 'url(#gWater)'} filter="drop-shadow(0 2px 4px rgba(25, 113, 194, 0.35))" />
          <circle cx="9.5" cy="11.5" r="1.5" fill="rgba(255,255,255,0.6)" />
        </svg>
      )

    case 'journal':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-journal ${className}`} {...props}>
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill={color || '#9775fa'} />
        </svg>
      )

    case 'album':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-album ${className}`} {...props}>
          <circle cx="12" cy="12" r="3" fill="#ff6b6b" />
          <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill={color || '#fa5252'} />
        </svg>
      )

    case 'sleep':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-sleep ${className}`} {...props}>
          <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.6-11.6A10 10 0 0 1 12.3 2z" fill={color || '#7048e8'} />
        </svg>
      )

    case 'quest':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-quest ${className}`} {...props}>
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" fill={color || '#f59f00'} />
        </svg>
      )

    case 'market':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-market ${className}`} {...props}>
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" fill={color || '#20bf6b'} />
        </svg>
      )

    case 'restaurant':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-restaurant ${className}`} {...props}>
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill={color || '#e83e8c'} />
        </svg>
      )

    case 'townhall':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-townhall ${className}`} {...props}>
          <path d="M12 1L3 5v2h18V5L12 1zm-7 8v9h2v-9H5zm4 0v9h2v-9H9zm4 0v9h2v-9h-2zm4 0v9h2v-9h-2zM2 20v2h20v-2H2z" fill={color || '#495057'} />
        </svg>
      )

    case 'airport':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-airport ${className}`} {...props}>
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={color || '#00a8ff'} />
        </svg>
      )

    case 'beach':
      return (
        <svg viewBox="0 0 24 24" style={customStyle} className={`game-icon-svg icon-beach ${className}`} {...props}>
          <path d="M17 5.92L9 2v18H7v-1.73c-1.79.35-3 .99-3 1.73 0 1.1 2.69 2 6 2s6-.9 6-2c0-.74-1.21-1.38-3-1.73V13.8l8-3.92V5.92z" fill={color || '#20bf6b'} />
        </svg>
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
