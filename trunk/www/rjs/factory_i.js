/**
 * 普通服务之Inoic
 */
app.factory('CommonIService', function($http, $rootScope, $ionicPopup, ENV, Storage) {

  return {
    /**
     * 弹警告信息窗口，
     * 使用方法 CommonIService.alertm('消息','标题').then(function (res) {});
     * @param msg
     * @param title 可以为空
     * @returns {Object|*}
     */
    alertm: function(msg,title){
      return alertPopup = $ionicPopup.alert({
        title: title ? title : PRJCNAME,
        template: msg ,
        okText:'确定',
        okType: 'button-positive'
      });
    },
    /**
     * 二次确认窗口
     * 使用方法 CommonIService.confirm('消息','标题').then(function(res) {if(res) {} else {}});
     * @param msg
     * @param title
     */
    confirm: function(msg,title) {
      return confirmPopup = $ionicPopup.confirm({
        title: title ? title : PRJCNAME ,
        template: msg ,
        cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
        okText: '确定'
      });
    }

  };
})
;
/**
 * 服务:Wx，微信JSAPI
 * 使用方法：
 *         WxService.config().then(function (data) {
            console.log("my.js config then ");
            WxService.getLocation().then(function(lnglat){
                $scope.lnglat=lnglat;
            });
         });
 */
app.factory('WxService', function( $rootScope,$q,$http,CommonIService) {
    var configed=false;
    var latitude;
    var longitude;
    return {
      /**
       * 配置
       * @param wxConfig
       */
      config: function () {
        var deferred = $q.defer();
        var url =restbase+"/wxConfig";
        var thisurl=location.href.split('#')[0]; //不用encodeURIComponent
        $http({
          method: 'GET',
          url: url,
          params:{surl:thisurl}
        }).success(
          function (data, status, header, config) {
            //wxConfig=data.obj["wxConfig"];
            wxConfig=data;
            wx.config({
              debug: false, // 开启调试模式
              appId: wxConfig.appId, // 必填，公众号的唯一标识
              timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
              nonceStr: wxConfig.noncestr, // 必填，生成签名的随机串
              signature: wxConfig.signature,// 必填，签名，见附录1
              jsApiList: ['checkJsApi', 'onMenuShareTimeline',
                'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
            });
            /*以后试下在config加success参数*/
            wx.ready(function(){
              configed=true;
              deferred.resolve();
            });
            wx.error(function(res){
              CommonIService.alertm("wx.config_error");
              configed=false;
              deferred.reject(res);
            });
          }
        );
        return deferred.promise;
      },
      /**
       * 支付请求
       * @param waJsapiPaymentParam _WaJsapiPaymentParam={appid:"",timestamp1:0,noncestr:"",package1:"",signtype:"MD5",paysign:""}
       * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
       */
      pay:function(waJsapiPaymentParam){
        var deferred = $q.defer();
        wx.chooseWXPay({
          timestamp: waJsapiPaymentParam.timestamp1, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: waJsapiPaymentParam.noncestr, // 支付签名随机串，不长于 32 位
          package: waJsapiPaymentParam.package1, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: waJsapiPaymentParam.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: waJsapiPaymentParam.paysign, // 支付签名
          success: function (res) {
            deferred.resolve(res);
          }
          ,
          fail:function (res) {
            CommonIService.alertm("fail1");
               console.log("wx.chooseWXPay fail");
               console.log(res);
               deferred.reject(res);
           }
        });
        return deferred.promise;
      }
    };
  });
