/**
 * Created by zmax
 * questionQuAndAnCtrl 别人问我的问题，以及我回答的问题
 */
app.controller('quAndAnWwwhomeCtrl', function ($scope,$stateParams,$log,$state,$rootScope,$location,$ionicPopover,Storage,ENV,CommonIService,$ionicHistory,QuestionService,QuestionTxtService,zspecService) {
  $log.debug("enter QuestionList ctrl");
  //0表示最新智答，1表示精选智答
  $scope.act=$stateParams.act;
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
  /**已经被选择的map*/
  $scope.ao_selected={};
  //定义一个答题对象
  $scope.questionTxtobj={};
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("QuestionList ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("QuestionList ctrl afterEnter");
    if (ctrlReinitMap.get('QuestionListCtrl')) {
      ctrlReinitMap.remove('QuestionListCtrl');
      $log.debug("QuestionList ctrl afterEnter init");
      $scope.init();
    }
  });

  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("QuestionList ctrl init ");
    if($scope.act=='0'){
      $scope.page.where="status=2"
      $scope.page.orderstr=" gmtAnswer desc"
    }else{
      $scope.page.where="status=2"
      $scope.page.orderstr=" priority"
    }
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
    QuestionService.first($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

  /**
   * 下拉加载更多查询
   */
  $scope.more=function(){
    $log.debug("QuestionList ctrl more=========");
    if(!$scope.page.hasNextPage){
      return;
    }
    QuestionService.more($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl more then");
      $scope.addList(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  /**
   *
   * @param obj
   */
  $scope.orderrQuestionviewPay=function(obj){
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.orderrQuestionviewPay(obj.id).then(function(data){
          if (data.msg === 'wxpay') {
            $rootScope.$broadcast('event.NeedWxpayWindow', data);
          }else if(data.msg==='scorePaySuccess'){
            CommonIService.alertm("今币支付成功!");
            obj.canread=true;
            $scope.doRefresh();
          }else{
            CommonIService.alertm(data.obj);
          }
        })
      }else {

      }
    });
  }
  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpcontent = false;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpquestion = true;

  $scope.showmm=function(obj){
    this.helpquestion = this.helpquestion == false ? true: false;
    this.helpcontent = this.helpcontent == false ? true: false;
  }
  $scope.closeAnswer1=function(obj){
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
  }

  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('QuestionListCtrl');
});
app.filter('shijian',function(){
  return function(obj){
    var start=obj.gmtCreate;
    //var time=new Date().getTime();
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - start;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
      result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
      result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
      result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
      result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
      result=""+ parseInt(minC) +"分钟前";
    }else
      result="刚刚";
    return result;



}
});
