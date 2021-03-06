describe("overwatering.starling.ThoughtWorker", function() {
  var twer;
  var mockGeocoder;
  var validGeocoding;

  beforeEach(function() {
    validGeocoding = { lat: function() { return -45.8; }, lng: function() { return 109.4; } };
    mockGeocoder = {
      query: null,
      results: null,
      succeed: null,
      geocode: function(query, callbacks) {
        this.query = query;
        this.succeed ? callbacks.success(this.results) : callbacks.failure();
      }
    };
    twer = new overwatering.starling.ThoughtWorker();
    twer.name = "Giles";
    twer.human_address = "Wellington, NZ";
    twer.country = "Australia";
    twer.latLng = [45, 34];
  });

  it("should be able to store key details", function() {
    expect(twer.name).toEqual("Giles");
    expect(twer.human_address).toEqual("Wellington, NZ");
    expect(twer.country).toEqual("Australia");
    expect(twer.latLng).toEqual([45, 34]);
  });

  it("should be populatable from a chunk of JSON", function() {
    twer = new overwatering.starling.ThoughtWorker();
    var ret = twer.populateCore({
      id: 43,
      name: "Giles Alexander",
      latitude: 4,
      longitude: 6,
      html: "info html"
    });
    expect(twer.id).toEqual(43);
    expect(twer.name).toEqual("Giles Alexander");
    expect(twer.latLng).toEqual([4, 6]);
    expect(twer.info).toEqual("info html");
    expect(ret).toBe(twer);
  });

  it("should resolve the human address on demand", function() {
    var succeeded = jasmine.createSpy('resolve success');
    mockGeocoder.results = validGeocoding;
    mockGeocoder.succeed = true;
    twer.resolve(mockGeocoder, {
      success: succeeded, failure: function() {}
    });
    expect(mockGeocoder.query).toEqual("Wellington, NZ");
    expect(twer.latLng).toEqual([-45.8, 109.4]);
    expect(succeeded).toHaveBeenCalled();
  });

  it("should signal resolution failure", function() {
    var succeeded = jasmine.createSpy('resolve success');
    var failed = jasmine.createSpy('resolve failure');
    mockGeocoder.succeed = false;
    twer.resolve(mockGeocoder, {
      success: succeeded, failure: failed
    });
    expect(succeeded).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalled();
  });

});

describe("overwatering.starling.Repository", function() {

  describe("saving", function() {
    var twer;

    beforeEach(function() {
      spyOn(overwatering.starling.backend, 'post');
      var stubGeocoder = {};
      twer = new overwatering.starling.ThoughtWorker();
      twer.name = "Giles";
      twer.human_address = "Wellington, NZ";
      twer.country = "Australia";
      twer.latLng = [45, 34];
    });

    it("should ask the backend to save a ThoughtWorker", function() {
      var succeeded = jasmine.createSpy('save success');
      overwatering.starling.repository.save(twer, { success: succeeded, failure: function() {} });
      expect(overwatering.starling.backend.post).toHaveBeenCalled();
      expect(overwatering.starling.backend.post.mostRecentCall.args[0]).toEqual('/twer');
      expect(overwatering.starling.backend.post.mostRecentCall.args[1]).
        toEqual({ name: twer.name,
                  human_address: twer.human_address,
                  latitude: twer.latLng[0],
                  longitude: twer.latLng[1],
                  country: twer.country });

      overwatering.starling.backend.post.mostRecentCall.args[2].success({ id: 15, html: "info html" });
      expect(twer.id).toEqual(15);
      expect(twer.info).toEqual("info html");
    });

    it("should not update the ThoughtWorker if saving fails", function() {
      var succeeded = jasmine.createSpy('save success');
      var failed = jasmine.createSpy('save failed');
      overwatering.starling.repository.save(twer, { success: succeeded, failure: failed });
      overwatering.starling.backend.post.mostRecentCall.args[2].failure();
      expect(twer.id).not.toBeDefined();
      expect(twer.info).not.toBeDefined();
      expect(succeeded).not.toHaveBeenCalled();
      expect(failed).toHaveBeenCalled();
    });
  });

  describe("loading", function() {
    beforeEach(function() {
      spyOn(overwatering.starling.backend, 'get');
    });

    it("should load a ThoughtWorker by id", function() {
      var succeeded = jasmine.createSpy();
      overwatering.starling.repository.load(42, { success: succeeded, failure: function() {} });
      expect(overwatering.starling.backend.get).toHaveBeenCalled();
      expect(overwatering.starling.backend.get.mostRecentCall.args[0]).toEqual('/twer/42');
      
      overwatering.starling.backend.get.mostRecentCall.args[1].success({ id: 15,
                                                                         name: 'Giles',
                                                                         latitude: 45.9,
                                                                         longitude: 13.8,
                                                                         html: "some info"
                                                                       });

      var keys = ['id', 'name', 'latLng', 'info'];
      for (i = 0; i < keys.length; ++i) {
        expect(succeeded.mostRecentCall.args[0][keys[i]]).toBeDefined();
      }
    });

    it("should load all ThoughtWorkers", function() {
      var succeeded = jasmine.createSpy();
      overwatering.starling.repository.loadAll({ success: succeeded, failure: function() {} });
      expect(overwatering.starling.backend.get).toHaveBeenCalled();
      expect(overwatering.starling.backend.get.mostRecentCall.args[0]).toEqual('/twer');

      overwatering.starling.backend.get.mostRecentCall.args[1].success([{ id: 15,
                                                                         name: 'Giles',
                                                                         latitude: 45.9,
                                                                         longitude: 13.8,
                                                                         html: "some info"
                                                                       },
                                                                       { id: 15,
                                                                         name: 'Giles',
                                                                         latitude: 45.9,
                                                                         longitude: 13.8,
                                                                         html: "some info"
                                                                       }]);
      expect(succeeded.mostRecentCall.args[0].length).toEqual(2);
    });
  });

});

