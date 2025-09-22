// scoreSender.js - shared AJAX score sender for all games
export function sendScore(gameId, score) {
	fetch('/backend/api/score.php', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ game_id: gameId, score })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			console.log('Score saved!');
		} else {
			console.log('Score not saved:', data.message);
		}
	})
	.catch(err => console.error('Score send error:', err));
}
