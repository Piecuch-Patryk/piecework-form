const DatesObj = new Dates();
let TempJobsheet = new Job();



// DOM loaded;
document.addEventListener('DOMContentLoaded', function(){
	// set the date of last Monday;
	DatesObj.setLastMonday();
	
	/*
	
	Job sheet form
	
	*/
	/**** Invoice*/
	
	/**** Range/Size*/
	// available ranges; 
	TempJobsheet.getRanges();
	// range changed;
	$('#ranges').on('change', TempJobsheet.getSizes);
	// size changed;
	$('#sizes').on('change', function(){
		const $selected = $(this).children(':selected');
		const priceNum = parseFloat($($selected).attr('data-price'));
		TempJobsheet.priceA = priceNum;
		TempJobsheet.setProductPrice(priceNum);			
	});
	/**** Extras*/
	
	
	
	// End;
	
	
	
	
	
});