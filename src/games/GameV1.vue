<template>
  <div class="game" @keydown="handleKey" tabindex="0" ref="gameRef">
    <div class="score">Score: {{ score }}</div>

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

    <div v-if="gameOver" class="game-over">
      <h1>GAME OVER</h1>
      <button @click="restart">Reiniciar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const WIDTH = 400
const HEIGHT = 600

const gameRef = ref(null)
const score = ref(0)
const speed = ref(4)
const gameOver = ref(false)

const player = ref({
  x: WIDTH / 2 - 20,
  y: HEIGHT - 60,
  width: 40,
  height: 40,
})

const obstacles = ref([])

let lastSpawn = 0

function handleKey(e) {
  if (gameOver.value) return

  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.value.x = Math.max(0, player.value.x - 20)
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.value.x = Math.min(WIDTH - player.value.width, player.value.x + 20)
  }
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
  if (gameOver.value) return

  score.value++
  speed.value += 0.001

  obstacles.value.forEach(obs => {
    obs.y += speed.value

    if (checkCollision(player.value, obs)) {
      gameOver.value = true
    }
  })

  obstacles.value = obstacles.value.filter(o => o.y < HEIGHT)

  if (Date.now() - lastSpawn > 700) {
    spawnObstacle()
    lastSpawn = Date.now()
  }

  requestAnimationFrame(loop)
}

function restart() {
  obstacles.value = []
  score.value = 0
  speed.value = 4
  gameOver.value = false
  player.value.x = WIDTH / 2 - 20
  lastSpawn = Date.now()
  loop()
}

onMounted(() => {
  gameRef.value.focus()
  loop()
})
</script>

<style scoped>
.game {
  width: 400px;
  height: 600px;
  background: #111;
  margin: 40px auto;
  position: relative;
  overflow: hidden;
  outline: none;
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
}

.game-over {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
