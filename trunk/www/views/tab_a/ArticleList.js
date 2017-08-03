/**
 * Created by zmax
 * ArticleListCtrl 文章列表
 */
app.controller('ArticleListCtrl', function ($scope, $log, $state, $location, Storage, ENV, CommonService, ArticleService,$ionicHistory) {
  $log.debug("enter ArticleList ctrl");
  //////////////前端C统一的函数包括 init addList checkHeadAll show page* query searchquery searchquerycancel
  //////////////自行修改的包括：

  //////////////[统一]以下是前端C统一编写
  /**页码*/
  $scope.page = _.clone(_Page);
  $scope.page.totalpage = 1;
  /**页面显示的列表*/
  $scope.list = [];
  /**已经被选择的map*/
  $scope.ao_selected = {};
  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function () {
    $log.debug("ArticleList ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function () {
    $log.debug("ArticleList ctrl afterEnter");
    if (ctrlReinitMap.get('ArticleListCtrl')) {
      ctrlReinitMap.remove('ArticleListCtrl');
      $log.debug("ArticleList ctrl afterEnter init");
      $scope.init();
    }
  });

  /**
   * 初始化
   */
  $scope.init = function () {
    $log.debug("ArticleList ctrl init ");
    $scope.page.where = Storage.get("ArticleList" + "QueryWhere");
    $scope.page.pageNo = 1;
    $scope.page.hasNextPage = false;
    $scope.list = [];
    $scope.first();
  };
  /**
   * 上拉刷新
   */
  $scope.doRefresh = function () {
    $scope.init();
  };
  /**
   * 给list上加数据
   * @param data
   */
  $scope.addList = function (data) {
    angular.forEach(data, function (item) {
      $scope.list.push(item);
    });
    if (data && data.length < $scope.page.pageSize) {
      $scope.page.hasNextPage = false;
    } else {
      $scope.page.hasNextPage = true;
    }
  };

  /**
   * 第一次查询
   */
  $scope.first = function () {
    ArticleService.first($scope.page).then(function (data) {
      $log.debug("ArticleList ctrl query then");
      $scope.addList(data);
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

  /**
   * 下拉加载更多查询
   */
  $scope.more = function () {
    $log.debug("ArticleList ctrl more=========");
    if (!$scope.page.hasNextPage) {
      return;
    }
    ArticleService.more($scope.page).then(function (data) {
      $log.debug("ArticleList ctrl more then");
      $scope.addList(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  /**
   * 返回
   */
  $scope.fanhui = function () {
    $ionicHistory.goBack();
  };
  //////////////[统一]以上是前端C统一编写


  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('ArticleListCtrl');
});
