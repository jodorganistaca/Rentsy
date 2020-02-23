/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", function() {
	var calendarEl = document.getElementById("calendar");

	var calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: [ "timeGrid","dayGrid" ],
		defaultView: "timeGridWeek",
		locale: "es",
		events: [
			{
				title: "Objeto 1",
				start: "2020-02-22T14:30:00",
				extendedProps: {
					status: "done"
				}
			},
			{
				title: "Calcuadora Texas",
				start: "2020-02-22T07:00:00",
				backgroundColor: "green",
				borderColor: "green"
			}
		],
	});

	calendar.render();
});