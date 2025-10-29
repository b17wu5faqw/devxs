// Parts để tạo tên động
const nameParts = {
  // Tên cơ bản
  basicNames: [
    'Tuấn', 'Hùng', 'Dũng', 'Thắng', 'Minh', 'Hoàng', 'Nam', 'Long', 'Phong', 'Đạt',
    'Hương', 'Lan', 'Mai', 'Hoa', 'Trang', 'Thảo', 'Linh', 'Hà', 'Thu', 'Ngọc',
    'Bình', 'Phúc', 'An', 'Khang', 'Thịnh', 'Vượng', 'Tài', 'Lộc', 'Đức', 'Nhân',
    'Tú', 'Quyên', 'Nhi', 'Yến', 'Oanh', 'Vy', 'Châu', 'Giang', 'Huyền', 'Phương',
    'John', 'Mike', 'Alex', 'Tom', 'David', 'Sarah', 'Emma', 'Lisa', 'Kate', 'Anna',
    'Peter', 'Mary', 'Chris', 'Steve', 'Paul', 'Jessica', 'Emily', 'Olivia', 'Sophia', 'James'
  ],

  // Số năm sinh
  years: ['95', '96', '97', '98', '99', '2k', '2k1', '2k2', '2k3', '2k4', '2k5', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003'],

  // Tính từ tích cực
  positiveAdjectives: ['pro', 'vip', 'cute', 'xinh', 'dep', 'handsome', 'cool', 'smart', 'lucky', 'rich', 'boss', 'king', 'queen', 'princess', 'angel', 'lovely', 'sweet', 'hot', 'sexy', 'fresh', 'magic', 'beauty'],

  // Tính từ tiêu cực/troll
  negativeAdjectives: ['ngu', 'cut', 'lon', 'cho', 'sua', 'buoi', 'ngheo', 'doi', 'gia', 'chet', 'den', 'xui', 'lag', 'cham', 'noob'],

  // Từ bậy bạ
  badWords: ['cuc', 'dit', 'me', 'vcl', 'dm', 'vkl', 'cmnr', 'wtf', 'shit', 'fuck'],

  // Động vật
  animals: ['chim', 'cho', 'meo', 'ga', 'vit', 'lon', 'bo', 'trau', 'tiger', 'dragon', 'cat', 'dog'],

  // Nghề nghiệp/vai trò
  roles: ['gamer', 'player', 'hacker', 'admin', 'mod', 'streamer', 'youtuber', 'tiktoker'],

  // Số random
  numbers: ['123', '456', '789', '69', '88', '99', '666', '888', '999'],

  // Ký tự đặc biệt
  separators: ['_', '.', '-', ''],

  // Từ ghép thêm
  suffixes: ['bip', 'tip', 'xip', 'zin', 'pro', 'max', 'ultra', 'super', 'mega', 'god', 'lord', 'master']
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Hàm tạo tên bằng cách mix các parts
const generateMixedName = (): string => {
  const random = Math.random();

  if (random < 0.3) {
    // 30% tên thật đơn giản
    return getRandomElement(nameParts.basicNames);
  } else if (random < 0.6) {
    // 30% tên + số năm
    const name = getRandomElement(nameParts.basicNames).toLowerCase();
    const year = getRandomElement(nameParts.years);
    const separator = getRandomElement(nameParts.separators);
    return `${name}${separator}${year}`;
  } else if (random < 0.8) {
    // 20% tên + tính từ tích cực
    const name = getRandomElement(nameParts.basicNames).toLowerCase();
    const adj = getRandomElement(nameParts.positiveAdjectives);
    const separator = getRandomElement(nameParts.separators);
    return `${name}${separator}${adj}`;
  } else if (random < 0.9) {
    // 10% tên troll/bậy bạ
    const part1 = getRandomElement([...nameParts.badWords, ...nameParts.negativeAdjectives, ...nameParts.animals]);
    const part2 = getRandomElement([...nameParts.negativeAdjectives, ...nameParts.animals, ...nameParts.suffixes]);
    const separator = getRandomElement(nameParts.separators);
    return `${part1}${separator}${part2}`;
  } else {
    // 10% tên phức tạp (3 parts)
    const name = getRandomElement(nameParts.basicNames).toLowerCase();
    const middle = getRandomElement([...nameParts.positiveAdjectives, ...nameParts.roles, ...nameParts.suffixes]);
    const end = getRandomElement([...nameParts.years, ...nameParts.numbers]);
    const sep1 = getRandomElement(nameParts.separators);
    const sep2 = getRandomElement(nameParts.separators);
    return `${name}${sep1}${middle}${sep2}${end}`;
  }
};

const getRandomName = (): string => {
  return generateMixedName();
};

const vnLottoMessages = [
  'Đề hôm nay về con gì nhỉ?',
  'Chốt con 68 đi anh em',
  'Hôm nay đánh đầu 8 đuôi 5',
  'Dàn 23 67 89 theo không ae',
  'Đề hôm qua về số mấy vậy?',
  'Chốt lô 23 88 nha mọi người',
  'Hôm nay con 79 về chắc',
  'Đánh xiên 45 67 được không?',
  'Thấy số đẹp quá, theo thôi',
  'Chốt nhanh còn kịp giờ',
  'Bạch thủ con 01, lót 10, chắc ăn',
  'Cầu này đẹp, theo đi',
  'Ai có số ngon không, cho tôi theo với',
  'Lại gãy cầu rồi, đm',
  'Toang, xa bờ quá',
  'Hôm nay quyết khô máu',
  'Nuôi con 68 khung 3 ngày xem sao',
  'Vl, về ngay con bên cạnh',
  'Soi cầu kiểu gì thế?',
  'Bảng kết quả đâu ae?',
  'Ăn được con lô xiên, thơm vãi',
  'Đánh bak cang 3 càng ko ae?',
  'Cầu này khó vãi đái',
  'về bờ thôi ae',
  'đm nhà cái',
  'wtf xổ láo vc',
  'huhu thua sạch r',
  'còn thở là còn gỡ',
  // Thêm tin nhắn đa dạng hơn
  'Soi cầu miền Bắc hôm nay',
  'Đề về 45 rồi ae ơi',
  'Lô tô miền Nam có gì hot không?',
  'Bạch thủ lô 2 số hôm nay',
  'Đánh đề 3 càng được không?',
  'Cầu lô kép đẹp quá',
  'Xiên 2 con 34-56 theo không?',
  'Đầu đuôi giống nhau về nhiều',
  'Lô gan về rồi ae',
  'Cầu lô tô miền Trung sao?',
  'Đánh theo thống kê được không?',
  'Số đẹp hôm nay là gì?',
  'Lô về muộn quá',
  'Cầu bạch thủ lô hôm nay',
  'Đề đầu 5 về nhiều không?',
  'Xiên 3 con theo được không?',
  'Lô kép 11 22 33 sao?',
  'Cầu lô tô hôm nay đẹp',
  'Đánh theo giấc mơ được không?',
  'Số may mắn hôm nay',
  'Lô gan lâu chưa về',
  'Cầu đề miền Bắc chuẩn',
  'Xiên quay về nhiều không?',
  'Đầu 0 đuôi 5 theo không?',
  'Lô tô 3 miền hôm nay',
  'Cầu bạch thủ đề chuẩn',
  'Số đẹp theo phong thủy',
  'Lô về sớm hôm nay',
  'Đánh lô theo tuổi được không?',
  'Cầu lô đẹp nhất hôm nay',
];

const xocDiaMessages = [
  'Chẵn chẵn chẵn!!!',
  'Lẻ này anh em ơi',
  'Theo chẵn 3 ván nữa',
  'Hôm nay lẻ về nhiều',
  'Chẵn về rồi, theo không ae?',
  'Đặt 4 trắng này',
  'Lẻ 4 đỏ có ai theo không',
  'Chẵn trắng chắc ăn',
  'Hôm nay đỏ về nhiều',
  'Chốt nhanh còn kịp',
  'Cầu 1-1 đẹp thế',
  'Bẻ cầu không anh em?',
  'Đm, nhà cái húp hết rồi',
  'Lại chẵn à, vl',
  'Cay thế, sắp về bờ lại gãy',
  'Tất tay lẻ đi',
  'Ai theo chẵn không?',
  'Bán nhà mà theo thôi',
  'Ván này chắc chắn lẻ',
  'Lẻ 3 trắng hay 3 đỏ?',
  'Cầu bệt chẵn kìa',
  'Đánh gấp thếp có ổn không?',
  'Vl gãy đúng tay cuối',
  'má nó cayyyy',
  'đm chơi ngu vãi',
  'cầu này khó thật sự',
  'omg húp r',
  'gg',
  // Thêm tin nhắn xóc đĩa đa dạng
  'Tài xỉu ván này sao ae?',
  'Chẵn lẻ dễ ăn hơn',
  'Đỏ đen theo cảm giác thôi',
  'Ván này chắc tài',
  'Xỉu về liên tục rồi',
  'Cầu tài xỉu đẹp quá',
  'Chẵn về 5 ván liên tiếp',
  'Lẻ gãy cầu rồi ae',
  'Đỏ đen 50-50 thôi',
  'Tài về nhiều hôm nay',
  'Xỉu lâu rồi chưa về',
  'Cầu chẵn lẻ chuẩn',
  'Đặt tài hay xỉu đây?',
  'Theo cảm giác thôi',
  'Chẵn lẻ dễ đoán hơn',
  'Tài xỉu khó quá',
  'Đỏ đen may rủi',
  'Ván này all in tài',
  'Xỉu chắc ăn rồi',
  'Cầu này đẹp lắm',
  'Theo đám đông thôi',
  'Chẵn về chắc luôn',
  'Lẻ gãy mấy ván rồi',
  'Tài xỉu theo thống kê',
  'Đỏ đen bằng nhau',
  'Cầu tài dài quá',
  'Xỉu về liền 3 ván',
  'Chẵn lẻ dễ chơi nhất',
  'Theo trực giác thôi',
  'Tài về chắc luôn',
];

const pk10Messages = [
  'Top 3 về rồi ae',
  'Chốt con số 1 này',
  'Hôm nay đỏ quá',
  'Theo số 7 không ae',
  'Đặt top 5 thôi',
  'Số 3 về chắc luôn',
  'Hôm nay số 8 đẹp',
  'Chốt nhanh còn kịp giờ',
  'Đánh đầu được không?',
  'Theo không anh em?',
  'Con 9 lâu rồi chưa về nhỉ',
  'Đua xe kiểu gì lag thế',
  'wtf, con 1 lại về à?',
  'Xe nào hay về nhất vậy?',
  'Cược Tài/Xỉu cho dễ',
  'Long/Hổ ván này sao?',
  'Đm, về ngay con mình không đánh',
  'Vãi cức, thua thông mấy ván rồi',
  'Ăn được quả top 1, ngon',
  'Let\'s gooo, húp',
  'cầu gì đây ae',
  'đánh bừa thôi',
  'đm toàn về số gì vậy',
  'khó chơi vkl',
  // Thêm tin nhắn PK10 đa dạng
  'Xe số 5 chạy nhanh quá',
  'Top 1 về liên tục',
  'Đua xe hôm nay sao?',
  'Số 2 lâu chưa về',
  'Cược long hổ dễ hơn',
  'Xe nào chạy đầu?',
  'Top 3 chắc ăn',
  'Số 6 về nhiều hôm nay',
  'Đánh tài xỉu PK10',
  'Xe số 4 hay về',
  'Long hổ 50-50',
  'Top 5 an toàn hơn',
  'Số 10 lâu rồi',
  'Cược đầu đuôi sao?',
  'Xe chạy nhanh vãi',
  'Số 8 may mắn',
  'Top 2 về chắc',
  'Đua xe lag quá',
  'Số 7 đẹp nhất',
  'Cược long được không?',
  'Hổ về nhiều hôm nay',
  'Top 4 theo không?',
  'Xe số 3 ổn định',
  'Tài xỉu dễ đoán',
  'Số 1 về đầu',
  'Long hổ theo cảm giác',
  'Top 6 có ăn không?',
  'Xe chạy chậm quá',
  'Số 9 lâu chưa về',
  'Cược hổ chắc ăn',
];

const kenoMessages = [
  'Chẵn lẻ sao ae',
  'Lớn nhỏ thế nào',
  'Hòa về nhiều đấy',
  'Theo chẵn không ae',
  'Lẻ này chắc ăn',
  'Đánh hòa được không',
  'Chốt lớn nhanh',
  'Nhỏ về rồi ae',
  'Hôm nay đánh gì',
  'Chẵn về nhiều quá',
  'Cầu tài xỉu hay chẵn lẻ?',
  'Keno này xổ nhanh vãi',
  'Đánh Ngũ hành đi ae',
  'Kim Mộc Thủy Hỏa Thổ, chọn gì?',
  'Hòa khó về lắm',
  'Toang, lại hòa',
  'Vl, theo chẵn nó về lẻ',
  'Đỏ thôi, đen quên đi',
  'Game này có bịp không?',
  'Làm ván cuối nghỉ',
  'holy shit, ăn thông 5 ván',
  'nice one!',
  'về cái gì thế này',
  'đm cay thế',
];

const defaultMessages = [
  'Hôm nay chơi gì ae?', 'Vào game mới không?', 'Cao thủ vào phòng kìa',
  'Chơi ván nữa không?', 'Hôm nay vận đỏ quá', 'Ai thắng lớn không?',
  'Game này hay nè', 'Vào chơi cùng không?', 'Thắng rồi ae ơi', 'Hên quá hôm nay',
  'Có ai kéo tôi về bờ với', 'Đang đỏ, theo không?', 'Sắp hết tiền rồi', 'Nạp thêm đi anh em',
  'Admin uy tín không?', 'Game này rút tiền nhanh không?', 'Chán quá, thua suốt',
  'Đổi game đi ae', 'Game nào dễ ăn nhất nhỉ?', 'Ai chỉ tôi cách chơi với', 'Người mới xin chỉ giáo',
  'Lâu thế, bắt đầu đi', 'Mạng lag quá', 'Lag à ae?', 'Disconnect rồi', 'Gà',
  'Chơi ngu thế', 'Đánh cái gì vậy?', 'Mày biết chơi không?', 'Óc chó', 'Đm thằng nào đánh mất cầu', 'Vkl', 'Vl', 'Đm',
  'Vãi cức', 'Cmnr', 'Cay vkl', 'Nhanh dùm cái, câu giờ à?', 'Lâu vl', 'Làm con mẹ gì lâu thế?',
  'Mấy thằng top toàn tool à?', 'Lại buff bẩn rồi', 'Biết chơi thì hẵng vào tiền', 'Thua lại chửi',
  'Im mẹ mồm đi', 'Cố lên ae', 'Về bờ nào', 'Làm ván nữa gỡ đi', 'Chơi lớn đi', 'Sợ gì',
  'All in đi bạn ơi', 'Tất tay đi', 'Đừng sợ', 'Tự tin lên', 'Quyết đoán lên', 'Húp rồi!', 'Ngonnn',
  'Về bờ!!!', 'kkk', 'haha', 'Ăn to rồi', 'Tuyệt vời', 'Đỉnh cao', 'Quá hay', 'Sáng nước', 'Thơm thế',
  'Bú no', 'húp', 'Toang rồi', 'Xa bờ quá', 'Đen vãi', 'Game bịp à?', 'Nhà cái thao túng à?',
  'Huhu', 'Chán vãi', 'Cay thế', 'Mất hết rồi', 'Còn cái nịt', 'Game như lồn', 'Đen thôi đỏ quên đi',
  'Game nhảm vcl', 'Cầu này đi sao ae?', 'Theo gì bây giờ?', 'Ai cho xin nhận định với',
  'Hôm nay nên đánh gì?', 'Có ai theo tôi không?', 'Chắc không đấy?', 'Tin được không?',
  'Làm sao để thắng?', 'Ván này nên vào tiền không?', 'Ad đâu rồi?', 'wtf', 'gg', 'nice one',
  'let\'s go', 'omg', 'really?', 'come on', 'so easy', 'ez game', 'what the hell', 'holy shit',
  'wow', 'lucky bastard', 'fuck', 'shit',
  // Thêm tin nhắn đa dạng và thực tế hơn
  'Chào ae', 'Hi mọi người', 'Có ai online không?', 'Vào chơi đi ae',
  'Hôm nay thế nào?', 'Ai đang thắng?', 'Thua bao nhiêu rồi?', 'Còn tiền không?',
  'Nạp bao nhiêu hôm nay?', 'Rút được chưa?', 'Bao giờ có event?', 'Khuyến mãi gì không?',
  'Newbie xin chào', 'Chơi lâu chưa?', 'Game này uy tín không?', 'Có bị lừa không?',
  'Mình mới vào', 'Chơi thế nào?', 'Có trick gì không?', 'Bí quyết là gì?',
  'Thắng liên tục', 'Thua liên tiếp', 'Gỡ được chưa?', 'Về bờ chưa?',
  'Đang cháy tài khoản', 'All in cuối cùng', 'Hết tiền rồi', 'Vay tiền chơi tiếp',
  'Nghỉ chơi thôi', 'Chơi nữa không?', 'Đổi game khác', 'Game này khó quá',
  'Dễ ăn vãi', 'Khó ăn vcl', 'May mắn quá', 'Xui xẻo vãi',
  'Chúc may mắn', 'Good luck ae', 'Chúc thắng lớn', 'Ăn nhiều vào',
  'Cẩn thận nhé', 'Đừng tham', 'Biết điểm dừng', 'Chơi có não',
  'Theo cảm giác', 'Tin vào may mắn', 'Phong thủy hôm nay', 'Số đẹp là gì?',
  'Hôm nay thứ mấy?', 'Giờ vàng rồi', 'Giờ đen tối', 'Nên nghỉ chưa?',
  'Chơi đêm được không?', 'Sáng hay tối?', 'Cuối tuần sao?', 'Đầu tháng thế nào?',
  'Lương về rồi', 'Tiêu hết lương', 'Vợ biết chết', 'Giấu vợ chơi',
  'Bố mẹ biết là chết', 'Học sinh chơi gì', 'Sinh viên nghèo', 'Đi làm kiếm tiền',
  'Nghỉ việc chơi game', 'Bán nhà chơi', 'Vay ngân hàng', 'Cầm cố tài sản',
  'Chơi cho vui thôi', 'Giải trí cuối tuần', 'Thư giãn sau work', 'Stress quá chơi game',
];

const getGameSpecificMessage = (gameId?: number): string => {
  const messages = {
    1001: vnLottoMessages, // VN_LOTTO
    1007: xocDiaMessages, // SIC_BO_RW_ELEC
    2001: pk10Messages,   // PK10_POKER
    5002: kenoMessages,   // KENO
  }[gameId || 0] || defaultMessages;

  return getRandomElement(messages);
};

const addRandomEmoji = (message: string): string => {
  const emojis = [
    '😊', '👍', '🎮', '🎲', '🎯', '💰', '🎪', '🎨', '🎭', '🎪',
    '😂', '🤣', '🤑', '😭', '🤬', '🤔', '🙏', '🙌', '💯', '🔥',
    '🚀', '🤡', '🐸', '💀', '💸', '💔',
  ];
  return Math.random() > 0.5 ? `${message} ${getRandomElement(emojis)}` : message;
};

const addVietnameseSlang = (message: string): string => {
  const slangs = [' nha', ' ạ', ' nhé', ' đấy', ' này', ' luôn', ' nè', ' thôi', ' vkl', ' vl', ' cmnr'];
  return Math.random() > 0.5 ? `${message}${getRandomElement(slangs)}` : message;
};

const toUpperCaseSometimes = (message: string): string => {
  return Math.random() > 0.9 ? message.toUpperCase() : message;
};

// Tạo avatar từ tên user (2 chữ cái đầu)
const generateAvatar = (username: string): string => {
  const cleanName = username.trim();
  if (cleanName.length === 0) return 'UN';

  // Lấy 2 ký tự đầu và chuyển thành chữ hoa
  if (cleanName.length === 1) {
    return cleanName.toUpperCase();
  }

  return cleanName.substring(0, 2).toUpperCase();
};

// Tạo màu nền avatar dựa trên tên
const generateAvatarColor = (username: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Tạo tần suất tin nhắn thực tế hơn
const getRandomInterval = (): number => {
  const intervals = [
    { min: 2000, max: 5000, weight: 0.4 },   // 2-5 giây (40%)
    { min: 5000, max: 10000, weight: 0.3 },  // 5-10 giây (30%)
    { min: 10000, max: 20000, weight: 0.2 }, // 10-20 giây (20%)
    { min: 20000, max: 60000, weight: 0.1 }  // 20-60 giây (10%)
  ];

  const random = Math.random();
  let cumulativeWeight = 0;

  for (const interval of intervals) {
    cumulativeWeight += interval.weight;
    if (random <= cumulativeWeight) {
      return interval.min + Math.random() * (interval.max - interval.min);
    }
  }

  return 3000; // fallback
};

export const generateChatMessage = (gameId?: number) => {
  const username: string = getRandomName();
  const message = getGameSpecificMessage(gameId);
  const processedMessage = toUpperCaseSometimes(addVietnameseSlang(addRandomEmoji(message)));

  return {
    username,
    message: processedMessage,
    avatar: generateAvatar(username),
    avatarColor: generateAvatarColor(username),
  };
};

export { getRandomInterval };