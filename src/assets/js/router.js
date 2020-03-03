APP.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var home = {
            name: 'home',
            url: '/home',
            controller: 'HomepageController',
            templateUrl: 'home.html'
        }

        var login = {
            name: 'login',
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'login.html'
        }

        var addAccount = {
            name: 'addAccount',
            url: '/addAccount',
            controller: 'AddAccountController',
            templateUrl: 'addAccount.html'
        }

        var registration = {
            name: 'registration',
            url: '/registration',
            controller: 'RegistrationController',
            templateUrl: 'registration.html',
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

        var products = {
            name: 'products',
            url: '/products',
            templateUrl: 'products.html',
            controller: 'ProductsController',
        }

        var contabilita = {
            name: 'contabilita',
            url: '/contabilita',
            templateUrl: 'contabilita.html',
            controller: 'ContabilitaController',
        }

        $stateProvider.state(home);
        $stateProvider.state(login);
        $stateProvider.state(addAccount);
        $stateProvider.state(registration);
        $stateProvider.state(spesa);
        $stateProvider.state(clientsList);
        $stateProvider.state(subscription);
        $stateProvider.state(products);
        $stateProvider.state(contabilita);

    }]);