app
    .controller('pubCtrl', function($scope, $rootScope, $log, $timeout,
                                    $ionicTabsDelegate, $ionicPopover, $ionicModal, $ionicLoading,
                                    $location, $state,$ionicHistory,
                                    CommonIService,Storage,RegService,zspecService,
                                    ENV,WxService,uploadService) {
        $log.debug("enter tab ctrl");
        //// 以下是全局变量
        //本地登录用户
        $scope.pubmember={};
        $scope.pubuser={};
        //// 以上是全局变量
        $scope.countdown=0;
        $scope.vm={};
        $scope.loginCli=_ClientInfo.cli;
        /**
         * 进入前
         */
        $scope.$on('$ionicView.beforeEnter', function() {
            $log.debug("tab ctrl beforeEnter");
        });

        /**
         * 进入后
         */
        $scope.$on('$ionicView.afterEnter', function() {
            $log.debug("tab ctrl afterEnter");
            if (ctrlReinitMap.get('tabCtrl')) {
                ctrlReinitMap.remove('tabCtrl');
                $log.debug("tab ctrl afterEnter init");
                $scope.init();
            }
        });
        /**
         * 通知：需要登录，弹出登录窗口
         * @param event
         * @param data 从哪里过来的 'serv':ajax注入返回的
         */
        $scope.$on('event.NeedLoginException', function(event,data) {
            //如果是微信版，同时本地无openid，去外面转一圈取openid回来
          if(wxNoOpenid()) {
            window.location.href=outGetOpenidUrl;
            return;
          }
            $log.debug("收到通知：event.NeedLoginException,data="+data);
            if(data==="reg"){
                $scope.user=Storage.get(REG_USER);
                $scope.user.password='';
                $scope.user.rememberpwd=true;
                $scope.user.autologin=true;
            }else{
                $scope.user=Storage.get(LOGINED_USER);
                if ($scope.user == null || $scope.user === "")
                    $scope.user = {};
            }
            $log.debug("ggggggggggggggggg");
            $scope.openPopLogin();
        });
        /**
         * 微信支付点击关闭按钮
         * @param msg
         */
        $scope.closePop = function(msg) {
            if (msg == 'wx') {
                $scope.popWxpay.hide()
            } else if (msg == 'alipay') {
                $scope.popApay.hide();
            }
            $rootScope.$broadcast('event.ClosePayEmpty', $scope.closePayRedirect);
        };
        /**
         * [多客户端版本]
         * 通知：需要微信支付，弹出微信支付窗口
         * @param event
         * @param data 是Json对象json.data=["WaJsapiPaymentParam", waJsapiPaymentParam]
         */
        $scope.$on('event.NeedWxpayWindow', function(event,data) {
            $log.debug("收到通知：event.NeedWxpayWindow,data="+JSON.stringify(data));
            $location.path("/tab/PayEmpty");
            $scope.openPopWxpay();
            $scope.closePayRedirect = '/tab/OrderrList';
            if (data.closePayRedirect != null) {
                $scope.closePayRedirect = data.closePayRedirect;
            }
            if(_ClientInfo.cli==3) {
                var waJsapiPaymentParam=data.obj["WaJsapiPaymentParam"];
                console.log("by cashticketMember");
                WxService.config().then(function (data) {
                    console.log("WxService config then ");
                    WxService.pay(waJsapiPaymentParam).then(function(res){
                    });
                });
            }
            if(_ClientInfo.cli===1) {
                var waAppapiPaymentParam=data.obj["WaAppapiPaymentParam"];
                wxpay.pay(waAppapiPaymentParam, function(){
                }, function(){
                });

            }
            if(_ClientInfo.cli===2) {
                var waAppapiPaymentParam=data.obj["WaAppapiPaymentParam"];
                WeChat.payment(waAppapiPaymentParam,function() {
                }, function() {
                });
            }
            if(_ClientInfo.cli==null || _ClientInfo.cli===3) {

            }

        });
        ///////////通知
        /**
         * 通知：需要支付宝支付，弹出支付宝支付窗口
         * @param event
         * @param data 是Json对象json.data=["orderinfo", orderinfo]
         */
        $scope.$on('event.NeedAlipayWindow', function(event,data) {
            $log.debug("收到通知：event.NeedAlipayWindow,data="+JSON.stringify(data));
            if(_ClientInfo.cli===0) {

            }
            if(_ClientInfo.cli===1) {
                // android
                // 支付宝支付
            }
            if(_ClientInfo.cli===2) {
                // iOS
            }
            if(_ClientInfo.cli===3) {

            }
        });

        /**
         * 弹个警告框
         * @param event
         * @param data 消息内容
         */
        $scope.$on('event.alertm', function(event,data) {
            $log.debug("收到通知：event.alertm,data="+data);
            CommonIService.alertm(data).then(function (res) {});
        });
        /**
         * 弹个警告框
         * @param event
         * @param data 消息内容
         */
        $scope.$on('event.alertError', function(event,data) {
            CommonIService.alertm(data).then(function (res) {});
        });
        /**
         * 通知:更新购物车数量
         */
        $scope.$on('refereshCartNum', function(event,data) {
            $scope.initCartNum();
        });

        /**
         * 初始化
         */
        $scope.init=function(){
            $log.debug("tab ctrl init");
        };
        /**
         * 点击TAB做的事，覆盖了href
         * @param nowtab
         */
        $scope.nowtabs=function(nowtab){
            pubnowtab=nowtab;
            Storage.set("TAB",pubnowtab);
            if('B'===nowtab){
                $scope.rx('#/tab/expertList');
            }else if('C'===nowtab){
                $scope.jumpPage('Articlechannel');
            }else if('D'===nowtab){
                $scope.jumpPage('my');
            }else{
                $scope.jumpPage('Wwwhome');
            }
        };
        /**
         * 返回屏幕一半高度
         * @returns {number}
         */
        $scope.getHalfHeight=function(){
            return 300;
        }
        /**
         *  保留2位小数
         * @param a
         * @returns {string}
         */
        $scope.twodecimal=function(a){
            return a.toFixed(2);
        }
        /**
         * 根据当前tab自动放置页面
         * ex. ng-click="rx('#/tab/Product/'+obj1.productId)"
         * @param src
         */
        $scope.rx=function(src){
            src="R"+pubnowtab+"_"+src.substring(6);
            $scope.jumpPage(src);
        }
        /**
         * 跳转
         * @param uri
         */
        $scope.jumpPage=function(uri) {
            $location.path("/tab/"+uri);
        };
        /**
         * 把xxxController放到ctrlReinitMap中，这样他们未来回到页面时，会重刷数据
         * @param key
         */
        $scope.ctrlMapPut = function(key) {
            ctrlReinitMap.put(key,1);
        };
        /**
         * 后退
         */
        $scope.goBack = function() {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            }
        }
        /**
         * 打印日志
         * @param msg
         * @param obj
         */
        $scope.debug = function(msg,obj) {
            if(!isDebug)
                return;
            $log.debug(msg);
            $log.debug(obj);
        }
        $scope.loginTab="password";
        ///////////登录html
        /**
         * login页中的登录方式切换
         * @param tab string
         */
        $scope.loginTabChange = function(tab) {
            //console.log(tab);
            $scope.loginTab = tab;
        };
        /**
         * 请求验证码
         */
        $scope.requestCode = function(user) {
            $log.debug("请求验证码");
            $log.debug(user);
            if(!checkPhoneNum(user.username)){
                CommonIService.alertm("手机号无效");
                return;
            }
            zspecService.requestCode(user.username).then(function() {
                CommonIService.alertm("验证码已发送");
                $scope.count(60);
            });
        };
        /**
         * 倒计时
         */
        $scope.count = function(n) {
            $scope.countdown = n;
            if (n != 0) {
                $timeout(function() {
                    $scope.count(n - 1);
                }, 1000);
            }
        };
        /**
         * 短信验证登陆 之用户版
         */
        $scope.dologinbysms = function(user) {
            //如果是微信版，同时本地无openid，去外面转一圈取openid回来
            if(user.password.length<6){
                CommonIService.alertm('您输入的密码有误');
                return;
            }
            user.roleId=5;
            $log.debug("短信验证登陆");
            zspecService.dologinbysms(user).then(function (data) {
                $scope.popLogin.hide();
                //密码复原
                var oldUser= _.clone($scope.user);
                $scope.user=data;
                $scope.user.passwordmd5=$scope.user.password;
                Storage.set(LOGINED_USER,$scope.user);
                //token以clientInfo为准，因此从user中复制过去
                var clientInfo=Storage.get(CLIENT_INFO);
                if(!clientInfo){
                    clientInfo=_.clone(_ClientInfo);
                }
                clientInfo.token=$scope.user.token;
                Storage.set(CLIENT_INFO,clientInfo);
                $scope.checklogin();

                //如果是安卓或苹果，上传CID
                if (_ClientInfo.cli == 1 || _ClientInfo.cli == 2) {
                    //获取cid并且上传
                    getui.init(function(cid) {
                        Storage.set(GETUICID, cid);
                        zspecService.putCid(cid);
                    });
                }else{
                    console.log("非app不上传cid");
                }

                $location.path("/tab/Editmember");
                //$ionicHistory.goBack();
                $rootScope.$broadcast('event.logined'); //通知其它人登录成功
            });
        }
      /**
       *  保留2位小数
       * @param a
       * @returns {string}
       */
      $scope.twodecimal=function(a){
        if(isblank(a)){
          return 0;
        }
        return a.toFixed(2);
      }

        /**
         * 执行登录
         */
        $scope.dologin=function(user){
            //如果是微信版，同时本地无openid，去外面转一圈取openid回来
            $log.debug("登陆:"+user);
            $scope.user=user;
            user.roleId=5;
            user.isauto=0;
            console.log(user);
            RegService.dologin(user).then(function (data) {
                $scope.popLogin.hide();
                //密码复原
                var oldUser= _.clone($scope.user);
                if(!data || !data.password){
                    CommonIService.alertm('账密错误，登录失败，请重试');
                    return;
                }
                //以下为登录成功
                $scope.user=data;
                $scope.user.passwordmd5=$scope.user.password;
                $scope.user.password=oldUser.password;

                Storage.set(LOGINED_USER,$scope.user);
                //token以clientInfo为准，因此从user中复制过去
                var clientInfo=Storage.get(CLIENT_INFO);
                if(!clientInfo){
                    clientInfo=_.clone(_ClientInfo);
                }
                clientInfo.token=$scope.user.token;
                Storage.set(CLIENT_INFO,clientInfo);

                $scope.checklogin();
                //如果是安卓或苹果，上传CID
                if (_ClientInfo.cli == 1 || _ClientInfo.cli == 2) {
                    //获取cid并且上传
                    getui.init(function(cid) {
                        Storage.set(GETUICID, cid);
                        zspecService.putCid(cid);
                    });
                }
                $ionicHistory.goBack();
                $rootScope.$broadcast('event.logined'); //通知其它人登录成功
            });
        }

        /**
         * 打开登录窗口
         */
        $scope.login=function(){
            $rootScope.$broadcast('event.NeedLoginException','member');
        };

        /**
         * 收到登录成功的通知
         */
        $scope.$on('event.logined', function(event,data) {
            $log.debug("收到通知：event.logined,data="+data);
            $scope.checklogin();
        });
        /**
         * 登录检查，就是把用户从硬盘里变成内存对象，并取出member
         */
        $scope.checklogin=function(){
            $scope.pubuser=Storage.get(LOGINED_USER);
            if($scope.pubuser){
                $scope.debug("$scope.pubuser=",$scope.pubuser);
                $scope.pubmember=$scope.pubuser.userobj;
            }else{
                $scope.pubmember={};
            }
            if(!$scope.pubmember){
                $scope.pubmember={};
            }
            $scope.debug("$scope.pubmember=",$scope.pubmember);
        };


        ///////////////////////////以下是弹窗系列

        /**弹出窗_登录*/
        $scope.popLogin={};
        /**
         * 设定弹出窗口_登录
         */
        $ionicPopover.fromTemplateUrl('views/pub/login.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popLogin = popover;
        });
        /**打开窗口_登录*/
        $scope.openPopLogin = function(e) {
            $scope.popLogin.show(e);
        };
        /**关闭窗口_登录*/
        $scope.closePopLogin = function(e) {
            $log.debug("closePopLogin");
            $scope.popLogin.hide();
            //$ionicHistory.goBack();
        };
        /**弹出窗_微信支付*/
        $scope.popWxpay={};
        /**
         * 设定弹出窗口_微信支付
         */
        $ionicPopover.fromTemplateUrl('views/pub/wxpay.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popWxpay = popover;
        });
        /**打开窗口_微信支付*/
        $scope.openPopWxpay = function(e) {
            $scope.popWxpay.show(e);
        };

        /**弹出窗_支付宝支付*/
        $scope.popApay={};
        /**
         * 设定弹出窗口_微信支付
         */
        $ionicPopover.fromTemplateUrl('views/pub/apay.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popApay = popover;
        });
        /**打开窗口_微信支付*/
        $scope.openPopApay = function(e) {
            $scope.popApay.show(e);
        };
        /////////////////////////以上是弹窗系列

        /**
         * 上传图一个，返回的图地址放在obj[objfield]中，
         * @param files
         * @param obj
         * @param objfield
         */
        $rootScope.upload1 = function (files,obj,objfield) {
            console.log("upload.objfield=",objfield);
            if(!files)
                return;
            var file=files[0];
            uploadService.upload(file).then(
                function(data){
                    console.log("upload.ret=",data);
                    obj[objfield]=data.msg;
                }
            );
        };


      /**
       * 微信版本本地无openid，
       * @returns {boolean} true(需要去腾讯取下openid了),false
       */
      function wxNoOpenid(){
        //如果是微信版，openid没有，去转一圈，取个openid
        if(_ClientInfo.cli===3){
          var str=window.localStorage.getItem(CLIENT_INFO);
          console.log("str="+str);
          if(isblank(str))
            return false;
          var clientInfo=window.JSON.parse(str);
          if(clientInfo){
            if(isblank(clientInfo.openid))
              return true;
          } else {
            return true;
          }
        }
        return false;
      }



        $scope.init();
        ctrlReinitMap.remove('tabCtrl');
    });
