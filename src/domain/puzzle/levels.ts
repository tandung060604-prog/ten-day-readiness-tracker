import type { LevelDefinition } from './types'

export const CANONICAL_PUZZLE_LEVELS: LevelDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 🏡 CHAPTER 1: OUR LITTLE HOME (Levels 1–10)
  // ═══════════════════════════════════════════════════════════════════════
  {
    levelNumber: 1,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Tia Sáng Đầu Tiên (First Spark)',
    subtitle: 'Làm quen với các bạn nhỏ Chiikawa mầm trắng đáng yêu',
    storyBeat: 'Lần đầu gặp gỡ và dọn dẹp căn phòng khách ấm cúng.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 20,
    starThresholds: [600, 1200, 1800],
    objectives: [{ type: 'collect_tiles', tileType: 'chiikawa', targetCount: 15, currentCount: 0 }],
    companionIntro: { character: 'chiikawa', dialogue: 'Waaah! Ghép 3 bé Chiikawa thẳng hàng để thu thập nhé! Cố lên nà~ 🌸' },
    rewards: { stars: 1, coins: 50, xp: 50, hearts: 25 },
    buildingImpact: 'Mở khóa chiếc sofa phòng khách'
  },
  {
    levelNumber: 2,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Ý Tưởng Của Usagi (Usagi Big Idea)',
    subtitle: 'Học cách tạo Tên Lửa Thần Tốc khi ghép 4 bé Usagi!',
    storyBeat: 'Bé Usagi tràn đầy năng lượng nhảy nhót quanh bếp nhỏ.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 22,
    starThresholds: [800, 1600, 2400],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 18, currentCount: 0 },
      { type: 'activate_specials', targetCount: 1, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'YA-HAAA! Ghép 4 bé Usagi tạo Tên Lửa phóng vun vút nào! 🚀⚡' },
    rewards: { stars: 1, coins: 60, xp: 60, hearts: 30 },
    buildingImpact: 'Nấu ấm nước trà thơm đầu tiên'
  },
  {
    levelNumber: 3,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Mèo Tai Xanh Lạc Quan (Hachiware Cheer)',
    subtitle: 'Học cách tạo Cầu Vồng Toàn Năng khi ghép 5 ô thẳng hàng!',
    storyBeat: 'Bé Hachiware mang đàn guitar tới hát tặng bài ca tình bạn.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 22,
    starThresholds: [900, 1800, 2700],
    objectives: [
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 20, currentCount: 0 },
      { type: 'activate_specials', targetCount: 1, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Nanto kanaare! Ghép 5 ô tạo Cầu Vồng quét sạch cùng màu nha! 🌈✨' },
    rewards: { stars: 1, coins: 70, xp: 70, hearts: 35 },
    buildingImpact: 'Treo bức tranh phong cảnh đầu tiên lên tường'
  },
  {
    levelNumber: 4,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Dọn Dẹp Nhà Kho (Crate Cleanup)',
    subtitle: 'Phá vỡ các hộp gỗ chướng ngại vật mềm',
    storyBeat: 'Dọn dẹp các thùng gỗ cũ để kê thêm kệ sách kỷ niệm.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 24,
    starThresholds: [1000, 2000, 3000],
    objectives: [
      { type: 'collect_tiles', tileType: 'momonga', targetCount: 16, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 4, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'Uraaa! Ghép ô bên cạnh để đập tan các hộp gỗ bám bụi nào! 📦💥' },
    rewards: { stars: 1, coins: 80, xp: 80, hearts: 40 },
    buildingImpact: 'Hoàn thiện kệ sách kỷ niệm'
  },
  {
    levelNumber: 5,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Tách Trà Ấm Của Kurimanju (Tea Time)',
    subtitle: 'Thu thập hạt dẻ và tạo chuỗi Combo liên hoàn',
    storyBeat: 'Bé Kurimanju hướng dẫn cách thưởng trà chiều tĩnh lặng.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'kurimanju'],
    maxMoves: 22,
    starThresholds: [1100, 2200, 3300],
    objectives: [{ type: 'collect_tiles', tileType: 'kurimanju', targetCount: 22, currentCount: 0 }],
    companionIntro: { character: 'chiikawa', dialogue: 'Ha-aa! Uống một ngụm trà ấm cho tâm hồn thư thái nào~ 🍵' },
    rewards: { stars: 1, coins: 90, xp: 90, hearts: 45 },
    buildingImpact: 'Đặt bộ bàn trà ngoài ban công'
  },
  {
    levelNumber: 6,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Bí Kíp Của Rái Cá Rakko (Master Rakko)',
    subtitle: 'Luyện tập thao tác phản xạ nhanh cùng sư phụ Rakko',
    storyBeat: 'Rakko vung kiếm gỗ chỉ dẫn cách tạo các nước đi chiến thuật.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'kurimanju', 'rakko'],
    maxMoves: 20,
    starThresholds: [1200, 2400, 3600],
    objectives: [
      { type: 'collect_tiles', tileType: 'rakko', targetCount: 18, currentCount: 0 },
      { type: 'activate_specials', targetCount: 2, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'Sư phụ Rakko tới rồi! Cùng nhau tập trung bứt phá nhé! 🗡️✨' },
    rewards: { stars: 1, coins: 100, xp: 100, hearts: 50 },
    buildingImpact: 'Treo thanh kiếm gỗ phong thủy ở cửa ra vào'
  },
  {
    levelNumber: 7,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Thử Thách Tia Sáng Kỷ Niệm (Memory Spark Trial)',
    subtitle: 'Sử dụng kỹ năng đặc biệt của bé Chiikawa để chuyển đổi ô',
    storyBeat: 'Chiikawa tập trung dũng khí dùng phép màu gợi nhớ kỷ niệm.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 22,
    starThresholds: [1300, 2600, 3900],
    objectives: [{ type: 'collect_tiles', tileType: 'chiikawa', targetCount: 24, currentCount: 0 }],
    companionIntro: { character: 'chiikawa', dialogue: 'Bấm nút "Tia Sáng Kỷ Niệm" bên dưới để Chiikawa giúp bạn nha! ✨💖' },
    rewards: { stars: 1, coins: 110, xp: 110, hearts: 55 },
    buildingImpact: 'Thắp sáng chiếc đèn ngủ hình mầm cây'
  },
  {
    levelNumber: 8,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Thử Thách Tên Lửa Cà Rốt (Carrot Rocket Trial)',
    subtitle: 'Dùng kỹ năng Tên Lửa của Usagi quét sạch hàng rào',
    storyBeat: 'Usagi nạp đầy cà rốt sẵn sàng thổi bay mọi chướng ngại vật.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 20,
    starThresholds: [1400, 2800, 4200],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 22, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 6, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'YA-HAAA! Bấm "Tên Lửa Cà Rốt" để phóng tia năng lượng siêu cấp! 🥕🚀' },
    rewards: { stars: 1, coins: 120, xp: 120, hearts: 60 },
    buildingImpact: 'Lắp đặt đồng hồ quả lắc hình củ cà rốt'
  },
  {
    levelNumber: 9,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Hòm Thư Tình Ngọt Ngào (Love Letter Box)',
    subtitle: 'Thu thập đủ các bạn nhỏ để hoàn tất bức thư tình',
    storyBeat: 'Cùng nhau viết lá thư tình đầu tiên gửi cho đối phương.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju'],
    maxMoves: 25,
    starThresholds: [1500, 3000, 4500],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 20, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 20, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Hai đứa mình cùng gom những điều ngọt ngào nhất cất vào hòm thư nha! 💌🌸' },
    rewards: { stars: 1, coins: 130, xp: 130, hearts: 65 },
    buildingImpact: 'Khánh thành Hòm Thư Tình trước cổng nhà'
  },
  {
    levelNumber: 10,
    chapter: 1,
    chapterTitle: 'Chương 1: Ngôi Nhà Nhỏ (Our Little Home)',
    title: 'Đại Tiệc Khởi Đầu Ấm Áp (Home Finale Miracle)',
    subtitle: 'Chung kết Chương 1: Kích hoạt Phép Màu Tình Yêu hoàn thiện Ngôi Nhà!',
    storyBeat: 'Ngôi nhà nhỏ đã hoàn toàn ấm cúng, lò sưởi bập bùng thắp sáng.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 26,
    starThresholds: [1800, 3600, 5400],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 25, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 25, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 6, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Hoan hô! Chiikawa & Usagi cùng thắp sáng lò sưởi ngôi nhà hạnh phúc! 🔥🏡✨' },
    rewards: { stars: 2, coins: 200, xp: 200, hearts: 100, materials: [{ itemId: 'item_home_blueprint', quantity: 1 }] },
    buildingImpact: 'Nâng cấp Ngôi Nhà Nhỏ lên Cấp 2 (Ấm Cúng Hoàn Hảo)'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🏘️ CHAPTER 2: BUILD OUR TOWN (Levels 11–20)
  // ═══════════════════════════════════════════════════════════════════════
  {
    levelNumber: 11,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Suối Nước Phục Hồi (Water Fountain Awakening)',
    subtitle: 'Thu thập nước trong lành khôi phục Đài Phun Nước',
    storyBeat: 'Bước ra quảng trường thị trấn và làm sạch dòng suối nước ngọt.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'hachiware', 'momonga', 'rakko'],
    maxMoves: 22,
    starThresholds: [1200, 2400, 3600],
    objectives: [{ type: 'collect_tiles', tileType: 'hachiware', targetCount: 22, currentCount: 0 }],
    companionIntro: { character: 'chiikawa', dialogue: 'Dòng nước suối mát lành sẽ giúp chúng mình luôn tràn trề sức sống! ⛲💧' },
    rewards: { stars: 1, coins: 100, xp: 100, hearts: 50 },
    buildingImpact: 'Mở khóa Đài Phun Nước Cấp 1'
  },
  {
    levelNumber: 12,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Võ Đường Năng Lượng (Dojo Power Sprints)',
    subtitle: 'Đẩy lùi mệt mỏi cùng thỏ vàng Usagi tại võ đường thể lực',
    storyBeat: 'Rèn luyện cơ bắp và độ dẻo dai chuẩn bị cho chuyến đi biển.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['usagi', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 20,
    starThresholds: [1300, 2600, 3900],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 24, currentCount: 0 },
      { type: 'activate_specials', targetCount: 2, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'YAAA-HAAA! Nâng tạ và tập squat hết mình nào! Không lười biếng đâu nha! 🥋💪' },
    rewards: { stars: 1, coins: 110, xp: 110, hearts: 55 },
    buildingImpact: 'Mở khóa Võ Đường Cấp 1'
  },
  {
    levelNumber: 13,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Tiệm Bánh Ngọt Ngào (Bakery Delights)',
    subtitle: 'Thu thập nguyên liệu bột mì và đường phèn cho tiệm bánh',
    storyBeat: 'Bé Momonga chọn những chiếc bánh dâu tây bông xù ngon nhất.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'momonga', 'kurimanju'],
    maxMoves: 22,
    starThresholds: [1400, 2800, 4200],
    objectives: [
      { type: 'collect_tiles', tileType: 'momonga', targetCount: 20, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 6, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Homero! Mùi bánh nướng thơm lừng cả khu phố rồi nè! 🧁🍓' },
    rewards: { stars: 1, coins: 120, xp: 120, hearts: 60 },
    buildingImpact: 'Mở khóa Tiệm Bánh tại Khu Chợ Nhỏ'
  },
  {
    levelNumber: 14,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Thư Viện Trí Tuệ (Library Whispers)',
    subtitle: 'Sắp xếp lại các cuốn sách kiến thức dinh dưỡng và sức khỏe',
    storyBeat: 'Tìm kiếm những cuốn sách hướng dẫn nấu ăn lành mạnh.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'hachiware', 'kurimanju', 'rakko'],
    maxMoves: 22,
    starThresholds: [1500, 3000, 4500],
    objectives: [
      { type: 'collect_tiles', tileType: 'kurimanju', targetCount: 22, currentCount: 0 },
      { type: 'activate_specials', targetCount: 2, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Sách hay như người bạn quý, cùng nhau đọc và học hỏi nhé! 📖✨' },
    rewards: { stars: 1, coins: 130, xp: 130, hearts: 65 },
    buildingImpact: 'Mở khóa Thư Viện Cấp 1'
  },
  {
    levelNumber: 15,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Khu Chợ Nông Sản (Farmers Market Bounty)',
    subtitle: 'Thu hoạch rau củ quả tươi sạch cho bữa ăn gia đình',
    storyBeat: 'Lựa chọn rau củ tươi ngon tại chợ để chuẩn bị bữa trưa giàu protein.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju'],
    maxMoves: 25,
    starThresholds: [1600, 3200, 4800],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 22, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 22, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'Ura-ura! Đầy ắp một giỏ cà rốt và rau bina tươi rói! 🥕🥦' },
    rewards: { stars: 1, coins: 140, xp: 140, hearts: 70 },
    buildingImpact: 'Nâng cấp Khu Chợ Nhỏ lên Cấp 2'
  },
  {
    levelNumber: 16,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Tháp Chuông Ngủ Say (Sleep Sanctuary Bells)',
    subtitle: 'Lắng nghe giai điệu chuông gió ru giấc ngủ êm đềm',
    storyBeat: 'Xây dựng tháp chuông ru ngủ để nhắc nhở giờ đi ngủ khoa học.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'hachiware', 'momonga', 'rakko'],
    maxMoves: 24,
    starThresholds: [1700, 3400, 5100],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 25, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 8, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Chuông gió ngân vang... Giấc ngủ sâu sẽ mang lại bình yên cho chúng mình~ 🌙💤' },
    rewards: { stars: 1, coins: 150, xp: 150, hearts: 75 },
    buildingImpact: 'Khánh thành Tháp Trăng Ngủ Say'
  },
  {
    levelNumber: 17,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Bàn Tiệc Ánh Nến (Candlelight Diner Setup)',
    subtitle: 'Chuẩn bị bàn ăn lãng mạn trên tầng thượng nhà hàng',
    storyBeat: 'Trang trí ánh nến và hoa hồng cho buổi tối hẹn hò.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'kurimanju', 'rakko'],
    maxMoves: 24,
    starThresholds: [1800, 3600, 5400],
    objectives: [
      { type: 'collect_tiles', tileType: 'rakko', targetCount: 22, currentCount: 0 },
      { type: 'activate_specials', targetCount: 3, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Bữa tối hẹn hò dưới bầu trời sao lấp lánh sắp bắt đầu rồi! 🍷🕯️' },
    rewards: { stars: 1, coins: 160, xp: 160, hearts: 80 },
    buildingImpact: 'Mở khóa Nhà Hàng Ánh Nến Cấp 2'
  },
  {
    levelNumber: 18,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Xưởng Ảnh Kỷ Niệm (Polaroid Studio Flash)',
    subtitle: 'Rửa những tấm ảnh polaroid sắc nét đầu tiên',
    storyBeat: 'Lồng những tấm ảnh chuyến đi chơi vào khung gỗ.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'rakko'],
    maxMoves: 25,
    starThresholds: [1900, 3800, 5700],
    objectives: [
      { type: 'collect_tiles', tileType: 'momonga', targetCount: 24, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 8, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Tách! Một nụ cười rạng rỡ đã được lưu giữ mãi mãi trong khung hình! 📸✨' },
    rewards: { stars: 1, coins: 170, xp: 170, hearts: 85 },
    buildingImpact: 'Mở rộng Tiệm Ảnh Studio'
  },
  {
    levelNumber: 19,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Quảng Trường Lễ Hội (Grand Festival Prep)',
    subtitle: 'Tập hợp toàn bộ cư dân thị trấn chuẩn bị khánh thành',
    storyBeat: 'Tất cả 6 người bạn cùng tập trung trang hoàng quảng trường.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 26,
    starThresholds: [2000, 4000, 6000],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 22, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 22, currentCount: 0 },
      { type: 'activate_specials', targetCount: 3, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Thị trấn Little Days đã rực rỡ sắc màu cờ hoa! Cố lên màn cuối chương nào! 🎪🌟' },
    rewards: { stars: 1, coins: 180, xp: 180, hearts: 90 },
    buildingImpact: 'Trang hoàng Quảng Trường Nhiệm Vụ'
  },
  {
    levelNumber: 20,
    chapter: 2,
    chapterTitle: 'Chương 2: Xây Dựng Thị Trấn (Build Our Town)',
    title: 'Đại Khánh Thành Thị Trấn (Town Bloom Spectacle)',
    subtitle: 'Chung kết Chương 2: Toàn bộ thị trấn Little Days bừng sáng!',
    storyBeat: 'Khánh thành hoàn tất thị trấn, sẵn sàng cho chuyến bay tới Nha Trang.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 28,
    starThresholds: [2400, 4800, 7200],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 30, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 30, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 10, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'CHÚC MỪNG THỊ TRẤN HOÀN TẤT! Sẵn sàng đóng gói hành lý đi Nha Trang thôi! ✈️🏖️🎉' },
    rewards: { stars: 2, coins: 300, xp: 300, hearts: 150, materials: [{ itemId: 'item_town_crest', quantity: 1 }] },
    buildingImpact: 'Mở khóa Sân Bay Little Sky chuẩn bị cất cánh'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🏖️ CHAPTER 3: NHA TRANG ADVENTURE (Levels 21–30)
  // ═══════════════════════════════════════════════════════════════════════
  {
    levelNumber: 21,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Soạn Vali Siêu Tốc (Luggage Packing Sprint)',
    subtitle: 'Gấp quần áo đi biển, kem chống nắng và kính mát',
    storyBeat: 'Cùng nhau gạch hết danh sách hành lý trước ngày bay.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'usagi', 'momonga', 'rakko'],
    maxMoves: 22,
    starThresholds: [1500, 3000, 4500],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 24, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 6, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'YAAA-HAAA! Vali kéo đã xếp gọn gàng, kiểm tra hộ chiếu và vé bay nào! 🧳✈️' },
    rewards: { stars: 1, coins: 150, xp: 150, hearts: 75 },
    buildingImpact: 'Hoàn tất Checklist Hành Lý Sân Bay'
  },
  {
    levelNumber: 22,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Sảnh Chờ Sân Bay (Terminal Gate Departure)',
    subtitle: 'Bảng điện tử khởi hành báo giờ bay Nội Bài ➔ Cam Ranh',
    storyBeat: 'Ngồi cạnh nhau tại sảnh chờ sân bay với cốc cà phê thơm.',
    gridRows: 7,
    gridCols: 7,
    allowedTileTypes: ['chiikawa', 'hachiware', 'kurimanju', 'rakko'],
    maxMoves: 22,
    starThresholds: [1600, 3200, 4800],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 24, currentCount: 0 },
      { type: 'activate_specials', targetCount: 2, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Máy bay sắp cất cánh rồi! Em nắm chặt tay anh nhé~ ✈️💖' },
    rewards: { stars: 1, coins: 160, xp: 160, hearts: 80 },
    buildingImpact: 'Cất cánh thành công trên Bảng Điện Tử'
  },
  {
    levelNumber: 23,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Bay Trên Mây Hồng (Flight Above the Clouds)',
    subtitle: 'Ngắm nhìn biển mây bồng bềnh qua khung cửa sổ máy bay',
    storyBeat: 'Hai bàn tay đan vào nhau trên độ cao 10.000 mét.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga'],
    maxMoves: 24,
    starThresholds: [1800, 3600, 5400],
    objectives: [
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 26, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 8, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Nhìn kìa, biển mây ngoài cửa sổ đẹp như trong truyện cổ tích! ☁️✨' },
    rewards: { stars: 1, coins: 170, xp: 170, hearts: 85 },
    buildingImpact: 'Lưu tấm ảnh chụp qua cửa sổ máy bay'
  },
  {
    levelNumber: 24,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Hạ Cánh Cam Ranh (Touchdown Coastal Breeze)',
    subtitle: 'Đón làn gió biển mặn mà ấm áp đầu tiên của miền nhiệt đới',
    storyBeat: 'Bước chân ra khỏi sân bay Cam Ranh và ngắm hàng dừa xanh.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'momonga', 'kurimanju'],
    maxMoves: 24,
    starThresholds: [1900, 3800, 5700],
    objectives: [
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 26, currentCount: 0 },
      { type: 'activate_specials', targetCount: 3, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'URAAAA! Tới Nha Trang rồi! Biển xanh cát trắng vẫy gọi chúng mình kìa! 🌴🌊' },
    rewards: { stars: 1, coins: 180, xp: 180, hearts: 90 },
    buildingImpact: 'Mở khóa Bãi Biển Nhiệt Đới Nha Trang'
  },
  {
    levelNumber: 25,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Cung Đường Ven Biển Trần Phú (Tran Phu Promenade)',
    subtitle: 'Dạo xe máy dọc theo con đường ven biển đẹp nhất Việt Nam',
    storyBeat: 'Gió biển thổi tung mái tóc, hai người cùng ngân nga bài hát quen thuộc.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'hachiware', 'kurimanju', 'rakko'],
    maxMoves: 24,
    starThresholds: [2000, 4000, 6000],
    objectives: [
      { type: 'collect_tiles', tileType: 'rakko', targetCount: 25, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 8, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Bờ biển dài tít tắp, nước trong vắt nhìn thấy cả đáy cát! 🛵🌊' },
    rewards: { stars: 1, coins: 190, xp: 190, hearts: 95 },
    buildingImpact: 'Mở khóa Tour Xe Máy Ven Biển'
  },
  {
    levelNumber: 26,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Lặn Ngắm San Hô Hòn Mun (Hon Mun Coral Reef Diving)',
    subtitle: 'Đắm mình vào làn nước xanh biếc ngắm rạn san hô rực rỡ',
    storyBeat: 'Chiêm ngưỡng thế giới thủy cung kỳ thú dưới lòng đại dương.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'rakko'],
    maxMoves: 25,
    starThresholds: [2100, 4200, 6300],
    objectives: [
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 28, currentCount: 0 },
      { type: 'activate_specials', targetCount: 3, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Những chú cá hề bơi quanh rạn san hô lấp lánh như ngọc vậy! 🐠🤿✨' },
    rewards: { stars: 1, coins: 200, xp: 200, hearts: 100 },
    buildingImpact: 'Đạt Huy Hiệu Lặn Biển Hòn Mun'
  },
  {
    levelNumber: 27,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Tắm Bùn Khoáng Nóng I-Resort (Hot Mineral Mud Bath)',
    subtitle: 'Ngâm mình trong bùn khoáng thiên nhiên xua tan mọi mệt mỏi',
    storyBeat: 'Cùng thư giãn phục hồi năng lượng và dưỡng da mịn màng.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'momonga', 'kurimanju'],
    maxMoves: 24,
    starThresholds: [2200, 4400, 6600],
    objectives: [
      { type: 'collect_tiles', tileType: 'momonga', targetCount: 26, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 8, currentCount: 0 }
    ],
    companionIntro: { character: 'chiikawa', dialogue: 'Bùn khoáng ấm áp dễ chịu quá đi... Cả người nhẹ bẫng luôn! 🌿♨️' },
    rewards: { stars: 1, coins: 210, xp: 210, hearts: 105 },
    buildingImpact: 'Đạt Huy Hiệu Tắm Bùn Phục Hồi'
  },
  {
    levelNumber: 28,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Tiệc Hải Sản Tươi Ngon (Seafood Feast Night)',
    subtitle: 'Thưởng thức tôm hùm, sò điệp nướng mỡ hành bên bờ biển',
    storyBeat: 'Bữa tiệc hải sản thịnh soạn dưới ánh đèn vàng ấm áp.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'kurimanju', 'rakko'],
    maxMoves: 25,
    starThresholds: [2300, 4600, 6900],
    objectives: [
      { type: 'collect_tiles', tileType: 'kurimanju', targetCount: 28, currentCount: 0 },
      { type: 'activate_specials', targetCount: 4, currentCount: 0 }
    ],
    companionIntro: { character: 'usagi', dialogue: 'Mogu-mogu! Tôm nướng thơm nức mũi! Ăn thật no để mai ngắm bình minh nha! 🦞🦐🔥' },
    rewards: { stars: 1, coins: 220, xp: 220, hearts: 110 },
    buildingImpact: 'Đạt Huy Hiệu Ẩm Thực Biển Nha Trang'
  },
  {
    levelNumber: 29,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Du Thuyền Hoàng Hôn Vịnh Nha Trang (Sunset Catamaran Cruise)',
    subtitle: 'Ngắm hoàng hôn nhuộm tím mặt biển cùng tiếng sóng rì rào',
    storyBeat: 'Tựa đầu vào vai nhau trên boong du thuyền khi mặt trời lặn dần.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'rakko'],
    maxMoves: 26,
    starThresholds: [2500, 5000, 7500],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 30, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 30, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 10, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: 'Khoảnh khắc hoàng hôn đẹp nhất cuộc đời... Khi có em bên cạnh anh! 🌅⛵💖' },
    rewards: { stars: 2, coins: 300, xp: 300, hearts: 150 },
    buildingImpact: 'Mở khóa Khung Cảnh Du Thuyền Hoàng Hôn'
  },
  {
    levelNumber: 30,
    chapter: 3,
    chapterTitle: 'Chương 3: Chuyến Đi Nha Trang (Nha Trang Adventure)',
    title: 'Đại Tiệc Pháo Hoa Nha Trang (Grand Sunset Finale & Endless Life)',
    subtitle: 'Đại chung kết 30 Màn Chơi: Pháo hoa rực sáng trên biển Nha Trang!',
    storyBeat: 'Pháo hoa bừng sáng bầu trời đêm Nha Trang, mở ra trang tình yêu vĩnh cửu.',
    gridRows: 8,
    gridCols: 8,
    allowedTileTypes: ['chiikawa', 'usagi', 'hachiware', 'momonga', 'kurimanju', 'rakko'],
    maxMoves: 30,
    starThresholds: [3000, 6000, 9000],
    objectives: [
      { type: 'collect_tiles', tileType: 'chiikawa', targetCount: 35, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'usagi', targetCount: 35, currentCount: 0 },
      { type: 'collect_tiles', tileType: 'hachiware', targetCount: 35, currentCount: 0 },
      { type: 'clear_blockers', blockerType: 'crate', targetCount: 12, currentCount: 0 }
    ],
    companionIntro: { character: 'both', dialogue: '🎆 PHÁO HOA RỰC SÁNG! Chúc mừng tình yêu ngọt ngào của hai bạn mãi mãi bền lâu! 💖✨🎉' },
    rewards: { stars: 3, coins: 500, xp: 500, hearts: 300, materials: [{ itemId: 'item_sunset_trophy', quantity: 1 }] },
    buildingImpact: 'Mở khóa Chế Độ Cuộc Sống Đôi Vô Tận (Endless Couple Life) & Hào Quang Hoàng Kim'
  }
]

export function getLevelDefinition(levelNumber: number): LevelDefinition | undefined {
  return CANONICAL_PUZZLE_LEVELS.find(l => l.levelNumber === levelNumber)
}

export function getLevelsByChapter(chapter: 1 | 2 | 3): LevelDefinition[] {
  return CANONICAL_PUZZLE_LEVELS.filter(l => l.chapter === chapter)
}
