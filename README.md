🏎️ Corrida Infinita – Versões Progressivas

Descrição:
-------------
Projeto de runner infinito em Vue 3 + Vite, com evolução por versões jogáveis.
Cada versão adiciona mecânicas novas, mantendo o código limpo e modular.

Estrutura de versões:
---------------------
/v1 → Base: movimento livre, obstáculos aleatórios, pause com ESC
/v2 → Lanes: 3 pistas, player e obstáculos alinhados, pause, game over com restart e voltar ao menu
/v3 → Mobile: swipe left/right, aceleração progressiva, power-ups (em desenvolvimento)
/v4 → Final: sons, efeitos visuais, polimento completo (em desenvolvimento)

Funcionalidades principais:
----------------------------
- Pause/despause com ESC
- Loop de jogo controlado e seguro
- Sistema de lanes (V2+)
- Game Over com restart ou voltar ao menu
- Preparado para mobile e evolução futura
- Estrutura SPA com Vue Router para versionamento

Estrutura do projeto:
---------------------
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

Setup rápido:
-------------
1️⃣ Instalar dependências:
   npm install

2️⃣ Rodar localmente:
   npm run dev

3️⃣ Abrir no navegador:
   http://localhost:5173/

Como jogar:
-------------
- Teclas ← / → ou A / D para mover (V1 livre, V2+ lanes)
- ESC para pausar/despausar
- No Game Over: reiniciar ou voltar ao menu para escolher outra versão

Dicas:
-------
- /v1 → experimentar base do jogo
- /v2 → sentir o runner de lanes
- /v3 → mobile swipe (em breve)
- /v4 → versão final polida (em breve)

Portfólio / evolução:
---------------------
O projeto demonstra progressão de gameplay com versionamento visual jogável,
ótimo para portfólio indie. Cada milestone é acessível via SPA,
permitindo comparar e mostrar a evolução das mecânicas.

