import mongoose from 'mongoose';
import Map from '../models/Map.js';
import Chance from '../models/Chance.js';
import connectDB from '../config/db.js';

const initChances = async () => {
  try {
    await connectDB();
    const existingMap = await Map.findOne({ name: '唐朝' });
    if (!existingMap) {
      console.error('Map "唐朝" not found. Please initialize the map first.');
      return;
    }

    const deletedChances = await Chance.deleteMany({mapId: existingMap._id});
    //console.log(`deletedChances:`, deletedChances);
    if(deletedChances && deletedChances.length>0){
        console.log(`已删除 ${deletedChances.length} 条机会.`);
    }

    const chanceData = [
      { title: '下下签', description: '被顾客投诉，为了维护店铺的形象赔偿顾客300文', payAmount: 300  },
      { title: '上上签', description: '在珠宝行中中奖，获得800文', payAmount: -800 },
      { title: '上上签', description: '通过摆摊赚到了1000文', payAmount: -1000 },
      { title: '上上签', description: '大唐国运昌盛，每个玩家获得${payAmount}的补贴', payAmount: 0,payFromType: 'all'},/* 800 到 1000 的随机数 */
      { title: '上上签', description: '帮忙制服失控的马匹，官府奖励200文', payAmount: -200},
      { title: '上上签', description: '大唐国运昌盛，每个玩家获得1000文', payAmount: -1000, payFromType: 'all' },
      { title: '下下签', description: '隔壁店铺着火，导致自己的店铺客源减少，损失400文', payAmount: 400 },
        { title: '下下签', description: '遭遇火灾，财产损失1000文', payAmount: 1000 },
        { title: '下下签', description: '宵禁过后仍在街上走动，罚款1000文', payAmount: 1000 },
        { title: '下下签', description: '在琴行弄断了琴弦，赔偿800文', payAmount: 800 },
        { title: '下下签', description: '被恶霸勒索保护费，损失200文', payAmount: 200 },
        { title: '上上签', description: '赢得猜灯谜比赛获得奖励150文', payAmount: -150 },
        { title: '下下签', description: '瓷器行打碎一个花瓶，赔偿1000文', payAmount: 1000 },
        { title: '下下签', description: '丢失行囊，痛失1000文', payAmount: 1000 },
        { title: '上上签', description: '在路上捡到玉佩上交官府，奖励800文', payAmount: -800 },
        { title: '上上签', description: '见义勇为抓住江洋大盗，官府奖励800文', payAmount: -800 },
        { title: '下下签', description: '在闹市里骑马狂奔，罚款1000文', payAmount: 1000 },
        { title: '上上签', description: '获得经营补助，店铺最少的玩家获得1000文', payAmount: -1000, payFromType: 'min-property' },
        { title: '上上签', description: '送迷路的老人回家，获得感谢费80文', payAmount: -80 },
        { title: '上上签', description: '诚实守信做生意，获得顾客好评，奖励1000文', payAmount: -1000 },
        { title: '下下签', description: '遭遇小偷，损失500文', payAmount: 500 },
        { title: '上上签', description: '创作诗文得到贵人赏赐获得750文', payAmount: -750 },
        { title: '上上签', description: '大唐国运昌盛，官府补助1000文', payAmount: -1000 },
        { title: '下下签', description: '征收间架税，店铺最多的玩家缴纳1500文', payAmount: 1500, payFromType: 'max-property' },
        { title: '下下签', description: '乘坐的马车没在官府备案，罚款600文', payAmount: 600 },
        { title: '下下签', description: '骑马时不小心撞到行人，赔偿220文', payAmount: 220 },
        { title: '下下签', description: '在酒肆打翻一坛酒赔偿1000文', payAmount: 1000 },
    ];

    const chances = chanceData.map(data => ({ ...data, mapId: existingMap._id }));
    const createdChances = await Chance.insertMany(chances);
    console.log(`已创建 ${createdChances.length} 条机会.`);

  } catch (error) {
    console.error('Error deleting existing chances:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

initChances();