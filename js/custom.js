


function DiscardDriverButton() {
    // To do
    
    
}

function changeIcon(domImg,srcImage) {
    var img = new Image();
    img.onload = function()
    {
        // Load completed
        domImg.src = this.src;
    };
    img.src = srcImage;
}


function OKButton() {
    if ($('#FromBox').val().length == 0) {
        alert("Fill from box!");
        //todo stop propagation of modal
    } else if ($('#ToBox').val().length == 0) {
        alert("Fill to box!");
    } else {
        $('#FromLabel').html($('#FromBox').val());
        $('#ToLabel').html($('#ToBox').val());
        $('#DateLabel').html($('#DateBox').val() + " " + $('#TimeBox').val());
        $('#PassLabel').html($('#PassBox').val());
        $('#LuggLabel').html($('#LuggBox').val());
        $("#VIPLabel").prop("checked", document.getElementById('VIPBox').checked);

        //show nearest drivers - shows all of them, does not matter now
        $("#availableDrivers").empty();
        var taxis = Taxi.Persistence.Persistence.getInstance().getFreeTaxis();
        if (taxis.length > 0) {
            $.each(taxis, function (i, t) {
                var button = $("<button/>", {
                    text: t.driver.name + " " + t.driver.surname,
                    class: "btn "+ (i == 0 ? "btn-primary" : "btn-default"),
                    style: "width: 250px;",
                    id: t.id,
                    click: buttonClassSwitcher
                });
                $("#availableDrivers").append(button);
            });
        } else {
            var button = $("<button/>", {
                text: "No driver available",
                class: "btn btn-error",
                style: "width: 250px;"
            });
            $("#availableDrivers").append(button);
        }
    }
}


function buttonClassSwitcher() {
    $(this).siblings().removeClass("btn-primary");
    $(this).siblings().addClass("btn-default");
    $(this).removeClass("btn-default");
    $(this).addClass("btn-primary");
}

function clickedFilterButton() {
    buttonClassSwitcher.call(this);
    Taxi.Map.Map.getInstance().updateMap();
}

function clickedResetFilterButton() {
    primaryButtons = document.getElementById("filters").getElementsByClassName("default");
    for(var i = 0; i < primaryButtons.length; i++){
        buttonClassSwitcher.call(primaryButtons[i]);
    }
    Taxi.Map.Map.getInstance().updateMap();
}

function SubmitOrderButton() {
    var db = Taxi.Persistence.Persistence.getInstance();
    //TODO co delat kdyz neni volny driver, tedy trida je btn-error
    var id = $("#availableDrivers").find("button.btn-primary").attr("id");
    var taxi = db.getTaxi(id);
    var person = new Taxi.Persistence.Person("Unknown", "Customer", "+420" + Math.floor((Math.random() * 999999999) + 100000000));
    var customer = new Taxi.Persistence.Customer(person, taxi, null, null, $('#FromBox').val(), $('#ToBox').val(), $('#estPrice').text());
    taxi.customer = customer;
    Taxi.Map.Map.loadCustomerFromLocation(customer.id, $('#FromBox').val());
    Taxi.Map.Map.loadCustomerToLocation(customer.id, $('#ToBox').val());
    db.addCustomer(customer);
    ResetOrderForm();
}

function ResetOrderForm() {
    var date = new Date();
    $("#orders :input").val("");
    $('#DateBox').val(date.toDateString());
    $('#TimeBox').val(date.toTimeString());
    $('#PassBox').val(1);
    $('#LuggBox').val(1);
    $('#VIPBox').prop("checked", false);
}

$(function () {

    var db = Taxi.Persistence.Persistence.getInstance();
    var map = Taxi.Map.Map.getInstance();

    $.getJSON("js/init.json?" + Date.now())
        .done(function (d) {
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
