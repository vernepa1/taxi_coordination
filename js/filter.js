var Filter = {};

Filter.CarsAndCustomers = 0;
Filter.Cars = 1;
Filter.Customers = 2;

Filter.AllTaxis = 0;
Filter.BasicTaxis = 1;
Filter.PremiumTaxis = 2;

Filter.db = Taxi.Persistence.Persistence.getInstance();

Filter.clearAll = function() {
    Filter.type = Filter.CarsAndCustomers;
    Filter.taxiType = Filter.AllTaxis;
    Filter.passengers = 1;
    Filter.luggage = 1;
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

Filter.clearAll();

Filter.shouldShowTaxi = function(taxi) {
    if(Filter.type == Filter.Customers) return false;
    if(Filter.taxiType == Filter.PremiumTaxis) return false;
    if(Filter.passengers > taxi.vehicle.seats) return false;
    if(Filter.luggage > taxi.vehicle.luggage) return false;
    return true;
}

Filter.shouldShowCustomer = function(customer) {
    return (Filter.type != Filter.Cars);
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
        if(Filter.shouldShowCustomer(customers[i])) filteredCustomers.push(customers[i]);
    }
    return filteredCustomers;
}