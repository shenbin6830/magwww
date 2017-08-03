/**
 * Member，会员详细
 */
app.controller('expertCtrl', function($scope, $rootScope, $log, $timeout,
                                          $location, $state,
                                          $stateParams,Storage,
                                          ENV,CommonIService,MemberService) {
  $log.debug("enter Member ctrl");
  /**参数*/
  var id = $stateParams.id;
  /**页面对象*/
  $scope.vm={};
  $scope.vm.isedit=false;
  if(id==='0')
    $scope.vm.isedit=true;
  /**对象*/
  $scope.obj={};
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("Member ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("Member ctrl afterEnter");
    if (ctrlReinitMap.get('MemberCtrl')) {
      ctrlReinitMap.remove('MemberCtrl');
      $log.debug("Member ctrl afterEnter init");
      $scope.init();
    }
  });
  /**
   * 结束后
   */
  $scope.$on('$destroy', function() {
    $log.debug("Member ctrl destroy");
  });
  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("Member ctrl init id="+id);
    $scope.get();
  };
  /**
   * 获取本地对象
   */
  $scope.getlocal=function(){
    $log.debug("Member ctrl getlocal id="+id);
    if(isblank0(id)){
      $scope.obj= _.clone(_Member);
    }else{
      $scope.obj=MemberService.getlocal(id);
    }
    $log.debug($scope.obj);
  };
  /**
   * 获取网络对象
   */
  $scope.get=function(){
    $log.debug("Member ctrl get id="+id);
    if(isblank0(id)) {
      MemberService.newget().then(function (data) {
        $log.debug("Member ctrl newget then");
        $scope.obj=data;
      });
    }else{
      MemberService.get(id).then(function (data) {
        $log.debug("Member ctrl get then");
        $scope.obj=data;
      });
    }
  };
  /**
   * 保存
   */
  $scope.save=function(){
    $log.debug("Member ctrl get id="+id);
    $log.debug($scope.obj)
    if(isblank0(id)) {
      MemberService.create($scope.obj).then(function (data) {
        $log.debug("Member ctrl save then");
        $scope.obj=data;
        $location.path("/tab/Member/"+$scope.obj.id);
      });
    }else{
      MemberService.update($scope.obj).then(function (data) {
        $log.debug("Member ctrl update then");
        $scope.obj=data;
        $location.path("/tab/Member/"+$scope.obj.id);
      });
    }
  };
  /**
   * 向专家问问题
   */
  $scope.gotoQuestion=function(obj){
    var me=Storage.get(LOGINED_USER);
    if(me){
      MemberService.get(me.id).then(function (data) {
        $scope.member=data;
        if(obj.price>data.score){
          CommonIService.alertm("余额不足，请先充值！");
          return;
        }else{
          $location.path("/tab/QuestionEdit/"+id);
        }
      });
    }else{
      $rootScope.$broadcast('event.NeedLoginException', 'serv');
    }

  }
  /**
   * 点击了叉叉，如果是id=0，返回上一页
   */
  $scope.clickx=function(){
    if(id==='0')
      goBack();
  };
  $scope.init();
  ctrlReinitMap.remove('MemberCtrl');
});
