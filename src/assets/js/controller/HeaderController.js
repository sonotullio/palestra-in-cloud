APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state', 'ClientService',
    function($scope, $rootScope, $stateParams, $state, ClientService) {

        $scope.click = function (section) {
            $scope.active = section;
        }

        $scope.isActive = function (section) {
            return $scope.active == section;
        }

        $scope.openClientCard = function (id) {
            $state.go('client', {id:id}, {reload: true})
        }

        $scope.addClient = function () {
            UIkit.modal('#registration-modal').show();
        }

        $scope.accedi = function(email, pwd) {
            ClientService.login(email, pwd).then(function (success) {
                $rootScope.user = success.data;
                $scope.user = $rootScope.user;
                $state.go('coursesPrenotation', {user: success.data});
            }, function (error) {
                alert(error.data.message);
            })
        }

        $scope.esci = function() {
            $rootScope.user = null;
            $scope.user = null;
            $state.go('home');
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);
