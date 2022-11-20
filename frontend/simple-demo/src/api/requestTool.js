import axios from 'axios'
import {networkConfig} from "./netConfig.js";
import router from "../router/routeIndex.js";
import {ElMessage} from "element-plus";

export function requestService(config) {
    const service = axios.create({
        // baseURL: process.env.VUE_APP_BASE_API,
        baseURL: networkConfig.serverUrl,
        timeout: networkConfig.requestTimeout
    })
    // request拦截器
    service.interceptors.request.use(config => {
        return config

    }, error => {
        if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout')!==-1){
            console.log('Timeout');
        }

        // ===== show error pages ====
        // const errorInfo = error.response
        // if(errorInfo){
        //     const errorStatus = errorInfo.status // 404 403 500 ...
        //     router.push({
        //         path: `/error/${errorStatus}`
        //     }
        // }
        return Promise.reject(error)
    })

    service.interceptors.response.use(res => {
            var results = {
                code: res.status,
                data: res.data,
            }
            console.log('response data is: ' + results.code)
            return res;
        },
        err => {
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        err.message = 'Request error';
                        break;

                    case 401:
                        err.message = 'Unauthorized, please login';
                        break;

                    case 403:
                        err.message = 'Forbidden, access denied';
                        break;

                    case 404:
                        err.message = `Request address error: ${err.response.config.url}`;
                        break;

                    case 408:
                        err.message = 'Request timeout';
                        break;

                    case 500:
                        err.message = 'Server internal error';
                        break;

                    case 501:
                        err.message = 'Service not implemented';
                        break;

                    case 502:
                        err.message = 'Gateway error';
                        break;

                    case 503:
                        err.message = 'Service unavailable';
                        break;

                    case 504:
                        err.message = 'Gateway timeout';
                        break;

                    case 505:
                        err.message = 'HTTP version not supported';
                        break;

                    default:
                }
            }
            ElMessage.error(`ERROR: ${err}`);
            return Promise.reject(err)
        }
    )
    return service(config)
}