var loginurl='/site/ajax-login.html';
var loginurl1='/site/ajax-get-user.html';
var num_url='/site/ajax-get-num.html';
var verify_url1 ='/site/ajax-login-verify.html';
var verify_url2 ='/site/ajax-yuyue-verify.html';
var order_url ='/site/ajax-yuyue.html';
var click_id=0;
//倒计时
function page_djs(ele, callback) {
    var time = 60;
    if(ele) {
        ele.html("60s");
    }
    djs_timer = setInterval(function() {
        time--;
        ele.html((time<=0?0:time) + "s");
        if(time == 0) {
            clearInterval(djs_timer);
            ele.html("获取验证码");
            if(callback) {
                callback();
            }
        }
    }, 1000);
}
//错误提示显示
function showErr(index, text) {
    $(".co_error").eq(index).addClass("co_err_show").html(text);
    $(".err").eq(index).addClass("err_show").html(text);
}
//错误提示隐藏
function hideErr(index) {
    $(".co_error").eq(index).removeClass("co_err_show");
}
//初始化
$(function(){
    //登录判断
    $.ajax({
        'url':loginurl1,
        'data':{},
        'type':'GET',
        'dataType':'Json',
        success:function(data){
            if(data.status==0){
                var invite_num=data.msg.invite_num;
                if(!invite_num){
                    invite_num=0;
                }
                $(".co_before").addClass("hidden");
                $(".co_after").removeClass("hidden");
                $('.co_name').text(data.msg.user_phone);
                $('.co_yy_name span').text(data.msg.user_phone);
                $('.co_peonum i').text(invite_num);
                $('.co_code i').text(data.msg.me_invite_code);
                $('.co_qr_code img').attr("src",data.msg.invite_img);
                $('.co_after').attr("data-url",data.msg.share_url);
                $('.co_invite_code').text(data.msg.me_invite_code);
            }else{}
        }
    });
    //预约人数监控
    $.ajax({
        'url':num_url,
        'data':{},
        'type':'GET',
        'dataType':'Json',
        success:function(data){
            if(data.status==0){
               $(".co_progress").attr("data-num",data.msg);
               initActive($(".co_progress").data("num"));
            }else{

            }
        }
    });
    //获取分享链接中的邀请码
    var url = url||location.search; //获取url中"?"符后的字串
    var params = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var datas = str.split("&");
        for(var i = 0 ; i < datas.length ; i++){
            var tempData = datas[i].split("=");
            params[tempData[0]]=tempData[1];
        }
    }
    $(".co_incode").val(params.code);
});
//登录弹框显示
$(".co_loginbtn").click(function(){
    $(".co_tips_login").removeClass("hidden");
});
//立即预约的登录情况判断
$(".co_order").click(function(){
    if($(".co_after.hidden").length>0){
        //登录之前
        click_id=1;
        $(".co_tips_login").removeClass("hidden");
    }else{
        $(".co_tips_order").removeClass("hidden");
    }
});
//邀请好友弹框显示
$(".co_share>span").click(function(){
    if($(".co_after.hidden").length>0){
        //登录之前
        $(".co_tips_login").removeClass("hidden");
    }else{
        $(".co_tips_yq").removeClass("hidden");
    }
});
//活动详情弹框显示
$(".co_check").click(function(){
    $(".co_tips_detail").removeClass("hidden");
});
//登录弹框关闭
$(".co_tips_close").click(function(){
    $(".co_tips_login").addClass("hidden");
    $(".co_tips_order").addClass("hidden");
    $(".co_tips_yq").addClass("hidden");
    $(".co_tips_detail").addClass("hidden");
    $('.co_username').val("");
    $('.co_codenum1').val("");
    $('.co_codenum2').val("");
    $('.co_username1').val("");
    $('.co_code1').val("");
    //$('.co_incode').val("");
    $(".co_error").removeClass("co_err_show");
});
//登录获取验证码
$(".co_codebtn1").click(function(){
    var my_phone = $(".co_username").val();
    var srf = $('meta[name="csrf-token"]').attr('content');
    if(my_phone == "" || my_phone == undefined) {
        showErr(0, "手机号码不能为空哦");
        return;
    }
    hideErr(0);
    $.post(verify_url1,{ "phone":my_phone,"cms_csrf":srf },function(data){
        if(data.status == 0){
            $(".co_codebtn1").css("pointer-events","none");
            page_djs($(".co_codebtn1"),function(){
                $(".co_codebtn1").css("pointer-events","auto");
            });
        }else{
            alert(data.msg);
        }
    }, 'json');

});
//登录请求
$(".co_tips_btn1").click(function(){
    var my_phone = $(".co_username").val();
    var co_codenum1=$('.co_codenum1').val();
    var srf = $('meta[name="csrf-token"]').attr('content');
    if(my_phone == "" || my_phone == undefined) {
        showErr(0, "手机号码不能为空哦");
        return;
    }
    hideErr(0);
    if(co_codenum1 == "" || co_codenum1 == undefined) {
        showErr(1, "验证码不能为空哦");
        return;
    }
    hideErr(1);
    $.ajax({
        'url':loginurl,
        'data':{'phone':my_phone,'yzm':co_codenum1,"cms_csrf":srf },
        'type':'POST',
        'dataType':'Json',
        success:function(data){
            if(data.status==0){
                var invite_num=data.msg.invite_num;
                if(!invite_num){
                     invite_num=0;
                }
                $(".co_tips_login").addClass("hidden");
                $(".co_before").addClass("hidden");
                $(".co_after").removeClass("hidden");
                $('.co_username').val("");
                $('.co_codenum1').val("");
                $('.co_name').text(data.msg.user_phone);
                $('.co_yy_name span').text(data.msg.user_phone);
                $('.co_peonum i').text(invite_num);
                $('.co_code i').text(data.msg.me_invite_code);
                $('.co_qr_code img').attr("src",data.msg.invite_img);
                $('.co_after').attr("data-url",data.msg.share_url);
                $('.co_invite_code').text(data.msg.me_invite_code);
                if(click_id==1){
                    $(".co_tips_order").removeClass("hidden");
                }
                //重新加载页面
                //location.reload();
            }else{
                showErr(1, data.msg);
                //alert(data.msg);
            }
        }
    });
});
//预约获取验证码
$(".co_codebtn2").click(function(){
    var my_phone1 = $(".co_username1").val();
    var type_id=$(".co_tips .co_con>div>.co_xh>span.active").attr("data-id");
    if(type_id==1){
        var type="ios";
    }else if(type_id==2){
        var type="android";
    }
    var srf = $('meta[name="csrf-token"]').attr('content');
    if(my_phone1 == "" || my_phone1 == undefined) {
        showErr(2, "手机号码不能为空哦");
        return;
    }
    hideErr(2);
    $.post(verify_url2,{ "phone":my_phone1,"type":type,"cms_csrf":srf },function(data){
        if(data.status == 0){
            $(".co_codebtn2").css("pointer-events","none");
            page_djs($(".co_codebtn2"),function(){
                $(".co_codebtn2").css("pointer-events","auto");
            });
        }else{
            alert(data.msg);
        }
    }, 'json');
});
//预约提交
$(".co_tips_btn2").click(function(){
    //var my_phone1 = $(".co_username1").val();
    //var co_codenum2= $('.co_codenum2').val();
    var co_incode=  $('.co_incode').val();
    var type_id=$(".co_tips .co_con>div>.co_xh>span.active").attr("data-id");
    if(type_id==1){
        var type="ios";
    }else if(type_id==2){
        var type="android";
    }
    var yq_xz=$(".co_beyq>.co_xh>span.active").text();

    var srf = $('meta[name="csrf-token"]').attr('content');
    //if(my_phone1 == "" || my_phone1 == undefined) {
    //    showErr(2, "手机号码不能为空哦");
    //    return;
    //}
    //hideErr(2);
    //if(co_codenum2 == "" || co_codenum2 == undefined) {
    //    showErr(3, "验证码不能为空哦");
    //    return;
    //}
    //hideErr(3);
    if(co_incode == ""&&yq_xz=="是") {
        showErr(2, "邀请码不能为空哦");
        return;
    }
    hideErr(2);
    //$.post(order_url,{ "phone":my_phone1,"type":type,"yzm":co_codenum2,"invite_code":co_incode,'cms_csrf':srf},function(data){
    $.post(order_url,{"type":type,"invite_code":co_incode,'cms_csrf':srf},function(data){
            if(data.status == 0){
            alert('预约成功');
            $(".co_tips_order").addClass("hidden");
            //$('.co_username1').val("");
            //$('.co_codenum2').val("");
            $('.co_incode').val("");
        }else{
            alert(data.msg);
        }
    }, 'json');
});
//进度条显示
function initActive(num){
    num=parseInt(num)>0?parseInt(num):0;//防止小于0
    if(num>=100000){
        $(".co_step1").addClass("active");
        $(".co_step1").addClass("active-1");
    }if(num>=300000){
        $(".co_step2").addClass("active");
        $(".co_step1").removeClass("active-1");
        $(".co_step2").addClass("active-1");
    }if(num>=500000){
        $(".co_step3").addClass("active");
        $(".co_step1").removeClass("active-1");
        $(".co_step2").removeClass("active-1");
        $(".co_step3").addClass("active-1");
    }if(num>=1000000){
        $(".co_step4").addClass("active");
        $(".co_step1").removeClass("active-1");
        $(".co_step2").removeClass("active-1");
        $(".co_step3").removeClass("active-1");
        $(".co_step4").addClass("active-1");
    }
}
//手机类型选择
$(".co_tips .co_con>div>.co_xh>span").click(function(){
    $(".co_tips .co_con>div>.co_xh>span").removeClass("active");
    $(this).addClass("active");
    //$('.co_codenum2').val("");
});
//是否被邀请
$(".co_beyq>.co_xh>span").click(function(){
    $(".co_beyq>.co_xh>span").removeClass("active");
    $(this).addClass("active");
    if($(this).text()=="否"){
        $('.co_incode').val("");
    }
});
//清除电话号码
$(".co_clear").click(function(){
    $(".co_username").val("");
    $(".co_username1").val("");
});

