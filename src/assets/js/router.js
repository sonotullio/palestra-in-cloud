APP.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var login = {
            name: 'login',
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'login.html'
        }

        var home = {
            name: 'home',
            url: '/home',
            controller: 'HomepageController',
            templateUrl: 'home.html'
        }

        var registration = {
            name: 'registration',
            url: '/registration',
            controller: 'RegistrationController',
            templateUrl: 'registration.html'
        }

        var clientsList = {
            name: 'clientsList',
            url: '/clients',
            controller: 'ClientsListController',
            templateUrl: 'clientsList.html'
        }

        var subscription = {
            name: 'subscription',
            url: '/subscription',
            params: {
                id: undefined,
                clientId: undefined
            },
            templateUrl: 'subscription.html',
            controller: 'SubscriptionController',
        }

        var attivita = {
            name: 'attivita',
            url: '/attivita',
            templateUrl: 'attivita.html',
            controller: 'AttivitaController',
        }

        $stateProvider.state(home);
        $stateProvider.state(login);
        $stateProvider.state(registration);
        $stateProvider.state(clientsList);
        $stateProvider.state(subscription);
        $stateProvider.state(attivita);

    }]);