/**
 * Created by zmax
 * questionQuAndAnCtrl 别人问我的问题，以及我回答的问题
 */
app.controller('questionQuAndAnCtrl', function ($scope,$stateParams,$log,$state,$location,$ionicPopover,Storage,ENV,CommonIService,$ionicHistory,QuestionService,QuestionTxtService,MemberService,QuestionAddService) {
  $log.debug("enter QuestionList ctrl");
  //0表示我问别人的问题，1表示别人问我的问题
  $scope.act=$stateParams.act;
  /**question页码*/
  $scope.page=_.clone(_Page);
  $scope.page.totalpage=1;
  /**questionAdd页码*/
  $scope.page1=_.clone(_Page);
  $scope.page1.totalpage=1;
  /**页面显示的列表*/
  $scope.list=[];
  /**questionAdd页面显示的列表*/
  $scope.list1=[];
  /**已经被选择的map*/
  $scope.ao_selected={};
  //定义一个答题对象
  $scope.questionTxtobj={};
  //定义一个回复对象
  $scope.questionAddobj={};

  var price=0;
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
    if($scope.act==0){
    $scope.page.where="status>=1 and memberQu="+memberId ;
    }else if($scope.act==1){
      $scope.page.where="status>=1 and memberAn="+memberId ;
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
    QuestionService.first($scope.page).then(function (data) {
      $log.debug("QuestionList ctrl query then");
      $scope.addList(data);
      Storage.set('oldQuestionList',data.length);
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

  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpcontent = false;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpquestion = true;
  /**
   * @author sjia
   * @Date 2017年4月17日 --上午9:52:44
   * 修改答案按钮，一开始为隐藏
   */
  $scope.helpquestionupdate=false;
  /**
   * 看问题 看回复
   */
  $scope.showAnswer=function(obj){
    //@author sjia start
    var user=Storage.get(LOGINED_USER);
    if(user.userobj.mtype==1)
    {
      this.helpquestionupdate=true;
    }
    //@author sjia end
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
    QuestionTxtService.get(obj.id).then(function(data){
      obj.questionTxt=data.answer;
    })
    $scope.page1.where="questionId="+obj.id;
    QuestionAddService.first($scope.page1).then(function(addData){
      $log.debug("1233333333");
      $scope.list1=addData;
      $log.debug($scope.list1);
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
      obj.goodnum=parseInt(obj.goodnum)+1;
    }else{
      obj.goodnum=parseInt(obj.goodnum)+1;
      obj.badnum=parseInt(obj.badnum)-1;
    }
    obj.ctype=1;
    QuestionService.update(obj);
  }
  //踩一下
  $scope.bad=function(obj){
    if(obj.ctype==-1){
      return;
    }
    if(obj.ctype==0||obj.ctype==null){
      obj.badnum=parseInt(obj.badnum)+1;
    }else{
      obj.goodnum=parseInt(obj.goodnum)-1;
      obj.badnum=parseInt(obj.badnum)+1;
    }
    obj.ctype=-1;
    QuestionService.update(obj);
  }
  /**
   * 收起
   * @param obj
     */
  $scope.closeAnswer=function(obj){
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
  };
  /**
   * 去抢答
   */
  $scope.answerQuestion=function(obj,$event){
    QuestionTxtService.newget().then(function(data){
      $scope.questionTxtobj=data;
      $scope.questionTxtobj.id=obj.id;

    });
    //price是缘主支付的今币 和 答主回答增加的今币
    price=obj.price;
    $scope.openPopover($event);
  }
  /**
   * 去回复
   */
  $scope.replyQuestion=function(obj,$event){
    QuestionAddService.newget().then(function(data){
      $scope.questionAddobj=data;
      $scope.questionAddobj.questionId=obj.id;
      if($scope.act==0){//青年回复
        $scope.questionAddobj.memberAn=obj.memberQu;
        $scope.questionAddobj.memberQu=obj.memberAn;
      }else if($scope.act==1){//大师回复
        $scope.questionAddobj.memberAn=obj.memberAn;
        $scope.questionAddobj.memberQu=obj.memberQu;
      }
    });
    $scope.replyPopover($event);
  }
  /**
   * 修改答案（一对一问题)
   * @author sjia
   * @Date 2017年4月11日 --下午9:45:14
   */
  $scope.updateQuestion=function(obj,$event){
    QuestionTxtService.newget().then(function(data){
      $scope.questionTxtobj=data;
      $scope.questionTxtobj.id=obj.id;
    });
    $scope.updatePopover($event);
  }
  /**
   * 去回答 且大师回答成功增加今币
   * @type {*|promise}
   */
  $scope.saveAnswer=function(){
    QuestionTxtService.create($scope.questionTxtobj,null).then(function(data){
      $scope.closePopover();
      CommonIService.alertm("提交成功！").then(function(){
        MemberService.get(memberId,null).then(function(data){
            data.score=data.score+price;
            MemberService.update(data,null);// TODO 如果出错怎么处理？
          }
        )
        $scope.init();
      });
    });
  }
  /**
   * 修改答案button
   * @author sjia
   * @type {*|promise}
     */
  $scope.updateAnswer=function(){
    QuestionTxtService.update($scope.questionTxtobj,null).then(function(data){
      $scope.closePopover();
      CommonIService.alertm("修改成功！").then(function(){
        $scope.init();
      });
    });
  }
  /**
   * 回复答案button
   * @author sjia
   * @type {*|promise}
     */
  $scope.replyAnswer=function(){
    QuestionAddService.create($scope.questionAddobj,null).then(function(data){
      $scope.closeReplyPopover();
      CommonIService.alertm("回复成功！").then(function(){
        $scope.init();
      });
    });
  }
  $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  });
  //@author sjia @Date 4-18 16:18 start
  $scope.popover_update = $ionicPopover.fromTemplateUrl('my-popover-update.html', {
    scope: $scope
  });
  $scope.popover_reply = $ionicPopover.fromTemplateUrl('my-popover-reply.html', {
    scope: $scope
  });
  //@author sjia @Date 4-18 16:18 end

  // .fromTemplateUrl() 方法
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  //@author sjia @Date 4-18 16:18 start
  $ionicPopover.fromTemplateUrl('my-popover-update.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover_update = popover;
  });
  $ionicPopover.fromTemplateUrl('my-popover-reply.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover_reply = popover;
  });
  //@author sjia @Date 4-18 16:18 end
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  //@author sjia @Date 4-18 16:18 start
  $scope.updatePopover = function($event) {
    $scope.popover_update.show($event);
  };
  $scope.replyPopover = function($event) {
    $scope.popover_reply.show($event);
  };
  //@author sjia @Date 4-18 16:18 end
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  $scope.closeReplyPopover = function() {
    $scope.popover_reply.hide();
  };
  // 清除浮动框
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // 在隐藏浮动框后执行
  $scope.$on('popover.hidden', function() {
    // 执行代码
  });
  // 移除浮动框后执行
  $scope.$on('popover.removed', function() {
    // 执行代码
  });
  //////////////[统一]以下是前端C统一编写
  $scope.init();
  ctrlReinitMap.remove('QuestionListCtrl');
});
