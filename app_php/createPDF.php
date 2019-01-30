<?php
session_start();
$fullname = $_SESSION['name'] . ' ' . $_SESSION['surname'];		// user fullname;
$weekDates = explode(',', $_POST['date']);		// current week dates;
$filename = $fullname . ' ' . $weekDates[0];		// PDF file name;
$pdfPath = '../PDFs/' . $filename . '.pdf';
$PDFcontent = $_POST['content'];
$htmlContent = '
<html>
	<head>
		<meta charset="UTF-8">
		
		<!-- PDF STYLESHEET -->
		<style>
			body {  
				font-family: "Helvetica";  
			}
			.header {
				padding-bottom: 2rem;
			}
			.half {
				display: inline-block;
				width: 50%;
			}
			.half:last-child {
				text-align: right;
			}
			.header-title {
				display: inline;
				padding: 0 2rem;
				font-weight: bold;
				font-size: 1.5rem;
			}
			.single-day {
				page-break-inside: avoid;
			}
			.single-day {
				margin-bottom: 2rem;
			}
			.table {
				width: 100%;
				border: .1rem solid rgba(0,0,10,.5);
				border-collapse: collapse;
			}
			.column,
			.row-job .cell,
			.row .cell:last-child {
				text-align: center;
			}
			.column,
			.cell {
				border: .1rem solid rgba(0,0,10,.5);
				padding: .1rem .4rem;
			}
			.row.hidden .cell {
				text-align: left;
				padding: .1rem .5rem;
				font-size: 1.1rem;
			}
			.cell .sm-cell-el {
				display: block;
				font-size: .8rem;
				white-space: nowrap;
			}
			.cell.cell-taller {
				padding: 0 .5rem;
				font-size: 1.25rem;
				line-height: 3rem;
			}
		</style>
	</head>
	<body>
		<div class="header">
			<div class="half">
				<p class="header-title">' . $fullname . '</p>
			</div>
			<div class="half">
				<p class="header-title">w/c: ' . $weekDates[0] . '</p>
			</div>
		</div>
		' . $PDFcontent . '
	</body>
</html>
';

// include autoloader
require_once '../dompdf/autoload.inc.php';

// reference the Dompdf namespace
use Dompdf\Dompdf;

// instantiate and use the dompdf class
$dompdf = new Dompdf();

$dompdf->loadHtml($htmlContent);

// (Optional) Setup the paper size and orientation
$dompdf->setPaper('A4', 'portrait');

// Render the HTML as PDF
$result = $dompdf->render();

// Save PDF on server;
file_put_contents($pdfPath, $dompdf->output());

$_SESSION['pdf-path'] = $pdfPath;
$_SESSION['wc-date'] = $weekDates[0];
// Attach PDF to email and send it;
require_once './create_email.php';

// Output the generated PDF to Browser
//$dompdf->stream();

/*
echo $dompdf->stream(
  'file.pdf',
  array(
    'Attachment' => 0
  )
);
*/

?>