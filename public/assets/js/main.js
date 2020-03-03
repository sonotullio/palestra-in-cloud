var APP = angular.module('rocky-marciano', [
    'ui.router',
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

const PATH = "http://localhost:8094/rocky-marciano";

/**********************************************************/

APP.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var home = {
            name: 'home',
            url: '/home',
            controller: 'HomepageController',
            templateUrl: 'home.html'
        }

        var login = {
            name: 'login',
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'login.html'
        }

        var addAccount = {
            name: 'addAccount',
            url: '/addAccount',
            controller: 'AddAccountController',
            templateUrl: 'addAccount.html'
        }

        var registration = {
            name: 'registration',
            url: '/registration',
            controller: 'RegistrationController',
            templateUrl: 'registration.html',
        }

        var spesa = {
            name: 'spesa',
            url: '/spesa',
            controller: 'SpesaController',
            templateUrl: 'spesa.html'
        }

        var clientsList = {
            name: 'clientsList',
            url: '/clients',
            controller: 'ClientsListController',
            templateUrl: 'clientsList.html'
        }

        var subscription = {
            name: 'subscription',
            url: '/subscription/:clientId',
            templateUrl: 'subscription.html',
            controller: 'SubscriptionController',
            resolve:{
                clientId: ['$stateParams', function($stateParams){
                    return $stateParams.clientId;
                }]
            },
        }

        var products = {
            name: 'products',
            url: '/products',
            templateUrl: 'products.html',
            controller: 'ProductsController',
        }

        var contabilita = {
            name: 'contabilita',
            url: '/contabilita',
            templateUrl: 'contabilita.html',
            controller: 'ContabilitaController',
        }

        $stateProvider.state(home);
        $stateProvider.state(login);
        $stateProvider.state(addAccount);
        $stateProvider.state(registration);
        $stateProvider.state(spesa);
        $stateProvider.state(clientsList);
        $stateProvider.state(subscription);
        $stateProvider.state(products);
        $stateProvider.state(contabilita);

    }]);

/**********************************************************/

APP.controller('AddAccountController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

    $scope.sports = [
        {title: 'Boxe'},
        {title: 'Kick Boxe'},
        {title: 'Functional'},
    ]
    }]);

/**********************************************************/

APP.controller('AddEditProductController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService',
    function($scope, $stateParams, $state, $http, $filter, ProductService) {

    $scope.types = [
        {value: 'Abbonamento', label: 'Abbonamento'},
        {value: 'Merchandise', label: 'Merchandise'}
    ];

    $scope.durations = [
        {value: 1, label: 'Mensile'},
        {value: 6, label: 'Semestrale'},
        {value: 12, label: 'Annuale'},
    ];

    $scope.sports = ProductService.sports;

    $scope.save = function (product) {
        console.log(product);
        $state.go('products');
    }

    }]);

/**********************************************************/

APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$clientService', '$columnService',
    function($scope, $rootScope, $stateParams, $state, $http, $clientService, $columnService) {

        $http.get("http://localhost:8094/rocky-marciano" + '/clients').then(function (success) {
            $scope.clients = success.data;
            $scope.clients.forEach(function (client) {
                $clientService.setStatus(client, $rootScope.date);
            })
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.search = $rootScope.search;

        $scope.updateClient = function (client) {
            $scope.edit(client);
            $clientService.save(client);
        };

        $scope.sortColumn = function (col) {
            $columnService.sortColumn($scope, col);
        };

        $scope.edit = function (client) {
            client.isEditing = !client.isEditing;
            $scope.isEditingDisabled = !$scope.isEditingDisabled;
        };

        $scope.addClient = function () {
            UIkit.modal('#registration-modal').show();
        }

    }]);

/**********************************************************/

