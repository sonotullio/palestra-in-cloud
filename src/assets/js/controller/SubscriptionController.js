APP.controller('SubscriptionController', ['$scope', '$stateParams', '$state', '$clientService', '$subscriptionService', '$sportService', '$http', '$rootScope',
    function($scope, $stateParams, $state, $clientService, $subscriptionService, $sportService, $http, $rootScope) {

        $scope.clientId = $stateParams.clientId;

        $clientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;
            $clientService.setStatus($scope.client, $rootScope.date);
            document.getElementById("img").src = "data:image/png;base64," + $scope.client.img;
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