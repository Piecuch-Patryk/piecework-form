const DatesObj = new Dates();
let TempJobsheet = new Job();
const Tables = [];



// DOM loaded;
document.addEventListener('DOMContentLoaded', function(){
	// set the date of last Monday;
	DatesObj.setLastMonday();
	
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
		TempJobsheet.extras.shelvings.resetDefalut();
		TempJobsheet.extras.setExtrasTotal()
		TempJobsheet.setJobTotal();
	});
	// size changed;
	$('#sizes').on('change', function(){
		const $selected = $(this).children(':selected');
		if($($selected).text() == $(this).children().first().text()){
			// '--please select--' selected;
			TempJobsheet.size = '';
			TempJobsheet.priceA = 0;
			TempJobsheet.setProductPrice();
		}else {
			// size selected;
			const priceNum = parseFloat($($selected).attr('data-price'));
			TempJobsheet.size = $($selected).text();
			TempJobsheet.setProductPrice(priceNum);
		}
		TempJobsheet.extras.shelvings.resetDefalut();
		TempJobsheet.extras.setExtrasTotal()
		TempJobsheet.resetOptions();
		TempJobsheet.setJobTotal();
	});
	/**** Extras*/
	// select extras;
	$('.sm-box select').each((i, el) => {
		$(el).on('mousedown', function(e){
			if(TempJobsheet.size == ''){
				// prevent open select element if no size chosen;
				e.preventDefault();
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
	
	/**** Shelves*/
	// get and set prices;
	TempJobsheet.extras.shelvings.getShelvesData();
	// toggle display;
	$('#shelves-btn').on('click', () => {
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
			TempJobsheet.resetDOMelements();
			TempJobsheet = new Job();
			// reset invoice bgc;
			$('#invoice').css('background-color', 'transparent');
		}
	});
	// End;
	/*
	
	Week - tables
	
	*/
	// create tables and append to DOM;
	$(weekDays()).each((i, el) => {
		const NewObj = new TableObj();
		Tables.push(NewObj);
		$('#tables-container').append(NewObj.createTable(i));
	});
	// set table height to it's parent element;
	setHeight();
	$(window).on('resize', setHeight);
	
	
	
	// End
	
	
	
	
	
});