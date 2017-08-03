/**
 * Created by zmax
 * QuickListCtrl 抢答编辑
 */
app.controller('ArticleCreateCtrl', function ($scope,$log,$state,$stateParams,$ionicHistory,CommonIService,$location,Storage,ENV,ArticleService,zspecService) {
  $log.debug("enter ArticleCreate ctrl");
  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
  }
  $scope.files=$scope;
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
   /* if (isblank0(id)) {
      ArticleService.newget().then(function (data) {
        $log.debug("QuickEdit ctrl newget then");
        $scope.obj = data;
        $scope.obj.memberQu=memberId;
      });
    } else {
      QuickService.get(id).then(function (data) {
        $log.debug("QuickEdit ctrl get then");
        $scope.obj = data;
      });
    }*/
    ArticleService.newget().then(function (data) {
      $log.debug("QuickEdit ctrl newget then");
      $scope.obj = data;
    });
  }
  /**
   * 保存
   */
  $scope.save=function(){
    if(isblank($scope.obj.title)||isblank($scope.obj.intro)){
      CommonIService.alertm('请完善文章标题及文章简介！');
      return;
    }
    $scope.obj.memberId=memberId;
    ArticleService.create($scope.obj).then(function(data){
      $location.path("/tab/ArticleExtTxtEdit/"+data.id);
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
  /**
   * 如果"files_img1"这个控件发生改变，则进行上传
   */
  $scope.$watch('vmfiles.files_img1', function (files) {
    $log.debug("vmfiles.files_img1 change!");
    var file;
    if(files==null)
      return;
    if (angular.isArray(files)) {
      file=files[0];
    }else{
      file=files;
    }
    $log.debug("upload...");
    $log.debug(file);
    $scope.uploadPic(file, $scope.obj,"img1");
  });
  //////////////[统一]以上是前端C统一编写

  //////////////[统一]
  $scope.init();
});
