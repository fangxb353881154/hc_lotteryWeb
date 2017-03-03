
/**
 * Author: Xu Yu
 * Date: 13-8-5
 * Time: 下午6:20
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/roundItem',['require','backbone','globalConfig'],function(require){
    require('backbone');

    var gConfig=require('globalConfig');
    var urls={
        matchUrl:'http://platform.sina.com.cn/sports_all/client_api?_sport_t_=livecast&_sport_a_=matchesByType'//type, rnd
    };

    var roundItem=Backbone.Model.extend({
        defaults:{
            round:0,
            list:[],
            updateTime:0,
            interval:60*1000,//millisecond
            initialized:false
        },
        initialize:function(){
//            this.getData();
        },
        getData:function(){
            var that=this;
            if(!this.get('initialized')||this.isOutDated()){//获取新数据
                $.ajax({
                    url:urls.matchUrl,
                    dataType:'jsonp',
                    cache:false,
                    data:{
                        app_key: gConfig.AppKey,
                        type:that.get('type'),
                        rnd: that.get('round'),
                        season: that.get('season')
                    }
                }).done(function(data){
                    var result=data.result,
                        status=result.status,
                        resultData=result.data;
                    if(status.code==0){
                        that.set('list', resultData);
                        that.set('updateTime', new Date().getTime());
                        that.set('initialized', true);
                        that.trigger('list:change');
                    }
                });
            }else{
                this.trigger('list:change');//直接更新
            }
        },
        isOutDated:function(){
            var now=new Date();
            var timeElapsed=now-this.get('updateTime');
            return timeElapsed > this.get('interval');
        }
    });
    return roundItem;
});
udvDefine('text!tpl/roundItems.html',[],function () { return '<div class="schedule-round">\r\n    ' +
    '<div class="current" style="float: left;"><span>第<%= round %>轮</span><i></i></div>\r\n    ' +
    '<div class="advert" style="float: right"><IFRAME src="/hk6.html" frameborder="0" scrolling="NO" width="551" height="35" target="_blank"></IFRAME></div>' +
    '<div class="sr-ctr">\r\n        <div class="sr-ctr-in udv-clearfix">\r\n        <% _.each(list, function(value, index){ %>\r\n            <div class="sr-box">\r\n                <div class="up">\r\n                    <p class="time"><%= value.date %> <%= getDay(value.date) %> <%= value.time %></p>\r\n                    <p class="team"><img src="<%= value.Flag1_small %>" height="20" width="20" alt="<%= value.Team1 %>"/>&nbsp;<%= value.Team1 %><span><%= getScore(value.status, value.Score1) %></span></p>\r\n                    <p class="team"><img src="<%= value.Flag2_small %>" height="20" width="20" alt="<%= value.Team2 %>"/>&nbsp;<%= value.Team2 %><span><%= getScore(value.status, value.Score2) %></span></p>\r\n                </div>\r\n                <div class="down">\r\n     </div>\r\n            </div>\r\n        <% }) %>\r\n        </div>\r\n    </div>\r\n' +
    '</div>\r\n';
});

/**
 * Author: Xu Yu
 * Date: 13-8-5
 * Time: 下午6:21
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/roundItem',['require','backbone','templateHelper','util','globalConfig','text!tpl/roundItems.html'],function(require){
    require('backbone');
    require('templateHelper');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/roundItems.html');

    var roundView=Backbone.View.extend({
        tpl: _.template(tpl),
        events:{ },
        initialize:function(){
            this.listenTo(this.model, 'list:change', this.render);
        },
        render:function(){
            var data=this.model.toJSON();
            this.$el.html(this.tpl(data));
            return this;
        }
    });
    return roundView;
});
/**
 * Author: Xu Yu
 * Date: 13-8-5
 * Time: 下午4:48
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/roundModel',['require','backbone','globalConfig','model/roundItem','view/roundItem'],function(require){
    require('backbone');

    var gConfig=require('globalConfig');

    var RoundItemModel=require('model/roundItem');
    var RoundItemView=require('view/roundItem');

    var roundModel=Backbone.Model.extend({
        defaults:{
            length:0,
            // curSeason: 0,
            current:0,
            viewList:{},
            type:-1
        },
        initialize:function(){

        },
        viewRound:function(index){
            index=index>>0;
            var tempSeason = this.get('season');
            // this.set('curSeason', tempSeason);
            this.set('current', index);
            var list=this.get('viewList');
//            this.destoryRound(tempSeason, this.get('current'));
            if(_.isUndefined(list[tempSeason]) || _.isUndefined(list[tempSeason][index])){
                var model=new RoundItemModel({
                    round: index+1,
                    type: this.get('type'),
                    season: tempSeason
                });
                if(_.isUndefined(list[tempSeason])){
                    list[tempSeason] = [];
                }
                list[tempSeason][index]=new RoundItemView({
                    model: model,
                    el: $("#roundCtr")
                });
                model.getData();
            }else{
                list[tempSeason][index].model.getData();
            }
        },
        destoryRound:function(season, index){
            var list=this.get('viewList');
            if(!_.isUndefined(list[season][index])){
                list[season][index].remove();
            }
        }
    });
    return roundModel;
});
udvDefine('text!tpl/roundList.html',[],function () { return '<div class="schedule-nav udv-clearfix">\r\n    <div class="sn-title">\r\n        <table>\r\n            <tr>\r\n                <td>轮次</td>\r\n            </tr>\r\n        </table>\r\n    </div>\r\n    <div class="sn-list">\r\n        <ul class="udv-clearfix">\r\n            <% _.each(_.range(length), function(value, index){ %>\r\n            <li data-round="<%= value %>"><%= value+1 %></li>\r\n            <% }) %>\r\n        </ul>\r\n    </div>\r\n</div>';});

/**
 * Author: Xu Yu
 * Date: 13-8-5
 * Time: 下午4:49
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/roundView',['require','backbone','util','globalConfig','text!tpl/roundList.html'],function(require){
    require('backbone');
    var util=require('util');
    var gConfig=require('globalConfig');
    var tpl=require('text!tpl/roundList.html');

    var roundView=Backbone.View.extend({
        tpl: _.template(tpl),
        events:{
            'click [data-round]':'viewRound'
        },
        initialize:function(){
            this.listenTo(this.model, 'change', this.render);
            this.render();
            this.model.viewRound(this.model.get('current'));
        },
        render:function(){
            var data=this.model.toJSON();
            this.$el.html(this.tpl(data));
            this.$el.find('[data-round="'+data.current+'"]')
                .addClass('current');
            return this;
        },
        viewRound:function(e){
            var target= util.$single(e.currentTarget);
            this.model.viewRound(target.attr('data-round'));
        }
    });
    return roundView;
});
/**
 * Author: Xu Yu
 * Date: 13-8-5
 * Time: 下午4:47
 * Email: xuyu2@staff.sina.com.cn
 */
