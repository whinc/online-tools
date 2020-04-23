(this["webpackJsonponline-tools"]=this["webpackJsonponline-tools"]||[]).push([[6],{227:function(e,a,t){"use strict";t.r(a);var n=t(162),r=t(163),l=t(153),c=t(166),o=t(0),u=t.n(o),s=t(42),i=t(226),m=t(229),g=t(217),f=t(188),p=t(228),E=t(221),d=t(219),v=t(230),b=t(220),x=t(223),h=t(224),O=t(222),j=t(43),y=t(225),S=t(234),w=t(56),C=t(17),R=t(175),N=t.n(R),M=t(177),k=t(233);var J,W,A=t(178),G=t(23),T=t(187),D=t(3),$=t(85),I=Object(w.a)((function(e){return{regexpContainer:{width:"100%",overflow:"auto",textAlign:"center"},error:{width:"100%",color:"red",overflow:"auto"}}})),P=function(e){var a=e.regexp,t=Object(c.a)(e,["regexp"]),n=Object(o.useRef)(null),r=I(),s=Object(k.a)(Object(M.a)(N.a.mark((function e(){return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){var t=document.createElement("script");t.src="./regulex.js",t.onload=function(){var a=window.require("regulex");e(a)},t.onerror=function(){a(new Error("load regulex error!"))},document.body.appendChild(t)})));case 1:case"end":return e.stop()}}),e)})))).value,i=Object(o.useState)(),m=Object(l.a)(i,2),g=m[0],p=m[1];return Object(o.useEffect)((function(){if(s&&n.current){n.current.innerHTML="";var e=s.parse,t=s.visualize,r=(0,s.Raphael)(n.current,0,0);try{t(e(a.source),a.flags,r),p(void 0)}catch(o){var l=o;if(o instanceof e.RegexSyntaxError){var c=["Error:"+o.message,""];"number"===typeof o.lastIndex&&(c.push(a.source),c.push("-".repeat(o.lastIndex)+"^")),l=new Error(c.join("\n"))}p(l)}}}),[a,s]),u.a.createElement(f.a,t,g&&u.a.createElement($.a,{className:r.error,component:"pre"},u.a.createElement("code",null,g.message)),u.a.createElement("div",{ref:n,className:r.regexpContainer,style:{height:g?0:"auto"}}))},_=t(189),L=t(179),z=function(e){var a=e.code,t=e.language;return u.a.createElement(_.a,Object.assign({},_.b,{code:a,language:t,theme:L.a}),(function(e){var a=e.className,t=e.style,n=e.tokens,l=e.getLineProps,c=e.getTokenProps;return u.a.createElement(f.a,{component:"pre",lineHeight:1.5,py:1,px:1,className:a,style:Object(r.a)({},t,{margin:0})},u.a.createElement(f.a,{component:"code"},n.map((function(e,a){return u.a.createElement("div",l({line:e,key:a}),e.map((function(e,a){return u.a.createElement("span",c({token:e,key:a}))})))}))))}))},U=t(232),F=t(84),H=t(180),B=t.n(H),V=t(185),X=t(69),Y=function(e){var a=e.text,t=Z(),n=Object(X.useSnackbar)().enqueueSnackbar;return u.a.createElement(f.a,{display:"flex",className:t.root},u.a.createElement(B.a,{text:a,onCopy:function(){return n("\u5df2\u590d\u5236!",{autoHideDuration:1500})}},u.a.createElement(U.a,{title:"\u590d\u5236",placement:"top"},u.a.createElement(F.a,null,u.a.createElement(V.a,null)))))},Z=Object(w.a)((function(e){return{root:{}}})),q=t(186),K=function(e){var a=e.href,t=e.title,n=void 0===t?"":t;return u.a.createElement(U.a,{title:n},u.a.createElement(F.a,{component:"a",href:a,target:"_blank"},u.a.createElement(q.a,null)))},Q=t(235),ee=function(e){var a=e.onSelect,t=ae();return u.a.createElement(f.a,{display:"flex",flexWrap:"wrap",className:t.tags},te.map((function(e){var t=e.label,n=e.source;return u.a.createElement(Q.a,{key:t,variant:"outlined",label:t,onClick:function(){return null===a||void 0===a?void 0:a({source:n,flags:""})}})})))},ae=Object(w.a)((function(e){return{tags:{"& > *":{marginRight:e.spacing(1),marginBottom:e.spacing(1)}}}})),te=[{label:"\u8eab\u4efd\u8bc1\u53f7",source:/^\d{17}[0-9Xx]|\d{15}$/.source},{label:"Email\u5730\u5740",source:/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.source},{label:"\u4e2d\u6587\u5b57\u7b26",source:/^[\u4e00-\u9fa5]+$/.source},{label:"\u53cc\u5b57\u8282\u5b57\u7b26(\u542b\u6c49\u5b57)",source:/^[^\x00-\xff]+$/.source},{label:"\u65f6\u95f4(\u65f6:\u5206:\u79d2)",source:/^([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.source},{label:"\u65e5\u671f(\u5e74:\u6708:\u65e5)",source:/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.source},{label:"IPv4\u5730\u5740",source:/^\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}$/.source},{label:"\u624b\u673a\u53f7",source:/^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.source}],ne=function(e){var a=e.source,t=e.flags,n=Object(o.useState)(""),r=Object(l.a)(n,2),c=r[0],s=r[1],i=Object(o.useMemo)((function(){var e,n,r,l,o;try{n=(e=new RegExp(a,t)).test(c),r=c.search(e)}catch(s){e="/".concat(a,"/").concat(t),l=o=s}var u=c.replace(/'/g,"\\'");return{code1:"const result = ".concat(e,".test('").concat(u,"')"),result1:n,error1:l,code2:"const result = '".concat(u,"'.search(").concat(e,")"),result2:r,error2:o}}),[t,a,c]),g=i.code1,p=i.result1,E=i.error1,d=i.code2,v=i.result2,b=i.error2;return Object(o.useEffect)((function(){console.log(g),console.log(p),console.log(d),console.log(v)}),[g,d,p,v]),u.a.createElement(f.a,{display:"flex",flexDirection:"column"},u.a.createElement(f.a,null,u.a.createElement(m.a,{variant:"outlined",label:"\u8f93\u5165\u6e90\u6587\u672c",multiline:!0,fullWidth:!0,value:c,onChange:function(e){return s(e.target.value)}})),u.a.createElement(f.a,{overflow:"auto"},u.a.createElement(f.a,{mt:2,display:"flex",alignItems:"center",flexWrap:"wrap",bgcolor:"rgb(246, 248, 250)"},u.a.createElement(f.a,{flexGrow:1},u.a.createElement(z,{code:"".concat(g),language:"javascript"})),u.a.createElement(f.a,{display:"flex"},u.a.createElement(K,{title:"RegExp.prototype.test() - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test"}),u.a.createElement(Y,{text:g}))),u.a.createElement(f.a,null,E?u.a.createElement($.a,{color:"error"},String(E)):u.a.createElement(z,{code:"// result\n"+p,language:"javascript"})),u.a.createElement(f.a,{mt:2,display:"flex",alignItems:"center",flexWrap:"wrap",bgcolor:"rgb(246, 248, 250)"},u.a.createElement(f.a,{flexGrow:1},u.a.createElement(z,{code:"".concat(d),language:"javascript"})),u.a.createElement(f.a,{display:"flex"},u.a.createElement(K,{title:"String.prototype.search() - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search"}),u.a.createElement(Y,{text:d}))),u.a.createElement(f.a,null,b?u.a.createElement($.a,{color:"error"},String(b)):u.a.createElement(z,{code:"// result\n"+v,language:"javascript"}))))},re="matchAll"in String.prototype,le=function(e){var a=e.source,t=e.flags,n=Object(o.useState)(""),r=Object(l.a)(n,2),c=r[0],s=r[1],i=Object(o.useMemo)((function(){var e,n,r,l,o,u,s;try{e=new RegExp(a,t)}catch(m){e="/".concat(a,"/").concat(t),o=u=s=m}if(!o){n=e.exec(c),r=c.match(e);try{l=c.matchAll(e)}catch(m){s=m}}var i=c.replace(/'/g,"\\'");return{code1:"const result = ".concat(e,".exec('").concat(i,"')"),result1:n,error1:o,code2:"const result = '".concat(i,"'.match(").concat(e,")"),result2:r,error2:u,code3:"const result ='".concat(i,"'.matchAll(").concat(e,")"),result3:l,error3:s}}),[t,a,c]),g=i.code1,p=i.result1,E=i.error1,d=i.code2,v=i.result2,b=i.error2,x=i.code3,h=i.result3,O=i.error3;return Object(o.useEffect)((function(){console.log(g),console.log(p),console.log(d),console.log(v),console.log(x),console.log(h)}),[g,d,x,p,v,h]),u.a.createElement(f.a,{display:"flex",flexDirection:"column"},u.a.createElement(f.a,null,u.a.createElement(m.a,{variant:"outlined",label:"\u8f93\u5165\u5f85\u5339\u914d\u6587\u672c",multiline:!0,fullWidth:!0,value:c,onChange:function(e){return s(e.target.value)}})),u.a.createElement(f.a,{overflow:"auto"},u.a.createElement(f.a,{mt:2,display:"flex",alignItems:"center",flexWrap:"wrap",bgcolor:"rgb(246, 248, 250)"},u.a.createElement(f.a,{flexGrow:1},u.a.createElement(z,{code:"".concat(g),language:"javascript"})),u.a.createElement(f.a,{display:"flex"},u.a.createElement(K,{title:"RegExp.prototype.exec() - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec"}),u.a.createElement(Y,{text:g}))),u.a.createElement(f.a,null,E?u.a.createElement($.a,{color:"error"},String(E)):u.a.createElement(z,{code:"// result\n"+ce(p),language:"javascript"})),u.a.createElement(f.a,{mt:2,display:"flex",alignItems:"center",flexWrap:"wrap",bgcolor:"rgb(246, 248, 250)"},u.a.createElement(f.a,{flexGrow:1},u.a.createElement(z,{code:"".concat(d),language:"javascript"})),u.a.createElement(f.a,{display:"flex"},u.a.createElement(K,{title:"String.prototype.match() - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match"}),u.a.createElement(Y,{text:d}))),u.a.createElement(f.a,null,b?u.a.createElement($.a,{color:"error"},String(b)):u.a.createElement(z,{code:"// result\n"+oe(v),language:"javascript"})),re&&u.a.createElement(u.a.Fragment,null,u.a.createElement(f.a,{mt:2,display:"flex",alignItems:"center",flexWrap:"wrap",bgcolor:"rgb(246, 248, 250)"},u.a.createElement(f.a,{flexGrow:1},u.a.createElement(z,{code:"".concat(x),language:"javascript"})),u.a.createElement(f.a,{display:"flex"},u.a.createElement(K,{title:"String.prototype.matchAll() - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll"}),u.a.createElement(Y,{text:x}))),u.a.createElement(f.a,null,O?u.a.createElement($.a,{color:"error"},String(O)):u.a.createElement(z,{code:ue(h),language:"javascript"})))))};function ce(e){var a;if(!e)return JSON.stringify(e);var t="[";return e.forEach((function(e,a){return t+="\n  ".concat(a,": ").concat(JSON.stringify(e),",")})),t+="\n  index: ".concat(JSON.stringify(e.index)),t+="\n  input: ".concat(JSON.stringify(e.input)),t+="\n  groups: ".concat(null===(a=JSON.stringify(e.groups,null,2))||void 0===a?void 0:a.replace(/\n/g,"\n  "),","),t+="\n  length: ".concat(JSON.stringify(e.length)),t+="\n]"}function oe(e){return!e||"index"in e?ce(e):JSON.stringify(e)}function ue(e){var a,t="";do{var n;a=e.next(),t+="// result.next()\n",t+="{\n  value: ".concat(null===(n=oe(a.value))||void 0===n?void 0:n.replace(/\n/g,"\n  "),",\n  done: ").concat(a.done,"\n}\n")}while(!a.done);return t}!function(e){e.JavaScript="JavaScript"}(J||(J={})),function(e){e[e.TEST=0]="TEST",e[e.MATCH=1]="MATCH",e[e.REPLACE=2]="REPLACE",e[e.COMMONLY_USED_REGEXP=3]="COMMONLY_USED_REGEXP"}(W||(W={}));var se=Object(w.a)((function(e){return{regexpInput:{fontSize:"1.4em",fontFamily:e.codeFontFamily},code:{fontFamily:e.codeFontFamily},tags:{"& > *":{marginRight:e.spacing(1),marginBottom:e.spacing(1)}},expand:{transform:"rotate(0deg)",transition:e.transitions.create("transform",{duration:e.transitions.duration.shortest})},expandOpen:{transform:"rotate(180deg)"}}})),ie=function(e){var a=e.name,t=e.value,n=se();return u.a.createElement(f.a,{display:"flex",className:n.code,mt:1},u.a.createElement(f.a,{whiteSpace:"nowrap"},a,":\xa0"),u.a.createElement(f.a,{style:{wordBreak:"break-all"}},t))},me=function(e){var a=e.children,t=e.id,n=e.value,r=Object(c.a)(e,["children","id","value"]);return u.a.createElement(f.a,r,t===n&&u.a.createElement(f.a,{pt:3},a))},ge=function(e){var a=e.regexp,t=e.value,n=e.onChange,r=e.newValue,c=e.onNewValueChange,s=Object(o.useMemo)((function(){var e;try{e=new RegExp(a.source,a.flags)}catch(c){return["",null]}var n=t.replace(e,r),l=e.exec(t);return console.log("matches:",l),[n,l]}),[a.flags,a.source,r,t]),i=Object(l.a)(s,2),g=i[0],p=i[1];return u.a.createElement(u.a.Fragment,null,u.a.createElement(f.a,null,u.a.createElement(m.a,{variant:"outlined",label:"\u8f93\u5165\u6e90\u6587\u672c",multiline:!0,fullWidth:!0,value:t,onChange:function(e){return n(e.target.value)}})),null!==p&&u.a.createElement(f.a,{mt:2},u.a.createElement(ie,{name:"$$",value:"$"}),u.a.createElement(ie,{name:"$&",value:p[0]}),u.a.createElement(ie,{name:"$`",value:p.input.substring(0,p.index)}),u.a.createElement(ie,{name:"$'",value:p.input.substring(p.index+p[0].length)}),p.map((function(e,a){return a>=1?u.a.createElement(ie,{name:"$"+a,value:e}):null}))),u.a.createElement(f.a,{mt:2},u.a.createElement(m.a,{variant:"outlined",label:"\u8f93\u5165\u66ff\u6362\u6587\u672c",multiline:!0,fullWidth:!0,value:r,onChange:function(e){return c(e.target.value)}})),u.a.createElement(f.a,{mt:2},u.a.createElement(f.a,null,g)))},fe=[{flag:"g",label:"\u5168\u5c40\u5339\u914d"},{flag:"i",label:"\u5ffd\u7565\u5927\u5c0f\u5199"},{flag:"m",label:"\u591a\u884c\u5339\u914d"}],pe=function(){var e=function(){var e,a=Object(G.h)(),t=a.pathname,n=a.search,r=Object(G.g)(),c=new URLSearchParams(n),u={},s=Object(A.a)(c);try{for(s.s();!(e=s.n()).done;){var i=Object(l.a)(e.value,2),m=i[0],g=i[1];u[m]=g}}catch(f){s.e(f)}finally{s.f()}return[u,Object(o.useCallback)((function(e){var a=new URLSearchParams(e).toString();r.replace({pathname:t,search:a})}),[r,t])]}(),a=Object(l.a)(e,2),t=a[0],n=a[1];return[{source:t.source||"",flags:t.flags||""},Object(o.useCallback)((function(e){n(e)}),[n])]};a.default=function(){var e=se(),a=Object(o.useState)(W.TEST),t=Object(l.a)(a,2),c=t[0],m=t[1],w=pe(),R=Object(l.a)(w,2),N=R[0],M=R[1],k=Object(o.useState)(""),A=Object(l.a)(k,2),G=A[0],$=A[1],I=Object(o.useState)(""),_=Object(l.a)(I,2),L=_[0],U=_[1],F=Object(C.a)(),H=Object(d.a)(F.breakpoints.down("sm")),B=Object(o.useState)(!1),V=Object(l.a)(B,2),X=V[0],Z=V[1],q=Object(o.useState)(J.JavaScript),Q=Object(l.a)(q,2),ae=Q[0],te=Q[1],re=u.a.createElement(f.a,{pt:"6px",pb:"7px",color:"primary.main"},"/"),ce=Object(o.useMemo)((function(){var e="";return X?(c===W.TEST?e='const str = "'.concat(G,'";\n/').concat(N.source,"/").concat(N.flags,".test(str)"):c===W.MATCH?e='const str = "'.concat(G,'";\n/').concat(N.source,"/").concat(N.flags,".exec(str)"):c===W.REPLACE&&(e='const str = "'.concat(G,'";\nstr.replace(/').concat(N.source,"/").concat(N.flags,', "').concat(L,'")')),e):e}),[X,L,N,c,G]);return u.a.createElement(s.a,{title:"\u6b63\u5219\u8868\u8fbe\u5f0f"},u.a.createElement(f.a,{display:"flex",flexDirection:"column"},u.a.createElement(f.a,{display:"flex"},u.a.createElement(f.a,{flexGrow:{xs:2,md:4},flexBasis:0},u.a.createElement(g.a,{className:e.regexpInput,startAdornment:re,placeholder:"pattern",fullWidth:!0,value:N.source,onChange:function(e){return M(Object(r.a)({},N,{source:e.target.value}))}})),u.a.createElement(f.a,{flexGrow:{xs:1,md:1},flexBasis:0},u.a.createElement(g.a,{className:e.regexpInput,startAdornment:re,placeholder:"flags",fullWidth:!0,value:N.flags,onChange:function(e){var a=e.target.value;a=a.replace(/[^gim]/,""),"gim".split("").forEach((function(e){a.includes(e)&&(a=a.replace(new RegExp(e,"g"),"")+e)})),M(Object(r.a)({},N,{flags:a}))}}))),u.a.createElement(f.a,{display:"flex",mt:1,flexWrap:"wrap"},fe.map((function(e){return u.a.createElement(b.a,{control:u.a.createElement(v.a,{checked:N.flags.includes(e.flag),onChange:function(a,t){return function(e,a){var t=N.flags.replace(new RegExp(e,"g"),"");t+=a?e:"",M(Object(r.a)({},N,{flags:t}))}(e.flag,t)},color:"primary"}),label:e.label})})),u.a.createElement(f.a,{flexGrow:1,display:"flex",justifyContent:"flex-end",alignItems:"center",mr:1},u.a.createElement(K,{title:"Regular expressions - MDN",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"}),u.a.createElement(Y,{text:"/".concat(N.source,"/").concat(N.flags)}))),u.a.createElement(f.a,{mt:1},u.a.createElement(P,{regexp:N})),u.a.createElement(f.a,{mt:2},u.a.createElement(p.a,{value:c,onChange:function(e,a){return m(a)},textColor:"primary",indicatorColor:"primary",variant:H?"fullWidth":"standard"},u.a.createElement(E.a,{label:"\u6d4b\u8bd5"}),u.a.createElement(E.a,{label:"\u5339\u914d"}),u.a.createElement(E.a,{label:"\u66ff\u6362"}),u.a.createElement(E.a,{label:"\u5e38\u7528\u6b63\u5219"})),u.a.createElement(me,{id:W.TEST,value:c},u.a.createElement(ne,{source:N.source,flags:N.flags})),u.a.createElement(me,{id:W.MATCH,value:c},u.a.createElement(le,{source:N.source,flags:N.flags})),u.a.createElement(me,{id:W.REPLACE,value:c},u.a.createElement(ge,{regexp:N,value:G,onChange:$,newValue:L,onNewValueChange:U})),u.a.createElement(me,{id:W.COMMONLY_USED_REGEXP,value:c},u.a.createElement(ee,{onSelect:function(e){return M(e)}})))),u.a.createElement(f.a,{my:2,display:"none"},u.a.createElement(O.a,null,u.a.createElement(x.a,null),u.a.createElement(h.a,null,X&&u.a.createElement(f.a,{ml:1},u.a.createElement(i.a,{value:ae,onChange:function(e){return te(e.target.value)}},u.a.createElement(S.a,{value:J.JavaScript},"JavaScript"))),u.a.createElement(y.a,{style:{marginLeft:"auto"},endIcon:u.a.createElement(T.a,{className:Object(D.a)(e.expand,Object(n.a)({},e.expandOpen,X))}),onClick:function(){return Z(!X)}},"\u751f\u6210\u4ee3\u7801")),u.a.createElement(j.a,{in:X},u.a.createElement(x.a,null,u.a.createElement(z,{code:ce,language:"javascript"})),u.a.createElement(h.a,null,u.a.createElement(Y,{text:ce}))))))}}}]);
//# sourceMappingURL=6.9c5f7cc9.chunk.js.map