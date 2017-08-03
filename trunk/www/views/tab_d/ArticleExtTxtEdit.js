/**
 * Created by zmax
 * ArticleExtTxtListCtrl 文章内容编辑
 */
app.controller('ArticleExtTxtEditCtrl', function ($scope,$log,$state,$stateParams,$location,Storage,ENV,ArticleExtTxtService,CommonIService) {
    $log.debug("enter ArticleExtTxtEdit ctrl");
    //////////////前端C统一的函数包括 init addList getlocal get
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
    /**参数 0表示新建 */
    var id = $stateParams.id;
    /**
     * 初始化
     */
    $scope.init=function(){
      $scope.get();
    };
    /**
     * 获取网络对象
     */
    $scope.get=function() {
      ArticleExtTxtService.get(id).then(function (data) {
        $log.debug("ArticleExtTxtEdit ctrl get then");
        $scope.obj = data;
      });
    }
    /**
     * 保存
     */
    $scope.save=function(){
      ArticleExtTxtService.update($scope.obj).then(function (data) {
        $scope.obj=data;
        CommonIService.alertm("完善成功！");
        $location.path("/tab/my");
      });
    };
    //////////////[统一]以上是前端C统一编写

    //////////////[统一]
    $scope.init();
});
