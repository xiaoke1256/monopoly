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
            options: ['刘禹锡', '杜甫', '李白', '王维', '苏轼', '韩愈', '柳宗元'],
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
            options: ['杨贵妃', '武则天', '慈禧太后', '吕雉', '孝庄文皇后', '孝惠皇后', '孝昭皇后'],
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
            options: ['蹴鞠', '踢毽子', '拔河', '跳绳', '滚铁环', '打陀螺'],
            correctOption: '蹴鞠',
            reward: 1000
        },
        {
            mapId: existingMap._id,
            stem: '玄奘西行的目的地是哪里？答对获得800文',
            options: ['天竺', '西域', '印度', '中亚', '波斯', '阿拉伯'],
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
            options: ['289年', '300年', '289年', '250年', '200年', '150年'],
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
            stem: '唐朝老百姓叫的“大人”是指谁？答对获得500文',
            options: ['父亲', '母亲', '官员', '老师', '长辈', '朋友'],
            correctOption: '父亲',
            reward: 500
        }

    ];

    const existingQuestions = await Question.find({mapId: existingMap._id});
    //console.log(`existingQuestions:`, existingQuestions);
    if(existingQuestions && existingQuestions.length>0){
        console.log(`已存在 ${existingQuestions.length} 条问题.`);
        process.exit(0);
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