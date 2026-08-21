import { describe, it, expect } from 'vitest'
import { PHOTOBOOTH_TEMPLATES } from '../domain/photobooth/photoboothTemplates'
import { renderPhotoboothStrip } from '../domain/photobooth/photoboothEngine'
import { getPhotoboothCharacterAsset } from '../components/photobooth/PhotoboothStudio'

describe('Photobooth Engine & 8 Templates Suite', () => {
  it('1. Contains exactly 8 templates: 6 templates of 4-photo and 2 templates of 6-photo', () => {
    expect(PHOTOBOOTH_TEMPLATES).toHaveLength(8)

    const fourPhotoTemplates = PHOTOBOOTH_TEMPLATES.filter(t => t.photoCount === 4)
    const sixPhotoTemplates = PHOTOBOOTH_TEMPLATES.filter(t => t.photoCount === 6)

    expect(fourPhotoTemplates).toHaveLength(6)
    expect(sixPhotoTemplates).toHaveLength(2)
  })

  it('2. 4-Photo templates cover Life4Cuts strips, grids and Chiikawa themes', () => {
    const ids = PHOTOBOOTH_TEMPLATES.map(t => t.id)
    expect(ids).toContain('chiikawa_pastel_strip')
    expect(ids).toContain('hachiware_star_grid')
    expect(ids).toContain('cottage_vintage_strip')
    expect(ids).toContain('nhatrang_sunset_strip')
    expect(ids).toContain('strawberry_cafe_grid')
    expect(ids).toContain('midnight_starlight_strip')
  })

  it('3. 6-Photo templates cover Mega 6-Cut and Retro Filmstrip', () => {
    const ids = PHOTOBOOTH_TEMPLATES.map(t => t.id)
    expect(ids).toContain('chiikawa_family_mega_6cut')
    expect(ids).toContain('vintage_cinema_film_6cut')
  })

  it('uses the existing Chiikawa family assets for every frame choice', () => {
    expect(PHOTOBOOTH_TEMPLATES.map(getPhotoboothCharacterAsset)).toEqual([
      './assets/chiikawa.png', './assets/hachiware.png', './assets/kurimanju.png', './assets/usagi.png',
      './assets/momonga.png', './assets/rakko.png', './assets/chiikawa.png', './assets/chiikawa.png'
    ])
  })

  it('4. renderPhotoboothStrip executes and generates valid data URL for 4-cut and 6-cut', async () => {
    const tmpl4 = PHOTOBOOTH_TEMPLATES[0]
    const result4 = await renderPhotoboothStrip({
      template: tmpl4,
      photos: [null, null, null, null],
      filter: 'pastel',
      coupleTitle: 'Dũng & Chiikawa',
      dateText: '20/08/2026',
      customMessage: 'Sweet Memories'
    })

    expect(result4).toBeDefined()
    expect(result4.startsWith('data:image/')).toBe(true)

    const tmpl6 = PHOTOBOOTH_TEMPLATES[6]
    const result6 = await renderPhotoboothStrip({
      template: tmpl6,
      photos: [null, null, null, null, null, null],
      filter: 'warm',
      coupleTitle: 'Mega Family',
      dateText: '20/08/2026',
      customMessage: 'Life4Cuts'
    })

    expect(result6).toBeDefined()
    expect(result6.startsWith('data:image/')).toBe(true)
  })
})
