;

var overwatering = {
  starling: {
    world: {
      twers: []
    },
    googleMaps: {
      geocoder: null,
      map: null,
      clusters: null
    },
    backend: {},
    repository: {}
  }
};

overwatering.starling.googleMaps.initialize = function(startLatLng, target, clusterClick) {
  var that = this;
  this.geocoder = new google.maps.Geocoder();
  this.map = new google.maps.Map(target, {
    zoom: 2,
    center: new google.maps.LatLng(startLatLng[0], startLatLng[1]),
    minZoom: 1,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  this.clusters = new MarkerClusterer(this.map, [], {
    zoomOnClick: false,
    imagePath: 'images/m'
  });
  google.maps.event.addListener(this.clusters, 'clusterclick', function(cluster) {
    if (cluster.getSize() < 10) {
      clusterClick(cluster);
    } else {
      that.map.fitBounds(cluster.getBounds());
    }
  });
};

overwatering.starling.googleMaps.geocode = function(searchAddress, callbacks) {
  this.geocoder.geocode( { address: searchAddress }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      callbacks.success(results[0].geometry.location);
    } else {
      callbacks.failure();
    }
  });
};

overwatering.starling.googleMaps.marker = function(name, infoText, lat, lng) {
  var markerInfo = {
    info: new google.maps.InfoWindow({
      content: infoText
    }),
    marker: new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      animation: google.maps.Animation.DROP,
      title: name
    })
  };
  google.maps.event.addListener(markerInfo.marker, 'click', function() {
    markerInfo.info.open(this.map, markerInfo.marker);
  });
  return markerInfo;
};

overwatering.starling.googleMaps.cluster = function(markers) {
  this.clusters.addMarkers(markers);
};

overwatering.starling.googleMaps.decluster = function(marker) {
  this.clusters.removeMarker(marker);
};

overwatering.starling.googleMaps.demap = function(markerInfo) {
  markerInfo.marker.setMap(null);
};

overwatering.starling.googleMaps.displayInfo = function(info, center) {
  var clusterInfo = new google.maps.InfoWindow({
    content: info,
    position: center
  });
  clusterInfo.open(this.map);
};

overwatering.starling.backend.post = function(path, data, callbacks) {
  $.post(path, data, function(value) {
    callbacks.success(value);
  }).error(function() {
    callbacks.failure();
  });
};

overwatering.starling.backend.get = function(path, callbacks) {
  $.get(path, function(value) {
    callbacks.success(value);
  }).error(function() {
    callbacks.failure();
  });
};

overwatering.starling.ThoughtWorker = function() {
};

overwatering.starling.ThoughtWorker.prototype.populateCore = function(coreData) {
  this.id = coreData.id;
  this.name = coreData.name;
  this.latLng = [coreData.latitude, coreData.longitude];
  this.info = coreData.html;
  return this;
};

overwatering.starling.ThoughtWorker.prototype.resolve = function(geocoder, callbacks) {
  var that = this;
  geocoder.geocode(this.human_address, {
    success: function(location) {
      that.latLng = [location.lat(), location.lng()];
      callbacks.success();
    },
    failure: function() {
      callbacks.failure();
    }
  });
};

overwatering.starling.repository.save = function(twer, callbacks) {
  overwatering.starling.backend.post('/twer', {
    name: twer.name,
    human_address: twer.human_address,
    latitude: twer.latLng[0],
    longitude: twer.latLng[1],
    country: twer.country
  }, {
    success: function(value) {
      twer.id = value.id;
      twer.info = value.html;
      callbacks.success();
    },
    failure: function() {
      callbacks.failure();
    }
  });
};

overwatering.starling.repository.load = function(twer_id, callbacks) {
  overwatering.starling.backend.get('/twer/' + twer_id, {
    success: function(value) {
      var twer = new overwatering.starling.ThoughtWorker();
      callbacks.success(twer.populateCore(value));
    },
    failure: function() {
      callbacks.failure();
    }
  });
};

