/**
 * 公共Bean
 */
var _ClientInfo=
{
  /**客户端版本号*/
  ver:1,
  /**客户端类型0/NULL为H5,1安卓,2苹果,3微信*/
  cli:3,
  /**微信openid*/
  openid:'',
  /**微信openidMd5  */
  openidmd5:'',
  /**客户token*/
  token:''
};
/**微信H5支付请求*/
var _WaJsapiPaymentParam={appid:"",timestamp1:0,noncestr:"",package1:"",signtype:"MD5",paysign:""}
/**
 **当前页码，从1开始
 *Integer pageNo;
 **每页数据量
 *Integer pageSize;
 **排序方式，ex. id desc
 *String orderstr;
 **查询条件
 *String where;
 **指令
 *String cmd;
 * @type {{where: string, pageNo: number, pageSize: number, hasNextPage: boolean, cmd: string}}
 * @private
 */
var _Page = {
  where: '', //条件
  orderstr: '', //排序字段 ex. 'hittimes desc', 为空表示 'id desc'
  pageNo: 1, //第几页，从1开始
  pageSize:appConfig.DEFPAGESIZE, //每页多少数量
  hasNextPage: true, //是否还有下一页
  cmd: '', //命令
  dbsize:0, //记录总数量
  totalpage:1 // 总页
};
