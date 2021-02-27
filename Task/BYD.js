/*

#圈x
[rewrite_local]
https://yuedongzu.yichengw.cn/apps/user/profile? url script-request-header https://raw.githubusercontent.com/adw2s/Action/main/Task/BYD.js

[task_local]
0 8-23/2 * * * https://raw.githubusercontent.com/adw2s/Action/main/Task/BYD.js, tag=BYD,


hostname = yuedongzu.yichengw.cn,

*/



const $ = new Env('BYD')
const notify = $.isNode() ?require('./sendNotify') : '';
let notice = ''
let CookieVal = $.getdata('byd_ck')

if ($.isNode()) {
      CookieVal = process.env.BYD_ck.split()
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}



now = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);

if (typeof $request !== 'undefined') {
   if ($request && $request.method != `OPTIONS` && $request.url.indexOf('user/profile') != -1) {
     const CookieVal = JSON.stringify($request.headers)
if(CookieVal)$.setdata(CookieVal,'byd_ck')
     $.log(`CookieVal:${CookieVal}`)
     $.msg($.name,"获取Cookie成功")
     $.done()
   }
} else {
!(async () => {

$.msg($.name,"开始🎉🎉🎉")

      //await cashCheck()
      await userInfo()
      //await signIn()  明天获取url6
      //await checkWaterNum() //喝水ok
      //await zaoWanDkInfo() //早晚打卡ok
      //await sleepStatus()   晚上再测试
      //await clickTaskStatus()  ==
      //await watchTaskStatus()  ==
      //await helpStatus() ok
      //await getNewsId() //阅读新闻+抽奖box ok
      //await checkWaterNum() ok
      //await getQuestionId()  //未发现这个模块
      await guaList()
      await checkWaterNum()
      await checkHomeJin()
      await showmsg()

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}



function showmsg(){
    $.msg($.name, '', notice)
     }

var getBoxId = (function () {
    var i = 0;
    return function () {
        return ++i;
    };
})();



function userInfo() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let userInfo ={
    url: 'https://yuedongzu.yichengw.cn/apps/user/profile?',
    headers: JSON.parse(CookieVal),
}
   $.post(userInfo,async(error, response, data) =>{
     const userinfo = JSON.parse(data)
     $.log('\n🎉模拟登录成功\n'+data)
     if(response.statusCode == 200 && userinfo.code != -1){

        $.log('\n🎉模拟登录成功\n')
        money = userinfo.money
        nickname = userinfo.username
        today_gold = userinfo.day_jinbi
        notice += '🎉账号: '+userinfo.username+'\n'+'🎉当前金币: '+userinfo.jinbi+'🎉今日金币: '+userinfo.day_jinbi+'💰 约'+userinfo.money+'元💸\n'
    }else{
        notice += '⚠️异常原因: '+userinfo.msg+'\n'
           }
     if (money >= 50 ){
       notify.sendNotify(`${$.name}-账号${nickname} 余额${money}元已提现` , `账号${nickname} ${money}元已提现 \n今日收益为${today_gold}`)
       }
          resolve()
    })
   })
  }


function signIn() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let signin ={
    url: `https://yuedongzu.yichengw.cn/user/sign`,
    headers: JSON.parse(CookieVal),
}
   $.post(signin,async(error, response, data) =>{
     $.log('\n🔔开始签到\n')
     $.log('————signIn————\n'+data)
     const sign = JSON.parse(data)
      if(sign.code == 200) {
          $.log('\n🎉'+sign.msg+'签到金币+ '+sign.jinbi+'💰\n')
      signInStr = sign.nonce_str
          await signDouble()
         }else{
          $.log('\n🎉'+sign.msg+'\n')
         }
          resolve()
    })
   })
  }

function signDouble() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let signdouble ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${signInStr}&tid=2&pos=1&`,
}
   $.post(signdouble,async(error, response, data) =>{
     const signin2 = JSON.parse(data)
     $.log('\n🔔开始领取每日观看奖励\n')
     $.log('————signDouble————\n'+data)
     if(signin2.code == 200) {
        $.log('\n🎉签到翻倍成功\n')
         }else{
        $.log('\n⚠️签到翻倍失败:'+signin2.msg+'\n')
         }
        resolve()
    })
   })
  }

function zaoWanDkInfo() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let zaowandkinfo ={
    url: `https://yuedongzu.yichengw.cn/apps/dk_info`,
    headers: JSON.parse(CookieVal),
}
   $.post(zaowandkinfo,async(error, response, data) =>{
     const zwdkinfo = JSON.parse(data)
     $.log('————zaoWanDkInfo————\n'+data)
      if(zwdkinfo.code == 200 && zwdkinfo.is_dk == 0) {
          nowTime = zwdkinfo.now_time
          title1 = zwdkinfo.title1
          title2 = zwdkinfo.title2
          await zaoWanDk()
        }else{
          $.log('已经打过卡了\n')
          }
      resolve()
    })
   })
  }



function zaoWanDk() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let zaowandk ={
    url: `https://yuedongzu.yichengw.cn/apps/chuansj?`,
    headers: JSON.parse(CookieVal),
    body: `mini_pos=3&c_type=1&`,
}
   $.post(zaowandk,async(error, response, data) =>{
     const zwdk = JSON.parse(data)
      $.log('————zaoWanDk————\n'+data)
      if(zwdk.code == 200) {
      zwdkStr = zwdk.nonce_str
          await $.wait(30000)
          await dkClick()
           }
          resolve()
    })
   })
  }

function dkClick() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let dkclick ={
    url: `https://yuedongzu.yichengw.cn/apps/dk_click`,
    headers: JSON.parse(CookieVal),
    body: `now_time=${nowTime}&`,
}
   $.post(dkclick,async(error, response, data) =>{
     const clickdk = JSON.parse(data)
      $.log('————dkClick————\n'+data)
      if(clickdk.code == 200) {
          $.log('\n🎉'+clickdk.msg+'+ '+clickdk.jinbi+'💰\n')
          $.msg(`${title1}`,`${title2}`,'')
          await checkWaterNum()
           }else{
          $.log('\n⚠️'+clickdk.msg)
          await checkWaterNum()
           }
          resolve()
    })
   })
  }