APP.controller('ContabilitaController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$columnService',
    function($scope, $rootScope, $stateParams, $state, $http, $columnService) {

        $http.get("http://localhost:8094/rocky-marciano" + '/contabilita').then(function (success) {
            $scope.cashflows = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.sortColumn = function (col) {
            $columnService.sortColumn($scope, col);
        };

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
            $state.go('client', {id:id}, {reload: true})
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);

/**********************************************************/

APP.controller('HomepageController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

        $scope.addAccount = function () {
            $state.go('addAccount');
        }


    }]);

/**********************************************************/

APP.controller('LoginController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

    console.log('Login Controller');


    }]);

/**********************************************************/

APP.controller('ProductsController', ['$scope', '$stateParams', '$state', '$http', 'ProductService',
    function($scope, $stateParams, $state, $http, ProductService) {

        ProductService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.addProduct = function () {
            UIkit.modal('#registration-modal').show();
        }

        $scope.save = function (sport) {
            ProductService.save(sport);
            $state.reload();
        }

        $scope.delete = function (sport) {
            ProductService.delete(sport);
            ProductService.getAll().then(function (success) {
                $scope.sports = success.data;
            });
        }

    }]);

/**********************************************************/

APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService',
    function($scope, $stateParams, $state, $http, $filter, ProductService) {

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

    $scope.sports = ProductService.sports;

    }]);

/**********************************************************/

APP.controller('SpesaController', ['$scope', '$stateParams','$state', '$http', '$filter',
    function($scope, $stateParams, $state, $http, $filter) {

    $scope.transaction = {};

    $scope.save = function (spesa) {
        $http.post("http://localhost:8094/rocky-marciano" + '/transactions', spesa).then(function (success) {
            $state.go('contabilita');
        }, function (error) {
            console.log('error: ', error);
        })

    }

    }]);

/**********************************************************/

APP.controller('SubscriptionController', ['$scope', '$stateParams', '$state', '$clientService', '$subscriptionService', 'ProductService', '$http', '$rootScope', '$entranceService',
    function($scope, $stateParams, $state, $clientService, $subscriptionService, ProductService, $http, $rootScope, $entranceService) {

        $scope.clientId = $stateParams.clientId;
        $scope.maxEntranceMsg = 'Limite di ingressi settimanali raggiunto.';

        $scope.months = [
            {value: 1, description: '1 mese', multiplier: 1},
            {value: 6, description: '6 mesi', multiplier: 5/6},
            {value: 12, description: '12 mesi', multiplier: 9/12},
        ];

        // carica a be
        $scope.buys = [
            {date: new Date(), description: 'Quota associazione', price: 50},
            {date: new Date(), description: 'Abbonamento trimestrale', price: 150},
            {date: new Date(), description: 'Tesseramento FPI 2020', price: 30},
        ]

        $clientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;

            $entranceService.getAllByClientId($scope.client.id).then(function (success) {
                $scope.entrances = $entranceService.getOfThisWeek(success.data);

                $subscriptionService.getByClientId($scope.clientId).then(function(success) {
                    $scope.subscriptions = success.data;
                    $scope.lastSubscription = success.data[success.data.length -1];
                    if ($scope.lastSubscription.sport.maxEntrance <= $scope.entrances.length) {
                        $scope.maxEntrance = true;
                    }
                });
            });
            $clientService.setStatus($scope.client, $rootScope.date);
            document.getElementById("img").src = "data:image/png;base64," + $scope.client.img;
        });

        ProductService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.computeTotalPrice = function(subscription) {
            if (subscription.sport && subscription.month) {
                subscription.price = subscription.sport.price * subscription.month.value;
                if(subscription.sport.name !== 'Boxe') {
                    subscription.price = subscription.price * subscription.month.multiplier;
                }
            }
        }

        $scope.addCertificate = function(client) {
            $clientService.save(client).then(function (success) {
                $state.reload();
            });

        };

        $scope.addSubscription = function (subscription) {
            $scope.computeTotalPrice(subscription);
            subscription.client = $scope.client;
            $subscriptionService.save(subscription);
            $state.reload();
        };

        $scope.addEntrance = function(client) {
            $http.post("http://localhost:8094/rocky-marciano" + '/entrances', {date: new Date(), client: client}).then(function (success) {
                $state.reload();
            }, function (error) {
                console.log(error);
                $scope.error = error
            });
        };

        $scope.changeFromDate = function (from) {
            $scope.subscription.fromDate.setDate(from.getDate() + 1);
            $scope.subscription.toDate.setMonth( $scope.subscription.fromDate.getMonth() + $scope.subscription.month.value );
            $scope.subscription.duration = $scope.subscription.month.value;
        }

        $scope.changeDate = function (date) {
            $scope.client.certificateExpirationDate.setDate(date.getDate() + 1);
        }

        $scope.isAlert = function(date) {
            return $clientService.isAlert(new Date(date), $rootScope.date);
        }

        $scope.isExpired = function(date) {
            return $clientService.isExpired(new Date(date), $rootScope.date);
        }

        $scope.uploadFile = function(files) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("image", files[0]);

            $http.post("http://localhost:8094/rocky-marciano" + '/clients' + '/image/' + $scope.clientId, fd, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            })

        };

        $scope.edit = function () {
            console.log('update');
        }

    }]);

