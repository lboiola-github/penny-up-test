/* Penny Up store build: native extras when running inside the Capacitor app (does nothing in a browser). */
(function(){
  var C=window.Capacitor; if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  var KEY='p2e-save-v1';
  function call(plugin,method,opts){try{return C.nativePromise(plugin,method,opts||{})}catch(e){return Promise.reject(e)}}
  document.documentElement.classList.add('native');
  // The phone OS can wipe web storage, so every save is also written to native storage and restored from there if missing.
  var set=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){set.call(this,k,v);if(this===window.localStorage&&k===KEY)call('Preferences','set',{key:KEY,value:String(v)}).catch(function(){})};
  if(!localStorage.getItem(KEY)){call('Preferences','get',{key:KEY}).then(function(r){if(r&&r.value&&!localStorage.getItem(KEY)){set.call(localStorage,KEY,r.value);location.reload()}}).catch(function(){})}
  // Real haptics instead of navigator.vibrate (iOS has no web vibration at all).
  var vib=navigator.vibrate;
  navigator.vibrate=function(ms){var d=Array.isArray(ms)?ms[0]:ms;call('Haptics','impact',{style:d>=40?'MEDIUM':'LIGHT'}).catch(function(){try{vib&&vib.call(navigator,ms)}catch(e){}});return true};
  // "Piggy bank full" alert: a local notification scheduled when you leave the app and cancelled when you come back.
  // Inexact on purpose (no exact-alarm permission): a few minutes late is fine for this.
  var channel=false;
  window.PennyNative={
    permission:function(){return call('LocalNotifications','requestPermissions').catch(function(){})},
    notify:function(atMs,title,body,channelName){
      var go=function(){return call('LocalNotifications','schedule',{notifications:[{id:1,title:title,body:body,channelId:'piggy',
        smallIcon:'ic_stat_penny',iconColor:'#D9822B',isExactNotification:false,schedule:{at:new Date(atMs).toISOString(),allowWhileIdle:true}}]})};
      var p=channel?Promise.resolve():call('LocalNotifications','createChannel',{id:'piggy',name:channelName||'Piggy bank',importance:3,visibility:1}).then(function(){channel=true});
      return p.then(go).catch(function(){})
    },
    cancel:function(){return call('LocalNotifications','cancel',{notifications:[{id:1}]}).catch(function(){})}
  };
  call('StatusBar','hide').catch(function(){});
  window.addEventListener('load',function(){setTimeout(function(){call('SplashScreen','hide',{fadeOutDuration:250}).catch(function(){})},150)});
})();
