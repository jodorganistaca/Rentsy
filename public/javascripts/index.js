//lint-disable-next-line no-undef
const litepicker = new Litepicker({
    element: document.getElementById("litepicker"),
    singleMode: false,
    lang: "es-ES",
    mobileFriendly: true,
    tooltipText: {
        one: "día",
        other: "días",
    },
    minDate: new Date((new Date()).valueOf()),
    format: "D MMM, YYYY"
});

$(function () {
    $("#diasSemana").weekdays({
        days: ["Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb.", "Dom."],
    });

    $(".js__timepicker").each(function () {
        var pickr = $(this).pickatime({
            clear: "Limpiar selección",

            // Formats
            format: "h:i A",
            formatLabel: undefined,
            formatSubmit: undefined,
            hiddenPrefix: undefined,
            hiddenSuffix: "_submit",

            // Editable input
            editable: true,

            // Time intervals
            interval: 30,

            // Time limits
            min: undefined,
            max: undefined,

            // Root picker container
            container: $("#booking"),

            // Hidden input container
            containerHidden: undefined,

            // Close on a user action
            closeOnSelect: true,
            closeOnClear: true,

            // Events
            onStart: undefined,
            onRender: undefined,
            onOpen: undefined,
            onClose: undefined,
            onSet: undefined,
            onStop: undefined,

            // Classes
            klass: {

                // The element states
                input: "picker__input",
                active: "picker__input--active",

                // The root picker and states *
                picker: "picker picker--time",
                opened: "picker--opened",
                focused: "picker--focused",

                // The picker holder
                holder: "picker__holder",

                // The picker frame, wrapper, and box
                frame: "picker__frame",
                wrap: "picker__wrap",
                box: "picker__box",

                // List of times
                list: "picker__list",
                listItem: "picker__list-item",

                // Time states
                disabled: "picker__list-item--disabled",
                selected: "picker__list-item--selected",
                highlighted: "picker__list-item--highlighted",
                viewset: "picker__list-item--viewset",
                now: "picker__list-item--now",

                // Clear button
                buttonClear: "picker__button--clear",
            }
        });

        $(this).click(function () {
            pickr.pickatime("open");
        });
    });

});


function fetchStatusHandler(response) {
    if (response.status === 200) {
        return response;
    } else {
        throw new Error(response.statusText);
    }
}


function cambiarVista() {
    let esRecurrente = document.getElementById("esRecurrente").checked;
    if (!esRecurrente) {
        $("#btn-Submit").removeAttr("disabled");
        document.getElementById("divSemana").style.display = "none";
        document.getElementById("divHoras").style.display = "none";
        document.getElementById("horaInicial").required = false;
        document.getElementById("horaFinal").required = false;
    } else {
        document.getElementById("divSemana").style.display = "";
        document.getElementById("divHoras").style.display = "";
        document.getElementById("horaInicial").required = true;
        document.getElementById("horaFinal").required = true;
        if ($("#diasSemana").selectedIndexes().length == 0) {
            $("#btn-Submit").attr("disabled", true);
        }
    }
}

$(document).on("change", "#diasSemana *", function () {
    alert(this.value);
});

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
    let esRecurrente = document.getElementById("esRecurrente").checked;
    if (!esRecurrente) {
        $("#btn-Submit").removeAttr("disabled");
    } else {
        if ($("#diasSemana").selectedIndexes().length == 0) {
            $("#btn-Submit").attr("disabled", true);
        } else {
            $("#btn-Submit").removeAttr("disabled");
        }
    }
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe($("#diasSemana")[0], {
    subtree: true,
    attributes: true
    //...
});



function validar() {
    let esRecurrente = document.getElementById("esRecurrente").checked;
    if (esRecurrente && $("#weekdays").selectedIndexes() > 0) {
        buscar();
    } else {
        console.log("Paila");
        return false;
    }
    return true;
}

function buscar() {
    console.log("Buscar");
}
const src = "https://graph.microsoft.com/beta/me/Photo/$value";
const options = {
    headers: {
        // eslint-disable-next-line no-undef
        "Authorization": user.accessToken
    }
};



if (user) {
    fetch(src, options)
        .then(
            fetchStatusHandler
        )
        .then(res => res.blob())
        .then(blob => {
            document.getElementById("foto-alternativa").style.display = "none";
            document.getElementById("foto-de-perfil").src = URL.createObjectURL(blob);
        }).catch(function () {
            document.getElementById("foto-de-perfil").style.display = "none";
        });
}