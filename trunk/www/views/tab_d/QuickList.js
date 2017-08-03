/**
 * Created by zmax
 * QuickListCtrl 我发布的悬赏的问题
 */
app.controller('QuickListCtrl', function ($scope,$stateParams,$ionicPopover,$log,$state,$location,Storage,ENV,CommonIService,$ionicHistory,QuickService,zspecService,QuickTxtService,$ionicNavBarDelegate  ) {
  $log.debug("enter QuestionList ctrl");
  //0表示我发布的抢答,1表示我要去抢答的问题
  $scope.act=$stateParams.act;
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
  /**已经被选择的map*/
  $scope.ao_selected={};
  $scope.quickTxtobj={};
  $scope.title="抢答";
  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
  }
//定义view-title
  $scope.setNavTitle = function() {
    if($scope.act==1){
      $scope.title="抢答列表";
    }else if($scope.act==0){
      $scope.title="我发布的悬赏问题列表";
    }

  }
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
    if($scope.act=="0"){
      if(memberId>0){
        $scope.page.where="memberQu="+memberId ;
      }else{
        $scope.page.where="";
      }
      $scope.page.pageNo=1;
      $scope.page.hasNextPage=false;
      $scope.list=[];
      $scope.first();

    }else{
      $scope.list=[];
      zspecService.findQuickListForAnswer().then(function(data){
        $scope.addList(data);
        Storage.set("oldQuickList",data.length);
      });
    }

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
   * 去抢答
   */
  $scope.gotoQuick=function(obj,$event){
    QuickTxtService.newget().then(function(data){
      $scope.quickTxtobj=data;
      $scope.quickTxtobj.quickId=obj.id;
      $scope.quickTxtobj.memberAn=memberId;

    })
    $scope.openPopover($event);
  }
  /**
   * saveQuick
   * @type {*|promise}
   */
  $scope.saveQuick=function(){
    QuickTxtService.create($scope.quickTxtobj,null).then(function(data){
      $scope.closePopover();
      CommonIService.alertm("提交成功！").then(function(){
        $scope.init();
      });
    });
  }
  $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  });

  // .fromTemplateUrl() 方法
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  // 清除浮动框
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // 在隐藏浮动框后执行
  $scope.$on('popover.hidden', function() {
    // 执行代码
  });
  // 移除浮动框后执行
  $scope.$on('popover.removed', function() {
    // 执行代码
  });
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
  //////////////[统一]以上是前端C统一编写

  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpcontent = true;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpquestion = false;
  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
  //赞一下
  $scope.good=function(obj){
    if(obj.ctype==1){
      return;
    }
    if(obj.ctype==0||obj.ctype==null){
      obj.goodnum=parseInt(obj.goodnum)+1;
    }else{
      obj.goodnum=parseInt(obj.goodnum)+1;
      obj.badnum=parseInt(obj.badnum)-1;
    }
    obj.ctype=1;
    QuickService.update(obj);
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
  /**
   * 收起
   * @param obj
   */
  $scope.closeAnswer=function(obj){
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
  }
  //////////////[统一]以下是前端C统一编写
  $scope.init();
  $scope.setNavTitle();
  ctrlReinitMap.remove('QuestionListCtrl');
});
app.filter('quicklistFilter',function(Storage){
  return function(list){
    var memberId=0;
    if(Storage.get(LOGINED_USER)){
      memberId=Storage.get(LOGINED_USER).id;
    }
    angular.forEach(list,function(item,key){
      var index=-1;
      if(item.memberQu===memberId){//如果memberQu等于memberId或status不为2
        index=key;//那么给索引复制为2
      }
      if(index!==-1){//在这里index是2，不满足所以进到里面除去这个元素，也就是除去memberQu==memberId的元素和status!=2的元素
        list.splice(index,1);//从index开始除去1个元素
      }
    });
    return list;
  }
});
