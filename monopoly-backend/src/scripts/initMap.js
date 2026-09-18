import mongoose from 'mongoose';
import Map from '../models/Map.js';
import connectDB from '../config/db.js';



const initMap = async () => {
  try {
    const defaultMapData = [
      { position: 0, type: 'go', name: '柜坊', color: null },
      { position: 1, type: 'property', name: '乐艺馆', color: 'brown', 
        price: 3000, rent: 1200, upgradeCost: 1000, mortgageValue: 1500 ,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 2, type: 'property', name: '酒肆', color: 'brown', 
        price: 3000, rent: 1200, upgradeCost: 1000, mortgageValue: 1500 ,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 3, type: 'utility', name: '观百戏', color: null },
      { position: 4, type: 'property', name: '珠宝行', color: 'light-blue', 
        price: 4000, rent: 1500, upgradeCost: 1200, mortgageValue: 2000 ,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 5, type: 'chance', name: '运气卡', color: null },
      { position: 6, type: 'property', name: '鱼行', color: 'light-blue', 
        price: 1000, rent: 500, upgradeCost: 300, buildingCost: 1000, mortgageValue: 500,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 7, type: 'property', name: '果子铺', color: 'light-blue', 
        price: 1000, rent: 500, upgradeCost: 300, buildingCost: 1000, mortgageValue: 500 ,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 8, type: 'property', name: '肉行', color: 'pink', 
        price: 2000, rent: 800, upgradeCost: 600, buildingCost: 2000, mortgageValue: 1000,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 9, type: 'property', name: '大雁塔', color: 'pink', 
        price: 2000, rent: 1200, upgradeCost: 300, buildingCost: 1000, mortgageValue: 1600,
        buildStyle:{
          lv1:{
            image:'shop-lv1',
            textStyle:{top:"-2%",marginTop:"15%"},
            colorStyle:{width:'20%',height:'60%',position: 'relative',left:'20%',top:'20%'}
          },
          lv2:{
            image:'shop-lv2',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          },
          lv3:{
            image:'shop-lv3',
            textStyle:{top:"-2%",marginTop:"11%"},
            colorStyle:{width:'20%',height:'100%',position: 'relative',left:'20%'}
          }
        }
      },
      { position: 10, type: 'hospital', name: '医馆', color: 'utility'},
      { position: 11, type: 'property', name: '胭脂铺', color: 'pink', 
        price: 3000, rent: 1200, upgradeCost: 1000, mortgageValue: 1500 },
      { position: 12, type: 'property', name: '华清宫', color: 'pink', 
        price: 2000, rent: 1200, upgradeCost: 300, buildingCost: 2000, mortgageValue: 1600 },
      { position: 13, type: 'property', name:'书坊', color:'pink', 
        price:3000, rent:1200, upgradeCost:1000, buildingCost:3000, mortgageValue:1500 },
      { position: 14, type: 'utility', name: '游花灯', color: null },
      { position: 15, 
        type: 'property', 
        name:'香烛铺', 
        color:'pink', 
        price:3000, 
        rent:1200, 
        upgradeCost:1000, 
        buildingCost:3000, 
        mortgageValue:1500 },
      { position: 16, type:'property', name:'杂货铺', color:'orange', 
        price:2000, rent:800, upgradeCost:600, buildingCost:2000, mortgageValue:1000 },
      { position: 17, type:'property', name:'成衣铺', color:'orange', 
        price:4000, rent:1500, upgradeCost:1200, buildingCost:4000, mortgageValue:2000 },
      { position: 18, type: 'question', name: '问答卡', color: null },
      { position: 19, type: 'chance', name: '运气卡', color: null },
      { position: 20, type: 'jail', name: '大理寺', color: 'utility'},
      { position: 21, type: 'property', name: '油行', color: 'orange', 
        price: 2000, rent: 800, upgradeCost: 600, buildingCost: 2000, mortgageValue: 1000 },
      { position: 22, type: 'property', name: '铁行', color: 'red', 
        price: 2000, rent: 800, upgradeCost: 600, buildingCost: 2000, mortgageValue: 1000 },
      { position: 23, type: 'property', name: '马行', color: 'red', 
        price: 2000, rent: 800, upgradeCost: 600, buildingCost: 2000, mortgageValue: 1200 },
      { position: 24, type: 'property', name: '芙蓉园', color: 'red', 
        price:2000, rent:1200, upgradeCost:300, buildingCost:2000, mortgageValue:1600 },
      { position: 25, type: 'question', name: '问答卡', color: null },
      { position: 16, type: 'utility', name: '赏踏歌', color: null },
      { position: 27, type: 'property', name: '印刷行', color: 'yellow', 
        price: 3000, rent: 1200, upgradeCost:1000, buildingCost: 3000, mortgageValue: 1500 },
      { position: 28, type: 'property', name: '笔行', color: 'yellow', 
        price: 2000, rent: 800 ,upgradeCost:600, buildingCost: 2000, mortgageValue: 1000 },
      { position: 29, type: 'chance', name: '运气卡', color: null },
      { position: 30, type: 'security-company', name: '镖局', color: null },
      { position: 31, type: 'property', name: '琴行', color: 'green', 
        price: 3000, rent: 1200, upgradeCost: 1000, buildingCost: 3000, mortgageValue: 1500 },
      { position: 32, type: 'utility', name: '行祈福', color: null },
      { position: 33, type: 'property', name: '茶肆', color: 'green', 
        price: 2000, rent: 800,upgradeCost:600, buildingCost: 2000, mortgageValue: 1000 },
      { position: 34, type: 'property', name: '绸缎庄', color: 'dark-blue', 
        price: 4000, rent: 1500, upgradeCost:1200, buildingCost: 4000, mortgageValue: 2000 },
      { position: 35, type: 'property', name: '瓷器行', color: 'dark-blue', 
        price: 4000, rent: 1500, upgradeCost:1200, buildingCost: 4000, mortgageValue: 2000 },
      { position: 36, type: 'property', name: '曲江池', color: 'dark-blue', 
        price: 2000, rent: 1200, upgradeCost:300, mortgageValue: 1600 },
      { position: 37, type: 'property', name: '包子铺', color: 'dark-blue', 
        price: 1000, rent: 500, upgradeCost:300, buildingCost: 1000, mortgageValue: 500 },
      { position: 38, type: 'property', name: '米行', color: 'dark-blue', 
        price: 1000, rent: 500, upgradeCost:300, buildingCost: 1000, mortgageValue: 500 },
      { position: 39, type: 'question', name: '问答卡', color: null },
    ];

    defaultMapData.forEach(cell => {
        if(cell.position<=10){
            if(cell.type==='property'){
                cell.buildStyle={
                    "lv1":{
                        "image":'shop-lv1',
                        "textStyle":{"top":"-2%","marginTop":"15%"},
                        "colorStyle":{"width":'20%',"height":'60%',"position": 'relative',"left":'20%',"top":'20%'}
                    },
                    "lv2":{
                        "image":'shop-lv2',
                        "textStyle":{"top":"-2%","marginTop":"11%"},
                        "colorStyle":{"width":'20%',"height":'100%',"position": 'relative',"left":'20%'}
                    },
                    "lv3":{
                        image:'shop-lv3',
                        textStyle:{top:"-5%",marginTop:"11%"},
                        colorStyle:{borderRadius: '50% / 7%',width:'8%',height:'100%',position: 'relative',top:'-40%',left:'20.8%'}
                    }
                };
            }else if(cell.type==='utility'){
                cell.buildingImage='pray'
            }else if(cell.type==='chance'){
                cell.buildingImage='chance'
            }else if(cell.type==='question'){
                cell.buildingImage='question'
            }
        }else if (cell.position >=21 && cell.position<=30) {
            if(cell.type==='property'){
                cell.buildStyle={
                    "lv1":{
                        "image":'shop-lv1',
                        "textStyle":{"top":"-2%","marginTop":"15%"},
                        "colorStyle":{"width":'20%',"height":'60%',"position": 'relative',"left":'20%',"top":'20%'}
                    },
                    "lv2":{
                        "image":'shop-lv2',
                        "textStyle":{"top":"-2%","marginTop":"11%"},
                        "colorStyle":{"width":'20%',"height":'100%',"position": 'relative',"left":'20%'}
                    },
                    "lv3":{
                        image:'shop-lv3',
                        textStyle:{top:"-5%",marginTop:"11%"},
                        colorStyle:{borderRadius: '50% / 7%',width:'8%',height:'100%',position: 'relative',top:'-40%',left:'20.8%'}
                    }
                };
            }else if(cell.type==='utility'){
                cell.buildingImage='pray'
            }else if(cell.type==='chance'){
                cell.buildingImage='chance'
            }else if(cell.type==='question'){
                cell.buildingImage='question'
            }
        }else if (cell.position >=11 && cell.position<=20) {
            if(cell.type==='property'){
                cell.buildStyle={
                    "lv1":{
                        "image":'shop2-lv1',
                        "textStyle":{"writingMode": "vertical-rl","marginLeft":"100%","marginTop":"-3%"},
                        "colorStyle":{borderRadius: '50%' ,width:'10%',height:'14%',position: 'relative',left:'82%',top:'43%'}
                    },
                    "lv2":{
                        "image":'shop2-lv2',
                        "textStyle":{"writingMode": "vertical-rl","marginLeft":"103%","marginTop":"-5%"},
                        "colorStyle":{width:'10%',height:'36%',position: 'relative',left:'85%',top:'30%'}
                    },
                    "lv3":{
                        image:'shop2-lv3',
                        textStyle:{"writingMode": "vertical-rl","marginLeft":"110%","marginTop":"-17%"},
                        colorStyle:{borderRadius: '50% / 7%',width:'10%',height:'100%',position: 'relative',top:'-10%',left:'80%'}
                    }
                };
            }else if(cell.type==='utility'){
                cell.buildingImage='pray2'
            }else if(cell.type==='chance'){
                cell.buildingImage='chance2'
            }else if(cell.type==='question'){
                cell.buildingImage='question2'
            }
        }else if (cell.position >=31 && cell.position<=40) {
            if(cell.type==='property'){
                cell.buildStyle={
                    "lv1":{
                        "image":'shop2-lv1',
                        "textStyle":{"writingMode": "vertical-rl","marginRight":"88%","marginTop":"-3%"},
                        "colorStyle":{borderRadius: '50%' ,width:'10%',height:'14%',position: 'relative',left:'9%',top:'43%'}
                    },
                    "lv2":{
                        "image":'shop2-lv2',
                        "textStyle":{"writingMode": "vertical-rl","marginRight":"93%","marginTop":"-5%"},
                        "colorStyle":{width:'10%',height:'36%',position: 'relative',left:'4%',top:'30%'}
                    },
                    "lv3":{
                        image:'shop2-lv3',
                        "textStyle":{"writingMode": "vertical-rl","marginRight":"98%","marginTop":"-17%"},
                        colorStyle:{borderRadius: '50% / 7%',width:'10%',height:'100%',position: 'relative',top:'-10%',left:'10%'}
                    }
                };
            }else if(cell.type==='utility'){
                cell.buildingImage='pray2'
            }else if(cell.type==='chance'){
                cell.buildingImage='chance2'
            }else if(cell.type==='question'){
                cell.buildingImage='question2'
            }
        }
    });

    await connectDB();
    
    const existingMap = await Map.findOne({ name: '唐朝' });
    if (existingMap) {
      console.log('Map already exists, skipping initialization');
      process.exit(0);
    }
    
    const newMap = new Map({
      name: '唐朝',
      cells: defaultMapData,
      roles: [
        {
          name: '舞姬',
          roleId: 0,
          image: 'player1',
          color: 'limeGreen'
        },
        {
          roleId: 1,
          name: '大理寺卿',
          image: 'player2',
          color: 'lightcoral'
        }
      ]
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