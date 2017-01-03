
function IncrementValue(id, val) {
   if (val == 0 && parseInt($('#' + id).val(),10) == 0) {
       return;
   }
   if (val == 1) {
       $('#' + id).val(parseInt($('#' + id).val(),10) + 1); 
   } else {
       $('#' + id).val( parseInt($('#' + id).val(),10) - 1);
   }
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

function getRandomPrice() {
	return Math.floor(Math.random() * 400) / 10;
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
        $('#estPrice').html("$ " + getRandomPrice());
        showAvailableDrivers($('#PassBox').val());
        $('#Confirm').modal();
    }
}

function showAvailableDrivers(passengers) {
    //show nearest drivers - shows all of them, does not matter now
    $(".availableDrivers").empty();
    var taxis = Taxi.Persistence.Persistence.getInstance().getFreeTaxis();
    if (taxis.length > 0) {
		var randomDistance = Math.floor(Math.random() * 20);
        $.each(taxis, function (i, t) {
            if (t.vehicle.seats >= passengers) {
                var button = $("<button/>", {
                    text: t.driver.name + " " + t.driver.surname + " (" + t.vehicle.seats + " seats, " + randomDistance + " minutes far, shift ends at " + t.shiftEnd + ")",
                    class: "btn " + (i == 0 ? "btn-primary" : "btn-default"),
                    id: t.id,
                    click: buttonClassSwitcherForOrder
                });
                $(".availableDrivers").append(button);
                randomDistance += Math.floor(Math.random() * 15);
                if (i == 0) {
                    $("#" + t.id).append($('<img>', {id: 'lock', src: 'lock.png', width: '20px', height: '20px'}));
                    $(button).append($('<img>', {id: 'lock', src: 'lock.png', width: '20px', height: '20px'}));
                }
            }
        });
    } else {
        var button = $("<button/>", {
            text: "No driver available",
            class: "btn btn-error",
            style: "width: 250px;"
        });
        $(".availableDrivers").append(button);
    }
}

function assignTaxi(customer) {
    showAvailableDrivers(customer.passengers);
    $("#submitTaxiAssignement").on("click", function () {
        SubmitTaxiAssignement(customer);
    });
    $('#taxiAssignement').modal();
}

function SubmitTaxiAssignement(customer) {
    var db = Taxi.Persistence.Persistence.getInstance();
    var id = $("#availableDrivers2").find("button.btn-primary").attr("id");
    var taxi = db.getTaxi(id);
    customer.taxi = taxi;
    taxi.customer = customer;
    Taxi.Map.Map.getInstance().updateMap();
}

function buttonClassSwitcherForOrder() {
    $(this).siblings().removeClass("btn-primary");
    $(this).siblings().addClass("btn-default");
    $(this).removeClass("btn-default");
    $(this).addClass("btn-primary");
	 $(this).siblings().children('img').remove();
	 $(this).children('img').remove();
    $(this).append($('<img>',{id:'lock',src:'lock.png', width:'20px', height:'20px'}));
}


function buttonClassSwitcher() {
    $(this).siblings().removeClass("btn-primary");
    $(this).siblings().addClass("btn-default");
    $(this).siblings().children('img').remove();
    $(this).removeClass("btn-default");
    $(this).addClass("btn-primary");
}

function clickedFilterButton() {
    buttonClassSwitcher.call(this);
    Taxi.Map.Map.getInstance().updateMap();
}
function writtenFilterText() {
    Taxi.Map.Map.getInstance().updateMap();
}

function clickedResetFilterButton() {
    primaryButtons = document.getElementById("filters").getElementsByClassName("default");
    for(var i = 0; i < primaryButtons.length; i++){
        buttonClassSwitcher.call(primaryButtons[i]);
    }
    document.getElementById("textFilter").value = '';
    Taxi.Map.Map.getInstance().updateMap();
}

function SubmitOrderButton() {
    var db = Taxi.Persistence.Persistence.getInstance();
    //TODO co delat kdyz neni volny driver, tedy trida je btn-error
    var id = $("#availableDrivers1").find("button.btn-primary").attr("id");
    var taxi = db.getTaxi(id);
    var person = new Taxi.Persistence.Person("Unknown", "Customer", "+420" + Math.floor((Math.random() * 999999999) + 100000000));
    var customer = new Taxi.Persistence.Customer(person, taxi, null, null, $('#FromBox').val(), $('#ToBox').val(), $('#estPrice').text(), $('#PassBox').val());
    taxi.customer = customer;
    Taxi.Map.Map.loadCustomerFromLocation(customer.id, $('#FromBox').val());
    Taxi.Map.Map.loadCustomerToLocation(customer.id, $('#ToBox').val());
    db.addCustomer(customer);
    ResetOrderForm();
}

function GetFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

function GetFormattedTime(date) {
  var hours = date.getHours().toString();
  hours = hours.length > 1 ? hours : '0' + hours;
  var minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : '0' + minutes;
  return hours + ':' + minutes;
}

function ResetOrderForm() {
    var date = new Date();
    $("#orders :input").val("");
    $('#DateBox').val(GetFormattedDate(date));
    $('#TimeBox').val(GetFormattedTime(date));
    $('#PassBox').val(1);
    $('#LuggBox').val(1);
    $('#VIPBox').prop("checked", false);
}

function hideCustomerPanel() {
    $('#customerPanel').hide();
    Selection.unselectCustomer();
}

function hideDriverPanel() {
    $('#driverPanel').hide();
    Selection.unselectDriver();
}

function hideTaxiPanel() {
    hideDriverPanel();
}

$(function () {

    var db = Taxi.Persistence.Persistence.getInstance();
    var map = Taxi.Map.Map.getInstance();

    $.getJSON("js/init.json?" + Date.now())
        .done(function (d) {
            db.initDBFromJson(d);
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


	$('#DateBox').datepicker();
    Selection.unselectAll();
    ResetOrderForm();
    moveProgress();
    google.maps.event.addDomListener(window, 'load', map);
});
