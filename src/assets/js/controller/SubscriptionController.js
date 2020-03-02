APP.controller('SubscriptionController', ['$scope', '$stateParams', '$state', '$clientService', '$subscriptionService', '$sportService', '$http', '$rootScope', '$entranceService',
    function($scope, $stateParams, $state, $clientService, $subscriptionService, $sportService, $http, $rootScope, $entranceService) {

        $scope.clientId = $stateParams.clientId;
        $scope.isHome = true;

        $clientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;
            $entranceService.getAllByClientId($scope.client.id).then(function (success) {
                $scope.entrances = $entranceService.getOfThisWeek(success.data);
                $subscriptionService.getByClientId($scope.clientId).then(function(success) {
                    $scope.lastSubscription = success.data;
                    if ($scope.lastSubscription.sport.maxEntrance <= $scope.entrances.length) {
                        $scope.maxEntrance = true;
                    }
                });
            });
            $clientService.setStatus($scope.client, $rootScope.date);
            document.getElementById("img").src = "data:image/png;base64," + $scope.client.img;
        });

        $scope.maxEntranceMsg = 'Limite di ingressi settimanali raggiunto.';

        $scope.months = [
            {value: 1, description: '1 mese', multiplier: 1},
            {value: 6, description: '6 mesi', multiplier: 5/6},
            {value: 12, description: '12 mesi', multiplier: 9/12},
        ];

        $sportService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.save = function (subscription) {
            $scope.computeTotalPrice(subscription);
            subscription.client = $scope.client;
            $subscriptionService.save(subscription);
            $('#subscription').modal('toggle');
        };

        $scope.computeTotalPrice = function(subscription) {
            if (subscription.sport && subscription.month) {
                subscription.price = subscription.sport.price * subscription.month.value;
                if(subscription.sport.name !== 'Boxe') {
                    subscription.price = subscription.price * subscription.month.multiplier;
                }
            }
        }

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

        $scope.confermaIngresso = function(client) {
            $http.post("http://localhost:8094/rocky-marciano" + '/entrances', {date: new Date(), client: client}).then(function (success) {
                $('#ingresso').modal('toggle');
            }, function (error) {
                console.log(error);
                $scope.error = error
            });
        }

        $scope.changeFromDate = function (from) {
            $scope.subscription.toDate = new Date(from);
            $scope.subscription.toDate.setMonth( from.getMonth() + $scope.subscription.month.value );
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

    }]);