/**
 * Created by Administrator on 2017/4/24.
 */
app.controller('DraftEditCtrl',function($scope,$log,Storage,QuestionService,QuickService,CommonIService,$ionicHistory,zspecService){
  $log.debug("enter DraftEdit ctrl");
  $scope.edit=Storage.get('edit');
  /*
   保存question
   */
  $scope.saveQA=function(){
    if(isblank($scope.edit.title)||isblank($scope.edit.quest)){
      CommonIService.alertm('请完善问题标题及问题内容');
      return;
    }
    QuestionService.update($scope.edit,null).then(function (data) {
      $log.debug("DraftEdit ctrl save then");
      CommonIService.confirm("去支付").then(function(res){
        if(res){
          $ionicHistory.goBack();
          zspecService.orderrQuestionPay(data.id).then(function(data){
            if (data.msg === 'wxpay') {
              $rootScope.$broadcast('event.NeedWxpayWindow', data);
            }else if(data.msg==='scorePaySuccess')
            {
              CommonIService.alertm("今币支付成功!");
            }
          })
        }else {

        }
      });
    });
  };
/*
保存quick
 */
  $scope.saveQuick=function(){
    if(!$scope.checkNumber($scope.edit.priceeach)||!$scope.checkNumber($scope.edit.pricenum)||!$scope.checkNumber($scope.edit.viewprice)){
      CommonIService.alertm("您输入的金额或者数量有误，请重新输入").then(function(){
        return;
      });
    }
    if(isblank($scope.edit.title)||isblank($scope.edit.question)){
      CommonIService.alertm('请完善问题标题及问题内容');
      return;
    }
    if($scope.edit.obj1===undefined||$scope.edit.obj2===undefined)
    {
      CommonIService.alertm('请完善开始时间和悬赏天数');
      return;
    }
    $scope.edit.viewprice=$scope.edit.priceeach*$scope.edit.pricenum*0.01;
    QuickService.create($scope.edit).then(function(data){
      CommonIService.confirm("去支付").then(function(res){
        if(res){
          $ionicHistory.goBack();
          zspecService.orderrQuickPay(data.id).then(function(data){
            if (data.msg === 'wxpay') {
              $rootScope.$broadcast('event.NeedWxpayWindow', data);
            }else if(data.msg==='scorePaySuccess')
            {
              CommonIService.alertm("今币支付成功!");
            }
          })

        }
      })
    })
  }
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
})
