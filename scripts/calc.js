// calculate new date depending on given start date;	date + 4 days;
DatesCalc.prototype.calcWeekDates = function (){
	const week = [];
	for(let i = 0; i < 5;i++){			
		const result = new Date($('.private-header input[type="date"]').val());
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
		week.push(newDate);
	};
	return week;
}