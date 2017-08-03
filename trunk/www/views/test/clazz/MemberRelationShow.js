/**
 * MemberRelationShow，会员父子关系详细
 */
app.controller('MemberRelationShowCtrl', ["$scope","$log","$state","$stateParams","Storage","ENV","MemberRelationService",function ($scope,$log,$state,$stateParams,Storage,ENV,MemberRelationService) {
    $log.debug("enter MemberRelationShow ctrl");
    //////////////前端C统一的函数包括 init addList getlocal get
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
    /**参数*/
    var id = $stateParams.id;
    /**
     * 初始化
     */
    $scope.init=function(){
        $log.debug("MemberRelationShow ctrl init "+id);
        $scope.get();
    };
    /**
     * 获取本地对象
     */
    $scope.getlocal=function(){
        $log.debug("MemberRelationShow ctrl getlocal id="+id);
        if(isblank0(id)){
            $scope.obj= _.clone(_MemberRelation);
        }else{
            $scope.obj=Storage.get(LOCAL_TMP_OBJ);
        }
        $log.debug($scope.obj);
    };
    /**
     * 获取网络对象
     */
    $scope.get=function() {
        $log.debug("MemberRelationShow ctrl get id=" + id);
        if (isblank0(id)) {
            MemberRelationService.newget().then(function (data) {
                $log.debug("MemberRelationShow ctrl newget then");
                $scope.obj = data;
            });
        } else {
            MemberRelationService.get(id).then(function (data) {
                $log.debug("MemberRelationShow ctrl get then");
                $scope.obj = data;
            });
        }
    }
    //////////////[统一]以上是前端C统一编写

    //////////////[统一]
    $scope.init();
}]);