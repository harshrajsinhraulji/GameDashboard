# 🎮 Game Dashboard

A full-stack web application featuring a collection of classic browser games, complete with user authentication, score tracking, and competitive leaderboards. This project is built with vanilla JavaScript on the frontend and a PHP/MySQL backend.



## ✨ Features

- **Complete User System:** Secure user registration, login, and logout functionality. Passwords are fully hashed.
- **Guest Access:** Guests can play games, but only registered users can save scores.
- **Five Classic Games:**
    - **Snake:** The timeless arcade classic.
    - **2048:** The viral tile-matching puzzle game.
    - **Minesweeper:** The strategic mine-clearing game.
    - **Memory Game:** A card-matching game to test your memory.
    - **Reaction Test:** A simple test to measure your reflexes in milliseconds.
- **Persistent Score Saving:** Logged-in users' scores are automatically saved to the database.
- **User Profile Page:** A dedicated page for users to view their personal best scores for each game and their complete play history.
- **Competitive Leaderboards:** Each game features an all-time top 10 leaderboard, showing the single best score for each of the top players.
- **Dynamic UI:** The interface is built with vanilla JavaScript, dynamically rendering game cards, leaderboards, and profile data without page reloads.
- **Immersive Game Experience:** Games launch in a clean, full-screen overlay for focused gameplay.

---
## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** PHP
- **Database:** MySQL
- **Server:** Apache (designed for a WAMP/XAMPP/MAMP stack)
- **API Communication:** Asynchronous Fetch API (AJAX)

---
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need a local server environment with PHP and MySQL. The easiest way to get this is by installing a package like:
- [WampServer](https://www.wampserver.com/en/) (for Windows)
- [XAMPP](https://www.apachefriends.org/) (for Windows, macOS, Linux)
- [MAMP](https://www.mamp.info/en/mamp/) (for macOS)

### Installation

1.  **Download the Code:** Place all the project files into a folder named `game-dashboard`.
2.  **Move to Server Directory:** Move the `game-dashboard` folder into your server's web root.
    - For WAMP, this is typically `C:/wamp64/www/`.
    - For XAMPP, this is typically `C:/xampp/htdocs/`.
3.  **Start Your Server:** Launch WAMP/XAMPP and make sure both the Apache and MySQL services are running.
4.  **Set Up the Database:** Follow the database setup instructions below.
5.  **Access the Application:** Open your web browser and navigate to **`http://localhost/game-dashboard/`**.

### Database Setup

You must create the database and tables for the application to function.

1.  Navigate to `http://localhost/phpmyadmin/` in your browser.
2.  Click on the **SQL** tab.
3.  Copy the entire SQL script below and paste it into the query box.
4.  Click **Go** to execute the script. This will create the `game_dashboard` database, all necessary tables, and pre-load the games.

```sql
CREATE DATABASE IF NOT EXISTS game_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE game_dashboard;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  score INT NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Seed the games table with the 5 games
INSERT INTO games (name) VALUES
('Snake'),
('2048'),
('Minesweeper'),
('Memory'),
('Reaction');
```
## 📂 Project Structure
The project uses a modular structure to separate concerns and make it easy to add new games.
```
/GameDashboard/
|-- api/                # All backend PHP scripts
|-- assets/             # Shared CSS, JS, and other assets
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       |-- api.js      # Handles all backend communication
|       `-- main.js     # Core frontend logic
|-- games/              # Each game is a self-contained module
|   |-- 2048/
|   |-- memory/
|   |-- minesweeper/
|   |-- reaction/
|   `-- snake/
|-- index.html          # Main dashboard page
|-- login.html
|-- profile.html
|-- register.html
`-- README.md
```

## 🔌 API Endpoints

The backend provides a simple RESTful API to handle data and authentication. All endpoints are located in the /api/ directory.

POST /register.php: Creates a new user account.

POST /login.php: Authenticates a user and starts a session.

POST /logout.php: Destroys the current user session.

GET /check_session.php: Checks if a user is currently logged in.

POST /save_score.php: Saves a score for the logged-in user.

GET /get_leaderboard.php: Fetches the top 10 unique player scores for a given game.

GET /get_profile.php: Fetches the high scores and full game history for the logged-in user.

## 📄 License

This project is open-source and available for anyone to use or modify.