/**********************************************************/

APP.service('ProductService', ['$http', function ($http) {

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

APP.service('$clientService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/clients';

    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    self.dateDiffInDays = function (a, b) {
        // Esclude l'ora ed il fuso orario
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return (utc1 - utc2) / _MS_PER_DAY;
    }

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

    self.setStatus = function (client, date) {
        client.age = self.calculateAge(new Date(client.dateOfBirth));

        if (client.expirationDate == undefined || client.certificateExpirationDate == undefined) {
            client.isExpired = true;
        } else {
            if (self.dateDiffInDays(new Date(client.expirationDate), date) >= 0 && self.dateDiffInDays(new Date(client.expirationDate), date) < 8 || self.dateDiffInDays(new Date(client.certificateExpirationDate), date) >= 0 && self.dateDiffInDays(new Date(client.certificateExpirationDate), date) < 8 ) {
                client.isAlert = true;
            }

            if (self.dateDiffInDays(new Date(client.expirationDate), date) < 0 || self.dateDiffInDays(new Date(client.certificateExpirationDate), date) < 0 ) {
                client.isAlert = false;
                client.isExpired = true;
            }
        }
    }

    self.isExpired = function (date, limitDate) {
        if (date == undefined) {
            return true;
        } else {
            if (self.dateDiffInDays(date, limitDate) < 0) {
                return true;
            }
            return false;
        }
    }

    self.isAlert = function (date, limitDate) {
        if (self.dateDiffInDays(date, limitDate) >= 0 && self.dateDiffInDays(date, limitDate) < 8) {
            return true;
        } else {
            return false;
        }
    }

    self.calculateAge = function (birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

}]);

/**********************************************************/

APP.service('$columnService', [ function () {

    var self = this;

    self.sortColumn = function ($scope, col) {
        $scope.column = col;
        $scope.reverse = !$scope.reverse;
    };

}]);




/**********************************************************/

APP.service('$entranceService', ['$http', function ($http) {

    var self = this;

    const path = PATH + '/entrances';

    self.getAllByClientId = function(clientId) {
        return $http.get(path + '?clientId=' + clientId);
    };

    self.getOfThisWeek = function(entrances) {
        var retval = [];

        var today = new Date();
        var firtyDayOfWeek = new Date().setDate(today.getDate() - today.getDay());
        entrances.forEach(function (entrance) {
            if (new Date(entrance.date) >= firtyDayOfWeek) {
                retval.push(entrance);
            }
        })

        return retval;
    }


    self.save = function (entrance) {
        return $http.post(path, entrance);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.delete = function (entrance) {
        $http.delete(path + '/' + entrance.id).then(function (success) {
            console.log('deleted: ', entrance.id)
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
