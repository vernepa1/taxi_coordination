/**
 * Created by akucera on 4.12.16.
 */
(function (ns, $, undefined) {
    i = 0;

    db = null;
    ns.Persistence = function () {
        this.taxis = [];
        this.customers = [];
    };

    ns.Persistence.getInstance = function () {
        if (db == null) {
            db = new ns.Persistence();
        }
        return db;
    };
    
    ns.Persistence.generateId = function () {
        return i++;
    };

    ns.Persistence.prototype.addTaxi = function (taxi) {
        this.taxis.push(taxi);
    };

    ns.Persistence.prototype.addCustomer = function (customer) {
        this.customers.push(customer);
    };

    ns.Persistence.prototype.deleteCustomer = function (customer) {
        if (customer.taxi != null) {
            customer.taxi.customer = null;
        }
        var index = this.customers.indexOf(customer);
        this.customers.splice(index, 1);
    };

    ns.Persistence.prototype.initDBFromJson = function(json) {
        var self = this;
        $.each(json.taxis, function (i, t) {
            var person = new ns.Person(t.driver.name, t.driver.surname, t.driver.phone);
            var vehicle = new ns.Vehicle(t.vehicle.seats, t.vehicle.luggage, t.vehicle.brand, t.vehicle.type, t.vehicle.year, t.vehicle.premium);
            var taxi = new ns.Taxi(person, vehicle, t.lat, t.long, t.shiftEnd);
            self.addTaxi(taxi);
        });
        $.each(json.customers, function (i, t) {
            var person = new ns.Person(t.person.name, t.person.surname, t.person.phone);
            var fromLoc = new google.maps.LatLng(t.fromLat, t.fromLong);
            var toLoc = new google.maps.LatLng(t.toLat, t.toLong);
            var customer = new ns.Customer(person, null, fromLoc, toLoc, t.fromAddr, t.toAddr, t.price);
            self.addCustomer(customer);
        });
    };

    ns.Persistence.prototype.getFreeTaxis = function() {
        var free = [];
        $.each(this.taxis, function (i, taxi) {
            if (taxi.customer == null) {
                free.push(taxi);
            }
        });
        return free;
    };

    ns.Persistence.prototype.getTaxi = function (id) {
        return this.taxis.find(function(element) {
            return element.id == id;
        });
    };

    ns.Persistence.prototype.getCustomer = function (id) {
        return this.customers.find(function(element) {
            return element.id == id;
        });
    };

    //jak ridic tak zakaznik
    ns.Person = function (name, surname, phone) {
        this.id = ns.Persistence.generateId();
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.note = "";
    };

    ns.Person.prototype.getFullName = function () {
        return this.name + " " + this.surname;
    };

    ns.Vehicle = function (seats, luggage, brand, type, year, premium) {
        this.id =  ns.Persistence.generateId();
        this.seats = seats;
        this.luggage = luggage;
        this.brand = brand;
        this.type = type;
        this.year = year;
        this.premium = premium;
    };

    ns.Taxi = function (driver, vehicle, lat, long, shiftEnd) {
        this.id  = ns.Persistence.generateId();
        this.driver = driver; //odkaz na Person
        this.vehicle = vehicle; //odkaz na Vehicle
        this.shiftEnd = shiftEnd;
        this.loc = new google.maps.LatLng(lat, long);
        this.history = []; //todo kdy se naplnuje
        this.customer = null;
    };

    ns.Customer = function (person, taxi, fromLoc, toLoc, fromAdd, toAdd, price) {
        this.id = ns.Persistence.generateId();
        this.person = person;
        this.taxi = taxi;
        this.history = [];
        this.fromLoc = fromLoc;
        this.toLoc = toLoc;
        this.fromAdd = fromAdd;
        this.toAdd = toAdd;
        this.price = price;
    };


    
}(Taxi.Persistence = Taxi.Persistence || {}, jQuery));