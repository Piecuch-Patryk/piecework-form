class WeekTotal {
	constructor(){
		this.hours = 40;
	}
	calcGross(){
		let sum = [];
		$(Tables).each((i, el) => {
			sum.push(Number(el.calcTotal()));
		});
		return sum.reduce((a, b) => a + b, 0);
	}
	setGross(){
		$('#week-total-gross').html(`£${this.calcGross().toFixed(2)}`);
	}
	calcNet(){
		return this.calcGross() * 0.8;
	}
	setNet(){
		$('#week-total-net').html(`£${this.calcNet().toFixed(2)}`);
	}
	calcAverageRate(){
		return this.calcGross() / this.hours;
	}
	setAverageRate(){
		$('#average-rate').html(`£${this.calcAverageRate().toFixed(2)}`);
	}
}