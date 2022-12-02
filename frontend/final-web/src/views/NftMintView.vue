<template>

    <div>
            <div class="">
                <div class="gallery width-200" :class="error?'red-border':''">
                    <Loader 
                        color="#0275d8" 
                        :active="loading" 
                        spinner="line-scale" 
                        background-color = 'rgba(255, 255, 255, .4)'
                    />
                    <div class="elements-wraper">
                        
                        <!--UPLOAD BUTTON-->
                        <div class="button-container image-margin">
                            <label for="images-upload" class="images-upload">
                                <svg
                                    class="custum-icon"
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="1em" 
                                    height="1em" 
                                    preserveAspectRatio="xMidYMid meet" 
                                    viewBox="0 0 24 24">
                                        <g fill="none">
                                            <path 
                                                d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1zm1 15a1 1 0 1 1-2 0v-3H8a1 1 0 1 1 0-2h3V8a1 1 0 1 1 2 0v3h3a1 1 0 1 1 0 2h-3v3z" 
                                                fill="currentColor"/>
                                        </g>
                                </svg>
                            </label>
                            <input @change="fileChange" id="images-upload" type="file" accept="image/*" multiple hidden>
                        </div> 
    
                        <!--IMAGES PREVIEW-->
                        <div v-for="(image, index) in media" :key="index" class="image-container image-margin">
                            <img :src="image.url" alt=""  class="images-preview">
                            <button @click="remove(index)" class="close-btn" type="button">
                                <svg 
                                    class='times-icon' 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="0.65em" 
                                    height="0.65em"
                                    preserveAspectRatio="xMidYMid meet" 
                                    viewBox="0 0 352 512">
                                        <path 
                                            d="m242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                            fill="currentColor"    
                                        />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if='error' id="media-required">
                    <p class='red-text'>{{error}}</p>
                </div>
                <div v-for="(image, index) in media" :key="index" class="m-top">
                    <input type="text" name="media[]" :value="image.name" hidden>
                </div>
    
            </div>
        </div>
    
        <div class="mcon">
            <button class="mbtn" @click="showConfirmAuto">AutoMint</button>
            <button class="mbtn" @click="showConfirmUp">UploadMint</button>/
        </div>
    
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
            ref="mintModalRef">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Confirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- <p> Your current wallet address is {{walletAddress}}</p> -->
                        <p>Confirm to Mint? </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click.prevent="judgeMint">Confirm</button>
                        <!-- <button type="button" class="btn btn-primary" @click.prevent="upMint">UP</button> -->
                    </div>
                </div>
            </div>
        </div>
    
    
    </template>
    
    <script setup lang="ts">
    import {reactive, ref, onMounted} from 'vue';
    import { nftMint,selfNftMint } from '@/api/http';
    import { Modal } from 'bootstrap'
    
    // let walletAddress = ref('0x2B92f9fB9d3C8c1f0E371f6B0f0f1216116d0859');
    let error = ref('');
    let media:Array<aMedia> = reactive([])
    let loading = ref(false);
    let formData = new FormData();
    let isAuto = ref(false);
    
    // a type for ts to recognize the media object
    type aMedia = {
        name: string,
        url: string
        size: number,
        type: string,
        f :any
    }
    
    // add new files
    const fileChange = (event:any) => {
        loading.value = true;
        let files = event.target.files;
        
        for (let i = 0; i < files.length; i++) {
            let url = URL.createObjectURL(files[i]);
            // formData.set('file-'+ i.toString(), files[i]);    
    
            media.push({
                name: files[i].name,
                url: url,
                size: files[i].size,
                type: files[i].type,
                f: files[i]
            });
        }
        
        loading.value = false;
    
    }
    
    // delete candidate imgs
    const remove= (index:number) => {
        media.splice(index, 1);
    }
    
    
    const judgeMint = () => {
        if(isAuto.value){
            sendMint();
        }
        else{
            upMint();
        }
    }
    
    
    // send minted request
    const sendMint = async () => {
        mintModal.hide()
        console.log('send mint')
        let res = await nftMint();
        if(res.status == 200){
            alert('Minted successfully');
        }else{
            alert('Error');
        }

    }
    
    const upMint = async () => {
        mintModal.hide()
        if(media.length == 0){
            error.value = 'Please upload at least one image';
            return;
        }
    
        formData = new FormData();
        media.forEach( m => {
            formData.append(m.name, m.f);
        })
        console.log("formData", formData)
        let res = await selfNftMint(formData);
        if(res.status === 200){
            alert('Minted successfully');
        }else{
            alert('Error');
        }
        error.value = '';

    }
    
    
    const mintModalRef = ref<HTMLElement | null>(null);
    let mintModal: any;
    
    const showConfirmAuto = () => {
        isAuto.value = true;
        mintModal.show();
    }
    
    const showConfirmUp = () => {
        isAuto.value = false;
        mintModal.show();
    }
    
    
    onMounted(() => {
        mintModal = new Modal(mintModalRef.value);
    })
    </script> 
    
    <style scoped>
    .image-wraper{
        min-height: 200px !important;
        
    }
    
    .gallery{
        background-color: #1f2029 !important;
        border-radius: 5px !important;
        border-style: solid !important;
        border: 1px solid #bbbbbb !important;
        height: 85px !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
        height: auto !important;
    }
    
    .images-upload {
        background-color: #1f2029 !important;
        border-radius: 5px !important;
        border: 1px dashed #ccc !important;
        display: inline-block !important;
        cursor: pointer !important;
        width: 165px !important;
        height: 88px !important;
    }
    .images-upload:hover{
        background-color: #f1f1f1 !important;
    }
    .image-container{
        display: inline-table !important;
        height: 90px !important;
        width: 140px !important;
        display: flex !important;
    }
    .images-preview {
        border-radius: 5px !important;
        border: 1px solid #ccc !important;
        display: inline-block !important;
        width: 140px !important;
        height: 88px !important;
        padding-top: -14px !important;
        transition: filter 0.1s linear;
        
    }
    .images-preview:hover{
        filter: brightness(90%);
    }
    
    .button-container{
        display: inline-flex !important;
        height: 90px !important;
        width: 140px !important;
        margin-right: 0.25rem !important;
        margin-left: 0.25rem !important;
    }
    .close-btn{
        background: none !important;
        color:white !important;
        border: none !important;
        padding: 0px !important;
        margin:0px !important;
        font: inherit !important;
        cursor: pointer !important;
        outline: inherit !important;
        position: relative !important;
        right: 34px !important;
        top: -27px !important;
        width: 0px !important;
    }
    .times-icon{
        font-size: 3rem !important;
        padding: 0px !important;
        margin:0px !important;
        filter: drop-shadow(0px 0px 1px black);
    }
    .custum-icon{
        color: #00afca !important;
        font-size: 3rem !important;
        margin-top: 18px !important;
        margin-left: 44px !important;
        
    }
    .custum-icon:hover{
        color: #29818f !important;
    }
    .close-btn:hover{
        color: red !important;
    }
    
    
    /* -------------------- */
    
    
    .width-100 {
      width: 100% !important;
    }
    .red-border {
        border: 1px solid #dc3545 !important;
        border-color: #dc3545 !important;
    }
    
    .elements-wraper {
      padding: 1rem !important;
      display: flex !important;
      flex-wrap: wrap !important;
    
    }
    .align-center {
      text-align: center !important;
    }
    .m-top-1 {
      margin-top: 0.25rem !important;
    }
    
    .image-margin {
        margin-right: 0.25rem !important;
        margin-left: 0.25rem !important;
        margin-top: 0.25rem !important;
        margin-bottom: 0.25rem !important;
    }
    .red-text {
        color: #d82335;
    }
    
    
    
    .mbtn {
        border-radius: 20px;
        height: 44px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        -webkit-transition: all 200ms linear;
        transition: all 200ms linear;
        padding: 0 30px;
        letter-spacing: 1px;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
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
        border: none;
        background-color: #ffeba7;
        color: #102770;
        box-shadow: 0 8px 24px 0 rgba(255, 235, 167, .2);
        margin-left: 10px;
        margin-right: 10px;
    }
    
    .mbtn:active,
    .mbtn:focus {
        background-color: #102770;
        color: #ffeba7;
        box-shadow: 0 8px 24px 0 rgba(16, 39, 112, .2);
    }
    
    .mbtn:hover {
        background-color: #102770;
        color: #ffeba7;
        box-shadow: 0 8px 24px 0 rgba(16, 39, 112, .2);
    }
    
    
    .mcon{
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
        margin-top: 20px;
    }
    </style>