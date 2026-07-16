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
        if(cell.type==='property' && cell.position<=10){
            cell.buildStyle={
                "lv1":{
                    "image":'@/assets/shop-lv1.svg',
                    "textStyle":{"top":"-2%","marginTop":"15%"},
                    "colorStyle":{"width":'20%',"height":'60%',"position": 'relative',"left":'20%',"top":'20%'}
                },
                "lv2":{
                    "image":'@/assets/shop.svg',
                    "textStyle":{"top":"-2%","marginTop":"11%"},
                    "colorStyle":{"width":'20%',"height":'100%',"position": 'relative',"left":'20%'}
                }
            };
            console.log("HaHaHaHa");
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