import { httpService } from "./tools";

// local debug server will rewrite the request url without a prefix '/api'
const REQ_URL_H = import.meta.env.PROD ? '' : '/api';

export function register(data: any) {
    return httpService({
        method: 'post',
        url: REQ_URL_H + '/register',
        data: data
    })
}



export function login(data: any) {
    return httpService({
        method: 'post',
        url: REQ_URL_H + '/login',
        data: data
    })
}

export function cookieLogin() {
    return httpService({
        method: 'post',
        url: REQ_URL_H + '/login'
    })
}


export function logout() {
    return httpService({
        method: 'get',
        url: REQ_URL_H + '/logout',
    })
}


export function nftView(){
    return httpService({
        method: 'get',
        url: REQ_URL_H + '/nft/view',
    })
}


export function nftTransfer(data: any){
    return httpService({
        method: 'post',
        url: REQ_URL_H +'/nft/transfer',
        data: data
    })
}


export function nftMint(){
    return httpService({
        method: 'get',
        url: REQ_URL_H + '/nft/mint'
    })
}

export function selfNftMint(data: any){
    return httpService({
        method: 'post',
        url: REQ_URL_H + '/nft/selfMint',
        data: data
    })
}