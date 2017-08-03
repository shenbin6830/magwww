/**
 * Created by Administrator on 2017-5-11.
 */
app.controller('MyArticleEditCtrl',function($scope,$log,Storage,$location,ArticleService,ArticleExtTxtService){
  $log.debug("enter MyArticleEdit Ctrl")
  $scope.obj=Storage.get('article');
  /**
   * 修改文章
   */
  $scope.update=function(){
    if(isblank($scope.obj.title)||isblank($scope.obj.intro)){
      CommonIService.alertm('请完善文章标题及文章简介！');
      return;
    }
    ArticleService.update($scope.obj).then(function(data){
      $location.path("/tab/MyArticleExtTxtEdit/"+data.id);
    });
  }
})
