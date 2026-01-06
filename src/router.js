import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './Home.vue'
import GameV1 from './games/GameV1.vue'
import GameV2 from './games/GameV2.vue'
import GameV3 from './games/GameV3.vue'
import GameV4 from './games/GameV4.vue'
import GameV5 from './games/GameV5.vue'
import GameV6 from './games/GameV6.vue'
import GameV7 from './games/GameV7.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/v1', component: GameV1 },
  { path: '/v2', component: GameV2 },
  { path: '/v3', component: GameV3 },
  { path: '/v4', component: GameV4 },
  { path: '/v5', component: GameV5 },
  { path: '/v6', component: GameV6 },
  { path: '/v7', component: GameV7 },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
