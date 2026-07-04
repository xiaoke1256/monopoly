import mongoose from 'mongoose';

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
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  level: { type: Number, default: 0 }
});

const PlayerSchema = new mongoose.Schema({
  roleId: { type: Number, required: false },
  name: { type: String, required: true },
  position: { type: Number, default: 0 },
  money: { type: Number, default: 1500 }
});

const GameSchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  name: { type: String, required: true, default: 'My Monopoly Game' },
  mapId: {type: mongoose.Schema.Types.ObjectId,ref: 'Map'},
  cells: [CellSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  currentDice: { type: Number, default: null },
  players: [PlayerSchema],
});

export default mongoose.model('Game', GameSchema);