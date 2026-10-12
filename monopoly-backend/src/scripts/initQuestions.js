import mongoose from 'mongoose';
import Map from '../models/Map.js';
import Question from '../models/Question.js';
import connectDB from '../config/db.js';


const initQuestions = async () => {
  try {
    await connectDB();
    const existingMap = await Map.findOne({ name: '唐朝' });
    if (!existingMap) {
      console.error('Map "唐朝" not found. Please initialize the map first.');
      return;
    }

    const questionsData = [
        {
            mapId: existingMap._id,
            stem: '唐朝皇帝在什么节日会赠送护肤品给官员们？答对获得1000文',
            options: ['春节', '中秋节', '端午节', '腊八节', '元宵节', '清明节'],
            correctOption: '腊八节',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '“粒粒皆辛苦”出自哪位诗人的诗作？答对获得500文',
            options: ['杜甫', '李白', '白居易', '王维', '苏轼', '李绅'],
            correctOption: '李绅',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '与李白合称为“李杜”的是哪一位诗人？答对获得800文',
            options: ['杜甫', '李白', '白居易', '王维', '苏轼', '韩愈', '柳宗元'],
            correctOption: '杜甫',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '唐太宗时期嫁给松赞干布的是哪一位公主？答对获得500文',
            options: ['文成公主', '金城公主', '长安公主', '太平公主', '昭仪公主', '元妃公主'],
            correctOption: '文成公主',
            reward: 500
        },
        { 
            mapId: existingMap._id,
            stem: '唐朝的马桶叫什么？答对获得800文',
            options: ['马桶', '便盆', '痰盂', '夜壶', '尿壶', '便桶', '马子'],
            correctOption: '马子',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '唐朝发行的第一种钱币叫什么？答对获得1000文',
            options: ['开元通宝', '永乐通宝', '乾隆通宝', '嘉庆通宝', '康熙通宝', '顺治通宝'],
            correctOption: '开元通宝',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '哪本书记录了玄奘西行的所见所闻？答对获得1000文',
            options: ['《大唐西域记》', '《全唐诗》', '《全唐文》', '《资治通鉴》', '《史记》', '《汉书》'],
            correctOption: '《大唐西域记》',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '《夜雨寄北》是哪位诗人的著作？答对获得1000文',
            options: ['杜甫', '李白', '白居易', '王维', '苏轼', '李绅','韩愈', '柳宗元', '李商隐'],
            correctOption: '李商隐',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '唐长安城位于今天的哪座城市？答对获得1000文',
            options: ['西安', '北京', '南京', '洛阳', '杭州', '成都'],
            correctOption: '西安',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '唐朝时，“天下之胜，扬为首”里的扬是指哪座城市？答对获得600文',
            options: ['扬州', '西安', '洛阳', '南京', '杭州', '成都'],
            correctOption: '扬州',
            reward: 600
        },
        {
            mapId: existingMap._id,
            stem: '唐朝在位时间最长的皇帝是谁？答对获得1000文',
            options: ['唐太宗-李世民', '唐高宗-李治', '唐中宗-李显', '唐玄宗-李隆基', '唐肃宗-李亨', '唐德宗-李适'],
            correctOption: '唐玄宗-李隆基',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '“开元盛世”是哪位皇帝在位时出现的盛况？答对获得1000文',
            options: ['唐太宗-李世民', '唐高宗-李治', '唐中宗-李显', '唐玄宗-李隆基', '唐肃宗-李亨', '唐德宗-李适'],  
            correctOption: '唐玄宗-李隆基',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '与白居易并称为“刘白”的诗人是谁？答对获得500文',
            options: ['刘禹锡', '刘方平‌', '刘希夷‌', '刘长卿', '刘基', '刘勰', '柳宗元'],
            correctOption: '刘禹锡',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '“两个黄鹂鸣翠柳”出自哪位诗人的诗作？答对获得1000文',
            options: ['杜甫', '李白', '白居易', '王维', '苏轼', '韩愈', '柳宗元'],
            correctOption: '杜甫',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '中国历史上唯一的正统女皇帝是谁？答对获得1000文',
            options: ['武则天', '慈禧太后', '吕雉', '孝庄文皇后', '孝惠皇后', '孝昭皇后'],
            correctOption: '武则天',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '唐玄宗最有名的妃子是谁？答对获得1000文',
            options: ['杨贵妃', '武则天', '赵飞燕', '吕雉', '孝庄文皇后', '孝惠皇后', '孝昭皇后'],
            correctOption: '杨贵妃',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '唐朝曾在那些地方建都？答对会获得1000文',
            options: ['长安、洛阳', '北京、南京', '杭州、成都', '西安、洛阳', '扬州、南京', '西安、开封'],
            correctOption: '长安、洛阳',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '科举制中“武举”的开创者是谁?答对获得1000文',
            options: ['武则天', '唐太宗', '唐高宗', '唐中宗', '唐玄宗', '唐肃宗', '唐德宗'],
            correctOption: '武则天',
            reward: 1000  
        },
        {
            mapId: existingMap._id,
            stem: '唐朝开国皇帝是谁？答对获得800文',
            options: ['唐高祖-李渊', '唐太宗-李世民', '唐高宗-李治', '唐中宗-李显', '唐玄宗-李隆基', '唐肃宗-李亨', '唐德宗-李适'],
            correctOption: '唐高祖-李渊',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '“会当凌绝顶，一览众山小”是哪位诗人的诗作？答对获得500文',
            options: ['杜甫', '李白', '白居易', '王维', '苏轼', '韩愈', '柳宗元'],
            correctOption: '杜甫',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '创立“颜体”的书法家是哪一位？答对获得800文',
            options: ['颜真卿', '柳公权', '欧阳询', '赵孟頫'],
            correctOption: '颜真卿',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '“贞观之治”是哪位皇帝在位时期的清明政治？答对获得800文',
            options: ['唐高祖-李渊', '唐太宗-李世民', '唐高宗-李治', '唐中宗-李显', '唐玄宗-李隆基', '唐肃宗-李亨', '唐德宗-李适'],
            correctOption: '唐太宗-李世民',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '唐朝是否已经出现外卖服务？答对获得500文',
            options: ['是', '否'],
            correctOption: '是',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝时期盛行的类似于现代足球的运动是什么？答对获得1000文',
            options: ['蹴鞠', '相扑', '拔河', '跳绳', '秋千', '打陀螺'],
            correctOption: '蹴鞠',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '玄奘西行的目的地是哪里？答对获得800文',
            options: ['天竺', '吐蕃', '占城', '西域', '波斯', '东瀛'],
            correctOption: '天竺',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '“昔人已乘黄鹤去”出自那首诗作？答对获得500文',
            options: ['《黄鹤楼》', '《登鹳雀楼》', '《望庐山瀑布》', '《静夜思》', '《春晓》', '《早发白帝城》'],
            correctOption: '《黄鹤楼》',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '盛唐时期，女性以什么为美？答对获得500文',
            options: ['苗条', '丰腴', '高挑', '小巧', '娇小', '纤细'],
            correctOption: '丰腴',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝官员“上下班打卡”的制度叫什么？答对获得1000文',
            options: ['点卯', '签到', '打卡', '考勤', '述职', '汇报'],
            correctOption: '点卯',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '诗句“儿童不见不相识”的下一句是什么？答对获得800文',
            options: [ '笑问客从何处来', '笑问客从何方来', '笑问客从何地来', '笑问客从何处去', '笑问客从何方去', '笑问客从何地去'],
            correctOption: '笑问客从何处来',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '哪位皇帝在位期间唐朝的疆域达到最大？答对获得800文',
            options: ['唐太宗-李世民', '唐高宗-李治', '唐中宗-李显', '唐玄宗-李隆基', '唐肃宗-李亨', '唐德宗-李适'],
            correctOption: '唐高宗——李治',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '玄武门之变是谁发起的？答对获得800文',
            options: [ '李世民', '李建成', '李元吉', '李治', '李显', '李隆基' ],
            correctOption: '李世民',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '唐朝那种香料的价值堪比黄金？答对获得800文',
            options: ['肉桂', '丁香', '茴香', '八角', '花椒', '胡椒'],
            correctOption: '胡椒',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '唐朝一共存在了多少年答对获得1200文',
            options: ['289年', '300年', '298年', '250年', '200年', '150年'],
            correctOption: '289年',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '哪个事件后唐朝开始由盛转衰？答对获得800文',
            options: ['安史之乱', '黄巢起义', '藩镇割据', '宦官专权', '党争不断', '外族入侵'],
            correctOption: '安史之乱',
            reward: 800
        },
        {
            mapId: existingMap._id,
            stem: '“诗仙”是指哪位诗人？答对获得500文',
            options: ['李白', '杜甫', '白居易', '王维', '苏轼', '韩愈', '柳宗元'],
            correctOption: '李白',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝老百姓能吃到红薯吗？答对获得1000文',
            options: ['能', '不能'],
            correctOption: '不能',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '《静夜思》是哪位诗人的诗作？答对获得500文',
            options: ['李白', '杜甫', '白居易', '王维', '苏轼', '韩愈', '柳宗元'],
            correctOption: '李白',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝老百姓叫的"大人"是指谁？答对获得500文',
            options: ['父亲', '母亲', '官员', '老师', '长辈', '朋友'],
            correctOption: '父亲',
            reward: 500
        },
        {
            mapId: existingMap._id,
            stem: '六次东渡日本传播佛法的唐朝高僧是谁？答对获得1200文',
            options: ['鉴真', '玄奘', '义净', '法显', '慧能', '达摩'],
            correctOption: '鉴真',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '唐太宗说"以人为镜，可以明得失"，这里的"人"指的是谁？答对获得1500文',
            options: ['魏征', '房玄龄', '杜如晦', '长孙无忌', '尉迟恭', '李靖'],
            correctOption: '魏征',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '唐太宗被周边各族首领尊称为什么？答对获得1500文',
            options: ['天可汗', '真龙天子', '一代天骄', '神武大帝', '圣神皇帝', '万乘之君'],
            correctOption: '天可汗',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '现存最早有确切日期的雕版印刷品是哪一部？答对获得1200文',
            options: ['《金刚经》', '《道德经》', '《论语》', '《史记》', '《资治通鉴》', '《大藏经》'],
            correctOption: '《金刚经》',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '给唐朝统治以致命打击的农民起义是哪一次？答对获得1500文',
            options: ['黄巢起义', '陈胜吴广起义', '黄巾起义', '绿林赤眉起义', '瓦岗军起义', '李自成起义'],
            correctOption: '黄巢起义',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '907年灭掉唐朝、建立后梁的是谁？答对获得1200文',
            options: ['朱温', '李存勖', '石敬瑭', '郭威', '赵匡胤', '李克用'],
            correctOption: '朱温',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '唐朝时期，海上丝绸之路的起点港口是哪座城市？答对获得1200文',
            options: ['广州', '泉州', '宁波', '扬州', '登州', '杭州'],
            correctOption: '广州',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '唐朝三省六部制中，负责起草皇帝诏令的是哪一省？答对获得1500文',
            options: ['中书省', '门下省', '尚书省', '秘书省', '内侍省', '枢密院'],
            correctOption: '中书省',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '被后世尊称为"画圣"的唐朝画家是谁？答对获得1200文',
            options: ['吴道子', '阎立本', '张萱', '周昉', '顾恺之', '韩干'],
            correctOption: '吴道子',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '编写《千金方》的唐朝医学家是谁？答对获得1200文',
            options: ['孙思邈', '张仲景', '华佗', '扁鹊', '李时珍', '葛洪'],
            correctOption: '孙思邈',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '唐朝在西域设立的最高军政机构叫什么？答对获得1500文',
            options: ['安西都护府', '北庭都护府', '西域都护府', '安西节度使', '河西节度使', '陇右节度使'],
            correctOption: '安西都护府',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝政府设立的管理海外贸易的机构叫什么？答对获得1500文',
            options: ['市舶司', '宣政院', '理藩院', '海关总署', '外贸局', '互市监'],
            correctOption: '市舶司',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '唐朝著名天文学家僧一行的主要成就是什么？答对获得1200文',
            options: ['测量子午线长度', '发明浑仪', '著《甘石星经》', '发现哈雷彗星', '预测日食', '编制授时历'],
            correctOption: '测量子午线长度',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '融合了印度佛教艺术和中国传统艺术的著名石窟是？答对获得1200文',
            options: ['莫高窟', '云冈石窟', '龙门石窟', '大足石刻', '乐山大佛', '麦积山石窟'],
            correctOption: '莫高窟',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '"大漠孤烟直，长河落日圆"出自哪位诗人？答对获得1200文',
            options: ['王维', '李白', '杜甫', '白居易', '高适', '岑参'],
            correctOption: '王维',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '"国破山河在，城春草木深"出自哪位诗人？答对获得1500文',
            options: ['杜甫', '李白', '白居易', '王维', '李商隐', '杜牧'],
            correctOption: '杜甫',
            reward: 1500
        },
        {
            mapId: existingMap._id,
            stem: '"葡萄美酒夜光杯，欲饮琵琶马上催"出自哪位诗人？答对获得1200文',
            options: ['王翰', '李白', '王维', '岑参', '高适', '王昌龄'],
            correctOption: '王翰',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '"海内存知己，天涯若比邻"出自哪位诗人？答对获得1200文',
            options: ['王勃', '李白', '杜甫', '白居易', '王维', '杨炯'],
            correctOption: '王勃',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '"秦时明月汉时关，万里长征人未还"出自哪位诗人？答对获得1200文',
            options: ['王昌龄', '李白', '杜甫', '王维', '岑参', '高适'],
            correctOption: '王昌龄',
            reward: 1200
        },
        {
            mapId: existingMap._id,
            stem: '"春蚕到死丝方尽，蜡炬成灰泪始干"出自哪位诗人？答对获得1500文',
            options: ['李商隐', '杜牧', '温庭筠', '元稹', '白居易', '刘禹锡'],
            correctOption: '李商隐',
            reward: 1500
        }

    ];

    const existingQuestions = await Question.deleteMany({mapId: existingMap._id});
    if(existingQuestions && existingQuestions.deletedCount>0){
        console.log(`已删除 ${existingQuestions.deletedCount} 条问题.`);
    }
    // Save questions to the database
    for (const questionData of questionsData) {
      const newQuestion = new Question(questionData);
      await newQuestion.save();
    }

    console.log('Questions initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing questions:', error);
    process.exit(0);
  }
}

initQuestions();