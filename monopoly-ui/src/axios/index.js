import axios from 'axios';

const axiosInst = axios.create({ baseURL: '/api' })

const getToken = ()=>{
    return localStorage.getItem('token');
}

axiosInst.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInst;