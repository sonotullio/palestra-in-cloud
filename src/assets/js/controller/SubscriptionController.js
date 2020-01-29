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