overwatering.starling.repository.loadAll = function(callbacks) {
  overwatering.starling.backend.get("/twer", {
    success: function(all_twers) {
      var all = [];
      for (i = 0; i < all_twers.length; i += 1) {
        var twer = new overwatering.starling.ThoughtWorker();
        all.push(twer.populateCore(all_twers[i]));
      }
      callbacks.success(all);
    },
    failure: function() {
      callbacks.failure();
    }
  });
};

overwatering.starling.world.create = function(target) {
  var chicago = [41.85, -87.65];
  overwatering.starling.googleMaps.initialize(chicago,
                                              target,
                                              overwatering.starling.world.displayAnOpinion);
};

overwatering.starling.world.displayAnOpinion = function(cluster) {
  if (cluster.getSize() <= 10) {
    var thoughtworkers = [];
    for (i = 0; i < cluster.getMarkers().length; ++i) {
      thoughtworkers.push(cluster.getMarkers()[i].twerId);
    }
    var infoHtml = overwatering.starling.world.infoSet(thoughtworkers);
    overwatering.starling.googleMaps.displayInfo(infoHtml, cluster.getCenter());
  }
};

overwatering.starling.world.add = function(twer) {
  this.twers[twer.id] = twer;
  twer.markerInfo = overwatering.starling.googleMaps.marker(twer.name,
                                                            twer.info,
                                                            twer.latLng[0],
                                                            twer.latLng[1]);
  twer.markerInfo.marker.twerId = twer.id;
  overwatering.starling.googleMaps.cluster([twer.markerInfo.marker]);
};

overwatering.starling.world.infoSet = function(ids) {
  var info = "<div id='twer-set'>";
  for (i = 0; i < ids.length; ++i) {
    if (this.twers[ids[i]]) {
      info += this.twers[ids[i]].info;
    }
  }
  return info + "</div>";
};

overwatering.starling.world.remove = function(twer_id) {
  overwatering.starling.googleMaps.decluster(this.twers[twer_id].marker);
  overwatering.starling.googleMaps.demap(this.twers[twer_id].markerInfo);
  this.twers[twer_id] = null;
};

// *****************************************************************************************
// *****************************************************************************************
// *****************************************************************************************

function reset() {
  $("#where").slideDown();
  $("#not-found").slideUp();
  $("#bad-request").slideUp();
  $("#thanks").slideUp();
}

function simulatePlaceholder(element, text) {
  if (!WebKitDetect.isWebKit()) {
    element.val(text);
    element.focus(function() {
      if (this.value === text) {
        this.value = "";
      }
    });
    element.blur(function() {
      if (this.value === "") {
        this.value = text;
      }
    });
  }
}

$(document).ready(function() {
  overwatering.starling.world.create(document.getElementById("world"));
  overwatering.starling.repository.loadAll({
    success: function(all) {
      for (i = 0; i < all.length; ++i) {
        overwatering.starling.world.add(all[i]);
      }
    },
    failure: function() {}
  });
  
  simulatePlaceholder($("#birthplace"), "Town, Country");
  simulatePlaceholder($("#name"), "First Last");
});

function addBirthplace() {
  var birthplace = $("#birthplace").val();
  var twer = new overwatering.starling.ThoughtWorker();
  twer.name = $("#name").val();
  twer.human_address = $("#birthplace").val();
  twer.country = $("#country option:selected").val();
  
  twer.resolve(overwatering.starling.googleMaps, {
    success: function() {
      overwatering.starling.repository.save(twer, {
        success: function() {
          overwatering.starling.world.add(twer);
          $("#thanks").slideDown();
          $("#where").slideUp();
        },
        failure: function() {
          $("#bad-request").slideDown();
          $("#where").slideUp();
        }
      });
    },
    failure: function() {
      $("#bad-loc").html(twer.human_address);
      $("#not-found").slideDown();
      $("#where").slideUp();
    }
  });
}

function deleteBirthplace(twer_id) {
  $.post("/twer/" + twer_id, $("#delete-" + twer_id).serialize());
  overwatering.starling.world.remove(twer_id);
}
