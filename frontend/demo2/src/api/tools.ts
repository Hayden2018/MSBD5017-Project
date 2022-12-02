import axios from 'axios';

// make axios bring cookir in the request header
axios.defaults.withCredentials = true;

// set different request target
const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5016';

const netConfig = {
    baseURL: BASE_URL,
    timeout: 20000,
    withCredentials: true
}


export function httpService(config: any) {

    // create an axios instance
    const instance = axios.create(netConfig);

    instance.interceptors.request.use((config: any) => {
        return config;
    }, (err: any) => {
        return Promise.reject(err);
    });


    instance.interceptors.response.use((res: any) => {
        console.log(res.headers['set-cookie']);
        return res;
    }, (err: any) => {
        return Promise.reject(err);
    });

    return instance(config);

}