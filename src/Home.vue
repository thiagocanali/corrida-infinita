<template>
  <div class="home">
    <h1>🏎️ Corrida Infinita</h1>
    <p>Escolha uma versão para jogar</p>

    <div class="menu">
      <router-link to="/v1">Versão 1 – Base</router-link>
      <router-link to="/v2">Versão 2 – Fast</router-link>
      <router-link to="/v3">Versão 3 – Lanes</router-link>
      <router-link to="/v4">Versão 4 – Mobile</router-link>
      <router-link to="/v5">Versão 5 – Final</router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  background: linear-gradient(#0a0a0a, #111);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: monospace;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
}

a {
  padding: 12px 24px;
  border: 2px solid #00ffcc;
  color: #00ffcc;
  text-decoration: none;
  text-align: center;
}

a:hover {
  background: #00ffcc;
  color: black;
}
</style>
