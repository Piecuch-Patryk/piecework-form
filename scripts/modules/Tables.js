class TableObj {
	constructor(){
		this.table = $('<table>')[0],
		this.thead = $('<thead>')[0],
		this.tbody = $('<tbody>')[0],
		this.rows = [],
		this.jobsSubtotal = 0;
		this.extraHours = 0;
		this.tableTotal = 0;
	}
	// create table elements;
	createTableEl(str){
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
	createColumns(data){
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
	createRow(){
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
				td1.innerHTML = 'Extra hours @ hourly rate (C)';
				td1.setAttribute('colspan', 3);
				tr.appendChild(td1);
				$(td2).append($('<span class="sm-wrap"><label><input class="sm-input extra-hours" type="number" value="0" min="0" max="12" data-price="1232">Hours</label></span>'));
				$(td2).append($('<span class="sm-wrap"><label><input class="sm-input extra-hours" type="number" value="0" min="0" max="30" step="30">Minutes</label></span>'));
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
				td.classList.add('table-total');
				tr.appendChild(td);
				row.push(tr);
			}
		};
		return row;
	}
	// title row;
	titleRow(index){
		const $row = $('<tr class="row">');
		const colspan = columns().length;
		const $td = $('<td class="cell" colspan="' + colspan + '">');
		const date = DatesObj.calcWeekAhead();
		$($td).html(weekDays(index) + ' ' + date[index]);
		$($row).addClass('hidden');
		$($row).append($td);
		return $($row)[0];
	}
	// create table;
	createTable(index){
		const div = this.createTableEl('div');
		this.index = index;
		this.thead.appendChild(this.titleRow(index));
		this.thead.appendChild(this.createColumns(columns()));
		this.table.appendChild(this.thead);
		this.createRow().forEach((el, i) => {		
			this.tbody.appendChild(el);
		})
		this.table.appendChild(this.tbody);
		this.table.classList.add('table');
		div.classList.add('single-day');
		div.appendChild(this.table);
		if(index == 0) div.classList.add('active-day');
		return div;
	}
	// return current object;
	currentTableObj(){
		return this;
	}
	// set subtotal A + B;
	setSubtotalAB(){
		$('.active-day tbody').find('.cell-subtotal').first().html(`£${this.jobsSubtotal.toFixed(2)}`);
		this.setTotal();
	}
	// calculate extras hours total;
	calcExtraHours(){
		this.extraHours = 0;
		const $inputs = $('.active-day .extra-hours');
		const rate = $($inputs[0]).attr('data-price');
		let val = 0;
		val += Number($($inputs[0]).val());
		if($($inputs[1]).val() > 0) val += 0.5;
		val = val * Number(rate / 100);
		this.extraHours = Number(val).toFixed(2);
		return this.extraHours;
	}
	// set extras hours total;
	setExtraHours(){
		$('.active-day .cell-subtotal').last().html(`£${this.calcExtraHours()}`);
		this.setTotal();
	}
	// calculate table total price;
	calcTotal(){
		const sum = Number(this.jobsSubtotal) + Number(this.extraHours);
		return sum.toFixed(2);
	}
	// set total price in the price cell;
	setTotal(){
		$('.active-day .table-total').html(`£${this.calcTotal()}`);
	}
	// replace input[type=number] with it's value only - PDF purpose;
	replaceInputs(){
		$('.extra-hours').each((i, el) => $(el).replaceWith(' ' + $(el).val() + ' '));
	}
	// remove chosen from from database;
	removeRowDB(ev){
		const invoice = $(ev.target).parent().text();
		$.ajax({
			type: 'POST',
			url: '../app_php/update_job_row/removeJobRow.php',
			data: {
				invoice: invoice
			},
			dataType: 'json'
		});
	}
	// remove all rows from DOM;
	removeRows(index){
		const $table = $('.single-day');
		$('.active-day').removeClass('active-day');
		$($table[index])
			.addClass('active-day')
			.find('.row-job').remove();
		Tables.fill(new TableObj(), index, index + 1);
		this.setSubtotalAB();
		WholeWeekData.setGross();
		WholeWeekData.setNet();
		WholeWeekData.setAverageRate();
	}
}