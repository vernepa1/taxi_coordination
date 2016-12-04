/**
 * Created by akucera on 4.12.16.
 */
(function (ns, $, undefined) {

    ns.Map = function () {
        var mapCanvas = document.getElementById('map');

        var location = new google.maps.LatLng(50.0875746, 14.4189987);

        var mapOptions = {
            center: location,
            zoom: 16,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(mapCanvas, mapOptions);

        var markerImage = 'car_2.png';

        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.map);

        this.map.addListener('click', function (event) {
            //todo akorat tohle je vlastne nesmysl, protoze taxi nemaji jit pridavat pres mapu, ty uz tam proste jsou z jineho systemu jakoby
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            var pos = new google.maps.LatLng(latitude, longitude);
            db.addTaxi(taxi);
            var marker = new google.maps.Marker({
                position: pos,
                map: this.map,
                icon: markerImage
            });
        });
    };

    ns.Map.prototype.addTaxi = function (id, loc) {
        var markerImage = 'car_2.png';

        var marker = new google.maps.Marker({
            position: loc,
            map: this.map,
            icon: markerImage,
            taxiId: id
        });

        //todo a kdyz se na nej klikne, tak co?
        //zmenit ikonu a zobrzit info vlevo?
    };

    ns.Map.prototype.updateMap = function (db) {
        var self = this;
        $.each(db.taxis, function (i, d) {
            self.addTaxi(d.id, d.loc);
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