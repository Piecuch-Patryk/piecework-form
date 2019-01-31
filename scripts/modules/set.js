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