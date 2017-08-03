/**
 * Created by sjia
 * MyArticleCtrl  我的文章
 */
app.controller('MyArticleCtrl',function($scope,$log,Storage,ArticleService,$location){
  $log.debug('enter MyArticle Ctrl');
  /**页码*/
  $scope.page= _.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];

  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
  }
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("MyArticle ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("MyArticle ctrl afterEnter");
    if (ctrlReinitMap.get('MyArticle')) {
      ctrlReinitMap.remove('MyArticle');
      $log.debug("MyArticle ctrl afterEnter init");
      $scope.init();
    }
  });
  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("MyArticle ctrl init ");
    $scope.page.where="memberId="+memberId;
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.first();
  };
  /**
   * 第一次查询
   */
  $scope.first=function(){
    ArticleService.first($scope.page).then(function (data) {
      $log.debug("MyArticle ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });
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
  };

  /**
   * 跳转到编辑文章页面
   */
  $scope.editArticle=function(obj){
    Storage.set('article',obj);
    $location.path('/tab/MyArticleEdit');
  }
  /**
   * 上拉刷新
   */
  $scope.doRefresh=function(){
    $scope.init();
  };

  $scope.init();
  ctrlReinitMap.remove('MyArticleCtrl');
})
