import mongoose from 'mongoose';
import Game from '../models/Game.js';
import connectDB from '../config/db.js';


const updateCellStyle = async () => {
  try {
    await connectDB();
    
    const existingGame = await Game.findOne();
    if (!existingGame) {
        console.log('地图不存在')
        process.exit(0);
    }
    console.log("existingGame:",existingGame);
    
    existingGame.cells.forEach(cell => {
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
                    }
                };
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
                        "colorStyle":{width:'10%',height:'14%',position: 'relative',left:'82%',top:'43%'}
                    },
                    "lv2":{
                        "image":'shop2-lv2',
                        "textStyle":{"writingMode": "vertical-rl","marginLeft":"103%","marginTop":"-5%"},
                        "colorStyle":{width:'10%',height:'40%',position: 'relative',left:'85%',top:'30%'}
                    }
                };
            // }else if(cell.type==='utility'){
            //     cell.buildingImage='pray'
            // }else if(cell.type==='chance'){
            //     cell.buildingImage='chance'
            // }else if(cell.type==='question'){
            //     cell.buildingImage='question'
            }
        }
    });
    
    await existingGame.save();
    console.log('Map update successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing map:', error);
    process.exit(1);
  }
};

await updateCellStyle();