function _classCallCheck(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(r,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function _createClass(r,e,o){return e&&_defineProperties(r.prototype,e),o&&_defineProperties(r,o),r}(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"s4/B":function(r,e,o){"use strict";o.d(e,"a",(function(){return t}));var n=o("fXoL"),t=function(){var r=function(){function r(){_classCallCheck(this,r)}return _createClass(r,[{key:"SetServerErrors",value:function(r,e,o){var n,t;Object.keys(e).forEach((function(e){void 0!==r.errors?(n=e[0].toUpperCase()+e.slice(1,e.length),void 0!==(t=r.errors[n])&&(void 0!==o.controls[e]?o.controls[e].setErrors({server:t}):o.control.setErrors({server:t}))):"invalid_grant"===r.error?o.controls.password.setErrors({server:["Invalid password!"]}):o.control.setErrors({server:["Some server error occured, try again later, please!"]})}))}}]),r}();return r.\u0275fac=function(e){return new(e||r)},r.\u0275prov=n.Mb({token:r,factory:r.\u0275fac}),r}()}}]);