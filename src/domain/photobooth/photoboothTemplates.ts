import type { PhotoboothTemplate } from './types'

export const PHOTOBOOTH_TEMPLATES: PhotoboothTemplate[] = [
  // ── 6 TEMPLATES WITH 4 PHOTOS ──
  {
    id: 'chiikawa_pastel_strip',
    name: '🌸 Chiikawa Sweet Life4Cuts',
    photoCount: 4,
    layout: 'strip_1x4',
    themeColor: '#ffccd5',
    accentColor: '#ff758f',
    textColor: '#59323c',
    backgroundColor: '#fff0f3',
    patternType: 'hearts',
    borderStyle: 'clean',
    stickers: {
      character: 'chiikawa',
      emojis: ['💖', '🌸', '✨', '🎀'],
      stampText: 'SWEET MOMENTS'
    },
    defaultTitle: 'Chiikawa & You',
    defaultSubtitle: 'Little Days · Life4Cuts',
    badgeEmoji: '🌸'
  },
  {
    id: 'hachiware_star_grid',
    name: '🩵 Hachiware Sky Blue Grid',
    photoCount: 4,
    layout: 'grid_2x2',
    themeColor: '#c5e1f7',
    accentColor: '#4a90e2',
    textColor: '#1a365d',
    backgroundColor: '#ebf8ff',
    patternType: 'stars',
    borderStyle: 'clean',
    stickers: {
      character: 'hachiware',
      emojis: ['⭐', '📘', '☁️', '💫'],
      stampText: 'HAPPY MEMORIES'
    },
    defaultTitle: 'Starry Sky Love',
    defaultSubtitle: 'Best Companion Ever',
    badgeEmoji: '🩵'
  },
  {
    id: 'cottage_vintage_strip',
    name: '🌿 Cozy Cottage Washi Tape',
    photoCount: 4,
    layout: 'strip_1x4',
    themeColor: '#f7e1d7',
    accentColor: '#8a5a44',
    textColor: '#4a3525',
    backgroundColor: '#fefae0',
    patternType: 'stripes',
    borderStyle: 'washi',
    stickers: {
      character: 'kurimanju',
      emojis: ['🍵', '🍂', '🌰', '🏡'],
      stampText: 'COZY AFTERNOON'
    },
    defaultTitle: 'Warm Little Home',
    defaultSubtitle: 'Handmade Vintage Edition',
    badgeEmoji: '🌿'
  },
  {
    id: 'nhatrang_sunset_strip',
    name: '🏖️ Nha Trang Sunset Beach',
    photoCount: 4,
    layout: 'strip_1x4',
    themeColor: '#fed9b7',
    accentColor: '#f07167',
    textColor: '#57102c',
    backgroundColor: '#fff5eb',
    patternType: 'dots',
    borderStyle: 'clean',
    stickers: {
      character: 'usagi',
      emojis: ['🌴', '🌅', '🍹', '🐚'],
      stampText: 'NHA TRANG TRIP'
    },
    defaultTitle: 'Sunset & Sea Breeze',
    defaultSubtitle: 'Day 10 Trip Ready',
    badgeEmoji: '🏖️'
  },
  {
    id: 'strawberry_cafe_grid',
    name: '🍓 Strawberry Cake Cafe',
    photoCount: 4,
    layout: 'grid_2x2',
    themeColor: '#ffb3c6',
    accentColor: '#c9184a',
    textColor: '#590d22',
    backgroundColor: '#fff0f5',
    patternType: 'hearts',
    borderStyle: 'lace',
    stickers: {
      character: 'momonga',
      emojis: ['🍰', '🍓', '🧁', '🍮'],
      stampText: 'SWEET TREAT'
    },
    defaultTitle: 'Sweet Valentine Cafe',
    defaultSubtitle: 'Dessert & Love',
    badgeEmoji: '🍓'
  },
  {
    id: 'midnight_starlight_strip',
    name: '🌌 Midnight Moonlit Haven',
    photoCount: 4,
    layout: 'strip_1x4',
    themeColor: '#e0c3fc',
    accentColor: '#8e7dbe',
    textColor: '#2e1c4a',
    backgroundColor: '#f8f4ff',
    patternType: 'stars',
    borderStyle: 'clean',
    stickers: {
      character: 'rakko',
      emojis: ['🌙', '✨', '🪐', '💫'],
      stampText: 'NIGHT PROMISE'
    },
    defaultTitle: 'Moonlight Sanctuary',
    defaultSubtitle: 'Sweet Dreams Together',
    badgeEmoji: '🌌'
  },

  // ── 2 TEMPLATES WITH 6 PHOTOS ──
  {
    id: 'chiikawa_family_mega_6cut',
    name: '💖 Chiikawa Family Mega 6-Cut',
    photoCount: 6,
    layout: 'grid_2x3',
    themeColor: '#ffccd5',
    accentColor: '#ff4d6d',
    textColor: '#480ca8',
    backgroundColor: '#fff5f7',
    patternType: 'hearts',
    borderStyle: 'clean',
    stickers: {
      character: 'all',
      emojis: ['🌸', '🐰', '🐱', '🐿️', '🍵', '🦦'],
      stampText: 'FULL FAMILY EDITION'
    },
    defaultTitle: 'Chiikawa & Friends Mega Cut',
    defaultSubtitle: '10-Day Readiness Milestone',
    badgeEmoji: '💖'
  },
  {
    id: 'vintage_cinema_film_6cut',
    name: '🎞️ Retro Cinema 6-Frame Filmstrip',
    photoCount: 6,
    layout: 'film_strip_2x3',
    themeColor: '#2b2d42',
    accentColor: '#e0a96d',
    textColor: '#fdf0d5',
    backgroundColor: '#1a1a24',
    patternType: 'dots',
    borderStyle: 'film',
    stickers: {
      character: 'all',
      emojis: ['🎬', '📽️', '🍿', '🎟️', '⭐', '❤️'],
      stampText: 'CINEMA KODAK 400'
    },
    defaultTitle: 'Romantic Cinema Edition',
    defaultSubtitle: 'Timeless Love Story',
    badgeEmoji: '🎞️'
  }
]
