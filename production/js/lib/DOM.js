!function(){var e={};e.create=function(e){var t=document.createDocumentFragment(),n=document.createElement("div");for(n.innerHTML=e;n.childNodes[0];)t.appendChild(n.childNodes[0]);return t},e.find=function(e,t){var n,l=e.match(/^(\W)?(.*)/),s="getElement"+(l[1]?"#"==l[1]?"ById":"sByClassName":"sByTagName");return"getElementsByClassName"!==s||document.getElementsByClassName?n=(t||document)[s](l[2]):(n=(t||document).querySelectorAll(e),/[\ \>]/.test(e)&&console.log("WARNING: Using IE8 querySelectorAll fallback. This only supports simple selectors, not descendants.")),n};var t=new NS("lib");t.DOM=e}();
