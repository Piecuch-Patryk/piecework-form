class Form {
		constructor(){
			this.$form = $('<form action="../app_php/createPDF.php" method="POST">');
			this.$input_1 = $('<input type="hidden" name="content">');
			this.$input_2 = $('<input type="hidden" name="date">');
		}
		getContent(){
			return $('#tables-container').html();	
		}
		getDates(){
			const dates = [];
			$('.day-nav span').each((i, el) => dates.push($(el).text()));
			return dates;
		}
		getPdfData(){
			$(this.$input_1).val(this.getContent());
			$(this.$input_2).val(this.getDates());
		}
		submitForm(){
			// loading animation;
			$('#loading-animation').fadeIn(500);
			$.ajax({
				type: 'POST',
				url: "../app_php/createPDF.php",
				data: {
					content: $(this.$input_1).val(),
					date: $(this.$input_2).val()
				},
				dataType: 'json',
				success: result => {
					$('#loading-animation').fadeOut(500);
					$('.confirmation').fadeIn(500);
					setTimeout(function(){
						$('.confirmation').fadeOut(500);
					}, 2500);
				}
			});
		}
	}