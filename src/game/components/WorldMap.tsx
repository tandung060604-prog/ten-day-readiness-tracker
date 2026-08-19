import { useState, useRef, useEffect, useCallback } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { audioSystem } from '../systems/GameAudioSystem'
import { playChiikawaVoice } from '../../utils/chiikawaAudio'
import type { LocationId, MapBuilding, TransitionType } from '../types'
import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
}

interface BuildingStoryData {
  chapter: string
  jpTag: string
  character: ChiikawaCharacter
  charName: string
  charRole: string
  actionLabel: string
  actionEmoji: string
  voiceChar: ChiikawaCharacter
  storyNarrative: string
  quote: string
  objective: string
  reward: string
}

export const MAP_BUILDINGS: (MapBuilding & { story: BuildingStoryData })[] = [
  {
    id: 'home',
    name: 'Nhà Của Chúng Mình',
    subtitle: 'Tổ Ấm & 10 Ngày Sẵn Sàng',
    icon: '🏡',
    img: './assets/buildings/house.png',
    transition: 'heart',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.7)',
    tag: 'Tổ Ấm',
    size: 130,
    x: 14.0,
    y: 28.0,
    story: {
      chapter: 'CHƯƠNG I: TỔ ẤM YÊU THƯƠNG',
      jpTag: '愛の我が家 · HOME',
      character: 'chiikawa',
      charName: 'Chiikawa',
      charRole: 'Người Giữ Lửa Tổ Ấm',
      actionLabel: 'Đang tưới hoa & chuẩn bị trà ấm đón 2 bạn',
      actionEmoji: '🌷🍵',
      voiceChar: 'chiikawa',
      storyNarrative:
        'Căn nhà cổ tích ấm cúng nằm trên ngọn đồi thoai thoải nhìn ra dòng suối trong vắt. Nơi đây là trung tâm kết nối mọi ký ức ngọt ngào của Dũng & Em Yêu, lưu giữ từng ngày yêu nhau từ 11/06/2026 và theo dõi lộ trình chuẩn bị chu đáo cho chuyến đi Nha Trang.',
      quote: 'Chào mừng Dũng & Em Yêu về nhà! Hôm nay hai bạn đã cùng nhau làm được rất nhiều điều tuyệt vời rồi đó~',
      objective: 'Theo dõi chỉ số ngày yêu & Cập nhật trạng thái sẵn sàng',
      reward: '+100 ❤️ Trái Tim Tình Yêu'
    }
  },
  {
    id: 'gym',
    name: 'Nhà Tập (Gym & Dojo)',
    subtitle: 'Rèn Luyện Thể Lực & Đẩy Tạ',
    icon: '🏋️',
    img: './assets/buildings/gym.png',
    transition: 'cloud',
    color: '#ffd166',
    glow: 'rgba(255,209,102,0.7)',
    tag: 'Thể Lực',
    size: 120,
    x: 32.0,
    y: 22.0,
    story: {
      chapter: 'CHƯƠNG II: ĐẤU TRƯỜNG LUYỆN THỂ',
      jpTag: '武道鍛錬場 · GYM DOJO',
      character: 'usagi',
      charName: 'Usagi HLV',
      charRole: 'Huấn Luyện Viên Siêu Cấp',
      actionLabel: 'Đang đẩy tạ hết mình phát sáng năng lượng',
      actionEmoji: '⚡🏋️',
      voiceChar: 'usagi',
      storyNarrative:
        'Võ đường rèn luyện thể lực được bảo hộ bởi nguồn năng lượng bất tận của chú thỏ Usagi. Mỗi hiệp tạ nâng lên, mỗi phút cardio đều là từng viên gạch xây dựng vóc dáng săn chắc, tự tin diện đồ đẹp và tràn đầy sức sống khi đặt chân lên bãi biển Nha Trang.',
      quote: 'Ya-haaa! Uraaaa! Đẩy tạ hết sức mình nào, không có chỗ cho sự lười biếng đâu đấy!',
      objective: 'Hoàn thành bài tập thể lực & Ghi nhận hiệp tạ hoàn thành',
      reward: '+80 ⚡ Năng Lượng & +30 ⭐ Kỷ Luật'
    }
  },
  {
    id: 'water',
    name: 'Đài Uống Nước',
    subtitle: 'Bù Nước & Điện Giải Đầy Đủ',
    icon: '⛲',
    img: './assets/buildings/water.png',
    transition: 'water',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.7)',
    tag: 'Bù Nước',
    size: 114,
    x: 52.0,
    y: 19.0,
    story: {
      chapter: 'CHƯƠNG III: ĐÀI NƯỚC TINH KHIẾT',
      jpTag: '生命の泉 · FOUNTAIN',
      character: 'hachiware',
      charName: 'Hachiware',
      charRole: 'Sứ Giả Bù Nước',
      actionLabel: 'Đang múc từng ngụm nước suối mát lạnh',
      actionEmoji: '💧✨',
      voiceChar: 'hachiware',
      storyNarrative:
        'Đài phun nước cổ kính phun trào dòng nước ngầm thanh mát từ mạch nguồn tự nhiên. Hachiware luôn túc trực nhắc nhở đôi bạn uống đủ nước theo từng cữ trong ngày, giúp cơ thể thải độc, da dẻ hồng hào và giữ tinh thần luôn tỉnh táo.',
      quote: 'Nanto kanaare! Dù bận rộn đến đâu cũng nhớ uống đủ 2 - 2.5L nước để luôn rạng rỡ nha!',
      objective: 'Đạt mốc 2,000ml – 2,500ml nước mỗi ngày',
      reward: '+50 💧 Điểm Thanh Lọc'
    }
  },
  {
    id: 'journal',
    name: 'Thư Viện Nhật Ký',
    subtitle: 'Cảm Xúc & Ký Ức Đôi Ta',
    icon: '📖',
    img: './assets/buildings/library.png',
    transition: 'book',
    color: '#cdb4db',
    glow: 'rgba(205,180,219,0.7)',
    tag: 'Nhật Ký',
    size: 126,
    x: 69.0,
    y: 23.0,
    story: {
      chapter: 'CHƯƠNG IV: THƯ VIỆN KÝ ỨC',
      jpTag: '記憶の図書館 · LIBRARY',
      character: 'hachiware',
      charName: 'Hachiware Học Giả',
      charRole: 'Thủ Thư Ký Ức',
      actionLabel: 'Đang cẩn thận nắn nót từng trang nhật ký',
      actionEmoji: '👓📜',
      voiceChar: 'hachiware',
      storyNarrative:
        'Tòa thư viện cổ tích với mái nhà hình cuốn sách khổng lồ mở ra giữa rừng hoa anh đào. Từng dòng suy ngẫm, từng lời động viên, những khoảnh khắc vui buồn và cảm xúc chân thật nhất của hai bạn đều được cất giữ trân trọng tại nơi này.',
      quote: 'Mỗi ngày trôi qua bên nhau là một câu chuyện đẹp đáng được khắc ghi vào trang sách cuộc đời!',
      objective: 'Viết nhật ký ngày & Suy ngẫm hành trình',
      reward: '+60 📖 Điểm Trí Tuệ & Cảm Xúc'
    }
  },
  {
    id: 'album',
    name: 'Album Kỷ Niệm',
    subtitle: 'Kho Báu Ảnh & Dấu Ấn Hẹn Hò',
    icon: '📸',
    img: './assets/buildings/album.png',
    transition: 'camera',
    color: '#ff8da1',
    glow: 'rgba(255,141,161,0.7)',
    tag: 'Ảnh Đôi',
    size: 126,
    x: 84.0,
    y: 28.0,
    story: {
      chapter: 'CHƯƠNG V: TIỆM ẢNH HẸN HÒ',
      jpTag: '写真館 · PHOTO STUDIO',
      character: 'chiikawa',
      charName: 'Chiikawa Nhiếp Ảnh',
      charRole: 'Nhiếp Ảnh Gia Đáng Yêu',
      actionLabel: 'Đang rửa những bức ảnh kỷ niệm tuyệt đẹp',
      actionEmoji: '🎞️🎈',
      voiceChar: 'chiikawa',
      storyNarrative:
        'Tiệm ảnh ngập tràn ánh đèn lung linh và những tấm hình treo bằng kẹp gỗ xinh xắn. Nơi lưu giữ trọn vẹn từng nụ cười, ánh mắt và những chuyến đi đáng nhớ nhất của Dũng & Em Yêu suốt chặng đường yêu nhau.',
      quote: 'Tách! Nụ cười của hai bạn lúc nào cũng làm bừng sáng cả thế giới nhỏ này~',
      objective: 'Xem và lưu giữ bộ sưu tập ảnh đôi',
      reward: '+75 📸 Điểm Kỷ Niệm'
    }
  },
  {
    id: 'sleep',
    name: 'Trung Tâm Giấc Ngủ',
    subtitle: 'Nạp Lại 100% Năng Lượng Tự Nhiên',
    icon: '🌙',
    img: './assets/buildings/sleep.png',
    transition: 'moon',
    color: '#7b68ee',
    glow: 'rgba(123,104,238,0.7)',
    tag: 'Giấc Ngủ',
    size: 128,
    x: 13.0,
    y: 56.0,
    story: {
      chapter: 'CHƯƠNG VI: THUNG LŨNG GIẤC MƠ',
      jpTag: '夢の城 · SLEEP HAVEN',
      character: 'kurimanju',
      charName: 'Kurimanju',
      charRole: 'Thần Ngủ Yên Bình',
      actionLabel: 'Đang say giấc nồng trên đệm mây tím',
      actionEmoji: '💤🌙',
      voiceChar: 'kurimanju',
      storyNarrative:
        'Căn nhà giường mây bồng bềnh phủ hoa oải hương dưới ánh trăng vàng dịu mát. Không gian hoàn hảo để theo dõi chu kỳ giấc ngủ 90 phút, lắng nghe âm thanh ru ngủ thiên nhiên và giúp cơ thể phục hồi tuyệt đối sau ngày dài.',
      quote: 'Haaaa~ Một giấc ngủ sâu trọn vẹn 5 chu kỳ (7.5 tiếng) sẽ nạp đầy 100% sinh lực cho ngày mai.',
      objective: 'Ngủ đủ 7–8 tiếng & Thức dậy vào cuối chu kỳ REM',
      reward: '+100 🌙 Hồi Phục Thể Lực'
    }
  },
  {
    id: 'quests',
    name: 'Quảng Trường Quest',
    subtitle: 'Mục Tiêu & Thói Quen Hàng Ngày',
    icon: '🎪',
    img: './assets/buildings/quest.png',
    transition: 'cloud',
    color: '#e0aa4d',
    glow: 'rgba(224,170,77,0.7)',
    tag: 'Nhiệm Vụ',
    size: 106,
    x: 50.0,
    y: 38.0,
    story: {
      chapter: 'CHƯƠNG VII: BẢNG NHIỆM VỤ LÀNG',
      jpTag: '冒険広場 · QUEST BOARD',
      character: 'rakko',
      charName: 'Sư Phụ Rakko',
      charRole: 'Tổng Chỉ Huy Kỷ Luật',
      actionLabel: 'Đang kiểm tra bảng danh sách nhiệm vụ',
      actionEmoji: '⭐📜',
      voiceChar: 'rakko',
      storyNarrative:
        'Bảng thông báo gỗ mộc mạc dựng ngay ngã rẽ trung tâm làng. Mỗi thói quen nhỏ như uống nước, vận động, ăn sạch hay ngủ sớm đều được quy đổi thành những nhiệm vụ hào hiệp để cùng nhau hoàn thành mỗi ngày.',
      quote: 'Kỷ luật và kiên trì từng ngày sẽ biến mọi ước mơ thành hiện thực. Hãy hoàn thành 100% mục tiêu hôm nay!',
      objective: 'Hoàn thành toàn bộ checklist nhiệm vụ trong ngày',
      reward: '+150 ⭐ Điểm Danh Dự & Huy Hiệu'
    }
  },
  {
    id: 'market',
    name: 'Chợ Nhỏ Dinh Dưỡng',
    subtitle: 'Thực Đơn Lành Mạnh & Macro Sạch',
    icon: '🛒',
    img: './assets/buildings/market.png',
    transition: 'cloud',
    color: '#38b283',
    glow: 'rgba(56,178,131,0.7)',
    tag: 'Dinh Dưỡng',
    size: 120,
    x: 74.0,
    y: 47.0,
    story: {
      chapter: 'CHƯƠNG VIII: KHU CHỢ XANH',
      jpTag: '新鮮市場 · MARKET',
      character: 'momonga',
      charName: 'Momonga',
      charRole: 'Chuyên Gia Dinh Dưỡng',
      actionLabel: 'Đang chọn những giỏ dâu tây & rau sạch',
      actionEmoji: '🍓🥗',
      voiceChar: 'momonga',
      storyNarrative:
        'Gian hàng chợ quê rực rỡ sắc màu với những giỏ trái cây, rau củ quả tươi ngon thu hoạch từ các nông trại sạch. Nơi bạn theo dõi khẩu phần calo, cân đối hàm lượng đạm - xơ - tinh bột chuẩn chỉnh nhất.',
      quote: 'Nhìn này, đồ ăn tươi ngon và healthy thế này cơ mà! Khen tôi đi vì đã chọn thực đơn chuẩn nào!',
      objective: 'Ghi nhận 3 bữa ăn chính & Đạt mục tiêu dinh dưỡng sạch',
      reward: '+70 🥗 Điểm Sức Khỏe Dẻo Dai'
    }
  },
  {
    id: 'restaurant',
    name: 'Nhà Hàng Hẹn Hò',
    subtitle: 'Bữa Tối Lãng Mạn Dành Cho 2 Người',
    icon: '🍷',
    img: './assets/buildings/restaurant.png',
    transition: 'heart',
    color: '#e57385',
    glow: 'rgba(229,115,133,0.7)',
    tag: 'Hẹn Hò',
    size: 130,
    x: 25.0,
    y: 76.0,
    story: {
      chapter: 'CHƯƠNG IX: TIỆM ĂN ÁNH NẾN',
      jpTag: '恋人レストラン · BISTRO',
      character: 'chiikawa',
      charName: 'Chiikawa & Usagi',
      charRole: 'Bồi Bàn Lãng Mạn',
      actionLabel: 'Đang thắp nến bàn tiệc & chuẩn bị ly vang',
      actionEmoji: '🕯️🍷',
      voiceChar: 'chiikawa',
      storyNarrative:
        'Quán ăn nhỏ với mái ngói hình trái tim, ban công ngập tràn hoa hồng và những chiếc bàn tiệc khăn trắng tinh tươm. Điểm hẹn hò lãng mạn mô phỏng bữa tối tại Queen Ann Sky Lounge trong chuyến đi Nha Trang.',
      quote: 'Dưới ánh nến lung linh và giai điệu du dương, khoảnh khắc bên cạnh người mình yêu là vô giá!',
      objective: 'Lên lịch trình ăn tối & Khám phá ẩm thực Nha Trang',
      reward: '+120 ❤️ Điểm Hạnh Phúc Đôi Lứa'
    }
  },
  {
    id: 'settings',
    name: 'Tòa Thị Chính',
    subtitle: 'Quản Trị Hệ Thống & Mã PIN Bảo Mật',
    icon: '🏛️',
    img: './assets/buildings/townhall.png',
    transition: 'gear',
    color: '#a8dadc',
    glow: 'rgba(168,218,220,0.7)',
    tag: 'Hệ Thống',
    size: 140,
    x: 48.0,
    y: 79.0,
    story: {
      chapter: 'CHƯƠNG X: TÒA THỊ CHÍNH THỊ TRẤN',
      jpTag: '町役場 · TOWN HALL',
      character: 'rakko',
      charName: 'Thị Trưởng Rakko',
      charRole: 'Người Bảo Vệ Không Gian Riêng',
      actionLabel: 'Đang kiểm tra ổ khóa mã PIN & sao lưu dữ liệu',
      actionEmoji: '🔐🏛️',
      voiceChar: 'rakko',
      storyNarrative:
        'Cung điện trang nghiêm với tháp đồng hồ vàng và các vòm mái xanh uy nghi. Nơi lưu trữ an toàn toàn bộ dữ liệu tình yêu của 2 bạn, thiết lập mã PIN bảo mật riêng tư tuyệt đối và tùy biến giao diện game.',
      quote: 'Thế giới này là của riêng hai bạn. Mọi dữ liệu đều được mã hóa an toàn và bảo mật tối đa!',
      objective: 'Cài đặt mã khóa PIN, Âm thanh & Sao lưu dữ liệu',
      reward: '+100 🛡️ Điểm Bảo Mật Tuyệt Đối'
    }
  },
  {
    id: 'airport',
    name: 'Sân Bay Quốc Tế',
    subtitle: 'Đếm Ngược Khởi Hành Nha Trang 27/08',
    icon: '✈️',
    img: './assets/buildings/airport.png',
    transition: 'plane',
    color: '#67b7ff',
    glow: 'rgba(103,183,255,0.7)',
    tag: 'Chuyến Bay',
    size: 136,
    x: 71.0,
    y: 70.0,
    story: {
      chapter: 'CHƯƠNG XI: ĐƯỜNG BĂNG MƠ ƯỚC',
      jpTag: '国際空港 · AIRPORT',
      character: 'usagi',
      charName: 'Cơ Trưởng Usagi',
      charRole: 'Phi Công Cất Cánh',
      actionLabel: 'Đang kiểm tra phi cơ & vẫy cờ hiệu khởi hành',
      actionEmoji: '🛫🧳',
      voiceChar: 'usagi',
      storyNarrative:
        'Đường băng rộng mở hướng ra chân trời với chiếc phi cơ màu hồng trắng sẵn sàng cất cánh. Đồng hồ đếm ngược từng ngày, từng giờ hướng về chuyến bay chở đôi bạn tới kỳ nghỉ thiên đường tại Nha Trang vào ngày 27/08.',
      quote: 'Uraaaaa! Chuẩn bị hành lý và tinh thần thật tốt, phi cơ Little Days sắp cất cánh đưa 2 bạn đi chơi rồi!',
      objective: 'Theo dõi đồng hồ đếm ngược chuyến bay & Quỹ MOMO du lịch',
      reward: '+200 ✈️ Điểm Phiêu Lưu'
    }
  },
  {
    id: 'beach',
    name: 'Bãi Biển Nha Trang',
    subtitle: 'Thiên Đường Tour 3 Đảo & San Hô',
    icon: '🏖️',
    img: './assets/buildings/beach.png',
    transition: 'water',
    color: '#4ee1aa',
    glow: 'rgba(78,225,170,0.7)',
    tag: 'Nha Trang',
    size: 136,
    x: 88.0,
    y: 74.0,
    story: {
      chapter: 'CHƯƠNG XII: THIÊN ĐƯỜNG BIỂN NHA TRANG',
      jpTag: 'ニャチャン海岸 · NHA TRANG BEACH',
      character: 'chiikawa',
      charName: 'Chiikawa Du Hí',
      charRole: 'Hướng Dẫn Viên Biển',
      actionLabel: 'Đang tắm nắng, lướt ván & uống nước dừa',
      actionEmoji: '🥥🏄',
      voiceChar: 'chiikawa',
      storyNarrative:
        'Bờ cát trắng mịn màng bên làn nước biển xanh ngắt thấu đáy. Khám phá trọn vẹn tour 3 đảo Mini Beach, Hòn Mun lặn ngắm san hô, Làng Chài thưởng thức hải sản tươi rói, Làng bích họa Vĩnh Trường và Viện Hải Dương Học.',
      quote: 'Biển xanh cát trắng nắng vàng, hai đứa mình cùng nắm tay nhau dạo bước dưới bóng dừa nhé!',
      objective: 'Khám phá lịch trình 5 địa điểm đặc sắc tại Nha Trang',
      reward: '+250 🌴 Điểm Thiên Đường Nhiệt Đới'
    }
  }
]