function guaList() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  $.log('————guaList————\n')
  let gualist ={
    url: `https://yuedongzu.yichengw.cn/apps/gua/index?`,
    headers: JSON.parse(CookieVal),
}
   $.get(gualist,async(error, response, data) =>{
    $.log('\n🔔开始查询刮刮卡ID\n')
    $.log('————guaList————\n'+data)
     const guaid = JSON.parse(data)
      if(guaid.data.ka > 0){
        for (guaId of guaid.data.list){
          if(guaId.is_suo == 0){
            GID = guaId.id
            $.log('\n🔔查询刮刮卡ID成功,5s后开始查询刮卡签名\n')
            $.log('\nGID: '+GID+'\n')
            await $.wait(5000)
            await guaDet()
           }
          }
        }
         else{
          $.log('\n⚠️刮刮卡已用完,请明天再刮吧！\n')
          await checkWaterNum()
        }

          resolve()
    })
   })
}

function guaDet() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let guadet ={
    url: `https://yuedongzu.yichengw.cn/apps/gua/det?gid=${GID}&`,
    headers: JSON.parse(CookieVal),
}
   $.post(guadet,async(error, response, data) =>{
      $.log('\n🔔开始查询刮卡签名\n')
      $.log('————guaDet————\n'+data)
     const guasign= JSON.parse(data)
      if(response.Code == 200) {
      $.log('\n🔔查询刮卡签名成功\n')
      SIGN = guasign.sign
      GLID = guasign.glid
      $.log('\nsign: '+SIGN+'\n')
      $.log('\nglid: '+GLID+'\n')
          await guaPost()
         }
          resolve()
    })
   })
  }

function guaPost() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let guapost ={
    url: `https://yuedongzu.yichengw.cn/apps/gua/det_post?`,
    headers: JSON.parse(CookieVal),
    body: `sign=${SIGN}&gid=${GID}&glid=${GLID}&`
}
   $.post(guapost,async(error, response, data) =>{
     $.log('\n🔔开始刮卡\n')
     $.log('————guaPost————\n'+data)
     const guaka= JSON.parse(data)
     if(typeof guaka.jf === 'number') {
          guaStr = guaka.nonce_str
          $.log('\n🎉刮卡成功\n恭喜您刮出'+guaka.tp+'張相同圖案  获得金币 +'+guaka.jf+'\n等待45s后开始翻倍刮卡奖励')
          await $.wait(45000)
          await guaDouble()
         }
          resolve()
    })
   })
  }


function guaDouble() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let guadouble ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${guaStr}&tid=16&pos=1&`,
}
   $.post(guadouble,async(error, response, data) =>{
     const guaka2 = JSON.parse(data)
      $.log('\n🔔开始领取刮卡翻倍奖励\n')
      $.log('————guaDouble————\n'+data)
      if(guaka2.code == 200) {
          $.log('\n🎉刮卡翻倍成功,等待2s后查询下一張刮刮卡ID\n')
          await $.wait(2000)
           }else{
          $.log('\n⚠️刮卡翻倍失败:'+guaka2.msg+'\n')
           }
          resolve()
    })
   })
  }



function checkWaterNum() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkwaternum ={
    url: `https://yuedongzu.yichengw.cn/apps/water_info?`,
    headers: JSON.parse(CookieVal),
}
   $.post(checkwaternum,async(error, response, data) =>{
      $.log('\n🔔开始查询喝水杯数\n')
      $.log('————checkWaterNum————\n'+data)
     const waternum = JSON.parse(data)
      if(waternum.code == 200 && waternum.day_num < 7) {
          waterNum = waternum.day_num
          if(waternum.next_time == 0){
            if(waternum.is_sp == 1){
                $.log('\n🎉喝水前需要看广告！,1s后开始看广告\n')
                await $.wait(1000)
                await checkWaterSp()
             }else{
                $.log('\n🎉查询成功,1s后领取喝水奖励\n')
                await $.wait(1000)
                await waterClick()
             }
          }else{
             $.log('\n⚠️喝水失败: 还没到喝水时间，再等'+waternum.next_time+'秒\n')
            }
       }else{
          $.log('\n⚠️喝水失败: 今日喝水已上限\n')
         }
          resolve()
    })
   })
  }

function checkWaterSp() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checksp ={
    url: `https://yuedongzu.yichengw.cn/apps/chuansj?`,
    headers: JSON.parse(CookieVal),
    body: `mini_pos=2&c_type=1&`,
}
   $.post(checksp,async(error, response, data) =>{
     const sp = JSON.parse(data)
      if(sp.code == 200) {
      waterSpStr = sp.nonce_str
          await WaterSp()
           }
          resolve()
    })
   })
  }

function WaterSp() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let watersp ={
    url: `https://yuedongzu.yichengw.cn/apps/water_sp?`,
    headers: JSON.parse(CookieVal),
    body: `day_num=${waterNum}&`,
}
   $.post(watersp,async(error, response, data) =>{
     const spwater = JSON.parse(data)
      if(spwater.code == 200) {
          $.log('\n🎉正在观看喝水广告, 30后领取喝水奖励\n')
          await $.wait(30000)
          await waterClick()
           }
          resolve()
    })
   })
  }

function waterClick() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let waterclick ={
    url: `https://yuedongzu.yichengw.cn/apps/water_click?`,
    headers: JSON.parse(CookieVal),
    body: `day_num=0${waterNum}&`,
}
   $.post(waterclick,async(error, response, data) =>{
     const clickwater = JSON.parse(data)
$.log('\n🔔开始领取喝水奖励\n')
$.log('————waterClick————\n'+data)
      if(clickwater.code == 200) {
          $.log('\n🎉'+clickwater.msg+'喝水金币+ '+clickwater.jinbi+'💰\n')
           }else{
          $.log('\n⚠️喝水失败:'+clickwater.msg+'\n')
           }
          resolve()
    })
   })
  }


