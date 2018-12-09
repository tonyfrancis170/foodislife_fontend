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
      if (!formData.email) {
        Notification.warning("Invalid email");
        return;
      }
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

    $scope.openEmailModal = () => {
      $("#forgotModal").modal("show");
    };

    $scope.forgotPassword = email => {
      $("#forgotModal").modal("hide");
      apiFactory
        .forgotPassword({ email })
        .then(resp => {
          $scope.forgotEmail = "";
          Notification.success(resp.data.message);
        })
        .catch(e => {
          console.log(e);
        });
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
      if (!formData.email) {
        Notification.warning("Invalid email");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Notification.warning("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        Notification.warning("Password too short. Minimum 6 characters");
        return;
      }

      let strongPassword = [
        { regex: /[A-Z]+/, type: "uppercase" },
        { regex: /[0-9]+/, type: "number" },
        { regex: /\W+/, type: "special" }
      ].reduce((acc, x) => {
        if (!x.regex.test(formData.password)) {
          Notification.warning(
            `Password should contain atlease one ${x.type} character`
          );
          acc = false;
        }
        return acc;
      }, true);

      if (!strongPassword) {
        return;
      }

      formData.isHotel = formData.isHotel === "false" ? false : true;

      grecaptcha.ready(() => {
        grecaptcha
          .execute("6LfgqX8UAAAAALka6Ya_sbR9ymuAExzdP1X3sy3Q", {
            action: "registration"
          })
          .then(token => {
            formData.captchaToken = token;
            apiFactory
              .signup(formData)
              .then(resp => {
                $scope.formData = {
                  isHotel: false
                };

                Notification.success(resp.data.message);
              })
              .catch(e => {
                Notification.error(e.data.message);
                console.log(e);
              });
          });
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
      vm.currentLocationId = locationId;
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

    vm.openReserveModal = hotelId => {
      $("#reserveModal").modal("show");
      vm.selectedHotel = hotelId;
    };

    vm.reservePacket = (count, hotelId, locationId) => {
      $("#reserveModal").modal("hide");
      vm.packets = 0;
      if (!count) return;
      if (count > 5) {
        Notification.warning("Maximum limit exceeded");
        return;
      }
      apiFactory
        .reservePackets({
          count,
          hotelId
        })
        .then(resp => {
          vm.getHotelsByLocation(locationId);
          Notification.success(resp.data.message);
          return apiFactory.getUserInfo();
        })
        .then(resp => {
          vm.user = resp.data.data;
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

  app.controller("forgotPassword", function(
    $scope,
    $state,
    $stateParams,
    apiFactory,
    Notification,
    localStorageService
  ) {
    let vm = this;
    vm.showInput = false;
    apiFactory
      .verifyEmailToken({ token: $stateParams.id })
      .then(resp => {
        if (resp.data.valid) {
          vm.showInput = true;
        } else {
          Notification.error(resp.data.message);
        }
      })
      .catch(e => {
        console.log(e);
        Notification.error(e.data.message);
      });

    vm.submitPassword = formData => {
      formData.token = $stateParams.id;
      if (formData.password !== formData.confirmPassword) {
        Notification.warning("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        Notification.warning("Password too short. Minimum 6 characters");
        return;
      }

      let strongPassword = [
        { regex: /[A-Z]+/, type: "uppercase" },
        { regex: /[0-9]+/, type: "number" },
        { regex: /\W+/, type: "special" }
      ].reduce((acc, x) => {
        if (!x.regex.test(formData.password)) {
          Notification.warning(
            `Password should contain atlease one ${x.type} character`
          );
          acc = false;
        }
        return acc;
      }, true);

      if (!strongPassword) {
        return;
      }
      apiFactory
        .setPassword(formData)
        .then(resp => {
          if (resp.data.valid) {
            $scope.formData = {};
            Notification.success(resp.data.message);
          } else {
            Notification.error(resp.data.message);
          }
        })
        .catch(e => {
          console.log(e);
          Notification.error(e);
        });
    };
  });
})();
