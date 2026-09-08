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
        }

    ];

    // Save questions to the database
    for (const questionData of questionsData) {
      const newQuestion = new Question(questionData);
      await newQuestion.save();
    }

    console.log('Questions initialized successfully!');
  } catch (error) {
    console.error('Error initializing questions:', error);
  }
}

initQuestions();