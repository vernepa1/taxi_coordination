function OKButton() {
    //if ($('#FromBox').val().length == 0) {
    //    $("#FromBox").css('background-color',  'red');
    //} else {
    //    $("#FromBox").css('background-color',  'white');
    //}    
    $('#FromLabel').html ( $('#FromBox').val() );
    $('#ToLabel').html ( $('#ToBox').val() );
    $('#DateLabel').html ( $('#DateBox').val() + " " + $('#TimeBox').val());
    $('#PassLabel').html ( $('#PassBox').val() );
    $('#LuggLabel').html ( $('#LuggBox').val() );
    $("#VIPLabel").prop("checked", document.getElementById('VIPBox').checked);
}


$(function () {

    var db = new Taxi.Persistence.Persistence();
    var map = new Taxi.Map.Map();

    $.getJSON("js/init.json?"+Date.now())
        .done(function (d) {
            console.log(d);
            db.initTaxisFromJson(d);
            map.updateMap(db);
        });

    function moveProgress() {
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 150); // it will take 6 seconds to get to the end
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                map.updateMap(db);
                moveProgress();
            } else {
                width++;
                elem.style.width = width + '%';
            }
        }
    }

    moveProgress();
    google.maps.event.addDomListener(window, 'load', map);
});
