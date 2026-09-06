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
        await afterDice(game);
    }
    return res.json({ dice:diceResult });
}

/* 掷骰子以后的处理 */
const afterDice = async (game)=>{
    const currentPlayerIndex = game.currentPlayerIndex;
    const currentPlayer = game.players[currentPlayerIndex];
    console.log("(currentPlayer.position+game.currentDice) % game.cells.length:",((currentPlayer.position+game.currentDice) % game.cells.length));
    const cell = game.cells[(currentPlayer.position+game.currentDice) % game.cells.length];
    console.log("cell:",cell);
    const saveEvent = async (game,event)=>{
        if(!game.events){
            game.events = [];
        }
        game.events.push(event);
        await game.save();
    }
    if (currentPlayer.position + game.currentDice >= game.cells.length) {
        const event = {actionType:'showMessage',payAmount:-3000,messageType: 'passedGo', message: '路过柜坊，请领取3000文'};
        await saveEvent(game,event)
    }
    if (currentPlayer.waitingRound>0){
        // 暂停一轮，实际情况不肯能走到这步
        const event = {actionType: 'showMessage', messageType:'waiting', message: `暂停中。剩余${currentPlayer.waitingRound-1}轮`};
        await saveEvent(game,event)
    }
    if(cell.type === 'property' && cell.owner === null){
        //询问是否需要购买地产
        console.log(`Player at index ${currentPlayerIndex} arrived at an unowned property.`);
        const event = {actionType: 'buyProperty', cellPosition:cell.position,payAmount:cell.price};
        await saveEvent(game,event)
    }else if(cell.type === 'property' && cell.owner !== null && String(cell.owner) !== String(currentPlayer.id)){
        //支付租金
        const owner = game.players.map((p,index) =>  ({ ...(p.toObject({ getters: true })), index }) ).find(p => String(p.id) === String(cell.owner));
        const rentAmount = cell.rent * (cell.level + 1);
        console.log('cell.owner:',cell.owner,' currentPlayer._id:',currentPlayer._id,' currentPlayer.id:',currentPlayer.id);
        console.log(`Player at index ${currentPlayerIndex} arrived at a property owned by another player.`);
        const event = {actionType: 'payRent', cellPosition:cell.position,payAmount:rentAmount};
        await saveEvent(game,event)
    }else if(cell.type === 'property' && String(cell.owner) === String(currentPlayer.id) && cell.level < 3 ){
        //询问是否需要升级地产
        console.log(`Player at index ${currentPlayerIndex} arrived at their own property.`);
        const event = {actionType: 'upgradeProperty', cellPosition:cell.position,payAmount:cell.upgradeCost};
        await saveEvent(game,event)
    }else if(cell.type === 'chance'){
        //抽取机会卡
        console.log(`Player at index ${currentPlayerIndex} arrived at a chance card.`);
    }else if(cell.type === 'question'){
        //抽取问答卡
        console.log(`Player at index ${currentPlayerIndex} arrived at a question card.`);
    }else if(cell.type === 'hospital'){
        //进入医馆
        console.log(`Player at index ${currentPlayerIndex} arrived at the hospital.`);
        const event = {actionType: 'showMessage', messageType:'getHospital', message:'进入医馆，请支付500文',payAmount:500 };
        await saveEvent(game,event)
    }else if(cell.type === 'jail'){
        //进入大理寺
        console.log(`Player at index ${currentPlayerIndex} arrived at the jail.`);
        //提示需要暂停一轮
        const event = {actionType: 'showMessage', messageType:'getJail',message:'来到大理寺，须暂停一轮' };
        await saveEvent(game,event)
    }else if(cell.type === 'security-company'){
        //进入镖局
        console.log(`Player at index ${currentPlayerIndex} arrived at the security company.`);
    }
    
};

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
        console.log("currentPlayer:",currentPlayer);

        if( game.events && game.events.length>0 ){
            const event = game.events[0];
            const cell = game.cells[event.cellPosition];
            console.log("event.actionType:",event.actionType);
            if( 'payRent' === event.actionType ){  
                const owner = game.players.map((p,index) =>  ({ ...(p.toObject({ getters: true })), index }) ).find(p => String(p.id) === String(cell.owner));
                return res.json({...event.toObject({ getters: true }),cell,owner,rentAmount:event.payAmount});    
            }
            return res.json({...event.toObject({ getters: true }),cell});
        }else if(currentPlayer.waitingRound>0){//需要暂停一轮
            const event = {actionType: 'showMessage', messageType:'waiting', message: `暂停中。剩余${currentPlayer.waitingRound-1}轮`};
            game.events.push(event);
            await game.save();
            const cell = game.cells[event.cellPosition];
            return res.json({...event,cell});
        } else{
            game.playerStatus = 'completed';//其他情况就视为完成了业务
            await game.save();
            return res.json({ actionType: 'nothing' });
        }

    } catch (error) {
        console.error('Error occurred after player move:', error);
        return res.status(500).json({ error: error.message });
    }  
};

const endTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    if (game.playerStatus == 'before-dice') {
        return res.status(400).json({ message: '状态错误，仅completed状态才可以调用endTurn.',playerStatus:game.playerStatus });
    }
    //  'arrive-cell' 表示刚到达cell还没经行相关业务处理
    if (game.playerStatus == 'arrive-cell') {
        return res.status(400).json({ message: '相关业务还没处理完' });
    }
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    game.events = [];
    await game.save();
    //检查切换后玩家是否处于暂停状态？
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex });
    }

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

    //检查events
    const event = game.events.shift()
    if(event.actionType !== 'buyProperty'){
        return res.status(400).json({ message: 'the actionType must be buyProperty!' });
    }

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
    game.events = [];
    await game.save();
    //检查切换后玩家是否处于暂停状态？
    const newPlayer = game.players[game.currentPlayerIndex];
    if (newPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex });
    }
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

    //检查events
    const event = game.events.shift()
    if(event.actionType !== 'buyProperty'){
        return res.status(400).json({ message: 'the actionType must be buyProperty!' });
    }

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    game.events = [];
    await game.save();
    //检查切换后玩家是否处于暂停状态？
    const newPlayer = game.players[game.currentPlayerIndex];
    if (newPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex,forUpgrade:false });
    }
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

    //检查events
    const event = game.events.shift()
    if(event.actionType !== 'upgradeProperty'){
        return res.status(400).json({ message: 'the actionType must be upgradeProperty!' });
    }

    // 结束当前玩家的回合
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.playerStatus = 'before-dice';
    game.events = [];
    await game.save();
    //检查切换后玩家是否处于暂停状态？
    const newPlayer = game.players[game.currentPlayerIndex];
    if (newPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex,forUpgrade:true });
    }
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

    //检查events
    const event = game.events.shift()
    if(event.actionType !== 'upgradeProperty'){
        return res.status(400).json({ message: 'the actionType must be upgradeProperty!' });
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
    game.events = [];
    await game.save();
    //检查切换后玩家是否处于暂停状态？
    const newPlayer = game.players[game.currentPlayerIndex];
    if (newPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex });
    }
    return res.json({ action: 'endTurn', message: 'Turn ended', currentPlayerIndex: game.currentPlayerIndex });
}

const payRentAndEndTurn = async (req, res) => {
    const game = await queryCurrentGame(); 
    const currentPlayerIndex = game.currentPlayerIndex ;
    console.log(`Player at index ${currentPlayerIndex} paying rent`);  
    const currentPlayer = game.players[currentPlayerIndex];
    const cell = game.cells[currentPlayer.position];

    
    //检查events
    const event = game.events.shift()
    if(event.actionType !== 'payRent'){
        return res.status(400).json({ message: 'the actionType must be payRent!' });
    }
    
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
    //检查切换后玩家是否处于暂停状态？
    const newPlayer = game.players[game.currentPlayerIndex];
    if (newPlayer.waitingRound>0){
        return res.json({ action: 'endTurn', message: 'Turn ended', isWaiting:true, currentPlayerIndex: game.currentPlayerIndex });
    }
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
    const isWaiting = currentPlayer.waitingRound>0
    return res.json({ playerStatus: game.playerStatus,currentPlayerPosition: currentPlayer.position, isWaiting });
};

