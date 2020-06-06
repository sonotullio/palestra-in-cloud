var APP = angular.module('myApp', [
    'ui.router',
    'myApp.config',
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

APP.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

APP.run([function () {
    console.log('Palestra in Cloud is running!');
}]);


/**********************************************************/

APP.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

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

    var clientsList = {
        name: 'clientsList',
        url: '/clients',
        controller: 'ClientsListController',
        templateUrl: 'clientsList.html'
    }

    var client = {
        name: 'client',
        url: '/clients/:clientId',
        templateUrl: 'client.html',
        controller: 'ClientController',
        resolve: {
            clientId: ['$stateParams', function ($stateParams) {
                return $stateParams.clientId;
            }]
        },
    }

    var product = {
        name: 'products.edit',
        url: '/:productId',
        templateUrl: 'modals/productaddedit.html',
        controller: 'ProductAddEditController',
        resolve: {
            clientId: ['$stateParams', function ($stateParams) {
                return $stateParams.productId;
            }]
        },
    }

    var products = {
        name: 'products',
        url: '/products',
        templateUrl: 'products.html',
        controller: 'ProductsController',
    }

    var courses = {
        name: 'courses',
        url: '/courses',
        templateUrl: 'courses.html',
        controller: 'CoursesController',
    }

    var purchases = {
        name: 'purchases',
        url: '/purchases',
        templateUrl: 'purchases.html',
        controller: 'PurchasesController',
    }

    var statistics = {
        name: 'statistics',
        url: '/statistics',
        templateUrl: 'statistics.html',
        controller: 'StatisticsController',
    }

    $stateProvider.state(home);
    $stateProvider.state(login);
    $stateProvider.state(addAccount);
    $stateProvider.state(registration);
    $stateProvider.state(client);
    $stateProvider.state(clientsList);
    $stateProvider.state(product);
    $stateProvider.state(products);
    $stateProvider.state(courses);
    $stateProvider.state(purchases);
    $stateProvider.state(statistics);

    $urlRouterProvider.otherwise('/home');

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

APP.controller('ClientController', ['$scope', '$stateParams', '$state', 'ClientService', 'PurchaseService', 'ProductService', '$http', '$rootScope', 'EntranceService', 'apiUrl',
    function($scope, $stateParams, $state, ClientService, PurchaseService, ProductService, $http, $rootScope, EntranceService, apiUrl) {

        $scope.clientId = $stateParams.clientId;
        $scope.maxEntranceMsg = 'Limite di ingressi settimanali raggiunto.';
        $scope.activeTab = 'weekly';
        $scope.activeProductTab = 'sport';

        ClientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;

            EntranceService.getAllByClientId($scope.client.id).then(function (success) {
                $scope.entrances = EntranceService.getSplitted(success.data);

                PurchaseService.getByClientId($scope.clientId).then(function(success) {
                    $scope.purchasesCount = success.data.length;
                    $scope.purchases = PurchaseService.getSplitted(success.data);
                    $scope.lastSubscription = PurchaseService.getLastPurchase($scope.purchases['sport']);
                });

                ProductService.getAll().then(function (successCallback) {
                    $scope.products = successCallback.data;
                });
            });
            ClientService.setStatus($scope.client, $rootScope.date);
            document.getElementById("img").src = "data:image/png;base64," + $scope.client.img;
        });

        ProductService.getAll().then(function (success) {
            $scope.products = success.data;
        });

        $scope.addCertificate = function(client) {
            client.certificateExpirationDate = $scope.certificateDate.setDate($scope.certificateDate.getDate() + 1);
            ClientService.save(client).then(function (success) {
                $state.reload();
            });

        };

        $scope.addPurchase = function (purchase) {
            purchase.client = $scope.client;
            PurchaseService.save(purchase).then(function (successCallback) {
                $state.reload();
            })
        };

        $scope.addEntrance = function(client, sport) {
            EntranceService.save({date: new Date(), client: client, sport: sport}).then(function (successCallback) {
                $state.reload();
            });
        };

        $scope.deleteEntrance = function(entrance) {
            if (entrance.deleted) {
                EntranceService.delete(entrance).then(function (successCallback) {
                    $state.reload();
                });
            } else {
                EntranceService.markAsDeleted(entrance).then(function (successCallback) {
                    $state.reload();
                });
            }
        };

        $scope.isAlert = function(date) {
            return ClientService.isAlert(new Date(date), $rootScope.date);
        }

        $scope.isExpired = function(date) {
            return ClientService.isExpired(new Date(date), $rootScope.date);
        }

        $scope.uploadFile = function(files) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("image", files[0]);

            $http.post(apiUrl + '/clients' + '/image/' + $scope.clientId, fd, {
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

        $scope.selectTab = function (tab) {
            $scope.activeTab = tab;
        }

        $scope.isActiveTab = function (tab) {
            return $scope.activeTab == tab;
        }

        $scope.selectProductTab = function (tab) {
            $scope.activeProductTab = tab;
        }

        $scope.isActiveProductTab = function (tab) {
            return $scope.activeProductTab == tab;
        }

        $scope.isEntrancesLimitReached = function (subscription) {
            return subscription && subscription.product.maxEntrance <= $scope.entrances['weekly'].length;
        }

    }]);


/**********************************************************/

APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ClientService', 'ColumnService',
    function($scope, $rootScope, $stateParams, $state, $http, ClientService, ColumnService) {

        $scope.column = 'id';

        ClientService.getAll().then(function (success) {
            $scope.clients = success.data;
            $scope.clients.forEach(function (client) {
                ClientService.setStatus(client, $rootScope.date);
            })
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.updateClient = function (client) {
            $scope.edit(client);
            ClientService.save(client);
        };

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
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

APP.controller('CoursesController', ['$scope', '$stateParams', '$state', 'CoursesService', 'DownloadService', '$http', '$filter', 'apiUrl',
    function ($scope, $stateParams, $state, CoursesService, DownloadService, $http, $filter, apiUrl) {

        $scope.downloadTemplate = function() {
            CoursesService.downloadTemplate().then(function(success){
                var filename = "plan_template.xlsx";
                DownloadService.downloadExcel(success.data, filename);
            });

        }

        $scope.uploadFile = function(file) {
            var url = apiUrl + "/courses/import";
            $scope.uploadFileToUrl(file, url);
        };

        $scope.uploadFileToUrl = function(file, url) {
            var fd = new FormData();
            fd.append('file', file);
            //fd.append('date', $scope.date);

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(
                function successCallback(response) {
                    $scope.strategiesUpdated = [];

                    response.data.forEach(function (strategy) {
                        if (strategy.dateCreated !== strategy.lastUpdated) {
                            $scope.strategiesUpdated.push(strategy);
                        }
                    });

                    $scope.responseMsg =
                        'Created: ' + (response.data.length - $scope.strategiesUpdated.length) + ' Exposures' +
                        'Updated: ' + $scope.strategiesUpdated.length + ' Exposures';

                    $scope.myFile = null;
                },
                function errorCallback(response) {
                    $scope.myFile = null;
                    $scope.errorMsg = response.data.message;
                });
        };

        $scope.updateSearch = function () {
            $scope.search = $filter('date')($scope.search, 'yyyy-MM-dd');

            CoursesService.getAllByDate($scope.search).then(function (success) {
                $scope.courses = success.data;
            })

        }

    }]);


/**********************************************************/

APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state',
    function($scope, $rootScope, $stateParams, $state, ) {

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

APP.controller('ProductsController', ['$scope', '$stateParams', '$state', '$http', 'ProductService', 'PurchaseService',
    function ($scope, $stateParams, $state, $http, ProductService, PurchaseService) {

        $scope.types = [
            {value: 'sport', label: 'Abbonamento'},
            {value: 'merchandise', label: 'Merchandise'}
        ];

        $scope.durations = [
            {value: 1, label: 'Mensile', multiplier: 1},
            {value: 6, label: 'Semestrale', multiplier: 5/6},
            {value: 12, label: 'Annuale', multiplier: 9/12},
        ];

        ProductService.getAll().then(function (success) {
            $scope.products = success.data;
            $scope.products.forEach(function (product) {
                PurchaseService.getByProductId(product.id).then(function (successCallback) {
                    product.purchases = successCallback.data;
                })
            })
        });

        $scope.addProduct = function () {
            UIkit.modal('#addEditProduct').show();
        };

        $scope.addProduct = function (product) {
            console.log(product);
            $scope.editProduct = {};
            Object.assign($scope.editProduct, product);
            UIkit.modal('#addEditProduct').show();
        };

        $scope.save = function (product) {
            ProductService.save(product);
            $state.reload();
        };

        $scope.delete = function (product) {
            ProductService.delete(product);
            $state.reload();
        };

        $scope.hasPurchases = function (product) {
            return product && product.purchases && product.purchases.length > 0;
        }

    }]);

/**********************************************************/

APP.controller('PurchasesController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ColumnService', 'PurchaseService',
    function($scope, $rootScope, $stateParams, $state, $http, ColumnService, PurchaseService) {

        $scope.column = 'date';

        PurchaseService.getAll().then(function (successCallback) {
            $scope.purchases = successCallback.data;
        });

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

    }]);

/**********************************************************/

APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService', 'ClientService',
    function($scope, $stateParams, $state, $http, $filter, ProductService, ClientService) {

    $scope.save = function (client) {
        client.dateOfBirth = $filter('date')(client.dateOfBirth, 'yyyy-MM-dd');
        ClientService.save(client).then(function (success) {
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

APP.controller('StatisticsController', ['$scope', '$stateParams', '$state', 'ColumnService', 'PurchaseService', 'EntranceService', 'ChartService',
    function($scope, $stateParams, $state, ColumnService, PurchaseService, EntranceService, ChartService) {

        $scope.purchaseCtx = $('#purchases');
        $scope.purchasesChart = new Chart($scope.purchaseCtx, ChartService.default());

        $scope.entrancesCtx = $('#entrances');
        $scope.entrancesChart = new Chart($scope.entrancesCtx, ChartService.default());

        PurchaseService.getAllMappedByProduct().then(function (successCallback) {
            $scope.purchases = successCallback.data;

            $scope.purchases.forEach(function (purchase) {
                $scope.purchasesChart.data.labels.push(purchase.label)
                $scope.purchasesChart.data.datasets[0].data.push(purchase.value);
            });

            $scope.purchasesChart.update();
        });

        EntranceService.getAllMappedByProduct().then(function (successCallback) {
            $scope.entrances = successCallback.data;

            $scope.entrances.forEach(function (entrance) {
                $scope.entrancesChart.data.labels.push(entrance.label)
                $scope.entrancesChart.data.datasets[0].data.push(entrance.value);
            });

            $scope.entrancesChart.update();
        });

    }]);

/**********************************************************/

APP.service('ChartService', [function () {

    var self = this;

    self.default = function () {
        return {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    maxBarThickness: 100,
                    label: '',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        },
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                    }]
                },
                layout: {
                    padding: {
                        left: 5,
                        right: 5,
                        top: 5,
                        bottom: 5
                    }
                },
                legend: {
                    display: false,
                },
            }
        }
    }

}]);




/**********************************************************/

APP.service('ClientService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/clients';

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

}]);


/**********************************************************/

APP.service('ColumnService', [ function () {

    var self = this;

    self.sortColumn = function ($scope, col) {
        $scope.column = col;
        $scope.reverse = !$scope.reverse;
    };

}]);




/**********************************************************/

APP.service('CoursesService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/courses';

    self.courses  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.getAllByDate = function(date) {
        return $http.get(path + '?date=' + date);
    };

    self.courses = self.getAll();

    self.save = function (product) {
        $http.post(path, product).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

    self.delete = function (product) {
        $http.delete(path + '/' + product.id).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

    self.downloadTemplate = function () {
        return $http({
            url: path + "/template",
            method: "GET",
            headers: {'Content-type': 'application/json'},
            responseType: 'arraybuffer'
        })
    }

    self.import = function () {
        return $http({
            url: path + "/import",
            method: "POST",
            headers: {'Content-type': 'application/json'},
            responseType: 'arraybuffer'
        })
    }

    return self;

}]);


/**********************************************************/

APP.service('DownloadService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    self.downloadExcel = function (data, fileName) {
        var file = new Blob([data], {type: 'application/vnd.ms-excel'});
        //IE11 & Edge
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(file, fileName);
        } else {
            //In FF link must be added to DOM to be clicked
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(file);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    self.uploadFileToUrl = function (fd, url) {

        url = apiUrl + url;

        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            data: {date:new Date()}
        });

    }

    return self;

}])


