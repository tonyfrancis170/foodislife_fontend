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
          url: url + "/listAllLocations",
          method: "GET"
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
      getHotelInfo: function() {
        return $http({
          url: url + "/api/getHotelInfo",
          methods: "GET",
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

      getUserInfo: function() {
        return $http({
          url: url + "/api/getUserInfo",
          method: "GET",
          headers: {
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      addFoodPackets: function(payload) {
        return $http({
          url: url + "/api/addFoodPackets",
          method: "PUT",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      getHotelsByLocation: function(payload) {
        return $http({
          url: url + "/api/getHotelsByLocation",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      reservePackets: function(payload) {
        return $http({
          url: url + "/api/reservePackets",
          method: "PUT",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      forgotPassword: function(payload) {
        return $http({
          url: url + "/forgotPassword",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorageService.get("token")
          }
        });
      },
      verifyEmailToken: function(payload) {
        return $http({
          url: url + "/verifyEmailToken",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json"
          }
        });
      },
      setPassword: function(payload) {
        return $http({
          url: url + "/setPassword",
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json"
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
