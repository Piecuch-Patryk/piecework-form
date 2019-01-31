// New job sheet object;
class Job {
	constructor(){		
		this.invoice = '10293';
		this.range = 'popular';
		this.size = '6x4';
		this.priceA = 0;
		this.row = $('<th>');
		this.cell = $('<td>');
		this.option = $('<option>').attr('data-price', 0);
		this.optionDefault = $(this.option).clone().html('--please select--');
		this.extras = {
			base: {
				name: '',
				type: '',
				checked: false,
				price: 0
			},
			guttering: {
				qty: 0,
				price: 0,
				checked: false
			},
			waterbutt: {
				qty: 0,
				price: 0,
				checked: false
			},
			shelvings: {
				constructor(){
					this.size = '';
					this.qty = 0;
					this.price = 0;
					this.checked = false;
					this.checked = false;
				},
				calcShelvesPrice(){
					let price = 0;
					$(this.shelvings).each((i, el) => {
						if(el.checked){
							price += parseFloat(el.price) * el.qty / 100;
						}
					});
					return price;
				}
			},
			calcExtrasTotal(){
				// map throught the shelves array and add all prices;
				const shelvesPrice = this.shelvings
					.map(shelvings => shelvings.price)
					.reduce((a, b) => a + b, 0);
				return parseFloat(this.base.price + this.guttering.price + this.waterbutt.price + this.calcShelvesPrice());
			}
		};
		this.availableRanges = [];
	}
	// job total price;
	calcJobTotal(){
		return parseFloat(this.priceA + this.extras.calcExtrasTotal());
	}
	// prepend to table body;
	prependRow(){		
		$(this.cell).clone().html(this.invoice).addClass('cell').appendTo(this.row);
		$(this.cell).clone().html(this.range).addClass('cell').appendTo(this.row);
		$(this.cell).clone().html(this.size).addClass('cell').appendTo(this.row);
		$(this.cell).clone().html(`£${this.priceA.toFixed(2)}`).addClass('cell').appendTo(this.row);
		// extras;
		if(this.extras.checked) {
			const $cell = $(this.cell).clone();
			// base;
			if(this.extras.base.checked){
				$($cell).append($('<span>').addClass('sm-cell-el').html(`${this.extras.base.type}: £${this.extras.base.price.toFixed(2)}`));				
			}
			// guttering;
			if(this.extras.guttering.checked){
				$($cell).append($('<span>').addClass('sm-cell-el').html(`guttering x${this.extras.guttering.qty}: £${this.extras.guttering.price.toFixed(2)}`));				
			}
			// waterbutt;
			if(this.extras.waterbutt.checked){
				$($cell).append($('<span>').addClass('sm-cell-el').html(`waterbutt x${this.extras.waterbutt.qty}: £${this.extras.waterbutt.price.toFixed(2)}`));				
			}
			// shelves;
			const arr = [];
			$(this.extras.shelvings).each((i, el) => {
				if(el.checked){
					let price = el.price * el.qty / 100;
					price = price.toFixed(2);
					const span = $('<span>').addClass('sm-cell-el').html(`shelving ${el.size}': x${el.qty} = £${price}`);
					arr.push(span);
				}
			});
			$(arr).each((i, el) => {
				$(el).appendTo($cell);
			});

			// ***
			$($cell).addClass('cell flex-cell');
			$($cell).appendTo(this.row);
		}else {
			$(this.cell).clone().html('none').addClass('cell').appendTo(this.row)
		}
		// extras total;
		$(this.cell).clone().html('£' + this.extras.calcExtrasTotal().toFixed(2)).addClass('cell').appendTo(this.row);
		$(this.cell).clone().html('£' + this.calcJobTotal().toFixed(2)).addClass('cell').appendTo(this.row);
		//
		
		$(this.row).addClass('row row-job');
		// returns row DOM object to prepend to tbody in active day table;
		return this.row;
	}
	// get available ranges from database;
	getRanges(){
		$.ajax({
				type: 'GET',
				url: "../app_php/getRanges.php",
				data: {ranges: true},
				dataType: 'json',
				success: data => setOptions(data, 'ranges')
		});
	}
	// get available sizes for current range;
	getSizes(){
		const range = $(this).children(':selected').text();
		// range selected;
		if(range != $(this).children().first().html()){
			$.ajax({
					type: 'GET',
					url: "../app_php/getSizes.php",
					data: {range: range},
					dataType: 'json',
					success: data => setOptions(data, 'sizes')
			});
		}else {
			// range not selected;
			TempJobsheet.resetOptions('sizes');
			TempJobsheet.setProductPrice();
		}
	}
	// set product price when size has been chosen;
	setProductPrice(priceNum){
		const $container = $('#product-price');
		let price;
		// if none value was given - reset to 0.00;
		if(!priceNum) price = `£0.00`;
		else price = `£${parseFloat(priceNum / 100).toFixed(2)}`;
		$($container).val(price);
	}
	// reset inputs;	id=ranges/sizes;
	resetOptions(id){
		$(`#${id}`).html($(this.optionDefault));
	}
}