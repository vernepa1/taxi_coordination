var Filter = {};

Filter.CarsAndCustomers = "CarsAndCustomers";
Filter.Cars = "Cars";
Filter.Customers = "Customers";

Filter.AllTaxis = "AllTaxis";
Filter.BasicTaxis = "BasicTaxis";
Filter.PremiumTaxis = "PremiumTaxis";

Filter.db = Taxi.Persistence.Persistence.getInstance();

Filter.clearAll = function() {
    Filter.type = Filter.CarsAndCustomers;
    Filter.taxiType = Filter.AllTaxis;
    Filter.passengers = 1;
    Filter.luggage = 1;
    Filter.text = '';
}

Filter.selectType = function(type){
    Filter.type = type;
}

Filter.selectTaxiType = function(taxiType){
    Filter.taxiType = taxiType;
}

Filter.selectPassengers = function(passengers){
    Filter.passengers = passengers;
}

Filter.selectLuggage = function(luggage){
    Filter.luggage = luggage;
}

Filter.selectText = function(text){
    Filter.text = text;
}

Filter.clearAll();

Filter.shouldShowTaxi = function(taxi) {
    if(Filter.type === Filter.Customers) return false;
    if(Filter.taxiType === Filter.PremiumTaxis && !taxi.vehicle.premium) return false;
    if(Filter.taxiType === Filter.BasicTaxis && taxi.vehicle.premium) return false;
    if(Filter.passengers > taxi.vehicle.seats) return false;
    if(Filter.luggage > taxi.vehicle.luggage) return false;
	var re = new RegExp(Filter.text, 'gi');
    return (
        taxi.driver.name.match(re) || 
        taxi.driver.surname.match(re) ||
        taxi.driver.phone.match(re) ||
        taxi.vehicle.brand.match(re) ||
        taxi.vehicle.type.match(re) ||
        taxi.driver.note.match(re)
        )
}

Filter.shouldShowCustomer = function(customer) {
    if(Filter.type === Filter.Cars) return false;
	var re = new RegExp(Filter.text, 'gi');
    return (
        customer.name.match(re) || 
        customer.surname.match(re) ||
        customer.phone.match(re) ||
        customer.note.match(re)
        )
}

Filter.filterTaxis = function(taxis) {
    filteredTaxis = [];
    for(var i = 0; i < taxis.length; i++){
        if(Filter.shouldShowTaxi(taxis[i])) filteredTaxis.push(taxis[i]);
    }
    return filteredTaxis;
}

Filter.filterCustomers = function(customers) {
    filteredCustomers = [];
    for(var i = 0; i < customers.length; i++){
        if(Filter.shouldShowCustomer(customers[i].person)) filteredCustomers.push(customers[i]);
    }
    return filteredCustomers;
}