(function() {
  var app = angular.module("foodApp");

  app.factory("apiFactory", function($http, localStorageService) {
    const url = "http://localhost:1337";
    return {
      login: function(payload) {
        return $http({
          url: url + "/login",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json"
          }
        });
      },
      signup: function(payload) {
        return $http({
          url: url + "/signup",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json"
          }
        });
      },

      listAllLocations: function() {
        return $http({
          url: url + "/api/listAllLocations",
          method: "GET",
          headers: {
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      getAllUsers: function() {
        return $http({
          url: url + "/api/getAllUsers",
          method: "GET",
          headers: {
            "x-access-token": localStorageService.get("token")
          }
        });
      },

      reActivate: function(payload) {
        return $http({
          url: url + "/api/reActivate",
          method: "PUT",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },

      deActivate: function(payload) {
        return $http({
          url: url + "/api/deActivate",
          method: "PUT",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },

      addLocation: function(payload) {
        return $http({
          url: url + "/api/addLocation",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      logout: function() {
        return $http({
          url: url + "/api/logout",
          method: "GET",
          headers: {
            "x-access-token": localStorageService.get("token")
          }
        });
      }
    };
  });
})();
