import axios from '@/axios';

export const register = async ({ username, password, nickname }) => {
  try {
    const response = await axios.post('/user/register', {
      username,
      password,
      nickname,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    // 返回后端的错误信息
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const login = async ({ username, password, roomNo }) => {
  try {
    const response = await axios.post('/user/login', {
      username,
      password,
      roomNo,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};
