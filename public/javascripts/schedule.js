/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", function() {
    var calendarEl = document.getElementById("calendar");
    //dayGrid dayGridWeek dayGridMonth listWeek 
    var view = "dayGrid";
    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ "timeGrid","dayGrid", "list" ],
        customButtons: {
            day: {
                text: "Dia",
                click: function() {
                    view = "dayGrid";
                    calendar.changeView("dayGrid");
                }
            },
            week: {
                text: "Semana",
                click: function() {
                    view = "dayGridWeek";
                    calendar.changeView("dayGridWeek");
                }
            },
            month: {
                text: "Mes",
                click: function() {
                    calendar.changeView("dayGridMonth");
                }
            },
            list: {
                text: "Lista",
                click: function() {
                    calendar.changeView("listWeek");
                }
            }

        },
        header: {
            left: "prev,next today",
            center: "title",
            right: "day,week,month,list"
        },
        defaultView: view,
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

$("#buttonName").click(function () {  });