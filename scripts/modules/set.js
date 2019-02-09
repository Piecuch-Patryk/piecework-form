// set available ranges or sizes in DOM;	data=from database, id=ranges/sizes;
function setOptions(data, id){
	const $container = $(`#${id}`);
	$($container).html($(TempJobsheet.optionDefault).clone());
	$(data).each((i, el) => {
		const $option = $(TempJobsheet.option).clone();
		if($.type(el) == 'object'){
			// sizes only;
			$($option)
				.attr('data-price', el.price)
				.text(el.size);
		}else {
			// ranges only;
			$($option).text(el);
		}
		$($container).append($option);
	});
}
// set price attribute to every shelv element;
function setShelvesPrices(result){
	const $inputs = $('.hidden-wrap').find('input[type="number"]');
	$($inputs).each((i, el) => {
		$(el).attr({
			'data-price': result[i].price
		});
	});
}
// set table height to days-wrap;
function setHeight(){
	const $activeDay = $('.active-day').closest('.tables-wrap');
	const height = $($activeDay).find('.active-day').find('table').css('height');
	$($activeDay).animate({
		height: height
	}, 150);
}