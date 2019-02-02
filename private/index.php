<!DOCTYPE html>
<?php
session_start();
// access for logged users only;
if(!$_SESSION['logged']){
	header('Location: ../login/');
}
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wages app v.5</title>
	<!-- fontawesome -->
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
	<link rel="stylesheet" href="../styles/main.css">
	<link rel="stylesheet" href="../styles/private.css">
</head>
<body class="private-bg">
	<div class="bg-cover">
		<!-- Header -->
		<header class="private-header">
			<label>Select the beginning date of the week<input id="week-date" class="lg-input" type="date" required="required"></label>
			<!-- name&surname -->
			<div>
				<p id="username"><?php
				if(isset($_SESSION['name'])){
					echo $_SESSION['name'].' '.$_SESSION['surname'];
				}
				?></p>
				<a href="../app_php/logout.php" class="link-el">LogOut</a>
			</div>
		</header>
		<!-- E-mail sent confirmation -->
		<section class="confirmation 
		<?php
		if(isset($_SESSION['email_sent'])){
			unset($_SESSION['email_sent']);
			echo 'visible';
		}else {
			echo 'hidden';
		}?>">
			<h1>All done! E-mail has been sent.</h1>
		</section>
		<main>
			<!-- Job sheet form -->
			<section class="section-wrap">
				<form id="jobsheet">
					<div class="flex-wrap">
						<!-- Invoice number -->
						<div class="box-row">
							<label>Invoice number<input id="invoice" class="sm-input invoice-input" type="text" min="0" placeholder="00000"></label>
						</div>
						<!-- Range -->
						<div class="box-row">
							<label for="ranges">Range:</label>
							<select id="ranges">
								<option data-price="0">--please select--</option>
							</select>
							<div class="box-wrap hidden">
								<input class="sm-input manual-input" type="text" placeholder="manual typing">
								<i id="reverse-options" class="fas fa-undo-alt"></i>
							</div>
						</div>
						<!-- Size -->
						<div class="box-row">
							<label for="sizes">Size:</label>
							<select id="sizes">
								<option data-price="0">--please select--</option>
							</select>
							<input id="manual-size" class="sm-input manual-input hidden" type="text" placeholder="manual typing">
						</div>
						<!-- Product price -->
						<div class="box-row">
							<input id="product-price" class="sm-input" type="text" readonly value="£0.00">
						</div>
					</div>
					<div class="flex-wrap">
						<!-- Base -->
						<div class="sm-box">
							<div class="box-row">
								<label for="base">Base</label>
								<select id="base">
									<option data-index="0">--please select--</option>
									<option data-index="1">bearers</option>
									<option data-index="2">easy-base</option>
								</select>
							</div>
							<div class="box-row">
								<input class="sm-input" readonly type="text" value="&pound;0.00">
							</div>
						</div>
						<!-- Guttering -->
						<div class="sm-box">
							<div class="box-row">
								<label for="gutter">Guttering</label>
								<select id="gutter">
									<option data-index="0">--please select--</option>
									<option data-index="1">one side</option>
									<option data-index="2">two sides</option>
								</select>
							</div>
							<div class="box-row">
								<input class="sm-input" readonly type="text" value="&pound;0.00">
							</div>				
						</div>
						<!-- Waterbutt -->
						<div class="sm-box">						
							<div class="box-row">
								<label for="waterbutt">Waterbutt</label>
								<select id="waterbutt">
									<option data-index="0">--please select--</option>
									<option data-index="1">one</option>
									<option data-index="2">two</option>
								</select>
							</div>
							<div class="box-row">
								<input class="sm-input" readonly type="text" value="&pound;0.00">
							</div>
						</div>
						<!--pop-up shelving section-->
						<div class="sm-box">
							<div class="box-row">
								<!-- btn -->
								<button id="shelves-btn" class="btn-shelv" type="button">Shelvings</button>
								<div class="hidden-wrap">
									<div>
										<button class="close-btn" type="button">X</button>
										<div class="sm-box">
											<div>
												<label>5' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>6' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>7' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>8' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>9' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>10' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>12' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>14' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<div>
												<label>16' x <input class="sm-input" type="number" min="0" max="10" value="0"></label>
											</div>
											<div>
												<input type="text" readonly class="sm-input" value="£0.00">
											</div>
										</div>
										<div class="sm-box">
											<button id="add-shelves" class="submit-btn" type="button">Update</button>
										</div>
									</div>
								</div>
							</div>
							<!-- shelves total -->
							<div class="box-row">
								<input id="shelves-total" class="sm-input"  readonly type="text" value="&pound;0.00">
							</div>
						</div>
						<!-- Total for extras -->
						<div class="sm-box">
							<div class="box-row">
								<span>Extras total</span>
							</div>
							<div class="box-row">
								<input id="extras-total" class="sm-input" readonly type="text" value="£0.00">
							</div>
						</div>
					</div>
					<!-- Job's total -->
					<div class="flex-wrap center-box">
						<div class="box-row">
							<label>Total for the job:<input id="total" class="sm-input" type="text" value="£0.00" readonly></label>
						</div>
					</div>
					<!-- Add job btn -->
					<div class="flex-wrap">
						<div class="box-row center-box">
							<button id="submit-job" class="submit-btn" type="button">Add job</button>
						</div>
					</div>
				</form>
				<!-- End job sheet form -->
			</section>
			<section id="content-email" class="section-wrap week-wrap">
				<div class="day-nav">
					<ul>
						<li class="active-nav">
							Monday
							<span>20-05-2019</span>
						</li>
						<li>
							Tuesday
							<span>20-05-2019</span>
						</li>
						<li>
							Wednesday	
							<span>20-05-2019</span>
						</li>
						<li>
							Thursday	
							<span>20-05-2019</span>
						</li>
						<li>
							Friday
							<span>20-05-2019</span>
						</li>
					</ul>
				</div>
			<section id="tables-container" class="tables-wrap"></section>
			
			</section>
			<section class="section-wrap ">
				<div class="flex-wrap center-box">
					<label>Amount of hours in current week <input type="number" class="sm-input" value="0" max="50" min="0"></label>
				</div>
				<div class="flex-wrap center-box">
					<p>Average hourly rate at current week: <span id="average-rate">£0.00</span></p>
				</div>
				<div class="flex-wrap center-box">
					<p>Week total gross: <span id="week-total-gross">£0.00</span></p>
				</div>
				<div class="flex-wrap center-box">
					<p>Week total net: <span id="week-total-nett">£0.00</span></p>
				</div>
			</section>
		</main>
		<!-- Send email btn-->
		<div class="flex-wrap center-box">
			<button id="generate-email" class="submit-btn" type="button">Send e-mail</button>
		</div>
		<footer>
			<p>Job sheet form. Coopyrights &copy; 2019</p>
		</footer>
		<!-- top layer to cover view when shelves wrap opened -->
		<div class="very-top-cover"></div>
	<!-- End bg-cover -->
	</div>
	
	<!-- Loading animation -->
	<div id="loading-animation" class="loading-animation-wrap">
		<h5 class="animation-title">Sending...</h5>
		<div class="loading-animation">
			<div class="circle"></div>
		</div>
	</div>
	<!-- Hidden form container for PDF files -->
	<div id="hidden-pdf-form" style="display: none;"></div>
	
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	
	<!-- Modules -->
	<script src="../scripts/modules/data.js"></script>
	<script src="../scripts/modules/Dates.js"></script>
	<script src="../scripts/modules/Jobsheet.js"></script>
	<script src="../scripts/modules/Tables.js"></script>
	<script src="../scripts/modules/Weektotal.js"></script>
	<script src="../scripts/modules/set.js"></script>
	<!-- App -->
	<script src="../scripts/app.js"></script>
	
	
</body>
</html>