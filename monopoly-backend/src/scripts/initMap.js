import mongoose from 'mongoose';
import Map from '../models/Map.js';
import connectDB from '../config/db.js';

const defaultMapData = [
  { position: 0, type: 'go', name: '柜坊', color: null },
  { position: 1, type: 'property', name: '乐艺馆', color: 'brown', price: 60, rent: 2, upgradeCost: 50, mortgageValue: 30 },
  { position: 2, type: 'property', name: '酒肆', color: 'brown', price: 60, rent: 4, upgradeCost: 50, mortgageValue: 30 },
  { position: 3, type: 'utility', name: '观百戏', color: null },
  { position: 4, type: 'property', name: '珠宝行', color: 'light-blue', price: 100, rent: 6, upgradeCost: 50, mortgageValue: 50 },
  { position: 5, type: 'chance', name: '运气卡', color: null },
  { position: 6, type: 'property', name: '鱼行', color: 'light-blue', price: 100, rent: 6, upgradeCost: 50, buildingCost: 50, mortgageValue: 50 },
  { position: 7, type: 'property', name: '果子铺', color: 'light-blue', price: 120, rent: 8, upgradeCost: 50, buildingCost: 50, mortgageValue: 60 },
  { position: 8, type: 'property', name: '肉行', color: 'pink', price: 140, rent: 10, upgradeCost: 100, buildingCost: 100, mortgageValue: 70 },
  { position: 9, type: 'property', name: '大雁塔', color: 'pink', price: 140, rent: 10, upgradeCost: 100, buildingCost: 100, mortgageValue: 70 },
  { position: 10, type: 'hospital', name: '医馆', color: 'utility'},
  { position: 11, type: 'property', name: '胭脂铺', color: 'pink', price: 140, rent: 10, upgradeCost: 100, buildingCost: 100, mortgageValue: 70 },
  { position: 12, type: 'property', name: '华清宫', color: 'pink', price: 140, rent: 10, upgradeCost: 100, buildingCost: 100, mortgageValue: 70 },
  { position: 13, type: 'property', name:'书坊', color:'pink', price:160, rent:12, upgradeCost:100, buildingCost:100, mortgageValue:80 },
  { position: 14, type: 'utility', name: '游花灯', color: null },
  { position: 15, type: 'property', name:'香烛铺', color:'pink', price:160, rent:12, upgradeCost:100, buildingCost:100, mortgageValue:80 },
  { position: 16, type:'property', name:'杂货铺', color:'orange', price:180, rent:14, upgradeCost:100, buildingCost:100, mortgageValue:90 },
  { position: 17, type:'property', name:'成衣铺', color:'orange', price:180, rent:14, upgradeCost:100, buildingCost:100, mortgageValue:90 },
  { position: 18, type: 'question', name: '问答卡', color: null },
  { position: 19, type: 'chance', name: '运气卡', color: null },
  { position: 20, type: 'jail', name: '大理寺', color: 'utility'},
  { position: 21, type: 'property', name: '油行', color: 'orange', price: 200, rent: 16, upgradeCost: 100, buildingCost: 100, mortgageValue: 100 },
  { position: 22, type: 'property', name: '铁行', color: 'red', price: 220, rent: 18, upgradeCost: 150, buildingCost: 150, mortgageValue: 110 },
  { position: 23, type: 'property', name: '马行', color: 'red', price: 220, rent: 18, upgradeCost: 150, buildingCost: 150, mortgageValue: 110 },
  { position: 24, type: 'property', name: '芙蓉园', color: 'red', price:240, rent:20, upgradeCost:150, buildingCost:150, mortgageValue:120 },
  { position: 25, type: 'question', name: '问答卡', color: null },
  { position: 16, type: 'utility', name: '赏踏歌', color: null },
  { position: 27, type: 'property', name: '印刷行', color: 'yellow', price: 260, rent: 22, housePrice: 150, buildingCost: 150, mortgageValue: 130 },
  { position: 28, type: 'property', name: '笔行', color: 'yellow', price: 260, rent: 22, housePrice: 150, buildingCost: 150, mortgageValue: 130 },
  { position: 29, type: 'chance', name: '运气卡', color: null },
  { position: 30, type: 'security-company', name: '镖局', color: null },
  { position: 31, type: 'property', name: '琴行', color: 'green', price: 300, rent: 26, housePrice: 200, buildingCost: 200, mortgageValue: 150 },
  { position: 32, type: 'utility', name: '行祈福', color: null },
  { position: 33, type: 'property', name: '茶肆', color: 'green', price: 320, rent: 28, housePrice: 200, buildingCost: 200, mortgageValue: 160 },
  { position: 34, type: 'property', name: '绸缎庄', color: 'dark-blue', price: 350, rent: 35, housePrice: 200, buildingCost: 200, mortgageValue: 175 },
  { position: 35, type: 'property', name: '瓷器行', color: 'dark-blue', price: 400, rent: 50, housePrice: 200, buildingCost: 200, mortgageValue: 200 },
  { position: 36, type: 'property', name: '曲江池', color: 'dark-blue', price: 400, rent: 50, housePrice: 200, buildingCost: 200, mortgageValue: 200 },
  { position: 37, type: 'property', name: '包子铺', color: 'dark-blue', price: 400, rent: 50, housePrice: 200, buildingCost: 200, mortgageValue: 200 },
  { position: 38, type: 'property', name: '米行', color: 'dark-blue', price: 400, rent: 50, housePrice: 200, buildingCost: 200, mortgageValue: 200 },
  { position: 39, type: 'question', name: '问答卡', color: null },
];

const initMap = async () => {
  try {
    await connectDB();
    
    const existingMap = await Map.findOne();
    if (existingMap) {
      console.log('Map already exists, skipping initialization');
      process.exit(0);
    }
    
    const newMap = new Map({
      name: 'Standard Monopoly Board',
      cells: defaultMapData
    });
    
    await newMap.save();
    console.log('Map initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing map:', error);
    process.exit(1);
  }
};

initMap();