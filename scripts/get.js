// 	Get available ranges from database;
const getRanges = () => {
	$.ajax({
        type: 'GET',
        url: "../app_php/getRanges.php",
        data: {ranges: true},
        dataType: 'json',
        success: result => {
			setRanges(result);
        }
    });
}
// Get current range sizes from database;
const getSizes = function(el){
	const current = $(el).children(':selected').html();
	if(current != $(el).children().first().html()){
		$.ajax({
			type: 'GET',
			url: "../app_php/getSizes.php",
			data: {
				range: current
			},
			dataType: 'json',
			success: result=>{
				setSizeOptions(result);
			}
		});
	}
}
// get chosen base price;
function getBasePrice(){
	// 
	
	const size = $('#sizes').children(':selected').html();
	const type = $(this).children(':selected').html();

	if((size != $(this).children().first().html()) && (type != '--please select--')){
		$.ajax({
			type: 'GET',
			url: "../app_php/getBasePrice.php",
			data: {
				size: size,
				base: type
			},
			dataType: 'json',
			success: result => {
				let price = result[0].price / 100;
				jobSheet.extras.base.price = price;
				jobSheet.extras.base.name = result[0].size;
				jobSheet.extras.base.type = type;
				jobSheet.extras.base.checked = true;
				jobSheet.extras.checked = true;
				price = price.toFixed(2);
				setPrice(`£${price}`, this);
				setExtrasTotal();
			}
		});   
	}else {
		jobSheet.extras.base.price = 0;
		jobSheet.extras.base.name = '';
		jobSheet.extras.base.type = '';
		jobSheet.extras.base.checked = false;
		jobSheet.extras.checked = false;
		
		setPrice(false, this);
		setExtrasTotal();
	}
}
// Get chosen guttering price;
function getGutterPrice(){
	const size = $('#sizes').children(':selected').html().split('x');
	const type = $(this).children(':selected').html();
	const qty = $(this).children(':selected').attr('data-qty');

	if((size != $(this).children().first().html()) && (type != '--please select--')){
		$.ajax({
			type: 'GET',
			url: "../app_php/getGuttering.php",
			data: {
				gutter: size[0]
			},
			dataType: 'json',
			success: result => {
				let price = result[0].price / 100 * qty;
				jobSheet.extras.guttering.price = price;
				jobSheet.extras.guttering.qty = qty;
				jobSheet.extras.guttering.checked = true;
				price = price.toFixed(2);
				setPrice(`£${price}`, this);
				setExtrasTotal();
			}
		});   
	}else {
		jobSheet.extras.guttering.price = 0;
		jobSheet.extras.guttering.qty = 0;
		jobSheet.extras.guttering.checked = false;
		setPrice(false, this);
		setExtrasTotal();
	}
}
// Get chosen waterbutt price;
function getWaterbuttPrice(){
	const size = $('#sizes').children(':selected').text();
	const qty = $(this).children(':selected').attr('data-qty');
	const type = $(this).children(':selected').text();
	// access only if any size chosen and waterbutt selected (one or two), not for '--please select--';
	if((size != $('#sizes').children().first().html()) && (type != $(this).children().first().text())){
		$.ajax({
			type: 'GET',
			url: "../app_php/getWaterbutt.php",
			data: {
				waterbutt: true
			},
			dataType: 'json',
			success: result => {
				let price = result[0].price / 100 * qty;
				jobSheet.extras.waterbutt.price = price;
				jobSheet.extras.waterbutt.qty = qty;
				jobSheet.extras.waterbutt.checked = true;
				price = price.toFixed(2);
				setPrice(`£${price}`, this);
				setExtrasTotal();
			}
		});
	}else {
		jobSheet.extras.waterbutt.qty = 0;
		jobSheet.extras.waterbutt.price = 0;
		jobSheet.extras.waterbutt.checked = false;
		setPrice(false, this);
		setExtrasTotal();
	}
}
// Get shelves prices from database;
const getShelvesPrices = () => {
    $.ajax({
        type: 'GET',
        url: "../app_php/getShelves.php",
        data: {
            shelves: true
        },
        dataType: 'json',
        success: result => {
			setShelvesPrices(result);
        }
    });   
}
// get colums;
const getColumns = () => {
	return ['Invoice', 'Range', 'Size', 'Price A', 'Extras', 'Price B', 'Subtotal'];
}
// get data;
// const getData = () => {
	// const data = [
	// [21039, 'popular', '6x6', '£10.33', '-----', '£0.00', '£17.35'],
	// [21039, 'popular', '6x6', '£10.33', '-----', '£0.00', '£11.46'],
	// [21039, 'popular', '6x6', '£10.33', '-----', '£0.00', '£13.32'],
	// [21039, 'popular', '6x6', '£10.33', '-----', '£0.00', '£14.43'],
	// ]
	// return data;
// }
// get days;
const getDays = i => {
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	if(i >= 0)
		return days[i];
	else
		return days;
}