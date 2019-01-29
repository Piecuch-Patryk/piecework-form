// New job sheet object;
class Job {
	constructor(){		
		this.invoice = '10293';
		this.range = '346';
		this.size = '346etr';
		this.priceA = 0;
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
			shelvings: [{
				size: '',
				qty: 0,
				price: 0,
				checked: false
			}],
			checked: false,
			calcShelvesPrice(){
				let price = 0;
				$(this.shelvings).each((i, el) => {
					if((el).checked){
						price += parseFloat(el.price) * el.qty / 100;
					}
				});
				return price;
			},
			calcExtrasTotal(){
				// map throught the shelves array and add all prices;
				const shelvesPrice = this.shelvings
				  .map(shelvings => shelvings.price)
				  .reduce((a, b) => a + b, 0);
				return parseFloat(this.base.price + this.guttering.price + this.waterbutt.price + this.calcShelvesPrice());
			}
		};
		this.row = $('<tr>');
		this.cell = $('<td>');
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
					const span = $('<span>').addClass('sm-cell-el').html(`${el.size}': x${el.qty} = £${price}`);
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
		// return row DOM object to prepend to tbody in active day table;
		return this.row;
	}
}
// Available ranges;
function Ranges(){}
// Date object with the latest Monday date;
function DatesCalc(){}
// Main table object;
function TableObj(){
	this.table = $('<table>')[0],
	this.thead = $('<thead>')[0],
	this.tbody = $('<tbody>')[0],
	this.rows = []
}
// create table elements;
TableObj.prototype.createTableEl = function(str){
	let $el;
	if(str == 'tr') {
		$el = $('<tr>')[0];
		$($el).addClass('row');
	}
	if(str == 'th') {
		$el = $('<th>')[0];
		$($el).addClass('column');
	}
	if(str == 'td')	{
		$el = $('<td>')[0];
		$($el).addClass('cell');
	}
	if(str == 'div') {
		$el = $('<div>')[0];
	}
	return $el;
}
// create columns;
TableObj.prototype.createColumns = function(data){
	const tr = this.createTableEl('tr');
	const cols = [];
	data.forEach((el, i) => {
		const th = this.createTableEl('th');
		th.textContent = el;
		cols.push(th);
	})
	cols.forEach((el, i) => {
		tr.appendChild(el);
	})
	return tr;
}
// create row;
TableObj.prototype.createRow = function (){
	const row = [];
	for(let iter = 0; iter <= 2; iter++){
		const tr = this.createTableEl('tr');
		const td = this.createTableEl('td');
		const td1 = td.cloneNode();
		const td2 = td.cloneNode();
		if(iter === 0){
			td1.innerHTML = 'Subtotal price A + B';
			td1.setAttribute('colspan', 6);
			tr.appendChild(td1);
			td.innerHTML = '£0.00';
			td.setAttribute('colspan', 1);
			$(td).addClass('cell-subtotal');
			tr.appendChild(td)
			row.push(tr);
		}
		if(iter === 1){
			td1.innerHTML = 'Extra hours worked at hourly rate (C)';
			td1.setAttribute('colspan', 3);
			tr.appendChild(td1);
			$(td2).append($('<label>Hours <input class="sm-input extra-hours" type="number" value="0" min="0" max="12" data-price="1232"></label>'));
			$(td2).append($('<label>Minutes<input class="sm-input extra-hours" type="number" value="0" min="0" max="30" step="30"></label>'));
			td2.setAttribute('colspan', 3);
			tr.appendChild(td2);
			td.innerHTML = '£0.00';
			td.setAttribute('colspan', 1);
			$(td).addClass('cell-subtotal');
			tr.appendChild(td);
			row.push(tr);
		}
		if(iter === 2){
			td1.innerHTML = 'Total A+B+C';
			td1.setAttribute('colspan', 6);
			tr.appendChild(td1);
			td.innerHTML = '£0.00';
			td.setAttribute('colspan', 1);
			tr.appendChild(td);
			row.push(tr);
		}
	};
	return row;
}
// title row;
TableObj.prototype.titleRow = function(index){
	const $row = $('<tr class="row">');
	const colspan = getColumns().length;
	const $td = $('<td class="cell" colspan="' + colspan + '">');
	const date = Datescalc.calcWeekDates();
	$($td).html(getDays(index) + ' ' + date[index]);
	$($row).addClass('hidden');
	$($row).append($td);
	return $($row)[0];
}
// create table;
TableObj.prototype.createTable = function(index){
	const div = this.createTableEl('div');
	this.thead.appendChild(this.titleRow(index));
	this.thead.appendChild(this.createColumns(getColumns()));
	this.table.appendChild(this.thead);
	this.createRow().forEach((el, i) => {		
		this.tbody.appendChild(el);
	})
	this.table.appendChild(this.tbody);
	this.table.classList.add('table');
	div.classList.add('single-day');
	div.appendChild(this.table);
	if(index == 0) div.classList.add('active-day');
	if(index == 0) div.style.display = 'block';
	return div;
}
// Get current TableObj;
TableObj.prototype._currentTableObj = function(){
		
	return this;
}
// create week total table;
class WeekTotal {
	constructor(){
		this.colNames = ['Day/Date', 'Invoice nos', 'Price A', 'Hourly', 'Price B', 'Day Total'];
		this.rowsNumber = 6;
	}
	row(){
		return $('<tr class="row">');
	}
	headerTable(){
		const $header = $('<thead>');
		const $row = this.row();
		$(this.colNames).each((i, el) => {
			const $th = $('<th class="column">');
			$($th).html(el);
			$($row).append($th);
		});
		$($header).append($row);
		return $header;
	}
	bodyTable(){
		const $body = $('<tbody>');
		let numberRows = this.rowsNumber;
		while(numberRows >= 0){
			const $newRow = this.row();
			// last row in table;
			if(numberRows == 0) {
				const $td = $('<td class="cell">');
				const $td2 = $('<td class="cell">');
				const lastStr = this.colNames;
				$($td).attr('colspan', 5);
				$($td).html('Week total (A + B)');
				$($td2).html('£').addClass('top-corner');
				$($newRow).append($td);
				$($newRow).append($td2);
				$($body).append($newRow);
			}else {
				$(this.colNames).each((i, el) => {
					const $td = $('<td class="cell cell-higher">');
					if(i == 2 || i == 4) $($td).html('£').addClass('top-corner');
					$($newRow).append($td);
				});
				$($body).append($newRow);
			}
			numberRows--;
		}		
		return $body;
	}
	weekTable(){
		const $table = $('<table class="table">');
		$($table).append(this.headerTable());
		$($table).append(this.bodyTable());
		$($table).addClass('hidden');
		return $table;
	}
}
// create email;
const createEmail = () => {
	const $content = $('#content-email');
	let $clone = $($content).clone();
	$clone = $($clone).find('table');
	const cols = [];
	const cells= [];
	const dates = [];
	const $box = $('<div style="padding: 1rem;">');
	let tables;
	
	// current week;
	$('.day-nav li span').each((i, el) => {
		dates.push($(el).text());
	});
	// iterate through each table; 
	$($clone).each((i, el) => {
		// table styles;
		if($(el).hasClass('table')){
			$(el).css({
				borderSpacing: 0,
				borderCollapse: 'collapse',
				border: '.1rem solid black',
				width: '90%',
				margin: 'auto'
			});
			cols.push($(el).find('th'));
			cells.push($(el).find('td'));
		}
	});
	$(cols).each((i, el) => {
		// column and cell styles;
		$(el).css({
			border: '.1rem solid black',
			minWidth: '3rem'
		})
	})
	$(cells).each((i, el) => {
		// column and cell styles;
		$(el).css({
			border: '.1rem solid black'
		})
	})
	$($clone).each((i, el) => {
		const $div = $('<div>');
		$($div).css({
			border: '.05rem solid rgba(0,0,0,.6)',
			borderRadius: '.1rem',
			padding: '0 .2rem .5rem .2rem',
			margin: '1rem 0'
		})
		$($div).append(`<h4>${getDays(i)} ${dates[i]}</h4>`);
		$($div).append(el.outerHTML);
		$($box).append($div);
	})
	
	
	$.ajax({
		type: 'POST',
		url: "../app_php/create_email.php",
		data: {
			dates: dates,
			text: $($box).html()
		},
		dataType: 'json',
		success: result=>{
			console.log(result);
		}
	});
}
// Create PDF file;
const createPDF = () => {
	const content = $('#tables-container').html();	
	const dates = [];	// current week dates array;
	$('.day-nav span').each((i, el) => {
		dates.push($(el).text());
	});		
	
	// Hidden form object; Needed to send data to PHP to create PDF file;
	class Form {
		constructor(){
			this.$form = $('<form action="../app_php/createPDF.php" method="POST">');
			this.$input_1 = $('<input type="hidden" name="content">');
			this.$input_2 = $('<input type="hidden" name="date">');
		}
		appendForm(){
			$(this.$form).append(this.$input_1);
			$(this.$form).append(this.$input_2);
			$('#hidden-pdf-form').html(this.$form);
		}
		submitForm(){
			this.$form.submit();
		}
	}
	const $form = new Form();
	$($form.$input_1).val(content);
	$($form.$input_2).val(dates);
	$form.appendForm();
	$form.submitForm();
}





