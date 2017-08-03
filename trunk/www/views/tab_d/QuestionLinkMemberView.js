/**
 * Created by zmax
 * questionQuAndAnCtrl 别人问我的问题，以及我回答的问题
 */
app.controller('QuestionLinkMemberViewCtrl', function ($scope,$stateParams,$log,$state,$location,Storage,ENV,CommonIService,$ionicHistory,QuestionService,QuestionTxtService,QuestionLinkMemberViewService) {
  $log.debug("enter QuestionList ctrl");
  //0表示从my页面过来的
  $scope.act=$stateParams.act;
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
  /**已经被选择的map*/
  $scope.ao_selected={};

  var memberId=0;
  if(Storage.get(LOGINED_USER)){
    memberId=Storage.get(LOGINED_USER).id;
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
    $scope.page.where="memberVi="+memberId ;
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=false;
    $scope.list=[];
    $scope.first();
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
   * 第一次查询
   */
  $scope.first=function(){
    QuestionLinkMemberViewService.first($scope.page).then(function (data) {
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
    QuestionLinkMemberViewService.more($scope.page).then(function (data) {
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
   * 看问题
   */
  $scope.showAnswer=function(obj){
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
    QuestionTxtService.get(obj.questionIdQuestionObj.id).then(function(data){
      obj.questionTxt=data.answer;
    })
  }
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
      obj.questionIdQuestionObj.goodnum=parseInt(obj.questionIdQuestionObj.goodnum)+1;
    }else{
      obj.questionIdQuestionObj.goodnum=parseInt(obj.questionIdQuestionObj.goodnum)+1;
      obj.questionIdQuestionObj.badnum=parseInt(obj.questionIdQuestionObj.badnum)-1;
    }
    obj.ctype=1;
    QuestionLinkMemberViewService.update(obj);
    QuestionService.update(obj.questionIdQuestionObj);
  }
  //踩一下
  $scope.bad=function(obj){
    if(obj.ctype==-1){
      return;
    }
    if(obj.ctype==0||obj.ctype==null){
      obj.questionIdQuestionObj.badnum=parseInt(obj.questionIdQuestionObj.badnum)+1;
    }else{
      obj.questionIdQuestionObj.goodnum=parseInt(obj.questionIdQuestionObj.goodnum)-1;
      obj.questionIdQuestionObj.badnum=parseInt(obj.questionIdQuestionObj.badnum)+1;
    }
    obj.ctype=-1;
    QuestionLinkMemberViewService.update(obj);
    QuestionService.update(obj.questionIdQuestionObj);
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
  ctrlReinitMap.remove('QuestionListCtrl');
});
