# Plan: Chains of Glory — Frontend funcional

## Context

Construir un frontend React funcional para el RPG "Chains of Glory" que conecte con las 34 rutas del backend (Laravel en localhost:8000). El objetivo es un cliente **funcional** para probar que todo funciona, sin iconos ni assets gráficos por ahora. Cada fase produce una app usable que se puede testear contra el backend.

---

## Fase 0 — Setup del entorno

**Objetivo:** Proyecto Vite funcionando con todas las dependencias configuradas.

| Slice | Descripción |
|-------|-------------|
| 0.1 | Scaffold Vite + React + TypeScript |
| 0.2 | Instalar y configurar Tailwind CSS |
| 0.3 | Instalar React Router v6, TanStack Query, Zustand |
| 0.4 | Instalar Vitest + React Testing Library + MSW |
| 0.5 | Crear `src/api/client.ts` — fetch wrapper con base URL, Bearer token, manejo de errores |
| 0.6 | Crear layout base: `<App>` con Router, QueryClientProvider, y placeholder de rutas |
| 0.7 | Actualizar CLAUDE.md sección Commands con los comandos reales |

**Entregable:** `npm run dev` arranca, `npm test` corre, página en blanco con router funcionando.

---

## Fase 1 — Autenticación

**Objetivo:** Usuario puede registrarse, hacer login, y navegar rutas protegidas.

| Slice | Descripción |
|-------|-------------|
| 1.1 | `src/types/auth.ts` — tipos para User, LoginRequest, RegisterRequest, AuthResponse |
| 1.2 | `src/api/auth.ts` — funciones register(), login(), getMe() |
| 1.3 | `src/stores/authStore.ts` — Zustand store: token en localStorage, user, isAuthenticated, logout |
| 1.4 | `src/components/layout/ProtectedRoute.tsx` — redirect a /login si no autenticado |
| 1.5 | `src/pages/RegisterPage.tsx` — formulario: username, email, password → register → redirect a dashboard |
| 1.6 | `src/pages/LoginPage.tsx` — formulario: email, password → login → redirect a dashboard |
| 1.7 | `src/pages/DashboardPage.tsx` — placeholder que muestra username y cogBalance (desde /auth/me) |
| 1.8 | `src/components/layout/Header.tsx` — navbar con username, balance COG, botón logout |
| 1.9 | Tests: register, login, redirect sin token, header muestra datos |

**Entregable:** Flujo completo register → login → dashboard protegido → logout.

---

## Fase 2 — Faucet + Balance COG

**Objetivo:** Obtener COG gratis para poder comprar cosas en fases posteriores.

| Slice | Descripción |
|-------|-------------|
| 2.1 | `src/api/faucet.ts` — función withdraw() |
| 2.2 | Botón "Get Free COG" en el dashboard, muestra estado (X/5 usos, balance actual) |
| 2.3 | Actualización reactiva del balance en el header tras withdraw |
| 2.4 | Tests: withdraw funciona, balance se actualiza, máximo 5 usos |

**Entregable:** Usuario puede obtener 2500 COG para usar en la tienda.

---

## Fase 3 — Game Data (datos estáticos)

**Objetivo:** Cargar y cachear todos los datos estáticos del juego.

| Slice | Descripción |
|-------|-------------|
| 3.1 | `src/types/gamedata.ts` — tipos para Hero, Enemy, Quest, Equipment, Potion, Material, Recipe, Chest |
| 3.2 | `src/api/gamedata.ts` — 8 funciones (heroes, enemies, quests, equipment, potions, materials, recipes, chests) |
| 3.3 | `src/hooks/useGameData.ts` — queries con staleTime: Infinity (datos que no cambian) |
| 3.4 | Tests: queries devuelven datos, cache funciona |

**Entregable:** Datos estáticos disponibles en toda la app sin re-fetch.

---

## Fase 4 — Tienda + Compras

**Objetivo:** Ver catálogo y comprar personajes, equipo e items.

| Slice | Descripción |
|-------|-------------|
| 4.1 | `src/types/store.ts` — tipos para StoreCatalog, PurchaseRequest |
| 4.2 | `src/api/store.ts` — getCatalog(), purchase() |
| 4.3 | `src/pages/StorePage.tsx` — catálogo agrupado por categoría (characters, equipment, potions, materials, recipes) |
| 4.4 | Modal/formulario de compra: cantidad, nombre del personaje (si class=0), confirmación de precio |
| 4.5 | Invalidación de queries tras compra (balance, characters, equipment, items según lo comprado) |
| 4.6 | Tests: render catálogo, compra exitosa, error saldo insuficiente |

