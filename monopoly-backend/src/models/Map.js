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

const MapSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Standard Monopoly' },
  cells: [CellSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Map', MapSchema);