/**
 * Author: Xu Yu
 * Date: 13-8-1
 * Time: 下午6:30
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('model/ShooterModel', ['require', 'backbone', 'globalConfig'], function (require) {
    require('backbone');
    var gConfig = require('globalConfig');

    var StandingDefault = Backbone.Model.extend({
        defaults: {
            sortBy: 'score',
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
                            return a['item1'] - b['item1'];
                            break;
                        case 'point':
                            return a['item2'] - b['item2'];
                            break;
                        case 'master':
                            return a['item3'] - b['item3'];
                            break;
                        case 'guest':
                            return a['item4'] - b['item4'];
                            break;
                    }
                })
            } else {
                list.sort(function (b, a) {
                    switch (type) {
                        case 'score':
                            return a['item1'] - b['item1'];
                            break;
                        case 'point':
                            return a['item2'] - b['item2'];
                            break;
                        case 'master':
                            return a['item3'] - b['item3'];
                            break;
                        case 'guest':
                            return a['item4'] - b['item4'];
                            break;
                    }
                })
            }
            this.trigger('list:change');
        }
    });
    return StandingDefault;
});
udvDefine('text!tpl/shooter.html', [], function () {
    return '<table>\r\n    <tr class="bg">\r\n        <th class="w60">排名</th>\r\n        <th class="w200">球员</th>\r\n        <th class="w200">球队</th>\r\n        <th class="w125 pointer" data-sort="score"><span>总进球数</span></th>\r\n        <th class="w125 pointer" data-sort="point"><span>普通进球</span></th>\r\n        <th class="w125 pointer" data-sort="master"><span>点球</span></th>\r\n        <th class="w125"><span>乌龙球</span></th>\r\n    </tr>\r\n    <% _.each(list, function(obj, index){ %>\r\n        <tr>\r\n            <td><%= index+1 %></td>\r\n            <td><%= obj.player_name %></td>\r\n            <td><%= obj.team_name %></td>\r\n            <td><%= obj.item1 %></td>\r\n            <td><%= obj.item2 %></td>\r\n            <td><%= obj.item3 %></td>\r\n            <td><%= obj.item4==0?\'\':obj.item4 %></td>\r\n        </tr>\r\n    <%})%>\r\n</table>';
});

/**
 * Author: Xu Yu
 * Date: 13-8-1
 * Time: 下午5:27
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('view/ShooterView', ['require', 'backbone', 'util', 'globalConfig', 'text!tpl/shooter.html'], function (require) {
    require('backbone');
    var util = require('util');
    var gConfig = require('globalConfig');
    var tpl = require('text!tpl/shooter.html');
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

            if (this.model.get('list').length > 20) {
                this.$el.css({
                    height: 800,
                    overflowY: 'scroll'
                });
            }
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
 * Time: 下午6:24
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine('shooterStanding', ['require', '$', 'globalConfig', 'model/ShooterModel', 'view/ShooterView'], function (require) {
    require('$');
    var gConfig = require('globalConfig');
    var StandingModel = require('model/ShooterModel');
    var StandingView = require('view/ShooterView');

    function Main(config) {
        $.ajax({
            url: 'http://platform.sina.com.cn/sports_all/client_api?_sport_t_=football&_sport_s_=opta&_sport_a_=playerorder&item=13',
            dataType: 'jsonp',
            cache: false,
            data: {
                app_key: gConfig.AppKey,
                type: config.type,
                season: config.season,
                limit: 50
            }
        }).done(function (data) {
            var result = data.result,
                status = result.status,
                resultData = result.data;
            if (status.code == 0) {
                var model = new StandingModel({
                    list: resultData
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