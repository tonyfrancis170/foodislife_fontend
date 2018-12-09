(function() {
  angular
    .module("routerModule", [])
    .config(function($stateProvider, $urlRouterProvider) {
      //$urlRouterProvider.otherwise("/");

      $stateProvider.state("login", {
        url: "/",
        templateUrl: "/partials/login.html",
        controller: "loginCtrl"
      });

      $stateProvider.state("register", {
        url: "/register",
        templateUrl: "/partials/register.html",
        controller: "regCtrl"
      });

      $stateProvider.state("dashboard", {
        url: "/dashboard",
        templateUrl: "/partials/dashboard.html",
        controller: "dashboardCtrl as vm"
      });

      $stateProvider.state("hotel", {
        url: "/hotel",
        templateUrl: "/partials/hotel.html",
        controller: "hotelCtrl as vm"
      });

      $stateProvider.state("admin", {
        url: "/admin",
        templateUrl: "/partials/admin.html",
        controller: "adminCtrl as vm"
      });

      $stateProvider.state("forgotPassword", {
        url: "/forgot-password/:id",
        templateUrl: "/partials/forgotPassword.html",
        controller: "forgotPassword as vm"
      });
    });
})();
