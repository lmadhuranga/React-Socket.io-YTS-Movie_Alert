(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{34:function(e,t,n){e.exports=n(66)},39:function(e,t,n){},63:function(e,t){},66:function(e,t,n){"use strict";n.r(t);var o=n(0),i=n.n(o),a=n(32),c=n.n(a),s=(n(39),n(7)),l=n(8),r=n(10),u=n(9),v=n(11),m=n(33),f=n.n(m);console.log("process.env sss",Object({NODE_ENV:"production",PUBLIC_URL:""}));var d=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(r.a)(this,Object(u.a)(t).call(this,e))).state={movies:[],liveCount:0},n}return Object(v.a)(t,e),Object(l.a)(t,[{key:"setup",value:function(){var e=this,t=f()("/");t.on("connect",function(){var n=t.id;t.on("init-".concat(n),function(t){console.log("init called",t),e.setState({movies:t.latestMovies})}),console.log("Client => Connected => Server ID=>",t.id,t),t.on("newmovies",function(t){e.setState({movies:t.latestMovies})}),t.on("liveCount",function(t){e.setState({liveCount:t.liveCount})})}),t.on("disconnect",function(){var e=t.id;t.removeAllListeners("newmovies"),t.removeAllListeners("init-".concat(e)),t.removeAllListeners("liveCount"),t.off("ini t-".concat(e)),t.off("newmovies"),t.off("liveCount"),console.log("Socket Disconnected")})}},{key:"componentDidMount",value:function(e,t){setTimeout(this.setup.bind(this),1e3)}},{key:"render",value:function(){var e=this.state.movies.map(function(e){return i.a.createElement("li",{key:e.id}," ",i.a.createElement("img",{alt:e.title_long,src:e.small_cover_image})," ",e.title_long," - ",e.rating," ",e.genres.join())});return i.a.createElement("div",{className:"MovieList"},i.a.createElement("h2",null,"hello MovieLis2 (",this.state.liveCount,")"),i.a.createElement("ul",null,e))}}]),t}(o.Component),h=function(e){function t(){return Object(s.a)(this,t),Object(r.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{className:"App"},i.a.createElement(d,null))}}]),t}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(h,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[34,2,1]]]);
//# sourceMappingURL=main.8b594909.chunk.js.map