import Game from '../models/Game.js';
import Map from '../models/Map.js';

const getCurrentMap = async (req, res) => {
    try {
        const game = await queryCurrentGame();
        if (!game) {
            return res.status(404).json({ message: 'Map not found, please initialize first' });
        }
        const cells = game.cells;
        return res.json({ cells });
    } catch (error) {
        console.error('Error fetching current map:', error);
        return res.status(500).json({ error: error.message });
    }
};

const movePlayer = async (req, res ) => {
    try{
        req.params.playerIndex = parseInt(req.params.playerIndex);
        const {playerIndex} = req.params;
        if(playerIndex<0 || playerIndex>=4){
            throw new Error('Invalid player index');
        }
        console.log(`Moving player at index ${playerIndex}`);
        const { steps } = req.body;
        const game = await queryCurrentGame();
        const player = game.players[playerIndex];
        if (!player) {
            throw new Error('Player not found');
        }  
        player.position = (player.position + steps) % game.cells.length;
        game.save();
        return res.json({ newPosition: player.position });
    } catch (error) {
        console.error('Error moving player:', error);
        return res.status(500).json({ error: error.message });
    }
}

const queryCurrentGame = async ()=> {
    let game = await Game.findOne();
    if (!game) {
        game = new Game();
        const map = await Map.findOne();
        game.mapId = map._id;
        game.roomNo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        game.cells = map.cells;
        game.cells.array.forEach(cell => {
            cell.owner = null;
            cell.level = 1;
        });
        await game.save();
    }
    return game;
}

const getCurrentGame = async (req, res) => {
    try {
        const game = await queryCurrentGame();
        return res.json({ game });
    } catch (error) {
        console.error('Error fetching current game:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getCurrentDice = async(req, res)=> {
    const game = await queryCurrentGame();
    if(game){
        return res.json({ dice:game.currentDice });
    }
    return res.status(404).json({ message: 'No current game found' });
}

const dice = async (req, res)=>{
    const diceResult=Math.ceil(Math.random()*6);
    const game = await queryCurrentGame();
    if(game){
        game.currentDice = diceResult;
        game.playerStatus = 'arrive-cell';
        await game.save();
    }
    return res.json({ dice:diceResult });
}

const getMoney = async (req, res) => {
    req.params.playerIndex = parseInt(req.params.playerIndex);
    const {playerIndex} = req.params;
    try {
        const game = await queryCurrentGame();  
        const money = game.players[playerIndex].money || {};
        return res.json({ money });
    } catch (error) {
        console.error('Error fetching player money:', error);
        return res.status(500).json({ error: error.message });
    }
}

const onArrived = async (req, res) => {
    try {
        const game = await queryCurrentGame(); 
        const currentPlayerIndex = game.currentPlayerIndex ;
        console.log(`Player at index ${currentPlayerIndex} `);  
        const currentPlayer = game.players[currentPlayerIndex];
        const cell = game.cells[currentPlayer.position];
        if(cell.type === 'property' && cell.owner === null){
            //询问是否需要购买地产
            console.log(`Player at index ${currentPlayerIndex} arrived at an unowned property.`);
            return res.json({ action: 'buyProperty', cell });
        }else if(cell.type === 'property' && cell.owner !== null && String(cell.owner) !== String(currentPlayer.id)){
            //支付租金
            const owner = game.players.map((p,index) =>  ({ ...(p.toObject({ getters: true })), index }) ).find(p => String(p.id) === String(cell.owner));
            const rentAmount = cell.rent * (cell.level + 1);
            console.log('cell.owner:',cell.owner,' currentPlayer._id:',currentPlayer._id,' currentPlayer.id:',currentPlayer.id);
            console.log(`Player at index ${currentPlayerIndex} arrived at a property owned by another player.`);
            return res.json({ action: 'payRent', cell, owner , rentAmount });
        }else if(cell.type === 'property' && String(cell.owner) === String(currentPlayer.id)){
            //询问是否需要升级地产
            console.log(`Player at index ${currentPlayerIndex} arrived at their own property.`);
            return res.json({ action: 'upgradeProperty', cell });
        }else if(cell.type === 'chance'){
            //抽取机会卡
            console.log(`Player at index ${currentPlayerIndex} arrived at a chance card.`);
        }else if(cell.type === 'question'){
            //抽取问答卡
            console.log(`Player at index ${currentPlayerIndex} arrived at a question card.`);
        }else if(cell.type === 'hospital'){
            //进入医馆
            console.log(`Player at index ${currentPlayerIndex} arrived at the hospital.`);
        }else if(cell.type === 'jail'){
            //进入大理寺
            console.log(`Player at index ${currentPlayerIndex} arrived at the jail.`);
        }else if(cell.type === 'security-company'){
            //进入镖局
            console.log(`Player at index ${currentPlayerIndex} arrived at the security company.`);
        }
        return res.json({ action: 'nothing', cell });
    } catch (error) {
        console.error('Error occurred after player move:', error);
        return res.status(500).json({ error: error.message });
    }  
}

const endTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const payForPropertyAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} `);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    console.log(`currentPlayer:`,currentPlayer);
    // 从玩家账户中扣除费用
    currentPlayer.money -= cell.price;
    // 将地产的所有者设置为当前玩家
    if (cell.owner){
        console.log(`Property is already owned by another player. Cannot purchase.`);
        return res.status(400).json({ message: 'Property is already owned by another player. Cannot purchase.' });
    }
    cell.owner = currentPlayer.id;

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const payForUpgradePropertyAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} `);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    console.log(`currentPlayer:`,currentPlayer);
    if( cell.level >= 3 ){
        console.log(`Property is already at max level. Cannot upgrade.`);
        return res.status(400).json({ message: 'Property is already at max level. Cannot upgrade.' });
    }
    // 从玩家账户中扣除费用
    currentPlayer.money -= cell.upgradeCost;
    // 将地产的所有者设置为当前玩家
    if (String(cell.owner) !== String(currentPlayer.id)){
        console.log(`Property is not owned by the current player. Cannot upgrade.`);
        return res.status(400).json({ message: 'Property is not owned by the current player. Cannot upgrade.' });
    }
    cell.level++;

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const payRentAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} paying rent`);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    
    const owner = game.players.find(p => String(p.id) === String(cell.owner));
    if (!owner) {
        console.log(`Owner not found for property at position ${currentPlayer.position}`);
        return res.status(400).json({ message: 'Owner not found.' });
    }
    
    const rentAmount = cell.rent * (cell.level + 1);
    
    currentPlayer.money -= rentAmount;
    owner.money += rentAmount;

    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const getPlayerStatus = async (req, res) => {
    const game = await queryCurrentGame();
    const currentPlayerIndex = game.currentPlayerIndex ;
    const currentPlayer = game.players[currentPlayerIndex];
    return res.json({ playerStatus: game.playerStatus,currentPlayerPosition: currentPlayer.position });
};

export {
    dice,
    getCurrentGame,
    getCurrentDice,
    movePlayer,
    getPlayerStatus,
    onArrived,
    endTurn,
    payForPropertyAndEndTurn,
    payForUpgradePropertyAndEndTurn,
    payRentAndEndTurn,
    getCurrentMap,
    getMoney
};