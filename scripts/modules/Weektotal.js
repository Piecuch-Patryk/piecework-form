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
		const $titleRow = this.row();
		const $cell = $('<td class="cell">');
		const $row = this.row();
		$($cell).html('Weekly summary');
		$($cell).attr('colspan', this.colNames.length);
		$($titleRow).append($cell);
		$(this.colNames).each((i, el) => {
			const $th = $('<th class="column">');
			$($th).html(el);
			$($row).append($th);
		});
		$($header).append($titleRow);
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
					const $td = $('<td class="cell cell-taller">');
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
		const $div = $('<div>');
		$($table).append(this.headerTable());
		$($table).append(this.bodyTable());
		$($div).addClass('hidden').append($table);
		return $div;
	}
}