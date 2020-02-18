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

        var spesa = {
            name: 'spesa',
            url: '/spesa',
            controller: 'SpesaController',
            templateUrl: 'spesa.html'
        }

        var clientsList = {
            name: 'clientsList',
            url: '/clients',
            controller: 'ClientsListController',
            templateUrl: 'clientsList.html'
        }

        var subscription = {
            name: 'subscription',
            url: '/subscription/:clientId',
            templateUrl: 'subscription.html',
            controller: 'SubscriptionController',
            resolve:{
                clientId: ['$stateParams', function($stateParams){
                    return $stateParams.clientId;
                }]
            },
        }

        var attivita = {
            name: 'attivita',
            url: '/attivita',
            templateUrl: 'attivita.html',
            controller: 'AttivitaController',
        }

        var contabilita = {
            name: 'contabilita',
            url: '/contabilita',
            templateUrl: 'contabilita.html',
            controller: 'ContabilitaController',
        }

        $stateProvider.state(home);
        $stateProvider.state(login);
        $stateProvider.state(registration);
        $stateProvider.state(spesa);
        $stateProvider.state(clientsList);
        $stateProvider.state(subscription);
        $stateProvider.state(attivita);
        $stateProvider.state(contabilita);

    }]);