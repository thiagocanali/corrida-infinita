<template>
  <div
    class="game"
    :class="{ shake: shaking, flash: flashing }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- HUD -->
    <div class="hud">
      <span>Score: {{ score }} <span v-if="scoreMultiplier>1">x{{ scoreMultiplier }}</span></span>
      <span v-if="state==='paused'">PAUSE</span>
    </div>

    <!-- PLAYER -->
    <div
      class="player"
      :style="{ left: player.x + 'px' }"
    ></div>

    <!-- OBSTÁCULOS -->
    <div
      v-for="obs in obstacles"
      :key="obs.id"
      class="obstacle"
      :style="{ left: obs.x+'px', top: obs.y+'px', width: obs.width+'px' }"
    ></div>

    <!-- POWER-UPS -->
    <div
      v-for="pu in powerUps"
      :key="pu.id"
      class="powerup"
      :style="{ left: pu.x+'px', top: pu.y+'px' }"
    >{{ pu.type==='invincible'?'💎':'⭐' }}</div>

    <!-- PARTICLES -->
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{ left: p.x+'px', top: p.y+'px', opacity: p.opacity }"
    ></div>

    <!-- PAUSE -->
    <div v-if="state==='paused'" class="overlay">
      <h1>PAUSE</h1>
      <p>ESC para continuar</p>
    </div>

    <!-- GAME OVER -->
    <div v-if="state==='gameOver'" class="overlay">
      <h1>GAME OVER</h1>
      <button @click="restart">Reiniciar</button>
      <button class="secondary" @click="goHome">Menu</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/* ===== ROUTER ===== */
const router = useRouter()
function goHome(){ router.push('/') }

/* ===== CONFIG ===== */
const WIDTH = 400
const HEIGHT = 600

/* ===== PLAYER ===== */
const playerSpeed = 6
const player = ref({ x: WIDTH/2-20, y: HEIGHT-60, width: 40, height: 40 })

/* ===== STATE ===== */
const score = ref(0)
const scoreMultiplier = ref(1)
const speed = ref(6)
const state = ref('playing') // playing | paused | gameOver

/* ===== OBSTACLES ===== */
const obstacles = ref([])
let lastObstacleSpawn = 0

/* ===== POWER-UPS ===== */
const powerUps = ref([])
let lastPowerUpSpawn = 0

/* ===== PARTICLES & JUICE ===== */
const particles = ref([])
const shaking = ref(false)
const flashing = ref(false)

/* ===== AUDIO ===== */
const collisionAudio = new Audio('https://freesound.org/data/previews/256/256113_3263906-lq.mp3')
const scoreAudio = new Audio('https://freesound.org/data/previews/170/170644_2437358-lq.mp3')
const powerupAudio = new Audio('https://freesound.org/data/previews/331/331912_3248244-lq.mp3')

/* ===== INPUT ===== */
const keys = { left:false, right:false }
let touchStartX=0
const SWIPE_THRESHOLD=40

function onKeyDown(e){
  if(e.key==='Escape'){togglePause();return}
  if(state.value!=='playing') return
  if(e.key==='ArrowLeft'||e.key==='a') keys.left=true
  if(e.key==='ArrowRight'||e.key==='d') keys.right=true
}
function onKeyUp(e){
  if(e.key==='ArrowLeft'||e.key==='a') keys.left=false
  if(e.key==='ArrowRight'||e.key==='d') keys.right=false
}
function onTouchStart(e){ touchStartX=e.changedTouches[0].clientX }
function onTouchEnd(e){
  if(state.value!=='playing') return
  const deltaX=e.changedTouches[0].clientX-touchStartX
  if(Math.abs(deltaX)<SWIPE_THRESHOLD) return

  if(deltaX > 0) {
    keys.right = true
    setTimeout(() => keys.right = false, 100)
  } else {
    keys.left = true
    setTimeout(() => keys.left = false, 100)
  }
}
function togglePause(){
  if(state.value==='playing'){ state.value='paused'; cancelAnimationFrame(animationId) }
  else if(state.value==='paused'){ state.value='playing'; loop() }
}

/* ===== GAME FUNCTIONS ===== */
function updatePlayer(){
  if(keys.left) player.value.x -= playerSpeed
  if(keys.right) player.value.x += playerSpeed
  player.value.x = Math.max(0,Math.min(WIDTH-player.value.width,player.value.x))
}

function spawnObstacle(){
  const widthOptions=[30,40,50]
  const obsWidth=widthOptions[Math.floor(Math.random()*widthOptions.length)]
  // Garante espaço para o player se desviar
  let x
  do{
    x=Math.random()*(WIDTH-obsWidth)
  }while(obstacles.value.some(o=>Math.abs(o.x-x)<obsWidth))
  obstacles.value.push({ id:Date.now()+Math.random(), x, y:-40, width:obsWidth, height:40 })
}

