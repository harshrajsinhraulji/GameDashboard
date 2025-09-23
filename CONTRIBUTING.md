# Contributing to Game Dashboard 🎮

First off, thank you for considering contributing to the Game Dashboard! We're excited to have you. Every contribution, whether it's a bug report, a new feature idea, or a code improvement, is valuable.

This document provides a set of guidelines for contributing to this project.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

---
## How Can I Contribute?

There are several ways you can contribute to the project:

### 🐛 Reporting Bugs

If you find a bug, please ensure it hasn't already been reported by checking the **Issues** tab on GitHub.

When you create a new bug report, please include as many details as possible:

-   **A clear and descriptive title.**
-   **Steps to reproduce the bug.** Be as specific as you can.
-   **What you expected to happen** vs. **what actually happened.**
-   **A screenshot or GIF** of the issue, if possible. This is incredibly helpful!
-   **Your browser and operating system.**

### ✨ Suggesting Enhancements

Have an idea for a new game, a UI improvement, or another feature? We'd love to hear it!

Please open an issue and provide:

-   **A clear and descriptive title** for the enhancement.
-   **A detailed description** of the feature and why it would be a great addition to the Game Dashboard.
-   **Any mockups or examples** that might help illustrate your idea.

### 💻 Pull Requests

If you'd like to contribute code to fix a bug or add a feature, please follow the process outlined below.

---
## 🚀 Development Setup

To get the project running locally for development:

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** your fork to your local machine: `git clone https://github.com/harshrajsinhraulji/GameDashboard.git`
3.  **Place** the cloned folder inside your WAMP (`www/`) or XAMPP (`htdocs/`) directory.
4.  **Set up the database** using the SQL script provided in the `README.md` file.
5.  **Access the project** in your browser at `http://localhost/GameDashBoard/`.

---
## Pull Request Process

1.  Create a new branch from `main` for your changes. Please use a descriptive branch name (e.g., `fix/snake-control-bug` or `feature/add-tetris-game`).
    ```bash
    git checkout -b your-branch-name
    ```
2.  Make your changes to the code.
3.  Commit your changes with a clear and concise commit message.
    ```bash
    git commit -m "feat: Add Tetris game module"
    ```
4.  Push your branch to your forked repository on GitHub.
    ```bash
    git push origin your-branch-name
    ```
5.  Open a **Pull Request** from your forked repository's branch to the original repository's `main` branch.
6.  In the Pull Request description, please link to any relevant issues and clearly describe the changes you made.

## Styleguides

### JavaScript
-   Follow standard vanilla JavaScript conventions.
-   Keep game logic encapsulated within its own module (`/games/gamename/`).
-   Comment any complex or non-obvious parts of your code.

### PHP
-   All backend code must be secure.
-   All database interactions **must** use prepared statements with PDO or MySQLi to prevent SQL injection vulnerabilities.
-   Ensure API responses are in a consistent JSON format.

Thank you again for your interest in making the Game Dashboard even better!!
