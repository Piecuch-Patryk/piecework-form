const columns = () => {
	return ['Invoice', 'Range', 'Size', 'Price A', 'Extras', 'Price B', 'Subtotal'];
}
const weekDays = i => {
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	if(i >= 0)
		return days[i];
	else
		return days;
}