/**
 * Wwwhome，手机页首页配置详细
 */
app.controller('WwwhomeCtrl', function($scope, $rootScope,$location,$ionicPopup, $log,Storage,QuestionService,QuickService,CommonIService,zspecService) {
  $log.debug("enter Wwwhome ctrl");
  /**页面对象*/
  $scope.vm={
    isedit:false,
    tab:"ask"
  };
  /**对象*/
  $scope.obj={};
  /**搜索关键字*/
  $scope.searchData='';
  /**页码*/
  $scope.member_id=0;
  if(Storage.get(LOGINED_USER)!=null){
    $scope.member_id=Storage.get(LOGINED_USER).id;
  }
  //问答的page
  $scope.page=_.clone(_Page);
  //问答的悬赏的page1
  $scope.page1=_.clone(_Page);
  //问答的list
  $scope.list=[];
  //悬赏的list1
  $scope.list1=[];
  //进首页了，tab强制变A
  pubnowtab='A';
  Storage.set("TAB",pubnowtab);
  //首页对象
  $scope.wwwhome={

  }
  var token="";

  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpcontent = false;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpquestion = true;

  $scope.showmm=function(obj){
    this.helpquestion = this.helpquestion == false ? true: false;
    this.helpcontent = this.helpcontent == false ? true: false;
  }
  $scope.closeAnswer1=function(obj){
    this.helpquestion = this.helpquestion === false ? true: false;
    this.helpcontent = this.helpcontent === false ? true: false;
  }

  //crz
  /**
   * 收起按钮，一开始为隐藏
   */
  $scope.helpQuickContent = false;
  /**
   * 点击阅读按钮，一开始为显示
   */
  $scope.helpQuick = true;

  $scope.showQuick=function(obj){
    this.helpQuick = this.helpQuick == false ? true: false;
    this.helpQuickContent = this.helpQuickContent == false ? true: false;
  }
  $scope.closeQuickAnswer=function(obj){
    this.helpQuick = this.helpQuick === false ? true: false;
    this.helpQuickContent = this.helpQuickContent === false ? true: false;
  }



  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("Wwwhome ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("Wwwhome ctrl afterEnter");
    if (ctrlReinitMap.get('WwwhomeCtrl')) {
      ctrlReinitMap.remove('WwwhomeCtrl');
      $log.debug("Wwwhome ctrl afterEnter init");
      $scope.init();
    }
  });
  /**
   * 初始化
   */
  $scope.init=function(){
    if(Storage.get(CLIENT_INFO)!=null){
      token=Storage.get(CLIENT_INFO).token;
    }
    //收到window.name 不带token 需要手动加
    if(!isblank(window.name)){
      $log.debug("window.name");
      $log.debug(window.name);
      window.localStorage.setItem(CLIENT_INFO,window.name);
      window.name="";
      var client=Storage.get(CLIENT_INFO);
      client.token=token;
      Storage.set(CLIENT_INFO,client);
    }
    $scope.ask();
  };

  /**
   * 问题搜索
   */
  $scope.searchForProduct=function(searchName) {
    if($scope.vm.tab=="ask"){
      if(isblank(searchName)){
        $scope.init();
        return;
      }else{
        $scope.page.where = " ptype=0 and title like '%" + searchName + "%'";
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
        $scope.page1.where="ptype=0 and question like '%" + searchName + "%'";
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
   * 搜索2017
   */
  $scope.newSearch=function(){
    $scope.rx('#/tab/Search');
  };

  $scope.headImgJudge1=function(){
    if($scope.wwwhome.headimg1){
      return true;
    }else{
      return false;
    }
  }
  $scope.headImgJudge2=function(){
    if($scope.wwwhome.headimg2){
      return true;
    }else{
      return false;
    }
  }
  $scope.headImgJudge3=function(){
    if($scope.wwwhome.headimg3){
      return true;
    }else{
      return false;
    }
  }
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
  /**点击问答*/
  $scope.ask=function(){
    $scope.vm.tab="ask";
    $scope.page.where="ptype=0 and status=2";
    $scope.page.pageNo=1;
    $scope.page.hasNextPage=true;
    $scope.list=[];
    $scope.list1=[];
    $scope.first();
  }
  /**
   * 点击悬赏
   */
  $scope.reward=function(){
    $scope.vm.tab="reward";
    $scope.page1.where="ptype=0 and status>1";
    $scope.page1.pageNo=1
    $scope.page1.hasNextPage=true;
    $scope.list=[];
    $scope.list1=[];
    $scope.first1();
  }
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
  /**
   *
   * @param obj
     */
  $scope.orderrQuestionviewPay=function(obj){
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.orderrQuestionviewPay(obj.id).then(function(data){
          if (data.msg === 'wxpay') {
            $rootScope.$broadcast('event.NeedWxpayWindow', data);
          }else if(data.msg==='scorePaySuccess'){
            CommonIService.alertm("积分支付成功!");
            obj.canread=true;
          }
        })
      }else {

      }
    });
  }
  /**
   *
   * @param obj
   */
  $scope.orderrQuickviewPay=function(obj){
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.orderrQuickviewPay(obj.id).then(function(data){
          if (data.msg === 'wxpay') {
            $rootScope.$broadcast('event.NeedWxpayWindow', data);
          }else if(data.msg==='scorePaySuccess'){
            CommonIService.alertm("积分支付成功!");
            obj.canread=true;
          }
        })
      }else {

      }
    });
  }
  /**
   * 查看抢答。需要付钱。
   */
  $scope.readyPayForQuick=function(obj){
    CommonIService.confirm("去支付").then(function(res){
      if(res){
        zspecService.readyPayForQuick(obj.id).then(function(data){
          CommonIService.alertm("已成功，请在会员中心查看答案！");
        })
      }else {

      }
    });
  }
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
  /*
   *签到
   */
  $scope.memberSign=function(){
    zspecService.memberSign().then(function(data){
      CommonIService.alertm("经验+"+data.sindex*10+",积分+"+data.sindex*10);
    });
  }
  /*
   *去问答页面
   */
  $scope.gotoQuAndQu1=function(){
    $location.path("/tab/RC_questionAndQuick/1")
  };
  $scope.gotoQuAndQu2=function(){
    $location.path("/tab/RC_questionAndQuick/2")
  };
  $scope.gotoQuAndQu3=function(){
    $location.path("/tab/RC_questionAndQuick/3")
  };
  $scope.gotoQuAndQu4=function(){
    $location.path("/tab/RC_questionAndQuick/4")
  };
  $scope.gotoQuAndQu5=function(){
    $location.path("/tab/RC_questionAndQuick/5")
  };

  $scope.init();
  ctrlReinitMap.remove('WwwhomeCtrl');
});
