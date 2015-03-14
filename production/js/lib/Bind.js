!function(){"use strict";function e(){function e(e){this.dataAttr="data-bind-"+e,this.updateMessage=e+":change",this.addMessage=e+":add",this.changeHandlerProxy=t(this.changeHandler,this),this.updateProxy=t(this.update,this),this.attachProxy=t(this.attach,this),this.attributes={},a.subscribe(this.updateMessage,this.updateProxy),a.subscribe(this.addMessage,this.attachProxy),this.attach()}var t=NS.use("lib.Delegate"),a=NS.use("lib.Events"),n=e.prototype;n.changeHandler=function(e){var t=e.target||e.srcElement,n=t.getAttribute(this.dataAttr),s=t.tagName.toLowerCase();"input"===s||"textarea"===s||"select"===s?a.trigger(this.updateMessage,[n,t.value]):a.trigger(this.updateMessage,[n,t.innerHTML])},n.update=function(e,t){var a,n=NS.global.document.querySelectorAll("["+this.dataAttr+"="+e+"]");this.attributes[e]=t;for(var s=n.length;s--;)a=n[s].tagName.toLowerCase(),"input"===a||"textarea"===a||"select"===a?n[s].value=t:n[s].innerHTML=t},n.attach=function(){NS.global.document.addEventListener?(NS.global.document.removeEventListener("change",this.changeHandlerProxy,!1),NS.global.document.removeEventListener("input",this.changeHandlerProxy,!1),NS.global.document.addEventListener("change",this.changeHandlerProxy,!1),NS.global.document.addEventListener("input",this.changeHandlerProxy,!1)):(console.log("WARNING: IE8 binding will not update on DOM changes"),NS.global.document.detachEvent("onchange",this.changeHandlerProxy),NS.global.document.attachEvent("onchange",this.changeHandlerProxy))},n.set=function(e,t){a.trigger(this.updateMessage,[e,t])},n.get=function(e){return this.attributes[e]},n.destroy=function(){NS.global.document.addEventListener?(NS.global.document.removeEventListener("change",this.changeHandlerProxy,!1),NS.global.document.removeEventListener("input",this.changeHandlerProxy,!1)):NS.global.document.detachEvent("onchange",this.changeHandlerProxy),a.unsubscribe(this.updateMessage,this.updateProxy),a.unsubscribe(this.addMessage,this.attachProxy)};var s=new NS("lib");s.Bind=e}NS.load(["lib.Delegate","lib.Events"],e,this)}();
