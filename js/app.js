(function() {
  var app = angular.module("foodApp", [
    "ui.router",
    "routerModule",
    "ngSanitize",
    "ui-notification",
    "LocalStorageModule"
  ]);

  app.controller("loginCtrl", function(
    $scope,
    $state,
    apiFactory,
    Notification,
    localStorageService
  ) {
    $scope.formData = {};

    $scope.login = formData => {
      apiFactory
        .login(formData)
        .then(resp => {
          Notification.success(resp.data.message);
          localStorageService.set("token", resp.data.token);
          $state.go("dashboard");
        })
        .catch(e => {
          console.log(e);
        });
    };

    $scope.goToRegister = () => {
      $state.go("register");
    };
  });

  app.controller("regCtrl", function($scope, $state, apiFactory, Notification) {
    $scope.formData = {};

    $scope.signup = formData => {
      apiFactory
        .signup(formData)
        .then(resp => {
          $scope.formData = {};

          Notification.success(resp.data.message);
        })
        .catch(e => {
          console.log(e);
        });
    };

    $scope.goToLogin = () => {
      $state.go("login");
    };
  });

  app.controller("dashboardCtrl", function(
    $scope,
    $state,
    apiFactory,
    Notification,
    localStorageService
  ) {
    $scope.logout = () => {
      apiFactory
        .logout()
        .then(resp => {
          Notification.success(resp.data.message);
          $state.go("login");
        })
        .catch(e => {
          console.log(e);
        });
    };
  });
})();
