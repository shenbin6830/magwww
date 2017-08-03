/**
 * 特别的网络服务
 */
app
    .service('zspecService', function($rootScope,$q,$http,$log,ENV) {
        $log.debug("zspecService in");
        //列表
        var list;
		//当前的对象
        var obj;
		//页码信息
        var page = {
            where: '', //条件
            pageNo: 1, //第几页，从1开始
            pageSize:ENV.DEFPAGESIZE, //每页多少数量
            hasNextPage: true //是否还有下一页
        };
        var thislist=[]; //这次取到的数据

        return {
          /**
           * 请求验证码 图形验证码认证版
           */
          requestCode: function(mobile) {
            var url = ENV.api + "/requestCode";
            var deferred = $q.defer();
            $http({
              method: 'GET',
              url: url,
              params: {mobile: mobile}
            }).success(function(data) {
              deferred.resolve(data);
            });
            return deferred.promise;
          },
          /**
           * 短信验证注册登陆
           */
          dologinbysms: function(user) {
            var url = ENV.api + "/dologinbysms";
            var deferred = $q.defer();
            $http({
              method: 'GET',
              url: url,
              params: {username: user.username, password: user.password, roleId: user.roleId, code: user.code}
            }).success(function(data) {
              deferred.resolve(data);
            });
            return deferred.promise;
          },
          /**
           * 去抢答
           * @param id
           * @param title
           * @returns {*}
           */
          findQuickListForAnswer:
            function() {
              var url = ENV.api + "/findQuickListForAnswer";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 查看问题，等待付款
           * @param id
           * @param title
           * @returns {*}
           */
          readyPayForQuestion:
            function(questionId) {
              var url = ENV.api + "/readyPayForQuestion";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {questionId:questionId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 查看抢答，等待付款
           * @param id
           * @param title
           * @returns {*}
           */
          readyPayForQuick:
            function(quickId) {
              var url = ENV.api + "/readyPayForQuick";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {quickId:quickId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 充值付款
           * @param id
           * @param title
           * @returns {*}
           */
          orderrRechargePay:
            function(rechargeId) {
              var url = ENV.api + "/OrderrRechargePay";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {rechargeId:rechargeId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 问题去支付
           * @param id
           * @param title
           * @returns {*}
           */
          orderrQuestionPay:
            function(questionId) {
              var url = ENV.api + "/OrderrQuestionPay";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {questionId:questionId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 抢答去支付
           * @param id
           * @param title
           * @returns {*}
           */
          orderrQuickPay:
            function(quickId) {
              var url = ENV.api + "/OrderrQuickPay";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {quickId:quickId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 问题观看会员去支付
           * @param id
           * @param title
           * @returns {*}
           */
          orderrQuestionviewPay:
            function(questionId) {
              var url = ENV.api + "/OrderrQuestionviewPay";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {questionId:questionId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 问题观看会员去支付
           * @param id
           * @param title
           * @returns {*}
           */
          orderrQuickviewPay:
            function(quickId) {
              var url = ENV.api + "/OrderrQuickviewPay";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {quickId:quickId}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
          /**
           * 签到
           * @returns {*}
             */
          memberSign:
            function() {
              var url = ENV.api + "/memberSign";
              var deferred = $q.defer();
              $http({
                method: 'POST',
                url: url,
                params: {}
              }).success(function(data) {
                deferred.resolve(data);
              }).error(function(data) {
                deferred.reject();
              });
              return deferred.promise;
            },
            /**
             * 登录
             * @param user
             * @returns {d.promise|Function|*|promise}
             */

        };
    });
