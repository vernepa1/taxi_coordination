var Selection = {};

Selection.selectedTaxi = null;
Selection.selectedCustomer = null;
Selection.db = Taxi.Persistence.Persistence.getInstance();
Selection.fieldBeingEdited = false;

Selection.selectTaxi = function (taxi) {
    Selection.selectedTaxi = taxi;
    Taxi.Map.Map.getInstance().updateMap();
    if (!taxi) return;
    $('#driverPanel').show();
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

Selection.selectTaxiId = function (id) {
    Selection.selectTaxi(db.getTaxi(id));
};

Selection.selectTaxiMarker = function (marker) {
    Selection.selectTaxiId(marker.taxiId);
}

Selection.unselectTaxiIfNotIn = function (taxis) {
    if (!taxis.includes(Selection.selectedTaxi)) {
        Selection.selectedTaxi = null;
        $('#driverPanel').hide();;
    }
}

Selection.isSelectedTaxiId = function (taxiId) {
    return (Selection.selectedTaxi && Selection.selectedTaxi.id == taxiId);
}

Selection.isTaxiSelected = function () {
    return !(!Selection.selectedTaxi);
}


Selection.openDriverDetails = function (id) {
    var taxi = db.getTaxi(id);
    $('#EditShiftInput').val(taxi.shiftEnd);
    $('#EditShiftInput').timepicker({
        minuteStep: 1,
        appendWidgetTo: 'body',
        showSeconds: false,
        showMeridian: false,
        defaultTime: false
    });
    $('#timepicker').timepicker('setTime', taxi.shiftEnd);
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

    $("#DriverDetail").on("hide.bs.modal", function (e) {
        if (Selection.fieldBeingEdited) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert("You have unsaved changes in a field!");
            return false;
        }
    })

};

Selection.openCustomerDetails = function (customer) {
    $('#EditCustomerPhoneInput').val(customer.person.phone);
    $('#EditCustomerNoteInput').val(customer.person.note);

    Selection.setCustomerDetailsOrderFields(customer);

    $("#cancelCurrentOrder").on("click", function () {
        Taxi.Persistence.Persistence.getInstance().deleteCustomer(Selection.selectedCustomer);
        $("#CustomerDetail").modal("toggle");
        Selection.unselectAll();
    });

    $("#CustomerDetail").on("hide.bs.modal", function (e) {
        if (Selection.fieldBeingEdited) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert("You have unsaved changes in a field!");
            return false;
        }
    })
};


Selection.setCustomerDetailsOrderFields = function(customer) {
    var d = new Date();
    $('#currentOrderDate').text(d.getDate() + "." + d.getMonth() + ", " + d.getHours() + ":" + d.getMinutes());
    $('#currentOrderFrom').text(customer.fromAdd.substring(0, 25));
    $('#currentOrderTo').text(customer.toAdd.substring(0, 25));
    $('#currentOrderPrice').text(customer.price);
}

Selection.editField = function (name) {
    if (document.getElementById(name + 'Input').style.border == "1px solid black") {
        $('#' + name + 'Input').prop("disabled", true);
        changeIcon(document.getElementById(name), "edit.png");
        document.getElementById(name + 'Input').style.border = "0px solid black";
        var taxi = db.getTaxi($('#driverId').text());
        this.saveTaxiByFields(taxi);
        this.selectTaxi(taxi);
        Selection.fieldBeingEdited = false;
    } else {
        $('#' + name + 'Input').prop("disabled", false);
        changeIcon(document.getElementById(name), "save.png");
        document.getElementById(name + 'Input').style.border = "1px solid black";
        Selection.fieldBeingEdited = true;
    }
};

Selection.editCustomerField = function (name) {
    if (document.getElementById(name + 'Input').style.border == "1px solid black") {
        $('#' + name + 'Input').prop("disabled", true);
        changeIcon(document.getElementById(name), "edit.png");
        document.getElementById(name + 'Input').style.border = "0px solid black";
        var customer = Selection.selectedCustomer;
        this.saveCustomerByFields(customer);
        this.selectCustomer(customer);
        Selection.fieldBeingEdited = false;
    } else {
        $('#' + name + 'Input').prop("disabled", false);
        changeIcon(document.getElementById(name), "save.png");
        document.getElementById(name + 'Input').style.border = "1px solid black";
        Selection.fieldBeingEdited = true;
    }
};

Selection.saveTaxiByFields = function (taxi) {
    taxi.shiftEnd = $('#EditShiftInput').val();
    taxi.driver.phone = $('#EditPhoneInput').val();
    taxi.driver.note = $('#EditNoteInput').val();

    taxi.vehicle.seats = $('#EditPassengersInput').val();
    taxi.vehicle.luggage = $('#EditLuggageInput').val();
    taxi.vehicle.brand = $('#EditBrandInput').val();
    taxi.vehicle.type = $('#EditTypeInput').val();
    taxi.vehicle.year = $('#EditYearInput').val();
};

Selection.saveCustomerByFields = function (customer) {
    customer.person.phone = $('#EditCustomerPhoneInput').val();
    customer.person.note = $('#EditCustomerNoteInput').val();
};

Selection.selectCustomer = function (customer) {
    Selection.selectedCustomer = customer;
    Taxi.Map.Map.getInstance().updateMap();
    if (!customer) return;
    $('#customerPanel').show();

    if (customer.taxi != null && Selection.selectedTaxi != customer.taxi) {
        Selection.selectTaxi(customer.taxi);
    }
    document.getElementById('panel-customer-name').innerHTML
        = customer.person.name + ' ' + customer.person.surname;
    document.getElementById('panel-customer-phone').innerHTML
        = customer.person.phone;
    document.getElementById('panel-customer-from').innerHTML
        = customer.fromAdd;
    document.getElementById('panel-customer-to').innerHTML
        = customer.toAdd;
    document.getElementById('panel-customer-price').innerHTML
        = customer.price;
    document.getElementById('panel-customer-passengers').innerHTML
        = customer.passengers;
    document.getElementById('ex2').value
        = customer.person.note;
    document.getElementById('panel-customer-history'); //todo

    document.getElementById('ex2').oninput = function () {
        customer.person.note = this.value;
    };

    if (customer.taxi == null) {
        $("#assignTaxi").show();
    } else {
        $("#assignTaxi").hide();
    }
};

Selection.selectCustomerId = function (id) {
    Selection.selectCustomer(db.getCustomer(id));
};

Selection.unselectCustomerIfNotIn = function (customers) {
    if (!customers.includes(Selection.selectedCustomer)) {
        Selection.selectedCustomer = null;
        $('#customerPanel').hide();
    }
}

Selection.isSelectedCustomerId = function (customerId) {
    return (Selection.selectedCustomer && Selection.selectedCustomer.id == customerId);
}

Selection.isCustomerSelected = function () {
    return !(!Selection.selectedCostumer);
}

Selection.unselectAll = function () {
    Selection.selectedCustomer = null;
    Selection.selectedTaxi = null;
    hideCustomerPanel();
    hideTaxiPanel();
    Taxi.Map.Map.getInstance().updateMap();
}

Selection.unselectCustomer = function () {
    Selection.selectedCustomer = null;
    Taxi.Map.Map.getInstance().updateMap();

}

Selection.unselectDriver = function () {
    Selection.selectedTaxi = null;
    Taxi.Map.Map.getInstance().updateMap();

}