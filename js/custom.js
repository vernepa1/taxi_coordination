function OKButton() {
    //if ($('#FormBox').val().length == 0) {
    //    $("#FormBox").css('background-color',  'red');
    //} else {
    //    $("#FormBox").css('background-color',  'white');
    //}    
    $('#FromLabel').html ( $('#FormBox').val() );
    $('#ToLabel').html ( $('#ToBox').val() );
    $('#DateLabel').html ( $('#DateBox').val() + " " + $('#TimeBox').val());
    $('#PassLabel').html ( $('#PassBox').val() );
    $('#LuggLabel').html ( $('#LuggBox').val() );
    $("#VIPLabel").prop("checked", document.getElementById('VIPBox').checked);
}


$(function () {

    var db = new Taxi.Persistence.Persistence();
    $.getJSON("js/init.json")
        .done(function (d) {
            console.log(d);
            db.initTaxisFromJson(d);
        });

    function initMap() {

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

    }

    function moveProgress() {
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 60); // it will take 6 seconds to get to the end
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                elem.style.width = width + '%';
            }
        }
    }


    google.maps.event.addDomListener(window, 'load', initMap);
    moveProgress();
});
