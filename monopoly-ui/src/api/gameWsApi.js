import axios from '@/axios';

export const sendStartDice = async () => {
    try {
        const response = await axios.post('/game/ws/sendStartDice');
        return response.data;
    } catch (error) {
        console.error('Error send start dice msg for message:', error);
        throw error;
    }
}


