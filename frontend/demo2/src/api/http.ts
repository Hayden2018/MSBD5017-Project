import { httpService } from "./tools";

export function register(data: any) {
    return httpService({
        method: 'post',
        url: '/api/register',
        data: data
    })
}



export function login(data: any) {
    return httpService({
        method: 'post',
        url: '/api/login',
        data: data
    })
}


export function logout() {
    return httpService({
        method: 'get',
        url: '/api/logout',
    })
}


export function nftView(){
    return httpService({
        method: 'get',
        url: '/api/nft/view',
    })
}


export function nftTransfer(data: any){
    return httpService({
        method: 'post',
        url: '/api/nft/transfer',
        data: data
    })
}


export function nftMint(data: any){
    return httpService({
        method: 'post',
        url: '/api/nft/mint',
        data: data
    })
}