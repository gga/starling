;

var geocoder;
var map;
var marker_clusters;
var thoughtworkers = {};

function reset() {
    $("#where").slideDown();
    $("#not-found").slideUp();
    $("#bad-request").slideUp();
    $("#thanks").slideUp();
}

function createMarker(id, name, location, info_html) {
    thoughtworkers[id] = {
	info: new google.maps.InfoWindow({
	    content: info_html
	}),
	marker: new google.maps.Marker({
	    position: location,
	    animation: google.maps.Animation.DROP,
	    title: name
	})
    }
    google.maps.event.addListener(thoughtworkers[id].marker, 'click', function() {
	thoughtworkers[id].info.open(map, thoughtworkers[id].marker);
    });
    return thoughtworkers[id];
}

function simulatePlaceholder(element, text) {
    if (!WebKitDetect.isWebKit()) {
	element.val(text);
	element.focus(function() {
	    if (this.value == text)
		this.value = "";
	});
	element.blur(function() {
	    if (this.value == "")
		this.value = text;
	});
    }
}

$(document).ready(function() {
    geocoder = new google.maps.Geocoder();
    var chicago = new google.maps.LatLng(41.85, -87.65);
    var options = {
        zoom: 2,
        center: chicago,
	minZoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("world"), options);
    marker_clusters = new MarkerClusterer(map,
					  {
					      gridSize: 80
					  });

    $.get("/twer", function(all_twers) {
	var i;
	var all = [];
	for (i = 0; i < all_twers.length; i += 1) {
	    var place = new google.maps.LatLng(all_twers[i].latitude,
					       all_twers[i].longitude);
	    all.push(createMarker(all_twers[i].id,
				  all_twers[i].name,
				  place,
				  all_twers[i].html).marker);
	}
	marker_clusters.addMarkers(all);
    });
    simulatePlaceholder($("#birthplace"), "Town, Country");
    simulatePlaceholder($("#name"), "First Last");
});

function addBirthplace() {
    var birthplace = $("#birthplace").val();

    geocoder.geocode( { address: birthplace }, function(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
	    $.post("/nest",
		   {
		       name: $("#name").val(),
		       human_address: birthplace,
		       latitude: results[0].geometry.location.lat(),
		       longitude: results[0].geometry.location.lng(),
		       country: $("#country option:selected").val()
		   },
		   function(twer) {
		       var place = new google.maps.LatLng(twer.latitude,
							  twer.longitude);
		       var marker = createMarker(twer.id,
						 twer.name,
						 place,
						 twer.html).marker;
		       marker_clusters.addMarker(marker);
		       $("#thanks").slideDown();
		       $("#where").slideUp();
		   }).error(function() {
		       $("#bad-request").slideDown();
		       $("#where").slideUp();
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
    marker_clusters.removeMarker(thoughtworkers[twer_id].marker);
    thoughtworkers[twer_id].marker.setMap(null);
    thoughtworkers[twer_id] = null;
}
