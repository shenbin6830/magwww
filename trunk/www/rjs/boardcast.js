/**
 * Created by zmax on 2017/2/7.
 * 广播
 */

app.run(['$rootScope', '$window', '$location', '$log', '$state', '$stateParams','CommonService','ENV', function ($rootScope, $window, $location, $log, $state, $stateParams,CommonService,ENV) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

    var stateChangeStartOff = $rootScope.$on('$stateChangeStart', stateChangeStart);
    var stateChangeSuccessOff = $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function locationChangeStart(event) {
        $log.log('locationChangeStart');
        $log.log(arguments);
    }

    function locationChangeSuccess(event) {
        $log.log('locationChangeSuccess');
        $log.log(arguments);
    }

    function routeChangeStart(event) {
        $log.log('routeChangeStart');
        $log.log(arguments);
    }

    function routeChangeSuccess(event) {
        $log.log('routeChangeSuccess');
        $log.log(arguments);
    }

    function stateChangeStart(event) {
        $log.log('stateChangeStart');
        $log.log(arguments);

        if (arguments[3].name == 'app.tables.jqgrid' && arguments[1].name == 'app.smartAdmin.appLayouts') {
            event.preventDefault();
            $state.reload();
            return;
        }

        if (arguments[1].name == 'app.smartAdmin.appLayouts') {
            //$location.path("/tables/jqgrid");
            event.preventDefault();
            $state.go('app.tables.jqgrid');
            //$location.path("/tables/jqgrid");
            return;

            //event.preventDefault();
            //$state.go('app.tables.jqgrid');
            //$location.path("/tables/jqgrid");
        }
    }

    function stateChangeSuccess(event) {
        $log.log('stateChangeSuccess');
        $log.log(arguments);
    }

  
}]);
