(function() {
  var app = angular.module("foodApp", [
    "ui.router",
    "routerModule",
    "ngSanitize",
    "ui-notification",
    "LocalStorageModule"
  ]);

  // Application controllers
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
          localStorageService.set("userData", resp.data.userData);

          switch (resp.data.userData.role) {
            case 1:
              $state.go("dashboard");
              break;
            case 2:
              $state.go("hotel");
              break;
            case 3:
              $state.go("admin");
              break;
          }
        })
        .catch(e => {
          Notification.error(e.data.message);
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
          Notification.error(e.data.message);
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
          $state.go("login");
          Notification.error(e.data.message);
          console.log(e);
        });
    };
  });

  app.controller("adminCtrl", function(
    $scope,
    $state,
    $timeout,
    apiFactory,
    Notification,
    localStorageService
  ) {
    let vm = this;
    // get locations
    Promise.all([apiFactory.listAllLocations(), apiFactory.getAllUsers()])
      .then(loadAdminData)
      .catch(e => {
        console.log(e);
      });

    function loadAdminData(resp) {
      vm.locations = resp[0].data.data;
      vm.users = resp[1].data.data;
      console.log(vm.users);
      $timeout(() => {
        $scope.$apply();
      });
    }
    vm.toggleStatus = (status, id) => {
      let action = status ? "reActivate" : "deActivate";

      apiFactory[action]({ userId: id })
        .then(resp => {
          Notification.success(resp.data.message);
          return Promise.all([
            apiFactory.listAllLocations(),
            apiFactory.getAllUsers()
          ]);
        })
        .then(loadAdminData)
        .catch(e => {
          console.log(e);
        });
    };
    vm.addLocation = location => {
      $("#locationModal").modal("hide");
      vm.newLocation = "";
      apiFactory
        .addLocation({ location: location })
        .then(resp => {
          Notification.success(resp.data.message);
          return Promise.all([
            apiFactory.listAllLocations(),
            apiFactory.getAllUsers()
          ]);
        })
        .then(loadAdminData)
        .catch(e => {
          console.log(e);
        });
    };
    $scope.logout = () => {
      apiFactory
        .logout()
        .then(resp => {
          Notification.success(resp.data.message);
          $state.go("login");
        })
        .catch(e => {
          $state.go("login");
          Notification.error(e.data.message);
          console.log(e);
        });
    };
  });

  app.controller("hotelCtrl", function(
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
          $state.go("login");
          Notification.error(e.data.message);
          console.log(e);
        });
    };
  });
})();
