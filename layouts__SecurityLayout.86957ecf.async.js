(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"0jlH":function(e,t,n){"use strict";n.r(t);var r=n("XKWP"),a=n("N7Kx"),o=n("kFHX"),c=n("4jIl"),i=n("q1tI"),s=n.n(i),u=n("Hx5s"),l=n("Ty5D"),d=n("9kvl"),p=n("s4NR"),h=function(e){Object(o["a"])(n,e);var t=Object(c["a"])(n);function n(){var e;Object(r["a"])(this,n);for(var a=arguments.length,o=new Array(a),c=0;c<a;c++)o[c]=arguments[c];return e=t.call.apply(t,[this].concat(o)),e.state={isReady:!1},e}return Object(a["a"])(n,[{key:"componentDidMount",value:function(){this.setState({isReady:!0});var e=this.props.dispatch;e&&e({type:"user/fetchCurrent"})}},{key:"render",value:function(){var e=this.state.isReady,t=this.props,n=t.children,r=t.loading,a=t.currentUser,o=a&&a.token,c=Object(p["stringify"])({redirect:window.location.href});return!o&&r||!e?s.a.createElement(u["b"],null):o||"/user/login"===window.location.pathname?n:s.a.createElement(l["c"],{to:"/user/login?".concat(c)})}}]),n}(s.a.Component);t["default"]=Object(d["a"])((function(e){var t=e.user,n=e.loading;return{currentUser:t.currentUser,loading:n.models.user}}))(h)}}]);