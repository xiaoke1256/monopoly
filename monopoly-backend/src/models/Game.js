import mongoose from 'mongoose';

const BuildStyleSchema = new mongoose.Schema({
  image: { type: String, default: null },
  textStyle: {type:Object,default: {}},
  colorStyle: { type:Object,default: {} }
}, { _id: false });

const CellSchema = new mongoose.Schema({
  position: { type: Number, required: true, unique: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['go', 'property', 'utility', 'chance', 'question', 'hospital', 'jail', 'security-company'] 
  },
  name: { type: String, required: true },
  color: { type: String, default: null },
  price: { type: Number, default: null },/* 购买价格 */
  rent: { type: Number, default: null },/* 租金（分级别） */
  upgradeCost: { type: Number, default: null },/* 升级价格 */
  // buildingCost: { type: Number, default: null },
  mortgageValue: { type: Number, default: null },/* 抵押价 */
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  level: { type: Number, default: 0 },
  buildingImage: { type: String, required: false},
  buildStyle:{
    lv1:BuildStyleSchema,
    lv2:BuildStyleSchema,
    lv3:BuildStyleSchema
  }
});

const PlayerSchema = new mongoose.Schema({
  roleId: { type: Number, required: false },
  name: { type: String, required: true },
  position: { type: Number, default: 0 },
  money: { type: {
      cash1: { type: Number, default: 0 },
      cash20: { type: Number, default: 0 },
      cash100: { type: Number, default: 0 },
      cash200: { type: Number, default: 0 },
      cash500: { type: Number, default: 0 },
      cash1000: { type: Number, default: 0 },
      cash2000: { type: Number, default: 0 },
      cash5000: { type: Number, default: 0 },
    },
    default: {
      cash1: 0,
      cash20: 0,
      cash100: 6,
      cash200: 2,
      cash500: 2,
      cash1000: 5,
      cash2000: 4,
      cash5000: 1,
    }
  },
  /*是否要领取路过柜坊的奖励 */
  hasPassedGo: { type: Boolean, default: false },
});

const GameSchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  name: { type: String, required: true, default: 'My Monopoly Game' },
  mapId: {type: mongoose.Schema.Types.ObjectId,ref: 'Map'},
  cells: [CellSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  currentDice: { type: Number, default: null },
  currentPlayerIndex: { type: Number, default: 0 },
  playerStatus: { type: String, enum: ['before-dice', 'arrive-cell', 'completed'], default: 'before-dice' },
  players: [PlayerSchema],
});

export default mongoose.model('Game', GameSchema);