function sleepStatus() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let sleepstatus ={
    url: `https://yuedongzu.yichengw.cn/apps/sleep_info?`,
    headers: JSON.parse(CookieVal),
}
   $.post(sleepstatus,async(error, response, data) =>{
      $.log('\n🔔开始查询睡觉状态\n')
      $.log('————sleepStatus————\n'+data)
     const slpstatus = JSON.parse(data)
      if(slpstatus.code == 200) {
      if(slpstatus.is_lq == 1 && now.getHours() >= 8 && now.getHours() <= 18) {
      sleepStr = slpstatus.nonce_str
      sleepId = slpstatus.taskid
     }else{
$.log('🔔大白天的就不要睡觉啦！')
      }
      if(slpstatus.is_sleep == 0 && slpstatus.is_lq == 1 && now.getHours() >= 20) {
$.log('🔔都几点了，还不睡？5s后开始睡觉！')
          await $.wait(5000)
          await sleepStart()
         }else if((slpstatus.is_sleep == 1 || slpstatus.is_sleep == 0)&& slpstatus.is_lq == 0 && now.getHours() >= 8 && now.getHours() <= 12){
$.log('🔔都几点了，还不起？5s后准备起床！')
          await $.wait(5000)
          await sleepEnd()
         }else if(slpstatus.is_sleep == 0 && slpstatus.is_lq == 1 && now.getHours() >= 8 && now.getHours() <= 12){
          await sleepDone()
         }else if(slpstatus.is_sleep == 1 && slpstatus.is_lq == 1 && now.getHours() >= 22){
          $.log('⚠️睡觉的時候不要玩手机！！！')
         }else if(slpstatus.is_sleep == 0 &&
now.getHours() >= 18){
          $.log('😘这么早就准备睡觉了吗？是身体不舒服吗？要保重身体呀！')
         }}
          resolve()
    })
   })
  }



function sleepStart() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let sleepstart ={
    url: `https://yuedongzu.yichengw.cn/apps/sleep_start`,
    headers: JSON.parse(CookieVal),
}
   $.post(sleepstart,async(error, response, data) =>{
     const startsleep = JSON.parse(data)
      $.log('\n🔔开始睡觉\n')
      $.log('————sleepStart————\n'+data)
      if(startsleep.code == 200) {
          $.log('\n🎉睡觉成功！早睡早起身体好！\n')
           }else{
          $.log('\n⚠️睡觉失败敗:'+startsleep.msg+'\n')
           }
          resolve()
    })
   })
  }

function sleepEnd() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let sleepend ={
    url: `https://yuedongzu.yichengw.cn/apps/sleep_end`,
    headers: JSON.parse(CookieVal),
}
   $.post(sleepend,async(error, response, data) =>{
     const endsleep = JSON.parse(data)
      $.log('\n🔔开始起床\n')
      $.log('————sleepEnd————\n'+data)
      if(endsleep.code == 200) {
          $.log('\n🎉起床了！別睡了！\n')
          await sleepStatus()
           }else{
          $.log('\n⚠️起床失败:'+endsleep.msg+'\n')
           }
          resolve()
    })
   })
  }

function sleepDone() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let sleepdone ={
    url: `https://yuedongzu.yichengw.cn/apps/sleep_done`,
    headers: JSON.parse(CookieVal),
    body: `taskid=${sleepId}&nonce_str=${sleepStr}&`
}
   $.post(sleepdone,async(error, response, data) =>{
     const donesleep = JSON.parse(data)
      $.log('\n🔔开始领取睡觉金币\n')
      $.log('————sleepDone————\n'+data)
      if(donesleep.code == 200) {
          $.log('\n🎉'+donesleep.msg+'金币+ '+donesleep.jinbi+'💰\n')
           }else{
          $.log('\n⚠️领取睡觉金币失败敗:'+donesleep.msg+'\n')
           }
          resolve()
    })
   })
  }

function clickTaskStatus() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let clicktaskstatus ={
    url: `https://yuedongzu.yichengw.cn/user/renwu`,
    headers: JSON.parse(CookieVal),
    body: `idfa=${JSON.parse(CookieVal)['idfa']}&`,
}
   $.post(clicktaskstatus,async(error, response, data) =>{
     const clicktask = JSON.parse(data)
     $.log('————clickTaskStatus————\n'+data)
     $.log('\n⚠️每日点击广告任务已上限\n'+data)
      if(clicktask.first.admobile_st != 2) {
        $.log('\n🔔开始查询每日点击任务状态\n')
          await checkDailyClickAdId()
         }else{
          $.log('\n⚠️每日点击广告任务已上限\n')
         }
       resolve()
    })
   })
  }

function watchTaskStatus() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let watchtaskstatus ={
    url: `https://yuedongzu.yichengw.cn/user/renwu`,
    headers: JSON.parse(CookieVal),
    body: `idfa=${JSON.parse(CookieVal)['idfa']}&`,
}
   $.post(watchtaskstatus,async(error, response, data) =>{
     const watchtask = JSON.parse(data)
      $.log('————watchTaskStatus————\n'+data)
      $.log('\n🔔开始查询每日观看广告任务状态\n')
       if(watchtask.v_st != 2) {
        $.log('\n🔔每日观看广告任务状态查询成功,1s后查询每日观看广告ID\n')
          await $.wait(1000)
          await checkDailyWatchAdId()
         }else{
          $.log('\n⚠️每日看广告任务已上限\n')
          await checkWaterNum()
         }
       resolve()
    })
   })
  }


function checkDailyWatchAdId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkdailywatchadid ={
    url: `https://yuedongzu.yichengw.cn/apps/chuansj?`,
    headers: JSON.parse(CookieVal),
    body: `mini_pos=0&c_type=1&`,
}
   $.post(checkdailywatchadid,async(error, response, data) =>{
      $.log('\n🔔开始查询每日观看广告ID\n')
      $.log('————checkDailyWatchAdId————\n'+data)
     const dailywatchid = JSON.parse(data)
      if(dailywatchid.code == 200) {
      dailyWatchStr = dailywatchid.nonce_str
         // $.log('\n'+dailyWatchStr+'\n')
          $.log('\n🎉查询成功,30s后领取奖励\n')
          await $.wait(30000)
          await DailyWatchAd()
           }
          resolve()
    })
   })
  }