//羽毛1的动效
var $_window = $(window);
var $main_visual = $('.co_b');
var itemLi = $main_visual.find('.co_b1');
var visualWidth = $main_visual.width();
$main_visual.mousemove(function(e) {
    var cursorX = e.clientX - $main_visual.offset().left;
    var cursorY = e.clientY - $main_visual.offset().top;
    var i = 0.5;
    $(this).find('.co_b1').each(function() {
        var item_width = $(this).width();
        var wrapperWidth = $_window.width();
        var wrapperHeight = (wrapperWidth - 0) / 1.26;
        var centerX = wrapperWidth / 2;
        var centerY = wrapperHeight / 2;
        var newLeft = ((cursorX - centerX) * (i) / 30) * (-1);
        var newTop = (cursorY - centerY) * (i) / 30 * (-1);
        $(this).css({
            'transform': 'translate3d(' + newLeft + 'px,' + newTop + 'px, 0)'
        });
        i = i * 2;
    });
});

//羽毛2的动效
var $_window1 = $(window);
var $main_visual1 = $('.co_bb');
var itemLi1 = $main_visual1.find('.co_bb1');
var visualWidth2 = $main_visual1.width();
$main_visual1.mousemove(function(e) {
    var cursorX = e.clientX - $main_visual1.offset().left;
    var cursorY = e.clientY - $main_visual1.offset().top;
    var i = 0.5;
    $(this).find('.co_bb1').each(function() {
        var item_width = $(this).width();
        var wrapperWidth = $_window1.width();
        var wrapperHeight = (wrapperWidth - 0) / 1.26;
        var centerX = wrapperWidth / 2;
        var centerY = wrapperHeight / 2;
        var newLeft = ((cursorX - centerX) * (i) / 30) * (-1);
        var newTop = (cursorY - centerY) * (i) / 30 * (-1);
        $(this).css({
            'transform': 'translate3d(' + newLeft + 'px,' + newTop + 'px, 0)'
        });
        i = i * 2;
    });
});
