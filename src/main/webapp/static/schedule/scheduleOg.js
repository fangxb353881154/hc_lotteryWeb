
udvDefine('text!tpl/scheduleOgCtrl.html',['require','globalConfig'],function () { return '<div class="nav-status udv-clearfix">\r\n    <div class="ns-left">\r\n        <p>小组赛</p>\r\n        <div class="rounds">\r\n            <span>\r\n                <ul class="udv-clearfix">\r\n                    <li data-group="1">第1轮<i></i></li>\r\n                    <li data-group="2">第2轮<i></i></li>\r\n                    <li data-group="3">第3轮<i></i></li>\r\n                    <li data-group="4">第4轮<i></i></li>\r\n                    <li data-group="5">第5轮<i></i></li>\r\n                    <li data-group="6">第6轮<i></i></li>\r\n                </ul>\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class="ns-middle">\r\n        <p>淘汰赛</p>\r\n        <div class="rounds">\r\n            <span>\r\n               <ul class="udv-clearfix">\r\n                   <li data-playoff="7-8">1/8决赛<i></i></li>\r\n                   <li data-playoff="9-10">1/4决赛<i></i></li>\r\n                   <li data-half="11-12">半决赛<i></i></li>\r\n               </ul>\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div class="ns-right" data-final="13">\r\n        决赛\r\n    </div>\r\n</div>';});

/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午3:04
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/ogSheduleGroupModel',['require','backbone','globalConfig'],function(require){
    require('backbone');
    var gConfig=require('globalConfig');
    var api='http://platform.sina.com.cn/sports_all/client_api?_sport_t_=livecast&_sport_a_=groupMatchesByType&type=10&use_type=group';

    var Model=Backbone.Model.extend({
        defaults:{
//            type: 10,
            rnd:1,
            season: 2012,
            list:[]
        },
        initialize:function(){

        },
        fetch:function(){
            var that=this;
            $.ajax({
                url: api,
                dataType:'jsonp',
                cache: false,
                data:{
                    app_key: gConfig.AppKey,
                    rnd: that.get('rnd'),
                    season: that.get('season')
                }
            }).done(function(data){
                var result=data.result,
                    status=result.status,
                    resultData=result.data;
                if(status.code==0){
                    that.set('list', resultData);
                    that.trigger('list:change');
                }
            })
        }
    });
    return Model;
});
udvDefine('text!tpl/scheduleOgGroup.html',[],function () { return '<div class="group-ctr">\r\n    <div class="group-ctr-in udv-clearfix">\r\n        <% _.each(list, function(value, key){ %>\r\n            <div class="group-box udv-clearfix">\r\n                <div class="group-name">\r\n                    <table>\r\n                        <tr>\r\n                            <td><%= key %>组</td>\r\n                        </tr>\r\n                    </table>\r\n                </div>\r\n                <div class="group-team">\r\n                    <div class="up">\r\n                        <%= _helper.genSingleMatch(value[0]) %>\r\n                    </div>\r\n                    <div class="down">\r\n                        <%= _helper.genSingleMatch(value[1]) %>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        <% }) %>\r\n    </div>\r\n</div>';});

udvDefine('text!tpl/scheduleOgSingleMatch.html',[],function () { return '<p class="time"><%= date %> <%= getDay(date) %> <%= time %></p>\r\n<p class="team"><img src="<%= Flag1_small %>" height="20" width="20" alt="<%= Team1 %>"/>&nbsp;<%= Team1 %><span><%= getScore(status, Score1) %></span></p>\r\n<p class="team"><img src="<%= Flag2_small %>" height="20" width="20" alt="<%= Team2 %>"/>&nbsp;<%= Team2 %><span><%= getScore(status, Score2) %></span></p>\r\n';});

