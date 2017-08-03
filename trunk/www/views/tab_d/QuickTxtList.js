/**
 * Created by zmax
 * QuickListCtrl 我发布的悬赏的问题
 */
app.controller('QuickTxtListCtrl', function ($scope,$stateParams,$log,$state,$location,Storage,ENV,CommonIService,$ionicHistory,QuickTxtService,QuickService,QuickTxtCommentService,MemberService) {
  $log.debug("enter QuestionList ctrl");
  //quickid
  var quickId=$stateParams.id;
  //priceeach 每个中奖者金额
  var priceeach=$stateParams.priceeach;
  //0表示从我发布的抢答过来的，1表示从我观看的抢答过来的，2表示在my页面中我回答的问题列表
  $scope.act=$stateParams.act;
  /**页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
  /**已经被选择的map*/
  $scope.ao_selected=new Array();
  /**是否选择过满意答案*/
  $scope.selectedAnswer=false;

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
    if($scope.act=="2"){
      $scope.page.where="memberAn="+memberId;
    }else{
      $scope.page.where="quickId="+quickId ;
    }
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
    QuickTxtService.first($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList(data);
      angular.forEach($scope.list,function(data,index,array){
        $log.debug(index);
        $log.debug(data);
        if(data.statusWin==1){
          //如果发现quickTxt集合中有元素是中奖的，说明用户选择过最佳答案了
          $scope.selectedAnswer=true;
        }
      })
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
    QuickTxtService.more($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl more then");
      $scope.addList(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  //////////////[统一]以上是前端C统一编写

  /**
   * 返回
   */
  $scope.fanhui=function(){
    $ionicHistory.goBack();
  };
  //赞一下
  $scope.good=function(obj){
    if($scope.act=="0"){
      if(obj.ctype==1){
        return;
      }
      obj.ctype=1;
      QuickTxtService.update(obj);
    }else{
      if(obj.obj1.ctype==1){
        return;
      }
      if(obj.obj1.ctype==0||obj.obj1.ctype==null){
        obj.goodnum=parseInt(obj.goodnum)+1;
      }else{
        obj.goodnum=parseInt(obj.goodnum)+1;
        obj.badnum=parseInt(obj.badnum)-1;
      }
      obj.obj1.ctype=1;
      QuickTxtService.update(obj);
      QuickTxtCommentService.update(obj.obj1);
    }
  }
  //踩一下
  $scope.bad=function(obj){
    if($scope.act=="0"){
      if(obj.ctype==-1){
        return;
      }
      obj.ctype=-1;
      QuickTxtService.update(obj);
    }else{
      if(obj.obj1.ctype==-1){
        return;
      }
      if(obj.obj1.ctype==0||obj.obj1.ctype==null){
        obj.badnum=parseInt(obj.badnum)+1;
      }else{
        obj.goodnum=parseInt(obj.goodnum)-1;
        obj.badnum=parseInt(obj.badnum)+1;
      }
      obj.obj1.ctype=-1;
      QuickTxtService.update(obj);
      QuickTxtCommentService.update(obj.obj1);
    }
  }

  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('QuestionListCtrl');
  /**
   * crz
   * @type {boolean}
   */
  $scope.Selected = false;    //默认未选中
  $scope.disable=false; //默认不失效
  var ids=new Array(); //存放选中id
  //把选中的回答id保存到数组中
  $scope.check=function(val,sel,maxNum) {
    if(sel==true) {
      ids.push(val);
    }else if(sel==false){
      angular.forEach(ids,function(data,index,array){
        if(data==val){
          ids.splice(index,1);
        }
      })
    }
    $scope.ao_selected=ids;
  }
  $scope.save=function(max) {
    if($scope.ao_selected.length==0) {
      CommonIService.alertm("至少选择一个满意的答案");
      return ;
    }
    if($scope.ao_selected.length>max) {
      CommonIService.alertm("你选的太多了，只能选"+max+"个");

      return ;
    }
    if($scope.ao_selected.length<max){
      CommonIService.alertm("你选的太少了了，得选"+max+"个");
      return ;
    }
    angular.forEach(ids,function(objid){
      //选中最佳答案更改标记为中奖
      QuickTxtService.get(objid,null).then(function(data){
        data.statusWin=1;
        var answerId=data.memberAn;
        QuickTxtService.update(data,null);
      });
      //给回答最佳答案的大师增加积分
      MemberService.get(answerId,null).then(function(data){
        data.score=data.score+priceeach;
        memberService.update(data,null);
      })
    });
    CommonIService.alertm("提交成功！").then(function(){
      $ionicHistory.goBack();
    })


  }
  //根据值 找到元素的索引
  Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) return i;
    }
    return -1;
  };
  //根据值 删除数组中的元素
  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

});
