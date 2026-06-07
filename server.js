// ============================================================
// DOORS HARDCORE - SERVER NGOÀI
// npm install express && node server.js
// ============================================================

const express = require('express')
const app = express()
app.use(express.json())

let queue = []

// Game poll lệnh từ đây
app.get('/poll', (req, res) => {
    res.json({ commands: queue })
    queue = []
})

// Nhận lệnh spawn
app.post('/spawn', (req, res) => {
    const { entity } = req.body
    queue.push({ type: 'spawn', entity })
    console.log('⚡ Spawn:', entity)
    res.json({ ok: true })
})

// Nhận lệnh combo
app.post('/combo', (req, res) => {
    const { entities, delay } = req.body
    queue.push({ type: 'combo', entities, delay: delay || 0 })
    console.log('💥 Combo:', entities)
    res.json({ ok: true })
})

// ============================================================
// WEB UI
// ============================================================
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>🚪 Doors Hardcore Controller</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0f;
    color: #eee;
    font-family: 'Segoe UI', sans-serif;
    padding: 20px;
    min-height: 100vh;
  }
  h1 { color: #ff4444; font-size: 1.8em; margin-bottom: 5px; }
  .subtitle { color: #888; font-size: 0.9em; margin-bottom: 25px; }
  .section { margin-bottom: 25px; }
  .section h3 {
    font-size: 1em;
    margin-bottom: 10px;
    padding: 6px 12px;
    border-radius: 6px;
    display: inline-block;
  }
  .h-vanilla  { background: #7f1d1d; color: #fca5a5; }
  .h-speed    { background: #78350f; color: #fcd34d; }
  .h-custom   { background: #3b0764; color: #d8b4fe; }
  .h-double   { background: #1e1b4b; color: #a5b4fc; }
  .h-chaos    { background: #7f1d1d; color: #f87171; }
  .h-silent   { background: #1f2937; color: #9ca3af; }
  .h-nightmare{ background: #450a0a; color: #fca5a5; }
  .h-boss     { background: #111; color: #ef4444; border: 1px solid #ef4444; }
  .h-combo    { background: #064e3b; color: #6ee7b7; }
  .buttons { display: flex; flex-wrap: wrap; gap: 8px; }
  button {
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    transition: all 0.15s;
    min-width: 130px;
  }
  button:active { transform: scale(0.95); }
  button.ok { background: #16a34a !important; color: #fff !important; }

  .btn-vanilla  { background: #dc2626; color: #fff; }
  .btn-speed    { background: #d97706; color: #fff; }
  .btn-custom   { background: #7c3aed; color: #fff; }
  .btn-double   { background: #4338ca; color: #fff; }
  .btn-chaos    { background: #b91c1c; color: #fff; }
  .btn-silent   { background: #374151; color: #d1d5db; }
  .btn-nightmare{ background: #991b1b; color: #fecaca; }
  .btn-boss     { background: #111; color: #ef4444; border: 2px solid #ef4444; font-size:14px; }
  .btn-combo    { background: #065f46; color: #6ee7b7; }

  .log {
    margin-top: 30px;
    background: #111;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 12px;
    max-height: 180px;
    overflow-y: auto;
    font-size: 12px;
    color: #4ade80;
    font-family: monospace;
  }
  .log div { padding: 2px 0; border-bottom: 1px solid #1a1a1a; }
</style>
</head>
<body>

<h1>🚪 Doors Hardcore Controller</h1>
<p class="subtitle">Click để spawn entity vào game — sync real-time</p>

<!-- VANILLA -->
<div class="section">
  <h3 class="h-vanilla">⚡ Vanilla Nightmare</h3>
  <div class="buttons">
    <button class="btn-vanilla" onclick="spawn('Rush')">Nightmare Rush</button>
    <button class="btn-vanilla" onclick="spawn('Ambush')">Nightmare Ambush</button>
  </div>
</div>

<!-- SPEED RUSH -->
<div class="section">
  <h3 class="h-speed">🔥 Speed — Rush</h3>
  <div class="buttons">
    <button class="btn-speed" onclick="spawn('RushX2')">Rush x2 (400%)</button>
    <button class="btn-speed" onclick="spawn('RushX3')">Rush x3 (600%)</button>
    <button class="btn-speed" onclick="spawn('RushX5')">Rush x5 (1000%)</button>
    <button class="btn-speed" onclick="spawn('RushX10')">Rush x10 (2000%)</button>
  </div>
</div>

<!-- SPEED AMBUSH -->
<div class="section">
  <h3 class="h-speed">🔥 Speed — Ambush</h3>
  <div class="buttons">
    <button class="btn-speed" onclick="spawn('AmbushX2')">Ambush x2</button>
    <button class="btn-speed" onclick="spawn('AmbushX3')">Ambush x3</button>
    <button class="btn-speed" onclick="spawn('AmbushInfinite')">Ambush ∞ (20 rebound)</button>
  </div>
</div>

<!-- CUSTOM ENTITIES -->
<div class="section">
  <h3 class="h-custom">👾 Custom Entities</h3>
  <div class="buttons">
    <button class="btn-custom" onclick="spawn('Depth')">Depth</button>
    <button class="btn-custom" onclick="spawn('Trauma')">Trauma</button>
    <button class="btn-custom" onclick="spawn('Smiley')">Smiley</button>
    <button class="btn-custom" onclick="spawn('Entity200')">200</button>
    <button class="btn-custom" onclick="spawn('Baller')">Baller</button>
    <button class="btn-custom" onclick="spawn('VhsSans')">Vhs!Sans</button>
  </div>
</div>

<!-- DOUBLE -->
<div class="section">
  <h3 class="h-double">💀 Double / Combo</h3>
  <div class="buttons">
    <button class="btn-double" onclick="spawn('DoubleRush')">Double Rush</button>
    <button class="btn-double" onclick="spawn('DoubleAmbush')">Double Ambush</button>
    <button class="btn-double" onclick="spawn('RushAmbushCombo')">Rush+Ambush</button>
  </div>
</div>

<!-- CHAOS -->
<div class="section">
  <h3 class="h-chaos">💥 Chaos Mode</h3>
  <div class="buttons">
    <button class="btn-chaos" onclick="spawn('ChaosRush')">Chaos Rush</button>
    <button class="btn-chaos" onclick="spawn('ChaosAmbush')">Chaos Ambush</button>
    <button class="btn-chaos" onclick="spawn('ChaosDepth')">Chaos Depth</button>
  </div>
</div>

<!-- SILENT -->
<div class="section">
  <h3 class="h-silent">🤫 Silent (không báo đèn)</h3>
  <div class="buttons">
    <button class="btn-silent" onclick="spawn('SilentRush')">Silent Rush</button>
    <button class="btn-silent" onclick="spawn('SilentAmbush')">Silent Ambush</button>
    <button class="btn-silent" onclick="spawn('GhostRush')">Ghost Rush</button>
  </div>
</div>

<!-- REVERSED -->
<div class="section">
  <h3 class="h-silent">🔄 Reversed (đi ngược)</h3>
  <div class="buttons">
    <button class="btn-silent" onclick="spawn('ReversedRush')">Reversed Rush</button>
    <button class="btn-silent" onclick="spawn('ReversedAmbush')">Reversed Ambush</button>
    <button class="btn-silent" onclick="spawn('SlowRush')">Slow Rush</button>
    <button class="btn-silent" onclick="spawn('TankAmbush')">Tank Ambush</button>
  </div>
</div>

<!-- NIGHTMARE -->
<div class="section">
  <h3 class="h-nightmare">😈 Nightmare Pack</h3>
  <div class="buttons">
    <button class="btn-nightmare" onclick="spawn('NightmareDepth')">Nightmare Depth</button>
    <button class="btn-nightmare" onclick="spawn('NightmareSmiley')">Nightmare Smiley</button>
    <button class="btn-nightmare" onclick="spawn('NightmareTrauma')">Nightmare Trauma</button>
  </div>
</div>

<!-- FUN -->
<div class="section">
  <h3 class="h-silent">🎭 Fun / Troll</h3>
  <div class="buttons">
    <button class="btn-silent" onclick="spawn('BallerSpam')">Baller Spam x20</button>
    <button class="btn-speed" onclick="spawn('SpeedTrial')">Speed Trial</button>
    <button class="btn-speed" onclick="spawn('MiniRushWave')">Mini Rush Wave</button>
  </div>
</div>

<!-- BOSS -->
<div class="section">
  <h3 class="h-boss">⚠️ BOSS EVENTS</h3>
  <div class="buttons">
    <button class="btn-boss" onclick="spawn('BossRush')">⚠️ BOSS RUSH</button>
    <button class="btn-boss" onclick="spawn('BossAmbush')">⚠️ BOSS AMBUSH</button>
    <button class="btn-boss" onclick="spawn('Apocalypse')">☠️ APOCALYPSE</button>
  </div>
</div>

<!-- COMBO PRESETS -->
<div class="section">
  <h3 class="h-combo">🌀 Combo Presets</h3>
  <div class="buttons">
    <button class="btn-combo" onclick="combo(['Rush','Ambush'], 1)">Rush + Ambush</button>
    <button class="btn-combo" onclick="combo(['RushX3','AmbushX2','Depth'], 2)">Hardcore Wave</button>
    <button class="btn-combo" onclick="combo(['ChaosRush','ChaosAmbush','Trauma'], 1)">Chaos Wave</button>
    <button class="btn-combo" onclick="combo(['BossRush','BossAmbush','Apocalypse'], 3)">☠️ HELL MODE</button>
    <button class="btn-combo" onclick="combo(['RushX5','AmbushInfinite','NightmareDepth','NightmareSmiley'], 2)">💀 IMPOSSIBLE</button>
  </div>
</div>

<!-- LOG -->
<div class="log" id="log"><div>📡 Ready...</div></div>

<script>
function log(msg) {
  const el = document.getElementById('log')
  const d = document.createElement('div')
  d.textContent = new Date().toLocaleTimeString() + ' — ' + msg
  el.prepend(d)
  if (el.children.length > 30) el.lastChild.remove()
}

function flash(btn) {
  btn.classList.add('ok')
  setTimeout(() => btn.classList.remove('ok'), 400)
}

function spawn(name) {
  const btn = event.target
  fetch('/spawn', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ entity: name })
  }).then(() => { flash(btn); log('Spawned: ' + name) })
}

function combo(entities, delay) {
  const btn = event.target
  fetch('/combo', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ entities, delay })
  }).then(() => { flash(btn); log('Combo: ' + entities.join(', ')) })
}
</script>
</body>
</html>`)
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`🚪 Doors Hardcore Server chạy tại http://localhost:${PORT}`)
    console.log(`📱 Mở trình duyệt vào địa chỉ trên để dùng Web UI`)
})
