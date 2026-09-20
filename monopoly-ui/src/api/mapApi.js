import axios from '@/axios';


export const getMaps = async ()=>{
    try {
        const response = await axios.get(`/map/all`);
        console.log("response.data.maps:",response.data.maps)
        return response.data.maps;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
} 

export const getMapById = async (mapId)=>{
    try {
        const response = await axios.get(`/map/${mapId}`);
        console.log("response.data.map:",response.data.map)
        return response.data.map;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
} 
