const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'entries.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

function readEntries(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]'); }
  catch(e){ return []; }
}

function writeEntries(entries){
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

app.get('/api/entries', (req, res) => {
  res.json(readEntries());
});

app.post('/api/entries', (req, res) => {
  const entry = req.body;
  if (!entry || typeof entry.lat !== 'number' || typeof entry.lng !== 'number') return res.status(400).json({ error: 'Invalid entry' });
  const entries = readEntries();
  entries.push(entry);
  writeEntries(entries);
  res.json({ ok: true });
});

app.post('/api/entries/clear', (req, res) => {
  writeEntries([]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
