/**
 * Created by Administrator on 2016/11/29.
 */
var ball_red, ball_blue, ball_green, ball_xiao,
    ball_red = new Array(1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46),
    ball_blue = new Array(3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48),
    ball_green = new Array(5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49),
    ball_xiao = new Array("猴", "羊", "马", "蛇", "龙", "兔", "虎", "牛", "鼠", "猪", "狗", "鸡");
var lotteryData;
$(document).ready(function () {
    init();
});

function init() {
    setInterval("getData()", 1000);
   // getData();
}

function getData() {
    $.getJSON("/static/lottery/markSix.json?_="+(new Date().getTime()), function (result) {
        if (!!result) {
            if (lotteryData != result) {
                $("#q").text(PrefixInteger(result.period, 3));

                $("#hk6Table").find("td.w55").each(function (index) {
                    var mv = "m" + (index + 1), val = parseInt(result[mv], 10);
                    if (in_array(val, ball_red)) {
                        $(this).find("div.o").css("background-color", "#FF0000").css("color", "#FFFFFF")
                    } else if (in_array(val, ball_blue)) {
                        $(this).find("div.o").css("background-color", "#0000ff").css("color", "#FFFFFF")
                    } else if (in_array(val, ball_green)) {
                        $(this).find("div.o").css("background-color", "#009900").css("color", "#FFFFFF")
                    }
                    var y = val % 12;
                    if (y == 0) {
                        y = 12;
                    }
                    $(this).find("span.txt").text(ball_xiao[(y - 1)]);
                    $(this).find("span.num").text(PrefixInteger(val, 2));
                });
            }
            lotteryData = result;
        }
    });

}

function in_array(a, b) {
    if ((typeof a == "string") || (typeof a == "number")) {
        for (var c in b) {
            if (b[c] == a)
                return true;
        }
    }
    return false;
}

function setShareInfo() {
    var c = "";
    in_array(parseInt(a, 10), ball_red) ? c = "红" : in_array(parseInt(a, 10), ball_blue) ? c = "蓝" : in_array(parseInt(a, 10), ball_green) && (c = "绿");
}

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}



