APP.controller('CoursesPrenotationController', ['$rootScope', '$scope', '$state', '$stateParams', 'CoursesService', '$filter',
    function ($rootScope, $scope, $state, $stateParams, CoursesService, $filter) {

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

            course.clients.forEach(function (user) {
                if (user.email == $scope.user.email) {
                    console.log('prenotato: ' + course.sport + ' ' + course.startTime + ' - ' + $scope.user.email);
                    prenotato = true;
                }
            })

            return prenotato;
        }

        $scope.prenota = function (course) {
            if ($scope.user) {
                course.clients.push($scope.user);
                course.prenotation ++;

                CoursesService.save(course).then(function (success) {
                    console.log(success);
                    $scope.updateSearch();
                })
            } else {
                alert('Effettuare il login per poter prenotare.')
            }
        }

        $scope.annullaPrenotazione = function (course) {
            course.clients.forEach(function (user, index) {
                if (user.email == $scope.user.email) {
                    course.clients.splice(index, 1);
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
