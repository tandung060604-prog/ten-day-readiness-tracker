export type PhotoboothLayout = 'strip_1x4' | 'grid_2x2' | 'grid_2x3' | 'film_strip_2x3'

export type PhotoboothFilter = 'none' | 'pastel' | 'warm' | 'bw' | 'rosy'

export interface PhotoboothTemplate {
  id: string
  name: string
  photoCount: 4 | 6
  layout: PhotoboothLayout
  themeColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  patternType: 'solid' | 'stripes' | 'dots' | 'stars' | 'hearts'
  borderStyle: 'clean' | 'washi' | 'lace' | 'film'
  stickers: {
    character?: 'chiikawa' | 'usagi' | 'hachiware' | 'momonga' | 'kurimanju' | 'rakko' | 'all'
    emojis: string[]
    stampText?: string
  }
  defaultTitle: string
  defaultSubtitle: string
  badgeEmoji: string
}

export interface PhotoboothState {
  templateId: string
  photos: (string | null)[]
  filter: PhotoboothFilter
  coupleTitle: string
  dateText: string
  customMessage: string
  frameColor?: string
}
