/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'
//@ts-ignore
import icons from 'v-svg-icons'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'

import 'v-calendar/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(setupCalendar, {})
app.use(createPinia())
app.use(router)

app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.component('icon', icons)
app.mount('#app')
