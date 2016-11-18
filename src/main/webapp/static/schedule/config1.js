/**
 * Author: Xu Yu
 * Date: 13-6-4
 * Time: ÉÏÎç11:20
 * Email: xuyu2@staff.sina.com.cn
 */
(function () {
    var base = '/static/schedule/';
    requirejs.config({
        baseUrl: '/static/schedule/',
        paths: {
            '$': '/static/jquery/jquery-1.9.1.min',
            'backbone': 'backbone-min',
            'shooterStanding': '/static/schedule/shooterStanding',
            'ogStanding': '/static/schedule/ogStanding',
            'scheduleDefault': '/static/schedule/scheduleDefault',
            'defalutStanding': '/static/schedule/defalutStanding',
            'scheduleOg':'/static/schedule/scheduleOg'
        },
        config: {
            step: {
            }
        },
        shim: {
            'placeholder': {
                deps: ['$'],
                exports: '$'
            },
            'autocomplete': {
                deps: ['$'],
                exports: '$'
            },
            'backbone': {
                deps: ['underscore', '$'],
                exports: 'Backbone'
            },
            'templateHelper': {
                deps: ['underscore']
            },
            'libs':{
                deps:['$']
            }
        }
    });
})();