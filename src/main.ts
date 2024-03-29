/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'
//@ts-ignore
import icons from 'v-svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('icon', icons)
app.mount('#app')
