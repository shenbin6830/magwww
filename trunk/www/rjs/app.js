// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var h5ver="1.0.0.1";

var app=angular.module('zapp', ['ionic'
    ,'ngFileUpload'
]);

/**
 * 环境变量
 */
app.constant('ENV', window.appConfig);

//启动
app
    .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        //启动时
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//    }
//    if (window.StatusBar) {
//        // org.apache.cordova.statusbar required
//      StatusBar.styleDefault();
//    }

    });
}).config(function($ionicConfigProvider){
    //if(_ClientInfo.cli == 2){
        //苹果禁止左滑动
        $ionicConfigProvider.views.swipeBackEnabled(false);
		//安卓菜单跑到顶部
		$ionicConfigProvider.platform.ios.tabs.style('standard');
		$ionicConfigProvider.platform.ios.tabs.position('bottom');
		$ionicConfigProvider.platform.android.tabs.style('standard');
		$ionicConfigProvider.platform.android.tabs.position('bottom');
		$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');
		$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
		$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
		$ionicConfigProvider.platform.ios.views.transition('ios');
		$ionicConfigProvider.platform.android.views.transition('android');

    //}
})
;
