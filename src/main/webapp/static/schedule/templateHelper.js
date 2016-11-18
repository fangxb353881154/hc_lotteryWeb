/**
 * Author: Xu Yu
 * Date: 13-8-6
 * Time: 下午6:18
 * Email: xuyu2@staff.sina.com.cn
 */
udvDefine(function(){
    var originalUnderscoreTemplateFunction = _.template;
    var templateHelpers = {};

    _.mixin( {
        addTemplateHelpers : function( newHelpers ) {
            _.extend( templateHelpers, newHelpers );
        },

        template : function( text, data, settings ) {
            // replace the built in _.template function with one that supports the addTemplateHelpers
            // function above. Basically the combo of the addTemplateHelpers function and this new
            // template function allows us to mix in global "helpers" to the data objects passed
            // to all our templates when they render. This replacement template function just wraps
            // the original _.template function, so it sould be pretty break-resistent moving forward.

            if( data ) {
                // if data is supplied, the original _.template function just returns the raw value of the
                // render function (the final rentered html/text). So in this case we just extend
                // the data param with our templateHelpers and return raw value as well.

                _.defaults( data, templateHelpers ); // extend data with our helper functions
                return originalUnderscoreTemplateFunction.apply( this, arguments ); // pass the buck to the original _.template function
            }

            var template = originalUnderscoreTemplateFunction.apply( this, arguments );

            var wrappedTemplate = function( data ) {
                data = _.defaults( {}, data, templateHelpers );
                return template.call( this, data );
            };

            return wrappedTemplate;
        }
    } );

    _.addTemplateHelpers({
        linkCreator:function(url, str){
            if(url.indexOf('http')==0){
                return '<a href="'+url+'" target="_blank">'+str+'</a>';
            }else{
                return '<span>'+str+'</span>';
            }
        },
        getDay:function(str){//format: year-month-day
            var tArr=str.split('-');
            var date=new Date(tArr[0], tArr[1]-1, tArr[2]);
            var day=date.getDay();
            var result;
            switch (day){
                case 0:
                    result='周日';
                    break;
                case 1:
                    result='周一';
                    break;
                case 2:
                    result='周二';
                    break;
                case 3:
                    result='周三';
                    break;
                case 4:
                    result='周四';
                    break;
                case 5:
                    result='周五';
                    break;
                case 6:
                    result='周六';
                    break;
            }
            return result;
        },
        getScore:function(status, score){
            var result;
            if(status==1||status==2){
                result='-';
            }else{
                result=score;
            }
            return result;
        }
    })
});