function DailyWatchAd() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let dailywatchad ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${dailyWatchStr}&tid=9&pos=1&`,
}
   $.post(dailywatchad,async(error, response, data) =>{
     const dailywatch = JSON.parse(data)
      $.log('\n🔔开始领取每日观看奖励\n')
      $.log('————DailyWatchAd————\n'+data)
      if(dailywatch.code == 200) {
          $.log('\n🎉每日观看奖励领取成功,5m(300s)后查询下一次广告\n')
          for(let i=1;i<=60;i++){
              (function(){
                  setTimeout(() => {
                    $.log('\n⏱请等待'+(60-i)*5+'s后查询下一次广告\n')
                  }, 5000*i);
              })()
          }
          await $.wait(300000)
          await watchTaskStatus()
           }else{
          $.log('\n⚠️每日奖励领取失败:'+dailywatch.msg+'\n')
           }
          resolve()
    })
   })
  }

function checkDailyClickAdId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkdailyclickadid ={
    url: `https://yuedongzu.yichengw.cn/user/admobile_show`,
    headers: JSON.parse(CookieVal),
}
   $.post(checkdailyclickadid,async(error, response, data) =>{
      $.log('\n🔔开始查询每日广告ID\n')
      $.log('————checkDailyClickAdId————\n'+data)
     const dailyclickid = JSON.parse(data)
      if(dailyclickid.code == 200) {
      dailyClickAdId = dailyclickid.ad_id
         // $.log('\n'+dailyClickAdId+'\n')
          $.log('\n🎉查询成功,1s后领取奖励\n')
          await $.wait(1000)
          await checkDailyClickAd()
           }
          resolve()
    })
   })
  }


function checkDailyClickAd() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkdailyclickad ={
    url: `https://yuedongzu.yichengw.cn/user/admobile_click`,
    headers: JSON.parse(CookieVal),
    body: `ad_id=${dailyClickAdId}&`,
}
   $.post(checkdailyclickad,async(error, response, data) =>{
    $.log('\n🔔开始查询每日广告点击ID\n')
    $.log('————checkDailyClickAd————\n'+data)
     const dailyclick = JSON.parse(data)
      if(dailyclick.code == 200) {
      dailyClickStr = dailyclick.nonce_str
         // $.log('\n'+dailyClickStr+'\n')
          $.log('\n🎉查询成功,5s后返回领取奖励\n')
          await $.wait(5000)
          await DailyClickAd()
           }
          resolve()
    })
   })
  }

function DailyClickAd() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let dailyclickad ={
    url: `https://yuedongzu.yichengw.cn/user/admobile_done`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${dailyClickStr}&ad_id=${dailyClickAdId}&`,
}
   $.post(dailyclickad,async(error, response, data) =>{
     const dailyclick = JSON.parse(data)
      $.log('\n🔔开始领取每日点击奖励\n')
      $.log('————DailyClickAd————\n'+data)
      if(dailyclick.code == 200) {
          $.log('\n🎉每日点击奖励领取成功,1s后查询下一次广告ID\n')
          await $.wait(1000)
          await clickTaskStatus()
           }else{
          $.log('\n⚠️每日点击领取失败:'+dailyclick.msg+'\n')
           }
          resolve()
    })
   })
  }



function checkHomeJin() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkhomejin ={
    url: 'https://yuedongzu.yichengw.cn/apps/home?',
    headers: JSON.parse(CookieVal),
}
   $.post(checkhomejin,async(error, response, data) =>{
     const checkhomejb = JSON.parse(data)
      $.log('————checkHomeJin————\n'+data)
     if(checkhomejb.steps_btn_st != 2){
          $.log('\n🔔开始查询首页金币状态\n')
          //$.log('\n🔔等待'+(checkhomejb.xuanfu_time+5)+'s领取首页金币')
          //await $.wait(checkhomejb.xuanfu_time*1000+5000)
          await homeJin()
        }else if(checkhomejb.steps_btn_st == 2 && checkhomejb.xuanfu_st != 2){
          $.log('\n🔔开始查询首页红包状态\n')
          await checkRedBagId()
          //$.log('\n🔔等待'+(checkhomejb.jindan_djs+5)+'s领取金蛋奖励')
          //await $.wait(checkhomejb.jindan_djs*1000+5000)
        }else if(checkhomejb.steps_btn_st == 2 && checkhomejb.xuanfu_st == 2 ){
          $.log('\n🔔开始查询金蛋状态\n')
          await checkGoldtime()
        }/*else if(checkhomejb.xuanfu_st == 2 && checkhomejb.jindan_show == 2 && checkhomejb.hb_st == 1){
          $.log('\n🔔开始查询首页红包状态\n')
          $.log('\n🔔等待'+(checkhomejb.hb_time+5)+'s领取首页红包')
          time = checkhomejb.hb_time+5
          for(let i=1;i<=(time/5);i++){
              (function(){
                  setTimeout(() => {
                    $.log('\n⏱请等待'+((time/5-i)*5)+'s后领取首页红包\n')
                  }, 5000*i);
              })()
          }
          await $.wait(checkhomejb.hb_time*1000+5000)
          await checkRedBagId()
        }*/
         else if(checkhomejb.xuanfu_st == 2 && checkhomejb.jindan_show == 2 && checkhomejb.hb_st == 2){
$.log('\n🔔首页金币状态:'+checkhomejb.right_text+'\n🔔首页红包状态:'+checkhomejb.hb_text+'\n🔔首页金蛋状态:'+checkhomejb.jindan_text+'\n')
          await checkWaterNum()
        }else {
          await checkWaterNum()
        }
          resolve()
    })
   })
  }


function homeJin() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let homejin ={
    url: 'https://yuedongzu.yichengw.cn/apps/luckycoins',
    headers: JSON.parse(CookieVal),
    body: `lucky_pos=2&`,
}
   $.post(homejin,async(error, response, data) =>{
     const homejb = JSON.parse(data)
    $.log('————homeJin————\n'+data)
     if(homejb.code == 200){
    $.log('\n🔔开始领取首页金币\n')
          $.log('\n🎉首页金币: 金币 +'+homejb.jinbi+' ,等待30s后开始翻倍金币\n')
         homeJinStr = homejb.nonce_str
          //$.log('\n'+homeJinStr+'\n')
          await $.wait(30000)
          await homeJinCallBack()
    }else{
          $.log('\n⚠️首页金币失败:'+homejb.msg+'\n')
           }
          resolve()
    })
   })
  }



function homeJinCallBack() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let homejincallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${homeJinStr}&tid=16&pos=1&`,
}
   $.post(homejincallback,async(error, response, data) =>{
     const hmjcallback = JSON.parse(data)
      $.log('\n🔔开始翻倍首页金币\n')
      $.log('————homeJinCallBack————\n'+data)
      if(hmjcallback.code == 200) {
          $.log('\n🎉首页金币翻倍成功\n')
          await checkHomeJin()
           }else{
          $.log('\n🔔首页金币翻倍失败'+hmjcallback.msg+'\n')
           }
          resolve()
    })
   })
  }

