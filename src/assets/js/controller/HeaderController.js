APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state', 'ClientService', 'UserService',
    function($scope, $rootScope, $stateParams, $state, ClientService, UserService) {

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
            UIkit.modal('#client-registration').show();
        }

        $scope.accedi = function(email, pwd) {
            ClientService.login(email, pwd).then(function (success) {
                $scope.user = success.data;
                UserService.set($scope.user);
                $state.go('courses');
            }, function (error) {
                alert(error.data.message);
            })
        }

        $scope.esci = function() {
            $scope.user = null;
            $state.go('home');
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);
