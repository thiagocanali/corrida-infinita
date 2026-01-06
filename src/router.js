import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './Home.vue'
import GameV1 from './games/GameV1.vue'
import GameV2 from './games/GameV2.vue'
import GameV3 from './games/GameV3.vue'
import GameV4 from './games/GameV4.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/v1', component: GameV1 },
  { path: '/v2', component: GameV2 },
  { path: '/v3', component: GameV3 },
  { path: '/v4', component: GameV4 },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
