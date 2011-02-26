;

var geocoder;
var map;

function createMarker(name, location, info_html) {
    var info = new google.maps.InfoWindow({
	content: info_html
    });
    var marker = new google.maps.Marker({
	map: map,
	position: location,
	animation: google.maps.Animation.DROP,
	title: name
    });
    google.maps.event.addListener(marker, 'click', function() {
	info.open(map, marker);
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
		createMarker(all_twers[loading_twers].name,
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
	    }, function(nested) {
		createMarker(thoughtworker, results[0].geometry.location, nested);
	    });
	} else {
	    alert("Geocode not successful for " + birthplace + ". Status: " + status);
	}
    });
}