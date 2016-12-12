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
    return (
        taxi.driver.name.includes(Filter.text) || 
        taxi.driver.surname.includes(Filter.text) ||
        taxi.driver.phone.includes(Filter.text) ||
        taxi.vehicle.brand.includes(Filter.text) ||
        taxi.vehicle.type.includes(Filter.text) ||
        taxi.driver.note.includes(Filter.text)
        )
}

Filter.shouldShowCustomer = function(customer) {
    if(Filter.type === Filter.Cars) return false;
    return (
        customer.name.includes(Filter.text) || 
        customer.surname.includes(Filter.text) ||
        customer.phone.includes(Filter.text) ||
        customer.note.includes(Filter.text)
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