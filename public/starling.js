;

var geocoder;
var map;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var chicago = new google.maps.LatLng(41.85, -87.65);
    var options = {
        zoom: 2,
        center: chicago,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("world"), options);
}

function addBirthplace() {
    var birthplace = document.getElementById("birthplace").value;
    geocoder.geocode( { address: birthplace }, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
	    var marker = new google.maps.Marker({
		map: map,
		position: results[0].geometry.location
	    });
	} else {
	    alert("Geocode not successful for " + birthplace + ". Status: " + status);
	}
    });
}