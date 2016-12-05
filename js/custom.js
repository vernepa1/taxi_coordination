function OKButton() {
    if ($('#FromBox').val().length == 0) {
        alert("Fill from box!");
    } else if ($('#ToBox').val().length == 0) {
        alert("Fill to box!");
    } else {
        $('#FromLabel').html ( $('#FromBox').val() );
        $('#ToLabel').html ( $('#ToBox').val() );
        $('#DateLabel').html ( $('#DateBox').val() + " " + $('#TimeBox').val());
        $('#PassLabel').html ( $('#PassBox').val() );
        $('#LuggLabel').html ( $('#LuggBox').val() );
        $("#VIPLabel").prop("checked", document.getElementById('VIPBox').checked);
    }
}

function SubmitOrderButton() {
    console.log("order submitted");
    var db = Taxi.Persistence.Persistence.getInstance();
    //todo
    ResetOrderForm();
}

function ResetOrderForm() {
    var date = new Date();
    $("#orders :input").val("");
    $('#DateBox').val(date.toDateString());
    $('#TimeBox').val(date.toTimeString());
    $('#PassBox').val(1);
    $('#LuggBox').val(1);
    document.getElementById('VIPBox').prop("checked", false);
}

$(function () {

    var db = Taxi.Persistence.Persistence.getInstance();
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


    ResetOrderForm();
    moveProgress();
    google.maps.event.addDomListener(window, 'load', map);
});