**Entregable:** Usuario puede comprar un Barbarian y un Wooden Sword.

---

## Fase 5 — Personajes

**Objetivo:** Ver lista de personajes con stats computados, detalle individual.

| Slice | Descripción |
|-------|-------------|
| 5.1 | `src/types/character.ts` — tipos para Character (con gear[11], stats, vitality, xp, level) |
| 5.2 | `src/api/characters.ts` — list(), getById(), levelUp(), usePotion() |
| 5.3 | `src/utils/stats.ts` — funciones de cálculo de stats con Math.trunc() (para preview) |
| 5.4 | `src/utils/vitality.ts` — computeCurrentVitality(stored, lastUpdate) |
| 5.5 | `src/hooks/useVitality.ts` — hook con setInterval que actualiza vitalidad cada segundo |
| 5.6 | `src/hooks/useTimeLock.ts` — hook: secondsRemaining, isLocked |
| 5.7 | `src/pages/CharactersPage.tsx` — lista de personajes: nombre, raza, nivel, HP, ATK, vitalidad (barra), estado lock |
| 5.8 | `src/pages/CharacterDetailPage.tsx` — stats completos, barra de vitalidad en tiempo real, XP, botón level-up |
| 5.9 | Tests: lista render, vitality computation, timelock countdown, level-up |

**Entregable:** Ver personajes con stats y vitalidad en tiempo real.

---

## Fase 6 — Equipamiento + Equipar

**Objetivo:** Ver equipo, equipar/desequipar en personajes.

| Slice | Descripción |
|-------|-------------|
| 6.1 | `src/types/equipment.ts` — tipos para Equipment (slot, rarity, stats, level, timeLock) |
| 6.2 | `src/api/equipment.ts` — list(), upgrade() |
| 6.3 | `src/components/equipment/RarityBadge.tsx` — color por rareza (colores del GAME_CONCEPTS) |
| 6.4 | `src/pages/EquipmentPage.tsx` — lista de equipo con stats, rareza, slot, nivel, estado lock |
| 6.5 | UI de equipar en CharacterDetailPage: 11 slots visuales, seleccionar equipo compatible por slot |
| 6.6 | `src/api/characters.ts` — equip() (PUT gear array) |
| 6.7 | Preview de stats al equipar/desequipar (usando utils/stats.ts) |
| 6.8 | Tests: lista equipo, equipar cambia stats, slot validation, upgrade |

**Entregable:** Equipar Wooden Sword en un Barbarian y ver ATK subir.

---

## Fase 7 — Quests + Combate Clásico

**Objetivo:** Ver quests y jugarlas con auto-resolve.

| Slice | Descripción |
|-------|-------------|
| 7.1 | `src/types/quest.ts` — tipos para Quest (con dropTable, vitalityCost, difficulty levels) |
| 7.2 | `src/api/quests.ts` — list(), play() |
| 7.3 | `src/pages/QuestsPage.tsx` — lista de quests: nombre, enemigo, coste de vitalidad, dificultad |
| 7.4 | Selector de dificultad (0-4) con indicador de multiplicador de enemigo |
| 7.5 | Selector de personaje y poción (opcional) antes de jugar |
| 7.6 | Pantalla de resultado: combatPercentage, XP ganada, levelUp, chest obtenido, guaranteed drops |
| 7.7 | Invalidación post-quest: characters (vitality, xp, level), chests, items |
| 7.8 | Tests: jugar quest, resultado se muestra, personaje queda locked |

**Entregable:** Jugar quest 0 con un Barbarian, ver resultado del combate.

---

## Fase 8 — Cofres

**Objetivo:** Ver cofres pendientes y abrirlos.

| Slice | Descripción |
|-------|-------------|
| 8.1 | `src/types/chest.ts` — tipos para Chest (timeLock, percentage, questIndex) |
| 8.2 | `src/api/chests.ts` — list(), open() |
| 8.3 | `src/pages/ChestsPage.tsx` — lista de cofres con countdown de timelock |
| 8.4 | Abrir cofre: mostrar drops obtenidos (equipo, items, COG) |
| 8.5 | Invalidación post-open: equipment, items, balance |
| 8.6 | Tests: lista cofres, countdown, abrir cofre, drops |

**Entregable:** Abrir cofre de quest y ver loot.

---

## Fase 9 — Inventario

**Objetivo:** Ver pociones, materiales y recetas.