/**
 * step1: get round info, initialize view
 * step2: get match list
 */

udvDefine('scheduleDefault',['require','$','globalConfig','model/roundModel','view/roundView'],function(require){
    require('$');
    var gConfig=require('globalConfig');
    var urls={
        roundUrl:'http://platform.sina.com.cn/sports_all/client_api?_sport_t_=Intlfootball&_sport_a_=getLeaguesInfo'
    };

    var RoundModel=require('model/roundModel');
    var RoundView=require('view/roundView');

    function Main(config){
        var roundModel;

        $.ajax({
            url:urls.roundUrl,
            dataType:'jsonp',
            cache:false,
            data:{
                app_key: gConfig.AppKey
            }
        }).done(function(data){
            var result=data.result,
                status=result.status,
                resultData=result.data;
            if(status.code==0){
                var roundData=resultData[config.type];
                if(roundData==undefined){alert('赛事类型无效');return;}
                var args = {
                    length: roundData.max_rnd >> 0,
                    type:config.type,
                    season:config.season
                }
                if(roundData.current_league == config.season){
                    args.current = (roundData.cur_rnd >> 0) - 1
                } else{
                    args.current = 0;
                }
                roundModel=new RoundModel(args);
                if(!window.roundView){
                    window.roundView=new RoundView({
                        el: $("#navCtr"),
                        model: roundModel
                    });
                } else{
                    window.roundView.model = roundModel;
                    window.roundView.initialize();
                }
            }
        })
    }

    return Main;
});