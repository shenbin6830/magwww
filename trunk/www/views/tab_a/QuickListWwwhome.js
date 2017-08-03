/**
 * Created by zmax
 * QuickListCtrl 我发布的悬赏的问题
 */
app.controller('QuickListWwwhomeCtrl', function ($scope,$stateParams,$ionicPopover,$log,$state,$location,Storage,ENV,CommonIService,$ionicHistory,QuickService,zspecService,QuickTxtService  ) {
  $log.debug("enter QuestionList ctrl");
  //目前act暂时没用，放着
  $scope.act=$stateParams.act;
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page1= _.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
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
    $scope.page.where="status>=2 "
    $scope.page.orderstr=" priority"
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.first();
    $scope.list=FastJson.format($scope.list);

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
    if($scope.list.length<1){
    }else{
      $scope.list=FastJson.format($scope.list);
    }
  };

  /**
   * 第一次查询
   */
  $scope.first=function(){
    QuickService.first($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };
  /**
   *
   * @param obj
   */
  $scope.orderrQuickviewPay=function(obj){
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.orderrQuickviewPay(obj.id).then(function(data){
          if (data.msg === 'wxpay') {
            $rootScope.$broadcast('event.NeedWxpayWindow', data);
          }else if(data.msg==='scorePaySuccess'){
            CommonIService.alertm("积分支付成功!");
            obj.canread=true;
          }else{
            CommonIService.alertm(data.obj);
            return;
          }
        })
      }else {

      }
    });
  }
  /**
   * 下拉加载更多查询
   */
  $scope.more=function(){
    $log.debug("QuestionList ctrl more=========");
    if(!$scope.page.hasNextPage){
      return;
    }
    QuickService.more($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl more then");
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
  //赞一下
  $scope.good=function(obj){
    var temp=parseInt(obj.goodnum);
    var temp2=parseInt(obj.badnum);
    if(obj.ctype==1){
      return;
    }
    if(obj.ctype==0||obj.ctype==null){
      temp=temp+1;
      obj.goodnum=temp;
    }else{
      temp+=1;
      temp2-=1;
      obj.goodnum=temp;
      obj.badnum=temp2;
    }
    obj.ctype=1;
    QuickTxtService.update(obj);
  }
  //踩一下
  $scope.bad=function(obj){
    if(obj.ctype==-1){
      return;
    }
    if(obj.ctype==0||obj.ctype==null){
      obj.badnum=parseInt(obj.badnum)+1;
    }else{
      obj.goodnum=parseInt(obj.goodnum)-1;
      obj.badnum=parseInt(obj.badnum)+1;
    }
    obj.ctype=-1;
    QuickService.update(obj);
  }
  //crz
  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpQuickContent = false;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpQuick = true;

  $scope.showmm=function(obj){
    this.helpQuick = this.helpQuick == false ? true: false;
    this.helpQuickContent = this.helpQuickContent == false ? true: false;
  }
  $scope.closeAnswer1=function(obj){
    this.helpQuick = this.helpQuick === false ? true: false;
    this.helpQuickContent = this.helpQuickContent === false ? true: false;
  }


  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('QuestionListCtrl');
});
app.filter('quick',function(){
  return function(obj){
    var start=obj.gmtPay;
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
