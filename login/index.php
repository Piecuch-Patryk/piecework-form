<!DOCTYPE html>
<?php
// HTTPS;
// require '../app_php/require/https.php';   <---- Does not work;
session_start();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wages app v5.0</title>
	<link rel="stylesheet" href="../styles/main.css">
	<link rel="stylesheet" href="../styles/login.css">
</head>
<body class="login-bg">
	<main class="form-wrap">
		<!-- Login form -->
		<form method="POST" action="../app_php/login.php">
			<h1>Piecework form sheet</h1>
			<div class="form-row">
				<input class="input" type="email" name="username" autofill="email" required placeholder="E-mail">
				<label>E-mail<label>
			</div>
			<div class="form-row">
				<input class="input" type="password" name="password" autofill="password" required placeholder="Password">
				<label>Password</label>
			</div>
			<p class="error-field"><?php
				if(isset($_SESSION['e_login_pass'])){
					echo $_SESSION['e_login_pass'];
				}
			?></p>
			<div class="form-row">
				<button>Submit</button>
			</div>
			<div class="form-row">
				<a href="./register.php">Create free account</a>
			</div>
		</form>
	</main>
	<footer class="login-footer">
		<p>WagesApp@2019. Copyrights &copy; Patryk Piecuch </p>
	</footer>
	<?php
	session_destroy();
	?>
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script>
		// Toggle placeholder;
		$('.input').on('focus', function(){
			const text = this.placeholder;
			// show label;
			$(this.nextElementSibling).css('display', 'block').animate({
				opacity: 1
			});
			this.placeholder = '';
			$(this).on('blur', function(){
				if($(this).is(':invalid')) {
					this.placeholder = text;
					// hide label
					$(this.nextElementSibling).css({
						opacity: 0,
						display: 'none'
					});
				}
			});
		});
	</script>
</body>
</html>