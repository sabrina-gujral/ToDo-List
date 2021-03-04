exports.getDate = function() {
	const today = new Date();
	const date = today.toDateString().slice(3);
	const day = today.toLocaleDateString('en-US', {weekday: 'long'}) + ", " + date;

	return day;
}