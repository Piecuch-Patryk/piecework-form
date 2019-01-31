let jobSheet = new Job();
const weekTotal = new WeekTotal();		// hidden table;
const tables = [];
let Datescalc;

document.addEventListener('DOMContentLoaded', () => {
	
	// Get available ranges from database and append to <Sselect>;
	getRanges();
	// Get available shelves from database;
	getShelvesPrices();
	$('#ranges').on('change', function(){
		// Other range choice opens the editable form; User can type data manually;
		if($(this).children(':selected').text() == $(this).children().last().text()) {
			$(this).addClass('hidden');
			$(this).next().removeClass('hidden');
			$('#sizes').addClass('hidden');
			$('#sizes').next().removeClass('hidden');
			$('#manual-size').on('blur', function(){
				jobSheet.size = $(this).val();
			});
			jobSheet.priceA = 0;
			// flag for manual typing;
			jobSheet.manually = true;
			$('#product-price').removeAttr('readonly').val('£0.00');
			$('#product-price').on('blur', function(){
				let price = $(this).val();
				price = price.split('£');
				price = price[1];
				price = Number(price);
				jobSheet.priceA = price;
				setTotal();
			});
			// click to reverse it back;
			$('#reverse-options').on('click', () => {
				// flag for manual typing;
				jobSheet.manually = false;
				$(this).removeClass('hidden');
				$(this).next().addClass('hidden');
				$('#sizes').removeClass('hidden');
				$('#sizes').next().addClass('hidden');
				$('#sizes').html('').append($('<option>').text('--please select--'));
				$('#product-price').attr('readonly', 'true');
				getRanges();
			});
			setTotal();
		}
		else {
			getSizes(this);
			jobSheet.range = $(this).children(':selected').text();
		}
	});
	$('#sizes').on('change', function(){
		const price = $(this).children(':selected').attr('data-price') / 100;
		jobSheet.size = $(this).children(':selected').text();
		jobSheet.priceA = parseFloat(price.toFixed(2));
		setPrice(`£${price.toFixed(2)}`, this);
		setTotal();
	});
	
	// Get selected base price;
	$('#base').on('change', getBasePrice);
	// Get selected gutter price;
	$('#gutter').on('change', getGutterPrice);
	// Get selected waterbutt price;
	$('#waterbutt').on('change', getWaterbuttPrice);
	
	// *** Shelving wrap animation ***
	$('.btn-shelv').on('click', function(){
		// scroll disabled;
		$(window).on('scroll touchmove mousewheel', function(e){
			e.preventDefault();
			e.stopPropagation();
		});
		$('.very-top-cover').css('display', 'block');
		$('.hidden-wrap').css({
			opacity: 0,
			display: 'flex'
		});
		$('.hidden-wrap').animate({
			opacity: 1
		}, 500);
	});
	$('.close-btn').on('click', function(){
		// scroll enabled;
		$(window).off('scroll touchmove mousewheel');
		$('.very-top-cover').css('display', 'none');
		$(this).closest('.hidden-wrap').fadeOut(500);
	});
	$('.very-top-cover').on('click', function(){
		// scroll enabled;
		$(window).off('scroll touchmove mousewheel');
		$('.hidden-wrap').fadeOut(500);
		$(this).css('display', 'none');
	});
	$('.hidden-wrap').find('input[type="number"]').on('change', function(){
		let price = $(this).val() * $(this).attr('data-price') / 100;
		price = price.toFixed(2);
		setPrice(`£${price}`, $(this).parent());
	});
	// Add chosen shelves to jobSheet obj;
	$('#add-shelves').on('click', function(){
		$('.hidden-wrap').find('input[type="number"]').each((i, el) => {
			if($(el).val() > 0){
				jobSheet.extras.shelvings.push({
					size: $(el).parent().text().split('\'')[0],
					qty: $(el).val(),
					price: $(el).attr('data-price'),
					checked: true
				})
			}
		});
		jobSheet.extras.calcShelvesPrice();
		jobSheet.extras.checked = true;
		setPrice(`£${jobSheet.extras.calcShelvesPrice()}`, $(this).closest('.hidden-wrap'));
		setExtrasTotal();		
		// scroll enabled;
		$(window).off('scroll touchmove mousewheel');
		// hide shelves section;
		$('.very-top-cover').css('display', 'none');
		$('.hidden-wrap').fadeOut(500);
	});
	
	// set last Mondays date in input[type="date"];
	setLastMonday(new Date());
	// current week dates object;
	Datescalc = new DatesCalc();
	
	// Create table objects Mon-Fri;
	const days = getDays();
	$(days).each((i, el) => {
		const newTable = new TableObj();
		newTable.index = i; 
		tables.push(newTable);
	});
	
	// Apend every table object to DOM;
	$(tables).each((i, el) => {
		$('#tables-container').append($(el.createTable(i)));
	});
	// Submit job sheet;
	$('#submit-job').on('click', function(){		
		if($('#invoice').val().length > 4){
			const $currentTable = currentTableObj();
			
			// add jobsheet to current TableObj;
			$currentTable.rows.push(jobSheet);
			
			jobSheet.invoice = $('#invoice').val();			
			
			// create new row in active table;
			$('.active-day').find('tbody').prepend(jobSheet.prependRow());
			
			// calculate total price A+B;
			setTotalJobRows();
			
			// Delete current jobSheet references and create brand new one with default values;
			delete jobSheet;
			jobSheet = new Job();
			
			setHeight();
			
			// RESET job-sheet form;
			$('#invoice').val('');
			$('#sizes').html('').append($('<option>').html('--please select--'));
			// reset price fields;
			$('.flex-wrap').find('input[type="text"]').each((i, el) => {
				$(el).val(`£0.00`);
			});
			// reset options;
			$('.flex-wrap').find(':selected').each((i, el) => {
				$(el).prop('selected', false);
			});
		}else {
			// form not completed;
			
			// *******************
		}
	});
	

	// Extra hours at hourly rate;
	$('.extra-hours').on('change', function(){
		setExtraHoursPrice(this);
	});

	
	// set dates in days nav;
	Datescalc.setDates();
	$('.private-header input[type="date"]').on('change', () => {
		Datescalc.setDates();		
	});
	
	
	// set table height to days-wrap;
	$(window).on('resize', setHeight);
	setHeight();
	
	// show chosen day-table;
	$('.day-nav li').on('click', setCurrentDay);
	
	
	// Get current TableObj;
	const currentTableObj = function(){
		const $active = $('.active-day').find('table').first();
		let $el;
		$(tables).each((i, el) => {
			if($active[0] == el.table){
				$el = $(el)[0];
			}
		});
		return $el;
	}
	
	// create email document;
	$('#generate-email').on('click', function(){
		const $div = $('<div class="single-day">');
		const $inputs = $('.extra-hours');
		$($div).append(weekTotal.weekTable());
		$('#tables-container').append($div);
		// find input-number and replace with text only;
		$($inputs).each((i, el) => {
			const val = $(el).val();
			$(el).replaceWith(' ' + val + ' ');
		});
		createPDF();
	});
	
}, false);