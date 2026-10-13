import axios from '@/axios';

export const uploadLog = async ({logContent,level})=>{
    try {
        const response = await axios.post('/system/log',{
            logContent,level
        });
        return response.data;
    } catch (error) {
        console.error('Error upload log:', error);
        throw error;
    }
} 