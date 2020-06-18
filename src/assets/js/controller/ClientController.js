APP.controller('ClientController', ['$scope', '$stateParams', '$state', 'ClientService', 'PurchaseService', 'ProductService', '$http', '$rootScope', 'EntranceService', 'apiUrl',
    function($scope, $stateParams, $state, ClientService, PurchaseService, ProductService, $http, $rootScope, EntranceService, apiUrl) {

        $scope.clientId = $stateParams.clientId;
        $scope.maxEntranceMsg = 'Limite di ingressi settimanali raggiunto.';
        $scope.activeTab = 'weekly';
        $scope.activeProductTab = 'sport';
        $scope.today = new Date();

        ClientService.get($scope.clientId).then(function (success) {
            $scope.client = success.data;
            $scope.client.dateOfBirth = new Date($scope.client.dateOfBirth);

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

        $scope.addPurchase = function (purchase) {
            purchase.client = $scope.client;
            PurchaseService.save(purchase).then(function (successCallback) {
                $state.reload();
            }, function (error) {
                alert(error.data.message);
            })
        };

        $scope.openEntrance = function(client) {
            if ($scope.puoEntrare(client.lastSubscription, client.expirationDate)) {
                UIkit.modal('#ingresso').show();
            } else {
                alert('Il cliente non è abilitato ad entrare. Limite di ingressi raggiunto o abbonamento scaduto!')
            }
        }

        $scope.openDeletePurchase = function(purchase) {
            $scope.toBeDeleted = purchase;
            UIkit.modal('#purchase-delete').show();
        }

        $scope.deletePurchase = function(purchase) {
            PurchaseService.delete(purchase).then(function (success) {
                $state.reload();
            }, function (error) {
                alert(error.data.message);
            })
        }

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
            return ClientService.isExpired(new Date(date), $scope.today);
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
            UIkit.modal('#client-registration').show();
        }

        $scope.delete = function () {
            UIkit.modal('#client-delete').show();
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

        $scope.puoEntrare = function(subscription, expirationDate) {
            return !$scope.isEntrancesLimitReached(subscription) && !$scope.isExpired(expirationDate);
        }

    }]);
