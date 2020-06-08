APP.controller('CoursesPrenotationController', ['$rootScope', '$scope', '$state', '$stateParams', 'CoursesService', '$filter', 'UserService',
    function ($rootScope, $scope, $state, $stateParams, CoursesService, $filter, UserService) {

        $scope.user = $stateParams.user;
        console.log('$scope.user: ', $scope.user);
        console.log('$stateParams: ', $stateParams);

        $scope.today = new Date();

        $scope.updateSearch = function () {
            if ($scope.user) {
                $scope.search = $filter('date')($scope.search, 'yyyy-MM-dd');

                CoursesService.getAllByDate($scope.search).then(function (success) {
                    $scope.courses = success.data;
                })
            }

        }

        $scope.search = $scope.today;
        $scope.updateSearch();

        $scope.prenotato = function(course) {
            var prenotato = false;

            course.users.forEach(function (user) {
                if (user.cf == $scope.user.cf) {
                    console.log('prenotato: ' + course.sport + ' ' + course.startTime + ' - ' + $scope.user.cf);
                    prenotato = true;
                }
            })

            return prenotato;
        }

        $scope.prenota = function (course) {
            course.users.push($scope.user);
            course.prenotation ++;

            CoursesService.save(course).then(function (success) {
                console.log(success);
                $scope.updateSearch();
            })
        }

        $scope.annullaPrenotazione = function (course) {
            course.users.forEach(function (user, index) {
                if (user.cf == $scope.user.cf) {
                    course.users.splice(index, 1);
                }
            });

            course.prenotation --;

            CoursesService.save(course).then(function (success) {
                console.log(success);
                $scope.updateSearch();
            })
        }

        $scope.courseDetails = function (course) {
            $scope.selectedCourse = course;
            console.log(course);
        }

    }]);