function checkRedBagId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkredbagid ={
    url: `https://yuedongzu.yichengw.cn/apps/xuanfu?`,
    headers: JSON.parse(CookieVal),
    //body: `mini_pos=0&c_type=2&`,
}
   $.post(checkredbagid,async(error, response, data) =>{
    $.log('\n🔔开始查询首页红包ID\n')
    $.log('————checkRedBagId————\n'+data)
     const code = JSON.parse(data)
      if(code.code == 200) {
      redBagStr = code.nonce_str
$.log('\n🔔查询首页红包ID成功,等待30s后领取首页红包\n')
          await $.wait(30000)
          await redBagCallback()
           }
          resolve()
    })
   })
  }

function redBagCallback() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let redbagcallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${redBagStr}&tid=17&pos=1&`,
}
   $.post(redbagcallback,async(error, response, data) =>{
     const redbag = JSON.parse(data)
      $.log('————redBagCallback————\n'+data)
      $.log('\n🔔开始领取首页红包\n')
      if(redbag.code == 200) {
          $.log('\n🎉首页红包领取成功\n')
          await checkHomeJin()
           }else{
          $.log('\n⚠️首页红包领取失败:'+redbag.msg+'\n')
          await checkHomeJin()
           }
          resolve()
    })
   })
  }


  function checkGoldtime() {
  return new Promise((resolve, reject) => {
    let timestamp=new Date().getTime();
    let checkgoltime1 ={
      url: `https://yuedongzu.yichengw.cn/apps/mystate`,
      headers: JSON.parse(CookieVal),
  }
     $.post(checkgoltime1,async(error, response, data) =>{
       const goltime = JSON.parse(data)
        $.log('————checkGoldEggId————\n'+data)
        if(goltime.code == 200) {
                $.log('\n🔔金蛋ID data'+data)
                $.log('\n🔔开始金蛋/惊喜盒子是否可以开启\n')
                goltimestr = goltime.jiandan_time
                boxtimestr = goltime.box_time
                if(goltimestr == 0){await checkGoldEggId()}
                else if(boxtimestr == 0){await checkboxId()}
                await $.wait(3000)
             }else{
            $.log('\n⚠️首页金蛋失败:'+goltime.msg+'\n')
            await checkHomeJin()
          }
            resolve()
      })
     })
    }

function checkGoldEggId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkgoldeggid ={
    url: `https://yuedongzu.yichengw.cn/apps/jindan_click?`,
    headers: JSON.parse(CookieVal),
}
   $.post(checkgoldeggid,async(error, response, data) =>{
     const goldeggid = JSON.parse(data)
      $.log('————checkGoldEggId————\n'+data)
      if(goldeggid.code == 200) {
$.log('\n🔔金蛋ID data'+data)
$.log('\n🔔开始查询金蛋ID\n')
      goldEggStr = goldeggid.nonce_str
          $.log('\n'+goldEggStr+'\n')
      goldEggId = goldeggid.taskid
          $.log('\n'+goldEggId+'\n')
          await goldEggDone()
           }else{
          $.log('\n⚠️首页金蛋失败:'+goldeggid.msg+'\n')
          await checkHomeJin()
        }
          resolve()
    })
   })
  }

function goldEggDone() {
return new Promise((resolve, reject) => {
  let timestamp= Date.parse(new Date())/1000;
  let goldeggdone ={
    url: `https://yuedongzu.yichengw.cn/apps/jindan_done`,
    headers: JSON.parse(CookieVal),
    body: `taskid=${goldEggId}&clicktime=${timestamp}&donetime=${timestamp}+1000&nonce_str=${goldEggStr}&`
}
   $.post(goldeggdone,async(error, response, data) =>{
     const goldegg2 = JSON.parse(data)
      $.log('————goldEggDone————\n'+data)
      if(goldegg2.code == 200) {
$.log('\n🔔开始领取首页金蛋奖励\n')
          $.log('\n🎉首页金蛋:'+goldegg2.msg+'\n金币+ '+goldegg2.jinbi+'\n')
          await goldEggCallback()
           }else{
          $.log('\n⚠️首页金蛋失败:'+goldegg2.msg+'\n')
          await checkHomeJin()
           }
          resolve()
    })
   })
  }

function goldEggCallback() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let goldeggcallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${goldEggStr}&tid=5&pos=1&`,
}
   $.post(goldeggcallback,async(error, response, data) =>{
     const goldeggback = JSON.parse(data)
      $.log('————goldEggCallback————\n'+data)
      $.log('\n🔔开始翻倍首页金蛋\n')
      if(goldeggback.code == 200) {
          $.log('\n🎉金蛋翻倍成功\n')
          await checkGoldtime()
           }else{
          $.log('\n⚠️金蛋翻倍失败:'+goldeggback.msg+'\n')
          await checkHomeJin()
           }
          resolve()
    })
   })
  }


  function checkboxId() {
  return new Promise((resolve, reject) => {
    let timestamp=new Date().getTime();
    let checkboxid ={
      url: `https://yuedongzu.yichengw.cn/apps/box_click`,
      headers: JSON.parse(CookieVal),
  }
     $.post(checkboxid,async(error, response, data) =>{
       const boxid = JSON.parse(data)
        $.log('————checkboxId————\n'+data)
        if(boxid.code == 200) {
  $.log('\n🔔盒子ID data'+data)
  $.log('\n🔔开始查询盒子BOXID\n')
        boxStr = boxid.nonce_str
            $.log('\n'+boxStr+'\n')
        boxxId = boxid.taskid
            $.log('\n'+boxxId+'\n')
            await boxDone()
             }else{
            $.log('\n⚠️盒子失败:'+goldeggid.msg+'\n')
            await checkHomeJin()
          }
            resolve()
      })
     })
    }

