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