/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午3:04
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ogSheduleGroupView',['require','backbone','templateHelper','util','globalConfig','text!tpl/scheduleOgGroup.html','text!tpl/scheduleOgSingleMatch.html'],function(require){
    require('backbone');
    require('templateHelper');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/scheduleOgGroup.html');
    var singleMatchTpl=require('text!tpl/scheduleOgSingleMatch.html');
    var helper={
        genSingleMatch: _.template(singleMatchTpl)
    };
    var View=Backbone.View.extend({
        tpl: _.template(tpl),
        events:{
        },
        initialize:function(){
            this.model.on('list:change',this.render, this);
        },
        render:function(){
            var data=this.model.toJSON();
            _.extend(data,{_helper: helper});
            this.$el.html(this.tpl(data));
            return this;
        }
    });
    return View;
});
/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午5:26
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/ogShedulePlayoffModel',['require','backbone','globalConfig'],function(require){
    require('backbone');
    var gConfig=require('globalConfig');
    var api='http://platform.sina.com.cn/sports_all/client_api?_sport_t_=livecast&_sport_a_=matchesByType&type=10';

    var tempData={};
    var Model=Backbone.Model.extend({
        defaults:{
//            type: 10,
            rnd:1,
            season: 2012,
            list:[]
        },
        initialize:function(){

        },
        fetch:function(){
            var that=this;
            var rnd=this.get('rnd');
            var rnds=(rnd.toString()).split('-');
            var combine= _.after(rnds.length, that.combineData);
            _.each(rnds, function(rnd){
                $.ajax({
                    url: api,
                    dataType:'jsonp',
                    cache: false,
                    data:{
                        app_key: gConfig.AppKey,
                        rnd: rnd,
                        season: that.get('season')
                    }
                }).done(function(data){
                    var result=data.result,
                        status=result.status,
                        resultData=result.data;
                    if(status.code==0){
                        tempData[rnd]=resultData;
                        combine.call(that);
                    }
                })
            });
        },
        combineData:function(){
            var rnd=this.get('rnd');
            var rnds=(rnd.toString()).split('-');
            var arr;
            var data=[];
            var temp,temp1,temp2, tResult;
            for(var i= 0,len=tempData[rnds[0]].length;i<len;i++){
                arr=[];
                if(rnds.length>1){
                    temp1=tempData[rnds[0]];
                    temp2=tempData[rnds[1]];
                    temp=temp1[i];
                    arr.push(temp);
                    tResult=this.match(temp, temp2);
                    if(tResult){
                        arr.push(tResult[0]);
                    }
                }else if(rnds.length==1){
                    temp1=tempData[rnds[0]];
                    temp=temp1[i];
                    arr.push(temp);
                }
                data.push(arr);
            }
            if(data.length==0){
                this.trigger('showEmpty');
            }else{
                this.set('list', data);
                this.trigger('list:change');
            }
        },
        match:function(obj, arr){
            var foundIndex=-1;
            _.every(arr, function(item, index){
                var key1=obj.Team1Id;
                if(key1==item.Team1Id||key1==item.Team2Id){
                    foundIndex=index;
                    return false;
                }else{
                    return true;
                }
            });
            if(foundIndex>-1){
                return arr.splice(foundIndex, 1);
            }else{
                return null;
            }
        }
    });
    return Model;
});
udvDefine('text!tpl/scheduleOgPlayoff.html',[],function () { return '<div class="playoff-ctr">\r\n    <div class="playoff-ctr-in">\r\n        <% _.each(list, function(value){ %>\r\n            <div class="playoff-box1">\r\n                <div class="playoff-team">\r\n                    <div class="up">\r\n                        <%= _helper.genSingleMatch(value[0]) %>\r\n                    </div>\r\n                    <div class="down">\r\n                        <%= _helper.genSingleMatch(value[1]) %>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        <% }) %>\r\n    </div>\r\n</div>';});

/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午5:36
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ogShedulePlayoffView',['require','backbone','templateHelper','util','globalConfig','text!tpl/scheduleOgPlayoff.html','text!tpl/scheduleOgSingleMatch.html'],function(require){
    require('backbone');
    require('templateHelper');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/scheduleOgPlayoff.html');
    var singleMatchTpl=require('text!tpl/scheduleOgSingleMatch.html');
    var helper={
        genSingleMatch: _.template(singleMatchTpl)
    };
    var View=Backbone.View.extend({
        tpl: _.template(tpl),
        helper: helper,
        events:{
        },
        initialize:function(){
            this.model.on('list:change',this.render, this);
            this.model.on('showEmpty',this.showEmpty, this);
        },
        render:function(){
            var data=this.model.toJSON();
            _.extend(data,{_helper: this.helper});
            this.$el.html(this.tpl(data));
            return this;
        },
        showEmpty:function(){
            this.$el.html('<div style="text-align: center;color: #ff0000;font-size: 14px;padding: 15px 0;">尚未确定分组信息。</div>')
        }
    });
    return View;
});
udvDefine('text!tpl/sheduleOgHalf.html',[],function () { return '<div class="playoff-ctr">\r\n    <div class="playoff-ctr-in">\r\n        <% _.each(list, function(value, key){ %>\r\n            <div class="playoff-box2">\r\n                <div class="playoff-team">\r\n                    <div class="up">\r\n                        <%= _helper.genSingleMatch(value[0]) %>\r\n                    </div>\r\n                    <div class="down">\r\n                        <%= _helper.genSingleMatch(value[1]) %>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        <% }) %>\r\n    </div>\r\n</div>';});