function spawnPowerUp(){
  const types=['invincible','score']
  const type=types[Math.floor(Math.random()*types.length)]
  const x=Math.random()*(WIDTH-30)
  powerUps.value.push({ id:Date.now()+Math.random(), x, y:-40, width:30, height:30, type })
}

function checkCollision(a,b){
  return a.x<b.x+b.width &&
         a.x+a.width>b.x &&
         a.y<b.y+b.height &&
         a.y+a.height>b.y
}

function handleCollisions(){
  obstacles.value.forEach(obs=>{
    if(checkCollision(player.value,obs)){
      if(powerUps.value.some(p=>p.active && p.type==='invincible')) return
      triggerJuice()
      collisionAudio.play()
      state.value='gameOver'
      cancelAnimationFrame(animationId)
    }
  })
  powerUps.value.forEach((pu,i)=>{
    if(checkCollision(player.value,pu)){
      powerupAudio.play()
      if(pu.type==='invincible'){
        pu.active=true
        setTimeout(()=>pu.active=false,3000)
      }else if(pu.type==='score'){
        scoreMultiplier.value=2
        setTimeout(()=>scoreMultiplier.value=1,3000)
      }
      powerUps.value.splice(i,1)
    }
  })
}

function updateObstacles(){
  obstacles.value.forEach(o=>o.y+=speed.value)
  obstacles.value=obstacles.value.filter(o=>o.y<HEIGHT)
}

function updatePowerUps(){
  powerUps.value.forEach(p=>p.y+=speed.value*0.8)
  powerUps.value=powerUps.value.filter(p=>p.y<HEIGHT)
}

function spawnParticles(x=player.value.x+20,y=player.value.y+20){
  for(let i=0;i<10;i++){
    particles.value.push({
      id:Date.now()+Math.random(),
      x,y,
      vx:(Math.random()-0.5)*6,
      vy:-Math.random()*4-2,
      opacity:1
    })
  }
}

function updateParticles(){
  particles.value.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.2; p.opacity-=0.03
  })
  particles.value=particles.value.filter(p=>p.opacity>0)
}

function triggerJuice(){
  shaking.value=true; setTimeout(()=>shaking.value=false,100)
  flashing.value=true; setTimeout(()=>flashing.value=false,80)
  spawnParticles()
}

function loop(){
  if(state.value!=='playing') return

  updatePlayer()
  updateObstacles()
  updatePowerUps()
  handleCollisions()
  updateParticles()

  score.value+=scoreMultiplier.value
  speed.value+=0.002 // dificuldade aumenta gradualmente

  // Spawn obstáculo
  if(Date.now()-lastObstacleSpawn>500){
    spawnObstacle()
    lastObstacleSpawn=Date.now()
  }
  // Spawn power-up
  if(Date.now()-lastPowerUpSpawn>3000){
    spawnPowerUp()
    lastPowerUpSpawn=Date.now()
  }

  animationId=requestAnimationFrame(loop)
}

function restart(){
  obstacles.value=[]
  powerUps.value=[]
  particles.value=[]
  score.value=0
  scoreMultiplier.value=1
  speed.value=6
  state.value='playing'
  player.value.x=WIDTH/2-20
  lastObstacleSpawn=Date.now()
  lastPowerUpSpawn=Date.now()
  loop()
}

let animationId
onMounted(()=>{
  window.addEventListener('keydown',onKeyDown)
  window.addEventListener('keyup',onKeyUp)
  loop()
})
onUnmounted(()=>{
  window.removeEventListener('keydown',onKeyDown)
  window.removeEventListener('keyup',onKeyUp)
})
</script>

<style scoped>
.game{
  width:400px; height:600px;
  background:linear-gradient(#111,#222);
  margin:40px auto; position:relative; overflow:hidden;
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

.hud{
  position:absolute; top:10px; left:10px; right:10px;
  display:flex; justify-content:space-between; color:white; font-family:monospace; z-index:2;
}
.player{
  width:40px; height:40px; background:#00ffcc; position:absolute; bottom:20px; border-radius:6px;
}
.obstacle{
  height:40px; background:#ff0055; position:absolute; border-radius:6px;
}
.powerup{
  width:30px; height:30px; position:absolute; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:18px;
}
.particle{
  width:6px;height:6px;background:yellow;position:absolute;border-radius:50%;
}
.overlay{
  position:absolute; inset:0; background:rgba(0,0,0,0.85); color:white;
  display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:3;
}
button{margin-top:12px;padding:10px 20px;font-family:monospace;font-size:14px;cursor:pointer;}
button.secondary{background:transparent;color:#00ffcc;border:1px solid #00ffcc}
</style>
