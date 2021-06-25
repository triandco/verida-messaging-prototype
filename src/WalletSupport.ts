type Browser = "Edge" | "Firefox" | "Chrome" | "Brave";

export function isMetaMaskAvailable(): boolean{
  return window['ethereum'] !== null && window['ethereum'] !== undefined
}

function getBrowser(): Browser | null{
  if( /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)){
    return "Chrome";
  }else if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    return "Firefox";
  }else if(window.navigator.userAgent.indexOf("Edge") > -1){
    return "Edge"
  }else if(navigator['brave']!==null && navigator['brave']!==undefined){
    return "Brave";
  }else{
    return null;
  }
}

export function getMetamaskExtensionLink(){
  let url: string;
  const browser = getBrowser();
  switch (browser){
    case null:
      //undefined
      break;
    case 'Chrome':
      url = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en';
      break;
    case 'Firefox':
      url = 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
      break;
    case 'Edge':
      url = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en';
      break;
    case 'Brave':
      url = 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US';
      break;
    default:
      // url undefined
      break;
  }
  return url;
}
