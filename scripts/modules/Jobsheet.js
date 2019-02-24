// New job sheet object;
class Job {
	constructor(){		
		this.invoice = '';
		this.range = '';
		this.size = '';
		this.priceA = 0;
		this.row = $('<tr>');
		this.cell = $('<td>');
		this.option = $('<option>').attr('data-price', 0);
		this.optionDefault = $(this.option).clone().html('--please select--');
		this.extras = {
			checked: 0,
			base: {
				type: '',
				checked: false,
				price: 0
			},
			gutter: {
				qty: 0,
				price: 0,
				checked: false
			},
			waterbutt: {
				qty: 0,
				price: 0,
				checked: false
			},
			coritec: {
				price: 0,
				checked: false
			},
			shelvings: {
				checked: 0,
				shelves: [],
				calcSingleShelv(obj){
					const qty = $(obj).val();
					const price = $(obj).attr('data-price');
					return qty * price;					
				},
				calcShelvesPrice(){
					let sum = 0;
					$(this.shelves).each((i, el) => {
						sum += parseFloat(el.price * el.qty / 100);
					});					
					return sum.toFixed(2);
				},
				toggleShelvesSestion(){
					const $section = $('.hidden-wrap');
					const $cover = $('.very-top-cover');
					if($($section).is(':hidden')){
						$($section).fadeIn(500);
						$($cover).css('display', 'block');
					}else {
						$($section).fadeOut(500);
						$($cover).css('display', 'none');
					}
				},
				updateShelves(){
					const $inputs = $('.hidden-wrap').find('input[type="number"]');
					const array = [];
					// clear exisisting shelv's objects;
					this.shelves = [];
					$($inputs).each((i, el) => {
						if($(el).val() > 0){
							const size = $(el).parent().text().split(' ')[0];
							class Shelv {
								constructor(){
									this.size = size;
									this.qty = $(el).val();
									this.price = $(el).attr('data-price');
								}
							}
							array.push(new Shelv());
						}
					});
					if(array.length > 0) this.checked = 1;
					else this.checked = 0;
					return array;
				},
				getShelvesData(){
					const self = this;
					$.ajax({
						type: 'GET',
						url: "../app_php/getters/getShelves.php",
						data: {
								shelves: true
						},
						dataType: 'json',
						success: function(result){
							setShelvesPrices(result);
						}
					});
				},
				setShelvesPrices(result){
					const $inputs = $('.hidden-wrap').find('input[type="number"]');
					$($inputs).each((i, el) => {
						$(el).attr({
							'data-price': result[i].price
						});
					});
				},
				setSingleshelvPrice(obj){
					const $priceBox = $(obj).closest('.sm-box').find('input[type="text"]');
					const sum = this.calcSingleShelv(obj) / 100;
					$($priceBox).val(`£${sum.toFixed(2)}`);
				},
				setShelvesPrices(){
					const $priceBox = $('#shelves-total');
					$($priceBox).val(`£${this.calcShelvesPrice()}`);
				},
				resetDefalut(){
					this.shelves = [];
					$('.hidden-wrap input[type="number"]').val(0);
					this.setShelvesPrices();
				}
			},
			calcExtrasTotal(){
				let sum = parseFloat(Number(this.base.price / 100) + Number(this.gutter.price / 100) + Number(this.waterbutt.price / 100) + Number(this.shelvings.calcShelvesPrice()) + Number(this.coritec.price / 100));
				return sum.toFixed(2);
			},
			setExtrasPrice(name){
				const $box = $(`#${name}`).closest('.sm-box').find('input[type="text"]');
				const price = parseFloat(this[name].price / 100);
				$($box).val(`£${price.toFixed(2)}`);
				this.setExtrasTotal();
			},
			setExtrasTotal(){
				$('#extras-total').val(`£${this.calcExtrasTotal()}`);
			}
		};
		this.databaseResult = [];
	}
	// job total price;
	calcJobTotal(){
		return parseFloat(Number(this.priceA) + Number(this.extras.calcExtrasTotal()));
	}
	// set job total price;
	setJobTotal(){
		let sum;
		if(!$.isNumeric(this.calcJobTotal())) sum = 0;
		else sum = this.calcJobTotal();
		$('#total').val(`£${sum.toFixed(2)}`);
	}
	// prepend to table body;
	prependRow(){
		const $newRow = $(this.row).clone();
		const currentIndex = $('.active-day').index();

		$(this.cell).clone().html(this.invoice).append($('<i>').addClass('far fa-trash-alt')).addClass('cell cell-invoice').appendTo($newRow);
		$(this.cell).clone().html(this.range).addClass('cell').appendTo($newRow);
		$(this.cell).clone().html(this.size).addClass('cell').appendTo($newRow);
		$(this.cell).clone().html(`£${this.priceA.toFixed(2)}`).addClass('cell').appendTo($newRow);
		
		// extras;
		if(this.extras.checked || this.extras.shelvings.checked) {
			const $div = $('<div>');
			const $cell = $(this.cell).clone();
			// base;
			if(this.extras.base.checked){
				$($div).append($('<span>')
											 .addClass('sm-cell-el')
											 .html(`${this.extras.base.type}: £${Number(this.extras.base.price / 100).toFixed(2)}`));				
			}
			// guttering;
			if(this.extras.gutter.checked){
				$($div).append($('<span>')
											 .addClass('sm-cell-el')
											 .html(`guttering x${this.extras.gutter.qty}: £${Number(this.extras.gutter.price / 100).toFixed(2)}`));				
			}
			// waterbutt;
			if(this.extras.waterbutt.checked){
				$($div).append($('<span>')
											 .addClass('sm-cell-el')
											 .html(`waterbutt x${this.extras.waterbutt.qty}: £${Number(this.extras.waterbutt.price / 100).toFixed(2)}`));				
			}
			// coritec;
			if(this.extras.coritec.checked){
				$($div).append($('<span>')
											 .addClass('sm-cell-el')
											 .html(`cori-tec: £${Number(this.extras.coritec.price / 100).toFixed(2)}`));
			}
			// shelves;
			const arr = [];
			if(this.extras.shelvings.checked){
				$(this.extras.shelvings.shelves).each((i, el) => {
						const price = el.price * el.qty;
						const span = $('<span>')
														.addClass('sm-cell-el')
														.html(`shelving ${el.size}: x${el.qty} = £${Number(price / 100).toFixed(2)}`);
						arr.push(span);
				});
			}
			$(arr).each((i, el) => {
				$(el).appendTo($div);
			});
			$($div).addClass('flex-cell');
			$($cell).addClass('cell').append($div);
			$($cell).appendTo($newRow);
		}else {
			$(this.cell).clone().html('none').addClass('cell').appendTo($newRow);
		}
		// extras total;
		$(this.cell).clone().html('£' + Number(this.extras.calcExtrasTotal()).toFixed(2)).addClass('cell').appendTo($newRow);
		$(this.cell).clone().html('£' + this.calcJobTotal().toFixed(2)).addClass('cell').appendTo($newRow);
		$($newRow).addClass('row row-job');
		
		// update subtotal A+B in current table;
		Tables[currentIndex].jobsSubtotal += this.calcJobTotal();
		Tables[currentIndex].setSubtotalAB();

		return $newRow;
	}
	removeRow(price){
		const currentIndex = $('.active-day').index();		
		Tables[currentIndex].jobsSubtotal -= Number(price);
		Tables[currentIndex].setSubtotalAB();
	}
	// get available ranges from database;
	getRanges(){
		$.ajax({
				type: 'GET',
				url: "../app_php/getters/getRanges.php",
				data: {ranges: true},
				dataType: 'json',
				success: data => setOptions(data, 'ranges')
		});
	}
	// get available sizes for current range;
	getSizes(obj){		//obj = this;
		const range = $(obj).children(':selected').text();
		// range selected;
		if(range != $(obj).children().first().html()){
			$.ajax({
					type: 'GET',
					url: "../app_php/getters/getSizes.php",
					data: {range: range},
					dataType: 'json',
					success: data => setOptions(data, 'sizes')
			});
		}
		TempJobsheet.resetSpecificOption('sizes');
		TempJobsheet.resetOptions();
		TempJobsheet.setProductPrice();
	}
	// Get extras price;
	getExtras(name, dataIndex){
		let size, data, qty;
		switch(name){
			case 'base':
				size = this.size;
				if(dataIndex == 1) data = 'bearers';
				else if (dataIndex == 2) data = 'easy-base';
				dataIndex = 0;
				break;
			case 'coritec':
				size = this.size;
				data = 'coritec';
				break;
			case 'gutter':
				size = this.size.split('x')[0];
				data = 'guttering';
				qty = dataIndex;
				break;
			case 'waterbutt':
				size = 1;
				data = 'waterbutt';
				qty = dataIndex;
				break;
		}
		$.ajax({
			type: 'GET',
			url: "../app_php/getters/getExtras.php",
			data: {
				size: size,
				data: data
			},
			dataType: 'json',
			success: function(result){
				// base only;
				if(dataIndex == 0){
					TempJobsheet.extras[name].type = data;
					TempJobsheet.extras[name].price = result[0].price;
				}
				// cori-tec only;
				if(name == 'coritec'){
					TempJobsheet.extras[name].price = result[0].price;
				}
				// gutter and waterbutt only;
				if(dataIndex > 0){
					TempJobsheet.extras[name].qty = dataIndex;
					TempJobsheet.extras[name].price = qty * result[0].price;					
				}
				// update current job sheet obj;
				TempJobsheet.extras[name].checked = true;
				TempJobsheet.extras[name].size = size;
				TempJobsheet.extras.setExtrasPrice(name);
				TempJobsheet.setJobTotal();
			}
		});
	}
	// set product price when size has been chosen;
	setProductPrice(priceNum){
		const $container = $('#product-price');
		this.priceA = priceNum / 100;
		let price;
		// if none value was given - reset to 0.00;
		if(!priceNum) price = `£0.00`;
		else price = `£${parseFloat(priceNum / 100).toFixed(2)}`;
		$($container).val(price);
	}
	// reset one specific option to default;
	resetSpecificOption(name){
		// size only;
		if(name == 'sizes'){
			TempJobsheet.size = '';
			$(`#${name}`).html($(this.optionDefault));
		}else {
			$(`#${name}`).prop('selectedIndex', 0);
			this.resetSheetValues(name);
		}
	}
	// reset selected options to default;
	resetOptions(){
		// reset all extras;
		const $selects = $('.sm-box').find('select');
		$($selects).each((i, el) => {
			const name = $(el).attr('id');
			$(`#${name}`).prop('selectedIndex', 0);
			this.resetSheetValues(name);
		});
	}
	// reset values;
	resetSheetValues(name){
		// base only;
		if(!this.extras[name].qty) {
			this.extras[name].type = '';
			this.extras[name].checked = false;
		}
		// gutter and waterbutt;
		else this.extras[name].qty = 0;
		this.extras[name].checked = false;
		this.extras[name].size = '';
		this.resetPrice(name);
		this.extras.setExtrasPrice(name);
	}
	// reset extras price;
	resetPrice(name){
		this.extras[name].price = 0;
	}
	resetDOMelements(){
		const $manualInputs = $('.manual-input');
		this.resetSpecificOption('sizes');
		$('#jobsheet select').each((i, el) => $(el).prop('selectedIndex', 0));
		$('#jobsheet input[type="text"]').not('.manual-input').val('£0.00');
		$('#jobsheet .manual-input').each((i, el) => $(el).val(''));
		$('#jobsheet .hidden-wrap input[type="number"]').val(0);
		$('#invoice').val('');
		$('.select').each((i, el) => {
			// show selects;
			if($(el).hasClass('hidden')){
				$(el).removeClass('hidden');
				$($manualInputs[i]).addClass('hidden');
			}
		});
		$('#product-price').prop('readonly', true);
		$('#coritec').prop('disabled', true);
	}
	// enable/disable checkbox;
	toggleCheckbox(bool){
		// disabled;
		if(bool == false || this.range == 'heavy-duty' || this.range == 'ryton') $('#coritec').attr('disabled', true);
		// enabled;
		else $('#coritec').prop('disabled', false);
		
		$('#coritec').prop('checked', false);
	}
	currentWeekDate(){
		return $('.active-nav span').text().split('-').reverse().join('-');
	}
	// insert current job to database;
	insertJobRow(){
		const jsonBase = JSON.stringify(this.extras.base);
		const jsonGuttering = JSON.stringify(this.extras.gutter);
		const jsonWaterbutt = JSON.stringify(this.extras.waterbutt);
		const jsonCoritec = JSON.stringify(this.extras.coritec);
		const jsonShelves = JSON.stringify(this.extras.shelvings.shelves);
		
		$.ajax({
			type: 'POST',
			url: '../app_php/update_job_row/saveJobRow.php',
			data: {
				invoice: this.invoice,
				range: this.range,
				size: this.size,
				price: this.priceA * 100,
				extras: this.extras.checked,
				shelvesChecked: this.extras.shelvings.checked,
				base: jsonBase,
				guttering: jsonGuttering,
				waterbutt: jsonWaterbutt,
				coritec: jsonCoritec,
				shelves: jsonShelves,
				date: this.currentWeekDate()
			},
			dataType: 'json',
		});
	}
	// prepare jobsheet based on database result;
	prepareTempJob(){
		const $tableDay = $('.single-day');
		
		$(this.databaseResult).each((i, el) => {
			if(el.length > 0){
				// data exist in array;
				$('.active-day').removeClass('active-day');
				$($tableDay[i]).addClass('active-day');
				$(el).each((index, row) => {
					// prepare values;
					this.invoice = row.invoice;
					this.range = row.rangeType;
					this.size = row.size;
					this.priceA = row.price / 100;
					this.extras.checked = row.extras;
					this.extras.base = JSON.parse(row.base);
					this.extras.gutter = JSON.parse(row.guttering);
					this.extras.waterbutt = JSON.parse(row.waterbutt);
					this.extras.coritec = JSON.parse(row.coritec);
					this.extras.shelvings.checked = row.shelvesChecked;
					this.extras.shelvings.shelves = JSON.parse(row.shelves);
					$($tableDay[i]).find('tbody').prepend(this.prependRow());
					WholeWeekData.setGross();
					WholeWeekData.setNet();
					WholeWeekData.setAverageRate();
					Tables[i].rows.push(this.prependRow());
					TempJobsheet = new Job();
				});
			}
			$('.active-day').removeClass('active-day');
			$($tableDay[0]).addClass('active-day');
			$('.active-nav').removeClass('active-nav');
			$('.day-nav').find('li').first().addClass('active-nav');
			setHeight();
		});
	}
}





