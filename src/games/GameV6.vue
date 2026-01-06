<template>
  <div
    class="game"
    :class="{ shake: shaking, flash: flashing }"
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

    <!-- PARTÍCULAS -->
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{ left: p.x + 'px', top: p.y + 'px', opacity: p.opacity }"
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
function goHome() { router.push('/') }

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
const state = ref('playing')
const playerLane = ref(1)
const obstacles = ref([])
const particles = ref([])
let lastSpawn = 0
let animationId = null
let shaking = ref(false)
let flashing = ref(false)

/* ================= AUDIO ================= */
const collisionAudio = new Audio('https://freesound.org/data/previews/256/256113_3263906-lq.mp3')
const scoreAudio = new Audio('https://freesound.org/data/previews/170/170644_2437358-lq.mp3')

/* ================= INPUT (KEYBOARD) ================= */
function onKeyDown(e){
  if(e.key==='Escape'){togglePause(); return}
  if(state.value!=='playing') return
  if(e.key==='ArrowLeft'||e.key==='a') moveLeft()
  if(e.key==='ArrowRight'||e.key==='d') moveRight()
}
function moveLeft(){playerLane.value = Math.max(0,playerLane.value-1)}
function moveRight(){playerLane.value = Math.min(LANES-1,playerLane.value+1)}
function togglePause(){
  if(state.value==='playing'){state.value='paused'; cancelAnimationFrame(animationId)}
  else if(state.value==='paused'){state.value='playing'; loop()}
}

/* ================= INPUT (TOUCH / SWIPE) ================= */
let touchStartX = 0
const SWIPE_THRESHOLD = 40
function onTouchStart(e){touchStartX=e.changedTouches[0].clientX}
function onTouchEnd(e){
  if(state.value!=='playing') return
  const deltaX = e.changedTouches[0].clientX - touchStartX
  if(Math.abs(deltaX)<SWIPE_THRESHOLD) return
  if(deltaX>0) moveRight()
  else moveLeft()
}

/* ================= GAME ================= */
function spawnObstaclePattern(){
  const pattern = Math.floor(Math.random()*3)+1
  const lanesAvailable=[0,1,2].sort(()=>0.5-Math.random()).slice(0,pattern)
  lanesAvailable.forEach(lane=>obstacles.value.push({id:Date.now()+Math.random(),lane,y:-40}))
}

function loop(){
  if(state.value!=='playing') return
  score.value++
  if(score.value%100===0) scoreAudio.play()
  speed.value+=0.003

  obstacles.value.forEach(obs=>{
    obs.y+=speed.value
    if(obs.lane===playerLane.value && obs.y>HEIGHT-100 && obs.y<HEIGHT-20){
      triggerJuice()
      state.value='gameOver'
      cancelAnimationFrame(animationId)
    }
  })

  obstacles.value=obstacles.value.filter(o=>o.y<HEIGHT)
  if(Date.now()-lastSpawn>500){spawnObstaclePattern(); lastSpawn=Date.now()}

  updateParticles()
  animationId=requestAnimationFrame(loop)
}

function triggerJuice(){
  collisionAudio.play()
  triggerShake()
  triggerFlash()
  spawnParticles()
}

function triggerShake(){shaking.value=true; setTimeout(()=>shaking.value=false,100)}
function triggerFlash(){flashing.value=true; setTimeout(()=>flashing.value=false,80)}
function spawnParticles(){
  for(let i=0;i<10;i++){
    particles.value.push({
      id:Date.now()+Math.random(),
      x:lanes[playerLane.value]+20,
      y:HEIGHT-40,
      vx:(Math.random()-0.5)*6,
      vy:-Math.random()*4-2,
      opacity:1
    })
  }
}
function updateParticles(){
  particles.value.forEach(p=>{
    p.x+=p.vx
    p.y+=p.vy
    p.vy+=0.2
    p.opacity-=0.03
  })
  particles.value=particles.value.filter(p=>p.opacity>0)
}

function restart(){
  obstacles.value=[]
  particles.value=[]
  score.value=0
  speed.value=6
  state.value='playing'
  playerLane.value=1
  lastSpawn=Date.now()
  loop()
}

/* ================= LIFECYCLE ================= */
onMounted(()=>{window.addEventListener('keydown',onKeyDown); loop()})
onUnmounted(()=>{window.removeEventListener('keydown',onKeyDown)})
</script>

<style scoped>
.game{
  width:400px;height:600px;
  background:linear-gradient(#0a0a0a,#111);
  margin:40px auto;
  position:relative;
  overflow:hidden;
  touch-action: pan-y;
}
.game.shake{animation:shake 0.1s}
.game.flash{background:white}
@keyframes shake{
  0%{transform:translate(2px,0)}
  25%{transform:translate(-2px,0)}
  50%{transform:translate(2px,0)}
  75%{transform:translate(-2px,0)}
  100%{transform:translate(0,0)}
}

.hud{position:absolute;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;color:white;font-family:monospace;z-index:2}
.player{width:40px;height:40px;background:#00ffcc;position:absolute;bottom:20px;border-radius:6px}
.obstacle{width:40px;height:40px;background:#ff0055;position:absolute;border-radius:6px}
.particle{width:6px;height:6px;background:yellow;position:absolute;border-radius:50%}

.overlay{position:absolute;inset:0;background:rgba(0,0,0,0.85);color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:3}

button{margin-top:12px;padding:10px 20px;font-family:monospace;font-size:14px;cursor:pointer}
button.secondary{background:transparent;color:#00ffcc;border:1px solid #00ffcc}
</style>
