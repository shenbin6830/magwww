/**
 * Created by zmax
 * QuestionListCtrl 一对一问题列表
 */
app.controller('questionAndQuickCtrl', function ($scope,$log,$state,$location,$stateParams,Storage,ENV,$ionicHistory,CommonIService,QuestionService,QuickService) {
    $log.debug("enter QuestionList ctrl");
    //////////////前端C统一的函数包括 init addList checkHeadAll show page* query searchquery searchquerycancel
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
  /**页面对象*/
  $scope.vm={
    tab:"ask"
  };
  /**参数*/
  var id = $stateParams.id;
  //问答的page
  $scope.page=_.clone(_Page);
  //问答的悬赏的page1
  $scope.page1=_.clone(_Page);
  //问答的list
  $scope.list=[];
  //悬赏的list1
  $scope.list1=[];
  $scope.searchData="";
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

        $scope.ask();
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
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
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
    //////////////[统一]以上是前端C统一编写
  /**点击问答*/
  $scope.ask=function(){
    $log.debug("QuestionList ctrl init ");
    $scope.page.where=" articlechannelId="+id;
    $scope.page.hasNextPage=false;
    $scope.vm.tab="ask";
    $scope.page.pageNo=1;
    $scope.list=[];
    $scope.list1=[];
    $scope.first();
  }
  /**
   * 点击悬赏
   */
  $scope.reward=function(){
    $scope.vm.tab="reward";
    $scope.page1.where=" articlechannelId="+id;
    $scope.page1.pageNo=1
    $scope.page1.hasNextPage=false;
    $scope.list=[];
    $scope.list1=[];
    $scope.first1();
  }

  /**
   * 问题搜索
   */
  $scope.searchForProduct=function(searchName) {
    if($scope.vm.tab=="ask"){
      if(isblank(searchName)){
        $scope.init();
        return;
      }else{
        $scope.page.where = "articlechannelId="+id+" and ptype=0 and title like '%" + searchName + "%'";
        $scope.page.pageNo = 1;
        $scope.page.hasNextPage = false;
        $scope.list=[];
        $scope.list1=[];
        $scope.first();
      }
    }else{
      if(isblank(searchName)){
        $scope.reward();
        return;
      }else{
        $scope.page1.where=" articlechannelId="+id+" and ptype=0 and question like '%" + searchName + "%'";
        $scope.page1.pageNo=1
        $scope.page1.hasNextPage=false;
        $scope.list=[];
        $scope.list1=[];
        $scope.first1();
      }
    }
  };
  /**
   * 清空搜索
   */
  $scope.search3=function(){
    $scope.searchData="";
    if($scope.vm.tab=="ask"){
      $scope.ask();
    }else{
      $scope.reward();
    }
  };
  /**
   * 给list上加数据
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
   * 第一次查询
   */
  $scope.first1=function(){
    QuickService.first($scope.page1).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList1(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };
  /**
   * 下拉加载更多查询
   */
  $scope.more1=function(){
    $log.debug("Quick ctrl more=========");
    if(!$scope.page1.hasNextPage){
      return;
    }
    QuickService.more($scope.page1).then(function (data) {
      $log.debug("QuestionList ctrl more then");
      $scope.addList1(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };


    //////////////[统一]以下是前端C统一编写
    $scope.init();
    ctrlReinitMap.remove('QuestionListCtrl');
});
