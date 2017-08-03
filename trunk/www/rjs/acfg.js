// 配置文件
'use strict';

/**
 *配置开始
 */

var appConfig = window.appConfig || {};

appConfig.debugState = false; //调试
appConfig.api = restbase; //'api'; //Rest地址
appConfig.menu_speed = 200; //速度
appConfig.DEFPAGESIZE=20; //一页默认几条
appConfig.PRJCNAME = "点今"; //项目中文名

/**
 * 默认的头
 * @type {{title: boolean, view: defaultHeader, back: boolean, logout: boolean, positison: boolean, positisontext: string}}
 */
var defaultHeader={
  title: false,
  view: this,
  back: false,
  logout:false,
  positison: true,
  positisontext:''
};
/**需要重新init的Controller的Map*/
var ctrlReinitMap=new HashMap();
var pubnowtab='A';
///////////常用固定值
var wxConfig={
  appId:'', // 必填，公众号的唯一标识
  timestamp: null, // 必填，生成签名的时间戳
  noncestr: null, // 必填，生成签名的随机串
  signature:null// 必填，签名，见附录1
};
/**注册输入完成后的用户*/
var REG_USER="reguser";
//////下面是固定变量名
/**客户端消息*/
var CLIENT_INFO="CLIENT_INFO";
/**本地保存的登录用户信息 user{user,member/admin/} */
var LOCAL_USER="LOCAL_USER";
/**本地保存的临时OBJ,用于页面传递*/
var LOCAL_TMP_OBJ="LOCAL_TMP_OBJ";
/**登录后服务器给的用户*/
var LOGINED_USER="logineduser";
var outGetOpenidUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4ab9e7817adaf25&redirect_uri=http%3A%2F%2Fmag.dian-jin.com%2Fmag%2Fpub%2Fwx%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
/**个推*/
var GETUICID="cid";
var isDebug=true;
var PRJCNAME = "点今";