udvDefine('text!tpl/scheduleOgSingleHalf.html',[],function () { return '<p class="time"><%= date %> <%= getDay(date) %> <%= time %></p>\r\n<p class="team"><img src="<%= Flag1_small %>" height="20" width="20" alt="<%= Team1 %>"/>&nbsp;<%= Team1 %>&nbsp;<span><%= getScore(status, Score1) %></span><i>-</i><span><%= getScore(status, Score2) %></span>&nbsp;<%= Team2 %>&nbsp;<img src="<%= Flag2_small %>" height="20" width="20" alt="<%= Team2 %>"/></p>\r\n';});

/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午6:31
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ogSheduleHalfView',['require','backbone','templateHelper','util','globalConfig','text!tpl/sheduleOgHalf.html','text!tpl/scheduleOgSingleHalf.html','view/ogShedulePlayoffView'],function(require){
    require('backbone');
    require('templateHelper');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/sheduleOgHalf.html');
    var singleMatchTpl=require('text!tpl/scheduleOgSingleHalf.html');
    var baseView=require('view/ogShedulePlayoffView');

    var helper={
        genSingleMatch: _.template(singleMatchTpl)
    };
    var View=baseView.extend({
        tpl: _.template(tpl),
        helper: helper
    });
    return View;
});
udvDefine('text!tpl/sheduleOgFinal.html',[],function () { return '<div class="playoff-ctr">\r\n    <div class="playoff-ctr-in">\r\n        <div class="playoff-box3">\r\n            <% _.each(list, function(value, key){ %>\r\n                <div class="playoff-team">\r\n                    <div class="down">\r\n                        <%= _helper.genSingleMatch(value[0]) %>\r\n                    </div>\r\n                </div>\r\n            <% }) %>\r\n        </div>\r\n    </div>\r\n</div>';});

