<script setup lang="ts">

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
// import required modules
import { EffectCoverflow, Pagination } from "swiper";

import { ref, reactive, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router';
import { login } from '../api/http';
// import useImgUrl from '@/utils/useImgUrl';


// log and jump function
let router = useRouter();

const jumpLogin = () => {
    router.push('/login');
    console.log('jump to login page');
}

// let allCookies = inject('$cookies');
let logform = {
    username: 'Test-User',
    password: 'password'
}

const clogin = async () => {
    console.log('login');
    let res = await login(logform);
    if (res.data.code === 200) {
        router.push('/home');
    }
    else if (res.data.code === 400) {
        alert('Username or password incorrect!');
    }
}

// template picture
let getdata = ref(true)
let intromodules = [Pagination]
let nftmodules = [EffectCoverflow, Pagination];
let pagination = reactive({
    clickable: true,
    renderBullet: function (index:number, className:string) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
})



onMounted(() => {
    getdata.value = true

    for (let i = 1; i < 6; i++) {
        // imgList.push(useImgUrl('welcome', i, 'jpg'))
        // console.log(new URL(`../assets/pic/welcome/${i}.jpg`, import.meta.url).href)
        imgList.push(new URL(`../assets/pic/welcome/${i}.jpg`, import.meta.url).href)
    }
})


let imgList: Array<string> = reactive([])


let textCardList = reactive([
    {
        "header": "NFT - What",
        "description": "A unique digital assest recorded by blockchain, can be PHOTO, VIDEO, etc",
        "bg": "text-bg-primary"
    },
    {
        "header": "NFT - Why",
        "description": "Secure, No cost, High Participation, MAKE MONEY!",
        "bg": "text-bg-secondary"
    },
    {
        "header": "NFT - How",
        "description": "A wallet, An asset, Our app",
        "bg": "text-bg-success"
    },
    {
        "header": "NFT - Who",
        "description": "Anyone, but waller is unique",
        "bg": "text-bg-danger"
    },
    {
        "header": "NFT - Where",
        "description": "Anywhere by our app",
        "bg": "text-bg-warning"
    },
    {
        "header": "NFT - When",
        "description": "Anytime by our app",
        "bg": "text-bg-dark"
    }
])

</script>

<template>

    <main>

        <div class="swiper">
            <!-- Text introduction -->
            <div>
                <swiper :pagination="pagination" :modules="intromodules" class="mySwiper">
                    <swiper-slide v-for="(item, index) in textCardList">
                        <div :class="'card ' + item.bg + ' mb-3'" style="max-width: 18rem; min-width: 10rem;">
                            <div class="card-header">{{ item.header }}</div>
                            <div class="card-body text-primary">
                                <p class="card-text text-white " style="font-size:medium;">{{ item.description }}</p>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <!-- NFT picture Example -->
            <div class="swiper">
                <swiper :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'"
                    :coverflowEffect="{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }" :pagination="true" :modules="nftmodules" class="mySwiper">
                    <swiper-slide v-for="(item, index) in imgList" :key="index">
                        <img :src="item" />
                    </swiper-slide>

                </swiper>
            </div>

            <!-- Jump button -->
            <div class="cbutton">
                <button class="btn btn-warning" @click="jumpLogin">Start to Use</button>
            </div>
        </div>>

    </main>

</template>



<style scoped lang="scss">
#app {
    height: 100%
}

html,
body {
    position: relative;
    height: 100%;
}

body {
    background: #eee;
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #000;
    margin: 0;
    padding: 0;
}

.mcontent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.cbutton {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.swiper {
    width: 100%;
    height: 100%;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
}

.swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 300px;
}

.swiper-slide img {
    display: block;
    width: 100%;
}


.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    //   background: #1f2029;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.swiper-slide img {
    display: block;
    width: 80%;
    height: 80%;
    object-fit: cover;
}

.swiper-pagination-bullet {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #000;
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
}

.swiper-pagination-bullet-active {
    color: #fff;
    background: #007aff;
}
</style>