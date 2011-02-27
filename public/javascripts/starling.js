;

var geocoder;
var map;
var thoughtworkers = {};

function reset() {
    $("#where").slideDown();
    $("#not-found").slideUp();
}

function createMarker(id, name, location, info_html) {
    thoughtworkers[id] = {
	info: new google.maps.InfoWindow({
	    content: info_html
	}),
	marker: new google.maps.Marker({
	    map: map,
	    position: location,
	    animation: google.maps.Animation.DROP,
	    title: name
	})
    }
    google.maps.event.addListener(thoughtworkers[id].marker, 'click', function() {
	thoughtworkers[id].info.open(map, thoughtworkers[id].marker);
    });
}

var loading_twers = 0;
$(document).ready(function() {
    geocoder = new google.maps.Geocoder();
    var chicago = new google.maps.LatLng(41.85, -87.65);
    var options = {
        zoom: 2,
        center: chicago,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("world"), options);

    $.get("/twer", function(all_twers) {
	var i;
	for (i = 0; i < all_twers.length; i += 1) {
	    setTimeout(function() {
		var place = new google.maps.LatLng(all_twers[loading_twers].latitude,
						   all_twers[loading_twers].longitude);
		createMarker(all_twers[loading_twers].id,
			     all_twers[loading_twers].name,
			     place,
			     all_twers[loading_twers].html);
		++loading_twers;
	    }, i * 200);
	}
    });
});

function addBirthplace() {
    var birthplace = document.getElementById("birthplace").value;
    var thoughtworker = document.getElementById("name").value;

    geocoder.geocode( { address: birthplace }, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
	    $.post("/nest", {
		name: thoughtworker,
		human_address: birthplace,
		latitude: results[0].geometry.location.lat(),
		longitude: results[0].geometry.location.lng()
	    }, function(twer) {
		var place = new google.maps.LatLng(twer.latitude,
						   twer.longitude);
		createMarker(twer.id,
			     twer.name,
			     place,
			     twer.html);
	    });
	} else {
	    $("#bad-loc").html(birthplace);
	    $("#not-found").slideDown();
	    $("#where").slideUp();
	}
    });
}

function deleteBirthplace(twer_id) {
    $.post("/twer/" + twer_id, $("#delete-" + twer_id).serialize());
    thoughtworkers[twer_id].marker.setMap(null);
    thoughtworkers[twer_id] = null;
}