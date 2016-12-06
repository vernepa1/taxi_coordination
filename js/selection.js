var Selection = {};

Selection.selectedTaxi = null;
Selection.selectedCustomer = null;
Selection.db = Taxi.Persistence.Persistence.getInstance();

Selection.selectTaxiId = function(id) {
    Selection.selectTaxi(db.getTaxi(id));
};

Selection.selectTaxi = function(taxi) {
    Selection.selectedTaxi = taxi;
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

    document.getElementById('ex1').oninput = function () {
        driver.note = this.value;
    };
};

Selection.selectCustomerId = function(id) {
    Selection.selectCustomer(db.getCustomer(id));
};

Selection.selectCustomer = function(customer) {
    Selection.selectedCustomer = customer;
    alert("customer " + customer.id + 
        " - " + customer.surname 
        + " clicked");
    document.getElementById('panel-customer-name').innerHTML 
        = customer.name + ' ' + customer.surname;
    document.getElementById('panel-customer-phone').innerHTML 
        = customer.phone;
    document.getElementById('ex2').value 
        = customer.note;        
    document.getElementById('panel-customer-history'); //todo

    document.getElementById('ex2').oninput = function () {
        customer.note = this.value;
    };
};