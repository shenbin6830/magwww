/**
 * 自定义标签 通用版
 * Created by zmax on 2017/2/7.
 */

'use strict';

/**
 * 智能加载页面
 * ex. <div data-smart-include="views/zlayout/header.tpl.html" class="placeholder-header"></div>
 */
app.directive('smartInclude', function () {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: function (element, attr) {
                return attr.smartInclude;
            },
            compile: function(element){
                element[0].className = element[0].className.replace(/placeholder[^\s]+/g, '');
            }
        };
    }
)
/**
 * 让herf无效，不会点到根目录上去
 * ex.<a href-void>XXX</a>
 */
    .directive('hrefVoid', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                element.attr('href','#');
                element.on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                })
            }
        }
    })
/**
 * 给图象加上正确的imgbase服务器路径，如果图象不存在的话，给个默认图，不要红叉
 * 使用方法：<img reset-img="Mem" ng-src="{{wwwhome.headimg2}}"/> <img reset-img ng-src="{{wwwhome.headimg2}}"/>
 * //imgType:Doc医生头像，Mem患者头像
 */
    .directive('resetImg', function($document) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {
                console.log("resetImg WORK");
                var applyNewSrc = function(src) {
                    var imgType=$attributes.resetImg
                    if(isblank(src) || src==''){
                        if(imgType=='Doc'){
                            src="res/img/ben.png";
                        }else if(imgType=='Mem'){
                            src="res/img/mike.png";
                        }else if(imgType=='Blank'){
                            src="res/img/perry.png"; //一张1PX的透明空白图
                        }else{
                            src="res/img/default.png";
                        }
                    }
                    else if((src.indexOf("http://")==0 || src.indexOf("https://")==0)){

                    }else{
                      src=imgbase+src;
                    }

                    var newImg = $element.clone(true);

                    newImg.attr('src', src);
                    newImg.attr('ng-src', src);
                    $element.replaceWith(newImg);
                    $element = newImg;
                };

                $attributes.$observe('src', applyNewSrc);
                $attributes.$observe('ngSrc', applyNewSrc);
            }
        };
    })
/**
 * 动态编译，可以在html中放置ng-click等
 * see http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
 * 使用方法 <div dynamic="obj.msg"></div>
 */
    .directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    })
/**
 *防重复提交 使用方法在标签中写 forbid-Re-Submit
 * <button forbid-Re-Submit ng-click ="xxx()">按钮</button>
 */
    .directive('forbidReSubmit', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {
                $element.on('$destroy', function() {
                    $element.attr('disabled', false);
                });
                $element.bind('click', function() {
                    $timeout(function() {
                        $element.attr('disabled', true);
                    }, 5000);
                });
            }
        };
    })
/**
 * 动态编译
 * ex. item.tempatle="<i class='searchicon fa fa-search'   ng-click='open()' ></i>";
 * <div compile="item.tempatle"></div>
 */
    .directive('compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    })
;

