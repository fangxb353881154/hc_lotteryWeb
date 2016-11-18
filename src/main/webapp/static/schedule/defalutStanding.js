/**
 * Author: Xu Yu
 * Date: 13-8-1
 * Time: 上午11:41
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/StandingDefault', ['require', 'backbone', 'globalConfig'], function (require) {
    require('backbone');
    var gConfig = require('globalConfig');

    var StandingDefault = Backbone.Model.extend({
        defaults: {
            sortBy: 'win',
            ascending: false,
            list: []
        },
        initialize: function () {

        },
        setList: function (list) {
            this.set({list: list});
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
                        case 'conceded':
                            return a['losegoal'] - b['losegoal'];
                            break;
                        case 'goaldif':
                            return a['truegoal'] - b['truegoal'];
                            break;
                        case 'score':
                            return a['score'] - b['score'];
                            break;
                    }
                })
            } else {
                list.sort(function (b, a) {
                    switch (type) {
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
                        case 'conceded':
                            return a['losegoal'] - b['losegoal'];
                            break;
                        case 'goaldif':
                            return a['truegoal'] - b['truegoal'];
                            break;
                        case 'score':
                            return a['score'] - b['score'];
                            break;
                    }
                })
            }
            this.trigger('list:change');
        }
    });
    return StandingDefault;
});
udvDefine('text!tpl/standingDefault.html', [], function () {
    return '<table>\r\n    <tr class="bg">\r\n        <th class="w60"><span>排名</span></th>\r\n        <th class="w260 alignLeft"><span class="ml35">球队</span></th>\r\n        <th class="w85"><span>场次</span></th>\r\n        <th class="w85 pointer bg-eee" data-sort="score"><span>积分</span></th>\r\n        <th class="w85 pointer" data-sort="win"><span>胜</span></th>\r\n        <th class="w85 pointer" data-sort="draw"><span>平</span></th>\r\n        <th class="w85 pointer" data-sort="lose"><span>负</span></th>\r\n        <th class="w85 pointer" data-sort="goal"><span>进球</span></th>\r\n        <th class="w85 pointer" data-sort="conceded"><span>失球</span></th>\r\n        <th class="w85 pointer" data-sort="goaldif"><span>净胜球</span></th>\r\n    </tr>\r\n    <% _.each(list, function(obj, index){ %>\r\n            <tr>\r\n                <td class="pl1"><em><%= index+1 %></em></td>\r\n                <td class="alignLeft"><span class=" ml35"><img src="http://i2.sinaimg.cn/ty/opta/85/<%= obj.opta_id %>.png" height="20" width="20" alt="<%= obj.team_cn %>"/>&nbsp;<%= obj.team_cn %></span></td>\r\n                <td><%= obj.count %></td>\r\n                <td class="bg-eee"><%= obj.score %></td>\r\n                <td><%= obj.win %></td>\r\n                <td><%= obj.draw %></td>\r\n                <td><%= obj.lose %></td>\r\n                <td><%= obj.goal %></td>\r\n                <td><%= obj.losegoal %></td>\r\n                <td><%= obj.truegoal %></td>\r\n\r\n            </tr>\r\n    <%})%>\r\n</table>';
});

/**
 * Author: Xu Yu
 * Date: 13-8-1
 * Time: 上午11:02
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/StandingDefault', ['require', 'backbone', 'util', 'globalConfig', 'text!tpl/standingDefault.html'], function (require) {
    require('backbone');
    var util = require('util');
    var gConfig = require('globalConfig');
    var tpl = require('text!tpl/standingDefault.html');
    var StandingDefalutView = Backbone.View.extend({
        tpl: _.template(tpl),
        events: {
            'click [data-sort]': 'sort'
        },
        initialize: function () {
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

            var reg = /color(\d+)/;
            var emList = this.$el.find('em');
            _.each(data.config, function (value, index) {
                var result, i;
                result = reg.exec(index);
                if (result != null) {
                    i = result[1] - 1;
                    util.$single(emList[i]).addClass(value);
                }
            });
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
 * Date: 13-8-1
 * Time: 下午1:36
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('defalutStanding', ['require', '$', 'globalConfig', 'model/StandingDefault', 'view/StandingDefault'], function (require) {
    require('$');
    var gConfig = require('globalConfig');
    var StandingModel = require('model/StandingDefault');
    var StandingView = require('view/StandingDefault');

    function Main(config) {
        $.ajax({
            url: 'http://platform.sina.com.cn/sports_all/client_api?_sport_t_=football&_sport_s_=opta&_sport_a_=teamOrder&use_type=group',
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
                resultData = result.data[''];
            if (status.code == 0) {
                var model = new StandingModel({
                    list: resultData,
                    config: config
                });
                var view = new StandingView({
                    el: $("#" + config.ctrId),
                    model: model
                });
                view.render();
            }
        })
    }

    return Main;
});