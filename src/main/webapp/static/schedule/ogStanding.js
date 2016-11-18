/**
 * Author: Xu Yu
 * Date: 13-8-2
 * Time: ÉÏÎç10:49
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/ogModel', ['require', 'backbone', 'globalConfig'], function (require) {
    require('backbone');
    var gConfig = require('globalConfig');

    var StandingDefault = Backbone.Model.extend({
        defaults: {
            sortBy: '',
            ascending: false,
            list: []
        },
        initialize: function () {

        },
        setSortType: function (type) {
            if (this.get('sortBy') == type) {
                this.set('ascending', !this.get('ascending'));
            } else {
                this.set('sortBy', type);
                this.set('ascending', false);
            }
            var list = this.get('list');
            if (this.get('ascending')) {
                list.sort(function (a, b) {
                    switch (type) {
                        case 'score':
                            return a['score'] - b['score'];
                            break;
                        case 'win':
                            return a['win'] - b['win'];
                            break;
                        case 'draw':
                            return a['draw'] - b['draw'];
                            break;
                        case 'lose':
                            return a['lose'] - b['lose'];
                            break;
                        case 'goal':
                            return a['goal'] - b['goal'];
                            break;
                        case 'losegoal':
                            return a['losegoal'] - b['losegoal'];
                            break;
                        case 'homegoal':
                            return a['home_goal'] - b['home_goal'];
                            break;
                        case 'awaygoal':
                            return a['away_goal'] - b['away_goal'];
                            break;
                    }
                })
            } else {
                list.sort(function (b, a) {
                    switch (type) {
                        case 'score':
                            return a['score'] - b['score'];
                            break;
                        case 'win':
                            return a['win'] - b['win'];
                            break;
                        case 'draw':
                            return a['draw'] - b['draw'];
                            break;
                        case 'lose':
                            return a['lose'] - b['lose'];
                            break;
                        case 'goal':
                            return a['goal'] - b['goal'];
                            break;
                        case 'losegoal':
                            return a['losegoal'] - b['losegoal'];
                            break;
                        case 'homegoal':
                            return a['home_goal'] - b['home_goal'];
                            break;
                        case 'awaygoal':
                            return a['away_goal'] - b['away_goal'];
                            break;
                    }
                })
            }
            this.trigger('list:change');
        }
    });
    return StandingDefault;
});
udvDefine('text!tpl/standingOg.html',[],function () { return '<div class="group"><%= group %>组</div>\r\n<div class="content">\r\n    <table>\r\n        <tr class="bg">\r\n            <th class="w60"><span>排名</span></th>\r\n            <th class="w220 alignLeft"><span class="ml35">球队</span></th>\r\n            <th class="w80"><span>场次</span></th>\r\n            <th class="w80 pointer" data-sort="score"><span>积分</span></th>\r\n            <th class="w80 pointer" data-sort="win"><span>胜</span></th>\r\n            <th class="w80 pointer" data-sort="draw"><span>平</span></th>\r\n            <th class="w80 pointer" data-sort="lose"><span>负</span></th>\r\n            <th class="w80 pointer" data-sort="goal"><span>进球</span></th>\r\n            <th class="w80 pointer" data-sort="losegoal"><span>失球</span></th>\r\n            <th class="w80 pointer" data-sort="homegoal"><span>主场进球</span></th>\r\n            <th class="w80 pointer" data-sort="awaygoal"><span>客场进球</span></th>\r\n        </tr>\r\n        <% _.each(list, function(obj, index){ %>\r\n            <tr>\r\n                <td class="pl1"><em><%= index+1 %></em></td>\r\n                <td class="alignLeft"><span class=" ml35"><img src="http://i3.sinaimg.cn/lf/sports/logo85/<%= obj.sl_id %>.png" height="20" width="20" alt="<%= obj.team_cn %>"/>&nbsp;<%= obj.team_cn %></span></td>\r\n                <td><%= obj.count %></td>\r\n                <td><%= obj.score %></td>\r\n                <td><%= obj.win %></td>\r\n                <td><%= obj.draw %></td>\r\n                <td><%= obj.lose %></td>\r\n                <td><%= obj.goal %></td>\r\n                <td><%= obj.losegoal %></td>\r\n                <td><%= obj.home_goal %></td>\r\n                <td><%= obj.away_goal %></td>\r\n            </tr>\r\n        <%})%>\r\n    </table>\r\n</div>';});

/**
 * Author: Xu Yu
 * Date: 13-8-2
 * Time: ÉÏÎç10:49
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ogView', ['require', 'backbone', 'util', 'globalConfig', 'text!tpl/standingOg.html'], function (require) {
    require('backbone');
    var util = require('util');
    var gConfig = require('globalConfig');
    var tpl = require('text!tpl/standingOg.html');
    var StandingDefalutView = Backbone.View.extend({
        tpl: _.template(tpl),
        events: {
            'click [data-sort]': 'sort'
        },
        initialize: function () {
            this.render();
            this.model.on('list:change', this.render, this);
        },
        render: function () {
            var data = this.model.toJSON();
            var className;
            if (data.ascending) {
                className = 'up';
            } else {
                className = 'down';
            }
            this.$el.html(this.tpl(data));
            this.$el.find('[data-sort="' + data.sortBy + '"] > span')
                .addClass(className);

            return this;
        },
        sort: function (e) {
            var target = util.$single(e.currentTarget);
            this.model.setSortType(target.attr('data-sort'));
        }
    });
    return StandingDefalutView;
});
/**
 * Author: Xu Yu
 * Date: 13-8-2
 * Time: ÉÏÎç10:50
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('ogStanding', ['require', '$', 'globalConfig', 'model/ogModel', 'view/ogView'], function (require) {
    require('$');
    var gConfig = require('globalConfig');
    var StandingModel = require('model/ogModel');
    var StandingView = require('view/ogView');

    function Main(config) {
        function processData(list) {
            var groupData = {};
            _.each(list, function (value, index) {
                var group = value.group;
                if (_.isUndefined(groupData[group])) {
                    groupData[group] = [value]
                } else {
                    groupData[group].push(value);
                }
            });

            var ctr = $("#" + config.ctrId);

            _.each(groupData, function (value, key) {
                var modelA = new StandingModel({
                    list: value,
                    group: key
                });
                modelA.setSortType('score');
                var viewA = new StandingView({
                    el: ctr.find('[data-group="' + key + '"]'),
                    model: modelA
                });
            });
            return list;
        }

        $.ajax({
            url: config.url,
            dataType: 'jsonp',
            cache: false,
            data: {
                app_key: gConfig.AppKey,
                type: config.type,
                season: config.season
            }
        }).done(function (data) {
            var result = data.result,
                status = result.status,
                resultData = result.data;
            if (status.code == 0) {
                processData(resultData);
            }
        })
    }

    return Main;
});