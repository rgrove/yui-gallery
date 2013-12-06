YUI.add("gallery-sm-dragdrop",function(e,t){var n=e.DOM,r=e.config.doc,i=r.body,s=e.ClassNameManager.getClassName,o=e.config.win,u=!!e.UA.webkit,a=!0,f=typeof navigator!="undefined"&&/^mac/i.test(navigator.platform),l=o&&o.pageXOffset!==undefined&&o.pageYOffset!==undefined,c="drag",h="dragend",p="dragenter",d="dragleave",v="dragover",m="dragstart",g="drop",y=e.Base.create("dragdrop",e.Base,[],{classNames:{dragging:s("dragging"),dragover:s("dragover"),droppable:s("droppable")},initializer:function(){this._dragState={},this._publishedEvents={},this._container=this.get("container"),this._distanceThreshold=this.get("distanceThreshold"),this._dragHandleSelector=this.get("dragHandleSelector"),this._dragSelector=this.get("dragSelector"),this._scrollContainer=this.get("scrollContainer"),this._scrollMargin=this.get("scrollMargin"),this._scrollSelector=this.get("scrollSelector"),this._touchCancelDistance=this.get("touchCancelDistance"),this._touchDelay=this.get("touchDelay"),this._attachEvents()},destructor:function(){this._endDrag(),this._detachEvents(),clearTimeout(this._scrollEventThrottle),this._dragState=null,this._publishedEvents=null},_attachEvents:function(){this._events&&this._detachEvents();var t=this._container,n=e.one(r),s=this._dragSelector;this._containerIsBody=this._container._node===i,this._events=[this.after(["containerChange","distanceThresholdChange","dragHandleSelectorChange","dragSelectorChange","scrollContainerChange","scrollMarginChange","scrollSelectorChange","touchCancelDistanceChange","touchDelayChange"],this._cacheAttrValue),this.after(["containerChange","dragSelectorChange"],this._reinitialize),this.after(["dropSelectorChange","scrollContainerChange","scrollSelectorChange"],this.sync),t.delegate("dragstart",this._onNativeDragStart,s,this),t.delegate("gesturemovestart",this._onDraggableMoveStart,s,{},this),n.on("gesturemove",this._onDocMove,{standAlone:!0},this),n.on("gesturemoveend",this._onDocMoveEnd,{standAlone:!0},this),e.one(o).after("scroll",this._afterWindowScroll,this)],this._containerIsBody||this._events.push(t.on("scroll",this._onContainerScroll,this))},_detachEvents:function(){this._events&&((new e.EventHandle(this._events)).detach(),this._events=null)},sync:function(){return this._dragState.dragging&&(this._viewportScrollOffsets=this._getViewportScrollOffsets(),this._cacheBoundingRects(),(this._scrollContainer||this._scrollSelector)&&this._cacheScrollRects()),this},_cacheAttrValue:function(e){this["_"+e.attrName]=e.newVal},_cacheBoundingRects:function(){if(a){this._dropElements=e.Selector.query(this.get("dropSelector"),this._container._node);return}var t=this._proxyOrDragNode()._node,n=e.Selector.query(this.get("dropSelector"),this._container._node),r=this._dropRects=[],i,s;for(var o=0,u=n.length;o<u;o++)i=n[o],i!==t&&(s=this._getAbsoluteBoundingRect(i),s.el=i,r.push(s));r.sort(function(e,t){return e.top-t.top||e.left-t.left})},_cacheScrollRects:function(){if(a)return;var t=this._scrollRects=[],n=[];this._scrollContainer&&n.push(this._container._node),this._scrollSelector&&Array.prototype.push.apply(n,e.Selector.query(this._scrollSelector,this._container._node));if(!n.length)return t;var s=r.documentElement,o=this._viewportScrollOffsets,u,f,l,c,h,p;for(var d=0,v=n.length;d<v;d++){l=n[d],l===i?(u=s.clientHeight,f=s.clientWidth):(u=l.clientHeight,f=l.clientWidth),h=l.scrollHeight>u,c=l.scrollWidth>f;if(h||c)p=this._getAbsoluteBoundingRect(l),p.el=l,p.isVertical=h,p.isHorizontal=c,l===i&&(p.bottom=o[1]+u,p.left=o[0],p.right=o[0]+f,p.top=o[1]),t.push(p)}return t.sort(function(e,t){return e.top-t.top||e.left-t.left}),t},_endDrag:function(){var t=this._dragState;if(t.pending)this._endPendingDrag();else if(t.dragging){var n=this._proxyOrDragNode();t.dropNode&&this._fireDragLeave(),a&&(n._node.style.pointerEvents="auto"),n.removeClass(this.classNames.dragging),this._publishAndFire(h,e.merge(t,{deltaXY:this._getDelta(),dropped:!!t.dropped,state:t}))}this._dragState={},this._dropRects=null,this._scrollIntersections=null,this._scrollRects=null,this._scrollTimeout=clearTimeout(this._scrollTimeout)},_endPendingDrag:function(){this._pendingDragTimeout=clearTimeout(this._pendingDragTimeout),this._restoreTouchCallout()},_findDropIntersection:a?function(){var t=this._container,n=this._dragState,i=r.elementFromPoint(n.viewportXY[0],n.viewportXY[1]),s;return!i||i===t||i===n.dragNode._node?null:e.Array.indexOf(this._dropElements,i)>=0?i:null}:function(){var e=this._dropRects,t=this._dragState,n=t.dragNode._node,r=t.pageXY[0],i=t.pageXY[1],s;for(var o=0,u=e.length;o<u;o++){s=e[o];if(i<s.top)return null;if(n!==s.el&&i<=s.bottom&&i>=s.top&&r<=s.right&&r>=s.left)return s.el}},_findScrollIntersections:a?function(){}:function(){var e=[],t=this._scrollRects;if(!t.length)return e;var n=this._scrollMargin,r=this._dragState,i=r.pageXY[0],s=r.pageXY[1],o,u;for(var a=0,f=t.length;a<f;a++){u=t[a];if(s<u.top)break;s<=u.bottom&&s>=u.top&&i<=u.right&&i>=u.left&&(o={el:u.el},u.isVertical&&(u.bottom-s<=n?o.down=!0:s-u.top<=n&&(o.up=!0)),u.isHorizontal&&(u.right-i<=n?o.right=!0:i-u.left<=n&&(o.left=!0)),(o.down||o.up||o.right||o.left)&&e.push(o))}return e},_fireDrag:function(){var t=this._getDelta(),n=this._dragState;this._publishAndFire(c,e.merge(n,{deltaXY:t,state:n}),{defaultFn:this._defDragFn}),n.dropNode&&this._publishAndFire(v,e.merge(n,{deltaXY:t,state:n}))},_fireDragEnter:function(t){var n=this._dragState;n.preventedDropNode=null,this._publishAndFire(p,e.merge(n,{deltaXY:this._getDelta(),dropNode:t,state:n}),{defaultFn:this._defDragEnterFn,preventedFn:this._preventedDragEnterFn})},_fireDragLeave:function(){var t=this._dragState;this._proxyOrDragNode().removeClass(this.classNames.droppable),t.dropNode.removeClass(this.classNames.dragover),this._publishAndFire(d,e.merge(t,{deltaXY:this._getDelta(),state:t})),t.dropNode=null,t.preventedDropNode=null},_fireDragStart:function(){var t=this._dragState;if(!t.pending)return;this._endPendingDrag(),this._publishAndFire(m,e.merge(t,{state:t}),{defaultFn
:this._defDragStartFn,preventedFn:this._preventedDragStartFn})},_getAbsoluteBoundingRect:function(e){var t=this._viewportScrollOffsets[0],n=this._viewportScrollOffsets[1],r=e.getBoundingClientRect();return{bottom:r.bottom+n,height:r.height||r.bottom-r.top,left:r.left+t,right:r.right+t,top:r.top+n,width:r.width||r.right-r.left}},_getBoundingRect:function(e){var t=e.getBoundingClientRect();return"width"in t?t:{bottom:t.bottom,height:t.height||t.bottom-t.top,left:t.left,right:t.right,top:t.top,width:t.width||t.right-t.left}},_getDelta:function(){var e=this._dragState;return[Math.abs(e.startXY[0]-e.pageXY[0]),Math.abs(e.startXY[1]-e.pageXY[1])]},_getViewportScrollOffsets:l?function(){return[o.pageXOffset,o.pageYOffset]}:function(){var e=r.documentElement||i.parentNode||i;return[e.scrollLeft,e.scrollTop]},_moveDragNode:function(){var e=this._proxyOrDragNode()._node,t=this._dragState;if(this._containerIsBody)n.setXY(e,[t.pageXY[0]+t.offsetXY[0],t.pageXY[1]+t.offsetXY[1]]);else{var r=this._getAbsoluteBoundingRect(this._container._node),i=this._getBoundingRect(e);n.setXY(e,[Math.max(r.left,Math.min(r.right-i.width,t.pageXY[0]+t.offsetXY[0])),Math.max(r.top,Math.min(r.bottom-i.height,t.pageXY[1]+t.offsetXY[1]))])}},_preventTouchCallout:function(){var e=this._dragState.dragNode,t=e&&e._node;t&&(e.setData("originalTouchCalloutValue",t.style.webkitTouchCallout),t.style.webkitTouchCallout="none")},_proxyOrDragNode:function(){return this._dragState.proxyNode||this._dragState.dragNode},_publishAndFire:function(e,t,n){return n&&n.silent?n.defaultFn&&n.defaultFn.call(this,t):(n&&!this._publishedEvents[e]&&(this._publishedEvents[e]=this.publish(e,n)),this.fire(e,t)),this},_reinitialize:function(){this._endDrag(),this._detachEvents(),this._attachEvents()},_restoreTouchCallout:function(){var e=this._dragState.dragNode,t=e&&e._node;t&&(t.style.webkitTouchCallout=e.getData("originalTouchCalloutValue")||"default",e.clearData("originalTouchCalloutValue"))},_scroll:function(e){var t=this._scrollIntersections,n=t&&t.length;if(!n)return;var s,o;e||(e=1);for(var a=0;a<n;a++)s=t[a],o=s.el,!u&&o===i&&(o=r.documentElement),s.down?o.scrollTop=Math.min(o.scrollHeight,o.scrollTop+e):s.up&&(o.scrollTop=Math.max(0,o.scrollTop-e)),s.right?o.scrollLeft=Math.min(o.scrollWidth,o.scrollLeft+e):s.left&&(o.scrollLeft=Math.max(0,o.scrollLeft-e));this.sync();if(!this._scrollTimeout){var f=this;this._scrollTimeout=setTimeout(function(){f._scrollTimeout=null,f._scroll(e+=2),f._moveDragNode()},20)}},_defDragFn:function(){var t=this._dragState;if(this._scrollContainer||this._scrollSelector)this._scrollIntersections=this._findScrollIntersections(),this._scroll();this._moveDragNode();var n=this._findDropIntersection();if(n){if(t.dropNode){if(n===t.dropNode._node)return;this._fireDragLeave()}else if(t.preventedDropNode&&n===t.preventedDropNode._node)return;this._fireDragEnter(e.one(n))}else t.dropNode&&this._fireDragLeave()},_defDragEnterFn:function(e){this._dragState.dropNode=e.dropNode,this._proxyOrDragNode().addClass(this.classNames.droppable),e.dropNode.addClass(this.classNames.dragover)},_defDragStartFn:function(e){var t=this._dragState,n=t.dragNode.getXY(),r=e.pointerOffset||this.get("pointerOffset");t.dragging=!0,t.pending=!1,r==="auto"?t.offsetXY=[n[0]-t.startXY[0],n[1]-t.startXY[1]]:t.offsetXY=r;var i=this._proxyOrDragNode();a&&(i._node.style.pointerEvents="none"),t.dragNode.addClass(this.classNames.dragging),i.addClass(this.classNames.dragging),this.sync(),this._fireDrag()},_afterWindowScroll:function(){this.sync()},_onContainerScroll:function(){if(!this._dragState.dragging||this._scrollEventThrottle)return;var e=this;this._scrollEventThrottle=setTimeout(function(){e._scrollEventThrottle=null,e.sync()},100)},_onDocMove:function(e){var t=this._dragState;if(!t.dragging&&!t.pending)return;t.pageXY=[e.pageX,e.pageY];if(t.dragging)e.preventDefault(),t.viewportXY=[e.pageX-this._viewportScrollOffsets[0],e.pageY-this._viewportScrollOffsets[1]],this._fireDrag();else if(t.pending){var n=this._getDelta(),r=t.isTouch,i=r?this._touchCancelDistance:this._distanceThreshold;if(n[0]>i||n[1]>i)r?this._endDrag():this._fireDragStart()}},_onDocMoveEnd:function(t){var n=this._dragState;if(!n.dragging&&!n.pending)return;n.dragging&&(t._event.preventDefault?t._event.preventDefault():t._event.returnValue=!1,t.touches&&(n.dragNode.once("mousedown",function(e){e.preventDefault()}),n.dragNode.once("click",function(e){e.preventDefault()})),n.dropNode&&(n.dropped=!0,this._publishAndFire(g,e.merge(n,{deltaXY:this._getDelta(),state:n})))),this._endDrag()},_onDraggableMoveStart:function(e){if(e.button>1||f&&e.ctrlKey)return;if(e.touches&&!this.get("enableTouchDrag"))return;var t=this._dragHandleSelector;if(t&&!e.target.ancestor(t,!0))return;var n=this,r=this._dragState;r.dragging=!1,r.dragNode=e.currentTarget,r.isTouch=!!e.touches,r.pageXY=[e.pageX,e.pageY],r.pending=!0,r.startXY=[e.pageX,e.pageY],this._preventTouchCallout(),this._pendingDragTimeout=setTimeout(function(){r.pending&&n._fireDragStart()},r.isTouch?this._touchDelay:this.get("timeThreshold"))},_onNativeDragStart:function(e){e.preventDefault()},_preventedDragEnterFn:function(e){e.state.preventedDropNode=e.dropNode},_preventedDragStartFn:function(){this._endDrag()}},{ATTRS:{container:{setter:e.one,valueFn:function(){return e.one("body")}},distanceThreshold:{value:10},dragHandleSelector:{},dragSelector:{},dropSelector:{},enableTouchDrag:{value:!0},pointerOffset:{value:"auto"},scrollContainer:{value:!1},scrollMargin:{value:50},scrollSelector:{},timeThreshold:{value:800},touchCancelDistance:{value:10},touchDelay:{value:1e3}}});e.DragDrop=y},"@VERSION@",{requires:["base","classnamemanager","event-move","node-event-delegate","node-screen"]});
