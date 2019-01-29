// Set total price in active table;
function setDayTotal(){
	const $priceBox = $('.active-day').find('.cell').last();
	let sum = 0;
	$('.active-day').find('.cell-subtotal').each((i, el) => {
		let price = $(el).text();
		price = price.split('£')[1];
		sum += parseFloat(price);
	});
	$($priceBox).html('£' + sum.toFixed(2));
}
// Set extra-hours price;
function setExtraHoursPrice(element){
	const $priceBox = $(element).closest('.row').find('.cell').last();
	let rate = 0;
	let sum = 0;
	$(element).closest('td').find('input[type="number"]').each((i, el) => {
		if($(el).attr('data-price')){
			rate = $(el).attr('data-price') / 100;
		}
		let price = 0;
		if($(el).val() == 30){
			sum += 0.5;	
		}else {
			sum += parseFloat($(el).val());
		}
	});
	sum = sum * rate;
	$($priceBox).html('£' + sum.toFixed(2));
	setDayTotal();
}
// Set total sum for current table;
function setTotalJobRows(){
	let sum = 0;
	$('.active-day').find('.row-job').each((i, el) => {
		let price = $(el).find('.cell').last().html();
		price = price.split('£')[1];
		sum += parseFloat(price);
	});
	$('.active-day').find('.cell-subtotal').first().html('£' + sum.toFixed(2));
	setDayTotal();
}
// Set shelves prices as an attributes of input[type="number"];
function setShelvesPrices(result){
	$('.hidden-wrap').find('input[type="number"]').each((i, el) => {
		$(el).attr('data-price', result[i].price);
	});
}
// Set total price;
function setTotal(){
	const total = jobSheet.calcJobTotal();
	$('#total').val(`£${total.toFixed(2)}`);
}
// Set extras total price;
function setExtrasTotal(){
	const total = jobSheet.extras.calcExtrasTotal();
	$('#extras-total').val(`£${total.toFixed(2)}`);
	setTotal();
}
// Set price in chosen extras;
function setPrice(price, el){
	if(!price){		
		$(el).parent().next().find('input[type="text"]').val('£0.00');
		$(el).children(':selected').prop('selected', false);	// reset option to default;
	}else {
		$(el).parent().next().find('input[type="text"]').val(price);
	}
}
// Set available ranges in <select> element;
const setRanges = result => {
	const $container = $('#ranges');
	$($container).html('');
	$($container).html($('<option>').html('--please select--'));
	$(result).each((i, el) => {
		const $option = $('<option>');
		$($option).html(el);
		$($container).append($option);
	});
}
// Set available sizes of current range;
const setSizeOptions = result => {
	const $container = $('#sizes');
	$($container).html('');
	$($container).html($('<option>').html('--please select--'));
	$(result).each((i, el) => {
		const $option = $('<option>');
		$($option).attr('data-price', el.price);
		$($option).html(el.size);
		$($container).append($option);
	});
}
// set table height to days-wrap;
const setHeight = () => {
	const $activeDay = $('.active-day').closest('.tables-wrap');
	const height = $($activeDay).find('.active-day').find('table').css('height');
	$($activeDay).css('height', height);
}
// set a chosen day as visibile;
const setCurrentDay = function(){
	const $li = $(this).closest('ul').find('li'),
		currentIndex = $($li).index(this),
		$days = $('.single-day');
	// current nav;
    $(this).closest('ul').find('.active-nav').removeClass('active-nav');
    $($li[currentIndex]).addClass('active-nav');
    // current day;
		// hide;
    $('.active-day').removeClass('active-day');
		// show chosen one;
		$($days[currentIndex]).addClass('active-day');
		setHeight();
}
// set last monday date in the input date;
const setLastMonday = () => {
	var date = new Date();
	date.setDate(date.getDate() - (date.getDay() + 6) % 7);
	const $dateField = $('.private-header input[type="date"]');
	const day = ("0" + date.getDate()).slice(-2);
	const month = ("0" + (date.getMonth() + 1)).slice(-2);
	date = date.getFullYear()+"-"+(month)+"-"+(day) ;
	$($dateField).val(date);
}
// set dates in days navigation;
DatesCalc.prototype.setDates = function (){
	const dates = this.calcWeekDates();
	const $boxes = $('.day-nav li span');
	$(dates).each((i, el) => {
		$($boxes[i]).html(el);
	});
}













