const DatesObj = new Dates();
let TempJobsheet = new Job();
const Tables = [];
const WeekTotalTable = new SummaryWeek();
let WholeWeekData = new WeekTotal();
let HiddenForm;



// DOM loaded;
document.addEventListener('DOMContentLoaded', function(){
	/*
	
	Date
	
	*/
	// set the date of last Monday;
	DatesObj.setLastMonday();
	DatesObj.calcWeekAhead();
	DatesObj.setWeekDates();
	/**** Input*/
	$('#week-date').on('input change', function(){
		DatesObj.calcWeekAhead();
		DatesObj.setWeekDates();
	});
	
	/*
	
	Job sheet form
	
	*/
	
	/**** Invoice*/
	$('#invoice').on('input focus', function(){
		const length = $(this).val().length;
		$(this).css('background-color', 'rgba(200, 0, 0, .5)');
		TempJobsheet.invoice = $(this).val();
		// toggle bgc while typing;
		if(length >= 3 && length < 5) $(this).css('background-color', 'rgba(255, 200, 0, 0.5)');	// yellow;
		else if(length < 3) $(this).css('background-color', 'rgba(200, 0, 0, .5)');	// red;
		else $(this).css('background-color', 'transparent');	// none;
	});
	/**** Range/Size*/
	// available ranges; 
	TempJobsheet.getRanges();
	// range changed;
	$('#ranges').on('change', function(){
		if($(this).children(':selected').text() != $(this).children().first().text()) {
			TempJobsheet.range = $(this).children(':selected').text();
		}
		TempJobsheet.priceA = 0;
		TempJobsheet.getSizes(this);
		TempJobsheet.resetPrice('coritec');
		TempJobsheet.extras['coritec'].checked = false;
		TempJobsheet.extras.checked = false;
		TempJobsheet.extras.setExtrasPrice('coritec');
		TempJobsheet.extras.shelvings.resetDefalut();
		TempJobsheet.extras.setExtrasTotal()
		TempJobsheet.setJobTotal();
		// disable checkbox;
		TempJobsheet.toggleCheckbox(false);
	});
	// size changed;
	$('#sizes').on('change', function(){
		const $selected = $(this).children(':selected');
		// '--please select--' selected;
		if($($selected).text() == $(this).children().first().text()){
			TempJobsheet.size = '';
			TempJobsheet.priceA = 0;
			TempJobsheet.setProductPrice();
		// size selected;
		}else {
			const priceNum = parseFloat($($selected).attr('data-price'));
			TempJobsheet.size = $($selected).text();
			TempJobsheet.setProductPrice(priceNum);
			// enable checkbox;
			TempJobsheet.toggleCheckbox(true);
		}
		TempJobsheet.resetPrice('coritec');
		TempJobsheet.extras['coritec'].checked = false;
		TempJobsheet.extras.checked = false;
		TempJobsheet.extras.setExtrasPrice('coritec');
		TempJobsheet.extras.shelvings.resetDefalut();
		TempJobsheet.extras.setExtrasTotal()
		TempJobsheet.resetOptions();
		TempJobsheet.setJobTotal();
	});
	/**** Extras*/
	// select extras;
	$('.sm-box select').each((i, el) => {
		$(el).on('mousedown keydown', function(e){
			// prevent open select element if no size chosen;
			if(TempJobsheet.size == ''){
				// allow TAB;
				if(e.keyCode != 9) e.preventDefault();
			}else {
				// select changed;
				$(this).on('change', function(e){
					e.stopImmediatePropagation();
					const dataIndex = $(this).children(':selected').attr('data-index');
					const name = $(this).attr('id');
					if(dataIndex == 0){
						// reset extras when option has been changed to '--please select--';
						TempJobsheet.resetSpecificOption(name);
						TempJobsheet.extras.checked = false;
						TempJobsheet.extras[name].checked = false;
						return;
					}
					TempJobsheet.extras.checked = true;
					TempJobsheet.extras[name].checked = true;
					// get price for selected extras;
					TempJobsheet.getExtras(name, dataIndex);
				});
			}
		});
	});
	/**** Extras - cori-tec*/
	$('#coritec').on('change', function(){
		const name = $(this).attr('id');
		if($(this).is(':checked')){
			// checked;
			TempJobsheet.getExtras(name);
			TempJobsheet.extras.checked = true;
			TempJobsheet.extras[name].checked = true;
		}else {
			TempJobsheet.resetPrice(name);
			TempJobsheet.extras.checked = false;
			TempJobsheet.extras[name].checked = false;
		}
		TempJobsheet.extras.setExtrasPrice(name);
		TempJobsheet.extras.setExtrasTotal();
		TempJobsheet.setJobTotal();
	})
	/**** Shelves*/
	// get and set prices;
	TempJobsheet.extras.shelvings.getShelvesData();
	// toggle display;
	$('#shelves-btn').on('click', () => {
		// open only if size chosen;
		if(TempJobsheet.size != ''){
			TempJobsheet.extras.shelvings.toggleShelvesSestion();
			// window scroll disabled;
			$(window).on('scroll touchmove mousewheel', function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			$('.close-btn').on('click', () => {
				// window scroll enabled;
				$(window).off('scroll touchmove mousewheel');
				TempJobsheet.extras.shelvings.toggleShelvesSestion();
			});
			$('#add-shelves').on('click', TempJobsheet.extras.shelvings.toggleShelvesSestion);
			$('.very-top-cover').on('click', TempJobsheet.extras.shelvings.toggleShelvesSestion);
		}
	});
	// changed quantity;
	$('.hidden-wrap input[type="number"]').on('input', function(){
		TempJobsheet.extras.shelvings.setSingleshelvPrice(this);
	});
	// update jobsheet form;
	$('#add-shelves').on('click', function(){
		$(TempJobsheet.extras.shelvings.updateShelves()).each((i, el) => TempJobsheet.extras.shelvings.shelves.push(el));
		// window scroll enabled;
		$(window).off('scroll touchmove mousewheel');
		TempJobsheet.extras.shelvings.setShelvesPrices();
		TempJobsheet.extras.setExtrasTotal();
		TempJobsheet.setJobTotal();
	});
	
	/**** Submit Job*/
	$('#submit-job').on('click', function(){
		// only if form was completed;
		if((TempJobsheet.size != '') && ($('#invoice').val().length > 3)){
			$('.active-day').find('tbody').prepend(TempJobsheet.prependRow());
			setHeight();
			TempJobsheet.toggleCheckbox(false);
			TempJobsheet.resetDOMelements();
			TempJobsheet = new Job();
			// reset invoice bgc;
			$('#invoice').css('background-color', 'transparent');
			// set week-total; below tables;
			WholeWeekData.setGross();
			WholeWeekData.setNet();
			WholeWeekData.setAverageRate();
		}
	});
	/*
	
	Manual typing
	
	*/
	/**** Toggle selects*/
	$('#change-icon').on('click', function(){
		const $inputs = $('.manual-input');
		const $priceBox = $('#product-price');
		$('.select').each((i, el) => {
			// hide inputs;
			if($(el).hasClass('hidden')) {
				$(el).removeClass('hidden');
				$($inputs[i]).addClass('hidden');
				$($priceBox).prop('readonly', true);
				$('#coritec').prop('disabled', true);
			}
			// show inputs;
			else {
				$(el).addClass('hidden');
				$($inputs[i]).removeClass('hidden');
				$($priceBox).prop('readonly', false);
			}
		})
	});
	/****Validate range*/
	$('#manual-range').on('input', function(){
		// letters only;
		const letters = /^[A-Za-z]+$/;
		const value = $(this).val();
		if(!value.match(letters)){
			const newValue = value.slice(0, -1);
			$(this).val(newValue);
			$('#typing-error').stop().fadeIn(500);
			setTimeout(() => {
				$('#typing-error').stop().fadeOut(500);
			}, 2000);
		}
	});
	$('#manual-range').on('blur', function(){
		$('#typing-error').stop().fadeOut(500);
		TempJobsheet.range = $(this).val();
	});
	/**** Validate size*/
	$('#manual-size').on('blur', function(){
		let val = $(this).val();
		const splited = val.split('x');
		let newVal = '';
		// if first value is smaller than second one;
		if(Number(splited[0]) < Number(splited[1])){
			newVal = splited[1] + 'x' + splited[0];
		}else {
			newVal = val;
		}
		TempJobsheet.size = newVal;
		$('#coritec').prop('disabled', false);
	});
	/**** Validate price*/
	$('#product-price').on('input', function(){
		const value = $(this).val();
		// keep £ on front;
		if(value.length == 0 || value.length < 2){
			$(this).val('£' + value);
			// prevent double £ symbol;
			if($(this).val().split('')[1] == '£'){
				$(this).val('£');
			}
		}
		// confirm with ENTER;
		$(this).on('keypress', function(e){
			if(e.charCode == 13) this.blur();
		});
		$(this).on('blur', () => TempJobsheet.priceA = Number($(this).val().split('£')[1]));
	});
	
	/*
	
	Week - tables
	
	*/
	
	/**** Create*/
	$(weekDays()).each((i, el) => {
		const NewObj = new TableObj();
		Tables.push(NewObj);
		$('#tables-container').append(NewObj.createTable(i));
	});
	// Append Week-total table to table-container;
	$('#tables-container').append(WeekTotalTable.weekTable());
	// set table height to it's parent element;
	setHeight();
	$(window).on('resize', setHeight);
	
	/**** Navigation*/
	$('.day-nav li').on('click', function(){
		const $currentTable = $('.single-day')[$(this).index()];
		$('.active-day').removeClass('active-day');
		$($currentTable).addClass('active-day');
		$('.active-nav').removeClass('active-nav');
		$(this).addClass('active-nav');
	});
	
	/**** Extra hours - subtotal*/
	$('#tables-container').on('mouseenter', function(e){
		e.stopImmediatePropagation();
		$('.active-day .extra-hours').on('input', function(ev){
			ev.stopImmediatePropagation();
			Tables[$('.active-day').index()].calcExtraHours();
			Tables[$('.active-day').index()].setExtraHours();	
		});
	});
	
	/*
	
	Average hourly rate
	
	*/
	
	$('#average-input').on('input', function(){
		WholeWeekData.hours = Number($(this).val());
		WholeWeekData.setAverageRate();
	});
	
	
	/*
	
	PDF creator
	
	*/
	
	/**** Hidden form - submit*/
	$('#generate-email').on('click', function(){
		Tables[$('.active-day').index()].replaceInputs();
		HiddenForm = new Form();
		HiddenForm.getPdfData();
		HiddenForm.submitForm();
	});

	
	
	
});