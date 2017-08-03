/**
 * 路由器之全局
 */
app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // setup an abstract state for the tabs directive
        // 下菜单
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'views/test/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.ta', {
            url: '/ta',
            views: {
                'tab_a': {
                    templateUrl: 'views/test/ta.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.tb', {
            url: '/tb',
            views: {
                'tab_b': {
                    templateUrl: 'views/test/tb.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.tc', {
            url: '/tc',
            views: {
                'tab_c': {
                    templateUrl: 'views/test/tc.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.td', {
            url: '/td',
            views: {
                'tab_d': {
                    templateUrl: 'views/test/td.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.login', {
            url: '/login',
            views: {
                'tab_d': {
                    templateUrl: 'views/test/td.html',
                    controller: 'pubCtrl'
                }
            }
        })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/ta');

});
