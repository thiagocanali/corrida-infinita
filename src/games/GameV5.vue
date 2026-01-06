<template>
  <div
    class="game"
    :class="{ shake: shaking }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- HUD -->
    <div class="hud">
      <span>Score: {{ score }}</span>
      <span v-if="state === 'paused'">PAUSE</span>
    </div>

    <!-- PLAYER -->
    <div
      class="player"
      :style="{ left: lanes[playerLane] + 'px' }"
    ></div>

    <!-- OBSTÁCULOS -->
    <div
      v-for="obs in obstacles"
      :key="obs.id"
      class="obstacle"
      :style="{
        left: lanes[obs.lane] + 'px',
        top: obs.y + 'px'
      }"
    ></div>

    <!-- PAUSE -->
    <div v-if="state === 'paused'" class="overlay">
      <h1>PAUSE</h1>
      <p>ESC para continuar</p>
    </div>

    <!-- GAME OVER -->
    <div v-if="state === 'gameOver'" class="overlay">
      <h1>GAME OVER</h1>
      <button @click="restart">Reiniciar</button>
      <button class="secondary" @click="goHome">
        Voltar ao Menu
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/* ================= ROUTER ================= */
const router = useRouter()
function goHome() {
  router.push('/')
}

/* ================= CONFIG ================= */
const WIDTH = 400
const HEIGHT = 600
const LANES = 3
const LANE_WIDTH = WIDTH / LANES

const lanes = [
  LANE_WIDTH * 0 + LANE_WIDTH / 2 - 20,
  LANE_WIDTH * 1 + LANE_WIDTH / 2 - 20,
  LANE_WIDTH * 2 + LANE_WIDTH / 2 - 20,
]

/* ================= STATE ================= */
const score = ref(0)
const speed = ref(6)
const state = ref('playing') // playing | paused | gameOver
const playerLane = ref(1)
const obstacles = ref([])

let lastSpawn = 0
let animationId = null
let shaking = ref(false)

/* ================= INPUT (KEYBOARD) ================= */
function onKeyDown(e) {
  if (e.key === 'Escape') {
    togglePause()
    return
  }
  if (state.value !== 'playing') return
  if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft()
  if (e.key === 'ArrowRight' || e.key === 'd') moveRight()
}
function moveLeft() { playerLane.value = Math.max(0, playerLane.value - 1) }
function moveRight() { playerLane.value = Math.min(LANES - 1, playerLane.value + 1) }
function togglePause() {
  if (state.value === 'playing') { state.value = 'paused'; cancelAnimationFrame(animationId) }
  else if (state.value === 'paused') { state.value = 'playing'; loop() }
}

/* ================= INPUT (TOUCH / SWIPE) ================= */
let touchStartX = 0
const SWIPE_THRESHOLD = 40
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX }
function onTouchEnd(e) {
  if (state.value !== 'playing') return
  const deltaX = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
  if (deltaX > 0) moveRight()
  else moveLeft()
}

/* ================= GAME ================= */
function spawnObstaclePattern() {
  // padrões: simples, duplo, triplo
  const pattern = Math.floor(Math.random() * 3) + 1
  const lanesAvailable = [0,1,2].sort(() => 0.5 - Math.random()).slice(0, pattern)
  lanesAvailable.forEach(lane => {
    obstacles.value.push({ id: Date.now() + Math.random(), lane, y: -40 })
  })
}

function loop() {
  if (state.value !== 'playing') return
  score.value++
  speed.value += 0.003 // aceleração maior

  obstacles.value.forEach(obs => {
    obs.y += speed.value
    if (obs.lane === playerLane.value && obs.y > HEIGHT - 100 && obs.y < HEIGHT - 20) {
      triggerShake()
      state.value = 'gameOver'
      cancelAnimationFrame(animationId)
    }
  })

  obstacles.value = obstacles.value.filter(o => o.y < HEIGHT)
  if (Date.now() - lastSpawn > 500) { // spawn mais rápido
    spawnObstaclePattern()
    lastSpawn = Date.now()
  }
  animationId = requestAnimationFrame(loop)
}

function triggerShake() {
  shaking.value = true
  setTimeout(() => shaking.value = false, 100)
}

function restart() {
  obstacles.value = []
  score.value = 0
  speed.value = 6
  state.value = 'playing'
  playerLane.value = 1
  lastSpawn = Date.now()
  loop()
}

/* ================= LIFECYCLE ================= */
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  loop()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.game {
  width: 400px;
  height: 600px;
  background: linear-gradient(#0a0a0a, #111);
  margin: 40px auto;
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.game.shake { animation: shake 0.1s; }

@keyframes shake {
  0% { transform: translate(2px, 0) }
  25% { transform: translate(-2px,0) }
  50% { transform: translate(2px,0) }
  75% { transform: translate(-2px,0) }
  100% { transform: translate(0,0) }
}

.hud {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-family: monospace;
  z-index: 2;
}

.player {
  width: 40px;
  height: 40px;
  background: #00ffcc;
  position: absolute;
  bottom: 20px;
  border-radius: 6px;
}

.obstacle {
  width: 40px;
  height: 40px;
  background: #ff0055;
  position: absolute;
  border-radius: 6px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.85);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

button {
  margin-top: 12px;
  padding: 10px 20px;
  font-family: monospace;
  font-size: 14px;
  cursor: pointer;
}

button.secondary {
  background: transparent;
  color: #00ffcc;
  border: 1px solid #00ffcc;
}
</style>
