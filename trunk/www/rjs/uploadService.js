/**
 * 文件图片上传服务
 */
app
    .service('uploadService', function($rootScope,$q,$http,$log,$timeout,ENV,Storage,Upload) {
        $log.debug("uploadService in");

        return {
            /**
             * 图片/文件上传之多图文版
             * @param files
             * @returns {*}
             */
            uploadMany: function(files) {
                var deferred = $q.defer();
                var clientInfo = Storage.get(CLIENT_INFO);
                if (!clientInfo || !clientInfo.token) {
                    //没登录
                    console.log("上传错误，!clientInfo || !clientInfo.token");
                    deferred.reject('没登录');  //任务未被成功执行
                    return deferred.promise;
                }
                var ret = new Array();
                angular.forEach(files,function(file,index){
                    Upload.upload({
                        url: restbase+'/upload',
                        data: {token:clientInfo.token},
                        file: file
                    }).then(function (response) {
                        $timeout(function () {
                            //console.log("$timeout",response);
                            //$scope.result = response.data;
                            if(response.data.success){
                                //CommonAService.alertm('文件上传ok');
                                //console.log('response.data:',response.data);
                                ret.push(response.data);
                                if(index==files.length-1){
                                    deferred.resolve(ret);
                                }
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

                });
                return deferred.promise;
            },
            /**
             * 图片/文件上传之单图文版
             * @param file
             * @returns {*}
             */
            upload: function(file) {
                var deferred = $q.defer();
                var clientInfo = Storage.get(CLIENT_INFO);
                if (!clientInfo || !clientInfo.token) {
                    //没登录
                    console.log("上传错误，!clientInfo || !clientInfo.token");
                    deferred.reject('没登录');  //任务未被成功执行
                    return deferred.promise;
                }
                Upload.upload({
                    url: restbase+'/upload',
                    data: {token:clientInfo.token},
                    file: file
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
            },
            /**
             * 文件上传之BASE64版，用于图片剪切
             * @param name 文件名
             * @param base64 BASE64字节
             * @returns {*}
             */
            uploadB64: function(name,base64) {
                var deferred = $q.defer();
                var clientInfo = Storage.get(CLIENT_INFO);
                if (!clientInfo || !clientInfo.token) {
                    //没登录
                    console.log("上传错误，!clientInfo || !clientInfo.token");
                    deferred.reject('没登录');  //任务未被成功执行
                    return deferred.promise;
                }
                Upload.upload({
                    url: restbase+'/upload',
                    data: {token:clientInfo.token},
                    file: Upload.dataUrltoBlob(base64, name)
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
            },
            /**
             * 推荐2文+2项+2模
             * 返回我[[文章1,文章2],[项目1,项目2],[模块1,模块2]]
             * 当然也有可能为空
             * @param categoryId 品类id
             * @returns {*}
             */
            test: function(categoryId) {
                var url = ENV.api + "/test.html?category="+categoryId;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: url
                }).success(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        };
    });
