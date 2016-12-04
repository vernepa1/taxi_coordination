/**
 * Created by akucera on 4.12.16.
 */
(function (ns, $, undefined) {

    ns.Persistence = function () {
        this.taxis = [];
        this.customers = []
    };

    ns.Persistence.prototype.addTaxi = function (taxi) {
        this.taxis.push(taxi);
    };

    ns.Persistence.prototype.addCustomer = function (customer) {
        this.customers.push(customer);
    };
    
    ns.Taxi = function (id, loc) {
        this.id = id;
        this.loc = loc;
    }
    
}(Taxi.Persistence = Taxi.Persistence || {}, jQuery));