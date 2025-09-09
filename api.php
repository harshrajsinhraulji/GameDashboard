<?php
// api.php
header('Content-Type: application/json');
require_once 'config.php';

$response = ['status' => 'error', 'message' => 'Invalid request'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($action) {
        case 'signup':
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';

            if (empty($username) || empty($password)) {
                $response['message'] = 'Username and password are required.';
            } else {
                $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
                $stmt->bind_param("s", $username);
                $stmt->execute();
                $stmt->store_result();

                if ($stmt->num_rows > 0) {
                    $response['message'] = 'Username already exists.';
                } else {
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                    $stmt->bind_param("ss", $username, $hashed_password);
                    if ($stmt->execute()) {
                        $response['status'] = 'success';
                        $response['message'] = 'Signup successful. Please login.';
                    } else {
                        $response['message'] = 'An error occurred during signup.';
                    }
                }
                $stmt->close();
            }
            break;

        case 'login':
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';

            if (empty($username) || empty($password)) {
                $response['message'] = 'Username and password are required.';
            } else {
                $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
                $stmt->bind_param("s", $username);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($user = $result->fetch_assoc()) {
                    if (password_verify($password, $user['password'])) {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['username'] = $username;
                        $response['status'] = 'success';
                        $response['message'] = 'Login successful.';
                    } else {
                        $response['message'] = 'Invalid username or password.';
                    }
                } else {
                    $response['message'] = 'Invalid username or password.';
                }
                $stmt->close();
            }
            break;

        case 'submit_score':
            if (!isset($_SESSION['user_id'])) {
                $response['message'] = 'User not logged in.';
            } else {
                $user_id = $_SESSION['user_id'];
                $game_name = $_POST['game_name'] ?? '';
                $score = $_POST['score'] ?? 0;

                if (!empty($game_name) && is_numeric($score)) {
                    $stmt = $conn->prepare("INSERT INTO scores (user_id, game_name, score) VALUES (?, ?, ?)");
                    $stmt->bind_param("isi", $user_id, $game_name, $score);
                    if ($stmt->execute()) {
                        $response['status'] = 'success';
                        $response['message'] = 'Score submitted successfully.';
                    } else {
                        $response['message'] = 'Failed to submit score.';
                    }
                    $stmt->close();
                } else {
                    $response['message'] = 'Invalid game data.';
                }
            }
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($action) {
        case 'get_leaderboard':
            $game = $_GET['game'] ?? 'all';
            $sql = "SELECT u.username, s.game_name, s.score, s.played_at 
                    FROM scores s 
                    JOIN users u ON s.user_id = u.id";

            if ($game !== 'all') {
                $sql .= " WHERE s.game_name = ?";
            }
            
            $sql .= " ORDER BY s.score DESC LIMIT 100";
            
            $stmt = $conn->prepare($sql);
            if ($game !== 'all') {
                $stmt->bind_param("s", $game);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $scores = $result->fetch_all(MYSQLI_ASSOC);

            $response = ['status' => 'success', 'data' => $scores];
            $stmt->close();
            break;

        case 'get_profile':
            if (!isset($_SESSION['user_id'])) {
                $response['message'] = 'User not logged in.';
            } else {
                $user_id = $_SESSION['user_id'];
                $data = [
                    'username' => $_SESSION['username'],
                    'total_games' => 0,
                    'best_scores' => []
                ];

                // Get total games played
                $stmt = $conn->prepare("SELECT COUNT(*) as total FROM scores WHERE user_id = ?");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result()->fetch_assoc();
                $data['total_games'] = $result['total'];

                // Get best score for each game
                $stmt = $conn->prepare("SELECT game_name, MAX(score) as best_score FROM scores WHERE user_id = ? GROUP BY game_name");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $data['best_scores'][$row['game_name']] = $row['best_score'];
                }

                $response = ['status' => 'success', 'data' => $data];
                $stmt->close();
            }
            break;
    }
}

$conn->close();
echo json_encode($response);
