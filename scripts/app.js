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
	
	/**** Range/Size*/
	// available ranges; 
	TempJobsheet.getRanges();
	// range changed;
	$('#ranges').on('change', function(){
		const $selects = $('.sm-box').find('select');
		TempJobsheet.getSizes(this);
		$($selects).each((i, el) => {
			TempJobsheet.resetOptions($(el).attr('id'));
		});
	});
	// size changed;
	$('#sizes').on('change', function(){
		const $selected = $(this).children(':selected');
		const priceNum = parseFloat($($selected).attr('data-price'));
		TempJobsheet.size = $($selected).text();
		TempJobsheet.priceA = priceNum;
		TempJobsheet.setProductPrice(priceNum);			
	});
	/**** Extras*/
	// select extras;
	$('.sm-box select').each((i, el) => {
		$(el).on('mousedown', function(e){
			if(TempJobsheet.size == ''){
				// prevent open select element if no size chosen;
				e.preventDefault();
				this.blur();
				window.focus();
			}else {
				// select changed;
				$(this).on('change', function(){
					const dataIndex = $(this).children(':selected').attr('data-index');
					const name = $(this).attr('id');
					// get price for selected extras;
					TempJobsheet.getExtras(name, dataIndex);
				});
			}
		});
	});
	
	
	// End;
	/*
	
	Week - tables
	
	*/
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