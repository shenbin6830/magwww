/**
 * Created by zmax
 * MemberRelationListCtrl 会员父子关系列表
 */
app.controller('MemberRelationListCtrl',function ($scope,$log,$state,$location,Storage,ENV,CommonIService,MemberRelationService,$stateParams) {
    $log.debug("enter MemberRelationList ctrl");
    //////////////前端C统一的函数包括 init addList checkHeadAll show page* query searchquery searchquerycancel
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
  //0表示我的上级
    $scope.act=$stateParams.act;
    /**页码*/
    $scope.page=_.clone(_Page);
    $scope.page.totalpage=1;
    /**页面显示的列表*/
    $scope.list=[];
    /**已经被选择的map*/
    $scope.ao_selected={};
    $scope.user=Storage.get(LOGINED_USER);
    /**
     * 进入前
     */
    $scope.$on('$ionicView.beforeEnter', function() {
        $log.debug("MemberRelationList ctrl beforeEnter");
    });
    /**
     * 进入后
     */
    $scope.$on('$ionicView.afterEnter', function() {
        $log.debug("MemberRelationList ctrl afterEnter");
        if (ctrlReinitMap.get('MemberRelationListCtrl')) {
            ctrlReinitMap.remove('MemberRelationListCtrl');
            $log.debug("MemberRelationList ctrl afterEnter init");
            $scope.init();
        }
    });

    /**
     * 初始化
     */
    $scope.init=function(){

      if($scope.act==0){
        $scope.page.where="memberCh="+ $scope.user.id;
      }else{
        $scope.page.where="memberId="+ $scope.user.id;
      }
	  	$scope.page.pageNo=1;
        $scope.page.hasNextPage=false;
        $scope.list=[];
        $scope.first();

    };
    /**
     * 上拉刷新
     */
    $scope.doRefresh=function(){
        $scope.init();
    };
    /**
     * 给list上加数据
     * @param data
     */
    $scope.addList=function(data){
        angular.forEach(data, function (item) {
            $scope.list.push(item);
        });
        if(data && data.length < $scope.page.pageSize){
            $scope.page.hasNextPage=false;
        }else{
            $scope.page.hasNextPage=true;
        }
      $scope.list=FastJson.format($scope.list);
    };

    /**
     * 第一次查询
     */
    $scope.first=function(){
        MemberRelationService.first($scope.page).then(function (data) {
            $log.debug("MemberRelationList ctrl query then");
            $scope.addList(data);
            $scope.$broadcast('scroll.refreshComplete');
        });

    };

    /**
     * 下拉加载更多查询
     */
    $scope.more=function(){
        $log.debug("MemberRelationList ctrl more=========");
        if(!$scope.page.hasNextPage){
            return;
        }
        MemberRelationService.more($scope.page).then(function (data) {
            $log.debug("MemberRelationList ctrl more then");
            $scope.addList(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    //////////////[统一]以上是前端C统一编写



    //////////////[统一]以下是前端C统一编写
    $scope.init();
    ctrlReinitMap.remove('MemberRelationListCtrl');
});
