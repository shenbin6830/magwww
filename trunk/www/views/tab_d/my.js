app.controller('myCtrl', function($scope, $rootScope, $log, $timeout,$q,Upload,
                                  $location,
                                  ENV,CommonIService,MemberService,Storage,$ionicHistory,zspecService,QuestionService,uploadService) {
  $log.debug("enter my ctrl");
  var me;
  $scope.obj={};
  $scope.vm={};
  //显示的版本号
  $scope.h5ver=h5ver;
  $scope.hdver=_ClientInfo.ver;
  $scope.isLogout=true;


  /**
   * 进入前
   */
  $scope.$on('$ionicView.beforeEnter', function() {
    $log.debug("my ctrl beforeEnter");
  });
  /**
   * 进入后
   */
  $scope.$on('$ionicView.afterEnter', function() {
    $log.debug("my ctrl afterEnter");
  });
  /**
   * 初始化
   */
  $scope.init=function(){
    $scope.checklogin();
  };
  /**
   * 登录检查
   */
  $scope.checklogin=function(){
    me=Storage.get(LOGINED_USER);
    if(me){
      $log.debug("mememememe="+me.id);
      id = me.id;
      $scope.isLogout=false;
      MemberService.get(me.id).then(function (data) {
        if($scope.isLogout==false){
          $scope.pubmemberSub=data;
        }else{
          $scope.pubmemberSub=null;
        }
        $scope.obj=data;
      });
    }
  };

  /**
   * 获取网络对象
   */
  $scope.get=function(){
    me=Storage.get(LOGINED_USER);
    if(!me)
      return;
    MemberService.get(me.id).then(function (data) {
      $log.debug("my ctrl get then");
      $scope.obj=data;
    });
  };
  /**
   * 保存
   */
  $scope.save=function(){
    if($scope.obj.name==""){
      CommonIService.alertm('请完善您的个人信息');
      return;
    }
    if(!checkPhoneNum($scope.obj.mobile)){
      CommonIService.alertm("手机号无效");
      return;
    }
    MemberService.update($scope.obj).then(function (data) {
      $log.debug("MemberService update then");
      $scope.obj=data;
      CommonIService.alertm("保存成功");
      $ionicHistory.goBack();
    });
  };

  /**
   * 退出
   */
  $scope.logout=function(){
    CommonIService.confirm('确认退出？').then(function(res) {if(res) {
      $scope.isLogout=true;
      $scope.pubuser=null;
      $scope.pubmemberSub=null;
      Storage.clear();
      $ionicHistory.goBack();
    } else {}});
  };
  /**
   * 清除缓存，保留USER，其它删除
   */
  $scope.clearSession=function(){
    if(window.localStorage.length!=0){
      var clientInfo=Storage.get(CLIENT_INFO);
      var user=Storage.get(LOGINED_USER);
    }
    Storage.clear();
    Storage.set(CLIENT_INFO,clientInfo);
    Storage.set(LOGINED_USER,user);
    CommonIService.alertm('清除缓存成功');
    $scope.init();
  };
  /**
   * 找回密码
   */
  $scope.editpassword=function(){
    CommonIService.alertm('请与客服联系，我们确认后分配初始密码');
  };
  /*
   *签到
   */
  $scope.memberSign=function(){
    zspecService.memberSign().then(function(data){
      CommonIService.alertm("经验+"+data.sindex*10+",积分+"+data.sindex*10);
    });
  }
  //如果需要作用域覆盖，解开下面的注释，观察的控件名改为：vmfiles.files_img1,vmfiles.files_img2...
  //$scope.vmfiles=$scope;
  /**
   * 如果"files_img1"这个控件发生改变，则进行上传
   */
  $scope.files_img1=null;
  $scope.$watch('files_img1', function (files) {
    $log.debug("files_img1 change!");
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
  /**
   * 如果"files_img2"这个控件发生改变，则进行上传
   */
  $scope.chooseImage=function(){
    wx.chooseImage({
      success: function (res) {
        images.localId = res.localIds;
        alert('已选择 ' + res.localIds.length + ' 张图片');
      }
      });
  };

  /**
   * 上传图片
   * @param files 文件们
   * @param obj 返回对象
   * @param objfield 返回对象的字段
   */
  $scope.uploadImg = function (files,obj,objfield) {
    if(!files)
      return;
    var file=files[0];
    $scope.upload1(file).then(
      function(data){
        //console.log("upload.ret=",data);
        obj[objfield]=data.msg;
      }
    );
  };
  $scope.progressPercentage=0;
  $scope.upload1= function(file) {
    var deferred = $q.defer();
    var clientInfo = Storage.get(CLIENT_INFO);
    if (!clientInfo || !clientInfo.token) {
      return deferred.promise;
    }
    Upload.upload({
      url: restbase+'/upload',
      data: {token:clientInfo.token},
      file: file
    }).progress(function (evt) {
      //进度条
      $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      $scope.progressPercentage = ($scope.progressPercentage>100)?100:$scope.progressPercentage;
      //$log.debug('progess:' + $scope.progressPercentage + '%,' + evt.config.file.name);
    }).then(function (response) {
      $timeout(function () {
        //console.log("$timeout",response);
        //$scope.result = response.data;
        if(response.data.success){
          //CommonAService.alertm('文件上传ok');
          //console.log('response.data:',response.data);
          deferred.resolve(response.data);
        }
      });
    }, function (response) {
      //出错
      deferred.reject(response.data);
      // console.log("response",response);
      // if (response.status > 0) $scope.errorMsg = response.status+ ': ' + response.data;
    }, function (evt) {
      //过程
      //$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
    });
    return deferred.promise;
  }


  $scope.files_img2=null;
  $scope.$watch('files_img2', function (files) {
    $log.debug("files_img2 change!");
    var file;
    if(files==null)
      return;
    if (angular.isArray(files)) {
      file=files[0];
    }else{
      file=files;
    }
    $log.debug("upload...");
    //$log.debug(file);
    $scope.uploadPic(file, $scope.obj,"img2");
  });
  /**
   * 上拉刷新
   */
  $scope.doRefresh=function(){
    $scope.init();
  };
  /**
   * 去抢答 新消息 提示
   * 每次进入myCtrl查询一次zspecService.findQuickListForAnswer
   * 进入quickListCtrl 将查询结果存入Stroage.set('oldList')
   * 对比两次查询的结果算出新消息数量
   */
  $scope.newQuickMeg=0;
  $scope.newQesMeg=0;
  $scope.newMessage=function(){
    //quick
    var oldQuickList=Storage.get('oldQuickList');
    var nowQuickList=0;
    zspecService.findQuickListForAnswer().then(function(data){
      if(oldQuickList==null){
        oldQuickList=data.length;
        Storage.set('oldQuickList',oldQuickList);
      }
      nowQuickList=data.length;
      $scope.newQuickMeg=0;
      $scope.newQuickMeg= $scope.addMeg(oldQuickList,data.length);
    });
    //question
    var oldQuestionList=Storage.get('oldQuestionList');
    var nowQuestionList=0;
    var memberId=0;
    if(Storage.get(LOGINED_USER)){
      memberId=Storage.get(LOGINED_USER).id;
    }
    $scope.questionPage= _.clone(_Page);;
    $scope.questionPage.where="status>=1 and memberAn="+memberId ;
    QuestionService.first($scope.questionPage).then(function (data) {
      if(oldQuestionList==null ){
        oldQuestionList=data.length;
        Storage.set('oldQuestionList',oldQuestionList);
      }
      nowQuestionList=data.length;
      $scope.newQesMeg=0;
      $scope.newQesMeg=$scope.addMeg(oldQuestionList,data.length);
    });
  }

  $scope.addMeg=function(old,now){
    return now-old;
  }

  $scope.PriceUpdate=function(obj){
    if(obj.price<1000||obj.price>10000){
      CommonIService.alertm('咨询费不合法!请重新输入');
      return;
    }
    MemberService.update(obj,null).then(function(){
      CommonIService.alertm('修改成功!');
    });
  }

  $scope.init();
  $scope.newMessage();
  ctrlReinitMap.remove('myCtrl');
});
//app.filter('exptolev',function(){
//  return function(exp){
//    var lev=0;
//    var need=100;
//    while(lev<=99){
//        if(exp>=need){
//            if(lev==99){
//              return 99;
//            }
//          lev+=1;
//          exp-=need;
//          if((lev+1)%10==1){
//            need*=2;
//          }
//        }else{
//          return lev;
//        }
//    }
//    return lev;
//  }
//});
app.filter('needlev',function(){
  return function(exp){
    var lev=0;
    var need=100;
    while(lev<=99){
      if(exp>=need){
        if(lev==99){
          return '已满级';
        }
        lev+=1;
        exp-=need;
        if((lev+1)%10==1){
          need*=2;
        }
      }else{
        return need-exp;
      }
    }
  }
});
