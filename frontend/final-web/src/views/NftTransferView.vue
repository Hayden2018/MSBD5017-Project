<template>


    <div class="imgList" style="overflow: visible;">
        <div class="img-item" v-for="(item, index) in cardList" :class="{ active: item.bOn }" :key="index"
            @click="cardList[index].bOn = !cardList[index].bOn">
            <img :src="item.img" alt="">
        </div>
    </div>

    <div class="mcon">
        <float-menu :position="'top left'" :dimension="50" :menu-data="items" :on-selected="handleSelection"
            :theme="toolsBtnTheme">
            <!-- tools -->
            <template #icon>
                <font-awesome-icon icon="fa-solid fa-toolbox" size='0.5x' :style="{ color: '#ffeba7' }" />
            </template>
        </float-menu>
    </div>



    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="modalRef" style="z-index=200">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Target Wallet Address</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Address</label>
                            <input type="text" class="form-control" id="recipient-name" v-model="tempAddress">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click.prevent="saveWallet">Save</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { nftView, nftTransfer } from '@/api/http';
import { ethers } from "ethers";

import { FloatMenu } from "vue-float-menu";
import "vue-float-menu/dist/vue-float-menu.css";
import { Modal } from 'bootstrap'
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* add some free styles */
import { faToolbox } from '@fortawesome/free-solid-svg-icons'
/* add each imported icon to the library */
library.add(faToolbox)


const modalRef = ref<HTMLElement | null>(null)
let modal: any;
const BASE_IMG_URL = import.meta.env.PROD? '' :"http://localhost:5017/"

const showSetTarget = () => {
    modal.show()
}


// define tools button
let items = reactive([
    {
        name: "Set Target Wallet"
    },
    {
        name: "Transfer",
    }
]
)

// theme of tools button
let toolsBtnTheme = reactive({
    primary: '#15263F',
    textColor: '#ffeba7',
    menuBgColor: '#15263F',
    textSelectedColor: '#ffeba7',
    hoverBackground: '0#1f229',
})

// click event
const handleSelection = (selectedItem:string) => {
    // if (selectedItem === items[0].name) {
    //     console.log("Show Wallet Address");
    // }
    if (selectedItem === items[0].name) {
        console.log("Set Target Wallet")
        showSetTarget()
    }
    else if (selectedItem === items[1].name) {
        makeTransfer()
    }
};



// NFT card type
type Card = {
    id: string,
    tokenId: number;
    img: string;
    md5: string;
    bOn: boolean;
}

let cardList: Array<Card> = reactive([])

// onMounter refresh NFTs
onMounted(async () => {
    if (modalRef.value) {
        modal = new Modal(modalRef.value)
    }
    await getAsset()
})

// refresh NFT list
const getAsset = async () => {
    let res = await nftView();
    if (res.status === 200) {
        console.log("Succeed to get IMG")
        cardList.length = 0
        for (let i = 0; i < res.data.length; i++) {
            cardList.push({
                id: res.data[i].tokenId,
                img: BASE_IMG_URL+ res.data[i].url.toString().split('/')[1],
                tokenId: parseInt(res.data[i].tokenId.hex,16),
                md5: res.data[i].md5,
                bOn: false
            })
        }
        console.log("call transfer: ",cardList)
    }
    else if (res.status === 401) {
        alert('Invalid session token');
    }
    else if (res.status === 401) {
        alert("Invalid session token");
    }
}


// check is valid ether wallet address
function isEtherAddress(address: string) {
    try {
        ethers.utils.getAddress(address)
    } catch (e) {
        return false
    }
    return true
}

// store address given by user
let address = ref('0x119de2C183CB2Ef9d4DB6507FD44A1D60a1980cf')
let tempAddress = ref('')
const saveWallet = () => {
    console.log("save wallet")
    if (tempAddress.value === '') {
        alert("Please input wallet address")
    }
    // else if (isEtherAddress(tempAddress.value)) {
    //     alert("Invalid wallet address")
    // }
    else {
        console.log("wallet is ok")
        address.value = tempAddress.value
        modal.hide()
    }
}

// transfer NFTs
const makeTransfer = async () => {
    // check address is legal
    if (address.value === '') {
        alert('Please enter the address you want to transfer to')
        return
    }
    // check NFTs are selected
    let selectedNFTs = cardList.filter(function (value) {
        return value.bOn === true
    })
    if (selectedNFTs.length === 0) {
        alert('Please select NFTs you want to transfer')
        return
    }

    console.log("selectedNFTs", selectedNFTs)

    // transfer NFTs
    let transition = {
        address: address.value,
        tokenId: selectedNFTs.map(function (value) {
            console.log("value", value.tokenId)
            return value.tokenId
        })
    }
    console.log("transition", transition.tokenId)
    console.log("Target address: " + transition.address, "NFTs: " + transition.tokenId)
    let res = await nftTransfer(transition);
    if (res.status === 200) {
        console.log("Succeed to transfer NFTs")
    }
    else if (res.status === 401) {
        alert('Invalid session token');
    }
}



</script>

<style lang="scss" scoped>



.imgList {
    width: 98%;
    margin: 10px 0;
    background-color: #1f2029;
    display: flex;
    flex-wrap: wrap;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    -ms-flex-pack: center;
    text-align: center;

    .active {
        display: block;
        width: 196px;
        height: 196px;
        line-height: 0;
        font-size: 0;
        vertical-align: middle;
        border: 3px solid #2b89fd;
        -webkit-transform: rotate(0deg);

    }

    .active::before {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        border: 12px solid #2b89fd;
        border-top-color: transparent;
        border-left-color: transparent;
    }

    .active::after {
        content: "";
        display: block;
        width: 5px;
        height: 10px;
        position: absolute;
        right: 4px;
        bottom: 5px;
        border: 1px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
        cursor: pointer;
    }

    .img-item {
        width: 196px;
        height: 196px;
        overflow: hidden;
        background-color: #FFFFFF;
        margin: 20px;
        position: relative;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%
        }

    }
}

// :deep(.menu-container) {
// align-items: flex-start;
//   border-radius: 4px;
//   box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 10px 2px;
//   display: flex;
//   justify-content: flex-start;
//   max-height: 600px;
//   min-height: 350px;
//   position: absolute;
//   visibility: hidden;
//   width: 250px;
//   background:#1f2029;
//   color: #1f2029;
// }

// :deep(.menu-wrapper) {
//   align-items: flex-start;
//   display: flex;
//   height: 100%;
//   justify-content: flex-start;
//   width: 100%;
//   outline: 0;
//   z-index: 9999;
//   background-color: #1f2029;
// }
</style>
