/**
 * Created by zmax 
 * HisScoreListCtrl 积分流水编辑
 */
app.controller('HisScoreEditCtrl', function ($scope,$log,$state,$stateParams,$location,Storage,ENV,HisScoreService) {
    $log.debug("enter HisScoreEdit ctrl");
    //////////////前端C统一的函数包括 init addList getlocal get
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
    /**参数 0表示新建 */
    var id = $stateParams.id;
	/**选择 类型*/
	$scope.ao_HisScore_otype=selectmap_HisScore_otype;
    /**
     * 初始化
     */
    $scope.init=function(){
        $log.debug("HisScoreEdit ctrl init "+id);
        if($scope.getlocal()){
            $scope.int2str();
        }else{
            $scope.get();
        }
    };
    /**
     * 获取本地对象
     * @returns {boolean} 是否取到
     */

    $scope.getlocal=function(){
        $log.debug("HisScoreEdit ctrl getlocal id="+id);
        if(isblank0(id)){
            $scope.obj= _.clone(_HisScore);
        }else{
            $scope.obj=Storage.get(LOCAL_TMP_OBJ);
        }
        if(null==$scope.obj)
            return false;
        //$log.debug($scope.obj);
        return true;
    };
    /**
     * 获取网络对象
     */
    $scope.get=function() {
        $log.debug("HisScoreEdit ctrl get id=" + id);
        if (isblank0(id)) {
            HisScoreService.newget().then(function (data) {
                $log.debug("HisScoreEdit ctrl newget then");
                $scope.obj = data;
	            $scope.int2str();
            });
        } else {
            HisScoreService.get(id).then(function (data) {
                $log.debug("HisScoreEdit ctrl get then");
                $scope.obj = data;
	            $scope.int2str();
            });
        }
    }
	/**
     * 数字转文本，要不然select无法默认
     */
    $scope.int2str = function () {
		if($scope.obj.otype)$scope.obj.otype=''+$scope.obj.otype;
    }
    /**
     * 保存
     */
    $scope.save=function(){
        $log.debug("HisScore ctrl save id="+id);
        $log.debug($scope.obj)
        if(isblank0(id)) {
            HisScoreService.create($scope.obj).then(function (data) {
                $log.debug("HisScore ctrl save then");
                $scope.obj=data;
                $location.path("/HisScoreShow/"+$scope.obj.id);
            });
        }else{
            HisScoreService.update($scope.obj).then(function (data) {
                $log.debug("HisScore ctrl update then");
                $scope.obj=data;
                $location.path("/HisScoreShow/"+$scope.obj.id);
            });
        }
    };
    //////////////[统一]以上是前端C统一编写

    //////////////[统一]
    $scope.init();
});