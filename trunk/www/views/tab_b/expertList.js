/**
 * Created by zmax
 * MemberListCtrl 会员列表
 */
app.controller('expertListCtrl', function ($scope,$log,$state,$location,Storage,ENV,CommonIService,MemberService) {
    $log.debug("enter MemberList ctrl");
    //////////////前端C统一的函数包括 init addList checkHeadAll show page* query searchquery searchquerycancel
    //////////////自行修改的包括：

    //////////////[统一]以下是前端C统一编写
    /**页码*/
    $scope.page=_.clone(_Page);
    $scope.page.totalpage=1;
    /**页面显示的列表*/
    $scope.list=[];
    /**已经被选择的map*/
    $scope.ao_selected={};
	/**选择 用户类型*/
	$scope.ao_Member_mtype=selectmap_Member_mtype;
	/**选择 类型之个人企业*/
	$scope.ao_Member_idtype=selectmap_Member_idtype;
    /**
     * 进入前
     */
    $scope.$on('$ionicView.beforeEnter', function() {
        $log.debug("MemberList ctrl beforeEnter");
    });
    /**
     * 进入后
     */
    $scope.$on('$ionicView.afterEnter', function() {
        $log.debug("MemberList ctrl afterEnter");
        if (ctrlReinitMap.get('MemberListCtrl')) {
            ctrlReinitMap.remove('MemberListCtrl');
            $log.debug("MemberList ctrl afterEnter init");
            $scope.init();
        }
    });

    /**
     * 初始化
     */
    $scope.init=function(){
        $log.debug("MemberList ctrl init ");
        $scope.page.where = "mtype=1 " ;
		    $scope.page.pageNo=1;
        $scope.page.hasNextPage=false;
        $scope.list=[];
        $scope.first();
    };
  /**
   * 药品搜索
   */
  $scope.searchForProduct=function(searchName) {
    $scope.list=[];
    if (isblank(searchName)) {
      $scope.init();
      return;
    }
    else {
      $scope.page.where = "mtype=1 and name like '%" + searchName + "%'";
      $scope.page.pageNo = 1;
      $scope.page.hasNextPage = false;
      $scope.first();
    }
  };
  /**
   * 清空搜索
   */
  $scope.search3=function(){
    $scope.searchData="";
    $scope.list=[];
    $scope.init();
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
    };

    /**
     * 第一次查询
     */
    $scope.first=function(){
        MemberService.first($scope.page).then(function (data) {
            $log.debug("MemberList ctrl query then");
            $scope.addList(data);
            $scope.$broadcast('scroll.refreshComplete');
        });

    };

    /**
     * 下拉加载更多查询
     */
    $scope.more=function(){
        $log.debug("MemberList ctrl more=========");
        if(!$scope.page.hasNextPage){
            return;
        }
        MemberService.more($scope.page).then(function (data) {
            $log.debug("MemberList ctrl more then");
            $scope.addList(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    //////////////[统一]以上是前端C统一编写



    //////////////[统一]以下是前端C统一编写
    $scope.init();
    ctrlReinitMap.remove('MemberListCtrl');
});
app.filter('noFractionCurrency',
  [ '$filter', '$locale',
    function(filter, locale) {
      var currencyFilter = filter('currency');
      var formats = locale.NUMBER_FORMATS;
      return function(amount, currencySymbol) {

        var value = currencyFilter(amount, currencySymbol);
        var sep = value.indexOf(formats.DECIMAL_SEP);

        console.log(currencySymbol);
        if(amount >= 0) {
          return value.substring(1, sep);
        }
        return value.substring(0, sep) + ')';
      };
    } ]);