const DIALOG_LINES = [
  'Chào mừng Dũng & Em Yêu đến với thị trấn Little Days! ✨',
  'Hôm nay cùng hoàn thành mục tiêu để sẵn sàng cho Nha Trang 27/08 nhé! 🌴',
  'Chiikawa & Usagi luôn bên cạnh cổ vũ tình yêu của 2 đứa mình! 💖',
  'Nhấn vào bất kỳ địa điểm nào trên bản đồ để mở cốt truyện nha! 🚀'
]

export function WorldMap({ onSelectBuilding, loveDays }: Props) {
  const [activeStoryBuilding, setActiveStoryBuilding] = useState<(typeof MAP_BUILDINGS)[0] | null>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [mascotBounce, setMascotBounce] = useState(false)
  const [activeVoicePhrase, setActiveVoicePhrase] = useState<string | null>(null)

  // Zoom & Pan Engine
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const initialPanRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto Landscape Request on mobile
  useEffect(() => {
    const requestLandscape = async () => {
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape')
        }
      } catch {
        // Ignored if user hasn't engaged fullscreen or unsupported
      }
    }
    requestLandscape()
  }, [])

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.max(0.75, Math.min(2.4, prev + delta))
      audioSystem.playClick('soft')
      return next
    })
  }

  const handleResetZoom = () => {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    audioSystem.playClick('soft')
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.12 : -0.12
    setZoom((prev) => Math.max(0.75, Math.min(2.4, prev + delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    initialPanRef.current = { ...pan }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: initialPanRef.current.x + dx,
      y: initialPanRef.current.y + dy
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Click on Building -> Play Building SFX, Play Voice, Camera Pan & Open Story Modal
  const handleBuildingClick = (b: (typeof MAP_BUILDINGS)[0]) => {
    audioSystem.playBuildingInspectSFX(b.id)
    const phrase = playChiikawaVoice(b.story.voiceChar)
    setActiveVoicePhrase(`${b.story.charName}: "${phrase}"`)
    setActiveStoryBuilding(b)

    // Camera glide to building
    const targetX = (50 - b.x) * 8.5
    const targetY = (50 - b.y) * 6.5
    setPan({ x: targetX, y: targetY })
    setZoom(1.35)

    setTimeout(() => setActiveVoicePhrase(null), 3200)
  }

  const handleReplayVoice = (charKey: ChiikawaCharacter, charName: string) => {
    const phrase = playChiikawaVoice(charKey)
    setActiveVoicePhrase(`${charName}: "${phrase}"`)
    setTimeout(() => setActiveVoicePhrase(null), 2500)
  }

  const handleEnterBuilding = () => {
    if (!activeStoryBuilding) return
    const b = activeStoryBuilding
    audioSystem.playClick('enter')
    setActiveStoryBuilding(null)
    onSelectBuilding(b.id, b.transition)
  }

  const handleMascotClick = () => {
    const phrase = playChiikawaVoice('usagi')
    setMascotBounce(true)
    setDialogIdx((prev) => (prev + 1) % DIALOG_LINES.length)
    setActiveVoicePhrase(`Usagi & Chiikawa: "${phrase}"`)
    setTimeout(() => {
      setMascotBounce(false)
      setActiveVoicePhrase(null)
    }, 2500)
  }

  return (
    <div
      className="game-world-map-viewport"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {/* ══════ SUNLIGHT GOD RAYS & VOLUMETRIC ATMOSPHERE ══════ */}
      <div className="sunlight-god-rays" />

      {/* ══════ SEAMLESS INTEGRATED SKY CLOUDS ══════ */}
      <div className="sky-integrated-clouds">
        <div className="soft-sky-cloud cloud-soft-1" />
        <div className="soft-sky-cloud cloud-soft-2" />
        <div className="soft-sky-cloud cloud-soft-3" />
      </div>

      {/* ══════ DRIFTING SAKURA PETALS & BUTTERFLIES ══════ */}
      <div className="living-world-ambient-layer">
        <div className="ambient-sakura-particles">
          <span className="petal pt1">🌸</span>
          <span className="petal pt2">✨</span>
          <span className="petal pt3">🌸</span>
          <span className="petal pt4">🍃</span>
          <span className="petal pt5">✨</span>
          <span className="petal pt6">🌸</span>
        </div>
        <div className="ambient-butterflies">
          <span className="butterfly b1">🦋</span>
          <span className="butterfly b2">🦋</span>
        </div>
      </div>

      {/* ══════ MAIN INTERACTIVE MAP CANVAS (Zoom & Pan Layer) ══════ */}
      <div
        className="game-map-canvas"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* 1. Clean High-Res Terrain Background (NO text, NO baked UI) */}
        <img
          src="./assets/game_terrain.jpg"
          alt="Little Days Town Map"
          className="map-terrain-background"
          draggable={false}
        />

        {/* Dynamic Water & Waves Effect */}
        <div className="terrain-water-shimmer" />
        <div className="beach-waves-animation" />

        {/* 2. Farming-Game Style 3D Isometric Buildings (Natural Idle Bobbing, Zero Permanent Text) */}
        {MAP_BUILDINGS.map((b) => {
          const isSelected = activeStoryBuilding?.id === b.id

          return (
            <div
              key={b.id}
              className={`map-building-entity farming-building-idle ${isSelected ? 'entity-selected' : ''}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                '--bldg-theme-color': b.color,
                '--bldg-theme-glow': b.glow
              } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation()
                handleBuildingClick(b)
              }}
              title={`${b.name} (Nhấn để mở cốt truyện)`}
            >
              {/* Chimney Smoke Animation */}
              {(b.id === 'home' || b.id === 'gym' || b.id === 'restaurant' || b.id === 'journal') && (
                <div className="chimney-smoke-puff">
                  <span className="smoke s1" />
                  <span className="smoke s2" />
                </div>
              )}

              {/* 3D Model Sprite Container with Farm Game Gentle Sway */}
              <div
                className="building-sprite-wrapper"
                style={{ width: `${b.size}px`, height: `${b.size}px` }}
              >
                <img
                  src={b.img}
                  alt={b.name}
                  className="building-3d-model"
                  draggable={false}
                />
                <div className="building-ambient-shadow" />
                <span className="building-hover-glow-indicator" />
              </div>
            </div>
          )
        })}

        {/* 3. Central Plaza Mascots (Chiikawa & Usagi) */}
        <div
          className={`central-mascots-group ${mascotBounce ? 'mascots-excited' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleMascotClick()
          }}
          title="Bé Chiikawa & Usagi (Nhấn để trò chuyện)"
        >
          <div className="mascot-pair">
            <ChiikawaSVG character="chiikawa" size={76} className="animate-bounce-gentle" />
            <span className="mascot-heart-badge">💖</span>
            <ChiikawaSVG character="usagi" size={76} className="animate-bounce-gentle" />
          </div>
          <div className="mascot-dialog-bubble">
            <p>{DIALOG_LINES[dialogIdx]}</p>
          </div>
        </div>
      </div>

      {/* ══════ MAP OVERLAY HUD (Fixed UI Controls) ══════ */}

      {/* 1. Zoom Controls (Top Right) */}
      <div className="map-zoom-hud interactive-control">
        <button className="zoom-btn" onClick={() => handleZoom(0.25)} title="Phóng to">+</button>
        <span className="zoom-level-text">{Math.round(zoom * 100)}%</span>
        <button className="zoom-btn" onClick={() => handleZoom(-0.25)} title="Thu nhỏ">-</button>
        <button className="zoom-reset-btn" onClick={handleResetZoom} title="Đặt lại góc nhìn">🎯</button>
      </div>

      {/* 2. Floating Voice Bubble Notification */}
      {activeVoicePhrase && (
        <div className="voice-floating-chip animate-slide-up interactive-control">
          <span className="voice-sound-icon">🔊</span>
          <strong>{activeVoicePhrase}</strong>
        </div>
      )}

      {/* 3. Bottom Left Love Counter Widget */}
      <div className="game-love-counter-chip animate-slide-up interactive-control">
        <span className="love-chip-icon">💖</span>
        <div className="love-chip-content">
          <small>Đếm Ngày Yêu Nhau</small>
          <strong>{loveDays.toLocaleString()} <span>ngày</span></strong>
        </div>
      </div>

      {/* ══════ 4. SPLIT-VIEW STORYBOOK RPG INSPECTION MODAL ══════ */}
      {activeStoryBuilding && (
        <div className="storybook-modal-backdrop animate-fade-in" onClick={() => setActiveStoryBuilding(null)}>
          <div className="storybook-modal-split-card animate-pop" onClick={(e) => e.stopPropagation()}>
            <button className="storybook-close-btn" onClick={() => setActiveStoryBuilding(null)}>✕</button>

            {/* ── LEFT COLUMN: 3D Model & Character Showcase ── */}
            <div className="storybook-left-col" style={{ background: activeStoryBuilding.glow }}>
              <div className="showcase-model-container">
                <img
                  src={activeStoryBuilding.img}
                  alt={activeStoryBuilding.name}
                  className="showcase-3d-model animate-bounce-gentle"
                />
                <div className="showcase-ground-aura" />
              </div>

              {/* Character Companion Action Badge */}
              <div className="showcase-companion-box">
                <div className="companion-avatar-wrap">
                  <ChiikawaSVG character={activeStoryBuilding.story.character} size={48} />
                </div>
                <div className="companion-text-meta">
                  <strong>{activeStoryBuilding.story.charName}</strong>
                  <small>{activeStoryBuilding.story.actionLabel}</small>
                </div>
              </div>

              {/* Japanese Title Tag */}
              <div className="showcase-jp-badge">
                <span>{activeStoryBuilding.story.jpTag}</span>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Story Narrative & Feature Info ── */}
            <div className="storybook-right-col">
              <div className="story-header-area">
                <span className="story-chapter-tag" style={{ backgroundColor: activeStoryBuilding.color }}>
                  {activeStoryBuilding.story.chapter}
                </span>
                <h2 className="story-location-title">{activeStoryBuilding.name}</h2>
                <p className="story-location-sub">{activeStoryBuilding.subtitle}</p>
              </div>

              {/* Story Narrative Text */}
              <div className="story-narrative-box">
                <span className="scroll-icon">📜</span>
                <p>{activeStoryBuilding.story.storyNarrative}</p>
              </div>

              {/* Character Dialogue Quote with Replay Button */}
              <div className="story-character-quote-box">
                <div className="quote-speech-line">
                  <span className="quote-mark">💬</span>
                  <p>"{activeStoryBuilding.story.quote}"</p>
                </div>
                <button
                  className="voice-replay-btn"
                  onClick={() => handleReplayVoice(activeStoryBuilding.story.voiceChar, activeStoryBuilding.story.charName)}
                  title="Nghe lại giọng lồng tiếng"
                >
                  <span>🔊 Nghe Lời Thoại</span>
                </button>
              </div>

              {/* Quest Goal & Rewards */}
              <div className="story-quest-meta-grid">
                <div className="quest-meta-item">
                  <span className="meta-label">🎯 Mục Tiêu:</span>
                  <span className="meta-val">{activeStoryBuilding.story.objective}</span>
                </div>
                <div className="quest-meta-item">
                  <span className="meta-label">🏆 Phần Thưởng:</span>
                  <span className="meta-val reward-val">{activeStoryBuilding.story.reward}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="story-actions-row">
                <button className="story-back-btn" onClick={() => setActiveStoryBuilding(null)}>
                  ✕ Quay Lại Bản Đồ
                </button>
                <button
                  className="story-enter-btn"
                  style={{ backgroundColor: activeStoryBuilding.color }}
                  onClick={handleEnterBuilding}
                >
                  <span>✨ TIẾP TỤC HÀNH TRÌNH</span>
                  <span className="btn-arrow-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