/**********************************************************/

APP.service('EntranceService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/entrances';

    self.save = function (entrance) {
        return $http.post(path, entrance);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getAll = function () {
        return $http.get(path);
    };

    self.getAllMappedByProduct = function () {
        return $http.get(path + '/map');
    };

    self.getAllByClientId = function(clientId) {
        return $http.get(path + '?clientId=' + clientId);
    };

    self.markAsDeleted = function(entrance) {
        entrance.deleted = true;
        return $http.post(path, entrance);
    };

    self.delete = function (entrance) {
        return $http.delete(path + '/' + entrance.id);
    };

    self.isThisWeek = function(entrance) {
        var today = new Date();
        var firtyDayOfWeek = new Date().setDate(today.getDate() - today.getDay());

        if (new Date(entrance.date) >= firtyDayOfWeek) {
            return true;
        }

        return false;
    };

    self.getSplitted = function(entrances) {
        var retval = {
            "weekly": [], "old": [], "deleted": [],
        };

        entrances.forEach(function (entrance) {
            if (entrance.deleted) {
                retval["deleted"].push(entrance);
            } else if (self.isThisWeek(entrance)) {
                retval["weekly"].push(entrance);
            } else {
                retval["old"].push(entrance);
            }
        });

        return retval;
    };

}]);


