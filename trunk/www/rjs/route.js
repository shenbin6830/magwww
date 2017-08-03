/**
 * 路由器之全局
 */
app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // setup an abstract state for the tabs directive
        // 下菜单
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'views/pub/tabs.html',
            controller: 'pubCtrl'
        })
        //手机页首页配置详细
        .state('tab.Wwwhome', {
          url: '/Wwwhome',
          views: {
            'tab_a': {
              controller: 'WwwhomeCtrl',
              templateUrl: 'views/tab_a/Wwwhome.html'

            }
          }
        })
        //我的
      .state('tab.my', {
        url: '/my',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/my.html',
            controller: 'myCtrl'
          }
        }
      })
      //一对一问答草稿箱
      //@author sjia  start
      .state('tab.DraftBox', {
        url: '/DraftBox',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/DraftBox.html',
            controller: 'DraftBoxCtrl'
          }
        }
      })
      //@author sjia  end

      // 我的文章
    //@author sjia  start
    .state('tab.MyArticle', {
      url: '/MyArticle',
      views: {
        'tab_d': {
          templateUrl: 'views/tab_d/MyArticle.html',
          controller: 'MyArticleCtrl'
        }
      }
    })
    //@author sjia  end

      // 我的文章编辑
      //@author sjia  start
      .state('tab.MyArticleEdit', {
        url: '/MyArticleEdit',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/MyArticleEdit.html',
            controller: 'MyArticleEditCtrl'
          }
        }
      })
      //@author sjia  end

      //文章内容编辑
      //@author sjia start
      .state('tab.MyArticleExtTxtEdit', {
        url: '/MyArticleExtTxtEdit/:id',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/MyArticleExtTxtEdit.html',
            controller: 'MyArticleExtTxtEditCtrl'
          }
        }
      })
      //@author sjia end

      //@author sjia start
      .state('tab.DraftEditQuestion', {
        url: '/DraftEditQuestion',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/DraftEditQuestion.html',
            controller: 'DraftEditCtrl'
          }
        }
      })
      //@author sjia end
      //@author sjia start
      .state('tab.DraftEditQuick', {
        url: '/DraftEditQuick',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/DraftEditQuick.html',
            controller: 'DraftEditCtrl'
          }
        }
      })
      //@author sjia end
      //@author sjia start
      .state('tab.DraftEditArticle', {
        url: '/DraftEditArticle',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/DraftEditArticle.html',
            controller: 'DraftEditCtrl'
          }
        }
      })
      //@author sjia end
      //关于我们
      .state('tab.aboutus', {
        url: '/aboutus',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/aboutus.html'
          }
        }
      })
      //客服电话
      .state('tab.waiterPhone', {
        url: '/waiterPhone',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/waiterPhone.html'
          }
        }
      })
      //二维码
      .state('tab.Qrcode', {
        url: '/Qrcode',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/Qrcode.html',
            controller: 'myCtrl'
          }
        }
      })
      //充值
      .state('tab.RechargeList', {
        url: '/RechargeList',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/RechargeList.html',
            controller: 'RechargeListCtrl'
          }
        }
      })
      //个人信息
      .state('tab.Editmember', {
        url: '/Editmember',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/Editmember.html',
            controller: 'myCtrl'

          }
        }
      })
      .state('tab.MemberRelationList', {
        url: '/MemberRelationList/:act',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/MemberRelationList.html',
            controller: 'MemberRelationListCtrl'

          }
        }
      })
      //修改密码
      .state('tab.User', {
        url: '/User/:id',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/User.html',
            controller: 'UserCtrl'
          }
        }
      })
      //专家列表
      .state('tab.expertList', {
        url: '/expertList',
        views: {
          'tab_b': {
            templateUrl: 'views/tab_b/expertList.html',
            controller: 'expertListCtrl'
          }
        }
      })
      //专家列表
      .state('tab.RB_expertList', {
        url: '/RB_expertList',
        views: {
          'tab_b': {
            templateUrl: 'views/tab_b/expertList.html',
            controller: 'expertListCtrl'
          }
        }
      })
      //专家详细
      .state('tab.expert', {
        url: '/expert/:id',
        views: {
          'tab_b': {
            templateUrl: 'views/tab_b/expert.html',
            controller: 'expertCtrl'
          }
        }
      })
      //向专家咨询问题，id为专家id
      .state('tab.QuestionEdit', {
        url: '/QuestionEdit/:id',
        views: {
          'tab_b': {
            templateUrl: 'views/tab_b/QuestionEdit.html',
            controller: 'QuestionEditCtrl'
          }
        }
      })
    //频道列表
    .state('tab.Articlechannel', {
      url: '/Articlechannel',
      views: {
        'tab_c': {
          templateUrl: 'views/tab_c/Articlechannel.html',
          controller: 'ArticlechannelCtrl'
        }
      }
    })
      //文章列表
      .state('tab.ArticleList', {
        url: '/ArticleList',
        views: {
          'tab_a': {
            templateUrl: 'views/tab_a/ArticleList.html',
            controller: 'ArticleListCtrl'
          }
        }
      })
      //文章内容
      .state('tab.ArticleExtTxt', {
        url: '/ArticleExtTxt/:id',
        views: {
          'tab_a': {
            templateUrl: 'views/tab_a/ArticleExtTxt.html',
            controller: 'ArticleExtTxtCtrl'
          }
        }
      })
    //频道列表
      .state('tab.questionQuAndAn', {
        url: '/questionQuAndAn/:act',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/questionQuAndAn.html',
            controller: 'questionQuAndAnCtrl'
          }
        }
      })
      //首页进入最新智答或者进入精选智答
      .state('tab.quAndAnWwwhome', {
        url: '/quAndAnWwwhome/:act',
        views: {
          'tab_a': {
            templateUrl: 'views/tab_a/quAndAnWwwhome.html',
            controller: 'quAndAnWwwhomeCtrl'
          }
        }
      })
      .state('tab.QuickListWwwhome', {
        url: '/QuickListWwwhome/:act',
        views: {
          'tab_a': {
            templateUrl: 'views/tab_a/QuickListWwwhome.html',
            controller: 'QuickListWwwhomeCtrl'
          }
        }
      })
      //我的悬赏问题列表
      .state('tab.QuickList', {
        url: '/QuickList/:act',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/QuickList.html',
            controller: 'QuickListCtrl'
          }
        }
      })
      //我的悬赏问题列表的答案
      .state('tab.QuickTxtList', {
        url: '/QuickTxtList/:id/:act/:priceeach',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/QuickTxtList.html',
            controller: 'QuickTxtListCtrl'
          }
        }
      })
    //频道列表
      .state('tab.questionAndQuick', {
        url: '/questionAndQuick/:id',
        views: {
          'tab_c': {
            templateUrl: 'views/tab_c/questionAndQuick.html',
            controller: 'questionAndQuickCtrl'
          }
        }
      })
      //我观看的问题
      .state('tab.QuestionLinkMemberView', {
        url: '/QuestionLinkMemberView/:act',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/QuestionLinkMemberView.html',
            controller: 'QuestionLinkMemberViewCtrl'
          }
        }
      })
      //分类问题及悬赏列表
      .state('tab.RC_questionAndQuick', {
        url: '/RC_questionAndQuick/:id',
        views: {
          'tab_c': {
            templateUrl: 'views/tab_c/questionAndQuick.html',
            controller: 'questionAndQuickCtrl'
          }
        }
      })
      //我观看的抢答
      .state('tab.QuickLinkMemberViewList', {
        url: '/QuickLinkMemberViewList',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/QuickLinkMemberViewList.html',
            controller: 'QuickLinkMemberViewListCtrl'
          }
        }
      })
      //我观看的抢答
      .state('tab.QuickEdit', {
        url: '/QuickEdit',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/QuickEdit.html',
            controller: 'QuickEditCtrl'
          }
        }
      })
    //频道列表详细
      .state('tab.RC_Article', {
        url: '/RC_Article/:id',
        views: {
          'tab_c': {
            templateUrl: 'views/tab_c/Article.html',
            controller: 'ArticleCtrl'
          }
        }
      })
      //专家类别
      .state('tab.RB_expert', {
        url: '/RB_expert/:id',
        views: {
          'tab_b': {
            templateUrl: 'views/tab_b/expert.html',
            controller: 'expertCtrl'
          }
        }
      })
      //发布文章
      .state('tab.ArticleCreate', {
        url: '/ArticleCreate',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/ArticleCreate.html',
            controller: 'ArticleCreateCtrl'
          }
        }
      })
      .state('tab.ArticleExtTxtEdit', {
        url: '/ArticleExtTxtEdit/:id',
        views: {
          'tab_d': {
            templateUrl: 'views/tab_d/ArticleExtTxtEdit.html',
            controller: 'ArticleExtTxtEditCtrl'
          }
        }
      })
        .state('tab.tc', {
            url: '/tc',
            views: {
                'tab_c': {
                    templateUrl: 'views/tab_c/tc.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.td', {
            url: '/td',
            views: {
                'tab_d': {
                    templateUrl: 'views/tab_d/td.html',
                    controller: 'pubCtrl'
                }
            }
        })
        .state('tab.login', {
            url: '/login',
            views: {
                'tab_d': {
                    templateUrl: 'views/test/td.html',
                    controller: 'pubCtrl'
                }
            }
        })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/Wwwhome');

});