| Slice | Descripción |
|-------|-------------|
| 9.1 | `src/types/item.ts` — tipos para Potion, Material, Recipe (con tokenId) |
| 9.2 | `src/api/items.ts` — getInventory() |
| 9.3 | `src/pages/InventoryPage.tsx` — 3 tabs/secciones: pociones, materiales, recetas |
| 9.4 | Usar poción de vitalidad desde inventario (en personaje seleccionado) |
| 9.5 | Tests: render inventario, usar poción |

**Entregable:** Ver inventario agrupado por tipo.

---

## Fase 10 — Crafting

**Objetivo:** Craftear items usando recetas y materiales.

| Slice | Descripción |
|-------|-------------|
| 10.1 | `src/api/crafting.ts` — craft() |
| 10.2 | `src/pages/CraftingPage.tsx` — lista de recetas que posee el usuario |
| 10.3 | Detalle de receta: ingredientes requeridos vs disponibles, botón craft habilitado/deshabilitado |
| 10.4 | Resultado del craft: items consumidos y creados |
| 10.5 | Invalidación post-craft: items |
| 10.6 | Tests: craft exitoso, materiales insuficientes |

**Entregable:** Craftear un item si se tienen los materiales.

---

## Fase 11 — Combate Turn-Based

**Objetivo:** Combate interactivo por turnos estilo Final Fantasy.

| Slice | Descripción |
|-------|-------------|
| 11.1 | `src/types/combat.ts` — tipos para CombatState, TurnResult, CombatAction |
| 11.2 | `src/api/combat.ts` — start(), action(), auto(), status() |
| 11.3 | `src/stores/combatStore.ts` — estado del combate activo (player, enemy, round, status, log) |
| 11.4 | `src/pages/CombatPage.tsx` — arena: barras de HP player/enemy, round counter, action buttons |
| 11.5 | Barra de acciones: attack_normal, attack_heavy, attack_quick, defend, potion, flee |
| 11.6 | Selector de poción (cuando acción = potion) con pociones disponibles |
| 11.7 | Log de turnos: historial de acciones y resultados |
| 11.8 | Pantalla de resultado final: won/lost/fled/timeout con rewards |
| 11.9 | Botón auto-combat para resolver automáticamente |
| 11.10 | Reconexión: al cargar CombatPage, verificar si hay combate activo via /combat/status |
| 11.11 | Tests: start combat, submit action, auto-resolve, flee, potion use, reconnect |

**Entregable:** Combate interactivo completo contra enemigos de quests.

---

## Fase 12 — Rewards

**Objetivo:** Reclamar recompensas por nivel.

| Slice | Descripción |
|-------|-------------|
| 12.1 | `src/api/rewards.ts` — getStatus(), claim() |
| 12.2 | Sección en CharacterDetailPage: tabla de 10 niveles, cuáles están claimed, botón claim |
| 12.3 | Claim crea cofre → redirigir a cofres o abrir inline |
| 12.4 | Tests: ver estado rewards, claim exitoso |

**Entregable:** Reclamar reward de nivel 0 y abrir el cofre resultante.

---

## Resumen de fases

| Fase | Nombre | Slices | Dependencias |
|------|--------|--------|-------------|
| 0 | Setup entorno | 7 | Ninguna |
| 1 | Autenticación | 9 | Fase 0 |
| 2 | Faucet | 4 | Fase 1 |
| 3 | Game Data | 4 | Fase 0 |
| 4 | Tienda | 6 | Fases 1, 3 |
| 5 | Personajes | 9 | Fases 1, 3 |
| 6 | Equipamiento | 8 | Fases 4, 5 |
| 7 | Quests + Clásico | 8 | Fases 5, 6 |
| 8 | Cofres | 6 | Fase 7 |
| 9 | Inventario | 5 | Fase 4 |
| 10 | Crafting | 6 | Fase 9 |
| 11 | Combate Turn-Based | 11 | Fases 5, 6, 9 |
| 12 | Rewards | 4 | Fases 5, 8 |
| **Total** | | **87 slices** | |

---

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (sin componentes de UI library — HTML/Tailwind directo)
- **React Router v6** (rutas)
- **TanStack Query v5** (server state)
- **Zustand** (client state: auth, combat)
- **Vitest** + **React Testing Library** + **MSW** (testing)

## Verificación por fase

Cada fase se verifica:
1. `npm test` — todos los tests pasan (nuevos + existentes)
2. Test manual contra backend real (`php artisan serve` en CoGServer)
3. Commit al completar cada fase