/**********************************************************/

APP.service('ProductService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/products';

    self.products  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.products = self.getAll();

    self.save = function (product) {
        $http.post(path, product).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

    self.delete = function (product) {
        $http.delete(path + '/' + product.id).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

}]);


/**********************************************************/

APP.service('PurchaseService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/purchases';

    self.save = function (purchase) {
        return $http.post(path, purchase);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getByClientId = function (id) {
        return $http.get(path + '?clientId=' + id);
    };

    self.getByProductId = function (id) {
        return $http.get(path + '?productId=' + id);
    };

    self.getAllMappedByProduct = function () {
        return $http.get(path + '/map');
    };

    self.getAll = function () {
        return $http.get(path);
    };

    self.getSplitted = function(purchases) {
        var retval = {
            "sport": [], "merchandise": [], "other": [],
        };

        purchases.forEach(function (purchase) {
            if (purchase.product.type == "sport") {
                retval["sport"].push(purchase);
            } else if (purchase.product.type == "merchandise") {
                retval["merchandise"].push(purchase);
            } else {
                retval["other"].push(purchase);
            }
        });

        return retval;
    };

    self.getLastPurchase = function(purchases) {
        return purchases[purchases.length -1];
    }

    self.delete = function (purchase) {
        $http.delete(path + '/' + purchase.id).then(function (success) {
            console.log('deleted: ', purchase.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);


/**********************************************************/

angular.module("myApp.config", [])
.constant("apiUrl", "http://localhost:8094/palestra-in-cloud")
.constant("enableRouteDebug", false);


/**********************************************************/

angular.module("myApp.version", [])
.constant("version", "0.0.1");
