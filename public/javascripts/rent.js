const arrendar = () => {
    let title = localStorage.getItem("title");
    let start = localStorage.getItem("start");
    let end = localStorage.getItem("end");
    let esRecurrente = localStorage.getItem("esRecurrente");
    let startRecur = localStorage.getItem("startRecur");
    let endRecur = localStorage.getItem("endRecur");
    let daysOfWeek = localStorage.getItem("daysOfWeek");

    $("#form-id").attr("action", $("#form-id").attr("action") + "?title=" + title + "&start="+start + "&end="+end + "&esRecurrente="+esRecurrente + "&startRecur="+startRecur + "&endRecur="+endRecur + "&daysOfWeek="+daysOfWeek );
    document.getElementById("form-id").submit();
};