describe("overwatering.starling.world", function() {
  var twer;

  function createThoughtWorker(id) {
    var twer = new overwatering.starling.ThoughtWorker();
    twer.id = id;
    twer.name = "Giles";
    twer.human_address = "Wellington, NZ";
    twer.country = "Australia";
    twer.latLng = [45, 34];
    twer.info = "info html";
    return twer;
  }

  beforeEach(function() {
    twer = createThoughtWorker(15);
  });

  it("should initialise the underlying world as required", function() {
    spyOn(overwatering.starling.googleMaps, 'initialize');
    overwatering.starling.world.create("target");
    expect(overwatering.starling.googleMaps.initialize).toHaveBeenCalled();
  });

  it("should create a marker at the right location", function() {
    spyOn(overwatering.starling.googleMaps, 'marker').andReturn({ marker: { name: "m" }, info: "i" });
    spyOn(overwatering.starling.googleMaps, 'cluster');
    overwatering.starling.world.add(twer);
    expect(overwatering.starling.googleMaps.marker).toHaveBeenCalledWith("Giles",
                                                                         "info html",
                                                                         45,
                                                                         34);
    expect(twer.markerInfo.marker.twerId).toEqual(15);
    expect(overwatering.starling.googleMaps.cluster).toHaveBeenCalled();
  });
  
  it("should remove all traces of a thouhtworker", function() {
    spyOn(overwatering.starling.googleMaps, 'decluster');
    spyOn(overwatering.starling.googleMaps, 'demap');
    overwatering.starling.world.remove(15);
    expect(overwatering.starling.googleMaps.decluster).toHaveBeenCalled();
    expect(overwatering.starling.googleMaps.demap).toHaveBeenCalled();
  });

  describe("info sets", function() {
    beforeEach(function() {
      spyOn(overwatering.starling.googleMaps, 'marker').andReturn({ marker: "m", info: "i" });
      spyOn(overwatering.starling.googleMaps, 'cluster');
      overwatering.starling.world.add(twer);
      for (i = 1; i < 5; ++i) {
        overwatering.starling.world.add(createThoughtWorker(twer.id + i));
      }
    });

    it("should accumulate info for a set of TWers", function() {
      var twSetInfo = overwatering.starling.world.infoSet([15, 17, 19]);
      expect(twSetInfo).toMatch("<div id='twer-set'>.*info html.*info html.*info html.*<\/div>");
    });

    it("should display an info window for less than 10 ThoughtWorkers", function() {
      var fakeCluster = {
        getSize: function() { return 2; },
        getMarkers: function() { return [ { twerId: 15 }, { twerId: 22 } ] },
        getCenter: function() { return [45, 3]; }
      };
      spyOn(overwatering.starling.googleMaps, 'displayInfo');
      overwatering.starling.world.displayAnOpinion(fakeCluster);
      expect(overwatering.starling.googleMaps.displayInfo).toHaveBeenCalled();
    });

    it("should not display an info window for more than 10 ThoughtWorkers", function() {
      var fakeCluster = {
        getSize: function() { return 11; },
        getMarkers: function() { return [ { twerId: 15 },
                                   { twerId: 16 },
                                   { twerId: 17 },
                                   { twerId: 18 },
                                   { twerId: 19 },
                                   { twerId: 20 },
                                   { twerId: 21 },
                                   { twerId: 22 },
                                   { twerId: 23 },
                                   { twerId: 24 } ] },
        getCenter: function() { return [45, 3]; }
      };
      spyOn(overwatering.starling.googleMaps, 'displayInfo');
      overwatering.starling.world.displayAnOpinion(fakeCluster);
      expect(overwatering.starling.googleMaps.displayInfo).not.toHaveBeenCalled();
    });

  });

});
