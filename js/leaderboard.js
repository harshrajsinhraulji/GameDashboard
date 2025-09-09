// Handles leaderboard fetching, filtering, and UI updates
// Portfolio-ready: fetches leaderboard from API and updates table

document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('game-filter');
    const tbody = document.getElementById('leaderboard-body');

    function loadLeaderboard(game) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8">Loading...</td></tr>`;
        fetch(`api.php?action=get_leaderboard&game=${game}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    if (data.data.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8">No scores yet.</td></tr>`;
                        return;
                    }
                    tbody.innerHTML = data.data.map((row, i) => `
                        <tr>
                            <td class="py-3 px-4">${i+1}</td>
                            <td class="py-3 px-4">${row.username}</td>
                            <td class="py-3 px-4">${row.game_name}</td>
                            <td class="py-3 px-4">${row.score}</td>
                            <td class="py-3 px-4">${row.played_at}</td>
                        </tr>
                    `).join('');
                } else {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8">${data.message}</td></tr>`;
                }
            });
    }
    filter.addEventListener('change', () => loadLeaderboard(filter.value));
    loadLeaderboard(filter.value);
});
