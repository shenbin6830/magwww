/**
 * Articlechannel，内容频道列表
 */
app.controller('ArticlechannelCtrl', function($scope, $rootScope,$stateParams, $location, $log, Storage, ENV, CommonIService, ArticlechannelService,$ionicHistory) {
  $log.debug("enter Articlechannel ctrl");
  /**页码*/
  $scope.page=_.clone(_Page);
  /**页面显示的列表*/
  $scope.list=[];

  $scope.dianji=0;
  $scope.fanhuiyn=0;
  var act=$stateParams.act;
  //参数
  var parentid=$stateParams.parentid;
  if(parentid=="zydj"){
    $scope.dianji=1;
  }
  if(parentid=="zyzx"){
    $scope.fanhuiyn=1;
  }
  $scope.obj={

  };
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("Articlechannel ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("Articlechannel ctrl afterEnter");
    if (ctrlReinitMap.get('ArticlechannelCtrl')) {
      ctrlReinitMap.remove('ArticlechannelCtrl');
      $log.debug("Articlechannel ctrl afterEnter init");
      $scope.init();
    }
  });

  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("Articlechannel ctrl init ");
    $scope.page.where=" parentid=0";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.first();
    /*if(act=='0'){
      $log.debug("Articlechannel ctrl init ");
      $scope.page.where=" parentid=0";
      $scope.page.pageNo=1;
      $scope.page.hasNextPage=false;
      $scope.list=[];
      $scope.first();
    }else{
      $scope.page.where=" parentid= "+parentid ;
      $scope.page.pageNo=1;
      $scope.page.orderstr="priority asc"
      $scope.page.hasNextPage=false;
      $scope.list=[];
      $scope.first();
    }*/

  };
  /**
   * 上拉刷新
   */
  $scope.doRefresh=function(){
    $scope.init();
  };
  /**
   * 给list上加数据
   * @param data
   */
  $scope.addList=function(data){
    angular.forEach(data, function (item) {
      $scope.list.push(item);
    });
    if(data && data.length < $scope.page.pageSize){
      $scope.page.hasNextPage=false;
    }else{
      $scope.page.hasNextPage=true;
    }
  };
  /**
   * 第一次查询
   */
  $scope.first3=function(){
    ArticlechannelService.first($scope.page).then(function (data) {
      $log.debug("Articlechannel ctrl query then");
      if(data == "" || data == undefined || data == null){
        CommonIService.alertm("暂无数据！");
        return;
      }
      $scope.page.where=" parentid= "+data[0].id;
      $scope.page.pageNo=1;
      $scope.page.hasNextPage=false;
      $scope.list=[];
      $scope.first();

      $scope.$broadcast('scroll.refreshComplete');
    });

  };
  /**
   * 第一次查询
   */
  $scope.first=function(){
    ArticlechannelService.first($scope.page).then(function (data) {
      $log.debug("Articlechannel ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };


  /**
   * 下拉加载更多查询
   */
  $scope.more=function(){
    $log.debug("Articlechannel ctrl more=========");
    if(!$scope.page.hasNextPage){
      return;
    }
    ArticlechannelService.more($scope.page).then(function (data) {
      $log.debug("Articlechannel ctrl more then");
      $scope.addList(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
  $scope.init();
  ctrlReinitMap.remove('ArticlechannelCtrl');
});
