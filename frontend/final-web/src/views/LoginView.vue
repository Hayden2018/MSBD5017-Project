<template>

    <main>

        <div class="container">
            <div class="row full-height justify-content-center">
                <div class="col-12 text-center align-self-center py-5">
                    <div class="section pb-5 pt-5 pt-sm-2 text-center">
                        <h6 class="mb-0 pb-3" style="color:#c4c3ca"><span>Log In </span><span>Register</span></h6>
                        <input class="lcheckbox" type="checkbox" id="reg-log" name="reg-log" />
                        <label for="reg-log"></label>

                        <!-- for login and register -->
                        <div class="card-3d-wrap mx-auto">
                            <div class="card-3d-wrapper">
                                <div class="card-front">
                                    <div class="center-wrap">
                                        <div class="section text-center">
                                            <h4 class="mb-4 pb-3" style="color:#c4c3ca">Log In</h4>
                                            <div class="form-group">
                                                <input type="name" name="logname" class="form-style"
                                                    placeholder="Username" id="logname" autocomplete="off"
                                                    v-model="logform.username">
                                                <i class="input-icon uil uil-at"></i>
                                            </div>
                                            <div class="form-group mt-2">
                                                <input type="password" name="logpass" class="form-style"
                                                    placeholder="Your Password" id="logpass" autocomplete="off"
                                                    v-model="logform.password">
                                                <i class="input-icon uil uil-lock-alt"></i>
                                            </div>
                                            <button class="mbtn mt-4" @click.prevent="loginSubmit">Log In</button>

                                            <div class="checkbox-form">
                                                <div class="answers">
                                                    <label class="item">
                                                        <span>Remember Me</span>
                                                        <input type="checkbox" name="remember" id="remember"
                                                            v-model="rememberUser" />
                                                        <span class="checkmark"></span>
                                                    </label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="card-back">
                                    <div class="center-wrap">
                                        <div class="section text-center">
                                            <h4 class="mb-4 pb-3" style="color:#c4c3ca">Sign Up</h4>
                                            <div class="form-group">
                                                <input type="text" name="regname" class="form-style"
                                                    placeholder="Username" id="regname" autocomplete="off"
                                                    v-model="regform.username">
                                                <i class="input-icon uil uil-user"></i>
                                            </div>
                                            <div class="form-group mt-2">
                                                <input type="password" name="logpass" class="form-style"
                                                    placeholder="Your Password" id="logpass" autocomplete="off"
                                                    v-model="regform.password">
                                                <i class="input-icon uil uil-lock-alt"></i>
                                            </div>
                                            <button class="mbtn pill mt-4"
                                                @click.prevent="registerName">Register</button>
                                            <button class="mbtn  mt-4" style="background-color: deepskyblue;"
                                                @click="registerToken">By Mylink</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    </main>

</template>


<script setup lang="ts">

import { useRouter } from 'vue-router';
import { ref, reactive, inject, onMounted } from 'vue';
import { login, register, cookieLogin } from '@/api/http';


let rememberUser = ref(false);

const router = useRouter();


let logform = reactive({
    username: '',
    password: ''
});

let regform = reactive({
    username: '',
    password: '',
});


const loginSubmit = async () => {
    let res = await login(logform);
    console.log(res);
    if (res.status === 200) {
        router.push('/home');
    }
    else if (res.status === 400) {
        alert('Username or password incorrect!');
    }

}

const registerName = async () => {
    let res = await register(regform);
    if (res.status === 200) {
        router.push('/home');
    }
    else if (res.status === 403) {
        alert('Username has been regitsered!');
    }
}

const registerToken = async () => {
    console.log('Not implemented yet');
}


onMounted(async () => {
    // console.log(document.cookie)
    // console.log("check cookie login");
    // let res = await cookieLogin();
    // console.log("cookieLogin", res);
    // if(res.status === 200){
    //     router.push('/home');
    // }
})

</script>

<style scoped>
@import "../assets/scss/logview.scss";
</style>  