function boxDone() {
return new Promise((resolve, reject) => {
  let timestamp= Date.parse(new Date())/1000;
  let boxxdone ={
    url: `https://yuedongzu.yichengw.cn/apps/box_done`,
    headers: JSON.parse(CookieVal),
    body: `taskid=${boxxId}&clicktime=${timestamp}&donetime=${timestamp}+1000&nonce_str=${boxStr}&`
}
   $.post(boxxdone,async(error, response, data) =>{
     const boxxdone2 = JSON.parse(data)
      $.log('————goldEggDone————\n'+data)
      if(boxxdone2.code == 200) {
          $.log('\n🔔开始领取盒子奖励\n')
          $.log('\n🎉首页盒子:'+boxxdone2.msg+' 金币 +'+boxxdone2.jinbi+'\n')
          await boxCallback()
           }else{
          $.log('\n⚠️首页盒子失败:'+boxxdone2.msg+'\n')
          await checkHomeJin()
           }
          resolve()
    })
   })
  }

function boxCallback() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let boxcallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${boxStr}&tid=5&pos=1&`,
}
   $.post(boxcallback,async(error, response, data) =>{
     const boxback = JSON.parse(data)
      $.log('————boxCallback————\n'+data)
      $.log('\n🔔开始翻倍盒子\n')
      if(boxback.code == 200) {
          $.log('\n🎉盒子翻倍成功\n')
          await checkGoldtime()
           }else{
          $.log('\n⚠️盒子翻倍失败:'+boxback.msg+'\n')
          await checkHomeJin()
           }
          resolve()
    })
   })
  }

function helpStatus() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let helpstatus ={
    url: `https://yuedongzu.yichengw.cn/apps/help_index?`,
    headers: JSON.parse(CookieVal),
}
   $.post(helpstatus,async(error, response, data) =>{
     const help = JSON.parse(data)
      $.log('————helpStatus————\n'+data)
      $.log('\n🔔开始查询助力视频状态\n')
      if(help.status == 0) {
$.log('\n🔔查询助力视频状态成功, 1s后获取助力视频ID\n')
          await checkCode()
           }else{
$.log('\n🔔今日助力已上限,请明天再試!\n')
           }
          resolve()
    })
   })
  }


function checkCode() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkcode ={
    url: `https://yuedongzu.yichengw.cn/apps/chuansj?`,
    headers: JSON.parse(CookieVal),
    body: `mini_pos=5&c_type=1&`,
}
   $.post(checkcode,async(error, response, data) =>{
     const code = JSON.parse(data)
      $.log('————checkCode————\n'+data)
      $.log('\n🔔开始查询助力视频ID\n')
      if(code.code == 200) {
      nonce_str = code.nonce_str
$.log('\n🔔查询助力视频ID成功, 开始观看助力视频\n')
          await helpClick()
           }
          resolve()
    })
   })
  }


function helpClick() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let helpclick ={
    url: `https://yuedongzu.yichengw.cn/apps/help_click`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${nonce_str}`,
}
   $.post(helpclick,async(error, response, data) =>{
     const help = JSON.parse(data)
      $.log('————helpClick————\n'+data)
      if(help.code == 200) {
$.log('\n🔔开始观看助力视频, 60s后领取助力视频奖励\n')
          await $.wait(60000)
          $.log('\n🎉观看助力视频成功, 1s后领取金币+ '+help.jinbi+'\n')
          await callBack()
           }else{
          $.log('\n⚠️观看助力视频失败: '+help.msg+'\n')
           }
          resolve()
    })
   })
  }



function callBack() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let callback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${nonce_str}&tid=22&pos=1&`,
}
   $.post(callback,async(error, response, data) =>{
     const back = JSON.parse(data)
      $.log('————callBack————\n'+data)
      $.log('\n🔔开始领取助力视频奖励\n')
      if(back.code == 200) {
          $.log('\n🎉领取助力视频奖励成功,1s后查询下一次助力视频状态\n')
          await $.wait(1000)
          await helpStatus()
           }else{
          $.log('\n⚠️助力视频奖励失败:'+back.msg+'\n')
           }
          resolve()
    })
   })
  }

function getNewsId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let getnewsid ={
    url: 'https://yuedongzu.yichengw.cn/apps/news_info?',
    headers: JSON.parse(CookieVal),
    body: `type_class=1&`
}
   $.post(getnewsid,async(error, response, data) =>{
     const newsid = JSON.parse(data)
      $.log('————getNewsId————\n'+data)
     if(newsid.code == 200){
       if(newsid.is_max == 0){
          $.log('\n🔔开始查询新闻ID\n')
          newsStr = newsid.nonce_str
          $.log('\n🎉新闻ID查询成功,15s后领取阅读奖励\n')
          await $.wait(15000)
          await autoRead()
          }else{
          $.log('\n⚠️阅读失败: 今日阅读已上限\n')
          await checkLuckNum()
         }}else{
          $.log('\n⚠️查询新闻ID失败:'+newsid.msg+'\n')
           }
          resolve()
    })
   })
  }

function autoRead() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let autoread ={
    url: 'https://yuedongzu.yichengw.cn/apps/news_done?',
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${newsStr}& `,
}
   $.post(autoread,async(error, response, data) =>{
     const read = JSON.parse(data)
      $.log('————autoRead————\n'+data)
      if(read.code == 200) {
          $.log('\n🎉阅读成功,金币+ '+read.jinbi+'💰,开始查询下一篇新闻ID\n')
            await getNewsId()
          }else{
          $.log('\n⚠️阅读失败:'+data+'\n')
           }
          resolve()
    })
   })
  }

function checkLuckNum() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let lucknum ={
    url: `https://yuedongzu.yichengw.cn/apps/lucky?`,
    headers: JSON.parse(CookieVal),
}
   $.post(lucknum,async(error, response, data) =>{
     const num = JSON.parse(data)
      $.log('————checkLuckNum————\n'+data)
      $.log('\n🔔开始查询抽奖次数\n')
      if(num.lucky_num != 0) {
          $.log('\n🎉剩余抽奖次数:'+num.lucky_num+' ,3s后开始抽奖\n')
          await $.wait(3000)
          await luckyClick()
         }else if(num.lucky_num == 0) {
          $.log('\n⚠️今日抽奖次数已用完,1s后查询宝箱状态\n')
          await $.wait(1000)
       for (box of num.lucky_box){
          //$.log(box)
          if (box != 2)
          await luckyBox()
          if (box == 2)
          $.log('\n⚠️宝箱已开启\n')
         }
       }
          resolve()
    })
   })
  }

