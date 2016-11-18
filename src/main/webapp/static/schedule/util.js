/**
 * Author: Xu Yu
 * Email: xuyu2@staff.sina.com.cn
 * Date: 13-1-21
 * Time: 上午11:59
 * LastUpdate: 2013年4月8日17:44:16
 */
udvDefine(function(require){
    require('$');
    var expose={};

    var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
    function sub(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return typeof (o[key]) == 'undefined' ? match : o[key];
        }) : s;
    }

    (function(){
        function compareNode(nodeA,nodeB){
            nodeA=$(nodeA);
            nodeB=$(nodeB);
            return nodeA.height()-nodeB.height();
        }

        function sortNodeList(list){
            return Array.prototype.sort.call(list, compareNode);
        }

        expose.sortNodeList=sortNodeList;
    })();

    var $single=(function(){
        var collection=$([1]);
        return function(element){
            collection[0]=element;
            return collection;
        }
    })();

    return {
        sub: sub,
        sortNodeList:expose.sortNodeList,
        $single:$single
    }
});