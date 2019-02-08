<?php
session_start();
// redirect if logged;
if(isset($_SESSION['logged'])){
	header('Location: ../private/');
	exit;
}
if(!isset($_SESSION['newpass'])){
	header('Location: ./recovery.php');
	exit;
}
?>
<!DOCTYPE html>
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
		<form method="POST" action="./pass_update.php">
			<h1>Piecework form sheet</h1>
			<div class="form-row">
				<input id="login" class="input" type="email" name="username" autofill="email" required placeholder="E-mail" value=<?php
							 if(isset($_SESSION['email'])){
								 echo $_SESSION['email'];
								 unset($_SESSION['email']);
							 }
							 ?>>
				<label for="login">E-mail</label>
				<p class="error-field"><?php
							if(isset($_SESSION['e_email'])){
								echo $_SESSION['e_email'];
								unset($_SESSION['e_email']);
							}
						?></p>
			</div>
			<div class="form-row">
				<input id="password" class="input" type="password" name="password" autofill="password" required placeholder="New password">
				<label for="password">New password</label>
				<p class="error-field"><?php
							if(isset($_SESSION['e_password'])){
								echo $_SESSION['e_password'];
								unset($_SESSION['e_password']);
							}
						?></p>
			</div>
			<div class="form-row">
				<input id="password2" class="input" type="password" name="password2" autofill="password" required placeholder="Repeat password">
				<label for="password2">Repeat password</label>
				<p class="error-field"><?php
							if(isset($_SESSION['e_password2'])){
								echo $_SESSION['e_password2'];
								unset($_SESSION['e_password2']);
							}
						?></p>
			</div>
			<div class="form-row">
				<button>Submit</button>
			</div>
			<div class="form-row">
				<a href="../login/register.php">Create free account</a>
			</div>
			<div class="form-row">
				<a href="../login/">Main page</a>
			</div>
		</form>
	</main>
	<footer class="login-footer">
		<p>WagesApp@2019. Copyrights &copy; Patryk Piecuch </p>
	</footer>
	<?php $_SESSION = array(); ?>
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