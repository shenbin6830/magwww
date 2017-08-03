/**
 * Created by zmax
 * RechargeListCtrl 充值项目列表
 */
app.controller('RechargeListCtrl', ["$scope","$log","$state","$location","Storage","ENV","CommonIService","RechargeService","zspecService","$rootScope",function ($scope,$log,$state,$location,Storage,ENV,CommonIService,RechargeService,zspecService,$rootScope) {
  $log.debug("enter RechargeList ctrl");
  //////////////前端C统一的函数包括 init addList checkHeadAll show page* query searchquery searchquerycancel
  //////////////自行修改的包括：

  //////////////[统一]以下是前端C统一编写
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];

  $scope.vm={
    rechargeId:0
  }
  /**已经被选择的map*/
  $scope.ao_selected={};
  /**选择 状态*/
  $scope.ao_Recharge_statusApplyPassRefuse=selectmap_all_statusApplyPassRefuse;
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("RechargeList ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("RechargeList ctrl afterEnter");
    if (ctrlReinitMap.get('RechargeListCtrl')) {
      ctrlReinitMap.remove('RechargeListCtrl');
      $log.debug("RechargeList ctrl afterEnter init");
      $scope.init();
    }
  });

  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("RechargeList ctrl init ");
    $scope.page.where="statusApplyPassRefuse=1";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.first();
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
    if($scope.list.length>0){
      $scope.vm.rechargeId= $scope.list[0].id;
    }
    if(data && data.length < $scope.page.pageSize){
      $scope.page.hasNextPage=false;
    }else{
      $scope.page.hasNextPage=true;
    }
  };

  /**
   * 第一次查询
   */
  $scope.first=function(){
    RechargeService.first($scope.page).then(function (data) {
      $log.debug("RechargeList ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

  /**
   * 下拉加载更多查询
   */
  $scope.more=function(){
    $log.debug("RechargeList ctrl more=========");
    if(!$scope.page.hasNextPage){
      return;
    }
    RechargeService.more($scope.page).then(function (data) {
      $log.debug("RechargeList ctrl more then");
      $scope.addList(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  //////////////[统一]以上是前端C统一编写

  $scope.orderrRechargePay=function(){
    if($scope.vm.rechargeId==0){
      CommonIService.alertm("你还未选支付的项目！");
      return;
    }
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.orderrRechargePay($scope.vm.rechargeId).then(function(data){
          if (data.msg === 'wxpay') {
            $rootScope.$broadcast('event.NeedWxpayWindow', data);
          }else {
            CommonIService.alertm("微信用户找不到！请重新进入！");
            return;
          }
        })
      }else {

      }
    });
  }

  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('RechargeListCtrl');
}]);
