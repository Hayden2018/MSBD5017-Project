### NPM Packages

```shell
# nodejs > 16+ for all packages
npm create vite@latest
npm init vue@latest
npm init vite@latest

# theme : https://getbootstrap.com/docs/5.2/getting-started/vite/
npm i --save bootstrap @popperjs/core
npm i --save-dev sass

# network api
npm install axios

# save cookie
# npm install vue-cookies --save

# nav ba
npm install bottom-navigation-vue

# for float button
npm i vue-float-menu

# Free icons styles
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
# for Vue 3.x
npm i --save @fortawesome/vue-fontawesome@latest-3

# swiper
npm i swiper
```

### File Structure

- `public`:  store static assets, and will not be compiled by vue
- `assets`: static assets and will be compiled as base64 -> small resources
- `main.ts`: global configuration -> api, import libs
- `d.ts`: 对非传统文件后缀声明补充，保证`ts` 识别
- `index.html`: 入口文件，使用`type`引入，`main.ts` 进行拦截处理

### Basic Config

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { normalizePath } from 'vite'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
    }
  },
  root: normalizePath(path.resolve('./')),
  server: {
    port: 5016,
    proxy : {
      '/api' :{
        target: 'http://localhost:5017',
        changeOrigin: true,
        ws: true,
        logLevel: 'debug',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: true
  },
  build:{
    outDir: '../nodejs/dist',
  }
})

```

### Run Frontend

```shell
npm run dev
```



### Build Projects

```shell
npm run build
```

### Server：

- IP： 124.223.197.77
- password: Mylink5017

### Server Deploy

- installed ： nodejs,  pm2 ,  nginx
- may run App.js  by pm2
- nginx hasn't been configured and frontend-backend seems cannot communicate on server - but work normally on local pc



