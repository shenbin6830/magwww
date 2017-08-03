/**
 * Article，内容详细
 */
app.controller('ArticleCtrl', function($scope, $rootScope, $location, $log, Storage, ENV, CommonIService, ArticleService,$stateParams,$ionicHistory) {
    $log.debug("enter Article ctrl");
  $scope.page=_.clone(_Page);
  /**参数*/
    var id = $stateParams.id;
    /**页面对象*/
    $scope.vm={};
	/**对象*/
	$scope.obj={};

    /**
     * 进入前
     */
    $scope.$on('$ionicView.beforeEnter', function() {
        $log.debug("Article ctrl beforeEnter");
    });
    /**
     * 进入后
     */
    $scope.$on('$ionicView.afterEnter', function() {
        $log.debug("Article ctrl afterEnter");
        if (ctrlReinitMap.get('ArticleCtrl')) {
            ctrlReinitMap.remove('ArticleCtrl');
            $log.debug("Article ctrl afterEnter init");
            $scope.init();
        }
	});
    /**
     * 结束后
     */
	$scope.$on('$destroy', function() {
		$log.debug("Article ctrl destroy");
	});
    /**
     * 初始化
     */
    $scope.init=function(){
      $scope.page.where=" articlechannelId="+id;
      $scope.page.pageNo=1;
      $scope.page.hasNextPage=false;
		$scope.first();
    };
    /**
     * 获取本地对象
     */
    $scope.getlocal=function(){
        $log.debug("Article ctrl getlocal id="+id);
        if(isblank0(id)){
            $scope.obj= _.clone(_Article);
        }else{
            $scope.obj=ArticleService.getlocal(id);
        }
        $log.debug($scope.obj);
    };
    /**
     * 获取网络对象
     */
    $scope.get=function(){
		ArticleService.get(id).then(function (data) {
			$log.debug("Article ctrl get then");
			$scope.obj=data;
		});
    };
  /**
   * 第一次查询
   */
  $scope.first=function(){
    ArticleService.first($scope.page).then(function (data) {
      $log.debug("Article ctrl query then");
      $scope.obj=data[0];
      $scope.$broadcast('scroll.refreshComplete');
    });

  };
  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
    $scope.init();
    ctrlReinitMap.remove('ArticleCtrl');
});
