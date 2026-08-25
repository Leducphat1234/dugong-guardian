## Plan: Dugong Guardian Game

TL;DR: Build a self-contained Vietnamese browser game in the empty `web/` folder using a responsive Canvas playfield and vanilla JavaScript. The player steers a dugong with WASD/arrow keys, grazes high-nitrogen/low-fiber seagrass for score and fullness, survives hazards and fishing nets, learns conservation facts through HUD/event feedback, and sees a session leaderboard on game over. Use a real dugong/seagrass image combination where practical, with Canvas fallbacks so the game remains playable without network access.

**Steps**
1. **Structure and visual shell**: Update `index.html` with a Vietnamese game screen: title/purpose, Canvas, accessible status/HUD for score, fullness, timer and objective, start/restart controls, controls panel, conservation fact panel, and game-over/leaderboard overlay. Keep the first viewport focused on the playable game rather than a marketing page.
2. **Game model and loop**: In `scripts.js`, define a single game state for dugong position/velocity, fullness, score, elapsed time, game phase, hazards, seagrass, active net escapes, facts, and session leaderboard. Implement `requestAnimationFrame` with delta-time clamping, bounded movement, spawn/update routines, collision checks, and cleanup of off-screen entities.
3. **Player interactions**: Add keyboard listeners for WASD and arrow keys, preventing page scrolling during play. Apply smooth acceleration/friction and movement bounds. Eating seagrass increases score and fullness only when not full; quality is calculated/displayed from high nitrogen and low fiber, with higher quality awarding more points. Show a clear full-state message and prevent overfilling.
4. **Survival and hazards**: Make fullness decay over time, including the requested initial full period before decay begins. Colliding with boats or consuming/touching human waste reduces fullness; dangerous animals damage the player or end the run according to a clear health/fullness rule. Fishing nets act as persistent hazards: contact enters an escape state, movement reduces escape progress, and a randomized failure chance can end the run; expose the escape prompt/progress in the HUD.
5. **Education and presentation**: Add short Vietnamese conservation facts tied to gameplay events (seagrass ecosystem, dugong diet, fishing-net/boat risks, plastic pollution, habitat protection). Render a polished ocean scene, dugong, seagrass, boats, trash, hazards and nets with Canvas shapes/gradients/particles. Load a public/open-licensed real dugong or seagrass image for an information panel or texture where available, and provide an on-canvas/CSS fallback when it fails; avoid requiring a build tool or library.
6. **End state and ranking**: On death, freeze gameplay, record the final score in a session-only leaderboard, sort descending and cap the visible list, then show restart and return-to-instructions actions. Include the death reason and a concise conservation takeaway. Do not add backend or persistent storage in this iteration.
7. **Responsive styling and accessibility**: In `style.css`, create the visual direction with ocean teal, coral warning accents and sea-grass green, responsive Canvas sizing, compact HUD bars, readable contrast, focus-visible controls, reduced-motion support, and mobile-safe layout. Preserve keyboard access and expose live status text for score/fullness/game phase.

**Relevant files**
- `/Users/lephat/Documents/AlgoCode/web/index.html` — replace the empty body with the game shell, HUD, overlays, controls and educational content. Can add more html files for tabs.
- `/Users/lephat/Documents/AlgoCode/web/scripts.js` — own all game state, input, Canvas rendering, collisions, survival rules, facts and session leaderboard. Can divide each logic in each file.
- `/Users/lephat/Documents/AlgoCode/web/style.css` — own responsive layout, HUD, overlays, visual theme and accessibility states.

**Verification**
1. Open `web/index.html` in a browser and confirm the initial screen renders with no console errors.
2. Start a run and verify WASD and arrow keys move the dugong while the Canvas remains bounded and the page does not scroll.
3. Verify high-nitrogen/low-fiber seagrass gives more points, eating is blocked at full fullness, fullness stays full for the configured grace period, then decays, and zero fullness ends the game.
4. Exercise collisions with trash, boats, dangerous animals and fishing nets; verify fullness/damage, escape progress, failure/game-over messaging and restart behavior.
5. Reach game over twice and confirm the current session leaderboard updates and sorts correctly without surviving a page reload.
6. Test narrow and wide browser viewports plus keyboard focus; verify no clipped HUD/overlay text and that the fallback rendering still works when image loading is unavailable.

**Decisions**
- Interface and conservation text: Vietnamese.
- Visual assets: combination of a real public/open-licensed image and Canvas/CSS illustrations; runtime fallback is required.
- Ranking: session-only in memory, no `localStorage` or backend.
- Scope: first interaction is movement and grazing; future interactions such as richer missions, sound, accounts and online ranking are excluded.
- No framework, package manager, server or external game library is needed.

**Further Considerations**
1. The real image should be selected from a clearly attributable public/open-licensed source during implementation; if no reliable asset URL is available, use a local placeholder/Canvas fallback and document the source decision in the page metadata or credits.
2. The requested net-failure probability should be tuned for playability during browser testing; start moderate and adjust only if repeated runs make escape effectively impossible or trivial.