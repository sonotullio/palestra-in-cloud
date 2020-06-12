APP.controller('ClientCertificateController', ['$scope', '$state', 'ClientService',
    function ($scope, $state, ClientService) {

        $scope.addCertificate = function (client, date) {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            client.certificateExpirationDate = date;
            ClientService.save(client).then(function (success) {
                $state.reload();
            }, function (error) {
                alert(error.data.message);
            });

        };

    }]);
