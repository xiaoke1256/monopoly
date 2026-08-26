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
                    },
                    "lv3":{
                        image:'shop-lv3',
                        textStyle:{top:"-5%",marginTop:"11%"},
                        colorStyle:{borderRadius: '50% / 7%',width:'8%',height:'100%',position: 'relative',top:'-40%',left:'20.8%'}
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
                        "colorStyle":{width:'10%',height:'14%',position: 'relative',left:'82%',top:'43%'}
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
                        "colorStyle":{width:'10%',height:'14%',position: 'relative',left:'9%',top:'43%'}
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
    
    await existingGame.save();
    console.log('Map update successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing map:', error);
    process.exit(1);
  }
};

await updateCellStyle();