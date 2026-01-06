<template>
  <div class="game">
    <div class="score">
      Score: {{ score }}
      <span v-if="state === 'paused'"> (PAUSE)</span>
    </div>

    <div
      class="player"
      :style="{ left: player.x + 'px' }"
    ></div>

    <div
      v-for="obs in obstacles"
      :key="obs.id"
      class="obstacle"
      :style="{ left: obs.x + 'px', top: obs.y + 'px' }"
    ></div>

    <!-- PAUSE -->
    <div v-if="state === 'paused'" class="overlay">
      <h1>PAUSE</h1>
      <p>Pressione ESC para continuar</p>
    </div>

    <!-- GAME OVER -->
    <div v-if="state === 'gameOver'" class="overlay">
      <h1>GAME OVER</h1>
      <button @click="restart">Reiniciar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const WIDTH = 400
const HEIGHT = 600

const score = ref(0)
const speed = ref(6)

const state = ref('playing') 
// playing | paused | gameOver

const playerSpeed = 6

const player = ref({
  x: WIDTH / 2 - 20,
  y: HEIGHT - 60,
  width: 40,
  height: 40,
})

const obstacles = ref([])

const keys = {
  left: false,
  right: false,
}

let lastSpawn = 0
let animationId = null

/* ================= INPUT ================= */

function onKeyDown(e) {
  if (e.key === 'Escape') {
    togglePause()
    return
  }

  if (state.value !== 'playing') return

  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true
}

function onKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false
}

function togglePause() {
  if (state.value === 'playing') {
    state.value = 'paused'
    cancelAnimationFrame(animationId)
  } else if (state.value === 'paused') {
    state.value = 'playing'
    loop()
  }
}

/* ================= GAME ================= */

function updatePlayer() {
  if (keys.left) player.value.x -= playerSpeed
  if (keys.right) player.value.x += playerSpeed

  player.value.x = Math.max(
    0,
    Math.min(WIDTH - player.value.width, player.value.x)
  )
}

function spawnObstacle() {
  obstacles.value.push({
    id: Date.now() + Math.random(),
    x: Math.random() * (WIDTH - 40),
    y: -40,
    width: 40,
    height: 40,
  })
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function loop() {
  if (state.value !== 'playing') return

  updatePlayer()

  score.value++
  speed.value += 0.002

  obstacles.value.forEach(obs => {
    obs.y += speed.value

    if (checkCollision(player.value, obs)) {
      state.value = 'gameOver'
      cancelAnimationFrame(animationId)
    }
  })

  obstacles.value = obstacles.value.filter(o => o.y < HEIGHT)

  if (Date.now() - lastSpawn > 500) {
    spawnObstacle()
    lastSpawn = Date.now()
  }

  animationId = requestAnimationFrame(loop)
}

function restart() {
  obstacles.value = []
  score.value = 0
  speed.value = 6
  state.value = 'playing'
  player.value.x = WIDTH / 2 - 20
  lastSpawn = Date.now()
  loop()
}

/* ================= LIFECYCLE ================= */

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  loop()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped>
.game {
  width: 400px;
  height: 600px;
  background: linear-gradient(#111, #222);
  margin: 40px auto;
  position: relative;
  overflow: hidden;
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

.score {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-family: monospace;
  z-index: 2;
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
</style>