function luckyClick() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let luckclick ={
    url: `https://yuedongzu.yichengw.cn/apps/lucky_click?`, //lucky_click
    headers: JSON.parse(CookieVal),
    //body: `lucky_pos=2&`,
}
   $.post(luckclick,async(error, response, data) =>{
     const lucky = JSON.parse(data)
      $.log('————luckyClick————\n'+data)
      $.log('\n🔔开始抽奖\n')
      if(lucky.code == 200) {
          $.log('\n🎉抽奖:'+lucky.message+' 金币+'+lucky.jinbi+'\n')
         luckyStr = lucky.nonce_str
          //$.log('\n'+luckyStr+'\n')
      if(lucky.jinbi != 0) {
          await $.wait(10000)
          await luckyCallBack()
         }else{
          await checkLuckNum()
         }
       }
          resolve()
    })
   })
  }


function luckyCallBack() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let luckycallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${luckyStr}&tid=16&pos=1&`,
}
   $.post(luckycallback,async(error, response, data) =>{
     const callback = JSON.parse(data)
      $.log('————luckyCallBack————\n'+data)
      $.log('\n🔔开始翻倍抽奖\n')
      if(callback.code == 200) {
          $.log('\n🎉抽奖翻倍成功\n')
          await $.wait(25000)
          await checkLuckNum()
           }else{
          $.log('\n⚠️抽奖翻倍失败:'+callback.msg+'\n')
           }
          resolve()
    })
   })
  }

function luckyBox() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let luckybox ={
    url: `https://yuedongzu.yichengw.cn/apps/lucky_box`,
    headers: JSON.parse(CookieVal),
    body: `box=${getBoxId()}&`,
}
//$.log('\nlockyboxBODY:'+luckybox.body+'\n')
   $.post(luckybox,async(error, response, data) =>{
     const boxlucky = JSON.parse(data)
      $.log('————luckyBox————\n'+data)
      $.log('\n🔔开始打开宝箱\n')
      if(boxlucky.code == 200) {
          $.log('🎉宝箱: '+boxlucky.msg+' 金币+'+boxlucky.jinbi+'\n')
         luckyBoxStr = boxlucky.nonce_str
          $.log('\n🔔宝箱翻倍ID'+luckyBoxStr+'\n')
          await $.wait(15000)
          await luckyBoxCallBack()
         }else{
          $.log('\n⚠️宝箱失败:'+boxlucky.msg+'\n')
         }
          resolve()
    })
   })
  }

function luckyBoxCallBack() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let luckyboxcallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${luckyBoxStr}&tid=16&pos=1&`,
}
   $.post(luckyboxcallback,async(error, response, data) =>{
     const boxcallback = JSON.parse(data)
      $.log('————luckyBoxCallBack————\n'+data)
      $.log('\n🔔开始翻倍宝箱\n')
      if(boxcallback.code == 200) {
          $.log('\n🎉宝箱翻倍成功\n')
          await $.wait(1000)
           }else{
          $.log('\n⚠️宝箱翻倍失败'+boxcallback.msg+'\n')
           }
          resolve()
    })
   })
  }



function getQuestionId() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let getquestionid ={
    url: `https://yuedongzu.yichengw.cn/apps/cy_info`,
    headers: JSON.parse(CookieVal),
}
   $.post(getquestionid,async(error, response, data) =>{
     const question = JSON.parse(data)
     $.log('————getQuestionId————\n'+data)
      if(question.code == 200 && question.day_num != 0) {
$.log('\n🔔开始查询答題ID\n')
         questionSite = question.site
          $.log('\n🎉答題ID1⃣️: '+questionSite+'\n')
         questionId = question.cy_id
          $.log('\n🎉答題ID2⃣️: '+questionId+'\n')
         spId = question.day_num
          $.log('\n🎉答題视频: '+spId+'\n')
      if(question.is_sp == 1) {
          await $.wait(5000)
          await checkSp()
         }else{
          await answerQue()
         }}else{
          $.log('\n⚠️查询答題ID成功,答題失败: 今日答題已上限\n')
         }
          resolve()
    })
   })
  }

function checkSp() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checksp ={
    url: `https://yuedongzu.yichengw.cn/apps/chuansj?`,
    headers: JSON.parse(CookieVal),
    body: `mini_pos=1&c_type=1&`,
}
   $.post(checksp,async(error, response, data) =>{
     const sp = JSON.parse(data)
     $.log('————checkSp————\n'+data)
      if(sp.code == 200) {
      spStr = sp.nonce_str
          //$.log('\n'+spStr+'\n')
          await $.wait(5000)
          await cySp()
           }
          resolve()
    })
   })
  }

function cySp() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let cysp ={
    url: `https://yuedongzu.yichengw.cn/apps/cy_sp`,
    headers: JSON.parse(CookieVal),
    body: `day_num=${spId}&`,
}
   $.post(cysp,async(error, response, data) =>{
     const sp = JSON.parse(data)
     $.log('————cySp————\n'+data)
      if(sp.code == 200) {
         // $.log('\n'+sp.msg+'\n')
          //await $.wait(5000)
          await answerQue()
           }
          resolve()
    })
   })
  }

function answerQue() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let answerque ={
    url: `https://yuedongzu.yichengw.cn/apps/cy_click`,
    headers: JSON.parse(CookieVal),
    body: `cy_id=${questionId}&site=${questionSite}&`,
}
   $.post(answerque,async(error, response, data) =>{
     const answer = JSON.parse(data)
     $.log('————answerQue————\n'+data)
      $.log('\n🔔开始答題\n')
      if(answer.code == 200) {
          $.log('\n🎉答題: '+answer.msg+'\n金币+ '+answer.jinbi+'\n')
         answerStr = answer.nonce_str
          $.log('\n🎉答題翻倍ID:'+answerStr+'\n')
          await $.wait(5000)
          await answerQueCallBack()
         }else{
          $.log('\n⚠️答題失败: '+answer.msg+'\n')
         }
          resolve()
    })
   })
  }


