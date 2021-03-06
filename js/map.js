/**
 * Created by akucera on 4.12.16.
 */
(function (ns, $, undefined) {

    map = null;

    ns.Map = function () {
        var mapCanvas = document.getElementById('map');

        var location = new google.maps.LatLng(50.0875746, 14.4189987);

        var mapOptions = {
            center: location,
            zoom: 16,
            panControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(mapCanvas, mapOptions);

        this.taxiMarkers = [];
        this.customerMarkers = [];

        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.map);

		var defaultBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(48.741, 12.007),
			new google.maps.LatLng(51.007, 18.742)
		);

		var fromBox = document.getElementById('FromBox');
		var searchBoxFrom = new google.maps.places.SearchBox(fromBox, { bounds: defaultBounds });
		var toBox = document.getElementById('ToBox');
		var searchBoxTp = new google.maps.places.SearchBox(toBox, { bounds: defaultBounds });
    };

    ns.Map.getInstance = function () {
        if (map == null) {
            map = new ns.Map();
        }
        return map;
    };


    // ns.Map.clickHandler = function (event) {
        // Selection.unselectAll();

        // var latitude = event.latLng.lat();
        // var longitude = event.latLng.lng();
        // var pos = new google.maps.LatLng(latitude, longitude);

        // var geocoder = new google.maps.Geocoder();

        // geocoder.geocode({
            // 'latLng': pos
        // }, function (results, status) {
            // if (status == google.maps.GeocoderStatus.OK) {
                // if (results[0]) {
                    // $("#FromBox").val(results[0].formatted_address);
                // }
            // }
        // });
    // };

    ns.Map.loadCustomerFromLocation = function(customer, from) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': from
        }, function (results, status) {
            if (results.length == 0) {
                alert("Could not get position from the \"From address\", try again with more accurate address.")
            }
            if (status == google.maps.GeocoderStatus.OK) {
                var db = Taxi.Persistence.Persistence.getInstance();
                var c = db.getCustomer(customer);
                if (results[0]) {
                    c.fromLoc = results[0].geometry.location;
                }
                ns.Map.getInstance().updateMap();
            }
        });
    };

    ns.Map.loadCustomerToLocation = function(customer, to) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': to
        }, function (results, status) {
            if (results.length == 0) {
                alert("Could not get position from the \"To address\", try again with more accurate address.")
            }
            if (status == google.maps.GeocoderStatus.OK) {
                var db = Taxi.Persistence.Persistence.getInstance();
                var c = db.getCustomer(customer);
                if (results[0]) {
                    c.toLoc = results[0].geometry.location;
                }
                ns.Map.getInstance().updateMap();
            }
        });
    };

    ns.Map.prototype.addTaxi = function (id, loc) {
        var icon = 'car.png';
        if(Selection.isSelectedTaxiId(id))
            icon = 'car_selected.png';

        var marker = new google.maps.Marker({
            position: loc,
            map: this.map,
            icon: icon,
            taxiId: id
        });

        this.taxiMarkers.push(marker);

        //todo zmenit ikonu
        marker.addListener('click', function () {
            Selection.selectTaxiMarker(marker);
        });
    };

    ns.Map.prototype.addCustomer = function (id, fromLoc, toLoc) {
        var icon = 'icon-person.png';
        if(Selection.isSelectedCustomerId(id))
            icon = 'icon-person_selected.png';

        var toMarker = "to_small.png";

        var fromMarker = new google.maps.Marker({
            position: fromLoc,
            map: this.map,
            icon: icon,
            customerId: id
        });
        var toMarker = new google.maps.Marker({
            position: toLoc,
            map: this.map,
            icon: toMarker,
            customerId: id
        });

        var line = new google.maps.Polyline({
            path: [
                fromMarker.position,
                toMarker.position
            ],
            strokeColor: "#ff7c8d",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: this.map
        });

        line.addListener('click', function () {
            Selection.selectCustomerId(fromMarker.customerId);
        });

        var c = Taxi.Persistence.Persistence.getInstance().getCustomer(id);
        if (c.taxi != null) {
            var driverLine = new google.maps.Polyline({
                path: [
                    fromMarker.position,
                    c.taxi.loc
                ],
                strokeColor: "#00FF00",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                map: this.map
            });

            this.customerMarkers.push(driverLine);
            driverLine.addListener('click', function () {
               Selection.selectCustomerId(fromMarker.customerId);
            });
        }

        this.customerMarkers.push(fromMarker);
        this.customerMarkers.push(toMarker);
        this.customerMarkers.push(line);


        //todo a kdyz se na nej klikne, tak co?
        //zmenit ikonu a zobrzit info vlevo?
        fromMarker.addListener('click', function () {
            Selection.selectCustomerId(fromMarker.customerId);
        });
    };

    ns.Map.prototype.cleanMarkers = function () {
        $.each(this.taxiMarkers, function (i, m) {
            m.setMap(null);
        });
        $.each(this.customerMarkers, function (i, m) {
            m.setMap(null);
        });
        this.taxiMarkers.length = 0;
        this.customerMarkers.length = 0;
    };

    ns.Map.prototype.updateMap = function () {
        var db = Taxi.Persistence.Persistence.getInstance();
        db.clean();
        this.cleanMarkers();
        var self = this;
        var filteredTaxis = Filter.filterTaxis(db.taxis);
        var filteredCustomers = Filter.filterCustomers(db.customers);
        Selection.unselectTaxiIfNotIn(filteredTaxis);
        Selection.unselectCustomerIfNotIn(filteredCustomers);
        $.each(filteredTaxis, function (i, d) {
            self.addTaxi(d.id, d.loc);
        });
        $.each(filteredCustomers, function (i, d) {
            self.addCustomer(d.id, d.fromLoc, d.toLoc);
        })
    };

    /* function initMap() {

     var location = new google.maps.LatLng(50.0875726, 14.4189987);

     var mapCanvas = document.getElementById('map');
     var mapOptions = {
     center: location,
     zoom: 16,
     panControl: false,
     scrollwheel: false,
     mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     var map = new google.maps.Map(mapCanvas, mapOptions);

     var trafficLayer = new google.maps.TrafficLayer();
     trafficLayer.setMap(map);

     var markerImage = 'car_2.png';

     var marker = new google.maps.Marker({
     position: location,
     map: map,
     icon: markerImage
     });

     map.addListener('center_changed', function () {
     // 3 seconds after the center of the map has changed, pan back to the
     // marker.
     window.setTimeout(function () {
     map.panTo(marker.getPosition());
     }, 3000);
     });
     marker.addListener('click', function () {
     map.setZoom(8);
     map.setCenter(marker.getPosition());
     infowindow.open(map, marker);
     });

     var contentString = '<div class="info-window">' +
     '<h3>Info Window Content</h3>' +
     '<div class="info-content">' +
     '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
     '</div>' +
     '</div>';

     var infowindow = new google.maps.InfoWindow({
     content: contentString,
     maxWidth: 400
     });

     marker.addListener('click', function () {
     infowindow.open(map, marker);
     });
     map.addListener('click', function (event) {
     //todo akorat tohle je vlastne nesmysl, protoze taxi nemaji jit pridavat pres mapu, ty uz tam proste jsou z jineho systemu jakoby
     var latitude = event.latLng.lat();
     var longitude = event.latLng.lng();
     var pos = new google.maps.LatLng(latitude, longitude);
     db.addTaxi(taxi);
     var marker = new google.maps.Marker({
     position: pos,
     map: map,
     icon: markerImage
     });
     });

     }*/


}(Taxi.Map = Taxi.Map || {}, jQuery));