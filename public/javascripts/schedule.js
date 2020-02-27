var calendar;

document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    //dayGrid dayGridWeek dayGridMonth listWeek 
    var view = "dayGridMonth";

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

const loadModal = (event) => 
{
    $(".modal-title")[0].innerHTML = event.title;
    $("#arrendador").val(event.extendedProps.arrendador);
    $("#descripcion").val(event.extendedProps.description);
    $("#precioHora").val(event.extendedProps.precioHora);
    $("#precioHora").val(event.extendedProps.precioDia);
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

const loadMyObject = (id) => 
{
    calendar.destroy();
    //TODO: Fetch objeto por id
    //let object = fetch
    let object = {
        id: 1,
        name: "Calculadora Texas",
        description: "Arriendo calculadora texas",
        priceHour: "$2000/hora",
        priceDay: "$5000/día",
        arrendador: {
            userName: "Juan Sebastián Bravo",
            email: "js.bravo@uniandes.edu.co"},
        usuariosInteresados: ["js.bravo@uniandes.edu.co"],
        events:[{
            start: new Date(),
            end: new Date() +1000000,
            /* https://fullcalendar.io/docs/recurring-events 
        duration: */
            title: "Calculadora",
            state: "Arrendado",
            usuarioArrendatario: "js.bravo@uniandes.edu.co",
            esRecurrente: true,
            daysOfWeek:[0,1,2,3,4],
            startRecur: new Date(),
            endRecur: new Date() + 200000,
            /* hh:mm:sss */
            //startTime: "09:20",
            //endTime: "10:20",
            allDay: true}]
      
      
    };
    var calendarEl = document.getElementById("calendar");
    //dayGrid dayGridWeek dayGridMonth listWeek 
    var view = "dayGridMonth";

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
        events: object.events,
    });

    calendar.render();
};
const closeModal = () => $(".modal").hide();

$(".modal").on("shown.bs.modal", function () {
    $("#myInput").trigger("focus");
});