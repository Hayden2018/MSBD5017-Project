import axios from 'axios';

axios.defaults.withCredentials = true;

const config = {
    baseURL: 'http://localhost:5016',
    timeout: 2000,
    withCredentials: true
}


export function httpService(config: any) {

    // create an axios instance
    const instance = axios.create(config);

    instance.interceptors.request.use((config: any) => {
        return config;
    }, (err: any) => {
        return Promise.reject(err);
    });


    instance.interceptors.response.use((res: any) => {
        return res;
    }, (err: any) => {
        return Promise.reject(err);
    });

    return instance(config);

}