import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  character: ChiikawaCharacter
  size?: number
  className?: string
  onClick?: () => void
}

const OFFICIAL_ASSETS: Record<string, string> = {
  chiikawa: './assets/chiikawa.png',
  usagi: './assets/usagi.png',
  hachiware: './assets/hachiware.png',
  momonga: './assets/chiikawa.png',
  kurimanju: './assets/usagi.png',
  rakko: './assets/hachiware.png'
}

export function ChiikawaSVG({ character, size = 64, className = '', onClick }: Props) {
  const imgSrc = OFFICIAL_ASSETS[character] || './assets/chiikawa.png'

  return (
    <div
      className={`chiikawa-official-model ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <img
        src={imgSrc}
        alt={character}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
          userSelect: 'none'
        }}
        draggable={false}
      />
    </div>
  )
}
