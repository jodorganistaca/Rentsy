var calendar;

/**
 * [Function to load a JavaScript Calendar]
 * https://fullcalendar.io
 */
document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    //dayGrid dayGridWeek dayGridMonth listWeek 
    var view = "dayGridMonth";

    // eslint-disable-next-line no-undef
    calendar = new FullCalendar.Calendar(calendarEl, {
        buttonText: {
            today: "Hoy"
        },
        noEventsMessage: "No hay eventos este día",
        eventLimit: true,
        nowIndicator: true,
        themeSystem: "bootstrap",
        plugins: ["bootstrap", "timeGrid", "dayGrid", "list"],
        bootstrapFontAwesome: true,

        customButtons: {
            day: {
                text: "Dia",
                click: function () {
                    view = "dayGrid";
                    calendar.changeView("dayGrid");
                }
            },
            week: {
                text: "Semana",
                click: function () {
                    view = "dayGridWeek";
                    calendar.changeView("timeGridWeek");
                }
            },
            month: {
                text: "Mes",
                click: function () {
                    calendar.changeView("dayGridMonth");
                }
            },
            list: {
                text: "Lista",
                click: function () {
                    calendar.changeView("listWeek");
                }
            }

        },
        header: {
            close: "fa-times",
            prev: "fa-chevron-left",
            next: "fa-chevron-right",
            prevYear: "fa-angle-double-left",
            nextYear: "fa-angle-double-right",
            left: "prev,next today",
            center: "title",
            right: "day,week,month,list"
        },
        defaultView: view,
        locale: "es-ES",
        eventClick: function(info) {
            loadModal(info.event);
            console.log(info.event);
            console.log(info.event.extendedProps);
        },        
        events: [{
            title: "Objeto 1",
            start: "2020-02-22T14:30:00",
            extendedProps: {
                estado: "Arrendado",
                arrendatario: "js.bravo@uniandes.edu.co",
                arrendador: "Juan Sebastián Bravo",
                id: 1
            },
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

/**
 * [loadModal function to see a modal window with the info of the object in the Calendar]
 * @param  {[array of JSON]} event [this parameter have the info of the object in the Calendar]
 */
const loadModal = (event) => 
{
    console.log("event", event.extendedProps);
    $(".modal-title")[0].innerHTML = event.title;
    $("#arrendador").val(event.extendedProps.arrendador);
    $("#descripcion").val(event.extendedProps.description);
    $("#precioHora").val(event.extendedProps.priceHour);
    $("#precioDia").val(event.extendedProps.priceDay);
    $("#guardar").attr("formaction", "/update/"+event.extendedProps._id);
    $("#borrar").attr("formaction", "/delete/"+event.extendedProps._id);
    if(event.extendedProps.arrendador)
    {
        $("#descripcion").attr("disabled", true);
        $("#precioHora").attr("disabled", true);
        $("#precioDia").attr("disabled", true);
        $("#borrar").attr("disabled", true);
        $("#guardar").attr("disabled", true);
    }
    else
    {
        $("#descripcion").removeAttr("disabled");
        $("#precioHora").removeAttr("disabled");
        $("#precioDia").removeAttr("disabled");
        $("#borrar").removeAttr("disabled");
        $("#guardar").removeAttr("disabled");
    }
    $(".modal").show();
};

/**
 * [loadOject function for render the objects in the Calendar]
 * @param  {[int]} id [the id of every object that the user have]
 */
const loadObject = (id) => 
{
    calendar.destroy();
    fetch("/get/"+id)
        .then(response => response.json())
        .then(data => {
            data = data[0];
            var calendarEl = document.getElementById("calendar");
            //dayGrid dayGridWeek dayGridMonth listWeek 
            var view = "dayGridMonth";
            if(data.events){
                data.events.forEach(function(part, index) {
                    data.events[index]._id =  "5e5865f875c48d1126e209b6";
                    data.events[index].name =  "Calculadora Texas";
                    data.events[index].description = "Arriendo calculadora texas";
                    data.events[index].priceHour =  "2000";
                    data.events[index].priceDay =  "5000";
                });}
              
            calendar = new FullCalendar.Calendar(calendarEl, {
                buttonText: {
                    today: "Hoy"
                },
                noEventsMessage: "No hay eventos este día",
                eventLimit: true,
                nowIndicator: true,
                themeSystem: "bootstrap",
                plugins: ["bootstrap", "timeGrid", "dayGrid", "list"],
                bootstrapFontAwesome: true,

                customButtons: {
                    day: {
                        text: "Dia",
                        click: function () {
                            view = "dayGrid";
                            calendar.changeView("dayGrid");
                        }
                    },
                    week: {
                        text: "Semana",
                        click: function () {
                            view = "dayGridWeek";
                            calendar.changeView("timeGridWeek");
                        }
                    },
                    month: {
                        text: "Mes",
                        click: function () {
                            calendar.changeView("dayGridMonth");
                        }
                    },
                    list: {
                        text: "Lista",
                        click: function () {
                            calendar.changeView("listWeek");
                        }
                    }

                },
                header: {
                    close: "fa-times",
                    prev: "fa-chevron-left",
                    next: "fa-chevron-right",
                    prevYear: "fa-angle-double-left",
                    nextYear: "fa-angle-double-right",
                    left: "prev,next today",
                    center: "title",
                    right: "day,week,month,list"
                },
                defaultView: view,
                locale: "es-ES",
                eventClick: function(info) {
                    console.log(info);
                    loadModal(info.event);
                    console.log(info.event);
                    console.log(info.event.extendedProps);
                },        
                events: data.events,
            });

            calendar.render();
        })
        .catch(err => {
            console.log(err);
            // Do something for an error here
        });
  
};
/**
 * [closeModal function to hide the modal window]
 */
const closeModal = () => $(".modal").hide();

$(".modal").on("shown.bs.modal", function () {
    $("#myInput").trigger("focus");
});
