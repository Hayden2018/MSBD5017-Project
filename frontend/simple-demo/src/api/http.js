import {requestService} from './requestTool.js'


export function register(username, password) {
    const data = {
        "username": username,
        "password": password
    }
    console.log('call register method, current data is: ' + data)
    return requestService({
        url: '/register',
        method: 'post',
        data: data
    })
}


export function login(username, password) {
    const data = {
        "username": username,
        "password": password
    }

    return requestService({
        url: '/login',
        method: 'post',
        data: data
    })
}



export function logout() {
    console.log('call logout method')
    return requestService({
        url: '/logout',
        method: 'get'
    })
}