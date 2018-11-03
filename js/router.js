(function() {
  angular
    .module("routerModule", [])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");

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
        controller: "dashboardCtrl"
      });
    });
})();
