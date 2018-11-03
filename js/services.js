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
