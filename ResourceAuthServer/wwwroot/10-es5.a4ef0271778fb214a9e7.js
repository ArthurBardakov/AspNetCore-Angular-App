function _defineProperties(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function _createClass(e,n,r){return n&&_defineProperties(e.prototype,n),r&&_defineProperties(e,r),e}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"s+ND":function(e,n,r){"use strict";r.r(n),r.d(n,"UserInfoModule",(function(){return se}));var t,i,a,o=r("ofXK"),l=r("tyNb"),c=r("IzEk"),s=r("1G5W"),u=r("nYR2"),b=r("ds6q"),f=r("DBRY"),d=r("fXoL"),m=r("aR35"),g=r("B8yH"),h=function e(n,r,t){_classCallCheck(this,e),this.op=n,this.path=r,this.value=t},p=function(e){return e.add="add",e.remove="remove",e.replace="replace",e}({}),v=r("tk/3"),C=r("3wlO"),y=((t=function(){function e(n,r,t){_classCallCheck(this,e),this.http=n,this.dataStateSrc=r,this.config=t}return _createClass(e,[{key:"EditProfile",value:function(e){return this.http.patch(this.config.apiEndpoint+g.a[this.dataStateSrc.UserRole+"Profile"],this.generatePatchDocument(e))}},{key:"generatePatchDocument",value:function(e){var n=[],r=this.dataStateSrc.User;return this.dataStateSrc.UserProps.forEach((function(t){e[t]=""===e[t]?null:e[t],null===r[t]&&null!==e[t]?n.push(new h(p.add,"/"+t,e[t])):null!==r[t]&&null===e[t]?n.push(new h(p.remove,"/"+t)):r[t]!==e[t]&&n.push(new h(p.replace,"/"+t,e[t]))})),n}}]),e}()).\u0275fac=function(e){return new(e||t)(d.ac(v.b),d.ac(C.a),d.ac(m.a))},t.\u0275prov=d.Mb({token:t,factory:t.\u0275fac,providedIn:"root"}),t),D=r("jFld"),E=r("JqCM"),S=r("3Pt+"),M=r("LYRX"),x=((a=function(){function e(n){_classCallCheck(this,e),this.minValue=n,this.minValue=Number(this.minValue)}return _createClass(e,[{key:"validate",value:function(e){return null!==e.value&&""!==e.value&&Number(e.value)<this.minValue?{min:!0}:null}}]),e}()).\u0275fac=function(e){return new(e||a)(d.bc("min"))},a.\u0275dir=d.Lb({type:a,selectors:[["","min",""]],features:[d.Cb([{provide:S.h,useExisting:a,multi:!0}])]}),a),V=((i=function(){function e(n){_classCallCheck(this,e),this.maxValue=n,this.maxValue=Number(this.maxValue)}return _createClass(e,[{key:"validate",value:function(e){return Number(e.value)>this.maxValue?{max:!0}:null}}]),e}()).\u0275fac=function(e){return new(e||i)(d.bc("max"))},i.\u0275dir=d.Lb({type:i,selectors:[["","max",""]],features:[d.Cb([{provide:S.h,useExisting:i,multi:!0}])]}),i),U=r("kmnG"),W=["ProfileForm"];function _(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function k(e,n){if(1&e&&(d.Ub(0),d.Cc(1,_,2,1,"mat-error",19),d.Tb()),2&e){d.ic();var r=d.tc(1);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function w(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Last name field is required."),d.Vb())}function O(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Last name length must be between 2 and 25 symbols."),d.Vb())}function F(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1," Last name cannot have white spaces."),d.Vb())}function I(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function P(e,n){if(1&e&&(d.Ub(0),d.Cc(1,I,2,1,"mat-error",19),d.Tb()),2&e){d.ic(2);var r=d.tc(5);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function N(e,n){if(1&e&&(d.Ub(0),d.Cc(1,w,2,0,"mat-error",2),d.Cc(2,O,2,0,"mat-error",2),d.Cc(3,F,2,0,"mat-error",2),d.Cc(4,P,2,1,"ng-container",2),d.Tb()),2&e){d.ic();var r=d.tc(5);d.Db(1),d.nc("ngIf",null==r?null:r.errors.required),d.Db(1),d.nc("ngIf",null==r?null:r.errors.minlength),d.Db(1),d.nc("ngIf",null==r?null:r.errors.validateEmpty),d.Db(1),d.nc("ngIf",null==r?null:r.errors.server)}}function q(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"First name field is required."),d.Vb())}function R(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"First name length must be between 2 and 20 symbols."),d.Vb())}function T(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1," First name cannot have white spaces."),d.Vb())}function j(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function $(e,n){if(1&e&&(d.Ub(0),d.Cc(1,j,2,1,"mat-error",19),d.Tb()),2&e){d.ic(2);var r=d.tc(9);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function z(e,n){if(1&e&&(d.Ub(0),d.Cc(1,q,2,0,"mat-error",2),d.Cc(2,R,2,0,"mat-error",2),d.Cc(3,T,2,0,"mat-error",2),d.Cc(4,$,2,1,"ng-container",2),d.Tb()),2&e){d.ic();var r=d.tc(9);d.Db(1),d.nc("ngIf",null==r?null:r.errors.required),d.Db(1),d.nc("ngIf",null==r?null:r.errors.minlength),d.Db(1),d.nc("ngIf",null==r?null:r.errors.validateEmpty),d.Db(1),d.nc("ngIf",null==r?null:r.errors.server)}}function L(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"You have to be at least 18 years old."),d.Vb())}function Q(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Age must be between 18 and 100."),d.Vb())}function B(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function Y(e,n){if(1&e&&(d.Ub(0),d.Cc(1,B,2,1,"mat-error",19),d.Tb()),2&e){d.ic(2);var r=d.tc(16);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function J(e,n){if(1&e&&(d.Ub(0),d.Cc(1,L,2,0,"mat-error",2),d.Cc(2,Q,2,0,"mat-error",2),d.Cc(3,Y,2,1,"ng-container",2),d.Tb()),2&e){d.ic();var r=d.tc(16);d.Db(1),d.nc("ngIf",null==r?null:r.errors.min),d.Db(1),d.nc("ngIf",null==r?null:r.errors.max),d.Db(1),d.nc("ngIf",null==r?null:r.errors.server)}}function X(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Specialization cannot have white spaces."),d.Vb())}function A(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Specialization must be at least 3 characters long."),d.Vb())}function G(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function K(e,n){if(1&e&&(d.Ub(0),d.Cc(1,G,2,1,"mat-error",19),d.Tb()),2&e){d.ic(2);var r=d.tc(22);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function H(e,n){if(1&e&&(d.Ub(0),d.Cc(1,X,2,0,"mat-error",2),d.Cc(2,A,2,0,"mat-error",2),d.Cc(3,K,2,1,"ng-container",2),d.Tb()),2&e){d.ic();var r=d.tc(22);d.Db(1),d.nc("ngIf",null==r?null:r.errors.validateEmpty),d.Db(1),d.nc("ngIf",null==r?null:r.errors.minlength),d.Db(1),d.nc("ngIf",null==r?null:r.errors.server)}}function Z(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Experience have to be at least 1 year."),d.Vb())}function ee(e,n){1&e&&(d.Wb(0,"mat-error"),d.Ec(1,"Experience can't be more than 45 years."),d.Vb())}function ne(e,n){if(1&e&&(d.Wb(0,"mat-error"),d.Ec(1),d.Vb()),2&e){var r=n.$implicit;d.Db(1),d.Fc(r)}}function re(e,n){if(1&e&&(d.Ub(0),d.Cc(1,ne,2,1,"mat-error",19),d.Tb()),2&e){d.ic(2);var r=d.tc(26);d.Db(1),d.nc("ngForOf",null==r?null:r.errors.server)}}function te(e,n){if(1&e&&(d.Ub(0),d.Cc(1,Z,2,0,"mat-error",2),d.Cc(2,ee,2,0,"mat-error",2),d.Cc(3,re,2,1,"ng-container",2),d.Tb()),2&e){d.ic();var r=d.tc(26);d.Db(1),d.nc("ngIf",null==r?null:r.errors.min),d.Db(1),d.nc("ngIf",null==r?null:r.errors.max),d.Db(1),d.nc("ngIf",null==r?null:r.errors.server)}}var ie,ae,oe=function(e){return{invisible:e}},le=((ie=function(){function e(n,r,t,i,a,o){var l=this;_classCallCheck(this,e),this.infoSrc=n,this.errorSrc=r,this.datePipe=t,this.dataStateSrc=i,this.spinner=a,this.route=o,this.Roles=f.a,this.destroyed$=new b.Subject,this.route.data.pipe(Object(c.a)(1)).subscribe((function(e){return l.User=Object.assign({},e.user)})),this.ModelsEqual=!0,this.SaveBtnDisabled=!1}return _createClass(e,[{key:"OnChange",value:function(){var e=this;this.ModelsEqual=this.ProfileForm.invalid||this.dataStateSrc.UserProps.every((function(n){return e.propsEqual(e.dataStateSrc.User[n],e.User[n])}))}},{key:"propsEqual",value:function(e,n){return null===e&&this.isNullOrEmpty(n)||e===n}},{key:"isNullOrEmpty",value:function(e){return null===e||""===e}},{key:"OnSaveChanges",value:function(){var e=this;this.disabledForm(),this.infoSrc.EditProfile(this.User).pipe(Object(c.a)(1),Object(s.a)(this.destroyed$),Object(u.a)((function(){return e.enableForm()}))).subscribe((function(){return e.editSuccess()}),(function(n){return e.errorSrc.SetServerErrors(n,e.dataStateSrc.User,e.ProfileForm)}))}},{key:"disabledForm",value:function(){this.spinner.show(),this.SaveBtnDisabled=!0}},{key:"enableForm",value:function(){this.spinner.hide(),this.SaveBtnDisabled=!1}},{key:"editSuccess",value:function(){this.ModelsEqual=!0,this.dataStateSrc.User=Object.assign({},this.User)}},{key:"ngOnDestroy",value:function(){this.destroyed$.next(),this.destroyed$.complete()}}]),e}()).\u0275fac=function(e){return new(e||ie)(d.Qb(y),d.Qb(D.a),d.Qb(o.e),d.Qb(C.a),d.Qb(E.c),d.Qb(l.a))},ie.\u0275cmp=d.Kb({type:ie,selectors:[["app-user-info"]],viewQuery:function(e,n){var r;1&e&&d.Ic(W,!0),2&e&&d.sc(r=d.fc())&&(n.ProfileForm=r.first)},decls:31,vars:23,consts:[["id","userProfile","novalidate","",3,"keyup","ngSubmit"],["ProfileForm","ngForm"],[4,"ngIf"],[1,"form_group"],["type","text","name","lastName","required","","validateEmpty","","minlength","2","maxlength","25","placeholder","Last name",1,"form_field",3,"ngModel","ngModelChange"],["lastName","ngModel"],["name","firstName","required","","validateEmpty","","minlength","2","maxlength","20","placeholder","First name",1,"form_field",3,"ngModel","ngModelChange"],["firstName","ngModel"],["disabled","disabled","name","userName","placeholder","Email",1,"form_field",3,"ngModel"],["userName","ngModel"],["name","age","type","number","min","18","max","100","placeholder","Age",1,"form_field",3,"ngModel","ngModelChange"],["age","ngModel"],[1,"form_group",3,"ngClass"],["disabled","disabled","name","registryDate","type","text",1,"form_field",3,"ngModel"],["name","specialization","validateEmpty","","minlength","3","maxlength","40","placeholder","Specialization",1,"form_field",3,"ngModel","ngModelChange"],["spc","ngModel"],["name","yearsOfExperience","type","number","min","1","max","45","placeholder","Experience",1,"form_field",3,"ngModel","ngModelChange"],["exp","ngModel"],["id","save_btn","type","submit",3,"disabled"],[4,"ngFor","ngForOf"]],template:function(e,n){if(1&e&&(d.Wb(0,"form",0,1),d.ec("keyup",(function(){return n.OnChange()}))("ngSubmit",(function(){return n.OnSaveChanges()})),d.Cc(2,k,2,1,"ng-container",2),d.Wb(3,"div",3),d.Wb(4,"input",4,5),d.ec("ngModelChange",(function(e){return n.User.lastName=e})),d.Vb(),d.Cc(6,N,5,4,"ng-container",2),d.Vb(),d.Wb(7,"div",3),d.Wb(8,"input",6,7),d.ec("ngModelChange",(function(e){return n.User.firstName=e})),d.Vb(),d.Cc(10,z,5,4,"ng-container",2),d.Vb(),d.Wb(11,"div",3),d.Rb(12,"input",8,9),d.Vb(),d.Wb(14,"div",3),d.Wb(15,"input",10,11),d.ec("ngModelChange",(function(e){return n.User.age=e})),d.Vb(),d.Cc(17,J,4,3,"ng-container",2),d.Vb(),d.Wb(18,"div",12),d.Rb(19,"input",13),d.Vb(),d.Wb(20,"div",12),d.Wb(21,"input",14,15),d.ec("ngModelChange",(function(e){return n.User.specialization=e})),d.Vb(),d.Cc(23,H,4,3,"ng-container",2),d.Vb(),d.Wb(24,"div",12),d.Wb(25,"input",16,17),d.ec("ngModelChange",(function(e){return n.User.yearsOfExperience=e})),d.Vb(),d.Cc(27,te,4,3,"ng-container",2),d.Vb(),d.Wb(28,"div",3),d.Wb(29,"button",18),d.Ec(30," Save changes "),d.Vb(),d.Vb(),d.Vb()),2&e){var r=d.tc(1),t=d.tc(5),i=d.tc(9),a=d.tc(16),o=d.tc(22),l=d.tc(26);d.Db(2),d.nc("ngIf",r.invalid&&(null==r||null==r.errors?null:r.errors.server)),d.Db(2),d.nc("ngModel",n.User.lastName),d.Db(2),d.nc("ngIf",t.invalid&&t.dirty),d.Db(2),d.nc("ngModel",n.User.firstName),d.Db(2),d.nc("ngIf",i.invalid&&i.dirty),d.Db(2),d.nc("ngModel",n.User.userName),d.Db(3),d.nc("ngModel",n.User.age),d.Db(2),d.nc("ngIf",a.invalid&&a.dirty),d.Db(1),d.nc("ngClass",d.qc(17,oe,n.dataStateSrc.UserRole===n.Roles.doctor)),d.Db(1),d.nc("ngModel",n.datePipe.transform(n.User.registryDate,"dd-MM-yyyy")),d.Db(1),d.nc("ngClass",d.qc(19,oe,n.dataStateSrc.UserRole===n.Roles.patient)),d.Db(1),d.nc("ngModel",n.User.specialization),d.Db(2),d.nc("ngIf",o.invalid&&o.dirty),d.Db(1),d.nc("ngClass",d.qc(21,oe,n.dataStateSrc.UserRole===n.Roles.patient)),d.Db(1),d.nc("ngModel",n.User.yearsOfExperience),d.Db(2),d.nc("ngIf",l.invalid&&l.dirty),d.Db(2),d.nc("disabled",n.ModelsEqual||n.SaveBtnDisabled)}},directives:[S.q,S.l,S.m,o.l,S.b,S.p,M.a,S.g,S.f,S.k,S.n,S.o,x,V,o.j,o.k,U.b],styles:["#userProfile[_ngcontent-%COMP%]{display:flex;flex-direction:column;max-width:270px;height:auto;max-height:345px;margin-left:2rem}.form_group[_ngcontent-%COMP%]{margin-bottom:.7rem}.form_field[_ngcontent-%COMP%]{width:-webkit-fill-available;max-width:220px;min-width:165px;height:22px;border-radius:8px;border-top:none;border-bottom:none;border-right:none;padding:.375rem .75rem;box-shadow:inset 20px -8px 25px 0 rgba(59,208,98,.38);background-color:hsla(0,0%,100%,0);color:#495057;outline:none;font-size:.95rem}#save_btn[_ngcontent-%COMP%]{padding:.55rem;font-size:.875rem;border-radius:10px;margin-bottom:.7rem;background-color:#28a745;color:#fff;border:none;cursor:pointer}#save_btn[_ngcontent-%COMP%]:disabled{opacity:.7;cursor:default}"]}),ie),ce=r("d2mR"),se=((ae=function e(){_classCallCheck(this,e)}).\u0275mod=d.Ob({type:ae}),ae.\u0275inj=d.Nb({factory:function(e){return new(e||ae)},providers:[o.e,y,D.a],imports:[[ce.a,l.f.forChild([{path:"",component:le}])]]}),ae)}}]);