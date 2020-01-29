var APP = angular.module('rocky-marciano', [
    'ui.router'
]);

APP.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {

    };
    $httpProvider.defaults.headers.post = {
        "Content-Type": "application/json; charset=utf-8"
    };
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);

APP.run([function () {
    console.log('Angular is running');
}]);

/**********************************************************/

APP.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var login = {
            name: 'login',
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'login.html'
        }

        var home = {
            name: 'home',
            url: '/home',
            controller: 'HomepageController',
            templateUrl: 'home.html'
        }

        var registration = {
            name: 'registration',
            url: '/registration',
            controller: 'RegistrationController',
            templateUrl: 'registration.html'
        }

        var clientsList = {
            name: 'clientsList',
            url: '/clients',
            controller: 'ClientsListController',
            templateUrl: 'clientsList.html'
        }

        var subscription = {
            name: 'subscription',
            url: '/subscription',
            params: {
                id: undefined,
                clientId: undefined
            },
            templateUrl: 'subscription.html',
            controller: 'SubscriptionController',
        }

        var attivita = {
            name: 'attivita',
            url: '/attivita',
            templateUrl: 'attivita.html',
            controller: 'AttivitaController',
        }

        $stateProvider.state(home);
        $stateProvider.state(login);
        $stateProvider.state(registration);
        $stateProvider.state(clientsList);
        $stateProvider.state(subscription);
        $stateProvider.state(attivita);

    }]);

/**********************************************************/

APP.controller('AttivitaController', ['$scope', '$stateParams', '$state', '$http', '$sportService',
    function($scope, $stateParams, $state, $http, $sportService) {

        $sportService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.add = function () {
            $scope.sports.push({name: "", price: 0, isEditing: true});
        }

        $scope.save = function (sport) {
            $sportService.save(sport);
        }

        $scope.delete = function (sport) {
            $sportService.delete(sport);
            $sportService.getAll().then(function (success) {
                $scope.sports = success.data;
            });
        }

    }]);

/**********************************************************/

APP.controller('ClientController', ['$scope', '$stateParams', '$state', '$http', '$sportService',
    function($scope, $stateParams, $state, $http, $sportService) {

        $scope.clientId = $stateParams.id;

        $http.get("http://localhost:8094/rocky-marciano" + '/clients/' + $scope.clientId).then(function (success) {
            $scope.client = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.sports = $sportService.sports;

        $scope.subscription = function (client) {
            $state.go('subscription', {id: client.id});
        };

    }]);

/**********************************************************/

APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http',
    function($scope, $rootScope, $stateParams, $state, $http) {

        $http.get("http://localhost:8094/rocky-marciano" + '/clients').then(function (success) {
            $scope.clients = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.isExpired = function (client) {
            return client.expirationDate == undefined || client.expirationDate < $rootScope.date || client.certificateExpirationDate == undefined || client.certificateExpirationDate < $rootScope.date
        }

        $scope.isAlert = function (client) {
            var date = new Date($rootScope.date);
            date = date.setDate(date.getDate() + 7);
            date = new Date(date);
            return new Date(client.expirationDate) < date || new Date(client.certificateExpirationDate) < date;
        }

    }]);

/**********************************************************/

APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state',
    function($scope, $rootScope, $stateParams, $state, ) {

        console.log('Header Controller');

        $scope.click = function (section) {
            $scope.active = section;
        }

        $scope.isActive = function (section) {
            return $scope.active == section;
        }

        $scope.openClientCard = function (id) {
            $state.go('client', {id:id})
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);

/**********************************************************/

APP.controller('HomepageController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

        console.log('Homepage Controller');


    }]);

/**********************************************************/

APP.controller('LoginController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

    console.log('Login Controller');


    }]);

/**********************************************************/

APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', '$sportService',
    function($scope, $stateParams, $state, $http, $filter, $sportService) {

    $scope.save = function (client) {
        client.dateOfBirth = $filter('date')(client.dateOfBirth, 'yyyy-MM-dd');
        $http.post("http://localhost:8094/rocky-marciano" + '/clients', client).then(function (success) {
            $state.go('clientsList');
        }, function (error) {
            console.log('error: ', error);
        })

    }

    $scope.isValid = function(field) {
        return field != undefined && field != '';
    }

    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("image", files[0]);

        $http.post("http://localhost:8094/rocky-marciano" + '/clients' + '/image', fd, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function (success) {
            console.log(success);
        }, function (error) {
            console.log(error);
        })

    };

    $scope.sports = $sportService.sports;

    }]);

/**********************************************************/

APP.controller('SubscriptionController', ['$scope', '$stateParams', '$state', '$clientService', '$subscriptionService', '$sportService',
    function($scope, $stateParams, $state, $clientService, $subscriptionService, $sportService) {

        $scope.clientId = $stateParams.clientId;

        $clientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;
        });

        $subscriptionService.getByClientId($scope.clientId).then(function(success) {
            $scope.lastSubscription = success.data;
        });

        $scope.months = [
            {value: 1, description: '1 mese'},
            {value: 2, description: '2 mesi'},
            {value: 3, description: '3 mesi'},
        ];

        $sportService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.save = function (subscription) {
            subscription.price = subscription.sport.price * subscription.durata;
            subscription.client = $scope.client;
            $subscriptionService.save(subscription);
            $('#subscription').modal('toggle');
        };

        $scope.saveClient = function(client) {
            $clientService.save(client).then(function (success) {
                $('#certificate').modal('toggle');
                $clientService.get(client.id).then(function (success) {
                    $scope.client = success.data;
                })
            })

        }

        $scope.rinnova = function (id) {
            $scope.subscription = {};
            $scope.subscription.fromDate = new Date($scope.lastSubscription.toDate);
            $scope.subscription.durata = 1;
            $scope.changeFromDate($scope.subscription.fromDate);
            $(id).modal('toggle');
        }

        $scope.changeFromDate = function (from) {
            $scope.subscription.toDate = new Date(from);
            $scope.subscription.toDate.setMonth( from.getMonth() + $scope.subscription.durata );
        }

    }]);

/**********************************************************/

APP.service('$clientService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/clients';

    self.getAll = function() {
        return $http.get(path);
    };

    self.save = function (client) {
        return $http.post(path, client);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.delete = function (client) {
        $http.delete(path + '/' + client.id).then(function (success) {
            console.log('deleted: ', client.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);

/**********************************************************/

APP.service('$sportService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/sports';

    self.sports  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.sports = self.getAll();

    self.save = function (sport) {
        $http.post(path, sport).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    }

    self.delete = function (sport) {
        $http.delete(path + '/' + sport.name).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    }

}]);

/**********************************************************/

APP.service('$subscriptionService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/subscription';

    self.save = function (subscription) {
        return $http.post(path, subscription);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getByClientId = function (id) {
        return $http.get(path + '/client/' + id);
    };

    self.delete = function (subscription) {
        $http.delete(path + '/' + subscription.id).then(function (success) {
            console.log('deleted: ', subscription.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);

/**********************************************************/

angular.module("h14.config", [])
.constant("apiUrl", "http://localhost:8094/rocky-marciano")
.constant("enableRouteDebug", false);


/**********************************************************/

angular.module("h14.version", [])
.constant("version", "0.0.1");
