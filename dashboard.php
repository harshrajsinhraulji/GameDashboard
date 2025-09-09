<?php
// Dashboard page. Include partials/header.php and partials/footer.php
<?php
require_once 'config.php';
// If user is already logged in, redirect to dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$page_title = 'Login & Signup';
include 'partials/header.php';
?>

<div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="grid md:grid-cols-2 gap-16 items-start max-w-4xl w-full">
        <!-- Login Form -->
        <div class="bg-slate-800 p-8 rounded-lg shadow-xl w-full">
            <h2 class="text-3xl font-bold mb-6 text-center text-cyan-400 font-display">Login</h2>
            <form id="login-form" class="space-y-6">
                <div>
                    <label for="login-username" class="block text-sm font-medium text-slate-300">Username</label>
                    <input type="text" id="login-username" name="username" required class="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500">
                </div>
                <div>
                    <label for="login-password" class="block text-sm font-medium text-slate-300">Password</label>
                    <input type="password" id="login-password" name="password" required class="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-3 focus:ring-cyan-500 focus:border-cyan-500">
                </div>
                <button type="submit" class="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                    Log In
                </button>
            </form>
            <p id="login-message" class="mt-4 text-center text-sm"></p>
        </div>

        <!-- Signup Form -->
        <div class="bg-slate-800 p-8 rounded-lg shadow-xl w-full">
            <h2 class="text-3xl font-bold mb-6 text-center text-teal-400 font-display">Sign Up</h2>
            <form id="signup-form" class="space-y-6">
                <div>
                    <label for="signup-username" class="block text-sm font-medium text-slate-300">Username</label>
                    <input type="text" id="signup-username" name="username" required class="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                    <label for="signup-password" class="block text-sm font-medium text-slate-300">Password</label>
                    <input type="password" id="signup-password" name="password" required class="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <button type="submit" class="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                    Create Account
                </button>
            </form>
            <p id="signup-message" class="mt-4 text-center text-sm"></p>
        </div>
    </div>
</div>

<script src="js/auth.js"></script>

<?php include 'partials/footer.php'; ?>
