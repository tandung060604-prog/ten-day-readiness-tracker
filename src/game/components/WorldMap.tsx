import { useState, useRef, useEffect, useCallback } from 'react'
import { ChiikawaSVG } from '../../components/common/ChiikawaSVG'
import { GameIcon } from '../../components/common/GameIcons'
import { audioSystem } from '../systems/GameAudioSystem'
import { playChiikawaVoice } from '../../utils/chiikawaAudio'
import { speakVietnamese, BUILDING_VIETNAMESE_VOICES } from '../../utils/vietnameseAudio'
import { MapAnimationCanvas } from './MapAnimationCanvas'
import { GameTutorialModal, TUTORIAL_STEPS } from './GameTutorialModal'
import type { MascotMapPosition } from '../../domain/world/types'
import type { TutorialStep } from './GameTutorialModal'
import type { LocationId, MapBuilding, TransitionType } from '../types'
import type { ChiikawaCharacter } from '../../utils/chiikawaAudio'

type Props = {
  onSelectBuilding: (id: LocationId, transition: TransitionType) => void
  loveDays: number
  onDragStateChange?: (isDragging: boolean) => void
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
    size: 132,
    x: 35.5,
    y: 34.0,
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
        'Căn nhà cổ tích ấm cúng nằm trên ngọn đồi thoai thoải nhìn ra dòng suối trong vắt. Nơi đây là trung tâm kết nối mọi ký ức ngọt ngào của Haru & Mai Trang, lưu giữ từng ngày yêu nhau từ 11/06/2026 và theo dõi lộ trình chuẩn bị chu đáo cho chuyến đi Nha Trang.',
      quote: 'Chào mừng Haru & Mai Trang về nhà! Hôm nay hai bạn đã cùng nhau làm được rất nhiều điều tuyệt vời rồi đó~',
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
    size: 126,
    x: 82.0,
    y: 39.0,
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
    size: 118,
    x: 68.0,
    y: 15.0,
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
    x: 31.5,
    y: 60.5,
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
    size: 125,
    x: 64.5,
    y: 34.5,
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
    size: 125,
    x: 38.5,
    y: 48.0,
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
    size: 118,
    x: 62.5,
    y: 48.5,
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
    id: 'hospital',
    name: 'Bệnh Viện Tình Yêu',
    subtitle: 'Theo Dõi Chu Kỳ Flo & Sức Khỏe Mai Trang',
    icon: '🏥',
    img: './assets/buildings/hospital.png',
    transition: 'heart',
    color: '#ff477e',
    glow: 'rgba(255, 71, 126, 0.75)',
    tag: 'Chu Kỳ Flo',
    size: 126,
    x: 15.0,
    y: 48.0,
    story: {
      chapter: 'CHƯƠNG XIII: BỆNH VIỆN TÌNH YÊU & SỨC KHỎE PHÁI ĐẸP',
      jpTag: '愛のクリニック · LOVE CLINIC',
      character: 'usagi',
      charName: 'Usagi & Bác Sĩ Chiikawa',
      charRole: 'Bác Sĩ Chu Kỳ & Chăm Sóc Sức Khỏe',
      actionLabel: 'Đang theo dõi chu kỳ 29/07 & chuẩn bị trà ấm',
      actionEmoji: '🌸🩺🍵',
      voiceChar: 'usagi',
      storyNarrative:
        'Phòng khám tình yêu dịu dàng với sắc hồng pastel ngọt ngào. Nơi đây áp dụng thuật toán theo dõi chu kỳ kinh nguyệt chuẩn Flo App từ kỳ gần nhất 29/07/2026, dự đoán chính xác ngày rụng trứng, cảnh báo lịch trình đi Nha Trang 27/08 và cung cấp cẩm nang ân cần giúp Haru chăm sóc bạn gái Mai Trang hoàn hảo nhất.',
      quote: 'Phụ nữ là để yêu thương! Hãy để Bác Sĩ Chiikawa & Haru chăm sóc từng ngày nhạy cảm cho Mai Trang nhé~',
      objective: 'Ghi nhận triệu chứng chu kỳ & Theo dõi ngày rụng trứng',
      reward: '+120 💖 Tình Yêu & +50 🩺 Điểm Sức Khỏe'
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
    size: 128,
    x: 56.5,
    y: 68.0,
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
    size: 128,
    x: 43.5,
    y: 68.0,
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
    size: 138,
    x: 53.5,
    y: 28.0,
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
    size: 134,
    x: 89.0,
    y: 64.0,
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
    size: 132,
    x: 67.0,
    y: 80.0,
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
  'Chào mừng Haru & Mai Trang đến với thị trấn Little Days! ✨',
  'Hôm nay cùng hoàn thành mục tiêu để sẵn sàng cho Nha Trang 27/08 nhé! 🌴',
  'Chiikawa & Usagi luôn bên cạnh cổ vũ tình yêu của 2 đứa mình! 💖',
  'Nhấn vào bất kỳ địa điểm nào trên bản đồ để mở cốt truyện nha! 🚀'
]

export function WorldMap({ onSelectBuilding, loveDays, onDragStateChange }: Props) {
  const [activeStoryBuilding, setActiveStoryBuilding] = useState<(typeof MAP_BUILDINGS)[0] | null>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [mascotBounce, setMascotBounce] = useState(false)
  const [activeVoicePhrase, setActiveVoicePhrase] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(() => {
    try { return localStorage.getItem('little_days_tutorial_completed') !== 'true' } catch { return true }
  })
  const [tutorialActiveBuildingId, setTutorialActiveBuildingId] = useState<LocationId | null>('home')

  // Night Mode Toggle (Manual)
  const [isNightMode, setIsNightMode] = useState(false)

  // Character Map Locomotion State
  const [mascotPos, setMascotPos] = useState<MascotMapPosition>({
    x: 48,
    y: 55,
    isMoving: false,
    facing: 'right',
    targetBuildingId: null
  })

  // Zoom & Clamped Pan Engine (Farm Game Style - cannot drag out of bounds)
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const initialPanRef = useRef({ x: 0, y: 0 })
  const touchDistanceRef = useRef<number | null>(null)
  const initialZoomRef = useRef(1.0)
  const containerRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<number | null>(null)

  // Clamping boundary calculation (keeps map tightly within view bounds)
  const clampCoords = useCallback((x: number, y: number, z: number) => {
    if (z <= 1.0) return { x: 0, y: 0 }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const maxPanX = (vw * (z - 1)) / 2
    const maxPanY = (vh * (z - 1)) / 2
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y))
    }
  }, [])

  // Tutorial Step Change -> Smooth Zoom In & Center Building with comfortable breathing room
  const handleTutorialStepChange = useCallback((step: TutorialStep) => {
    setTutorialActiveBuildingId(step.locationId)
    const isMobileLandscape = window.innerHeight < 520 && window.innerWidth > window.innerHeight
    const targetZoom = isMobileLandscape ? 1.2 : 1.3
    setZoom(targetZoom)
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Position building comfortably in the upper half of screen (30% on landscape, 40% on portrait)
    const centerYRatio = isMobileLandscape ? 0.30 : 0.40
    const targetPanX = (0.5 - step.x / 100) * vw * targetZoom
    const targetPanY = (centerYRatio - step.y / 100) * vh * targetZoom
    setPan(clampCoords(targetPanX, targetPanY, targetZoom))
  }, [clampCoords])

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false)
    setTutorialActiveBuildingId(null)
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    try { localStorage.setItem('little_days_tutorial_completed', 'true') } catch { /* noop */ }
  }, [])

  // 5-Second Idle Inactivity Timer for Top & Bottom HUD Auto-Hide
  const recordMapActivity = useCallback(() => {
    if (onDragStateChange) {
      onDragStateChange(true) // Hide HUD during interaction
    }
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current)
    }
    // After 5s of no interaction, reveal HUD again
    idleTimerRef.current = window.setTimeout(() => {
      if (onDragStateChange) {
        onDragStateChange(false)
      }
    }, 5000)
  }, [onDragStateChange])

  // Recalculate on screen orientation change (Portrait <-> Landscape)
  useEffect(() => {
    const handleResize = () => {
      setPan((prev) => clampCoords(prev.x, prev.y, zoom))
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [clampCoords, zoom])

  // Zoom controls
  const handleZoom = (delta: number) => {
    recordMapActivity()
    setZoom((prev) => {
      const next = Math.max(1.0, Math.min(2.5, +(prev + delta).toFixed(2)))
      setPan((curr) => clampCoords(curr.x, curr.y, next))
      audioSystem.playClick('soft')
      return next
    })
  }

  const handleResetZoom = () => {
    recordMapActivity()
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    audioSystem.playClick('soft')
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    recordMapActivity()
    const delta = e.deltaY < 0 ? 0.15 : -0.15
    setZoom((prev) => {
      const next = Math.max(1.0, Math.min(2.5, +(prev + delta).toFixed(2)))
      setPan((curr) => clampCoords(curr.x, curr.y, next))
      return next
    })
  }

  // 1. Mouse Drag Gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return
    recordMapActivity()
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    initialPanRef.current = { ...pan }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return
    recordMapActivity()
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan(clampCoords(initialPanRef.current.x + dx, initialPanRef.current.y + dy, zoom))
  }, [clampCoords, recordMapActivity, zoom])

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      recordMapActivity()
    }
  }, [recordMapActivity])

  // 2. Multi-Touch Drag & Pinch-to-Zoom for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return
    recordMapActivity()

    if (e.touches.length === 1) {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      initialPanRef.current = { ...pan }
      touchDistanceRef.current = null
    } else if (e.touches.length >= 2) {
      isDraggingRef.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchDistanceRef.current = Math.hypot(dx, dy)
      initialZoomRef.current = zoom
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    recordMapActivity()
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x
      const dy = e.touches[0].clientY - dragStartRef.current.y
      setPan(clampCoords(initialPanRef.current.x + dx, initialPanRef.current.y + dy, zoom))
    } else if (e.touches.length >= 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const currentDist = Math.hypot(dx, dy)
      const scaleFactor = currentDist / touchDistanceRef.current
      const newZoom = Math.max(1.0, Math.min(2.5, +(initialZoomRef.current * scaleFactor).toFixed(2)))
      setZoom(newZoom)
      setPan((curr) => clampCoords(curr.x, curr.y, newZoom))
    }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
    touchDistanceRef.current = null
    recordMapActivity()
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Click on Building -> Mascot Locomotion, Play SFX, Speech & Open Story Modal
  const handleBuildingClick = (b: (typeof MAP_BUILDINGS)[0]) => {
    recordMapActivity()
    audioSystem.playBuildingInspectSFX(b.id)

    // Smooth Mascot Locomotion Walk to building anchor
    const targetX = b.x
    const targetY = b.y + 6
    const facing = targetX < mascotPos.x ? 'left' : 'right'
    setMascotPos({
      x: targetX,
      y: targetY,
      isMoving: true,
      facing,
      targetBuildingId: b.id
    })

    setTimeout(() => {
      setMascotPos((prev) => ({ ...prev, isMoving: false }))
    }, 450)

    const phrase = playChiikawaVoice(b.story.voiceChar)
    setActiveVoicePhrase(`${b.story.charName}: "${phrase}"`)
    setActiveStoryBuilding(b)

    // Play Vietnamese speech audio for the clicked location!
    const viText = BUILDING_VIETNAMESE_VOICES[b.id] || `${b.name}. ${b.subtitle}`
    speakVietnamese(viText, { charVoice: b.story.voiceChar })

    setTimeout(() => setActiveVoicePhrase(null), 3200)
  }

  const handleReplayVoice = (charKey: ChiikawaCharacter, charName: string) => {
    const viText = BUILDING_VIETNAMESE_VOICES[activeStoryBuilding?.id || ''] || activeStoryBuilding?.story.quote || ''
    speakVietnamese(viText, { charVoice: charKey })
    setActiveVoicePhrase(`${charName}: "Đang phát lời thoại..."`)
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
    recordMapActivity()
    speakVietnamese('Chào mừng Haru và Mai Trang đến với thị trấn Little Days!', { charVoice: 'usagi' })
    setMascotBounce(true)
    setDialogIdx((prev) => (prev + 1) % DIALOG_LINES.length)
    setActiveVoicePhrase(`Usagi & Chiikawa: "Chào mừng hai bạn!"`)
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* ══════ NIGHT MODE OVERLAY (Manual Toggle) ══════ */}
      {isNightMode && (
        <>
          <div className="night-mode-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(12, 10, 32, 0.48)', pointerEvents: 'none', zIndex: 2, transition: 'opacity 0.8s ease' }} />
          <div className="night-stars-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
            {Array.from({ length: 45 }, (_, i) => (
              <span key={`star-${i}`} className="night-star-dot" style={{
                position: 'absolute',
                left: `${(i * 19.3) % 100}%`,
                top: `${(i * 11.7) % 48}%`,
                width: `${1.5 + (i % 3)}px`,
                height: `${1.5 + (i % 3)}px`,
                borderRadius: '50%',
                background: '#fffbe6',
                boxShadow: '0 0 6px 2px rgba(255,251,230,0.6)',
                animation: `star-twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4) % 3}s`,
                opacity: 0.5 + ((i % 5) * 0.1)
              }} />
            ))}
            {/* 8 Calm, Gentle Drifting Fireflies */}
            {Array.from({ length: 8 }, (_, i) => (
              <span key={`firefly-${i}`} className={`night-firefly firefly-track-${i % 2}`} style={{
                position: 'absolute',
                left: `${15 + i * 10}%`,
                top: `${35 + ((i * 13) % 45)}%`,
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#d4ff38',
                boxShadow: '0 0 10px 4px rgba(212, 255, 56, 0.65)',
                animation: `firefly-drift-${i % 2} ${8 + i * 1.5}s ease-in-out infinite alternate, star-twinkle ${2.5 + (i % 2)}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`
              }} />
            ))}
            <div style={{ position: 'absolute', right: '8%', top: '5%', fontSize: '36px', filter: 'drop-shadow(0 0 20px rgba(255,236,130,0.7))', opacity: 0.9 }}>🌙</div>
          </div>
        </>
      )}

      {/* ══════ SEAMLESS INTEGRATED SKY CLOUDS ══════ */}
      <div className="sky-integrated-clouds">
        <div className="soft-sky-cloud cloud-soft-1" />
        <div className="soft-sky-cloud cloud-soft-2" />
        <div className="soft-sky-cloud cloud-soft-3" />
      </div>

      {/* ══════ MAIN INTERACTIVE MAP CANVAS (Full Bleed with Clamped Pan & Zoom) ══════ */}
      <div
        className="game-map-canvas"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* 1. Base Terrain Background (Clean, High-Res, Guaranteed Load) */}
        <img
          src="./assets/game_terrain.jpg"
          onError={(e) => {
            e.currentTarget.src = './assets/game_world_map.jpg'
          }}
          alt="Little Days Island Map"
          className="map-terrain-background"
          draggable={false}
        />

        {/* Real Dynamic Living Game Canvas: Flowing River, Swimming Ducks, Foam Waves, Chimney Smoke & Fountain Spray */}
        <MapAnimationCanvas />

        {/* Dynamic Water Shimmer & Nha Trang Ocean Waves */}
        <div className="terrain-water-shimmer" />
        <div className="beach-waves-animation" />

        {/* ── Darkened Canvas Overlay during Tutorial (Dims everything except active building) ── */}
        {showTutorial && <div className="map-tutorial-dimmed-backdrop animate-fade-in" />}

        {/* Dynamic Walking Mascot Wanderer */}
        <div
          className={`world-mascot-wanderer ${mascotPos.isMoving ? 'mascot-walking' : 'mascot-idle'}`}
          style={{
            position: 'absolute',
            left: `${mascotPos.x}%`,
            top: `${mascotPos.y}%`,
            transform: `translate(-50%, -50%) scaleX(${mascotPos.facing === 'left' ? -1 : 1})`,
            transition: 'left 0.45s cubic-bezier(0.25, 1, 0.5, 1), top 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
            zIndex: 14,
            pointerEvents: 'none'
          }}
        >
          <ChiikawaSVG character="chiikawa" size={42} className={mascotPos.isMoving ? 'animate-bounce-gentle' : ''} />
          <span className="mascot-footstep-shadow" />
        </div>

        {/* 3. Farming-Game Style 3D Isometric Buildings (Natural Idle Bobbing, Lantern Glowing at Night) */}
        {MAP_BUILDINGS.map((b) => {
          const isSelected = activeStoryBuilding?.id === b.id
          const isTutorialTarget = showTutorial && tutorialActiveBuildingId === b.id

          return (
            <div
              key={b.id}
              className={`map-building-entity farming-building-idle ${isSelected ? 'entity-selected' : ''} ${isTutorialTarget ? 'entity-tutorial-highlighted' : ''} ${isNightMode ? 'night-lantern-lit' : ''}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                '--bldg-theme-color': b.color,
                '--bldg-theme-glow': b.glow
              } as React.CSSProperties}
              tabIndex={0}
              role="button"
              aria-label={`${b.name} - ${b.subtitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleBuildingClick(b)
                }
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleBuildingClick(b)
              }}
              title={`${b.name} (Nhấn để mở cốt truyện)`}
            >
              {/* Divine Sunbeam Light Pillar & Holy Halo for Tutorial Step */}
              {isTutorialTarget && (
                <div className="tutorial-building-illumination animate-fade-in">
                  <div className="spotlight-building-number-pin animate-bounce-gentle">
                    <span>{TUTORIAL_STEPS.find((s) => s.locationId === b.id)?.step || 1}</span>
                  </div>
                  <div className="building-heaven-beam" />
                  <div className="building-divine-aura-ring" />
                </div>
              )}

              {/* Chimney Smoke Animation */}
              {(b.id === 'home' || b.id === 'gym' || b.id === 'restaurant' || b.id === 'journal') && (
                <div className="chimney-smoke-puff">
                  <span className="smoke s1" />
                  <span className="smoke s2" />
                </div>
              )}

              {/* 3D Model Sprite Container with Farm Game Gentle Sway & Night Lantern Halo */}
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

        {/* 4. Central Plaza Mascots (Chiikawa & Usagi with Clean Transparent 3D Heart) */}
        <div
          className={`central-mascots-group interactive-control ${mascotBounce ? 'mascots-excited' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleMascotClick()
          }}
          title="Bé Chiikawa & Usagi (Nhấn để trò chuyện)"
        >
          <div className="mascot-pair">
            <ChiikawaSVG character="chiikawa" size={50} className="animate-bounce-gentle" />
            <span className="mascot-heart-badge">
              <GameIcon name="heart" size={22} />
            </span>
            <ChiikawaSVG character="usagi" size={50} className="animate-bounce-gentle" />
          </div>
          <div className="mascot-dialog-bubble">
            <p>{DIALOG_LINES[dialogIdx]}</p>
          </div>
        </div>
      </div>

      {/* ══════ MAP OVERLAY HUD (Fixed UI Controls) ══════ */}

      {/* 0. Night Mode Toggle Badge (Top Left) */}
      <button
        className="night-mode-toggle-chip animate-slide-up interactive-control"
        onClick={() => { audioSystem.playClick('soft'); setIsNightMode(prev => !prev); }}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 30,
          background: isNightMode ? 'rgba(20, 15, 45, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '6px 14px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: isNightMode ? '0 4px 15px rgba(100,80,200,0.25)' : '0 4px 15px rgba(0,0,0,0.08)',
          border: isNightMode ? '1.5px solid rgba(150,130,255,0.5)' : '1.5px solid rgba(100,200,100,0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        title={isNightMode ? 'Chuyển về Ban Ngày ☀️' : 'Bật Chế Độ Đêm 🌙'}
      >
        <span style={{ fontSize: '18px' }}>{isNightMode ? '🌙' : '☀️'}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <small style={{ fontSize: '10px', fontWeight: 800, color: isNightMode ? '#c4b5fd' : '#38a169', textTransform: 'uppercase' }}>
            {isNightMode ? 'ĐÊM SAO' : 'BAN NGÀY'}
          </small>
          <strong style={{ fontSize: '12px', color: isNightMode ? '#e2e8f0' : '#2b2d42' }}>
            {isNightMode ? 'Ánh Trăng & Đom Đóm' : 'Nắng Ấm Thị Trấn'}
          </strong>
        </div>
      </button>

      {/* 1. Zoom Controls & Tutorial Button (Top Right) */}
      <div className="map-zoom-hud interactive-control">
        <button
          className="map-tutorial-pill-btn"
          onClick={() => {
            recordMapActivity()
            setShowTutorial(true)
          }}
          title="Xem Hướng Dẫn Chơi Game (Tutorial)"
        >
          <span className="tut-icon">❓</span>
          <span className="tut-label">Hướng Dẫn</span>
        </button>
        <span className="hud-divider-pipe">|</span>
        <button className="zoom-btn" onClick={() => handleZoom(0.25)} title="Phóng to">+</button>
        <span className="zoom-level-text">{Math.round(zoom * 100)}%</span>
        <button className="zoom-btn" onClick={() => handleZoom(-0.25)} title="Thu nhỏ">-</button>
        <button className="zoom-reset-btn" onClick={handleResetZoom} title="Đặt lại góc nhìn">
          <GameIcon name="target" size={16} color="#d6336c" />
        </button>
      </div>

      {/* ── INTERACTIVE ONBOARDING TUTORIAL MODAL WITH SPOTLIGHT MASK & CAMERA ZOOM ── */}
      <GameTutorialModal
        isOpen={showTutorial}
        onClose={handleCloseTutorial}
        onStepChange={handleTutorialStepChange}
      />

      {/* 2. Floating Voice Bubble Notification */}
      {activeVoicePhrase && (
        <div className="voice-floating-chip animate-slide-up interactive-control">
          <span className="voice-sound-icon">
            <GameIcon name="sound" size={16} />
          </span>
          <strong>{activeVoicePhrase}</strong>
        </div>
      )}

      {/* 3. Bottom Left Love Counter Widget */}
      <div className="game-love-counter-chip animate-slide-up interactive-control">
        <span className="love-chip-icon">
          <GameIcon name="heart" size={20} />
        </span>
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
                <span className="scroll-icon">
                  <GameIcon name="scroll" size={20} color="#ff8da1" />
                </span>
                <p>{activeStoryBuilding.story.storyNarrative}</p>
              </div>

              {/* Character Dialogue Quote with Replay Button */}
              <div className="story-character-quote-box">
                <div className="quote-speech-line">
                  <span className="quote-mark">
                    <GameIcon name="speech" size={18} color="#67b7ff" />
                  </span>
                  <p>"{activeStoryBuilding.story.quote}"</p>
                </div>
                <button
                  className="voice-replay-btn"
                  onClick={() => handleReplayVoice(activeStoryBuilding.story.voiceChar, activeStoryBuilding.story.charName)}
                  title="Nghe lại giọng lồng tiếng"
                >
                  <GameIcon name="sound" size={15} color="#20bf6b" />
                  <span>Nghe Lời Thoại</span>
                </button>
              </div>

              {/* Quest Goal & Rewards */}
              <div className="story-quest-meta-grid">
                <div className="quest-meta-item">
                  <span className="meta-label">
                    <GameIcon name="target" size={14} style={{ marginRight: 4 }} />
                    Mục Tiêu:
                  </span>
                  <span className="meta-val">{activeStoryBuilding.story.objective}</span>
                </div>
                <div className="quest-meta-item">
                  <span className="meta-label">
                    <GameIcon name="trophy" size={14} style={{ marginRight: 4 }} />
                    Phần Thưởng:
                  </span>
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
                  <span>TIẾP TỤC HÀNH TRÌNH</span>
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
