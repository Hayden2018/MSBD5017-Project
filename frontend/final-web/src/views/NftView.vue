<template>


<div class="card mb-3" v-for="(item ,index) in cardList" style="background-color: #15263F; color:azure">
  <img :src="item.img" class="card-img-top" alt="...">
  <div class="card-body">
    <center><h5 class="card-title">Token Id: {{item.tokenId}}</h5></center>
    <center><p class="card-text">MD5: {{item.md5}}</p></center>
  </div>
</div>

</template>


<script setup lang="ts">


import {ref,reactive,computed, readonly, onBeforeMount, onMounted} from 'vue'
import { nftView, logout } from '@/api/http';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const BASE_IMG_URL = import.meta.env.PROD? '' :"http://localhost:5017/"

let getdata = ref(false)
type Card = {
    tokenId: number;
    img: string;
    md5: string;

}
// imglist
let cardList:Array<Card> = reactive([])

// when the component is mounted, get img
onMounted( async () => {
    await getImg()
})

const getImg = async () => {
    let res = await nftView();
    // log success
    if (res.status === 200) {
        console.log("Succeed to get IMG")
        // clear whole array
        cardList.length = 0
        // get each img
        for (let i = 0; i < res.data.length; i++) {
            cardList.push({
                img: BASE_IMG_URL +  res.data[i].url.toString().split('/')[1],
                tokenId: parseInt(res.data[i].tokenId.hex,16),
                md5: res.data[i].md5
            })
        }
        console.log(cardList)
        getdata.value = true
    }
    // log error
    else if (res.status === 401) {
        alert('Invalid session token');
    }
}

</script>

<style scoped lang="scss">


</style>