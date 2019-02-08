<?php
session_start();
// redirect if logged;
if(isset($_SESSION['logged'])){
	header('Location: ../private/');
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
		<form method="POST" action="./pass_recovery.php">
			<h1><?php
				if(isset($_SESSION['retrive_pass'])){
					echo $_SESSION['retrive_pass'];
					unset($_SESSION['retrive_pass']);
				}
				else {
					echo 'Type your e-mail address';
				}
			?></h1>
			<?php
				if(isset($_SESSION['e_expiry'])){
					echo '<h1>' . $_SESSION['e_expiry'] . '</h1>';
					unset($_SESSION['e_expiry']);
				}
			?>
			<div class="form-row">
				<input id="login" class="input" type="email" name="email" autofill="email" required placeholder="E-mail" value=<?php
							 if(isset($_SESSION['temp_email'])){
								 echo $_SESSION['temp_email'];
								 unset($_SESSION['temp_email']);
							 }
							 ?>>
				<label for="login">E-mail</label>
			</div>
			<div class="form-row">
				<button>Retrieve</button>
			</div>
			<div class="form-row">
				<a href="./register.php">Create free account</a>
			</div>
			<div class="form-row">
				<a href="../login/">Sign in</a>
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