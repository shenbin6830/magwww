/**
 * Created by Administrator on 2017-5-11.
 */
app.controller('MyArticleExtTxtEditCtrl',function($scope,$log,$stateParams,ArticleExtTxtService,CommonIService,$location){
  $log.debug("enter MyArticleExtTxtEdit Ctrl");
  var id = $stateParams.id;
  /**页码*/
  $scope.page= _.clone(_Page);
  $scope.page.totalpage=1;

  $scope.obj={};
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("MyArticleExtTxtEdit ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("MyArticleExtTxtEdit ctrl afterEnter");
    if (ctrlReinitMap.get('MyArticleExtTxtEditCtrl')) {
      ctrlReinitMap.remove('MyArticleExtTxtEditCtrl');
      $log.debug("MyArticleExtTxtEdit ctrl afterEnter init");
      $scope.init();
    }
  });
  /**
   * 初始化
   */
  $scope.init=function(){
    $log.debug("MyArticleExtTxtEdit ctrl init ");
    $scope.page.where="id="+id;
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.first();
  };
  /**
   * 第一次查询
   */
  $scope.first=function() {
    ArticleExtTxtService.first($scope.page).then(function (data) {
      $log.debug("MyArticleExtTxtEdit ctrl query then");
      $scope.obj = data[0];
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  /**
   * 修改文章内容
   */
  $scope.update=function(){
    ArticleExtTxtService.update($scope.obj,$scope.page).then(function(data){
      $log.debug("MyArticleExtTxtEdit ctrl update then");
      if(data){
        CommonIService.alertm("修改成功");
        $location.path("/tab/my");
      }
    })
  }
  $scope.init();
})