function answerQueCallBack() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let answerquecallback ={
    url: `https://yuedongzu.yichengw.cn/apps/index?`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${answerStr}&tid=18&pos=1&`,
}
   $.post(answerquecallback,async(error, response, data) =>{
     const answerback = JSON.parse(data)
     $.log('————answerQueCallBack————\n'+data)
      $.log('\n🔔开始翻倍答題金币\n')
      if(answerback.code == 200) {
          $.log('\n🎉答題金币翻倍成功\n')
          await $.wait(5000)
          await getQuestionId()
           }else{
          $.log('\n⚠️答題金币翻倍失败:'+answerback.msg+'\n')
           }
          resolve()
    })
   })
  }


function cashCheck() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let cashcheck ={
    url: 'https://yuedongzu.yichengw.cn/apps/user/profile?',
    headers: JSON.parse(CookieVal),
}
   $.post(cashcheck,async(error, response, data) =>{
     const cash = JSON.parse(data)
     $.log('————cashCheck————\n'+data)
     if(response.code == 200 && cash.code != -1){
         if(cash.jinbi >= 500000){
           tip = 50
           await withDraw()
         }else if(cash.jinbi > 10000 && cash.tixian_coupon >8){
          tip = 1
          await withDraw()
        }else if(cash.day_jinbi > 6000){
          tip = 0.3
          await withDraw()
         }
       }
        resolve()
    })
   })
  }




function withDraw() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let withdraw ={
    url: `https://yuedongzu.yichengw.cn/user/tixian?`,
    headers: JSON.parse(CookieVal),
    body: `tx=${tip}&`,
}
   $.post(withdraw,async(error, response, data) =>{
     const draw = JSON.parse(data)
       //$.log(data)
       $.log('————withDraw————\n'+data)
      if(withdraw.code == 200) {
           $.msg(draw.msg)
          }else{
           notice +=draw.tip+'\n'+draw.msg+'\n'
          }
          resolve()
    })
   })
  }







function checkH5Id() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let checkh5id ={
    url: `https://yuedongzu.yichengw.cn/user/h5_list?`,
    headers: JSON.parse(CookieVal),
    body: `page=1&page_limit=50&`,
}
   $.post(checkh5id,async(error, response, data) =>{
     const checkh5 = JSON.parse(data)
     $.log('————checkH5Id————\n'+data)
      if(response.statusCode == 200){
         for(ID of checkh5){
          H5ID = ID.mini_id
          $.log('\n'+H5ID+'\n')
          await doTaskH5()
         }
        }
      resolve()
    })
   })
  }


function doTaskH5() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let dotaskh5 ={
    url: `https://yuedongzu.yichengw.cn/user/h5_news?`,
    headers: JSON.parse(CookieVal),
    body: `mini_id=${H5ID}&`,
}
   $.post(dotaskh5,async(error, response, data) =>{
     const doh5task = JSON.parse(data)
     $.log('————doTaskH5————\n'+data)
      $.log('\ndoTaskH5:'+data+'\n')
      if(response.body.indexOf('nonce_str') != -1) {
         H5Str = doh5task.nonce_str
          $.log('\n'+H5Str+'\n')
         H5TaskID = doh5task.taskid
          $.log('\n'+H5TaskID+'\n')
          //await $.wait(30000)
          await upLoadTime2()
           }else{
          $.log('\n'+data+'\n')
           }
          resolve()
    })
   })
  }

function upLoadTime() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let uploadtime ={
    url: `https://wapinformation.dfxwdc.com/wapreport/screen_show?encodedMsg=cWlkMTAyNjcJMTYxMDkxODY0MzAyMjkwNTYJbmV3cwllYXN0ZGF5X3dhcG5ld3MJanVuc2hpCWRmdHQtNzcxMjNkYWI3MC04YWFmCXRvdXRpYW8JaHR0cHM6Ly90b3V0aWFvLmVhc3RkYXkuY29tLwlqdW5zaGkJMQkxCTAJLy9taW5pLmVhc3RkYXkuY29tL21vYmlsZS8yMTAxMTYxMTU0MTE5NTU1NTE3NzcuaHRtbAl0b3V0aWFvCWp1bnNoaQ%3D%3D&_=1610918646639&jsonpcallback=Zepto${timestamp}`,
    headers: {"Accept": "*/*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Host": "wapunionstatis.dfxwdc.com","Referer": "https://toutiao.eastday.com/?qid=qid10267","User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",},
    timeout: 30000,
}
   $.get(uploadtime,async(error, response, data) =>{
     $.log('————upLoadTime————\n'+data)
$.log('\nupLoadTime:'+timestamp+'\n'+data+'\n')
          await $.wait(30000)
          await h5Done()
          resolve()
    })
   })
  }

function upLoadTime2() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let uploadtime ={
    url: `https://api.clotfun.online/tiger/getConfig/a0d2cb8e06bd53b0530f8786624999db?hdggHtmlId=675`,
    headers: {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",},
    timeout: 30000,
}
   $.get(uploadtime,async(error, response, data) =>{
$.log('\nupLoadTime2:'+data+'\n')
          await $.wait(30000)
          await h5Done()
          resolve()
    })
   })
  }



function h5Done() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let h5done ={
    url: `https://yuedongzu.yichengw.cn/user/h5_newsdone`,
    headers: JSON.parse(CookieVal),
    body: `taskid=${H5TaskID}&nonce_str=${H5Str}&`,
    timeout: 30000,
}
   $.post(h5done,async(error, response, data) =>{
     const doneh5 = JSON.parse(data)
      if(doneh5.code == 200) {
          $.log('\n看看賺成功, 金币+ '+          $.log('\n'+doneh5.jinbi+'\n')+'\n')
           }else{
          $.log('\n'+doneh5.msg+'\n')
           }
          resolve()
    })
   })
  }


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
