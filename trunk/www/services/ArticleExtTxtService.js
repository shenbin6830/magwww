/**
 * 服务:ArticleExtTxt，文章内容
 */
app
    .service('ArticleExtTxtService', ["$rootScope","$q","$http","$log","ENV","Storage",function($rootScope,$q,$http,$log,ENV,Storage) {
        $log.debug("ArticleExtTxtService in");
        var aurl=ENV.api + "/ArticleExtTxt";
        return {
            /**
             * 初次查询
             * @param _page 页码对象，如果为空使用全局页码对象
             */
            first: function(_page) {
                return this.query(_page);
            },
            /**
             * 更多查询
             * @param _page 页码对象，如果为空使用全局页码对象
             */
            more: function(_page) {
                if(_page && _page.hasNextPage){
                    _page.pageNo=_page.pageNo+1;
                    return this.query(_page);
                }
            },
            /**
             * 查询Promise版
             * @param _page 页码对象，如果为空使用全局页码对象
             * @returns {*}
             */
            query: function(_page) {
                var thispage=(_page)?_page:_Page;
                var deferred = $q.defer();
                var url =aurl+"/query";
                $http({
                    method: 'GET',
                    url: url,
                    params: thispage
                }).success(
                    function (data, status, header, config) {
                        if(data&&_page&&data.length<_page.pageSize){
                            _page.hasNextPage=false;
                        }
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            },
            /**
             * 获取一个新对象，加上各种LIST让用户选择，和get/0一个效果
             * @param _page 页码对象，如果为空使用全局页码对象
             * @returns {*}
             */
            newget: function(_page) {
                var thispage=(_page)?_page:_Page;
                var deferred = $q.defer();
                var url =aurl+"/getnew";
                $http({
                    method: 'GET',
                    url: url,
                    params: thispage
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            }, 
             /**
             * 根据原始对象和页码对象组成可以提交的对象
             * @param obj 原始对象
             * @param _page 可以为空
             * @returns {*}
             */
            makepostobj:function(obj,_page){
                var thispage=(_page)?_page:_Page;
                var tmpparam=_.omit(obj, function(value, key, object) {
                    return boolNotPostObject(key,value);
                });
                tmpparam=_.extend(tmpparam, {cmd: thispage.cmd});
                return tmpparam;
            },
			/**
             * 创建Promise版 form_post版
             * @param obj ArticleExtTxt 要被创建的对象
             * @param _page 页码对象，如果为空使用全局页码对象
             */
            create: function(obj,_page) {
                var clientInfo = Storage.get(CLIENT_INFO);
                //console.log("clientInfo",clientInfo);
                if (!clientInfo || !clientInfo.token) {
                    deferred.reject('nologin');  //任务未被成功执行
                    return deferred.promise;
                }
                var tmpparam=this.makepostobj(obj,_page);
                tmpparam=_.extend(tmpparam, {token: clientInfo.token});
                $log.debug("ArticleExtTxtService update");
                $log.debug(tmpparam);
                //将参数传递的方式改成form
                var postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                };
                var deferred = $q.defer();
                var url =aurl+"/create";
                //发送post请求，获取数据
                $http.post(url, tmpparam, postCfg)
                    .success(function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            /**
             * 更新Promise版 form_post版
             * @param obj ArticleExtTxt 要被创建的对象
             * @param _page 页码对象，如果为空使用全局页码对象
             */
            update: function(obj,_page) {
                var clientInfo = Storage.get(CLIENT_INFO);
                //console.log("clientInfo",clientInfo);
                if (!clientInfo || !clientInfo.token) {
                    deferred.reject('nologin');  //任务未被成功执行
                    return deferred.promise;
                }
				var tmpparam=this.makepostobj(obj,_page);
                tmpparam=_.extend(tmpparam, {token: clientInfo.token});
                $log.debug("ArticleExtTxtService update");
                $log.debug(tmpparam);
                //将参数传递的方式改成form
                var postCfg = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                };
                var deferred = $q.defer();
                var url =aurl+"/update";
                //发送post请求，获取数据
                $http.post(url, tmpparam, postCfg)
                    .success(function (data, status, header, config) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }, 
            /**
             * 获取数据，通过网络查询
             * @param id 如果id=0，返回一个新对象
             * @param _page 页码对象，如果为空使用全局页码对象
             * @returns {*}
             */
            get: function(id,_page) {
                var thispage=(_page)?_page:_Page;
                var deferred = $q.defer();
                var url =aurl+"/get/"+id;
                $http({
                    method: 'GET',
                    url: url,
                    params: thispage
                }).success(
                    function (data, status, header, config) {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            },
            newObj: function() {
                return _.clone(_ArticleExtTxt);
            }
        };
}]);

