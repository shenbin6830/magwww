/**
 * Created by zmax
 * QuickListCtrl 抢答编辑
 */
app.controller('QuickEditCtrl', function ($scope,$log,$state,$stateParams,$ionicHistory,CommonIService,$location,Storage,ENV,QuickService,zspecService) {
  $log.debug("enter QuickEdit ctrl");
  //////////////前端C统一的函数包括 init addList getlocal get
  //////////////自行修改的包括：

  //////////////[统一]以下是前端C统一编写
  /**参数 0表示新建 */
  var id = $stateParams.id;
  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
  }
  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("QuickEdit ctrl init "+id);
    $scope.get();
  };
  /**
   * 获取网络对象
   */
  $scope.get=function() {
    if (isblank0(id)) {
      QuickService.newget().then(function (data) {
        $log.debug("QuickEdit ctrl newget then");
        $scope.obj = data;
        $scope.obj.memberQu=memberId;
      });
    } else {
      QuickService.get(id).then(function (data) {
        $log.debug("QuickEdit ctrl get then");
        $scope.obj = data;
      });
    }
  }
  /**
   * 保存
   */
  $scope.save=function(){
    if(!$scope.checkNumber($scope.obj.priceeach)||!$scope.checkNumber($scope.obj.pricenum)){
      CommonIService.alertm("您输入的金额或者数量有误，请重新输入")
        return;
    }
    if($scope.obj.priceeach==0||$scope.obj.pricenum==0){
      CommonIService.alertm("悬赏金额跟数量都不能为0");
        return;
    }
   if(isblank($scope.obj.title)||isblank($scope.obj.question)){
     CommonIService.alertm('请完善问题标题及问题内容');
      return;
    }
   if($scope.obj.obj1===undefined||$scope.obj.obj2===undefined){
     CommonIService.alertm('请完善开始时间和悬赏天数');
     return;
   }
    $scope.obj.viewprice=$scope.obj.priceeach*$scope.obj.pricenum*0.01;
    //$scope.reloadRoute = function () {
    //  $window.location.reload();
    //
    //};
    QuickService.create($scope.obj).then(function(data){
      CommonIService.confirm("去支付").then(function(res){
        if(res){

          //$ionicHistory.goBack();
          //在前面积分没有扣掉，返回回去数据没有同步
          zspecService.orderrQuickPay(data.id).then(function(data){
          if (data.msg === 'wxpay') {
              $rootScope.$broadcast('event.NeedWxpayWindow', data);
            }else if(data.msg==='scorePaySuccess'){
              CommonIService.alertm("今币支付成功!");
               $ionicHistory.goBack();
            }else{
              CommonIService.alertm(data.obj);
            }
          })

        }
      })
    })
  };
  /**
   * 正整数判断
   * @param Num
   * @returns {boolean}
     */
  $scope.checkNumber=function(Num){
      var number= /^\d+$/ ;
    if(!number.test(Num)){
        return false;
    }
    return true;
  }

  //////////////[统一]以上是前端C统一编写

  //////////////[统一]
  $scope.init();
});