/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午6:31
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ogSheduleFinalView',['require','backbone','templateHelper','util','globalConfig','text!tpl/sheduleOgFinal.html','text!tpl/scheduleOgSingleHalf.html','view/ogShedulePlayoffView'],function(require){
    require('backbone');
    require('templateHelper');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/sheduleOgFinal.html');
    var singleMatchTpl=require('text!tpl/scheduleOgSingleHalf.html');
    var baseView=require('view/ogShedulePlayoffView');

    var helper={
        genSingleMatch: _.template(singleMatchTpl)
    };
    var View=baseView.extend({
        tpl: _.template(tpl),
        helper: helper
    });
    return View;
});
/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 上午11:30
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/scheduleOgCtrl',['require','backbone','util','globalConfig','text!tpl/scheduleOgCtrl.html','model/ogSheduleGroupModel','view/ogSheduleGroupView','model/ogShedulePlayoffModel','view/ogShedulePlayoffView','view/ogSheduleHalfView','view/ogSheduleFinalView'],function(require){
    require('backbone');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/scheduleOgCtrl.html');

    var GroupModel=require('model/ogSheduleGroupModel');
    var GroupView=require('view/ogSheduleGroupView');
    var PlayoffModel=require('model/ogShedulePlayoffModel');
    var PlayoffView=require('view/ogShedulePlayoffView');
    var HalfView=require('view/ogSheduleHalfView');
    var FinalView=require('view/ogSheduleFinalView');

    var StandingDefalutView=Backbone.View.extend({
        events:{
            'click [data-group]':'getGroup',
            'click [data-playoff]': 'getPlayoff',
            'click [data-half]': 'getHalf',
            'click [data-final]': 'getFinal'
        },
        initialize:function(){
            var args = this.options.initArgs,
                dataType = args.attrType,
                rnd = args.attrVal,
                model;
            this.destroyCurrentView();
            this.render();
            if(dataType == 'data-group'){
                model=new GroupModel({
                    rnd: rnd,
                    season: this.options.season
                });
                this.cView=new GroupView({
                    model: model
                });
            } else if(dataType == 'data-playoff'){
                model=new PlayoffModel({
                    rnd: rnd,
                    season: this.options.season
                });
                this.cView=new PlayoffView({
                    model: model
                });
            } else if(dataType == 'data-half'){
                model=new PlayoffModel({
                    rnd: rnd,
                    season: this.options.season
                });
                this.cView=new HalfView({
                    model: model
                });
            } else{
                model=new PlayoffModel({
                    rnd: rnd,
                    season: this.options.season
                });
                this.cView=new FinalView({
                    model: model
                });
            }
            $("#schedule").append(this.cView.$el);
            model.fetch();
        },
        render:function(){
            var args = this.options.initArgs;
            this.$el.html(tpl);
            this.$el.find('.nav-status').addClass('nav-' + args.sta);
            this.$el.find('[' + args.attrType + '=' + args.attrVal + ']').addClass('current');
            return this;
        },
        getGroup:function(e){
            this.destroyCurrentView();
            this.switchStatus('status1');
            var $cTarget=$(e.currentTarget);
            $cTarget.addClass('current');
            var rnd=$cTarget.attr('data-group');
            this.getGroupMatch(rnd);
        },
        getGroupMatch:function(rnd){
            var model=new GroupModel({
                rnd: rnd,
                season: this.options.season
            });
            this.cView=new GroupView({
                model: model
            });
            $("#schedule").append(this.cView.$el);
            model.fetch();
        },
        getPlayoff:function(e){
            this.destroyCurrentView();
            this.switchStatus('status2');
            var $cTarget=$(e.currentTarget);
            $cTarget.addClass('current');
            var rnd=$cTarget.attr('data-playoff');
            var model=new PlayoffModel({
                rnd: rnd,
                season: this.options.season
            });
            this.cView=new PlayoffView({
                model: model
            });
            $("#schedule").append(this.cView.$el);
            model.fetch();
        },
        getHalf:function(e){
            this.destroyCurrentView();
            this.switchStatus('status2');
            var $cTarget=$(e.currentTarget);
            $cTarget.addClass('current');
            var rnd=$cTarget.attr('data-half');
            var model=new PlayoffModel({
                rnd: rnd,
                season: this.options.season
            });
            this.cView=new HalfView({
                model: model
            });
            $("#schedule").append(this.cView.$el);
            model.fetch();
        },
        getFinal:function(e){
            this.destroyCurrentView();
            this.switchStatus('status3');
            var $cTarget=$(e.currentTarget);
            $cTarget.addClass('current');
            var rnd=$cTarget.attr('data-final');
            var model=new PlayoffModel({
                rnd: rnd,
                season: this.options.season
            });
            this.cView=new FinalView({
                model: model
            });
            $("#schedule").append(this.cView.$el);
            model.fetch();
        },
        destroyCurrentView:function(){
            if(this.cView){
                this.cView.remove();
                this.cView=null;
            }
            this.$el.find('.current').removeClass('current');
        },
        switchStatus:function(status){
            var $ctr=this.$el.find('.nav-status');
            $ctr[0].className = $ctr[0].className.replace(/status\d/, status);
        }
    });
    return StandingDefalutView;
});
/**
 * Author: Xu Yu
 * Date: 13-9-11
 * Time: 下午3:01
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('scheduleOg',['require','$','globalConfig','view/scheduleOgCtrl'],function(require){
    require('$');
    var gConfig=require('globalConfig');

    var Controller=require('view/scheduleOgCtrl');

    function Main(config){
        var api = 'http://platform.sina.com.cn/sports_all/client_api?app_key=' + gConfig.AppKey + '&_sport_t_=football&_sport_s_=opta&_sport_a_=getLeaguesInfo&type=10';
        $.ajax({
            url: api,
            dataType:'jsonp'
        }).done(function(data){
            var result=data.result,
                status=result.status,
                resultData=result.data,
                args = {};
            if(status.code==0){
                var curLeague = resultData.current_league,
                    curRnd = resultData.cur_rnd;
                if(curLeague == config.season){
                    if(curRnd >= 1 && curRnd <= 6){
                        args.sta = 'status1';
                        args.attrType = 'data-group';
                        args.attrVal = curRnd;
                    } else if(curRnd >= 7 && curRnd <= 10){
                        args.sta = 'status2';
                        args.attrType = 'data-playoff';
                        if(curRnd == 7 || curRnd == 8){
                            args.attrVal = '7-8';
                        } else{
                            args.attrVal = '9-10';
                        }
                    } else if(curRnd >= 11 && curRnd <= 12){
                        args.sta = 'status2';
                        args.attrType = 'data-half';
                        args.attrVal = '11-12';
                    } else if(curRnd == 13){
                        args.sta = 'status3';
                        args.attrType = 'data-final';
                        args.attrVal = 13;
                    }
                } else{
                    args.sta = 'status1';
                    args.attrType = 'data-group';
                    args.attrVal = 1;
                }
                if(!window.ctrl){
                    window.ctrl=new Controller({
                        el: $("#status-ctr"),
                        initArgs: args,
                        season: config.season
                    });
                } else{
                    window.ctrl.options.initArgs = args;
                    window.ctrl.options.season = config.season;
                    window.ctrl.initialize();
                }
            }
        })
    }

    return Main;
});