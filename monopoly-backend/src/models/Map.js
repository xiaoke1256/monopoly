import mongoose from 'mongoose';

const BuildStyleSchema = new mongoose.Schema({
  image: { type: String, default: null },
  textStyle: {type:Object,default: {}},
  colorStyle: { type:Object,default: {} }
}, { _id: false });

const CellSchema = new mongoose.Schema({
  position: { type: Number, required: true },
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
  //level: { type: Number, default: 0 }
  buildingImage: { type: String, required: false},
  buildStyle:{
    lv1:BuildStyleSchema,
    lv2:BuildStyleSchema,
    lv3:BuildStyleSchema
  }
},{ _id: false });

const RoleSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  color:  { type: String, required: false },
},{ _id: false });

const MapSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Standard Monopoly' },
  cells: [CellSchema],
  createdAt: { type: Date, default: Date.now },
  roles: [RoleSchema],
  defaultMoney: { type: {
      cash1: { type: Number, default: 20 },
      cash20: { type: Number, default: 4 },
      cash100: { type: Number, default: 2 },
      cash200: { type: Number, default: 1 },
      cash500: { type: Number, default: 1 },
      cash1000: { type: Number, default: 4 },
      cash2000: { type: Number, default: 5 },
      cash5000: { type: Number, default: 1 },
    },
  }
});

export default mongoose.model('Map', MapSchema);