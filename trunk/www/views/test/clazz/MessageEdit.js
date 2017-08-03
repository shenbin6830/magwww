/**
 * Created by zmax 
 * MessageListCtrl 短消息编辑
 */
app.controller('MessageEditCtrl', ["$scope","$log","$state","$stateParams","$location","Storage","ENV","MessageService",function ($scope,$log,$state,$stateParams,$location,Storage,ENV,MessageService) {
    $log.debug("enter MessageEdit ctrl");
    //////////////前端C统一的函数包括 init addList getlocal get
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
    /**参数 0表示新建 */
    var id = $stateParams.id;
    /**
     * 初始化
     */
    $scope.init=function(){
        $log.debug("MessageEdit ctrl init "+id);
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
        $log.debug("MessageEdit ctrl getlocal id="+id);
        if(isblank0(id)){
            $scope.obj= _.clone(_Message);
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
        $log.debug("MessageEdit ctrl get id=" + id);
        if (isblank0(id)) {
            MessageService.newget().then(function (data) {
                $log.debug("MessageEdit ctrl newget then");
                $scope.obj = data;
	            $scope.int2str();
            });
        } else {
            MessageService.get(id).then(function (data) {
                $log.debug("MessageEdit ctrl get then");
                $scope.obj = data;
	            $scope.int2str();
            });
        }
    }
	/**
     * 数字转文本，要不然select无法默认
     */
    $scope.int2str = function () {
    }
    /**
     * 保存
     */
    $scope.save=function(){
        $log.debug("Message ctrl save id="+id);
        $log.debug($scope.obj)
        if(isblank0(id)) {
            MessageService.create($scope.obj).then(function (data) {
                $log.debug("Message ctrl save then");
                $scope.obj=data;
                $location.path("/MessageShow/"+$scope.obj.id);
            });
        }else{
            MessageService.update($scope.obj).then(function (data) {
                $log.debug("Message ctrl update then");
                $scope.obj=data;
                $location.path("/MessageShow/"+$scope.obj.id);
            });
        }
    };
    //////////////[统一]以上是前端C统一编写

    //////////////[统一]
    $scope.init();
}]);