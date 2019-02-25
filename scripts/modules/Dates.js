class Dates {
	constructor(){
		this.currentMonday = '';
		this.newMonday = '';
		this.week = [];
	}
	// calculate the last Monday date;
	lastMonday(value){
		let date = new Date();
		if(value) date = new Date(value);
		date.setDate(date.getDate() - (date.getDay() + 6) % 7);
		const day = ("0" + date.getDate()).slice(-2);
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		date = date.getFullYear()+"-"+(month)+"-"+(day) ;
		return date;
	}
	setLastMonday(){
		$('#week-date').val(this.lastMonday());
	}
	currentWeekMonday(){
		const dateField = $('#week-date');
		$(dateField).val(this.lastMonday(dateField.val()));
	}
	// calculate dates for week ahead;
	calcWeekAhead(){
		const userDate = $('#week-date').val();
		this.week = [];
		for(let i = 0; i < 5; i++){			
			const result = new Date(userDate);
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
	// set current week's dates in day-nav;
	setWeekDates(){
		$('.day-nav').find('span').each((i, el) => $(el).html(this.week[i]));
	}
	// check current week's tables in database;
	getWeekTables(){
		$.ajax({
			type: 'GET',
			url: '../app_php/getters/week_tables.php',
			data: {
				weekDates: this.week
			},
			dataType: 'json',
			success: function (result){
				for(let i = 0; i < result.length; i++) {
					if(result[i].length > 0) {
						TempJobsheet.databaseResult = result;
						DatesObj.showInfo();
						break;
					}
				}
			}
		});
	}
	// show info about found jobs;
	showInfo(){
		$('#restoreJobsWrap')
			.css({
				display: 'flex'
		})
			.animate({
				opacity: 1
		}, 500);
	}
	// hide info;
	hideInfo(){
		$('#restoreJobsWrap').animate({
			opacity: 0
		}, 500, function(){
			$(this).css({
				display: 'none'
			});
		});
	}
}