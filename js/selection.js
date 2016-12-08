var Selection = {};

Selection.selectedTaxi = null;
Selection.selectedCustomer = null;
Selection.db = Taxi.Persistence.Persistence.getInstance();

Selection.selectTaxiId = function(id) {
    Selection.selectTaxi(db.getTaxi(id));
};

Selection.selectTaxi = function(taxi) {
    $('#driverPanel').show();
    Selection.selectedTaxi = taxi;
    if (taxi.customer != null) {
        this.selectCustomer(taxi.customer);
    }
    var driver = taxi.driver;
    var vehicle = taxi.vehicle;
    //alert("taxi " + taxi.id + 
    //    " (vehicle " + vehicle.id + " - " + vehicle.brand + " " + vehicle.type + 
    //    ", driver " + driver.id + " - " + driver.surname + ") clicked");
    document.getElementById('panel-driver-name').innerHTML 
        = driver.name + ' ' + driver.surname;
    document.getElementById('panel-driver-shiftEnd').innerHTML 
        = taxi.shiftEnd;
    document.getElementById('panel-driver-phone').innerHTML 
        = driver.phone;
    document.getElementById('ex1').value 
        = driver.note;
    document.getElementById('panel-driver-passengers').innerHTML 
        = vehicle.seats;
    document.getElementById('panel-driver-luggage').innerHTML 
        = vehicle.luggage;
    document.getElementById('panel-driver-brand').innerHTML 
        = vehicle.brand;
    document.getElementById('panel-driver-type').innerHTML 
        = vehicle.type;
    document.getElementById('panel-driver-year').innerHTML
        = vehicle.year;

    document.getElementById('driverId').innerHTML
        = taxi.id;

    document.getElementById('ex1').oninput = function () {
        driver.note = this.value;
    };
};

Selection.openDriverDetails = function (id) {
    var taxi = Taxi.Persistence.Persistence.getInstance().getTaxi(id);
    console.log(taxi);
    $('#EditShiftInput').val(taxi.shiftEnd);
    $('#EditPhoneInput').val(taxi.driver.phone);
    $('#EditNoteInput').val(taxi.driver.note);

    $('#EditPassengersInput').val(taxi.vehicle.seats);
    $('#EditLuggageInput').val(taxi.vehicle.luggage);
    $('#EditBrandInput').val(taxi.vehicle.brand);
    $('#EditTypeInput').val(taxi.vehicle.type);
    $('#EditYearInput').val(taxi.vehicle.year);

    if (taxi.customer != null) {
        $('#currentClientName').text(taxi.customer.person.getFullName());
        $('#currentClientFrom').text(taxi.customer.fromAdd.substring(0, 25));
        $('#currentClientTo').text(taxi.customer.toAdd.substring(0, 25));
        $('#currentClientPrice').text(taxi.customer.price);
    } else {
        $('#currentClientName').text("No client");
        $('#currentClientFrom').text("");
        $('#currentClientTo').text("");
        $('#currentClientPrice').text("");
    }

};


Selection.editField = function (name) {
    if (document.getElementById(name + 'Input').style.border=="1px solid black") {
        $('#' + name + 'Input').prop("disabled", true);
        changeIcon(document.getElementById(name),"edit.png");
        document.getElementById(name + 'Input').style.border="0px solid black";
        var taxi = Taxi.Persistence.Persistence.getInstance().getTaxi($('#driverId').text());
        this.saveTaxiByFields(taxi);
        this.selectTaxi(taxi);
    } else {
        $('#' + name + 'Input').prop("disabled", false);
        changeIcon(document.getElementById(name), "save.png");
        document.getElementById(name + 'Input').style.border="1px solid black";
    }
};

Selection.saveTaxiByFields = function(taxi) {
    taxi.shiftEnd = $('#EditShiftInput').val();
    taxi.driver.phone = $('#EditPhoneInput').val();
    taxi.driver.note = $('#EditNoteInput').val();

    taxi.vehicle.seats = $('#EditPassengersInput').val();
    taxi.vehicle.luggage = $('#EditLuggageInput').val();
    taxi.vehicle.brand = $('#EditBrandInput').val();
    taxi.vehicle.type = $('#EditTypeInput').val();
    taxi.vehicle.year = $('#EditYearInput').val();
};

Selection.selectCustomerId = function(id) {
    Selection.selectCustomer(db.getCustomer(id));
};

Selection.selectCustomer = function(customer) {
    $('#customerPanel').show();
    Selection.selectedCustomer = customer;

    console.log(customer.taxi);
    if (customer.taxi != null && Selection.selectedTaxi != customer.taxi) {
        Selection.selectTaxi(customer.taxi);
    }
    document.getElementById('panel-customer-name').innerHTML 
        = customer.person.name + ' ' + customer.person.surname;
    document.getElementById('panel-customer-phone').innerHTML 
        = customer.person.phone;
    document.getElementById('ex2').value 
        = customer.person.note;
    document.getElementById('panel-customer-history'); //todo

    document.getElementById('ex2').oninput = function () {
        customer.person.note = this.value;
    };
};