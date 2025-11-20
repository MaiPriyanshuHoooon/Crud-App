import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://localhost:4500/api/v1'
});


// export default axiosClient;