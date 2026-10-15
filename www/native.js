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
  call('StatusBar','hide').catch(function(){});
  window.addEventListener('load',function(){setTimeout(function(){call('SplashScreen','hide',{fadeOutDuration:250}).catch(function(){})},150)});
})();
