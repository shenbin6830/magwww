/**
 * Created by zmax
 * QuestionListCtrl 一对一问题编辑
 */
app.controller('QuestionEditCtrl', function ($scope,$log,$ionicHistory,$state,$stateParams,$location,Storage,ENV,QuestionService,zspecService,MemberService,CommonIService) {
  $log.debug("enter QuestionEdit ctrl");
  //////////////前端C统一的函数包括 init addList getlocal get
  //////////////自行修改的包括：

  //////////////[统一]以下是前端C统一编写
  /**参数 id为专家的id号 */
  var expertId = $stateParams.id;
  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
  }
  /**
   * 初始化
   */
  $scope.init=function(){
    $scope.get();
    MemberService.get(expertId).then(function(data){
      //viewprice 单位为今币    RMB*100/100
      $scope.obj.viewprice=data.price/100;
    });
  };
  /**
   * 获取网络对象
   */
  $scope.get=function() {
    QuestionService.newget().then(function (data) {
      $scope.obj = data;
      $scope.obj.memberQu=memberId;
      $scope.obj.memberAn=expertId;


    });
  }
  /**
   * 保存
   */
  $scope.save=function(){
    //if(!$scope.checkNumber($scope.obj.viewprice)){
    //  CommonIService.alertm("您输入的金额有误,请重新输入");
    //  return;
    //}
    if(isblank($scope.obj.title)||isblank($scope.obj.quest)){
      CommonIService.alertm('请完善问题标题及问题内容');
      return;
    }

    QuestionService.create($scope.obj).then(function (data) {
      CommonIService.confirm("去支付").then(function(res){
        if(res){
          zspecService.orderrQuestionPay(data.id).then(function(data){
            if (data.msg === 'wxpay') {
              $rootScope.$broadcast('event.NeedWxpayWindow', data);
            }else if(data.msg==='scorePaySuccess'){
              CommonIService.alertm("今币支付成功!");
              $ionicHistory.goBack();
            }else{
              CommonIService.alertm(data.obj);
              return;
            }
          })
        }else {

        }
      });
    });
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
