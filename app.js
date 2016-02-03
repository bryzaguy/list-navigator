/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var style = __webpack_require__(1);
	var ui = __webpack_require__(5);
	var DATA_PROP = 'data-depth';
	var FLYUP_DURATION = 500;
	var FLYUP_EASE = 'easeInOut';

	var div = function (i) {
	    var e = document.createElement('div');
	    e.className = i.depth === 0 ? 'card source' : 'card';
	    e.setAttribute(DATA_PROP, i.depth);
	    return e;
	},
	    relations = [{ depth: -4 }, { depth: -3 }, { depth: -2 }, { depth: -1 }, { depth: 0 }, { depth: 1 }, { depth: 2 }, { depth: 3 }, { depth: 4 }, { depth: 5 }, { depth: 6 }];

	var elements = relations.map(div),
	    fragment = document.createDocumentFragment();

	elements.forEach(fragment.appendChild, fragment);
	document.getElementById('cards').appendChild(fragment);

	var flyup = new ui.Tween({
	    ease: FLYUP_EASE,
	    duration: FLYUP_DURATION,
	    values: {
	        opacity: 1,
	        x: {
	            to: function (e) {
	                var depth = parseInt(e.element.getAttribute(DATA_PROP));
	                return depth * 100 + '%';
	            }
	        },
	        y: {
	            to: function (t) {
	                var d = t.element.getAttribute(DATA_PROP);
	                return d == 0 || d == 1 ? 0 : 48;
	            }
	        },
	        boxShadow: {
	            to: function (e) {
	                var depth = parseInt(e.element.getAttribute(DATA_PROP));
	                switch (depth) {
	                    case 1:
	                        return '10px 5px 10px rgba(0,0,0,0.25)';
	                    case 0:
	                        return '-10px 5px 10px rgba(0,0,0,0.25)';
	                    default:
	                        return '0 5px 5px rgba(0,0,0,.15)';
	                }
	            }
	        },
	        borderRight: {
	            to: function (e) {
	                var depth = parseInt(e.element.getAttribute(DATA_PROP));
	                return depth == 0 ? '2px solid white' : '0px solid white';
	            }
	        }
	    }
	});

	var actors = elements.map(function (e) {
	    var depth = parseInt(e.getAttribute(DATA_PROP));
	    var values = {
	        x: depth * 100 + '%',
	        y: 100,
	        opacity: 0,
	        zIndex: depth == 0 || depth == 1 ? 1 : 0,
	        boxShadow: '0 5px 5px rgba(0,0,0,.15)'
	    };

	    var actor = new ui.Actor({
	        element: e,
	        values: values
	    });

	    return actor;
	});

	var iterator = new ui.Iterator(actors);
	var sequence = new ui.Sequence();
	var STAGGER_DURATION = 150;

	iterator.stagger('start', STAGGER_DURATION, flyup);

	var lockInput = document.getElementById('lock');
	var navInput = document.getElementById('nav');
	var navView = document.getElementById('nav-view');

	navInput.onchange = function () {
	    navView.className = navInput.checked ? 'nav-is-open' : '';
	};

	lockInput.onchange = function () {
	    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
	    if (!lockInput.checked) {
	        var leftIndex = elements.reduce(function (p, n, i) {
	            return n.getAttribute(DATA_PROP) == 0 ? i : p;
	        }, 0);
	        elements.forEach(function (e, i) {
	            return updateElement(e, i - leftIndex, zIndexing[i - leftIndex] || 0);
	        });
	        iterator.each('start', flyup);
	    }
	};

	function updateElement(element, depth, zIndex) {
	    element.setAttribute(DATA_PROP, depth);
	    ui.css.set(element, 'z-index', zIndex);
	}

	document.getElementById('downstream').onclick = function (e) {
	    e.stopPropagation();
	    e.preventDefault();

	    elements.forEach(function (i) {
	        var depth,
	            currentDepth = parseInt(i.getAttribute(DATA_PROP));

	        if (lockInput.checked && (currentDepth == 0 || currentDepth == 1)) {
	            depth = currentDepth == 1 ? currentDepth - 2 : 0;
	        } else {
	            depth = currentDepth - 1;
	        }

	        var zIndexing = { 0: 3, 1: 2, '-1': 1 };

	        updateElement(i, depth, zIndexing[depth] || 0);
	    });

	    iterator.each('start', flyup);
	};

	document.getElementById('upstream').onclick = function (e) {
	    e.stopPropagation();
	    e.preventDefault();

	    elements.forEach(function (i) {
	        var depth,
	            currentDepth = parseInt(i.getAttribute(DATA_PROP));

	        if (lockInput.checked && (currentDepth == 0 || currentDepth == -1)) {
	            depth = currentDepth == -1 ? currentDepth + 2 : 0;
	        } else {
	            depth = currentDepth + 1;
	        }

	        var zIndexing = lockInput.checked ? { 0: 3, 1: 2, 2: 1 } : { 1: 3, 0: 2, 2: 1 };

	        updateElement(i, depth, zIndexing[depth] || 0);
	    });

	    iterator.each('start', flyup);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "    * { box-sizing: border-box; }\n\n    body, html {\n      background: #FFF;\n      height: 100vh;\n      padding: 0;\n      margin: 0;\n      overflow: hidden;\n    }\n\n    #nav-view {\n      height: 0px;\n      transition: .25s;\n      width: calc(100% - 100px);\n      margin-left: 50px;\n      background-color: #CCC;\n    }\n\n    #nav-view.nav-is-open {\n      height: 100px;\n      transition: .25s;\n    }\n\n    button {\n      border-radius: 50%;\n      font-size: 15px;\n      padding: 10px;\n      font-weight: 700;\n      line-height: .5;\n      border: 1px solid;\n      cursor: pointer;\n      background-color: deepskyblue;\n      color: white;\n    }\n\n    button:focus {\n      outline: 0;\n    }\n\n    #cards {\n        position: relative;\n        width: calc(100% - 100px);\n        left: 50px;\n        height: 100%;\n    }\n\n    button:active {\n        opacity: .6;\n    }\n\n    .sidebar {\n      width: 50px;\n      position: fixed;\n      display: inline-block;\n      text-align: center;\n      padding: 46px 0;\n      top: -20px;\n      height: 1000px;\n      z-index: 10;\n    }\n\n    .sidebar.downstream {\n      right: 0;\n      box-shadow: -20px 0 25px white inset;\n    }\n\n    .sidebar.upstream {\n      left: 0;\n      box-shadow: 20px 0 25px white inset;\n    }\n\n    .container {\n      padding-top: 40px;\n      width: 100%;\n      overflow-x: hidden;\n    }\n\n    .card {\n      display: inline-block;\n      opacity: 0;\n      box-shadow: 0 5px 5px rgba(0,0,0,.15);\n      background: repeating-linear-gradient(\n        180deg,\n        #eee,\n        #eee 25px,\n        #fff 25px,\n        #fff 50px\n      );\n      position: absolute;\n      z-index: 0;\n      width: 50%;\n      height: 800px;\n    }\n\n    .card::before {\n        width: 100%;\n        position: absolute;\n        left: 0;\n        right: 0;\n        background: #999;\n        color: #999;\n        height: 33px;\n        content: 's';\n    }\n\n    .card.source::before {\n        background: #0F75FF;\n        color: #0F75FF;\n    }", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var popmotion = __webpack_require__(6);

	/*
	    Add optional custom value type support
	*/
	popmotion.addValueType({
	    alpha: __webpack_require__(53),
	    angle: __webpack_require__(54),
	    px: __webpack_require__(55),
	    hsl: __webpack_require__(56),
	    rgb: __webpack_require__(63),
	    hex: __webpack_require__(64),
	    color: __webpack_require__(65),
	    positions: __webpack_require__(66),
	    dimensions: __webpack_require__(68),
	    scale: __webpack_require__(69),
	    shadow: __webpack_require__(70),
	    complex: __webpack_require__(71)
	});

	/*
	    Predefined roles
	*/
	popmotion.attr = __webpack_require__(33);
	popmotion.css = __webpack_require__(26);
	popmotion.svg = __webpack_require__(32);
	popmotion.drawPath = __webpack_require__(36);

	module.exports = popmotion;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypes = __webpack_require__(7),
	    Popmotion = {

	    Actor: __webpack_require__(9),

	    Sequence: __webpack_require__(38),

	    Input: __webpack_require__(44),

	    Iterator: __webpack_require__(46),

	    Process: __webpack_require__(10),

	    Easing: __webpack_require__(41),

	    Role: __webpack_require__(25),

	    Action: __webpack_require__(19),
	    Tween: __webpack_require__(39),
	    Simulate: __webpack_require__(47),
	    Track: __webpack_require__(49),

	    /*
	        Create an Iterator of Actors with selected dom elements
	    */
	    select: __webpack_require__(51),

	    ease: __webpack_require__(40),

	    /*
	        Modify properties of inbuilt easing function
	    */
	    modifyEase: __webpack_require__(52),

	    addValueType: function (types) {
	        valueTypes.extend(types);
	        return Popmotion;
	    },

	    calc: __webpack_require__(17),
	    utils: __webpack_require__(8)
	};

	module.exports = Popmotion;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var each = __webpack_require__(8).each;

	module.exports = {
	    extend: function (types) {
	        var _this = this;

	        each(types, function (name, type) {
	            _this[name] = type;
	        });
	    },

	    defaultProps: function (typeName, key) {
	        var valueType = this[typeName],
	            defaultProps = valueType.defaultProps ? valueType.defaultProps[key] || valueType.defaultProps : {};

	        return defaultProps;
	    },

	    test: function (value) {
	        var type = false;

	        each(this, function (key, valueType) {
	            if (valueType.test && valueType.test(value)) {
	                type = key;
	                return false;
	            }
	        });

	        return type;
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var protectedProperties = ['scope', 'dom'];
	var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
	var REPLACE_TEMPLATE = '$1-$2';

	var isProtected = function (key) {
	    return protectedProperties.indexOf(key) !== -1;
	};

	/*
	    Get var type as string
	    
	    @param: Variable to test
	    @return [string]: Returns, for instance 'Object' if [object Object]
	*/
	var varType = function (variable) {
	    return Object.prototype.toString.call(variable).slice(8, -1);
	};

	var utils = {
	    /*
	        Convert camelCase to dash-case
	         @param [string]
	        @return [string]
	    */
	    camelToDash: function (string) {
	        return string.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
	    },

	    /*
	        Iterate over an object and fire a callback for every item in it
	         @param [object]: Properties
	        @param [function]: Callback to fire
	    */
	    each: function (props, callback) {
	        var keys = props ? Object.keys(props) : [],
	            numKeys = keys.length;

	        for (var i = 0; i < numKeys; i++) {
	            var key = keys[i],
	                prop = props[key];

	            if (callback(key, prop) === false) {
	                break;
	            }
	        }
	    },

	    /*
	        Check if object has property and it isn't undefined
	         @param [object]
	        @param [string]
	        @return [boolean]
	    */
	    has: function (object, propertyName) {
	        return object.hasOwnProperty(propertyName) && object[propertyName] !== undefined;
	    },

	    /*
	        Has one object changed from the other
	        
	        Compares the two provided inputs and returns true if they are different
	        
	        @param [object]: Input A
	        @param [object]: Input B
	        @return [boolean]: True if different
	    */
	    hasChanged: function (a, b) {
	        var hasChanged = false,
	            key = '';

	        for (key in b) {
	            if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
	                if (a[key] !== b[key]) {
	                    hasChanged = true;
	                }
	            } else {
	                hasChanged = true;
	            }
	        }

	        return hasChanged;
	    },

	    /*
	        Is utils var a function ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if utils.varType === 'Function'
	    */
	    isFunc: function (obj) {
	        return varType(obj) === 'Function';
	    },

	    /*
	        Is utils var a number?
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof === 'number'
	    */
	    isNum: function (num) {
	        return typeof num === 'number';
	    },

	    /*
	        Is utils var an object?
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof === 'object'
	    */
	    isObj: function (obj) {
	        return typeof obj === 'object';
	    },

	    /*
	        Is utils var a string ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if typeof str === 'string'
	    */
	    isString: function (str) {
	        return typeof str === 'string';
	    },

	    /*
	        Is utils a relative value assignment?
	        
	        @param [string]: Variable to test
	        @return [boolean]: If utils looks like a relative value assignment
	    */
	    isRelativeValue: function (value) {
	        return value && value.indexOf && value.indexOf('=') > 0 ? true : false;
	    },

	    /*
	        Is utils var an array ? 
	        
	        @param: Variable to test
	        @return [boolean]: Returns true if utils.varType === 'Array'
	    */
	    isArray: function (arr) {
	        return varType(arr) === 'Array';
	    },

	    /*
	        Copy object or array
	        
	        Checks whether base is an array or object and makes
	        appropriate copy
	        
	        @param [array || object]: Array or object to copy
	        @param [array || object]: New copy of array or object
	    */
	    copy: function (base) {
	        return utils.isArray(base) ? utils.copyArray(base) : utils.copyObject(base);
	    },

	    /*
	        Deep copy an object
	        
	        Iterates over an object and creates a new copy of every item,
	        deep copying if it finds any objects/arrays
	        
	        @param [object]: Object to copy
	        @param [object]: New copy of object
	    */

	    copyObject: function (base) {
	        var newObject = {};

	        utils.each(base, utils.copyEachObject.bind(null, newObject));

	        return newObject;
	    },

	    copyEachObject: function (newObject, key, value) {
	        newObject[key] = utils.isObj(value) && !isProtected(key) ? utils.copy(value) : value;
	    },
	    /*
	        Deep copy an array
	        
	        Loops through an array and creates a new copy of every item,
	        deep copying if it finds any objects/arrays
	        
	        @param [array]: Array to copy
	        @return [array]: New copy of array
	    */
	    copyArray: function (base) {
	        return base;
	    },

	    /*
	        Non-destructive merge of object or array
	        
	        @param [array || object]: Array or object to use as base
	        @param [array || object]: Array or object to overwrite base with
	        @return [array || object]: New array or object
	    */
	    merge: function (base, overwrite) {
	        return utils.isArray(base) ? utils.copyArray(overwrite) : utils.mergeObject(base, overwrite);
	    },

	    /*
	        Non-destructive merge of object
	        
	        @param [object]: Object to use as base
	        @param [object]: Object to overwrite base with
	        @return [object]: New object
	    */
	    mergeObject: function (base, overwrite) {
	        var hasBase = utils.isObj(base),
	            newObject = hasBase ? utils.copy(base) : utils.copy(overwrite);

	        if (hasBase) {
	            utils.each(overwrite, utils.mergeEachObject.bind(null, newObject, base));
	        }

	        return newObject;
	    },

	    mergeEachObject: function (newObject, base, key, value) {
	        newObject[key] = utils.isObj(value) && !isProtected(key) ? utils.merge(base[key], value) : value;
	    },

	    /*
	        Split a value into a value/unit object
	        
	            "200px" -> { value: 200, unit: "px" }
	            
	        @param [string]: Value to split
	        @return [object]: Object with value and unit props
	    */
	    splitValUnit: function (value) {
	        var splitVal = value.match(/(-?\d*\.?\d*)(.*)/);

	        return {
	            value: splitVal[1],
	            unit: splitVal[2]
	        };
	    },

	    /*
	        Create stepped version of 0-1 progress
	        
	        @param [number]: Current value
	        @param [int]: Number of steps
	        @return [number]: Stepped value
	    */
	    stepProgress: function (progress, steps) {
	        var segment = 1 / (steps - 1),
	            target = 1 - 1 / steps,
	            progressOfTarget = Math.min(progress / target, 1);

	        return Math.floor(progressOfTarget / segment) * segment;
	    },

	    /*
	        Generate current timestamp
	        
	        @return [timestamp]: Current UNIX timestamp
	    */
	    currentTime: function () {
	        return typeof performance !== 'undefined' && performance.now ? performance.now() : new Date().getTime();
	    }
	};

	module.exports = utils;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Process = __webpack_require__(10),
	    Queue = __webpack_require__(14),
	    utils = __webpack_require__(8),
	    select = __webpack_require__(15),
	    valueOps = __webpack_require__(16),

	/*
	    Process methods
	*/
	update = __webpack_require__(18),
	    render = __webpack_require__(22),
	    postRender = __webpack_require__(23),

	/*
	    Role imports
	*/
	defaultRole = __webpack_require__(24),
	    cssRole = __webpack_require__(26),
	    svgRole = __webpack_require__(32),
	    drawPathRole = __webpack_require__(36),
	    Action = __webpack_require__(19),
	    each = utils.each;

	var Actor = function () {

	    /*
	        @param [object]
	    */

	    function Actor() {
	        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Actor);

	        var props = utils.isString(opts) ? { element: opts } : opts;

	        this.values = {};
	        this.state = { values: {} };
	        this.queue = new Queue();
	        this.process = new Process({ update: update, render: render, postRender: postRender }, this);
	        this.activeActions = {};
	        this.numActive = 0;
	        this.actionCounter = 0;
	        this.activeValues = [];
	        this.activeParents = [];
	        this.isActive = false;

	        // Get actual elements if this is a selector
	        if (utils.isString(props.element)) {
	            props.element = select(props.element)[0];
	        }

	        this.assignRoles(props.element, props.as, true);
	        this.set(props);
	        this.initRoles();
	        this.sync();
	    }

	    /*
	        Set Actor properties and values
	         @param [object]
	        @returns [Actor]
	    */

	    Actor.prototype.set = function set(opts) {
	        var _this = this;

	        each(opts, function (key, value) {
	            if (key !== 'values' && key !== 'action') {
	                _this[key] = value;
	            }
	        });

	        if (opts && opts.values) {
	            this.values = valueOps.process(this.values, opts.values, opts, 'current', this);
	        }

	        // Check all active actions for any that can be removed
	        each(this.activeActions, function (id, action) {
	            var actionIsActive = false;

	            each(_this.values, function (key, value) {
	                actionIsActive = value.action === action ? true : actionIsActive;
	            });

	            if (!actionIsActive) {
	                _this.unbindAction(id);
	            }
	        });

	        return this;
	    };

	    /*
	        Bind Action-specific controls to Actor
	         @returns [Controls]
	    */

	    Actor.prototype.controls = function controls(action) {
	        var Controls = action.getControls();
	        return new Controls(this, action.getPlayable());
	    };

	    /*
	        Start a new Action
	         @param [Action || number]
	        @param [Input || event] (optional)
	        @param [boolean] (optional): defined `true` if we surpress making new queue
	        @returns [Controls]
	    */

	    Actor.prototype.start = function start(toSet, input) {
	        var actionExists = utils.isNum(toSet);
	        var action = actionExists ? this.getAction(toSet) : toSet.getPlayable();
	        var opts = action.getSet();
	        var surpressQueueClear = arguments[arguments.length - 1] === false;

	        opts.action = action;

	        this.set(opts);

	        if (input) {
	            action.bindInput(input);
	        }

	        if (!surpressQueueClear) {
	            this.queue.clear();
	        }

	        // Fire all Role onStarts if not already active
	        if (!this.isActive) {
	            var numRoles = this.roles.length;
	            for (var i = 0; i < numRoles; i++) {
	                var role = this.roles[i];
	                if (role.start) {
	                    role.start.call(this, this);
	                }
	            }
	        }

	        // Fire new action onStart
	        if (!action.isActive && action.onStart) {
	            action.onStart(this, action);
	        }

	        this.activate();

	        if (!actionExists) {
	            var Controls = action.getControls();
	            return new Controls(this, action, true);
	        }
	    };

	    /*
	        Pause all active Actions
	         @param [int] (optional)
	        @returns [Actor]
	    */

	    Actor.prototype.pause = function pause() {
	        this.isActive = false;
	        each(this.activeActions, function (id, action) {
	            return action.deactivate();
	        });
	        this.process.stop();
	        return this;
	    };

	    /*
	        Resume all active Actions
	         @param [int] (optional)
	        @returns [Actor];
	    */

	    Actor.prototype.resume = function resume() {
	        this.isActive = true;
	        each(this.activeActions, function (id, action) {
	            return action.activate();
	        });
	        this.process.start();
	        return this;
	    };

	    /*
	        Stop all active Actions
	         @param [int] (optional)
	        @returns [Actor]
	    */

	    Actor.prototype.stop = function stop() {
	        var _this2 = this;

	        this.pause();
	        each(this.activeActions, function (id) {
	            return _this2.unbindAction(id);
	        });
	        return this;
	    };

	    /*
	        Toggle all active Actions
	         @param [int] (optional)
	        @returns [Actor]
	    */

	    Actor.prototype.toggle = function toggle() {
	        return this.isActive ? this.pause() : this.resume();
	    };

	    /*
	        Syncs `element` with current properties
	         @returns [Actor]
	    */

	    Actor.prototype.sync = function sync() {
	        var currentValues = {};

	        utils.each(this.values, function (key, value) {
	            currentValues[key] = value.current;
	        });

	        this.start(new Action({ values: currentValues }));
	        return this;
	    };

	    /*
	        Add a new Action to the queue
	    */

	    Actor.prototype.then = function then() {
	        this.queue.add.apply(this.queue, arguments);
	        return this;
	    };

	    /*
	        Execute next in queue
	    */

	    Actor.prototype.next = function next() {
	        var next = this.queue.next();

	        if (next) {
	            if (utils.isFunc(next[0])) {
	                next[0]();
	                this.next();
	                // Or this is an action
	            } else {
	                    next.push(false);
	                    this.start.apply(this, next);
	                }
	        } else {
	            this.stop();
	        }

	        return this;
	    };

	    /*
	        Assign Roles based on element and manually provided props
	         @param [object]: Element
	        @param [Role || array]
	        @param [boolean] (optional)
	    */

	    Actor.prototype.assignRoles = function assignRoles(element, manualRoles, surpressInit) {
	        // All Actors get a default Role that handles user callbacks
	        this.roles = [defaultRole];

	        // Auto-assign if no manually-set Roles
	        if (!manualRoles && element) {
	            this.autoAssignRoles(element);

	            // Or manually set if provided
	        } else if (manualRoles) {
	                if (utils.isArray(manualRoles)) {
	                    this.roles.push.apply(this.roles, manualRoles);
	                } else {
	                    this.roles.push(manualRoles);
	                }
	            }

	        if (!surpressInit) {
	            this.initRoles();
	        }
	    };

	    /*
	        Automatically assign Roles based on element, designed
	        to be extended
	         @param [object]: Element
	    */

	    Actor.prototype.autoAssignRoles = function autoAssignRoles(element) {
	        // Add CSS role if HTMLElement
	        if (element instanceof HTMLElement || element.tagName === 'svg') {
	            this.roles.push(cssRole);

	            // Add SVG role if SVG element
	        } else if (element instanceof SVGElement) {
	                this.roles.push(svgRole);

	                // Add Draw Path role if path element
	                if (element.tagName === 'path') {
	                    this.roles.push(drawPathRole);
	                }
	            }
	    };

	    /*
	        Fire init callbacks
	    */

	    Actor.prototype.initRoles = function initRoles() {
	        var _this3 = this;

	        // Fire init callback
	        this.roles.forEach(function (role) {
	            if (role.init) {
	                role.init.call(_this3, _this3);
	            }
	        });
	    };

	    Actor.prototype.activate = function activate() {
	        if (!this.isActive) {
	            this.isActive = true;
	            this.firstFrame = true;
	            this.process.start();
	        }
	    };

	    /*
	        Bind Action and return its table id
	         @param [Action]
	        @returns [int]
	    */

	    Actor.prototype.bindAction = function bindAction(action, id) {
	        if (id === undefined) {
	            id = this.actionCounter++;
	        }

	        if (!this.hasAction(id)) {
	            this.activeActions[id] = action;
	            this.numActive++;
	        }

	        return id;
	    };

	    Actor.prototype.unbindAction = function unbindAction(id) {
	        if (this.activeActions.hasOwnProperty(id)) {
	            var action = this.activeActions[id];
	            if (action.input && action.input.autoStop === true) {
	                action.input.stop();
	            }
	            action.deactivate();
	            this.numActive--;
	            delete this.activeActions[id];
	        }

	        if (!this.numActive) {
	            this.pause();
	        }
	    };

	    Actor.prototype.getAction = function getAction(id) {
	        return this.activeActions[id];
	    };

	    Actor.prototype.hasAction = function hasAction(id) {
	        return this.getAction(id) !== undefined;
	    };

	    /*
	        Update processing order
	        
	        @param [string]
	        @param [boolean]
	        @param [boolean]
	    */

	    Actor.prototype.updateOrder = function updateOrder(key, moveToBack, hasChildren) {
	        var order = !hasChildren ? this.activeValues : this.activeParents,
	            position = order.indexOf(key);

	        // If key isn't list or moveToBack is set to true, add key
	        if (position === -1 || moveToBack) {
	            order.push(key);

	            // If key already exists, remove
	            if (position > -1) {
	                order.splice(position, 1);
	            }
	        }
	    };

	    // [boolean]: Is this Actor active?

	    _createClass(Actor, [{
	        key: 'isActive',
	        get: function () {
	            return this._isActive;
	        }

	        // Set hasChanged to true is this is now active
	        ,
	        set: function (status) {
	            if (status === true) {
	                this.hasChanged = status;
	            }

	            this._isActive = status;
	        }
	    }]);

	    return Actor;
	}();

	module.exports = Actor;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var utils = __webpack_require__(8);
	var loop = __webpack_require__(11);

	var Process = function () {

	    /*
	        @param [function || object]
	        @param [object] (optional)
	    */

	    function Process(callback, scope) {
	        var _this = this;

	        _classCallCheck(this, Process);

	        // Set callback
	        if (utils.isFunc(callback)) {
	            this.render = callback;
	        } else if (utils.isObj(callback)) {
	            utils.each(callback, function (key, value) {
	                _this[key] = value;
	            });
	        }

	        this.scope = utils.isObj(scope) ? scope : this;

	        this.setBackground(arguments[arguments.length - 1]);

	        this.id = loop.getProcessId();
	        this.isActive = false;
	    }

	    Process.prototype.start = function start() {
	        this.activate();
	        return this;
	    };

	    Process.prototype.stop = function stop() {
	        this.deactivate();
	        return this;
	    };

	    Process.prototype.activate = function activate() {
	        this.isActive = true;
	        loop.activate(this, this.id);
	    };

	    Process.prototype.deactivate = function deactivate() {
	        this.isActive = false;
	        loop.deactivate(this.id);
	    };

	    Process.prototype.once = function once() {
	        var _this2 = this;

	        this.cleanup = function () {
	            _this2.stop();
	            _this2.cleanup = undefined;
	        };

	        return this.start();
	    };

	    Process.prototype.setBackground = function setBackground(runInBackground) {
	        this.isBackground = runInBackground === true ? true : false;
	        return this;
	    };

	    return Process;
	}();

	module.exports = Process;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timer = __webpack_require__(12);
	var systemTick = __webpack_require__(13);

	var processOrder = ['update', 'preRender', 'render', 'postRender', 'cleanup'];
	var numProcessSteps = processOrder.length;

	// [int]: Process ID, incremented for each new process
	var currentProcessId = 0;

	// [int]: Number of running processes
	var runningCount = 0;

	// [int]: Number of running non-background processes
	var activeCount = 0;

	// [array]: Array of active process IDs
	var runningIds = [];

	// [object]: Map of active processes
	var runningProcesses = {};

	// [array]: Array of process IDs queued for deactivation
	var deactivateQueue = [];

	// [boolean]: Is loop running?
	var isRunning = false;

	/*
	    Update running

	    @param [boolean]
	    @param [boolean]
	*/
	var updateCount = function (add, isBackground) {
	    var modify = add ? 1 : -1;

	    runningCount += modify;

	    if (!isBackground) {
	        activeCount += modify;
	    }
	};

	/*
	    Purge items in the deactivate queue from our runningProcesses
	*/
	var purge = function () {
	    var queueLength = deactivateQueue.length;

	    while (queueLength--) {
	        var idToDelete = deactivateQueue[queueLength];
	        var activeIdIndex = runningIds.indexOf(idToDelete);

	        // If process is active, deactivate
	        if (activeIdIndex > -1) {
	            runningIds.splice(activeIdIndex, 1);

	            updateCount(false, runningProcesses[idToDelete].isBackground);

	            delete runningProcesses[idToDelete];
	        }
	    }

	    deactivateQueue = [];
	};

	/*
	    Fire all active processes
	    
	    @param [int]: Timestamp of executing frames
	    @param [int]: Time since previous frame
	    @return [boolean]: True if active processes found
	*/
	var fireAll = function (framestamp, elapsed) {
	    purge();

	    var numRunning = runningCount;
	    for (var i = 0; i < numProcessSteps; i++) {
	        var method = processOrder[i];

	        for (var _i = 0; _i < numRunning; _i++) {
	            var process = runningProcesses[runningIds[_i]];

	            if (process && process[method]) {
	                process[method].call(process.scope, process.scope, framestamp, elapsed);
	            }
	        }
	    }

	    purge();

	    return activeCount ? true : false;
	};

	var loop = {
	    /*
	        Fire all active processes once per frame
	    */
	    frame: function () {
	        systemTick(loop.eachTick);
	    },

	    eachTick: function (framestamp) {
	        if (isRunning) {
	            loop.frame();
	        }

	        timer.update(framestamp);
	        isRunning = fireAll(framestamp, timer.getElapsed());
	    },

	    start: function () {
	        if (!isRunning) {
	            timer.start();
	            isRunning = true;
	            loop.frame();
	        }
	    },

	    stop: function () {
	        isRunning = false;
	    }
	};

	module.exports = {
	    // Increments and returns the latest process ID
	    getProcessId: function () {
	        return currentProcessId++;
	    },

	    /*
	        @param [Process]
	        @param [int]
	    */
	    activate: function (process, processId) {
	        var queueIndex = deactivateQueue.indexOf(processId);
	        var isQueued = queueIndex > -1;
	        var isRunning = runningIds.indexOf(processId) > -1;

	        // Remove from deactivateQueue if queued
	        if (isQueued) {
	            deactivateQueue.splice(queueIndex, 1);
	        }

	        // Add to running processes array if not there
	        if (!isRunning) {
	            runningIds.push(processId);
	            runningProcesses[processId] = process;

	            updateCount(true, process.isBackground);
	            loop.start();
	        }
	    },

	    /*
	        @param [int]
	    */
	    deactivate: function (processId) {
	        if (deactivateQueue.indexOf(processId) === -1) {
	            deactivateQueue.push(processId);
	        }
	    }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var currentTime = __webpack_require__(8).currentTime;
	var MAX_ELAPSED = 33;

	var current = 0;
	var elapsed = 16.7;

	var timer = {
	    update: function (framestamp) {
	        var prev = current;
	        current = framestamp;
	        elapsed = Math.min(current - prev, MAX_ELAPSED);

	        return current;
	    },

	    start: function () {
	        return current = currentTime();
	    },

	    getElapsed: function () {
	        return elapsed;
	    }
	};

	module.exports = timer;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	var hasRAF = typeof window !== 'undefined' && window.requestAnimationFrame ? true : false;

	var tick = undefined;

	if (hasRAF) {
	    tick = window.requestAnimationFrame;
	} else {
	    (function () {
	        /*
	            requestAnimationFrame polyfill
	            
	            For IE8/9 Flinstones
	             Taken from Paul Irish. We've stripped out cancelAnimationFrame checks because we don't fox with that
	            
	            http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	            http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	             
	            requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	             
	            MIT license
	        */
	        var lastTime = 0;

	        tick = function (callback) {
	            var currentTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currentTime - lastTime));

	            lastTime = currentTime + timeToCall;

	            setTimeout(function () {
	                return callback(lastTime);
	            }, timeToCall);
	        };
	    })();
	}

	module.exports = tick;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Queue = function () {
	    function Queue() {
	        _classCallCheck(this, Queue);

	        this.clear();
	    }

	    /*
	        Add a set of arguments to queue
	    */

	    Queue.prototype.add = function add() {
	        this.queue.push([].slice.call(arguments));
	    };

	    /*
	        Get next set of arguments from queue
	    */

	    Queue.prototype.next = function next() {
	        var direction = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	        var queue = this.queue,
	            returnVal = false,
	            index = this.index;

	        // If our index is between 0 and the queue length, return that item
	        if (index >= 0 && index < queue.length) {
	            returnVal = queue[index];
	            this.index = index + direction;

	            // Or clear
	        } else {
	                this.clear();
	            }

	        return returnVal;
	    };

	    /*
	        Replace queue with empty array
	    */

	    Queue.prototype.clear = function clear() {
	        this.queue = [];
	        this.index = 0;
	    };

	    return Queue;
	}();

	module.exports = Queue;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	/*
	    @param [string || NodeList || jQuery object]:
	        If string, treated as selector.
	        If not, treated as preexisting NodeList || jQuery object.
	*/
	module.exports = function (selector) {
	    var nodes = typeof selector === 'string' ? document.querySelectorAll(selector) : selector,
	        elements = [];

	    // If jQuery selection, get array of Elements
	    if (nodes.get) {
	        elements = nodes.get();

	        // Or convert NodeList to array
	    } else if (nodes.length) {
	            elements = [].slice.call(nodes);

	            // Or if it's just an Element, put into array
	        } else {
	                elements.push(nodes);
	            }

	    return elements;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypesManager = __webpack_require__(7),
	    calc = __webpack_require__(17),
	    utils = __webpack_require__(8),
	    isNum = utils.isNum,
	    each = utils.each;

	var numericalValues = ['current', 'to', 'min', 'max', 'velocity', 'friction', 'spring', 'acceleration'],
	    numNumericalValues = numericalValues.length,
	    defaultValue = {
	    current: 0,
	    velocity: 0,
	    speed: 0,
	    frameChange: 0
	};

	function checkNumericalValue(name) {
	    return numericalValues.indexOf(name) > -1;
	}

	/*
	    Check Role typeMaps to see if this value name has been mapped
	    to a specific value type

	    @param [string]
	    @param [array]
	    @returns [string]: Value type
	*/
	function checkRoles(name, roles) {
	    var valueType;

	    each(roles, function (key, role) {
	        if (role._typeMap) {
	            valueType = role._typeMap[role.map(name)] || valueType;
	        }
	    });

	    return valueType;
	}

	/*
	    Check value for special type

	    @param [object]
	    @param [object]
	    @param [object]
	    @param [string]
	    @returns [string || false]
	*/
	function checkValueType(existingValue, newValue, scope, valueName) {
	    var valueType;

	    // Check existing value for type already set
	    if (existingValue && existingValue.type) {
	        valueType = existingValue.type;
	    } else {
	        // Or check Role _typeMap properties
	        if (scope.roles) {
	            valueType = checkRoles(valueName, scope.roles);
	        }

	        // Finally run tests
	        if (!valueType && utils.isString(newValue.current)) {
	            valueType = valueTypesManager.test(newValue.current);
	        }
	    }

	    return valueType;
	}

	/*
	    Resolve a property

	    @param [string]
	    @param [string || function || number]
	    @param [object]
	    @param [object]
	    @returns [number]
	*/
	function resolve(name, prop, value, scope) {
	    var isNumericalValue = checkNumericalValue(name);

	    // If function, resolve
	    if (utils.isFunc(prop) && isNumericalValue) {
	        prop = prop.call(scope, scope);
	    }

	    // If string, check for relative numbers and units
	    if (utils.isString(prop)) {
	        // If relative value
	        if (prop.indexOf('=') > 0) {
	            prop = calc.relativeValue(value.current, prop);
	        }

	        // If unit
	        if (isNumericalValue) {
	            splitUnit(prop, value);
	        }
	    }

	    if (isNumericalValue) {
	        prop = parseFloat(prop);
	    }

	    return prop;
	}

	/*
	    Split a value into sub-values

	    @param [string]
	    @param [object]
	    @param [object]
	    @param [valueTypeHandler]
	    @returns [object]
	*/
	function split(name, value, scope, valueTypeHandler) {
	    var splitValues = {},
	        i = 0;

	    var _loop = function () {
	        var propName = numericalValues[i];
	        var splitProp = {};

	        if (value.hasOwnProperty(propName)) {
	            var valueProp = value[propName];

	            // If we need to first resolve this, resolve
	            if (utils.isFunc(valueProp)) {
	                valueProp = valueProp.call(scope, scope);
	            }

	            if (!utils.isString(valueProp)) {
	                return 'continue';
	            }

	            splitProp = valueTypeHandler.split(valueProp);

	            // Assign split properties to each child value
	            each(splitProp, function (key, prop) {
	                // Create new value if none exists
	                splitValues[key] = splitValues[key] || utils.copy(valueTypesManager.defaultProps(value.type, key));
	                splitValues[key][propName] = prop;

	                if (utils.isString(splitProp[key])) {
	                    splitUnit(splitValues[key][propName], splitValues[key]);
	                }
	            });
	        }
	    };

	    for (; i < numNumericalValues; i++) {
	        var _ret = _loop();

	        if (_ret === 'continue') continue;
	    }

	    return splitValues;
	}

	/*
	    Split value into number and unit, and set unit to value

	    @param [string]
	    @param [object]
	*/
	function splitUnit(property, hostValue) {
	    if (utils.isNum(property)) {
	        return property;
	    }
	    var returnVal = property;

	    var _utils$splitValUnit = utils.splitValUnit(property);

	    var value = _utils$splitValUnit.value;
	    var unit = _utils$splitValUnit.unit;

	    if (!isNaN(value)) {
	        returnVal = value;
	        if (unit) {
	            hostValue.unit = unit;
	        }
	    }

	    return returnVal;
	}

	/*
	    Preprocess incoming values, splitting non-numerical values
	    into sub-values ie hex

	    @param [object]
	    @param [object]
	    @param [object]
	    @param [string]
	*/
	function preprocess(existing, incoming, scope, defaultProp) {
	    var values = {};

	    each(incoming, function (key, value) {
	        var existingValue = existing[key],
	            newValue = {};

	        if (utils.isObj(value)) {
	            newValue = value;
	        } else {
	            newValue[defaultProp] = value;
	        }

	        // If value doesn't have a special type, check for one
	        newValue.type = checkValueType(existingValue, newValue, scope, key);

	        values[key] = newValue;

	        // If we have a type property, split/assign default props
	        if (newValue.type) {
	            var typeHandler = valueTypesManager[newValue.type];

	            // If valueType handler has a split function, split this value
	            if (typeHandler.split) {
	                var splitValues = split(key, newValue, scope, typeHandler);
	                newValue.children = {};

	                each(splitValues, function (childName, childValue) {
	                    each(newValue, function (key, value) {
	                        // Not great is it
	                        if (key !== 'children' && key !== 'action' && childValue[key] === undefined) {
	                            childValue[key] = value;
	                        }
	                    });

	                    childValue.parent = childValue.name = key;
	                    childValue.propName = childName;

	                    delete childValue.type;

	                    newValue.children[childName] = values[key + childName] = childValue;
	                });

	                if (typeHandler.template) {
	                    newValue.template = existingValue ? existingValue.template : typeHandler.template(newValue.current);
	                }

	                // Or just assign default properties for this value
	            } else {
	                    values[key] = utils.merge(valueTypesManager.defaultProps(newValue.type, key), newValue);
	                }
	        }
	    });

	    return values;
	}

	module.exports = {

	    /*
	        Flip value target/origin
	    */
	    flip: function (value) {
	        var target = value.target !== undefined ? value.target : value.current;
	        value.target = value.to = value.origin;
	        value.origin = target;
	    },

	    /*
	        Merge existing and incoming values, resolving properties
	        set as functions and splitting non-numerical values ie hex
	         @param [object]
	        @param [object]
	        @param [object]
	        @param [string] (optional)
	        @param [object]
	        @returns [object]: New values object
	    */
	    process: function (existing, incoming, inherit, defaultProp, scope) {
	        existing = existing || {};
	        defaultProp = defaultProp || 'current';
	        var preprocessed = preprocess(existing, incoming, scope, defaultProp);

	        each(preprocessed, function (key, value) {
	            var newValue = existing[key] || utils.copy(defaultValue),
	                hasChildren = value.children !== undefined,
	                defaultActionValue = inherit.action ? inherit.action.getDefaultValue() : {};

	            value.action = inherit.action;

	            each(defaultActionValue, function (propName, defaultActionProp) {
	                newValue[propName] = inherit.hasOwnProperty(propName) && !value.hasOwnProperty(propName) ? inherit[propName] : defaultActionProp;
	            });

	            each(value, function (valueName, valueProp) {
	                // If property is not undefined or a number, resolve
	                if (valueProp !== undefined && !isNum(valueProp) && !hasChildren) {
	                    valueProp = resolve(valueName, valueProp, newValue, scope);
	                }

	                newValue[valueName] = valueProp;

	                // Set internal target if this property is 'to'
	                if (valueName === 'to') {
	                    newValue.target = newValue.to;
	                }
	            });

	            newValue.origin = newValue.current;
	            newValue.hasRange = isNum(newValue.min) || isNum(newValue.max) ? true : false;

	            existing[key] = newValue;
	            scope.updateOrder(key, utils.has(newValue, 'watch'), hasChildren);
	        });

	        return existing;
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8),
	    zeroPoint = {
	    x: 0,
	    y: 0
	},
	    calc = {

	    /*
	        Angle between points
	        
	        Translates the hypothetical line so that the 'from' coordinates
	        are at 0,0, then return the angle using .angleFromCenter()
	        
	        @param [object]: X and Y coordinates of from point
	        @param [object]: X and Y cordinates of to point
	        @return [radian]: Angle between the two points in radians
	    */
	    angle: function (a) {
	        var b = arguments.length <= 1 || arguments[1] === undefined ? zeroPoint : arguments[1];
	        return calc.angleFromCenter(a.x - b.x, a.y - b.y);
	    },

	    /*
	        Angle from center
	        
	        Returns the current angle, in radians, of a defined point
	        from a center (assumed 0,0)
	        
	        @param [number]: X coordinate of second point
	        @param [number]: Y coordinate of second point
	        @return [radian]: Angle between 0, 0 and point in radians
	    */
	    angleFromCenter: function (x, y) {
	        return calc.radiansToDegrees(Math.atan2(y, x));
	    },

	    /*
	        Convert degrees to radians
	        
	        @param [number]: Value in degrees
	        @return [number]: Value in radians
	    */
	    degreesToRadians: function (degrees) {
	        return degrees * Math.PI / 180;
	    },

	    /*
	        Dilate
	        
	        Change the progression between a and b according to dilation.
	        
	        So dilation = 0.5 would change
	        
	        a --------- b
	        
	        to
	        
	        a ---- b
	        
	        @param [number]: Previous value
	        @param [number]: Current value
	        @param [number]: Dilate progress by x
	        @return [number]: Previous value plus the dilated difference
	    */
	    dilate: function (a, b, dilation) {
	        return a + (b - a) * dilation;
	    },

	    /*
	        Distance
	        
	        Returns the distance between (0,0) and pointA, unless pointB
	        is provided, then we return the difference between the two.
	        
	        @param [object/number]: x and y or just x of point A
	        @param [object/number]: (optional): x and y or just x of point B
	        @return [number]: The distance between the two points
	    */
	    distance: function (a, b) {
	        return utils.isNum(a) ? calc.distance1D(a, b) : calc.distance2D(a, b);
	    },

	    /*
	        Distance 1D
	        
	        Returns the distance between point A and point B
	        
	        @param [number]: Point A
	        @param [number]: (optional): Point B
	        @return [number]: The distance between the two points
	    */
	    distance1D: function (a) {
	        var b = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	        return Math.abs(a - b);
	    },

	    /*
	        Distance 2D
	        
	        Returns the distance between (0,0) and point A, unless point B
	        is provided, then we return the difference between the two.
	        
	        @param [object]: x and y of point A
	        @param [object]: (optional): x and y of point B
	        @return [number]: The distance between the two points
	    */
	    distance2D: function (a) {
	        var b = arguments.length <= 1 || arguments[1] === undefined ? zeroPoint : arguments[1];
	        return calc.hypotenuse(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
	    },

	    /*
	        Hypotenuse
	        
	        Returns the hypotenuse, side C, given the lengths of sides A and B.
	        
	        @param [number]: Length of A
	        @param [number]: Length of B
	        @return [number]: Length of C
	    */
	    hypotenuse: function (a, b) {
	        return Math.sqrt(a * a + b * b);
	    },

	    /*
	        Offset between two inputs
	        
	        Calculate the difference between two different inputs
	        
	        @param [Point]: First input
	        @param [Point]: Second input
	        @return [Offset]: Distance metrics between two points
	    */
	    offset: function (a, b) {
	        var offset = {};

	        utils.each(b, function (key, value) {
	            offset[key] = a.hasOwnProperty(key) ? value - a[key] : 0;
	        });

	        if (utils.isNum(offset.x) && utils.isNum(offset.y)) {
	            offset.angle = calc.angle(a, b);
	            offset.distance = calc.distance2D(a, b);
	        }

	        return offset;
	    },

	    /*
	        Point from angle and distance
	        
	        @param [object]: 2D point of origin
	        @param [number]: Angle from origin
	        @param [number]: Distance from origin
	        @return [object]: Calculated 2D point
	    */
	    pointFromAngleAndDistance: function (origin, angle, distance) {
	        angle = calc.degreesToRadians(angle);

	        return {
	            x: distance * Math.cos(angle) + origin.x,
	            y: distance * Math.sin(angle) + origin.y
	        };
	    },

	    /*
	        Progress within given range
	        
	        Given a lower limit and an upper limit, we return the progress
	        (expressed as a number 0-1) represented by the given value, and
	        limit that progress to within 0-1.
	        
	        @param [number]: Value to find progress within given range
	        @param [number]: Lower limit 
	        @param [number]: Upper limit
	        @return [number]: Progress of value within range as expressed 0-1
	    */
	    progress: function (value, from, to) {
	        return (value - from) / (to - from);
	    },

	    /*
	        Convert radians to degrees
	        
	        @param [number]: Value in radians
	        @return [number]: Value in degrees
	    */
	    radiansToDegrees: function (radians) {
	        return radians * 180 / Math.PI;
	    },

	    /*
	        Return random number between range
	        
	        @param [number] (optional): Output minimum
	        @param [number] (optional): Output maximum
	        @return [number]: Random number within range, or 0 and 1 if none provided
	    */
	    random: function () {
	        var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	        var max = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	        return Math.random() * (max - min) + min;
	    },

	    /*
	        Calculate relative value
	        
	        Takes the operator and value from a string, ie "+=5", and applies
	        to the current value to resolve a new target.
	        
	        @param [number]: Current value
	        @param [string]: Relative value
	        @return [number]: New value
	    */
	    relativeValue: function (current, rel) {
	        var newValue = current;
	        var equation = rel.split('=');
	        var operator = equation[0];

	        var _utils$splitValUnit = utils.splitValUnit(equation[1]);

	        var unit = _utils$splitValUnit.unit;
	        var value = _utils$splitValUnit.value;

	        value = parseFloat(value);

	        switch (operator) {
	            case '+':
	                newValue += value;
	                break;
	            case '-':
	                newValue -= value;
	                break;
	            case '*':
	                newValue *= value;
	                break;
	            case '/':
	                newValue /= value;
	                break;
	        }

	        if (unit) {
	            newValue += unit;
	        }

	        return newValue;
	    },

	    /*
	        Restrict value to range
	        
	        Return value within the range of lowerLimit and upperLimit
	        
	        @param [number]: Value to keep within range
	        @param [number]: Lower limit of range
	        @param [number]: Upper limit of range
	        @return [number]: Value as limited within given range
	    */
	    restricted: function (value, min, max) {
	        if (utils.isNum(min)) {
	            value = Math.max(value, min);
	        }

	        if (utils.isNum(max)) {
	            value = Math.min(value, max);
	        }

	        return value;
	    },

	    /*
	        Framerate-independent smoothing
	         @param [number]: New value
	        @param [number]: Old value
	        @param [number]: Frame duration
	        @param [number] (optional): Smoothing (0 is none)
	    */
	    smooth: function (newValue, oldValue, duration) {
	        var smoothing = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	        return calc.toDecimal(oldValue + duration * (newValue - oldValue) / Math.max(smoothing, duration));
	    },

	    /*
	        Convert x per second to per frame velocity based on fps
	        
	        @param [number]: Unit per second
	        @param [number]: Frame duration in ms
	    */
	    speedPerFrame: function (xps, frameDuration) {
	        return utils.isNum(xps) ? xps / (1000 / frameDuration) : 0;
	    },

	    /*
	        Convert velocity into velicity per second
	        
	        @param [number]: Unit per frame
	        @param [number]: Frame duration in ms
	    */
	    speedPerSecond: function (velocity, frameDuration) {
	        return velocity * (1000 / frameDuration);
	    },

	    /*
	        Convert number to decimal place
	    */
	    toDecimal: function (num) {
	        var precision = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

	        precision = Math.pow(10, precision);
	        return Math.round(num * precision) / precision;
	    },

	    /*
	        Value in range from progress
	        
	        Given a lower limit and an upper limit, we return the value within
	        that range as expressed by progress (a number from 0-1)
	        
	        @param [number]: The progress between lower and upper limits expressed 0-1
	        @param [number]: Lower limit of range
	        @param [number]: Upper limit of range
	        @return [number]: Value as calculated from progress within range (not limited within range)
	    */
	    value: function (progress, from, to) {
	        return -progress * from + progress * to + from;
	    },

	    /*
	        Eased value in range from progress
	        
	        Given a lower limit and an upper limit, we return the value within
	        that range as expressed by progress (a number from 0-1)
	        
	        @param [number]: The progress between lower and upper limits expressed 0-1
	        @param [number]: Lower limit of range, or upper if limit2 not provided
	        @param [number]: Upper limit of range
	        @param [function]: Easing to apply to value
	        @return [number]: Value as calculated from progress within range (not limited within range)
	    */
	    valueEased: function (progress, from, to, easing) {
	        return calc.value(easing(progress), from, to);
	    }
	};

	module.exports = calc;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var calc = __webpack_require__(17);
	var utils = __webpack_require__(8);
	var Action = __webpack_require__(19);
	var defaultAction = new Action();
	var Watch = __webpack_require__(21);
	var watcher = new Watch();

	module.exports = function (actor, framestamp, frameDuration) {
	    var numActiveValues = actor.activeValues.length;
	    var state = actor.state;

	    actor.hasChanged = false;

	    for (var i = 0; i < numActiveValues; i++) {
	        // Get value and key
	        var key = actor.activeValues[i];
	        var value = actor.values[key];
	        var action = !value.action || value.action && !value.action.isActive ? defaultAction : value.action;

	        // Fire action onFrameStart if not already fired
	        if (action.onFrameStart && action.lastUpdate !== framestamp) {
	            action.onFrameStart(actor, frameDuration, framestamp);
	            action.lastUpdate = framestamp;
	        }

	        // Calculate new value
	        var updatedValue = utils.has(value, 'watch') ? watcher.process(actor, value) : action.process(actor, value, key, frameDuration);

	        // User-defined transform function
	        if (value.transform) {
	            updatedValue = value.transform(updatedValue, key, actor);
	        }

	        // Limit if actor action does that kind of thing
	        if (action.limit && value.hasRange) {
	            updatedValue = action.limit(updatedValue, value);
	        }

	        // Smooth value if we have smoothing
	        if (value.smooth) {
	            updatedValue = calc.smooth(updatedValue, value.current, frameDuration, value.smooth);
	        }

	        // Round value if round is true
	        if (value.round) {
	            updatedValue = Math.round(updatedValue);
	        }

	        // Update frameChange
	        value.frameChange = updatedValue - value.current;

	        // Calculate velocity if Action hasn't
	        if (!action.calculatesVelocity) {
	            value.velocity = calc.speedPerSecond(value.frameChange, frameDuration);
	        }

	        // Update current speed
	        value.speed = Math.abs(value.velocity);

	        // Check if value's changed
	        if (value.current !== updatedValue || actor.firstFrame) {
	            actor.hasChanged = true;
	        }

	        // Set new current
	        value.current = updatedValue;
	        var valueState = value.unit ? updatedValue + value.unit : updatedValue;

	        // Put value in state if no parent
	        if (!value.parent) {
	            state.values[key] = valueState;

	            // Or, add to parent state to be combined later
	        } else {
	                state[value.parent] = state[value.parent] || {};
	                state[value.parent][value.propName] = valueState;
	            }
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Imports
	var calc = __webpack_require__(17);
	var utils = __webpack_require__(8);
	var Controls = __webpack_require__(20);
	var each = utils.each;

	// Values
	var DEFAULT_PROP = 'current';
	var PRIVATE = ['onStart', 'onFrame', 'onUpdate', 'onComplete'];

	var Action = function () {

	    /*
	        # Action class constructor
	        ## Assign default properties of Action or extended class and set user-defined props
	         @param [object]
	    */

	    function Action(props) {
	        var _this = this;

	        _classCallCheck(this, Action);

	        each(this.getDefaultProps(), function (key, value) {
	            _this[key] = value;
	        });

	        this.values = {};
	        this.set(props, this.getDefaultValueProp());
	    }

	    /*
	        # Set Action properties
	        ## Set user-defined Action properties
	         @param [object]
	        @param [string]: Name of default value property (set when `value` is **not** provided as object)
	        @return [Action]
	    */

	    Action.prototype.set = function set() {
	        var _this2 = this;

	        var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	        var defaultProp = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_PROP : arguments[1];

	        // Loop through non-`value` properties and set
	        each(props, function (key, value) {
	            if (key !== 'values') {
	                _this2[key] = value;
	            }
	        });

	        // Merge `value` properties with existing
	        if (props.values) {
	            (function () {
	                var currentValues = _this2.values;

	                each(props.values, function (key, value) {
	                    var existingValue = currentValues[key];
	                    var newValue = {};

	                    if (utils.isObj(value)) {
	                        newValue = value;
	                    } else {
	                        newValue[defaultProp] = value;
	                    }

	                    currentValues[key] = existingValue ? utils.merge(existingValue, newValue) : newValue;
	                });
	            })();
	        }

	        return this;
	    };

	    /*
	        # Process latest `current` value
	        ## Actions performs existing `current` value
	         @param [Actor]
	        @param [object]
	        @return [number]
	    */

	    Action.prototype.process = function process(actor, value) {
	        return value.current;
	    };

	    /*
	        # Has Action ended?
	        ## Returns `true` to end Action (Action only fires once).
	        
	        @return [boolean]
	    */

	    Action.prototype.hasEnded = function hasEnded() {
	        return true;
	    };

	    /*
	        # Limit value to within set parameters
	        ## Return value within min/max, with outlying values multiplied by `escapeAmp`
	         @param [number]
	        @param [object] { min: number, max: number, escapeAmp: factor }
	        @return [number]
	    */

	    Action.prototype.limit = function limit(output, value) {
	        var restricted = calc.restricted(output, value.min, value.max);
	        var escapeAmp = value.escapeAmp !== undefined ? value.escapeAmp : 0;

	        return restricted + (output - restricted) * escapeAmp;
	    };

	    /*
	        # Get Controls class for this Action
	        ## Inherited Actions may return different Controls class
	         @return [Controls]
	    */

	    Action.prototype.getControls = function getControls() {
	        return Controls;
	    };

	    /*
	        # Get default Action properties
	         @return [object]
	    */

	    Action.prototype.getDefaultProps = function getDefaultProps() {
	        return {};
	    };

	    /*
	        # Get default Action value properties
	         @return [object]
	    */

	    Action.prototype.getDefaultValue = function getDefaultValue() {
	        return {};
	    };

	    /*
	        # Get default Action value property name
	        ## Set this `value` property when set as value instead of object
	         @return [string]
	    */

	    Action.prototype.getDefaultValueProp = function getDefaultValueProp() {
	        return DEFAULT_PROP;
	    };

	    /*
	        # Get set properties
	        ## Get user-set properties for this Action
	         @return [object]
	    */

	    Action.prototype.getSet = function getSet() {
	        var _this3 = this;

	        var set = { values: this.values };

	        each(this, function (key, prop) {
	            if (_this3.hasOwnProperty(key) && PRIVATE.indexOf(key) === -1) {
	                set[key] = prop;
	            }
	        });

	        return set;
	    };

	    /*
	        # Extend this Action with new properties
	        ## Returns new instance of this Action's `prototype` with existing and new properties
	         @param [object] (optional)
	        @return [Action]
	    */

	    Action.prototype.extend = function extend(props) {
	        return new this.constructor(utils.merge(this, props), this.getDefaultValueProp());
	    };

	    /*
	        # Get a new playable version of this Action
	         @return [Action]
	    */

	    Action.prototype.getPlayable = function getPlayable() {
	        return this.extend();
	    };

	    /*
	        # Activate this Action
	         @return [Action]
	    */

	    Action.prototype.activate = function activate() {
	        this.isActive = true;
	        return this;
	    };

	    /*
	        # Deactivate this Action
	         @return [Action]
	    */

	    Action.prototype.deactivate = function deactivate() {
	        this.isActive = false;
	        return this;
	    };

	    return Action;
	}();

	module.exports = Action;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var each = __webpack_require__(8).each;

	var Controls = function () {
	    function Controls(actor, action, hasStarted) {
	        _classCallCheck(this, Controls);

	        this.actor = actor;
	        this.action = action;
	        this.saveOrigins();

	        if (hasStarted) {
	            this.id = this.bindAction();
	            this.action.activate();
	        }
	    }

	    Controls.prototype.start = function start(input) {
	        this.id = this.bindAction();
	        this.actor.start(this.id, input);
	        this.action.activate();
	        return this;
	    };

	    Controls.prototype.stop = function stop() {
	        this.actor.unbindAction(this.id);
	        this.action.deactivate();

	        return this;
	    };

	    Controls.prototype.pause = function pause() {
	        this.action.deactivate();
	        return this;
	    };

	    Controls.prototype.resume = function resume() {
	        this.action.activate();
	        return this;
	    };

	    Controls.prototype.toggle = function toggle() {
	        var resume = this.actor.hasAction(this.id) ? this.resume : this.start;
	        return this.action.isActive ? this.pause() : resume.call(this);
	    };

	    Controls.prototype.then = function then() {
	        var _actor;

	        (_actor = this.actor).then.apply(_actor, arguments);
	        return this;
	    };

	    Controls.prototype.bindAction = function bindAction() {
	        return this.actor.bindAction(this.action, this.id);
	    };

	    Controls.prototype.saveOrigins = function saveOrigins() {
	        var _this = this;

	        this.origins = {};

	        each(this.action.values, function (key, value) {
	            var actorValue = _this.actor.values[key];

	            _this.origins[key] = actorValue.current;

	            if (actorValue.children) {
	                each(actorValue.children, function (childKey, childValue) {
	                    _this.origins[key + childKey] = _this.actor.values[key + childKey].current;
	                });
	            }
	        });
	    };

	    Controls.prototype.restoreOrigins = function restoreOrigins() {
	        var _this2 = this;

	        each(this.origins, function (key, value) {
	            _this2.actor.values[key].origin = value;
	        });
	    };

	    return Controls;
	}();

	module.exports = Controls;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(19),
	    calc = __webpack_require__(17),
	    isString = __webpack_require__(8).isString,

	/*
	    Translate our mapLink value into mapTo
	    
	    @param [number]: Calculated value from linked value
	    @param [Value || object]: Linked value or empty object if we're linking to input
	    @param [array]: List of numbers relating to linked value
	    @param [array]: List of numbers relating to this value
	*/
	findMappedValue = function (newValue, linkedValue, toValue, mapLink, mapTo) {
	    var mapLength = mapLink.length,
	        i = 1,
	        lastLinkValue,
	        thisLinkValue,
	        lastToValue,
	        thisToValue;

	    for (; i < mapLength; i++) {
	        // Assign values from array, or if they're strings, look for them in linkedValue
	        lastLinkValue = isString(mapLink[i - 1]) ? linkedValue[mapLink[i - 1]] : mapLink[i - 1];
	        thisLinkValue = isString(mapLink[i]) ? linkedValue[mapLink[i]] : mapLink[i];
	        lastToValue = isString(mapTo[i - 1]) ? toValue[mapTo[i - 1]] : mapTo[i - 1];
	        thisToValue = isString(mapTo[i]) ? toValue[mapTo[i]] : mapTo[i];

	        // Check if we've gone past our calculated value, or if we're at the end of the array
	        if (newValue < thisLinkValue || i === mapLength - 1) {
	            newValue = calc.value(calc.restricted(calc.progress(newValue, lastLinkValue, thisLinkValue), 0, 1), lastToValue, thisToValue);
	            break;
	        }
	    }

	    return newValue;
	};

	var Watch = function (_Action) {
	    _inherits(Watch, _Action);

	    function Watch() {
	        _classCallCheck(this, Watch);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, _Action.call.apply(_Action, [this].concat(args)));

	        _this.isActive = true;
	        return _this;
	    }

	    /*
	        Process this value
	        
	        First check if this value exists as a Value, if not
	        check within Input (if we have one)
	            
	        @param [Actor]
	        @param [Value]: Current value
	        @param [string]: Key of current value
	        @return [number]: Calculated value
	    */

	    Watch.prototype.process = function process(actor, value, key) {
	        var watchedKey = value.watch;
	        var watchedValue = 0;
	        var values = actor.values;
	        var newValue = value.current;
	        var inputOffset = value.action ? value.action.inputOffset : false;

	        if (isString(watchedKey)) {
	            watchedValue = values[watchedKey] ? values[watchedKey] : {};

	            // First look at Action and check value isn't linking itself
	            if (watchedValue.current !== undefined && key !== watchedKey) {
	                newValue = watchedValue.current;

	                // Then check values in Input
	            } else if (inputOffset && inputOffset.hasOwnProperty(watchedKey)) {
	                    newValue = value.action.process(actor, value, watchedKey);
	                }
	        } else {
	            newValue = watchedKey(actor);
	        }

	        // If we have mapFrom and mapTo properties, translate the new value
	        if (value.mapFrom && value.mapTo) {
	            newValue = findMappedValue(newValue, watchedValue, value, value.mapFrom, value.mapTo);
	        }

	        return newValue;
	    };

	    return Watch;
	}(Action);

	module.exports = Watch;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypeManager = __webpack_require__(7);
	var each = __webpack_require__(8).each;

	var createMapper = function (role, mappedValues) {
	    return function (name, val) {
	        return mappedValues[role.map(name)] = val;
	    };
	};

	module.exports = function (actor) {
	    var numActiveParents = actor.activeParents.length;
	    var numRoles = actor.roles.length;

	    // Update parent values from calculated children
	    for (var i = 0; i < numActiveParents; i++) {
	        var key = actor.activeParents[i];
	        var value = actor.values[key];

	        // Update parent value current property
	        value.current = valueTypeManager[value.type].combine(actor.state[key], value.template);

	        // Update state
	        actor.state.values[key] = value.current;
	    }

	    // Fire `frame` and `update` callbacks on all Roles
	    for (var i = 0; i < numRoles; i++) {
	        var role = actor.roles[i];
	        var mappedValues = {};

	        each(actor.state.values, createMapper(role, mappedValues));

	        if (role.frame) {
	            role.frame.call(actor, mappedValues, actor);
	        }

	        if (role.update && actor.hasChanged) {
	            role.update.call(actor, mappedValues, actor);
	        }
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8);
	var each = utils.each;

	/*
	    Check all Actions for `onEnd`, return true if all are true

	    @param [Actor]
	    @param [boolean]
	    @returns [boolean]
	*/
	var checkAllActionsHaveEnded = function (actor, hasChanged) {
	    var hasEnded = true;
	    var values = actor.state.values;

	    each(actor.activeActions, function (key, action) {
	        // Return if action has been deleted elsewhere
	        if (!action) {
	            return;
	        }

	        if (action.onFrame) {
	            action.onFrame.call(actor, values, actor, action);
	        }

	        if (action.onUpdate && hasChanged) {
	            action.onUpdate.call(actor, values, actor, action);
	        }

	        if (action.hasEnded && action.hasEnded(actor) === false) {
	            hasEnded = false;
	        } else {
	            if (action.onComplete) {
	                action.onComplete.call(actor, actor, action);
	            }
	            actor.unbindAction(key);
	        }
	    });

	    return hasEnded;
	};

	module.exports = function (actor, framestamp) {
	    if (actor.isActive) {
	        actor.isActive = false;

	        if (checkAllActionsHaveEnded(actor, actor.hasChanged)) {
	            var numRoles = actor.roles.length;

	            // Fire `complete` callbacks
	            for (var i = 0; i < numRoles; i++) {
	                var role = actor.roles[i];
	                if (role.complete) {
	                    role.complete.call(actor, actor);
	                }
	            }

	            if (!actor.isActive) {
	                actor.next();
	            }
	        } else {
	            actor.isActive = true;
	            actor.firstFrame = false;
	        }
	    }

	    actor.framestamp = framestamp;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Role = __webpack_require__(25);

	module.exports = new Role({
	    init: function (actor) {
	        if (actor.init) {
	            actor.init(actor);
	        }
	    },

	    start: function (actor) {
	        if (actor.onStart) {
	            actor.onStart(actor);
	        }
	    },

	    frame: function (state, actor) {
	        if (actor.onFrame) {
	            actor.onFrame(state, actor);
	        }
	    },

	    update: function (state, actor) {
	        if (actor.onUpdate) {
	            actor.onUpdate(state, actor);
	        }
	    },

	    complete: function (actor) {
	        if (actor.onComplete) {
	            actor.onComplete(actor);
	        }
	    }
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8);
	var each = utils.each;

	/*
	    Role class constructor

	    @param [object]: Optional methods and props to add:
	        name [string]:      Name of generated getter/setter method on Actor
	        _map [object]:      Map Actor values to these values for this Role
	        _typeMap [object]:  Map values to value types
	        init [function]:    Callback to run when this Role is added to an Actor
	        start [function]:   Callback to run when host Actor starts an action
	        complete [function]: Callback to run when action completes
	        frame [function]:   Callback to fire once per frame
	        update [function]:  Callback to fire when values change
	        get [function]:     Read value from actual element
	        set [function]:     Set value on actual element
	*/
	var Role = function (methods) {
	    var role = function (element, opts, prop) {
	        var typeOfOpts = typeof opts;

	        // Set single, if this is a string and we have a property
	        if (typeOfOpts === 'string' && prop) {
	            role.set(element, opts, prop);

	            // Set multi, if this is an object
	        } else if (typeOfOpts === 'object') {
	                each(opts, function (key, value) {
	                    role.set(element, key, value);
	                });

	                // Or this is a get if we have a string and no props
	            } else {
	                    return role.get(element, opts);
	                }

	        return role;
	    };

	    role._map = {};

	    each(methods, function (name, method) {
	        role[name] = !utils.isObj(method) ? method : utils.copy(method);
	    });

	    /*
	        Map value keys or generate new Role with updated map
	         Getter:
	            @param [string]: Key to map
	            @return [string]: Mapped key, or key if no mapped key found
	         Setter: 
	            @param [object]: Map of Actor keys -> Role keys
	            @return [Role]: New Role with unique map
	    */
	    role.map = function (values) {
	        // If this is a string, get mapped value
	        // Otherwise this is a map, duplicated role with updated map
	        return utils.isString(values) ? this._map[values] || values : createRole(this, values);
	    };

	    return role;
	};

	/*
	    Create a new role

	    @param [object]: Optional methods and props to add
	    @param [valuesToMap]: Override existing map with these values
	    @return [Role]: New Role
	*/
	var createRole = function (methods, values) {
	    var newRole = new Role(methods);

	    each(values, function (key, value) {
	        newRole._map[key] = value;
	    });

	    return newRole;
	};

	module.exports = Role;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(25);
	var build = __webpack_require__(27);

	var prefixes = ['Webkit', 'Moz', 'O', 'ms', ''];
	var numPrefixes = prefixes.length;
	var propertyNameCache = {};
	var testElement;

	/*
	    Test style property for prefixed version
	    
	    @param [string]: Style property
	    @return [string]: Cached property name
	*/
	var testPrefix = function (key) {
	    testElement = testElement || document.createElement('div');

	    if (propertyNameCache[key] === false) {
	        return false;
	    } else {
	        propertyNameCache[key] = false;
	    }

	    for (var i = 0; i < numPrefixes; i++) {
	        var prefix = prefixes[i],
	            prefixed = prefix === '' ? key : prefix + key.charAt(0).toUpperCase() + key.slice(1);

	        if (prefixed in testElement.style) {
	            propertyNameCache[key] = prefixed;
	        }
	    }

	    return propertyNameCache[key];
	};

	var cssRole = new Role({
	    _map: __webpack_require__(30),
	    _typeMap: __webpack_require__(31),

	    init: function (actor) {
	        actor._cssCache = {};
	    },

	    update: function (state, actor) {
	        cssRole(actor.element, build(state, actor._cssCache));
	    },

	    get: function (element, key) {
	        key = propertyNameCache[key] || testPrefix(key);

	        if (key) {
	            return window.getComputedStyle(element, null)[key];
	        }
	    },

	    set: function (element, key, value) {
	        key = propertyNameCache[key] || testPrefix(key);

	        if (key) {
	            element.style[key] = value;
	        }
	    }

	});

	module.exports = cssRole;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var each = __webpack_require__(8).each,
	    transformDictionary = __webpack_require__(28),
	    transformProps = transformDictionary.props,
	    TRANSLATE_Z = 'translateZ';

	module.exports = function (output, cache) {
	    var css = {},
	        transform = '',
	        transformHasZ = false;

	    // Loop through output, check for transform properties
	    each(output, function (key, rule) {
	        // If this is a transform property, add to transform string
	        if (transformProps[key]) {
	            transform += key + '(' + rule + ')';
	            transformHasZ = key === TRANSLATE_Z ? true : transformHasZ;

	            // Or just assign directly
	        } else {
	                if (rule !== cache[key]) {
	                    cache[key] = css[key] = rule;
	                }
	            }
	    });

	    // If we have transform properties, add translateZ
	    if (transform !== '') {
	        if (!transformHasZ) {
	            transform += ' ' + TRANSLATE_Z + '(0px)';
	        }

	        if (transform !== cache.transform) {
	            css.transform = transform;
	        }

	        cache.transform = transform;
	    }

	    return css;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var positionTerms = __webpack_require__(29).positions,
	    numPositionTerms = positionTerms.length,
	    TRANSFORM_PERSPECTIVE = 'transformPerspective',
	    SCALE = 'scale',
	    ROTATE = 'rotate',
	    terms = {
	    funcs: ['translate', SCALE, ROTATE, 'skew', TRANSFORM_PERSPECTIVE],
	    props: {} // objects are faster at direct lookups
	};

	// Create transform terms
	(function () {
	    var funcs = terms.funcs,
	        props = terms.props,
	        numFuncs = funcs.length,
	        i = 0,
	        createProps = function (funcName) {
	        var j = 0;

	        for (; j < numPositionTerms; j++) {
	            props[funcName + positionTerms[j]] = true;
	        }
	    };

	    // Manually add skew and transform perspective 
	    props[ROTATE] = props[SCALE] = props[TRANSFORM_PERSPECTIVE] = true;

	    // Loop over each function name and create function/property terms
	    for (; i < numFuncs; i++) {
	        createProps(funcs[i]);
	    }
	})();

	module.exports = terms;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	var X = 'X',
	    Y = 'Y',
	    ALPHA = 'Alpha',
	    terms = {
	    colors: ['Red', 'Green', 'Blue', ALPHA],
	    positions: [X, Y, 'Z'],
	    dimensions: ['Top', 'Right', 'Bottom', 'Left'],
	    shadow: [X, Y, 'Radius', 'Spread', 'Color'],
	    hsl: ['Hue', 'Saturation', 'Lightness', ALPHA]
	};

	module.exports = terms;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var TRANSLATE = 'translate';

	module.exports = {
	    x: TRANSLATE + 'X',
	    y: TRANSLATE + 'Y',
	    z: TRANSLATE + 'Z'
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	var COLOR = 'color',
	    POSITIONS = 'positions',
	    DIMENSIONS = 'dimensions',
	    SCALE = 'scale',
	    SHADOW = 'shadow',
	    ANGLE = 'angle',
	    ALPHA = 'alpha',
	    PX = 'px';

	module.exports = {
	    // Color properties
	    color: COLOR,
	    backgroundColor: COLOR,
	    outlineColor: COLOR,
	    fill: COLOR,
	    stroke: COLOR,
	    // Border
	    borderColor: COLOR,
	    borderTopColor: COLOR,
	    borderRightColor: COLOR,
	    borderBottomColor: COLOR,
	    borderLeftColor: COLOR,
	    borderRadius: PX,
	    // Dimensions
	    margin: DIMENSIONS,
	    padding: DIMENSIONS,
	    width: PX,
	    height: PX,
	    // Positions
	    backgroundPosition: POSITIONS,
	    perspectiveOrigin: POSITIONS,
	    transformOrigin: POSITIONS,
	    // Shadows
	    textShadow: SHADOW,
	    boxShadow: SHADOW,
	    // Transform properties
	    rotate: ANGLE,
	    rotateX: ANGLE,
	    rotateY: ANGLE,
	    rotateZ: ANGLE,
	    scale: SCALE,
	    scaleX: SCALE,
	    scaleY: SCALE,
	    scaleZ: SCALE,
	    skewX: ANGLE,
	    skewY: ANGLE,
	    distance: PX,
	    translateX: PX,
	    translateY: PX,
	    translateZ: PX,
	    perspective: PX,
	    opacity: ALPHA
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(25),
	    attrRole = __webpack_require__(33),
	    build = __webpack_require__(34),
	    each = __webpack_require__(8).each;

	module.exports = new Role({
	    _map: __webpack_require__(30),
	    _typeMap: __webpack_require__(35),

	    start: function () {
	        var boundingBox = this.element.getBBox(),
	            values = this.values,

	        // TODO: Support px
	        transformOriginX = values.transformOriginX ? values.transformOriginX.current : 50,
	            transformOriginY = values.transformOriginY ? values.transformOriginY.current : 50,
	            origin = {
	            x: boundingBox.width * (transformOriginX / 100) + boundingBox.x,
	            y: boundingBox.height * (transformOriginY / 100) + boundingBox.y
	        };

	        this.svgOrigin = origin;
	    },

	    update: function (state) {
	        var actor = this;
	        each(build(state, this.svgOrigin), function (key, value) {
	            attrRole.set(actor.element, key, value);
	        });
	    }

	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(25);
	var each = __webpack_require__(8).each;

	var attrRole = new Role({
	    update: function (state) {
	        var actor = this;

	        each(state, function (key, value) {
	            attrRole.set(actor.element, key, value);
	        });
	    },

	    get: function (element, key) {
	        return element.getAttribute(key);
	    },

	    set: function (element, key, value) {
	        element.setAttribute(key, value);
	    }
	});

	module.exports = attrRole;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8);
	var transformDictionary = __webpack_require__(28);

	var each = utils.each;
	var camelToDash = utils.camelToDash;
	var transformProps = transformDictionary.props;
	var zeroNotZero = 0.0001;

	module.exports = function (output, origin) {
	    var props = {},
	        hasTransform = false,
	        scale = output.scale !== undefined ? output.scale || zeroNotZero : output.scaleX || 1,
	        scaleY = output.scaleY !== undefined ? output.scaleY || zeroNotZero : scale || 1,
	        transformOriginX = origin.x,
	        transformOriginY = origin.y,
	        scaleTransformX = -transformOriginX * (scale * 1),
	        scaleTransformY = -transformOriginY * (scaleY * 1),
	        scaleReplaceX = transformOriginX / scale,
	        scaleReplaceY = transformOriginY / scaleY,
	        transform = {
	        translate: 'translate(' + output.translateX + ', ' + output.translateY + ') ',
	        scale: 'translate(' + scaleTransformX + ', ' + scaleTransformY + ') scale(' + scale + ', ' + scaleY + ') translate(' + scaleReplaceX + ', ' + scaleReplaceY + ') ',
	        rotate: 'rotate(' + output.rotate + ', ' + transformOriginX + ', ' + transformOriginY + ') ',
	        skewX: 'skewX(' + output.skewX + ') ',
	        skewY: 'skewY(' + output.skewY + ') '
	    };

	    each(output, function (key, value) {
	        if (transformProps[key]) {
	            hasTransform = true;
	        } else {
	            props[camelToDash(key)] = value;
	        }
	    });

	    if (hasTransform) {
	        props.transform = '';

	        each(transform, function (key, value) {
	            var defaultValue = key === 'scale' ? '1' : '0';
	            props.transform += value.replace(/undefined/g, defaultValue);
	        });
	    }

	    return props;
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	var ALPHA = 'alpha';
	var COLOR = 'color';
	var SCALE = 'scale';

	module.exports = {
	    fill: COLOR,
	    stroke: COLOR,
	    scale: SCALE,
	    scaleX: SCALE,
	    scaleY: SCALE,
	    transformOrigin: 'positions',
	    d: 'complex',
	    opacity: ALPHA,
	    fillOpacity: ALPHA,
	    strokeOpacity: ALPHA
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(25);
	var attrRole = __webpack_require__(33);
	var each = __webpack_require__(8).each;

	/*
	    Convert percentage to pixels
	    
	    @param [number]: Percentage of total length
	    @param [number]: Total length
	*/
	var percentToPixels = function (percentage, length) {
	    return parseFloat(percentage) / 100 * length + 'px';
	};

	/*
	    Create styles
	    
	    @param [object]: SVG Path properties
	    @param [object]: Length of path
	    @returns [object]: Key/value pairs of valid CSS properties
	*/
	var createStyles = function (props, length) {
	    var hasDashArray = false,
	        dashArrayStyles = {
	        length: 0,
	        spacing: length + 'px'
	    },
	        styles = {};

	    each(props, function (key, value) {
	        key = SVGDrawPath._map[key] || key;

	        switch (key) {
	            case 'length':
	            case 'spacing':
	                hasDashArray = true;
	                dashArrayStyles[key] = percentToPixels(value, length);
	                break;
	            case 'offset':
	                styles['stroke-dashoffset'] = percentToPixels(-value, length);
	                break;
	            default:
	                styles[key] = value;
	        }
	    });

	    if (hasDashArray) {
	        styles['stroke-dasharray'] = dashArrayStyles.length + ' ' + dashArrayStyles.spacing;
	    }

	    return styles;
	};

	/*
	    Draw Path role
	*/
	var SVGDrawPath = new Role({
	    _map: __webpack_require__(37),

	    _typeMap: {
	        stroke: 'color',
	        d: 'complex'
	    },

	    init: function () {
	        this.pathLength = this.element.getTotalLength();
	    },

	    /*
	        Update `path` styles and if `element` is present, set
	        x, y and rotation
	    */
	    update: function (state) {
	        attrRole.update.call(this, createStyles(state, this.pathLength));
	    }
	});

	module.exports = SVGDrawPath;

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	var STROKE = 'stroke';

	module.exports = {
	    opacity: STROKE + '-opacity',
	    width: STROKE + '-width',
	    miterlimit: STROKE + '-miterlimit'
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Actor = __webpack_require__(9);
	var Tween = __webpack_require__(39);
	var utils = __webpack_require__(8);
	var calcRelative = __webpack_require__(17).relativeValue;

	var timeline = new Tween({
	    ease: 'linear',
	    values: {
	        playhead: 0
	    }
	});

	var checkActions = function (_ref, sequence) {
	    var playhead = _ref.playhead;

	    var i = sequence.check.length;

	    while (i--) {
	        var toCheck = sequence.check[i];

	        if (playhead >= toCheck.timestamp) {
	            toCheck.callback();
	            sequence.check.splice(i, 1);
	        }
	    }
	};

	var generateCallback = function (actor, action) {
	    var callback = undefined;

	    if (actor.each) {
	        callback = function () {
	            actor.each(action);
	        };
	    } else {
	        callback = function () {
	            actor.start(action);
	        };
	    }

	    return callback;
	};

	var Sequence = function (_Actor) {
	    _inherits(Sequence, _Actor);

	    function Sequence() {
	        _classCallCheck(this, Sequence);

	        return _possibleConstructorReturn(this, _Actor.call(this, {
	            check: [],
	            sequence: [],
	            duration: 0,
	            currentTimestamp: 0,
	            prevActionEnd: 0,
	            onUpdate: checkActions
	        }));
	    }

	    Sequence.prototype.do = function _do(actor, action) {
	        var isCallback = utils.isFunc(actor);

	        this.sequence.push({
	            timestamp: this.currentTimestamp,
	            callback: isCallback ? actor : generateCallback(actor, action)
	        });

	        if (action && action.duration) {
	            this.prevActionEnd = this.currentTimestamp + action.duration;
	        }

	        return this;
	    };

	    Sequence.prototype.stagger = function stagger(iterator, action, staggerProps) {
	        var numItems = iterator.members.length;
	        var interval = utils.isNum(staggerProps) ? staggerProps : staggerProps.interval || 100;
	        var duration = action.duration ? action.duration : 0;

	        this.do(iterator, function () {
	            iterator.stagger(action, staggerProps);
	        });

	        this.prevActionEnd = this.currentTimestamp + duration + interval * numItems;

	        return this;
	    };

	    Sequence.prototype.at = function at(timestamp) {
	        if (utils.isString(timestamp)) {
	            timestamp = calcRelative(this.currentTimestamp, timestamp);
	        }

	        this.currentTimestamp = timestamp;
	        this.duration = Math.max(this.currentTimestamp, this.duration);
	        return this;
	    };

	    Sequence.prototype.then = function then() {
	        var offset = arguments.length <= 0 || arguments[0] === undefined ? "+=0" : arguments[0];

	        this.at(calcRelative(this.prevActionEnd, offset));
	        return this;
	    };

	    Sequence.prototype.start = function start() {
	        _Actor.prototype.start.call(this, timeline.extend({
	            duration: this.duration,
	            values: {
	                playhead: {
	                    current: 0,
	                    to: this.duration
	                }
	            }
	        }));

	        return this;
	    };

	    Sequence.prototype.onStart = function onStart() {
	        this.check = this.sequence.slice();
	    };

	    Sequence.prototype.clear = function clear() {
	        this.sequence = [];
	        this.duration = this.currentTimestamp = this.prevActionEnd = 0;
	        return this;
	    };

	    return Sequence;
	}(Actor);

	module.exports = Sequence;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(19);
	var calc = __webpack_require__(17);
	var utils = __webpack_require__(8);
	var presetEasing = __webpack_require__(40);
	var valueOps = __webpack_require__(16);
	var TweenControls = __webpack_require__(43);
	var each = utils.each;

	var COUNT = 'count';
	var NEXT_STEPS = {
	    loop: 'restart',
	    yoyo: 'reverse',
	    flip: 'flipValues'
	};

	/*
	    Ease value within ranged parameters
	    
	    @param [number]: Progress between 0 and 1
	    @param [number]: Value of 0 progress
	    @param [number]: Value of 1 progress
	    @param [string || function]: Name of preset easing
	        to use or generated easing function
	    @return [number]: Value of eased progress in range
	*/
	function ease(progress, from, to, ease) {
	    var progressLimited = calc.restricted(progress, 0, 1);
	    var easingFunction = utils.isString(ease) ? presetEasing[ease] : ease;

	    return calc.valueEased(progressLimited, from, to, easingFunction);
	};

	var Tween = function (_Action) {
	    _inherits(Tween, _Action);

	    function Tween() {
	        _classCallCheck(this, Tween);

	        return _possibleConstructorReturn(this, _Action.apply(this, arguments));
	    }

	    Tween.prototype.getControls = function getControls() {
	        return TweenControls;
	    };

	    Tween.prototype.getDefaultProps = function getDefaultProps() {
	        return {
	            delay: 0,
	            dilate: 1,
	            duration: 300,
	            loop: false,
	            yoyo: false,
	            flip: false,
	            playDirection: 1,
	            ended: false,
	            elapsed: 0
	        };
	    };

	    Tween.prototype.getDefaultValue = function getDefaultValue() {
	        return {
	            delay: 0,
	            duration: 300,
	            ease: 'easeOut',
	            stagger: 0,
	            steps: 0,
	            to: 0,
	            round: false
	        };
	    };

	    Tween.prototype.getDefaultValueProp = function getDefaultValueProp() {
	        return 'to';
	    };

	    /*
	        Update Action elapsed time
	        
	        @param [object]: Action properties
	        @param [number]: Timestamp of current frame
	    */

	    Tween.prototype.onFrameStart = function onFrameStart(actor, frameDuration) {
	        this.elapsed = this.elapsed || 0;

	        if (frameDuration) {
	            this.elapsed += frameDuration * actor.dilate * this.playDirection;
	            this.ended = true;
	        }
	    };

	    /*
	        Calculate progress of value based on time elapsed,
	        value delay/duration/stagger properties
	         @param [Actor]
	        @param [object]: Value state and properties
	        @return [number]: Calculated value
	    */

	    Tween.prototype.process = function process(actor, value) {
	        var target = value.to;
	        var progressTarget = this.playDirection === 1 ? 1 : 0;
	        var newValue = value.current;

	        // If this value has a to property, otherwise we just return current value
	        if (target !== undefined) {
	            var progress = calc.restricted(calc.progress(this.elapsed - value.delay, 0, value.duration) - value.stagger, 0, 1);

	            // Mark Action as NOT ended if still in progress
	            if (progress !== progressTarget) {
	                this.ended = false;
	            }

	            // Step progress if we're stepping
	            if (value.steps) {
	                progress = utils.stepProgress(progress, value.steps);
	            }

	            // Ease value
	            newValue = ease(progress, value.origin, target, value.ease);
	        }

	        return newValue;
	    };

	    /*
	        If this tween has ended, check if we loop/yoyo/flip
	        
	        @return [boolean]: Has this tween really really ended?
	    */

	    Tween.prototype.hasEnded = function hasEnded(actor) {
	        var _this2 = this;

	        var ended = this.ended;

	        if (ended) {
	            each(NEXT_STEPS, function (name, methodName) {
	                if (_this2.checkNextStep(actor, name, _this2[methodName])) {
	                    ended = false;
	                    actor.hasChanged = true;
	                    return false;
	                }
	            });
	        }

	        // Reset `ended`
	        this.ended = false;

	        return ended;
	    };

	    Tween.prototype.checkNextStep = function checkNextStep(actor, name, method) {
	        var step = this[name];
	        var forever = step === true;
	        var count = this[name + COUNT] || 0;
	        var stepTaken = false;

	        if (forever || utils.isNum(step)) {
	            ++count;
	            this[name + COUNT] = count;

	            if (forever || count <= step) {
	                method.call(this, actor);
	                stepTaken = true;
	            }
	        }

	        return stepTaken;
	    };

	    Tween.prototype.flipValues = function flipValues(actor) {
	        var actorValues = actor.values;
	        this.elapsed = this.duration - this.elapsed;

	        each(this.values, function (key) {
	            var value = actorValues[key];

	            if (value.children) {
	                each(value.children, function (childKey) {
	                    valueOps.flip(actorValues[key + childKey]);
	                });
	            }

	            valueOps.flip(value);
	        });
	    };

	    Tween.prototype.reverse = function reverse() {
	        this.playDirection *= -1;
	    };

	    Tween.prototype.restart = function restart() {
	        this.elapsed = this.playDirection === 1 ? 0 : this.duration;
	        this.started = utils.currentTime();
	    };

	    return Tween;
	}(Action);

	module.exports = Tween;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	    Easing functions
	    ----------------------------------------
	    
	    Generates and provides easing functions based on baseFunction definitions
	    
	    A call to easingFunction.get('functionName') returns a function that can be passed:
	        @param [number]: Progress 0-1
	        @param [number] (optional): Amp modifier, only accepted in some easing functions
	                                    and is used to adjust overall strength
	        @return [number]: Eased progress
	        
	    We can generate new functions by sending an easing function through easingFunction.extend(name, method).
	    Which will make nameIn, nameOut and nameInOut functions available to use.
	        
	    Easing functions from Robert Penner
	    http://www.robertpenner.com/easing/
	        
	    Bezier curve interpretor created from Gaëtan Renaudeau's original BezierEasing  
	    https://github.com/gre/bezier-easing/blob/master/index.js  
	    https://github.com/gre/bezier-easing/blob/master/LICENSE

	    Anticipate easing created by Elliot Gino
	    https://twitter.com/ElliotGeno
	*/
	// Imports
	var Easing = __webpack_require__(41);
	var utils = __webpack_require__(8);

	// Values
	var DEFAULT_BACK_STRENGTH = 1.525;
	var DEFAULT_POW_STRENGTH = 2;

	// Utility functions
	var generatePowerEasing = function (strength) {
	    return function (progress, strength) {
	        return baseEasing.ease(progress, strength);
	    };
	};

	/*
	    Each of these base functions is an easeIn
	    
	    On init, we use .mirror and .reverse to generate easeInOut and
	    easeOut functions respectively.
	*/
	var baseEasing = {
	    ease: function (progress) {
	        var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_POW_STRENGTH : arguments[1];
	        return Math.pow(progress, strength);
	    },
	    circ: function (progress) {
	        return 1 - Math.sin(Math.acos(progress));
	    },
	    back: function (progress) {
	        var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BACK_STRENGTH : arguments[1];
	        return progress * progress * ((strength + 1) * progress - strength);
	    }
	};

	['cubic', 'quart', 'quint'].forEach(function (easingName, i) {
	    baseEasing[easingName] = generatePowerEasing(i + 3);
	});

	// Generate in/out/inOut variations
	utils.each(baseEasing, function (key, baseEase) {
	    var easingFunction = new Easing(baseEase);
	    baseEasing[key + 'In'] = easingFunction.in;
	    baseEasing[key + 'Out'] = easingFunction.out;
	    baseEasing[key + 'InOut'] = easingFunction.inOut;
	});

	baseEasing.linear = function (progress) {
	    return progress;
	};
	baseEasing.anticipate = function (progress) {
	    var strength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_BACK_STRENGTH : arguments[1];
	    return (progress *= 2) < 1 ? 0.5 * baseEasing.backIn(progress, strength) : 0.5 * (2 - Math.pow(2, -10 * (progress - 1)));
	};

	module.exports = baseEasing;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bezier = __webpack_require__(42),

	/*
	    Mirror easing
	    
	    Mirrors the provided easing function, used here for mirroring an
	    easeIn into an easeInOut
	    
	    @param [number]: Progress, from 0 - 1, of current shift
	    @param [function]: The easing function to mirror
	    @returns [number]: The easing-adjusted delta
	*/
	mirrorEasing = function (method) {
	    return function (progress, strength) {
	        return progress <= 0.5 ? method(2 * progress, strength) / 2 : (2 - method(2 * (1 - progress), strength)) / 2;
	    };
	},

	/*
	    Reverse easing
	    
	    Reverses the output of the provided easing function, used for flipping easeIn
	    curve to an easeOut.
	    
	    @param [number]: Progress, from 0 - 1, of current shift
	    @param [function]: The easing function to reverse
	    @returns [number]: The easing-adjusted delta
	*/
	reverseEasing = function (method) {
	    return function (progress, strength) {
	        return 1 - method(1 - progress, strength);
	    };
	};

	/*
	    Easing class

	    If provided easing function, returns easing function with 
	    in/out/inOut variations

	    If provided four arguments, returns new Bezier class instead.
	*/
	var Easing = function (x1, y1, x2, y2) {
	    var method = x1,
	        easingFunction;

	    // If this is a bezier curve, return a bezier function
	    if (arguments.length > 1) {
	        easingFunction = new Bezier(x1, y1, x2, y2);
	    } else {
	        easingFunction = function (progress, strength) {
	            return method(progress, strength);
	        };
	        easingFunction.in = function (progress, strength) {
	            return method(progress, strength);
	        };
	        easingFunction.out = reverseEasing(method);
	        easingFunction.inOut = mirrorEasing(method);
	    }

	    return easingFunction;
	};

	module.exports = Easing;

/***/ },
/* 42 */
/***/ function(module, exports) {

	/*
	    Bezier function generator
	        
	    Gaëtan Renaudeau's BezierEasing
	    https://github.com/gre/bezier-easing/blob/master/index.js  
	    https://github.com/gre/bezier-easing/blob/master/LICENSE
	    You're a hero
	    
	    Use
	    
	        var easeOut = new Bezier(.17,.67,.83,.67),
	            x = easeOut(0.5); // returns 0.627...
	*/
	"use strict";

	var NEWTON_ITERATIONS = 8,
	    NEWTON_MIN_SLOPE = 0.001,
	    SUBDIVISION_PRECISION = 0.0000001,
	    SUBDIVISION_MAX_ITERATIONS = 10,
	    K_SPLINE_TABLE_SIZE = 11,
	    K_SAMPLE_STEP_SIZE = 1.0 / (K_SPLINE_TABLE_SIZE - 1.0),
	    FLOAT_32_SUPPORTED = typeof Float32Array !== 'undefined',
	    a = function (a1, a2) {
	    return 1.0 - 3.0 * a2 + 3.0 * a1;
	},
	    b = function (a1, a2) {
	    return 3.0 * a2 - 6.0 * a1;
	},
	    c = function (a1) {
	    return 3.0 * a1;
	},
	    getSlope = function (t, a1, a2) {
	    return 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
	},
	    calcBezier = function (t, a1, a2) {
	    return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
	},

	/*
	    Bezier constructor
	*/
	Bezier = function (mX1, mY1, mX2, mY2) {
	    var sampleValues = FLOAT_32_SUPPORTED ? new Float32Array(K_SPLINE_TABLE_SIZE) : new Array(K_SPLINE_TABLE_SIZE),
	        _precomputed = false,
	        binarySubdivide = function (aX, aA, aB) {
	        var currentX,
	            currentT,
	            i = 0;

	        do {
	            currentT = aA + (aB - aA) / 2.0;
	            currentX = calcBezier(currentT, mX1, mX2) - aX;
	            if (currentX > 0.0) {
	                aB = currentT;
	            } else {
	                aA = currentT;
	            }
	        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

	        return currentT;
	    },
	        newtonRaphsonIterate = function (aX, aGuessT) {
	        var i = 0,
	            currentSlope = 0.0,
	            currentX;

	        for (; i < NEWTON_ITERATIONS; ++i) {
	            currentSlope = getSlope(aGuessT, mX1, mX2);

	            if (currentSlope === 0.0) {
	                return aGuessT;
	            }

	            currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	            aGuessT -= currentX / currentSlope;
	        }

	        return aGuessT;
	    },
	        calcSampleValues = function () {
	        for (var i = 0; i < K_SPLINE_TABLE_SIZE; ++i) {
	            sampleValues[i] = calcBezier(i * K_SAMPLE_STEP_SIZE, mX1, mX2);
	        }
	    },
	        getTForX = function (aX) {
	        var intervalStart = 0.0,
	            currentSample = 1,
	            lastSample = K_SPLINE_TABLE_SIZE - 1,
	            dist = 0.0,
	            guessForT = 0.0,
	            initialSlope = 0.0;

	        for (; currentSample != lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	            intervalStart += K_SAMPLE_STEP_SIZE;
	        }

	        --currentSample;

	        dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	        guessForT = intervalStart + dist * K_SAMPLE_STEP_SIZE;

	        initialSlope = getSlope(guessForT, mX1, mX2);

	        // If slope is greater than min
	        if (initialSlope >= NEWTON_MIN_SLOPE) {
	            return newtonRaphsonIterate(aX, guessForT);
	            // Slope is equal to min
	        } else if (initialSlope === 0.0) {
	                return guessForT;
	                // Slope is less than min
	            } else {
	                    return binarySubdivide(aX, intervalStart, intervalStart + K_SAMPLE_STEP_SIZE);
	                }
	    },
	        precompute = function () {
	        _precomputed = true;
	        if (mX1 != mY1 || mX2 != mY2) {
	            calcSampleValues();
	        }
	    },

	    /*
	        Generated function
	        
	        Returns value 0-1 based on X
	    */
	    f = function (aX) {
	        var returnValue;

	        if (!_precomputed) {
	            precompute();
	        }

	        // If linear gradient, return X as T
	        if (mX1 === mY1 && mX2 === mY2) {
	            returnValue = aX;

	            // If at start, return 0
	        } else if (aX === 0) {
	                returnValue = 0;

	                // If at end, return 1
	            } else if (aX === 1) {
	                    returnValue = 1;
	                } else {
	                    returnValue = calcBezier(getTForX(aX), mY1, mY2);
	                }

	        return returnValue;
	    };

	    return f;
	};

	module.exports = Bezier;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Controls = __webpack_require__(20);

	var TweenControls = function (_Controls) {
	    _inherits(TweenControls, _Controls);

	    function TweenControls() {
	        _classCallCheck(this, TweenControls);

	        return _possibleConstructorReturn(this, _Controls.apply(this, arguments));
	    }

	    TweenControls.prototype.restart = function restart() {
	        this.restoreOrigins();
	        this.action.restart();
	        return this;
	    };

	    TweenControls.prototype.reverse = function reverse() {
	        this.restoreOrigins();
	        this.action.reverse();
	        return this;
	    };

	    TweenControls.prototype.seek = function seek(progress) {
	        if (!this.actor.hasAction(this.id)) {
	            this.start().pause();
	        }

	        this.action.elapsed = this.action.duration * progress;

	        if (!this.action.isActive) {
	            this.action.activate();
	            this.actor.process.fire();
	            this.action.deactivate();
	        }

	        return this;
	    };

	    return TweenControls;
	}(Controls);

	module.exports = TweenControls;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Input controller
	*/
	"use strict";

	var calc = __webpack_require__(17),
	    utils = __webpack_require__(8),
	    History = __webpack_require__(45),

	/*
	    Input constructor
	    
	        Syntax
	            newInput(name, value[, poll])
	                @param [string]: Name of to track
	                @param [number]: Initial value
	                @param [function] (optional): Function to poll Input data
	                
	            newInput(props[, poll])
	                @param [object]: Object of values
	                @param [function] (optional): Function to poll Input data
	     @return [Input]
	*/
	Input = function () {
	    var pollPos = arguments.length - 1;

	    this.current = {};
	    this.offset = {};
	    this.velocity = {};
	    this.history = new History();
	    this.update(arguments[0], arguments[1]);

	    if (utils.isFunc(arguments[pollPos])) {
	        this.poll = arguments[pollPos];
	    }
	};

	Input.prototype = {

	    // [number]: Number of frames of inactivity before velocity is turned to 0
	    maxInactiveFrames: 2,

	    // [number]: Number of frames input hasn't been updated
	    inactiveFrames: 0,

	    /*
	        Get latest input values
	        
	        @param [string] (optional): Name of specific property to return
	        @return [object || number]: Latest input values or, if specified, single value
	    */
	    get: function (prop) {
	        var latest = this.history.get(),
	            val = prop !== undefined ? latest[prop] : latest;
	        return val;
	    },

	    /*
	        Update the input values
	        
	        Syntax
	            input.update(name, value)
	                @param [string]: Name of to track
	                @param [number]: Initial value
	                
	            input.update(props)
	                @param [object]: Object of values
	                
	        @return [Input]
	    */
	    update: function (arg0, arg1) {
	        var values = {};

	        if (utils.isNum(arg1)) {
	            values[arg0] = arg1;
	        } else {
	            values = arg0;
	        }

	        this.history.add(utils.merge(this.current, values));

	        return this;
	    },

	    /*
	        Check for input movement and update pointer object's properties
	        
	        @param [number]: Timestamp of frame
	        @return [Input]
	    */
	    onFrame: function (timestamp) {
	        var latest, hasChanged;

	        // Check provided timestamp against lastFrame timestamp and return input has already been updated
	        if (timestamp === this.lastFrame) {
	            return;
	        }

	        latest = this.poll ? this.poll() : this.history.get();
	        hasChanged = utils.hasChanged(this.current, latest);

	        // If input has changed between frames 
	        if (hasChanged) {
	            this.velocity = calc.offset(this.current, latest);
	            this.current = latest;
	            this.inactiveFrames = 0;

	            // Or it hasn't moved and our frame limit has been reached
	        } else if (this.inactiveFrames >= this.maxInactiveFrames) {
	                this.velocity = calc.offset(this.current, this.current);

	                // Or input hasn't changed
	            } else {
	                    this.inactiveFrames++;
	                }

	        this.lastFrame = timestamp;

	        return this;
	    }
	};

	module.exports = Input;

/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var maxHistorySize = 3;

	var History = function () {

	    /*
	        History constructor
	        
	        @param [var]: Variable to store in first history slot
	        @param [int] (optional): Maximum size of history
	    */

	    function History(obj) {
	        var max = arguments.length <= 1 || arguments[1] === undefined ? maxHistorySize : arguments[1];

	        _classCallCheck(this, History);

	        this.max = max;
	        this.entries = [];
	        this.add(obj);
	    }

	    /*
	        Push new var to history
	        
	        Shift out oldest entry if we've reached maximum capacity
	        
	        @param [var]: Variable to push into history.entries
	    */

	    History.prototype.add = function add(obj) {
	        this.entries.push(obj);

	        if (this.getSize() >= this.max) {
	            this.entries.shift();
	        }
	    };

	    /*
	        Get variable at specified index
	         @param [int]: Index
	        @return [var]: Var found at specified index
	    */

	    History.prototype.get = function get() {
	        var i = arguments.length <= 0 || arguments[0] === undefined ? this.getSize() - 1 : arguments[0];

	        return this.entries[i];
	    };

	    /*
	        Get the second newest history entry
	        
	        @return [var]: Entry found at index size - 2
	    */

	    History.prototype.getPrevious = function getPrevious() {
	        return this.get(this.getSize() - 2);
	    };

	    /*
	        Get current history size
	        
	        @return [int]: Current length of entries.length
	    */

	    History.prototype.getSize = function getSize() {
	        return this.entries.length;
	    };

	    return History;
	}();

	module.exports = History;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Actor = __webpack_require__(9);
	var Tween = __webpack_require__(39);
	var utils = __webpack_require__(8);

	var DEFAULT_STAGGER_EASE = 'linear';

	function generateCallback(method) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	    }

	    var callback = method;

	    if (utils.isString(method)) {
	        callback = function (member) {
	            return member[method].apply(member, args);
	        };
	    } else if (!utils.isFunc(method)) {
	        callback = function (member) {
	            member.start.apply(member, [method].concat(args));
	        };
	    }

	    return callback;
	}

	var Iterator = function () {
	    function Iterator(members) {
	        _classCallCheck(this, Iterator);

	        this.clear();

	        if (members) {
	            this.add(members);
	        }

	        this._stagger = new Actor();
	    }

	    Iterator.prototype.add = function add(members) {
	        this.members = this.members.concat(members);
	        return this;
	    };

	    Iterator.prototype.clear = function clear() {
	        this.members = [];
	        return this;
	    };

	    Iterator.prototype.each = function each(method) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	            args[_key2 - 1] = arguments[_key2];
	        }

	        var callback = generateCallback.apply(undefined, [method].concat(args));
	        this.members.forEach(callback);
	        return this;
	    };

	    Iterator.prototype.eachIntoNew = function eachIntoNew(method) {
	        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	            args[_key3 - 1] = arguments[_key3];
	        }

	        var callback = generateCallback.apply(undefined, [method].concat(args));
	        var newIterator = new Iterator();

	        this.members.forEach(function (member) {
	            return newIterator.add(callback(member));
	        });

	        return newIterator;
	    };

	    Iterator.prototype.stagger = function stagger(method, props) {
	        var tempMembers = utils.copyArray(this.members);
	        var numMembers = tempMembers.length;
	        var propsIsInterval = utils.isNum(props);
	        var interval = propsIsInterval ? props : props.interval || 100;

	        for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
	            args[_key4 - 2] = arguments[_key4];
	        }

	        var callback = generateCallback.apply(undefined, [method].concat(args));

	        var i = -1;
	        var staggerProps = {};

	        staggerProps.values = {
	            i: {
	                current: -0.6,
	                duration: interval * numMembers,
	                ease: propsIsInterval ? DEFAULT_STAGGER_EASE : props.ease || DEFAULT_STAGGER_EASE,
	                round: true,
	                to: numMembers - 0.6
	            }
	        };

	        staggerProps.onComplete = propsIsInterval ? undefined : props.onComplete;

	        staggerProps.onUpdate = function (output) {
	            var newIndex = output.i;
	            var gapIndex = i + 1;

	            // If our new index is only one more than the previous index, fire immedietly
	            if (newIndex === i + 1) {
	                callback(tempMembers[gapIndex], gapIndex);

	                // Or loop through the distance to fire all indecies. Increase delay.
	            } else {
	                    for (; gapIndex <= newIndex; gapIndex++) {
	                        callback(tempMembers[gapIndex], gapIndex);
	                    }
	                }

	            i = newIndex;
	        };

	        this._stagger.start(new Tween(staggerProps));

	        return this;
	    };

	    /*
	        Array manipulation
	    */

	    Iterator.prototype.reverse = function reverse() {
	        this.members.reverse();
	        return this;
	    };

	    return Iterator;
	}();

	module.exports = Iterator;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Imports
	var Action = __webpack_require__(19);
	var calc = __webpack_require__(17);
	var utils = __webpack_require__(8);
	var simulations = __webpack_require__(48);

	// Values
	var DEFAULT_PROP = 'velocity';

	var Simulate = function (_Action) {
	    _inherits(Simulate, _Action);

	    /*
	        # Simulate class constructor
	        ## Sets parent Action class and then default Simulate properties
	         @param [object]
	    */

	    function Simulate() {
	        _classCallCheck(this, Simulate);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, _Action.call.apply(_Action, [this].concat(args)));

	        _this.calculatesVelocity = true;
	        _this.inactiveFrames = 0;
	        return _this;
	    }

	    /*
	        # Get default Simulate props
	         @return [object]
	    */

	    Simulate.prototype.getDefaultProps = function getDefaultProps() {
	        return {
	            autoEnd: true,
	            maxInactiveFrames: 3
	        };
	    };

	    /*
	        # Get default Simulate value props
	         @return [object]
	    */

	    Simulate.prototype.getDefaultValue = function getDefaultValue() {
	        return {
	            // [string]: Simulation to .run
	            simulate: DEFAULT_PROP,

	            // [number]: Acceleration to apply to value, in units per second
	            acceleration: 0,

	            // [number]: Factor to multiply velocity by on bounce
	            bounce: 0,

	            // [number]: Spring strength during 'string'
	            spring: 80,

	            // [number]: Timeconstant of glide
	            timeConstant: 395,

	            // [number]: Stop simulation under this speed
	            stopSpeed: 0.0001,

	            // [boolean]: Capture with spring physics on limit breach
	            capture: false,

	            // [number]: Friction to apply per frame
	            friction: 0,

	            to: 0,
	            round: false
	        };
	    };

	    /*
	        # Get default Simulate value property name
	        ## Set values to this when a `value` is not provided as an object
	         @return [string]
	    */

	    Simulate.prototype.getDefaultValueProp = function getDefaultValueProp() {
	        return DEFAULT_PROP;
	    };

	    /*
	        # Method to fire when Action starts
	        ## Set `started` to current time.
	    */

	    Simulate.prototype.onStart = function onStart() {
	        this.started = utils.currentTime();
	    };

	    /*
	        # Fire at start of every frame
	        ## Set `hasChanged` to false
	    */

	    Simulate.prototype.onFrameStart = function onFrameStart() {
	        this.hasChanged = false;
	    };

	    /*
	        # Simulate the `value`s per-frame movement
	        
	        @param [Actor]
	        @param [Value]: Current value
	        @param [string]: Key of current value
	        @param [number]: Duration of frame in ms
	        @return [number]: Calculated value
	    */

	    Simulate.prototype.process = function process(actor, value, key, timeSinceLastFrame) {
	        var current = value.current;
	        var simulate = value.simulate;
	        var newValue = current;

	        // If string, use in-built simulation otherwise treat as function
	        var simulation = utils.isString(simulate) ? simulations[simulate] : simulate;

	        var newVelocity = simulation ? simulation(value, timeSinceLastFrame, this.started) : 0;

	        value.velocity = Math.abs(newVelocity) >= value.stopSpeed ? newVelocity : 0;

	        newValue = value.current + calc.speedPerFrame(value.velocity, timeSinceLastFrame);

	        if (newValue !== current) {
	            this.hasChanged = true;
	        }

	        return newValue;
	    };

	    /*
	        # Has this action ended?
	        ## Use a framecounter to see if Action has changed in the last x frames
	        and declare ended if not
	        
	        @param [Actor]
	        @return [boolean]: Has Action ended?
	    */

	    Simulate.prototype.hasEnded = function hasEnded(actor) {
	        var ended = false;

	        if (this.autoEnd) {
	            this.inactiveFrames = this.hasChanged ? 0 : this.inactiveFrames + 1;
	            ended = this.inactiveFrames > actor.maxInactiveFrames;
	        }

	        return ended;
	    };

	    /*
	        # Limit output to value range, if any
	        ## If velocity is at or more than range, and value has a bounce property,
	        run the bounce simulation
	        
	        @param [number]: Calculated output
	        @param [Value]: Current Value
	        @return [number]: Limit-adjusted output
	    */

	    Simulate.prototype.limit = function limit(output, value) {
	        var isOutsideMax = output >= value.max;
	        var isOutsideMin = output <= value.min;
	        var isOutsideRange = isOutsideMax || isOutsideMin;

	        if (isOutsideRange) {
	            output = calc.restricted(output, value.min, value.max);

	            if (value.bounce) {
	                value.velocity = simulations.bounce(value);
	            } else if (value.capture) {
	                simulations.capture(value, isOutsideMax ? value.max : value.min);
	            }
	        }

	        return output;
	    };

	    return Simulate;
	}(Action);

	module.exports = Simulate;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var calc = __webpack_require__(17),
	    utils = __webpack_require__(8),
	    speedPerFrame = calc.speedPerFrame;

	/*
	    Add core physics simulations
	*/
	var simulations = {
	    /*
	        Velocity
	        
	        The default .run() simulation.
	        
	        Applies any set deceleration and acceleration to existing velocity
	    */
	    velocity: function (value, duration) {
	        value.velocity = value.velocity + speedPerFrame(value.acceleration, duration);

	        return simulations.friction(value, duration);
	    },

	    /*
	        Glide
	        
	        Emulates touch device scrolling effects with exponential decay
	        http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html
	    */
	    glide: function (value, duration, started) {
	        var timeUntilFinished = -utils.currentTime() - started,
	            delta = -value.to * Math.exp(timeUntilFinished / value.timeConstant);

	        return value.to + delta - value.current;
	    },

	    /*
	        Friction
	         Apply friction to the current value
	        TODO: Make this framerate-independent
	    */
	    friction: function (value, duration) {
	        var newVelocity = speedPerFrame(value.velocity, duration) * (1 - value.friction);

	        return calc.speedPerSecond(newVelocity, duration);
	    },

	    spring: function (value, duration) {
	        var distance = value.to - value.current;

	        value.velocity += distance * speedPerFrame(value.spring, duration);

	        return simulations.friction(value, duration);
	    },

	    bounce: function (value) {
	        var distance = 0,
	            to = value.to,
	            current = value.current,
	            bounce = value.bounce;

	        // If we're using glide simulation we have to flip our target too
	        if (value.simulate === 'glide') {
	            distance = to - current;
	            value.to = current - distance * bounce;
	        }

	        return value.velocity *= -bounce;
	    },

	    capture: function (value, target) {
	        value.to = target;
	        value.simulate = 'spring';
	        value.capture = value.min = value.max = undefined;
	    }
	};

	module.exports = simulations;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(19),
	    Pointer = __webpack_require__(50),
	    calc = __webpack_require__(17);

	var Track = function (_Action) {
	    _inherits(Track, _Action);

	    function Track() {
	        _classCallCheck(this, Track);

	        return _possibleConstructorReturn(this, _Action.apply(this, arguments));
	    }

	    /*
	        Update input offset
	    */

	    Track.prototype.onFrameStart = function onFrameStart(actor, frameDuration, framestamp) {
	        actor.state.input = this.input.onFrame(framestamp);
	        this.inputOffset = calc.offset(this.inputOrigin, this.input.current);
	        this.frameDuration = frameDuration;
	    };

	    /*
	        Move Value relative to Input movement
	        
	        @param [Value]: Current value
	        @param [string]: Key of current value
	        @return [number]: Calculated value
	    */

	    Track.prototype.process = function process(actor, value, key) {
	        var newValue = value.current;

	        if (this.inputOffset.hasOwnProperty(key)) {
	            newValue = value.direct ? this.input.current[key] : value.origin + this.inputOffset[key] * value.amp;
	        }

	        return newValue;
	    };

	    /*
	        Has this Action ended? 
	        
	        @return [boolean]: False to make user manually finish .track()
	    */

	    Track.prototype.hasEnded = function hasEnded() {
	        return false;
	    };

	    Track.prototype.deactivate = function deactivate() {
	        _Action.prototype.deactivate.call(this);

	        if (this.input && this.input.stop) {
	            this.input.stop();
	        }

	        return this;
	    };

	    Track.prototype.bindInput = function bindInput(input) {
	        this.input = !input.current ? new Pointer(input) : input;
	        this.inputOrigin = this.input.get();
	    };

	    Track.prototype.getDefaultValue = function getDefaultValue() {
	        return {
	            amp: 1,
	            escapeAmp: 0,
	            direct: false,
	            smooth: 0
	        };
	    };

	    return Track;
	}(Action);

	module.exports = Track;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Input = __webpack_require__(44),
	    currentPointer,
	    // Sort this out for multitouch

	TOUCHMOVE = 'touchmove',
	    MOUSEMOVE = 'mousemove',

	/*
	    Convert event into point
	    
	    Scrape the x/y coordinates from the provided event
	    
	    @param [event]: Original pointer event
	    @param [boolean]: True if touch event
	    @return [object]: x/y coordinates of event
	*/
	eventToPoint = function (event, isTouchEvent) {
	    var touchChanged = isTouchEvent ? event.changedTouches[0] : false;

	    return {
	        x: touchChanged ? touchChanged.clientX : event.pageX,
	        y: touchChanged ? touchChanged.clientY : event.pageY
	    };
	},

	/*
	    Get actual event
	    
	    Checks for jQuery's .originalEvent if present
	    
	    @param [event | jQuery event]
	    @return [event]: The actual JS event  
	*/
	getActualEvent = function (event) {
	    return event.originalEvent || event;
	},

	/*
	    Pointer constructor
	*/
	Pointer = function (e) {
	    var event = getActualEvent(e),
	        // In case of jQuery event
	    isTouch = event.touches ? true : false,
	        startPoint = eventToPoint(event, isTouch);

	    this.update(startPoint);
	    this.isTouch = isTouch;
	    this.bindEvents();
	},
	    proto = Pointer.prototype = new Input();

	/*
	    Bind move event
	*/
	proto.bindEvents = function () {
	    this.moveEvent = this.isTouch ? TOUCHMOVE : MOUSEMOVE;
	    this.autoStop = true;

	    currentPointer = this;

	    document.documentElement.addEventListener(this.moveEvent, this.onMove);
	};

	/*
	    Unbind move event
	*/
	proto.unbindEvents = function () {
	    document.documentElement.removeEventListener(this.moveEvent, this.onMove);
	};

	/*
	    Pointer onMove event handler
	    
	    @param [event]: Pointer move event
	*/
	proto.onMove = function (e) {
	    var newPoint = eventToPoint(e, currentPointer.isTouch);
	    e = getActualEvent(e);
	    e.preventDefault();
	    currentPointer.update(newPoint);
	};

	proto.stop = function () {
	    this.unbindEvents();
	};

	module.exports = Pointer;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Actor = __webpack_require__(9),
	    Iterator = __webpack_require__(46),
	    selectDom = __webpack_require__(15);

	var SAVE_PROP = '__pm_actor_';

	module.exports = function (selector) {
	    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var dom = selectDom(selector),
	        actors = [];

	    dom.forEach(function (element) {
	        var actor = element[SAVE_PROP];

	        if (!actor) {
	            opts.element = element;
	            actor = element[SAVE_PROP] = new Actor(opts);
	        }

	        actors.push(actor);
	    });

	    return actors.length > 1 ? new Iterator(actors) : actors[0];
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (easing) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  return function (progress) {
	    return easing.apply(undefined, [progress].concat(args));
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    defaultProps: {
	        min: 0,
	        max: 1
	    }
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    defaultProps: {
	        unit: 'deg'
	    }
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    defaultProps: {
	        unit: 'px'
	    }
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(57),
	    getColorValues = __webpack_require__(58),
	    functionCreate = __webpack_require__(61),
	    defaultProps = __webpack_require__(62),
	    terms = __webpack_require__(29).hsl;

	module.exports = {

	    defaultProps: {
	        Hue: {
	            min: 0,
	            max: 360
	        },
	        Saturation: defaultProps.percent,
	        Lightness: defaultProps.percent,
	        Alpha: defaultProps.opacity
	    },

	    test: function (value) {
	        return value && value.indexOf('hsl') > -1;
	    },

	    split: function (value) {
	        return getColorValues(value, terms);
	    },

	    combine: function (values) {
	        return functionCreate(createDelimited(values, terms, ', ', 2), 'hsla');
	    }
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (values, terms, delimiter, chop) {
	    var combined = '',
	        key = '',
	        i = 0,
	        numTerms = terms.length;

	    for (; i < numTerms; i++) {
	        key = terms[i];

	        if (values.hasOwnProperty(key)) {
	            combined += values[key] + delimiter;
	        }
	    }

	    if (chop) {
	        combined = combined.slice(0, -chop);
	    }

	    return combined;
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var splitCommaDelimited = __webpack_require__(59),
	    functionBreak = __webpack_require__(60);

	module.exports = function (value, terms) {
	    var splitValue = {},
	        numTerms = terms.length,
	        colors = splitCommaDelimited(functionBreak(value)),
	        i = 0;

	    for (; i < numTerms; i++) {
	        splitValue[terms[i]] = colors[i] !== undefined ? colors[i] : 1;
	    }

	    return splitValue;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isString = __webpack_require__(8).isString;

	module.exports = function (value) {
	  return isString(value) ? value.split(/,\s*/) : [value];
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
	  return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (value, prefix) {
	  return prefix + "(" + value + ")";
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    color: {
	        min: 0,
	        max: 255,
	        round: true
	    },
	    opacity: {
	        min: 0,
	        max: 1
	    },
	    percent: {
	        min: 0,
	        max: 100,
	        unit: '%'
	    }
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(57),
	    getColorValues = __webpack_require__(58),
	    functionCreate = __webpack_require__(61),
	    defaultProps = __webpack_require__(62),
	    colorDefaults = defaultProps.color,
	    terms = __webpack_require__(29).colors;

	module.exports = {

	    defaultProps: {
	        Red: colorDefaults,
	        Green: colorDefaults,
	        Blue: colorDefaults,
	        Alpha: defaultProps.opacity
	    },

	    test: function (value) {
	        return value && value.indexOf('rgb') > -1;
	    },

	    split: function (value) {
	        return getColorValues(value, terms);
	    },

	    combine: function (values) {
	        return functionCreate(createDelimited(values, terms, ', ', 2), 'rgba');
	    }
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var rgb = __webpack_require__(63);

	module.exports = {

	    defaultProps: rgb.defaultProps,

	    test: function (value) {
	        return value && value.indexOf('#') > -1;
	    },

	    split: function (value) {
	        var r, g, b;

	        // If we have 6 characters, ie #FF0000
	        if (value.length > 4) {
	            r = value.substr(1, 2);
	            g = value.substr(3, 2);
	            b = value.substr(5, 2);

	            // Or we have 3 characters, ie #F00
	        } else {
	                r = value.substr(1, 1);
	                g = value.substr(2, 1);
	                b = value.substr(3, 1);
	                r += r;
	                g += g;
	                b += b;
	            }

	        return {
	            Red: parseInt(r, 16),
	            Green: parseInt(g, 16),
	            Blue: parseInt(b, 16),
	            Alpha: 1
	        };
	    },

	    combine: function (values) {
	        return rgb.combine(values);
	    }
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8),
	    rgb = __webpack_require__(63),
	    hsl = __webpack_require__(56),
	    hex = __webpack_require__(64),
	    supported = [rgb, hsl, hex],
	    numSupported = 3,
	    runSupported = function (method, value) {
	    for (var i = 0; i < numSupported; i++) {
	        if (supported[i].test(value)) {
	            return supported[i][method](value);
	        }
	    }
	};

	module.exports = {
	    defaultProps: utils.merge(rgb.defaultProps, hsl.defaultProps),

	    test: function (value) {
	        return rgb.test(value) || hex.test(value) || hsl.test(value);
	    },

	    split: function (value) {
	        return runSupported('split', value);
	    },

	    combine: function (values) {
	        return values.Red !== undefined ? rgb.combine(values) : hsl.combine(values);
	    }
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(57),
	    pxDefaults = __webpack_require__(55).defaultProps,
	    splitSpaceDelimited = __webpack_require__(67),
	    terms = __webpack_require__(29).positions;

	module.exports = {

	    defaultProps: pxDefaults,

	    /*
	        Split positions in format "X Y Z"
	        
	        @param [string]: Position values
	            "20% 30% 0" -> {20%, 30%, 0}
	            "20% 30%" -> {20%, 30%}
	            "20%" -> {20%, 20%}
	    */
	    split: function (value) {
	        var positions = splitSpaceDelimited(value),
	            numPositions = positions.length,
	            splitValue = {
	            X: positions[0],
	            Y: numPositions > 1 ? positions[1] : positions[0]
	        };

	        if (numPositions > 2) {
	            splitValue.Z = positions[2];
	        }

	        return splitValue;
	    },

	    combine: function (values) {
	        return createDelimited(values, terms, ' ');
	    }
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isString = __webpack_require__(8).isString;

	module.exports = function (value) {
	  return isString(value) ? value.split(' ') : [value];
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var terms = __webpack_require__(29).dimensions,
	    pxDefaults = __webpack_require__(55).defaultProps,
	    createDelimited = __webpack_require__(57),
	    splitSpaceDelimited = __webpack_require__(67);

	module.exports = {

	    defaultProps: pxDefaults,

	    /*
	        Split dimensions in format "Top Right Bottom Left"
	        
	        @param [string]: Dimension values
	            "20px 0 30px 40px" -> {20px, 0, 30px, 40px}
	            "20px 0 30px" -> {20px, 0, 30px, 0}
	            "20px 0" -> {20px, 0, 20px, 0}
	            "20px" -> {20px, 20px, 20px, 20px}
	        
	        @return [object]: Object with T/R/B/L metrics
	    */
	    split: function (value) {
	        var dimensions = splitSpaceDelimited(value),
	            numDimensions = dimensions.length,
	            jumpBack = numDimensions !== 1 ? 2 : 1,
	            i = 0,
	            j = 0,
	            splitValue = {};

	        for (; i < 4; i++) {
	            splitValue[terms[i]] = dimensions[j];

	            // Jump back (to start) counter if we've reached the end of our values
	            j++;
	            j = j === numDimensions ? j - jumpBack : j;
	        }

	        return splitValue;
	    },

	    combine: function (values) {
	        return createDelimited(values, terms, ' ');
	    }
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    defaultProps: {
	        init: 1
	    }
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var color = __webpack_require__(65),
	    utils = __webpack_require__(8),
	    pxDefaults = __webpack_require__(55).defaultProps,
	    terms = __webpack_require__(29).shadow,
	    splitSpaceDelimited = __webpack_require__(67),
	    createDelimited = __webpack_require__(57),
	    shadowTerms = terms.slice(0, 4);

	module.exports = {

	    defaultProps: utils.merge(color.defaultProps, {
	        X: pxDefaults,
	        Y: pxDefaults,
	        Radius: pxDefaults,
	        Spread: pxDefaults
	    }),

	    /*
	        Split shadow properties "X Y Radius Spread Color"
	        
	        @param [string]: Shadow property
	        @return [object]
	    */
	    split: function (value) {
	        var bits = splitSpaceDelimited(value),
	            numBits = bits.length,
	            hasReachedColor = false,
	            colorProp = '',
	            thisBit,
	            i = 0,
	            splitValue = {};

	        for (; i < numBits; i++) {
	            thisBit = bits[i];

	            // If we've reached the color property, append to color string
	            if (hasReachedColor || color.test(thisBit)) {
	                hasReachedColor = true;
	                colorProp += thisBit;
	            } else {
	                splitValue[terms[i]] = thisBit;
	            }
	        }

	        return utils.merge(splitValue, color.split(colorProp));
	    },

	    combine: function (values) {
	        return createDelimited(values, shadowTerms, ' ') + color.combine(values);
	    }
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8),
	    each = utils.each,
	    floatRegex = /(-)?(\d[\d\.]*)/g,
	    generateToken = function (key) {
	    return '${' + key + '}';
	};

	module.exports = {
	    test: function (value) {
	        var matches = value.match(floatRegex);
	        return utils.isArray(matches) && matches.length > 1;
	    },

	    template: function (value) {
	        var counter = 0;
	        return value.replace(floatRegex, function () {
	            return generateToken(counter++);
	        });
	    },

	    split: function (value) {
	        var splitValue = {},
	            matches = value.match(floatRegex),
	            numMatches = matches.length;

	        for (var i = 0; i < numMatches; i++) {
	            splitValue[i] = matches[i];
	        }

	        return splitValue;
	    },

	    combine: function (values, template) {
	        var combinedValue = template;

	        each(values, function (key, value) {
	            combinedValue = combinedValue.replace(generateToken(key), value);
	        });

	        return combinedValue;
	    }
	};

/***/ }
/******/ ]);