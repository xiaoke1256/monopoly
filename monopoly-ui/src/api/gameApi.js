

import axios from 'axios';

export const getPlayerMoney = async (playerIndex) => {
    try {
        const response = await axios.get(`/api/game/player/${playerIndex}/money`);
        return response.data.money;
    } catch (error) {
        console.error('Error fetching player money:', error);
        throw error;
    }
};

export const getPlayerMessage = async (playerIndex) => {
    try {
        const response = await axios.get(`/api/game/player/${playerIndex}/message`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player message:', error);
        throw error;
    }
};

export const payRent = async ({playerIndex, rentAmount,yourSelectedMoney, otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/payRent`, {
            rentAmount,
            yourSelectedMoney, 
            otherSelectedMoney
        });
        return response.data;
    } catch (error) {
        console.error('Error paying rent:', error);
        throw error;
    }
};

export const payForMessage = async ({playerIndex,yourSelectedMoney,otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/payForMessage`, {
            yourSelectedMoney,
            otherSelectedMoney
        });
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
};

export const exchange = async ({playerIndex,yourSelectedMoney,otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/exchange`, {
            yourSelectedMoney,
            otherSelectedMoney
        });
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
};

export const cancelForProperty = async ({playerIndex}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/cancelForProperty`)
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
}

export const payForProperty = async ({playerIndex,cellId,yourSelectedMoney,otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/payForProperty`, {
            cellId,
            yourSelectedMoney,
            otherSelectedMoney
        })
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
};

export const cancelUpgradeProperty = async ({playerIndex}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/cancelUpgradeProperty`)
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
}

export const payForUpgradeProperty = async ({playerIndex,cellId,yourSelectedMoney,otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/payForUpgradeProperty`, {
            cellId,
            yourSelectedMoney,
            otherSelectedMoney
        })
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
};