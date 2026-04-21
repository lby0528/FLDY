/**
 * 飞梁叠韵 - 游戏常量与数据
 */

export const RESIDENCES = [
  {
    id: 'northeast',
    name: '东北朝鲜族民居',
    mapPos: { x: 81, y: 15 },
    description: '白衣民族的温情居所，以火炕为魂，木架为骨。',
    image: '/assets/residences/northeast/1.jpg',
    components: ['夯土墙', '木梁', '木门', '灰瓦', '灶台', '炕床', '烟囱', '石基', '窗格'],
    componentImages: {
      '夯土墙': '/assets/residences/northeast/components/夯土墙.jpg',
      '木梁': '/assets/residences/northeast/components/木梁.jpg',
      '木门': '/assets/residences/northeast/components/木门.jpg',
      '灰瓦': '/assets/residences/northeast/components/灰瓦.jpg',
      '灶台': '/assets/residences/northeast/components/灶台.jpg',
      '炕床': '/assets/residences/northeast/components/炕床.jpg',
      '烟囱': '/assets/residences/northeast/components/烟囱.jpg',
      '石基': '/assets/residences/northeast/components/石基.jpg',
      '窗格': '/assets/residences/northeast/components/窗格.jpg'
    },
    knowledge: [
      { title: '木材甄选', content: '多选蒙古栎或红松，质地坚韧，御寒性极佳。' },
      { title: '火炕暖流', content: '烟道与火炕排布是营造核心，将温存嵌入建筑。' },
      { title: '坡屋顶', content: '陡峭的山墙坡度旨在令积雪自行滑落，免其重压。' }
    ],
    details: {
      style: '建筑风格：东北朝鲜族民居多采用木架结构，墙体以生土夯筑或木板围护，厚度可达40厘米以上，极具御寒性。屋顶多为四坡式，坡度陡峭，利于冬季积雪自然滑落。其梁架结构严密，不施繁琐装饰，尽显质朴之美。室内空间开敞，地面铺设火炕，形成了独特的“温突”系统。',
      customs: '风俗习惯：朝鲜族素有“白衣民族”之称，崇尚洁净。室内生活以火炕为中心，进屋必须脱鞋。日常饮食、睡眠、待客均在炕上进行。长辈居于炕头，晚辈居于炕梢，体现了严谨的礼仪等级。每逢佳节，全家围坐炕头，共享打糕与米酒，其乐融融。',
      history: '历史背景：这种民居形式是朝鲜族在长期的迁徙过程中，将半岛原有的建筑习惯与中国东北严寒气候相结合的产物。从最初的简易草房到后来的精美瓦房，见证了民族融合与生存智慧呈现。在漫长的岁月中，它已成为东北边陲一道独特的文化风景线。',
      heritage: '文化底蕴：建筑色彩素雅，多以白色为主调，体现了民族纯洁、质朴的性格。其营造技艺中蕴含的“温突”（火炕）技术，是人类早期利用地热能的杰出代表，被列入国家级非物质文化遗产名录。它不仅是居住空间，更是民族情感的寄托。',
      features: '当地特色：最显著的特色是其独特的烟囱设计，烟囱往往独立于房屋之外，通过地下烟道与火炕相连，既能有效防止火灾，又能增加排烟动力。此外，其宽大的木质外廊（走廊）也是夏季纳凉、劳作的重要场所，体现了对自然空间的充分利用。'
    },
    classicQuote: '“凡构屋之制，皆以材为祖。材有八等，度用有差。凡屋宇之高，皆以材为准。” —— 《营造法式》',
    quiz: [
      {
        q: '东北朝鲜族民居屋顶坡度较大的主要原因是什么？',
        a: ['为了美观', '为了排水', '为了排雪', '为了通风'],
        correct: 2
      },
      {
        q: '朝鲜族民居中，被称为“建筑之魂”的保暖设施是？',
        a: ['壁炉', '火炕', '地暖', '火盆'],
        correct: 1
      },
      {
        q: '东北朝鲜族民居的墙体通常使用什么材料夯筑？',
        a: ['红砖', '青砖', '生土', '水泥'],
        correct: 2
      }
    ]
  },
  {
    id: 'siheyuan',
    name: '北京四合院',
    mapPos: { x: 70, y: 32 },
    description: '皇城根下的礼制空间，方正严整，长幼有序。',
    image: '/assets/residences/siheyuan/2.jpg',
    components: ['围墙', '影壁墙', '木梁', '灰瓦', '石狮子', '硬山顶', '随墙门', '青砖'],
    componentImages: {
      '围墙': '/assets/residences/siheyuan/components/围墙.jpg',
      '影壁墙': '/assets/residences/siheyuan/components/影壁墙.jpg',
      '木梁': '/assets/residences/siheyuan/components/木梁.jpg',
      '灰瓦': '/assets/residences/siheyuan/components/灰瓦.jpg',
      '石狮子': '/assets/residences/siheyuan/components/石狮子.jpg',
      '硬山顶': '/assets/residences/siheyuan/components/硬山顶.jpg',
      '随墙门': '/assets/residences/siheyuan/components/随墙门.jpg',
      '青砖': '/assets/residences/siheyuan/components/青砖.jpg'
    },
    knowledge: [
      { title: '中轴对称', content: '【礼制格局】：体现了儒家礼制思想，长辈居正房，晚辈居厢房。' },
      { title: '影壁屏风', content: '【藏风聚气】：大门内的影壁既能遮挡视线，又能阻挡邪气。' },
      { title: '抄手游廊', content: '【曲径通幽】：连接各房的走廊，遮风避雨，增加空间层次。' }
    ],
    details: {
      style: '建筑风格：北京四合院是中国传统合院式建筑的典范，讲究“坎宅巽门”。整体布局以南北中轴线对称，由正房、厢房、倒座房围合而成。青砖灰瓦，色调素雅，通过垂花门、抄手游廊将各个空间串联，形成层次分明的内向型院落。其建筑等级严明，门楼、屋脊、彩画无不体现居住者的身份。',
      customs: '风俗习惯：院落是家族生活的核心，讲究“长幼有序，内外有别”。长辈居正房，晚辈居厢房。院中常植石榴、海棠，寓意“多子多福”和“金玉满堂”。老北京人喜欢在院中养鱼、种花、听蝉，享受天伦之乐。清晨的鸽哨与胡同的叫卖声，构成了四合院最动人的背景音乐。',
      history: '历史背景：四合院的雏形可追溯至元代，明清时期达到盛。它是北京作为都城社会结构和宗法制度的物化表现，每一座院落都记录着皇城根下数百年的人间烟火与历史变迁。它不仅是建筑，更是老北京社会关系的缩影。',
      heritage: '文化底蕴：体现了儒家思想中的礼制、中庸与和谐。其空间布局反映了“天人合一”的居住理想，影壁墙上的雕刻、门楼上的楹联，无不透射出深厚的文学底蕴与道德追求。它是一种内敛、含蓄且富有温情的居住文化。',
      features: '当地特色：独特的“影壁”设计，既能遮挡视线，又能阻挡邪气；“垂花门”则是内宅与外院的分界线，其精美的木雕垂柱是四合院建筑艺术的精华所在。此外，四合院的排水系统也极其考究，体现了古代匠人对自然规律的深刻理解。'
    },
    classicQuote: '“庭院深深深几许，杨柳堆烟，帘幕无重数。合院之制，贵在藏风聚气。” —— 《营造法式·宅经》',
    quiz: [
      {
        q: '四合院中，长辈通常居住在哪个位置？',
        a: ['倒座房', '厢房', '正房', '耳房'],
        correct: 2
      },
      {
        q: '四合院大门内侧常设的、起到遮挡视线作用的墙体叫什么？',
        a: ['女儿墙', '影壁', '封火墙', '马头墙'],
        correct: 1
      }
    ]
  },
  {
    id: 'yaodong',
    name: '陕北窑洞',
    mapPos: { x: 58, y: 42 },
    description: '黄土地上的生命之穴，冬暖夏凉，与大地共生。',
    image: '/assets/residences/yaodong/5.jpg',
    components: ['剪纸窗花', '厚黄土', '木门窗', '枣树', '水缸', '石磨', '黄土'],
    componentImages: {
      '剪纸窗花': '/assets/residences/yaodong/components/剪纸窗花.jpg',
      '厚黄土': '/assets/residences/yaodong/components/厚黄土.jpg',
      '木门窗': '/assets/residences/yaodong/components/木门窗.jpg',
      '枣树': '/assets/residences/yaodong/components/枣树.jpg',
      '水缸': '/assets/residences/yaodong/components/水缸.jpg',
      '石磨': '/assets/residences/yaodong/components/石磨.jpg',
      '黄土': '/assets/residences/yaodong/components/黄土.jpg'
    },
    knowledge: [
      { title: '拱形结构', content: '【生土承重】：利用土壤的承重力，无需梁柱即可支撑巨大压力。' },
      { title: '蓄热性能', content: '【冬暖夏凉】：厚重的土层是天然隔热层，实现天然恒温。' },
      { title: '地坑奇观', content: '【穴居遗风】：见树不见村，进村不见房，闻声不见人。' }
    ],
    details: {
      style: '建筑风格：窑洞是利用黄土高原厚厚的土层开凿而成的生土建筑。其拱形结构完美利用了土壤的承重力，无需梁柱。分为靠山窑、下沉式窑洞（地坑院）和箍窑三种形式。墙体厚度可达数米，具有极佳的蓄热性能。内部空间深邃，光影斑驳，给人以安全与宁静之感。',
      customs: '风俗习惯：陕北人性格豪爽，窑洞生活充满了乡土气息。每逢佳节，妇女们会在窗棂上贴满精美的剪纸窗花，门前挂起大红灯笼。邻里之间常在窑顶或院中围坐，吃着红枣，唱着信天游，热闹非凡。窑洞前的石磨、水缸，都是生活最真实的写照。',
      history: '历史背景：窑洞建筑历史悠久，可追溯至周代。它是黄土地上的先民在缺乏木材、石材的环境下，利用自然条件创造出的生存奇迹，是黄河文明的重要载体。它见证了华夏民族在艰苦环境下生生不息的顽强生命力。',
      heritage: '文化底蕴：窑洞体现了“与大地共生”的朴素哲学。它不仅是避风港，更是陕北人民坚韧、淳朴性格的象征。这种零能耗的绿色建筑，被现代建筑学誉为“可持续发展的典范”。它蕴含着深厚的土地情感与民族记忆。',
      features: '当地特色：最令人称奇的是“地坑院”，被称为“地平线下的古村落”。人们在平地上挖出深坑，再在坑壁开凿窑洞，形成了“见树不见村，进村不见房，闻声不见人”的独特景观。这种“穴居”文化的遗存，是人类居住史上的活化石。'
    },
    classicQuote: '“凿土为室，依山而居。冬避严寒，夏消酷暑，此黄土之赐也。” —— 《营造法式·原道》',
    quiz: [
      {
        q: '陕北窑洞的拱形结构主要起什么作用？',
        a: ['装饰美观', '分散压力', '增加采光', '方便通风'],
        correct: 1
      },
      {
        q: '窑洞的窗户上贴的红色装饰叫什么？',
        a: ['剪纸窗花', '春联', '年画', '灯笼'],
        correct: 0
      },
      {
        q: '窑洞通常分布在中国的哪个高原？',
        a: ['青藏高原', '内蒙古高原', '黄土高原', '云贵高原'],
        correct: 2
      }
    ]
  },
  {
    id: 'huoer',
    name: '岭南镬耳屋',
    mapPos: { x: 60, y: 82 },
    description: '广府文化的骄傲，高耸的封火墙如官帽之耳。',
    image: '/assets/residences/huoer/3.jpg',
    components: ['功夫茶具', '木雕', '榕树', '灯笼', '灰塑', '砖雕', '醒狮', '锅耳山墙'],
    componentImages: {
      '功夫茶具': '/assets/residences/huoer/components/功夫茶具.jpg',
      '木雕': '/assets/residences/huoer/components/木雕.jpg',
      '榕树': '/assets/residences/huoer/components/榕树.jpg',
      '灯笼': '/assets/residences/huoer/components/灯笼.jpg',
      '灰塑': '/assets/residences/huoer/components/灰塑.jpg',
      '砖雕': '/assets/residences/huoer/components/砖雕.jpg',
      '醒狮': '/assets/residences/huoer/components/醒狮.jpg',
      '锅耳山墙': '/assets/residences/huoer/components/锅耳山墙.jpg'
    },
    knowledge: [
      { title: '防火防风', content: '【镬耳封火】：高大的镬耳墙能阻隔火势蔓延，并引导自然风。' },
      { title: '身份象征', content: '【加官进爵】：镬耳状如官帽，寓意子孙功成名就，独占鳌头。' },
      { title: '三间两廊', content: '【岭南规制】：典型的平面布局，适应岭南潮湿炎热的气候。' }
    ],
    details: {
      style: '建筑风格：镬耳屋以其高耸的“镬耳”状封火墙闻名。墙体多采用青砖石脚，内部为“三间两廊”布局。这种高大的山墙不仅能阻隔火势，还能在夏季引导自然风进入院落，形成天然的通风系统，适应岭南湿热气候。建筑线条优美，动感十足，如波浪起伏。',
      customs: '风俗习惯：广府人讲究“饮水思源”，镬耳屋中必设祖龛。当地人崇尚读书，有“耕读传家”的传统。功夫茶是日常待客之礼，醒狮表演则是喜庆节日不可或缺的重头戏，展现了岭南文化的活力。每逢佳节，祠堂前的聚餐更是联络宗亲感情的重要纽带。',
      history: '历史背景：盛行于明清时期的珠三角地区。只有取得功名的官宦人家或富商才有资格建造镬耳屋，因此它是身份与财富的象征，记录了广府地区商业与文化的繁荣。它见证了岭南地区从边陲之地向经济文化重镇的转变。',
      heritage: '文化底蕴：镬耳墙形似古代官帽的耳朵，寓意“加官进爵”、“独占鳌头”。建筑装饰中大量运用灰塑、砖雕，内容多为历史典故和吉祥图案，体现了岭南人务实、进取且富有浪漫情怀的审美。它是一种融合了实用主义与浪漫美学的建筑语言。',
      features: '当地特色：精美绝伦的“灰塑”工艺是其一大特色。在屋脊、山墙上，匠人们用石灰、纸筋等材料塑造出色彩斑斓的人物、花鸟，经风历雨而不褪色，被誉为“屋顶上的艺术”。此外，其独特的排水系统“落水管”也常装饰成竹节状，寓意节节高升。'
    },
    classicQuote: '“山墙高耸如镬耳，御火导风。青砖石脚，岭南之风骨也。” —— 《营造法式·岭南篇》',
    quiz: [
      {
        q: '镬耳屋独特的山墙形状主要起什么作用？',
        a: ['增加采光', '防火防风', '收集雨水', '装饰美观'],
        correct: 1
      },
      {
        q: '镬耳屋的“镬耳”形状像古代的什么？',
        a: ['官帽', '元宝', '书卷', '如意'],
        correct: 0
      },
      {
        q: '镬耳屋主要分布在哪个文化区域？',
        a: ['客家文化', '闽南文化', '广府文化', '潮汕文化'],
        correct: 2
      }
    ]
  },
  {
    id: 'tulou',
    name: '闽西客家土楼',
    mapPos: { x: 50, y: 76 },
    description: '聚族而居的防御堡垒，圆方之间尽显家族凝聚力。',
    image: '/assets/residences/tulou/4.jpg',
    components: ['内廊木窗', '夯土', '木桶', '木梁', '瓦屋', '石基', '石磨'],
    componentImages: {
      '内廊木窗': '/assets/residences/tulou/components/内廊木窗.jpg',
      '夯土': '/assets/residences/tulou/components/夯土.jpg',
      '木桶': '/assets/residences/tulou/components/木桶.jpg',
      '木梁': '/assets/residences/tulou/components/木梁.jpg',
      '瓦屋': '/assets/residences/tulou/components/瓦屋.jpg',
      '石基': '/assets/residences/tulou/components/石基.jpg',
      '石磨': '/assets/residences/tulou/components/石磨.jpg'
    },
    knowledge: [
      { title: '防御至上', content: '【堡垒之墙】：底层不设窗，厚厚的夯土墙可抵御外敌侵扰。' },
      { title: '平等共享', content: '【家族大同】：环形布局中，每户空间大小一致，体现家族平等。' },
      { title: '生土营造', content: '【千年不倒】：以生土、竹片、糯米浆夯筑，历经百年风雨。' }
    ],
    details: {
      style: '建筑风格：客家土楼是世界上独一无二的大型夯土民居。以生土、竹片、糯米浆夯筑而成，墙体厚达2米。平面呈圆形或方形，内部多达四五层，中心为家族祠堂。这种向心式的围合布局，既能防御外敌，又利于家族聚居。其结构稳固，历经数百年风雨而不倒。',
      customs: '风俗习惯：土楼内生活极具集体色彩。全族人共用一口井，共用一个大门。每逢佳节，全楼人会在中心天井摆开长桌宴，敬祖睦宗。客家人极其重视教育，土楼内常设有私塾，耕读文化深入骨髓。这种“大家庭”式的居住方式，培养了极强的家族认同感。',
      history: '历史背景：客家人为躲避中原战乱南迁，在闽西山区落脚。为了抵御山匪和野兽，他们创造了这种堡垒式的建筑。每一座土楼都是一部客家人的迁徙史和奋斗史，记录了民族在逆境中求生存、求发展的壮丽篇章。',
      heritage: '文化底蕴：土楼体现了极强的平等意识。在环形布局中，每户人家的房间大小、朝向完全一致，象征着家族内部的团结与公平。2008年，福建土楼被正式列入《世界遗产名录》。它是东方文明中“和合”文化的生动体现。',
      features: '当地特色：土楼具有惊人的抗震性能。在多次大地震中，许多土楼虽墙体开裂，却能奇迹般地“自动愈合”而不倒。其厚重的墙体还具有冬暖夏凉的天然调节功能。此外，土楼的防火系统也极其巧妙，体现了先民的卓越智慧。'
    },
    classicQuote: '“聚族而居，筑土为堡。圆方之间，尽显家族凝聚之魂。” —— 《客家营造志》',
    quiz: [
      {
        q: '客家土楼底层通常不设窗户的主要目的是？',
        a: ['节省材料', '防御外敌', '保持室内温度', '防止潮湿'],
        correct: 1
      },
      {
        q: '福建土楼的墙体厚度通常可达多少米？',
        a: ['0.5米', '1米', '2米', '5米'],
        correct: 2
      },
      {
        q: '土楼的中心位置通常是什么建筑？',
        a: ['厨房', '家族祠堂', '水井', '戏台'],
        correct: 1
      }
    ]
  },
  {
    id: 'redbrick',
    name: '福建红砖古厝',
    mapPos: { x: 74, y: 78 },
    description: '闽南红的绚丽乐章，燕尾脊划破长空。',
    image: '/assets/residences/redbrick/6.jpg',
    components: ['妈祖信仰', '宗族制度', '木雕', '灰塑', '燕尾脊', '石基', '砖雕', '红砖墙'],
    componentImages: {
      '妈祖信仰': '/assets/residences/redbrick/components/妈祖信仰.jpg',
      '宗族制度': '/assets/residences/redbrick/components/宗族制度.jpg',
      '木雕': '/assets/residences/redbrick/components/木雕.jpg',
      '灰塑': '/assets/residences/redbrick/components/灰塑.jpg',
      '燕尾脊': '/assets/residences/redbrick/components/燕尾脊.jpg',
      '石基': '/assets/residences/redbrick/components/石基.jpg',
      '砖雕': '/assets/residences/redbrick/components/砖雕.jpg',
      '红砖墙': '/assets/residences/redbrick/components/红砖墙.jpg'
    },
    knowledge: [
      { title: '燕尾裁云', content: '【飞檐之美】：屋脊两端翘起如燕尾，是闽南建筑最显著的特征。' },
      { title: '出砖入石', content: '【斑驳美学】：利用废弃砖石混砌墙体，形成独特的视觉美感。' },
      { title: '红砖文化', content: '【闽南底色】：红砖红瓦象征喜庆与富贵，深受闽南人喜爱。' }
    ],
    details: {
      style: '建筑风格：闽南红砖古厝以“燕尾脊”和“红砖白石”为核心特征。屋脊两端高高翘起，如燕子展翅。墙体采用“出砖入石”工艺，将废弃的红砖与白石混砌，形成斑驳错落的视觉美感。整体色彩绚丽，装饰极尽奢华，展现了闽南建筑独特的张力与美感。',
      customs: '风俗习惯：闽南人依海而生，妈祖信仰是其精神支柱。每座古厝内必设神龛，供奉祖先。当地人极其重视宗族关系，每逢祭祖或节日，散布海外的族人都会归乡聚首，体现了浓厚的乡土情结。那份对根的坚守，是闽南文化最动人的部分。',
      history: '历史背景：红砖建筑融合了中原传统文化与海外海洋文化。随着“海上丝绸之路”的繁荣，闽南华侨将海外的审美与财富带回故里，形成了这种独特而华丽的建筑流派。它是东西方文化交流在建筑领域的珍贵结晶。',
      heritage: '文化底蕴：红色在闽南文化中象征着喜庆、富贵与生命力。燕尾脊不仅是视觉符号，更寄托了闽南人渴望飞黄腾达、光宗耀祖的愿景。其精美的石雕、木雕，无不诉说着家族的辉煌与对美好生活的向往。',
      features: '当地特色：独特的“嵌瓷”工艺。匠人们将彩色瓷片敲碎，拼贴成历史人物、花鸟瑞兽，点缀在屋脊和檐下。这些装饰历经百年海风侵袭依然鲜艳夺目。此外，其“塌寿”式的大门设计，也增加了空间的层次感与庄重感。'
    },
    classicQuote: '“燕尾裁云，红砖映日。出砖入石，闽南之瑰宝也。” —— 《营造法式·闽南篇》',
    quiz: [
      {
        q: '闽南古厝屋顶两端翘起的结构称为什么？',
        a: ['马头墙', '镬耳墙', '燕尾脊', '悬山顶'],
        correct: 2
      },
      {
        q: '闽南红砖古厝中，“出砖入石”是指什么？',
        a: ['砖石混砌', '砖雕艺术', '石雕艺术', '红砖烧制'],
        correct: 0
      },
      {
        q: '闽南古厝屋顶上色彩斑斓的瓷片装饰工艺叫什么？',
        a: ['灰塑', '砖雕', '嵌瓷', '彩绘'],
        correct: 2
      }
    ]
  },
  {
    id: 'chaoshan',
    name: '潮汕民居',
    mapPos: { x: 64, y: 88 },
    description: '京华流韵的精雕细琢，“下山虎”与“四点金”。',
    image: '/assets/residences/chaoshan/7.jpg',
    components: ['凹肚门楼', '功夫茶文化', '嵌瓷', '嵌瓷屋脊', '木雕', '潮汕祠堂', '潮汕老爷巡游', '灰塑', '石雕', '英歌舞'],
    componentImages: {
      '凹肚门楼': '/assets/residences/chaoshan/components/凹肚门楼.jpg',
      '功夫茶文化': '/assets/residences/chaoshan/components/功夫茶文化.jpg',
      '嵌瓷': '/assets/residences/chaoshan/components/嵌瓷.jpg',
      '嵌瓷屋脊': '/assets/residences/chaoshan/components/嵌瓷屋脊.jpg',
      '木雕': '/assets/residences/chaoshan/components/木雕.jpg',
      '潮汕祠堂': '/assets/residences/chaoshan/components/潮汕祠堂.jpg',
      '潮汕老爷巡游': '/assets/residences/chaoshan/components/潮汕老爷巡游.jpg',
      '灰塑': '/assets/residences/chaoshan/components/灰塑.jpg',
      '石雕': '/assets/residences/chaoshan/components/石雕.jpg',
      '英歌舞': '/assets/residences/chaoshan/components/英歌舞.jpg'
    },
    knowledge: [
      { title: '四点金', content: '【稳重如金】：潮汕民居的典型格局，四角各有一房，稳重如金。' },
      { title: '嵌瓷工艺', content: '【屋顶艺术】：利用碎瓷片拼贴成精美的屋顶装饰，经久不褪色。' },
      { title: '木雕艺术', content: '【精雕细琢】：潮汕木雕以精细著称，梁架上布满了历史典故。' }
    ],
    details: {
      style: '建筑风格：潮汕民居被誉为“京华流韵”，以“下山虎”和“四点金”为典型格局。建筑极其讲究精细，梁架结构严密，装饰繁复。门楼多采用“凹肚”形式，石雕、木雕、嵌瓷遍布全身，每一寸空间都透射出精雕细琢的匠心。其严谨的规制中透着一种华丽的庄重。',
      customs: '风俗习惯：潮汕人生活精致，功夫茶是其文化名片。当地人极重祭祀，祠堂建筑往往是村中最华丽的。每逢“营老爷”（游神），全村张灯结彩，英歌舞气势磅礴，展现了深厚的民间传统与家族凝聚力。那种对传统的敬畏，深深植根于每个潮汕人的心中。',
      history: '历史背景：潮汕建筑保留了大量唐宋时期的建筑遗风。在长期的历史演进中，潮汕人将中原建筑规制与当地海洋气候相结合，创造出了这种既严谨又华丽的居住形式。它是中原文化在南方边陲的完美延续与创新。',
      heritage: '文化底蕴：体现了潮汕人“精益求精”的工匠精神。其“金漆木雕”以多层镂空刻法著称，内容多为忠孝节义的故事，起到了潜移默化的教化作用。这种对美的极致追求，是潮汕文化的灵魂，也是民族精神的体现。',
      features: '当地特色：潮汕祠堂是其建筑艺术的集大成者。屋顶的“嵌瓷”装饰规模宏大，色彩斑斓。内部的木雕梁架往往贴满真金箔，金碧辉煌，被誉为“民间艺术的博物馆”。此外，其独特的“彩绘”工艺也为建筑增色不少。'
    },
    classicQuote: '“京华流韵，精雕细琢。四点金立，潮汕之匠心也。” —— 《潮汕营造志》',
    quiz: [
      {
        q: '潮汕民居屋顶上用碎瓷片拼贴的装饰工艺叫什么？',
        a: ['砖雕', '石雕', '嵌瓷', '泥塑'],
        correct: 2
      },
      {
        q: '潮汕民居中，被称为“下山虎”的是指什么？',
        a: ['装饰风格', '建筑格局', '屋顶形状', '门楼样式'],
        correct: 1
      },
      {
        q: '潮汕木雕以什么颜色最为著名？',
        a: ['原木色', '金漆', '朱红', '墨黑'],
        correct: 1
      }
    ]
  },
  {
    id: 'waterway',
    name: '苏浙水乡民居',
    mapPos: { x: 78, y: 56 },
    description: '吳侬软语的水墨画卷，粉墙黛瓦，临水而居。',
    image: '/assets/residences/waterway/8.jpg',
    components: ['水上交通', '水巷', '油纸伞', '瓦屋顶', '白墙黑瓦', '石桥', '竹篓', '船桨'],
    componentImages: {
      '水上交通': '/assets/residences/waterway/components/水上交通.jpg',
      '水巷': '/assets/residences/waterway/components/水巷.jpg',
      '油纸伞': '/assets/residences/waterway/components/油纸伞.jpg',
      '瓦屋顶': '/assets/residences/waterway/components/瓦屋顶.jpg',
      '白墙黑瓦': '/assets/residences/waterway/components/白墙黑瓦.jpg',
      '石桥': '/assets/residences/waterway/components/石桥.jpg',
      '竹篓': '/assets/residences/waterway/components/竹篓.jpg',
      '船桨': '/assets/residences/waterway/components/船桨.jpg'
    },
    knowledge: [
      { title: '粉墙黛瓦', content: '【水墨意境】：白墙黑瓦，色彩素雅，与江南水乡环境完美融合。' },
      { title: '马头墙', content: '【错落之美】：高出屋面的山墙，既能防火，又具错落之美。' },
      { title: '临水建筑', content: '【枕河而居】：建筑跨水而建，设有河埠头，方便居民洗涤出行。' }
    ],
    details: {
      style: '建筑风格：江南水乡民居以“粉墙黛瓦”著称。建筑多临水而建，形成“前巷后河”的格局。高耸的马头墙错落有致，不仅具有防火功能，更增添了空间的韵律感。室内空间灵活通透，通过天井、漏窗将自然景观引入室内。整体风格简约而不失雅致，如同一幅流动的水墨画。',
      customs: '风俗习惯：水乡生活温婉细腻。居民习惯于“枕河人家”的生活，洗衣、洗菜、出行皆依赖门前的河道。茶馆是当地社交的中心，人们在这里听评弹、聊家常，享受着宁静、悠闲的慢生活。那份恬静与从容，是江南水乡最迷人的底色。',
      history: '历史背景：随着江南经济在宋元时期的崛起，水乡民居逐渐形成了独特的审美风格。它是江南文人文化与商业文明共同孕育的果实，体现了富庶地区对精致生活的追求。它见证了江南地区从鱼米之乡向文化高地的跨越。',
      heritage: '文化底蕴：建筑风格如同一幅淡雅的水墨画，体现了文人阶层“宁静致远”的审美理想。马头墙的起伏、漏窗的虚实，无不蕴含着中国古典园林“步移景异”的造园智慧。它是一种对自然美学与人文情怀的深度融合。',
      features: '当地特色：独特的“河埠头”设计，是每家每户通往河流的私人码头。此外，连接两岸的石拱桥、廊棚，构成了水乡特有的“小桥流水人家”的诗意空间。其“过街楼”设计也极具特色，充分利用了空间，增加了街道的趣味性。'
    },
    classicQuote: '“粉墙黛瓦，枕河而居。马头墙起，江南之意境也。” —— 《营造法式·江南篇》',
    quiz: [
      {
        q: '江南民居中高出屋面的山墙主要功能是？',
        a: ['增加采光', '防火防风', '收集雨水', '增加高度'],
        correct: 1
      },
      {
        q: '江南水乡民居中，为了遮风避雨而建的临河走廊叫什么？',
        a: ['抄手游廊', '廊棚', '过街楼', '河埠头'],
        correct: 1
      },
      {
        q: '“粉墙黛瓦”中的“黛”是指什么颜色？',
        a: ['白色', '灰色', '黑色', '青色'],
        correct: 2
      }
    ]
  }
];

export const BUFFS = [
  { id: 'speed', name: '神工意匠', desc: '建造速度减缓 20%', duration: 10000 },
  { id: 'shield', name: '金石之固', desc: '错误容错 1 次', duration: 0 },
  { id: 'multiplier', name: '巧夺天工', desc: '得分翻倍 10 秒', duration: 10000 },
  { id: 'repair', name: '枯木逢春', desc: '恢复 20% 稳固度', duration: 0 }
];
