🏎️ CORRIDA INFINITA – VERSÕES PROGRESSIVAS

🎮 Descrição:
-------------
Runner infinito em Vue 3 + Vite, projetado para evolução clara por versões jogáveis.
Cada milestone adiciona mecânicas novas sem quebrar o fluxo anterior.

🚦 Versões:
----------
/v1 → Base: movimento livre, obstáculos aleatórios, pause com ESC
/v2 → Lanes: 3 pistas, player e obstáculos alinhados, pause, game over com restart e voltar ao menu
/v3 → Mobile: swipe left/right, aceleração progressiva, power-ups (em desenvolvimento)
/v4 → Final: sons, efeitos visuais, polimento completo (em desenvolvimento)

✨ Funcionalidades principais:
-------------------------------
- Pause/despause com ESC
- Loop de jogo controlado e seguro
- Sistema de lanes (V2+)
- Game Over: restart ou voltar ao menu
- Preparado para mobile
- Estrutura SPA com Vue Router para versionamento de versões

📂 Estrutura do projeto:
------------------------
src/
 ├─ games/
 │   ├─ GameV1.vue
 │   ├─ GameV2.vue
 │   ├─ GameV3.vue
 │   └─ GameV4.vue
 ├─ Home.vue          → Menu principal
 ├─ router.js
 ├─ App.vue
 ├─ main.js
 └─ style.css

⚡ Setup rápido:
----------------
1️⃣ Instalar dependências:
   npm install

2️⃣ Rodar localmente:
   npm run dev

3️⃣ Abrir no navegador:
   http://localhost:5173/

🕹️ Como jogar:
----------------
- Teclas ← / → ou A / D para mover (V1 livre, V2+ lanes)
- ESC para pausar/despausar
- No Game Over: reiniciar ou voltar ao menu para escolher outra versão

💡 Dicas:
----------
- /v1 → experimentar a base do jogo
- /v2 → sentir o runner de lanes
- /v3 → mobile swipe (em breve)
- /v4 → versão final polida (em breve)

🏆 Portfólio / Evolução:
------------------------
O projeto demonstra **progressão de gameplay com versionamento visual jogável**.
Cada milestone é acessível via SPA, permitindo:
✔ comparar versões
✔ mostrar evolução das mecânicas
✔ apresentar habilidade em arquitetura de jogo indie

