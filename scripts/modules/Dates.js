class Dates {
	constructor(){
		this.date = new Date();
		this.week = [];
	}
	// calculate the last Monday date;
	lastMonday(){
		let date = new Date();
		date.setDate(date.getDate() - (date.getDay() + 6) % 7);
		const day = ("0" + date.getDate()).slice(-2);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		date = date.getFullYear()+"-"+(month)+"-"+(day) ;
		return date;
	}
	setLastMonday(){
		const dateField = document.getElementById('week-date');
		dateField.value = this.lastMonday();
	}
	// calculate dates for week ahead;
	calcWeekAhead(){
		const date = new Date();
		for(let i = 0; i < 5; i++){			
			const result = new Date(date);
			let day = '',
				month = '',
				year = '',
				newDate = '';
			result.setDate(result.getDate() + i);
			day = result.getDate();
			if(day.toString().length < 2) {
				day = `0${day}`;
			}
			month = result.getMonth()+1;
			if(month.toString().length < 2) {
				month = `0${month}`;
			}
			year = result.getFullYear();
			newDate = `${day}-${month}-${year}`;
			this.week.push(newDate);
		}
		return this.week;
	}
}