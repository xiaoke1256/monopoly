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

        player.hasPassedGo = player.position + steps >= game.cells.length;
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

        if (currentPlayer.hasPassedGo) {
            // 玩家经过起点，发放奖励
            return res.json({ action: 'passGo', reward: 3000 });
        }

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
        }else if(cell.type === 'property' && String(cell.owner) === String(currentPlayer.id) && cell.level < 3 ){
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
            //暂停一次
            //currentPlayer.waitingRound==undefined?1:currentPlayer.waitingRound++;

        }else if(cell.type === 'security-company'){
            //进入镖局
            console.log(`Player at index ${currentPlayerIndex} arrived at the security company.`);
        }
        game.playerStatus = 'completed';//其他情况就视为完成了业务
        await game.save();
        return res.json({ action: 'nothing', cell });
    } catch (error) {
        console.error('Error occurred after player move:', error);
        return res.status(500).json({ error: error.message });
    }  
}

const endTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    //  'arrive-cell' 表示刚到达cell还没经行相关业务处理
    if (game.playerStatus == 'arrive-cell') {
        return res.status(400).json({ message: '相关业务还没处理完' });
    }
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const payForPropertyAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    //TODO 检查 game.playerStatus
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} `);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    //TODO 检查 cell 是否是购买状态
    console.log(`currentPlayer:`,currentPlayer);
    // 从玩家账户中扣除费用
    try {
        pay(currentPlayer, null, req.body.yourSelectedMoney, req.body.otherSelectedMoney, cell.price);
    } catch (error) {
        console.error('Error during property purchase payment:', error);
        return res.status(400).json({ message: error.message });
    }

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

const cancelBuyPropertyAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    //TODO 检查 game.playerStatus
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} `);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    //TODO 检查 cell 是否是购买状态
    console.log(`currentPlayer:`,currentPlayer);

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex,forUpgrade:false });
}

const cancelUpgradePropertyAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    //TODO 检查 game.playerStatus
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} `);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];
    //TODO 检查 cell 是否是升级状态
    console.log(`currentPlayer:`,currentPlayer);

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex,forUpgrade:true });
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
    
    // 支付费用
    const data = req.body;
    console.log('Received rent payment data:', data);
    const yourSelectedMoney = data.yourSelectedMoney;
    const ownerSelectedMoney = data.otherSelectedMoney;

    try {
        pay(currentPlayer, null, yourSelectedMoney, ownerSelectedMoney, cell.upgradeCost);
    } catch (error) {
        console.error('Error during upgrade payment:', error);
        return res.status(400).json({ message: error.message });
    }

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
    
    const data = req.body;
    console.log('Received rent payment data:', data);
    const yourSelectedMoney = data.yourSelectedMoney;
    const ownerSelectedMoney = data.otherSelectedMoney;

    try {
        pay(currentPlayer, owner, yourSelectedMoney, ownerSelectedMoney, rentAmount);
    } catch (error) {
        console.error('Error during rent payment:', error);
        return res.status(400).json({ message: error.message });
    }

    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    await game.save();
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const pay = (currentPlayer, otherPlayer, yourSelectedMoney, otherSelectedMoney, payAmount) => {
    //检查两者之差是否是rentAmount?
    let yourTotal = 0;
    let otherTotal = 0;
    for (const [denomination, amount] of Object.entries(yourSelectedMoney)) {
        yourTotal += denomination.replace('cash', '') * amount;
    }
    for (const [denomination, amount] of Object.entries(otherSelectedMoney)) {
        otherTotal += denomination.replace('cash', '') * amount;
    }
    if (yourTotal - otherTotal !== payAmount) {
        console.log(`Selected money does not match pay amount. Your total: ${yourTotal}, Other total: ${otherTotal}, Pay amount: ${payAmount}`);
        throw new Error('Selected money does not match pay amount.');
    }

    //具体支付
    for (const [denomination, amount] of Object.entries(yourSelectedMoney)) {
        if(currentPlayer.money[denomination] < amount) {
            console.log(`Player does not have enough ${denomination}.`);
            throw new Error(`Player does not have enough ${denomination}.`);
        }
        currentPlayer.money[denomination] -= amount;
        if(otherPlayer){/* 为空表示对方是柜坊 */
            otherPlayer.money[denomination] += amount;
        }
    }
    for (const [denomination, amount] of Object.entries(otherSelectedMoney)) {
        if(otherPlayer) {/* 为空表示对方是柜坊 */
            if(otherPlayer.money[denomination] < amount) {
                console.log(`Player does not have enough ${denomination}.`);
                throw new Error(`Player does not have enough ${denomination}.`);
            }
            otherPlayer.money[denomination] -= amount;
        }
        currentPlayer.money[denomination] += amount;
    }
}

/**
 * 兑换
 */
const exchange = async (req, res)=>{
    const game = await queryCurrentGame(); 
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} paying rent`);  
    const currentPlayer = game.players[currentPlayerIndex];

    const data = req.body;
    const yourSelectedMoney = data.yourSelectedMoney;
    const otherSelectedMoney = data.otherSelectedMoney;

    pay(currentPlayer,null,yourSelectedMoney,otherSelectedMoney,0);
    await game.save();

    return res.json({ isSuccess: true });

}

const getPlayerStatus = async (req, res) => {
    const game = await queryCurrentGame();
    const currentPlayerIndex = game.currentPlayerIndex ;
    const currentPlayer = game.players[currentPlayerIndex];
    return res.json({ playerStatus: game.playerStatus,currentPlayerPosition: currentPlayer.position });
};

const getCurrentMessage = async (req, res) => {
    req.params.playerIndex = parseInt(req.params.playerIndex);
    const {playerIndex} = req.params;
    try {
        const game = await queryCurrentGame();  
        const currentPlayer = game.players[playerIndex];
        if(!currentPlayer){
            return res.status(404).json({ message: 'Player not found' });
        }
        if(currentPlayer.hasPassedGo){
            return res.json({ exists: true, messageType: 'passedGo', message: '路过柜坊，请领取3000文', payAmount: -3000 });
        }
        return res.json({ exists: false, messageType: 'noMessage' });
    } catch (error) {
        console.error('Error occurred while fetching current message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const payForMessage = async (req, res) => {
    req.params.playerIndex = parseInt(req.params.playerIndex);
    const {playerIndex} = req.params;
    try {
        const game = await queryCurrentGame();  
        const currentPlayer = game.players[playerIndex];
        if(!currentPlayer){
            return res.status(404).json({ message: 'Player not found' });
        }
        const ret = {};
        if(currentPlayer.hasPassedGo){

            const data = req.body;
            console.log('Received rent payment data:', data);
            const yourSelectedMoney = data.yourSelectedMoney;
            const otherSelectedMoney = data.otherSelectedMoney;

            currentPlayer.hasPassedGo = false;
            pay(currentPlayer, null, yourSelectedMoney, otherSelectedMoney, -3000); // 领取3000文
            ret.message = '领取成功';
            ret.payAmount = 3000;
            ret.action = 'endTurn';
        }else{
            return res.status(400).json({ message: 'No message to pay for' });
        }

        game.playerStatus = 'completed';
        await game.save();
        return res.json(ret);        
        
    } catch (error) {
        console.error('Error occurred while processing message payment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
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
    cancelBuyPropertyAndEndTurn,
    payForUpgradePropertyAndEndTurn,
    cancelUpgradePropertyAndEndTurn,
    payRentAndEndTurn,
    getCurrentMap,
    getMoney,
    getCurrentMessage,
    payForMessage,
    exchange
};