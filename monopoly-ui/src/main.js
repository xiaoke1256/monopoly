import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import App from './App.vue'
import router from './router'
import './assets/styles/global.scss'

const app = createApp(App)
app.use(router)
app.use(ViewUIPlus)
app.mount('#app')
