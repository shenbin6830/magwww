/**
 * 判断是否为微信浏览器
 * @returns {Boolean}
 */
function is_weixn(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }
}

//静态页面取值，用法var name=UrlParm.parm("name");
UrlParm = function() { // url参数
  var data, index;
  (function init() {
    data = [];
    index = {};
    var u = window.location.search.substr(1);
    if (u != '') {
      var parms = decodeURIComponent(u).split('&');
      for (var i = 0, len = parms.length; i < len; i++) {
        if (parms[i] != '') {
          var p = parms[i].split("=");
          if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
            data.push(['']);
            index[p[0]] = data.length - 1;
          } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
            data[0] = [p[1]];
          } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
            data.push([p[1]]);
            index[p[0]] = data.length - 1;
          } else {// c=aaa
            data[index[p[0]]].push(p[1]);
          }
        }
      }
    }
  })();
  return {
    // 获得参数,类似request.getParameter()
    parm : function(o) { // o: 参数名或者参数次序
      try {
        return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);
      } catch (e) {
      }
    },
    //获得参数组, 类似request.getParameterValues()
    parmValues : function(o) { //  o: 参数名或者参数次序
      try {
        return (typeof(o) == 'number' ? data[o] : data[index[o]]);
      } catch (e) {}
    },
    //是否含有parmName参数
    hasParm : function(parmName) {
      return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;
    },
    // 获得参数Map ,类似request.getParameterMap()
    parmMap : function() {
      var map = {};
      try {
        for (var p in index) {  map[p] = data[index[p]];  }
      } catch (e) {}
      return map;
    },
    //当页面跳转，而非页面刷新时，上面的init方法不会执行，此时需要手动调用该方法
    reInit : function() {
      data = [];
      index = {};
      var u = window.location.search.substr(1);
      if (u != '') {
        var parms = decodeURIComponent(u).split('&');
        for (var i = 0, len = parms.length; i < len; i++) {
          if (parms[i] != '') {
            var p = parms[i].split("=");
            if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
              data.push(['']);
              index[p[0]] = data.length - 1;
            } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
              data[0] = [p[1]];
            } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
              data.push([p[1]]);
              index[p[0]] = data.length - 1;
            } else {// c=aaa
              data[index[p[0]]].push(p[1]);
            }
          }
        }
      }
      return this;
    }
  }
}();

/**
 * 根据传入的毫秒数判断距离当前时间几年前、几月前、几天前、几时前、几分前、几秒前
 * @param ms	最后登录时间转换成的毫秒
 * @returns {String}
 */
function timeFmat(ms) {
  if(!ms)
    return "刚刚";
  var d_minutes, d_hours, d_days,
    timeNow = new Date().getTime(),
    d = (timeNow - ms) / 1000,
    d_year = Math.floor(d / (24 * 60 * 60 * 365)),
    d_month = Math.floor(d / (24 * 60 * 60 * 30)),
    d_days = Math.floor(d / (24 * 60 * 60)),
    d_hours = Math.floor(d / (60 * 60)),
    d_minutes = Math.floor(d / 60),
    d_secend = Math.floor(d);
  if (d_year > 0) {
    return d_year + "年前 ";
  }else if (d_month > 0 && d_month < 12) {
    return d_month + "月前";
  }else if (d_month <= 0 && d_days > 0) {
    return d_days + "天前";
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + "小时前";
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + "分钟前";
  } else if (d_minutes <= 0 && d_secend > 0) {
    return d_secend + "秒钟前";
  } else if (d_secend == 0) {
    return "刚刚";
  } else {
    var s = new Date();
    s.setTime(ms);
    return (s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate()
    + " " + s.getHours() + ":" + s.getMinutes());
  }
}
/**
 * 格式化时间
 * @param date 时间 文本格式"1983-12-31"
 * @returns
 */
function timeFormat(date) {
  var ms=new Date(date.replace(/-/g,"/")).getTime();
  return timeFmat(ms) ;
}

/**
 * 返回yyyy-mm-dd HH:MM:ss的时间
 * @param date Date对象
 * @returns {string}
 */
function formatStdDate(sdate) {
  var date=new Date(sdate.replace(/-/g,"/")).getTime();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

/**
 * 获取今天的文本格式
 */
function today(){
  var now = new Date();
  var xYear=now.getFullYear();
  var xMonth=now.getMonth()+1;
  var xDay=now.getDate();
  return xYear+"-"+xMonth+"-"+xDay;
}
/**
 * 获取明天的文本格式
 */
function tomorrow(){
  var timeTmr = new Date().getTime()+(24 * 60 * 60 *1000);
  var now = new Date();
  now.setTime(timeTmr);
  var xYear=now.getFullYear();
  var xMonth=now.getMonth()+1;
  var xDay=now.getDate();
  return xYear+"-"+xMonth+"-"+xDay;
}
/**
 *  返回yyyy-mm-dd HH:MM:ss的时间
 *  获取上个月第一天的文本格式
 */
function firstDayOfLastMonth(){
  var now = new Date();
  var xYear=now.getFullYear();
  var xMonth=now.getMonth();
  var xDay=1;
  return xYear+"-0"+xMonth+"-0"+xDay+" 00:00:00";
}
/**
 *  返回yyyy-mm的时间
 *  获取上个月
 */
function LastMonth(){
  var now = new Date();
  var xYear=now.getFullYear();
  var xMonth=now.getMonth();
  return xYear+"-0"+xMonth;
}
/**
 * 计算年龄
 * @param sbirthday 时间 文本格式"1983-12-31"
 * @returns {Number}
 */
function calcAge(sbirthday){
  var birthday=new Date(sbirthday.replace(/-/g, "\/"));
  var d=new Date();
  var age = d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()|| d.getMonth()==birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
  return age;
}
/**
 * 是否为空，主要用于判断String
 * @param value
 */
function isblank(value){
  if(_.isNull(value)) return true;
  if(_.isUndefined(value)) return true;
  if(_.isNaN(value)) return true;
  if(value.length==0) return true;
  if(value=='undefined') return true;
  return false;
}
/**
 * 是否为空或0，主要用于判断int
 * @param value
 */
function isblank0(value){
  if(_.isUndefined(value)) return true;
  if(_.isNull(value)) return true;
  if(_.isNaN(value)) return true;
  if(value==undefined) return true;
  if(value=='undefined') return true;
  if(value==0) return true;
  return false;
}
/**
 * 是否为空，主要用于判断object
 * @param value
 */
function isblankobj(value){
  if(_.isNull(value)) return true;
  if(_.isUndefined(value)) return true;
  if(_.isNaN(value)) return true;
  if(value.length==0) return true;
  if(value=='undefined') return true;
  if(!_.isObject(value)) return true;
  return false;
}

/**
 * 是否为空list
 * @param value
 */
function isblanklist(value){
  if(_.isNull(value)) return true;
  if(_.isUndefined(value)) return true;
  if(_.isNaN(value)) return true;
  if(_.size(value)==0) return true;
  return false;
}

/**
 * 根据长度截取先使用字符串，超长部分追加...
 * @param str 对象字符串
 * @param len 目标字节长度
 * @return 处理结果字符串
 */
function cutString(str, len) {
  if(isblank(len))
    len=20;
  //length属性读出来的汉字长度为1
  if(str.length*2 <= len) {
    return str;
  }
  var strlen = 0;
  var s = "";
  for(var i = 0;i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if(strlen >= len){
        return s.substring(0,s.length-1) + "...";
      }
    } else {
      strlen = strlen + 1;
      if(strlen >= len){
        return s.substring(0,s.length-2) + "...";
      }
    }
  }
  return s;
}
/**
 *  解决浏览器的selection兼容
 * @returns
 */
function docSelection(){
  if (window.getSelection) {
    return window.getSelection();
  } else if (document.getSelection) {
    return document.getSelection();
  } else if (document.selection) {
    return document.selection.createRange();
  }
}
/**
 * 获取问号，分号，&之前的纯url
 */
function pureUrl(){
  var rawurl=window.location.href;
  var end;
  end = rawurl.indexOf("?")
  if (end != -1) rawurl = rawurl.substring(0, end);
  end = rawurl.indexOf(";")
  if (end != -1) rawurl = rawurl.substring(0, end);
  var url = decodeURI(rawurl);
  return url;
}

/**
 * 改变url的参数或删除
 * ex.changeURLParameter("http://a.com/b.html?p1=1&p2=2#/app/home","change","p1",2)=http://a.com/b.html?p1=2&p2=2#/app/home
 * changeURLParameter("http://a.com/b.html?p1=1&p2=2#/app/home","change","p1")=http://a.com/b.html?p1=&p2=2#/app/home
 * @param url
 * @param par 参数名称
 * @param parValue 需要改变的值
 * @returns {*}
 */
function changeURLParameter(url,par,parValue){
  //先把?拆开 u?p#j ->{u,p,j}
  var u="";
  var p="";
  var j="";
  var aupj = url.split("?");          //获取问号之前的url
  u=aupj[0];
  if(aupj.length>0){
    var pj=aupj[1];
    var apj=pj.split("#");
    p=apj[0];
    if(apj.length>0){
      j=apj[1];
    }
  }
  if(isblank(p))
    return url;
  //用&拆p, p1=1&p2=2 ，去找 &p1=
  var ap= p.split("&");
  var newp="";
  var found=false;
  for (i in ap){
    var pi=ap[i];
    if(isblank(pi))
      continue;
    var key="";
    var value="";
    var api=pi.split("=");
    key=api[0];
    if(api.length>0)
      value=api[1];
    if(key==par){
      found=true;
      if(parValue){
        newp=newp+"&"+key+"="+parValue;
      }else{
        continue;
      }
    }else{
      newp=newp+"&"+key+"="+value;
    }
  }
  if(!isblank(newp))
    u=u+"?"+newp;
  if(!isblank(j))
    u=u+"#"+j;
  return u;
}

/**
 * URL编码转译
 * 目前只用到+ =  以后有需要加
 * @param urlValue
 */
function urlValueTranslation(urlValue){
  return urlValue.replace(/\+/g, "%2B").replace(/=/g, "%3D").replace(" ", "");
}
/**
 * 去空格
 * @param str
 * @returns {*}
 */
function trim(str){
  str = str.replace(/^(\s|\u00A0)+/,'');
  for(var i=str.length-1; i>=0; i--){
    if(/\S/.test(str.charAt(i))){
      str = str.substring(0, i+1);
      break;
    }
  }
  return str;
}
/**
 * 两个where相加，前面不放where,where1和2的格式是 " where xxx" 或 "xxx"
 * @param where1
 * @param where2
 * @return where1 and where2
 */
function queryAdd(where1,where2){
  var retwhere="";
  if(!isblank(where1)){
    where1=trim(where1);
    if(where1.indexOf("where")==0)
      where1=where1.substring(5);
  }
  if(!isblank(where2)){
    where2=where2.trim();
    if(where2.indexOf("where")==0)
      where2=where2.substring(5);
  }

  if(isblank(where1)){
    if(isblank(where2)){
      retwhere= "";
    }else{
      retwhere= where2;
    }
  }else{
    if(isblank(where2)){
      retwhere= where1;
    }else{
      retwhere= where1 +" and "+where2;
    }
  }
  retwhere=retwhere.trim();
  if(isblank(retwhere))
    return "";
  if(retwhere=="where")
    return "";
  return retwhere;
}