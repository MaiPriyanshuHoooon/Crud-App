import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: '/api/v1'
});


// export default axiosClient;