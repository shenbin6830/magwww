/**
 * Created by zmax on 2017/2/7.
 * 一些服务小程序
 */

/**
 * 根据字段及值，决定是否要禁止提交
 * @param key 字段名
 * @param value 值
 */
function boolNotPostObject(key,value){
    //console.log(""+key+":"+value)
    if(value instanceof Date)
        return false;
    return _.isObject(value) || _.isArray(value)
        || key.indexOf("String") != -1 || key=="gmtCreate" || key=="gmtModified"
        || key=="myname" || key=="hasNextPage"
        ;
}