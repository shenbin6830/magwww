/**
 * Created by zmax on 2017/2/7.
 * 自定义服务工厂
 */

/**
 * http ajax注入以及返回错误拦截
 */
app.config(function ($provide, $httpProvider) {

    $provide.factory('sessionInjector', ['$rootScope', '$q', '$log', 'Storage', function ($rootScope, $q, $log, Storage) {
        return {
            'request': function (config) {
                //console.log("request");
                //config.header.xx=111;
                if (config.params) {
                    config.params.ver = _ClientInfo.ver;
                    var clientInfo = Storage.get(CLIENT_INFO);
                    if (clientInfo) {
                        if (clientInfo.cli)config.params.cli = clientInfo.cli;
                        if (clientInfo.openid)config.params.openid = clientInfo.openid;
                        if (clientInfo.openidmd5)config.params.openidmd5 = clientInfo.openidmd5;
                        if (clientInfo.token)config.params.token = clientInfo.token;
                    } else {
                        config.params.cli = _ClientInfo.cli;
                    }
                }
                if (config.headers) {
                    //改变HEADER会改变请求结构，要服务器支持
                    //config.headers["xx"]=111;
                    //config.headers.yy=222;
                }
                //console.log(config);
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                //console.log('requestError:' + rejection);
                return rejection;
            },
            //success -> don't intercept
            'response': function (response) {
                //console.log('response:' + response);
                return response || $q.when(response);
            },
            //error -> if 401 save the request and broadcast an event
            'responseError': function (response) {
                //401表示没有权限需要登录
                if (response.status === 401) {
                    var deferred = $q.defer(),
                        req = {
                            config: response.config,
                            deferred: deferred
                        };
                    //$rootScope.requests401.push(req);
                    $rootScope.$broadcast('event.NeedLoginException', 'serv');
                    return deferred.promise;
                }
                //406表示系统错误，弹框
                if (response.status === 406) { //NOT_ACCEPTABLE
                    $log.debug("http error 406");
                    var deferred = $q.defer();
                    $rootScope.$broadcast('event.alertError', response.data);
                    return deferred.promise;
                }
                return $q.reject(response);
            }
        };
    }]);
    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('sessionInjector');

    //RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));
});


/**
 * 本地存储
 */
app.factory('Storage', function() {
    "use strict";
    return {
        /**
         * 保存对象
         * ex. Storage.set("user",user)
         * @param key
         * @param data
         * @returns {*}
         */
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        /**
         * 取出对象
         * ex. user=Storage.get("user")
         * @param key
         * @returns {*}
         */
        get: function(key) {
            try {
                return window.JSON.parse(window.localStorage.getItem(key));
            } catch(err) {
                console.log("window.JSON.parse.ERR"+ err.name+" ---> "+ err.message+" ---> ");
                console.log(key);
                console.log(window.localStorage.getItem(key));
                return null;
            }
        },
        /**
         * 删除
         * @param key
         * @returns {*}
         */
        remove: function(key) {
            return window.localStorage.removeItem(key);
        },

        /**
         * 清空
         * @returns {*}
         */
        clear: function() {
            return window.localStorage.clear();
        }
    };
});

/**
 * 普通服务
 */
app.factory('CommonService', function($http, $rootScope,ENV) {
    "use strict";
    return {
        /**
         * 搜索map转where
         * 搜索map有特别要求格式,
         * map.value.key以 searchrange- 开头，表示输入范围选择
         * @param map ex.{'sex':{key:'0',value:'男'},'study':{key:'0',value:'小学'},'age':{key:'searchrange-10-20',value:'10-20'}}
         * @returns {string} ex. 'sex=0 and study=1 and age >= 10 and age < 20'
         */
        map2where: function (map) {
            var hql = "";
            angular.forEach(map, function (value, key) {
                //key='sex' value={key:'0',value:'男'};
                if(value.key && value.key!=''){
                    if(value.key.indexOf("searchrange-")==0){
                        //key='age':value={key:'searchrange-10-20',value:'10-20'}
                        var arange=value.key.split("-");
                        var start=arange[1];
                        var end=arange[2];
                        var between="";
                        if(!isblank(start)){
                            between=key+">="+start;
                        }
                        if(!isblank(end)){
                            between=queryAdd(between ,key+"<"+end);
                        }
                        hql += between + " and ";
                    }else{
                        //默认为普通一级多级选择
                        hql += key + '=' + value.key + " and ";
                    }

                }

            });
            //去掉最后and
            if (hql.length > 4)
                hql = hql.substring(0, (hql.length) - 4);
            return hql;
        }
    };
})
;

//注册登录服务
app.factory('RegService', function($http, $rootScope, $q, ENV, Storage) {
  return {
    /**
     * 注册a
     * @param username 用户名/手机号
     * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
     */
    rega: function(username) {
      var deferred = $q.defer();
      var url =ENV.api+"/rega";
      $http({
        method: 'GET',
        url: url,
        params: {username:username}
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );

      return deferred.promise;
    },
    /**
     * 注册b
     * @param username 用户名/手机号
     * @param imgcaptcha 图验码
     * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
     */
    regb: function(smscode,imgcaptcha) {
      var deferred = $q.defer();
      var url =ENV.api+"/regb";
      $http({
        method: 'GET',
        url: url,
        params: {username:username,captcha:imgcaptcha}
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );

      return deferred.promise;
    },
    /**
     * 注册c
     * @param user
     * @param member
     * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
     */
    regcb: function(user,member) {
      var deferred = $q.defer();
      var url =ENV.api+"/regc";
      var usermember=_.extend(user, member);

      $http({
        method: 'GET',
        url: url,
        params: usermember
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );
      return deferred.promise;
    },
    /**
     * 消费者登录
     * @param user
     * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
     */
    dologin: function(user) {
      var deferred = $q.defer();
      var url =ENV.api+"/dologin";
      $http({
        method: 'GET',
        url: url,
        params: {username:user.username,password:user.password,roleId:user.roleId,isauto:user.isauto}
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );
      return deferred.promise;
    },
    /**
     * b2c
     * @param user
     * @returns {*}
     */
    dologinb2c: function(user) {
      var deferred = $q.defer();
      var url =ENV.api+"/dologinb2c";
      $http({
        method: 'GET',
        url: url,
        params: {username:user.username,password:user.password,roleId:user.roleId,isauto:user.isauto}
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );
      return deferred.promise;
    },
    /**
     * 商家登录
     * @param user
     * @returns {.watchAcceleration.promise|*|promise|fd.g.promise|qFactory.Deferred.promise}
     */
    dologin1: function(user) {
      var deferred = $q.defer();
      var url =ENV.api+"/dologin1";
      $http({
        method: 'GET',
        url: url,
        params: {username:user.username,password:user.password}
      }).success(
        function (data, status, header, config) {
          deferred.resolve(data);
        }
      );
      return deferred.promise;
    },
    getAndroidVersion: function() {

      return $http.post(ENV.api + "/getAndroidVersion.html")
        .success(function(data, status, headers, config) {
          $rootScope.$broadcast('lxs.AndroidVersionUpdate', data);
        });
    }
  };
});
