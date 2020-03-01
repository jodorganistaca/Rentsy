/**
 * [litepicker1 function for load a Date range picker]
 * https://wakirin.github.io/Litepicker/
 */
const litepicker1 = new Litepicker({
    element: document.getElementById("date"),
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

$("#customFile").change(function() {
    var file = $("#customFile")[0].files[0].name;
    $("#fileLabel").text(file);
});
