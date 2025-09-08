// common.js
async function saveScore(game, score){
  try {
    const res = await fetch('/save_score.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({game, score})
    });
    const j = await res.json();
    if (!j.ok) console.warn('Save score failed', j);
    else console.log('Score saved');
  } catch(e){
    console.error('Save score error', e);
  }
}
