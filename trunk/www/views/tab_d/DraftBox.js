/**
 * Created by Administrator on 2017/4/20.
 */
//草稿箱的controler
//@author sjia
//@Date 2017年4月20日 10:05:00
app.controller('DraftBoxCtrl',function($scope,$log,Storage,QuickService,QuestionService,ArticleService,$ionicHistory,$location){
  $log.debug("enter DraftBox ctrl");
  // 悬赏视图 还是 问答视图 默认问答视图
  $scope.vm={
    isedit:false,
    tab:"ask"
  };
  //问答list
  $scope.list=[];
  //悬赏list1
  $scope.list1=[];
  //文章list1
  $scope.list2=[];
  //问答的page
  $scope.page= _.clone(_Page);
  //悬赏的page1
  $scope.page1=_.clone(_Page);
  //文章的page2
  $scope.page2=_.clone(_Page);
  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
    $log.debug(memberId);
  }
  /*
   进入前
   */
  $scope.$on('$ionicView.beforeEnter',function(){
    //ionic的生命周期
    //下面的代码会在页面即将变为活动视图时执行
    //类似于 window.onload
    $log.debug("DraftBoxCtrl  beforeEnter");
  });
  /*
   进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("DraftBoxCtrl  afterEnter");
    if (ctrlReinitMap.get('DraftBoxCtrl')) {
      ctrlReinitMap.remove('DraftBoxCtrl');
      $log.debug("DraftBox ctrl afterEnter init");
      $scope.init();
    }
  });
  //问答的初始化
  $scope.init=function(){
    $log.debug("DraftBox ctrl init ");
    //$scope.page.where="status="+status;
    $scope.page.where="memberQu="+memberId+" and "+"status=0";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first();
  };
  //悬赏的初始化
  $scope.init1=function(){
    $log.debug("DraftBox ctrl init ");
    //$scope.page.where="status="+status;
    $scope.page.where="memberQu="+memberId+" and "+"status=0";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first1();
  };
  //文章的初始化
  $scope.init1=function(){
    $log.debug("DraftBox ctrl init ");
    //$scope.page.where="status="+status;
    $scope.page2.where="memberQu="+memberId;
    $scope.page2.pageNo=1;
    $scope.page2.hasNextPage=false;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first2();
  };
  /*
   第一次问答查询
   */
  $scope.first=function(){
    QuestionService.first($scope.page).then(function (data) {
      $log.debug("DraftBox ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  /**
   * 第一次悬赏查询
   */
  $scope.first1=function(){
    QuickService.first($scope.page1).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList1(data);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  /**
   * 第一次文章查询
   */
  $scope.first2=function(){
    ArticleService.first($scope.page2).then(function (data) {
      $log.debug("BoxDraft ctrl query article then");
      $scope.addList2(data);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  /**
   * 给list（问答）上加数据
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
   * 给list1（悬赏）上加数据
   * @param data
   */
  $scope.addList1=function(data){
    angular.forEach(data, function (item) {
      $scope.list1.push(item);
    });
    if(data && data.length < $scope.page1.pageSize){
      $scope.page1.hasNextPage=false;
    }else{
      $scope.page1.hasNextPage=true;
    }
  };
  /**
   * 给list1（文章）上加数据
   * @param data
   */
  $scope.addList2=function(data){
    angular.forEach(data, function (item) {
      $scope.list2.push(item);
    });
    if(data && data.length < $scope.page2.pageSize){
      $scope.page2.hasNextPage=false;
    }else{
      $scope.page2.hasNextPage=true;
    }
  };
  /*
   ask method
   */
  $scope.ask=function(){
    $scope.vm.tab="ask";
    //"memberQu="+memberId+" and "+"status="+status
    $scope.page.where="memberQu="+memberId+"and status=0";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=true;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first();
  }
  /**
   * 问答编辑草稿
   */
  $scope.EditQuestion=function(obj){
    // $rootScope.edit=obj;
    Storage.set('edit',obj);
    $location.path('/tab/DraftEditQuestion');
  }
  /*
   问答删除草稿
   */
  $scope.DelQuestion=function(obj){
    obj.status=-1;
    QuestionService.update(obj,null).then(function(data){
      $log.debug("DraftBox ctrl delete Question end")
    })
    //刷新
    $scope.doRefresh();
  }
  /**
   * 悬赏编辑草稿
   */
  $scope.EditQuick=function(obj){
    // $rootScope.edit=obj;
    Storage.set('edit',obj);
    $location.path('/tab/DraftEditQuick');
  }
  /*
   悬赏删除草稿
   */
  $scope.DelQuick=function(obj){
    obj.status=-1;
    QuickService.update(obj,null).then(function(data){
      $log.debug("DraftBox ctrl delete Quick end")
    })
    //刷新
    $scope.doRefresh1();
  }
  /**
   * 文章编辑草稿
   */
  $scope.EditArticle=function(obj){
    // $rootScope.edit=obj;
    Storage.set('edit',obj);
    $location.path('/tab/DraftEditArticle');
  }
  /*
   article method
   */
  $scope.article=function(obj){
    $scope.vm.tab="article";
    $scope.page2.where="memberId="+memberId;
    $scope.page2.pageNo=1
    $scope.page2.hasNextPage=true;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first2();
  }
  /*
   reward method
   */
  $scope.reward=function(){
    $scope.vm.tab="reward";
    $scope.page1.where="memberQu="+memberId+"and status=0";
    $scope.page1.pageNo=1
    $scope.page1.hasNextPage=true;
    $scope.list=[];
    $scope.list1=[];
    $scope.list2=[];
    $scope.first1();
  }
  /**
   * 上拉刷新问答
   */
  $scope.doRefresh=function(){
    $scope.init();
  };
  /**
   * 上拉刷新悬赏
   */
  $scope.doRefresh1=function(){
    $scope.init1();
  };

  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
  $scope.init();
  ctrlReinitMap.remove('DraftBoxCtrl');
})
