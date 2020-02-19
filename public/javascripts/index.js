$(function () {
    $("#search").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://suggestqueries.google.com/complete/search?q=" + encodeURIComponent(request.term) + "&client=firefox&hl=es",
                dataType: "jsonp",
                success: function (data) {
                    response(data[1].splice(0,4));
                }
            });
        },
        minLength: 2
    });
});