const getCurrentMessage = async (req, res) => {
    req.params.playerIndex = parseInt(req.params.playerIndex);
    const {playerIndex} = req.params;
    const {messageType} =  req.query;
    try {
        const game = await queryCurrentGame();  
        const currentPlayer = game.players[playerIndex];
        if(!currentPlayer){
            return res.status(404).json({ message: 'Player not found' });
        }
        if(game.events.length===0){
            return res.json({ exists: false, messageType: 'noMessage' });
        }
        const event = game.events[0];
        if(event.actionType !== 'showMessage'){
            return res.json({ exists: false, messageType: 'noMessage' });
        }
        return res.json({ exists: true, ...event.toJSON() })
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

        if(game.events.length===0){
            return res.status(400).json({ message: 'No message to pay for' });
        }
        const event = game.events.shift();
        if(event.actionType !== 'showMessage'){
            return res.status(400).json({ message: 'No message to pay for' });
        }

        const data = req.body;
        console.log('Received rent payment data:', data);
        const messageType = event.messageType;

        const ret = {};
        if(messageType==='passedGo'){
            if (!currentPlayer.hasPassedGo){
                return res.status(400).json({ message: 'can not consume message by type "passedGo". hasPassedGo is false!' });
            }

            const yourSelectedMoney = data.yourSelectedMoney;
            const otherSelectedMoney = data.otherSelectedMoney;

            currentPlayer.hasPassedGo = false;
            pay(currentPlayer, null, yourSelectedMoney, otherSelectedMoney, -3000); // 领取3000文
            ret.message = '领取成功';
            ret.payAmount = -3000;
            //ret.action = 'endTurn';//领取成功后可能还有其他事件要处理。
        } else if (messageType==='getHospital') {
            const yourSelectedMoney = data.yourSelectedMoney;
            const otherSelectedMoney = data.otherSelectedMoney;

            currentPlayer.hasPassedGo = false;
            pay(currentPlayer, null, yourSelectedMoney, otherSelectedMoney, 500); // 支付500文
            ret.message = '支付成功';
            ret.payAmount = 500;
        } else{
            return res.status(400).json({ message: 'No message to pay for' });
        }

        if(game.events.length===0){
            game.playerStatus = 'completed';
        }
        await game.save();
        return res.json(ret);        
        
    } catch (error) {
        console.error('Error occurred while processing message payment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const consumeMessage = async (req, res) => {
    req.params.playerIndex = parseInt(req.params.playerIndex);
    const {playerIndex} = req.params;
    const {messageType} = req.body;
    try {
        const game = await queryCurrentGame();  
        const currentPlayer = game.players[playerIndex];
        const ret = {};
        if(!currentPlayer){
            return res.status(404).json({ message: 'Player not found' });
        }

        if(game.events.length===0){
            return res.status(400).json({ message: 'No message to pay for' });
        }
        const event = game.events.shift();
        if(event.actionType !== 'showMessage'){
            return res.status(400).json({ message: 'No message to pay for' });
        }

        if (messageType != event.messageType) {
            return res.status(400).json({ message: 'messageType not match!' });
        }

        if(messageType==='getJail'){
            console.log(' consume message at getJail ........');
            //TODO 检查当前位置是否是“大理寺”
            console.log(' before, currentPlayer.waitingRound:',currentPlayer.waitingRound);
            currentPlayer.waitingRound = (currentPlayer.waitingRound===undefined?1:(currentPlayer.waitingRound+1));
            console.log(' after, currentPlayer.waitingRound:',currentPlayer.waitingRound);
            ret.payAmount = 0;
        }else if(messageType==='waiting'){
            if(currentPlayer.waitingRound<=0){
                console.log("currentPlayer.waitingRound:",currentPlayer.waitingRound);
                return res.status(400).json({ message: 'Consume message fail.' });
            }
            currentPlayer.waitingRound--;
        }else{
            return res.status(400).json({ message: 'messageType is not valid:',messageType });
        }

        if(game.events.length===0){
            ret.action = 'endTurn';
            //处理完立即endTurn
            console.log("before game.currentPlayerIndex:",game.currentPlayerIndex);
            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
            game.playerStatus = 'before-dice';
            ret.currentPlayerIndex=game.currentPlayerIndex;
            console.log("after game.currentPlayerIndex:",game.currentPlayerIndex);
            await game.save();
            //检查切换后玩家是否处于暂停状态？
            const newPlayer = game.players[game.currentPlayerIndex];
            console.log("newPlayer.waitingRound:",newPlayer.waitingRound);
            if (newPlayer.waitingRound>0){
                ret.isWaiting=true;
            }
            return res.json(ret); 
        }else{
            //game.playerStatus = 'completed';
            await game.save();
            return res.json(ret); 
        }
    } catch (error) {
        console.error('Error occurred while consuming message:', error);
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
    consumeMessage,
    exchange
};