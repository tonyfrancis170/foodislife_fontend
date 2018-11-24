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
    $scope.formData = {
      isHotel: "false"
    };
    apiFactory
      .listAllLocations()
      .then(resp => {
        $scope.locations = resp.data.data;
      })
      .catch(e => {
        console.log(e);
      });

    $scope.signup = formData => {
      formData.isHotel = formData.isHotel !== "false";

      apiFactory
        .signup(formData)
        .then(resp => {
          $scope.formData = {
            isHotel: "false"
          };

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
    let vm = this;

    apiFactory
      .getUserInfo()
      .then(resp => {
        vm.user = resp.data.data;
      })
      .catch(e => {
        console.log(e);
      });

    apiFactory
      .listAllLocations()
      .then(resp => {
        $scope.locations = resp.data.data;
      })
      .catch(e => {
        console.log(e);
      });

    vm.getHotelsByLocation = locationId => {
      apiFactory
        .getHotelsByLocation({ location: locationId })
        .then(resp => {
          vm.hotels = resp.data.data;
          console.log(vm.hotels);
        })
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
    let vm = this;

    vm.packets = 0;
    apiFactory
      .getHotelInfo()
      .then(resp => {
        vm.hotelInfo = resp.data.data;
      })
      .catch(e => {
        console.log(e);
      });

    vm.addFoodPackets = count => {
      $("#packetsModal").modal("hide");
      apiFactory
        .addFoodPackets({ count })
        .then(resp => {
          Notification.success(resp.data.message);
          vm.packets = 0;
          vm.hotelInfo = resp.data.data;
        })

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
})();
