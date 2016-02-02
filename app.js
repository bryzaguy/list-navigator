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

	var ui = __webpack_require__(1);
	var DATA_PROP = 'data-depth';
	var velocityRange = [-1000, 1000];
	var maxRotate = 30;
	var smoothing = 100;
	var source;
	var div = function (i) {
	    var e = document.createElement('div');
	    e.className = i.depth === 0 ? 'card source' : 'card';
	    e.setAttribute(DATA_PROP, i.depth);
	    if (i.depth === 0) {
	        source = e;
	    }
	    return e;
	},
	    relations = [{ depth: -1 }, { depth: 0 }, { depth: 1 }, { depth: 2 }];

	var elements = relations.map(div),
	    fragment = document.createDocumentFragment();

	elements.forEach(fragment.appendChild, fragment);
	document.getElementById('cards').appendChild(fragment);

	var resizeAdjust = new ui.Simulate({
	    simulate: 'spring',
	    duration: 100,
	    spring: 1000,
	    friction: 0.35,
	    values: {
	        x: {
	            to: function (e) {
	                var depth = parseInt(e.element.getAttribute(DATA_PROP));
	                var width = parseInt(ui.css.get(e.element, 'width'));
	                return depth * width;
	            }
	        }
	    }
	});

	var flyup = new ui.Tween({
	    ease: 'easeInOut',
	    duration: 500,
	    values: {
	        opacity: 1,
	        x: {
	            to: function (e) {
	                var depth = parseInt(e.element.getAttribute(DATA_PROP));
	                var width = parseInt(ui.css.get(e.element, 'width'));
	                return depth * width;
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
	    var width = parseInt(ui.css.get(e, 'width'));
	    var values = {
	        x: depth * width,
	        y: 100,
	        opacity: 0,
	        zIndex: function (e) {
	            return depth == 1 || depth == 0 ? 2 : 0;
	        },
	        boxShadow: '0 5px 5px rgba(0,0,0,.15)'
	    };

	    var actor = new ui.Actor({
	        element: e,
	        values: values
	    });

	    return actor;
	});

	var iterator = new ui.Iterator(actors);
	iterator.stagger('start', 150, flyup);

	var timer;
	window.addEventListener('resize', function () {
	    clearTimeout(timer);

	    timer = setTimeout(function () {
	        iterator.each('start', resizeAdjust);
	    }, 100);
	});

	document.getElementById('downstream').onclick = function (e) {
	    e.stopPropagation();
	    e.preventDefault();

	    elements.forEach(function (i) {
	        var depth = parseInt(i.getAttribute(DATA_PROP));
	        //if source do nothing, if below source subtract 2;
	        i.setAttribute(DATA_PROP, depth - 1);
	        //endif
	        ui.css.set(i, 'z-index', depth == 1 ? 2 : depth == 0 || depth == 2 ? 1 : 0);
	    });

	    iterator.each('start', flyup);
	};

	document.getElementById('upstream').onclick = function (e) {
	    e.stopPropagation();
	    e.preventDefault();

	    elements.forEach(function (i) {
	        var depth = parseInt(i.getAttribute(DATA_PROP));
	        i.setAttribute(DATA_PROP, depth + 1);
	        ui.css.set(i, 'z-index', depth == 0 ? 2 : depth == 1 || depth == -1 ? 1 : 0);
	    });

	    iterator.each('start', flyup);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var popmotion = __webpack_require__(2);

	/*
	    Add optional custom value type support
	*/
	popmotion.addValueType({
	    alpha: __webpack_require__(49),
	    angle: __webpack_require__(50),
	    px: __webpack_require__(51),
	    hsl: __webpack_require__(52),
	    rgb: __webpack_require__(59),
	    hex: __webpack_require__(60),
	    color: __webpack_require__(61),
	    positions: __webpack_require__(62),
	    dimensions: __webpack_require__(64),
	    scale: __webpack_require__(65),
	    shadow: __webpack_require__(66),
	    complex: __webpack_require__(67)
	});

	/*
	    Predefined roles
	*/
	popmotion.attr = __webpack_require__(29);
	popmotion.css = __webpack_require__(22);
	popmotion.svg = __webpack_require__(28);
	popmotion.drawPath = __webpack_require__(32);

	module.exports = popmotion;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2FkL21vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7Ozs7O0FBS0osVUFBVSxZQUFWLENBQXVCO0FBQ25CLFdBQU8sUUFBUSxzQkFBUixDQUFQO0FBQ0EsV0FBTyxRQUFRLHNCQUFSLENBQVA7QUFDQSxRQUFJLFFBQVEsbUJBQVIsQ0FBSjtBQUNBLFNBQUssUUFBUSxvQkFBUixDQUFMO0FBQ0EsU0FBSyxRQUFRLG9CQUFSLENBQUw7QUFDQSxTQUFLLFFBQVEsb0JBQVIsQ0FBTDtBQUNBLFdBQU8sUUFBUSxzQkFBUixDQUFQO0FBQ0EsZUFBVyxRQUFRLDBCQUFSLENBQVg7QUFDQSxnQkFBWSxRQUFRLDJCQUFSLENBQVo7QUFDQSxXQUFPLFFBQVEsc0JBQVIsQ0FBUDtBQUNBLFlBQVEsUUFBUSx1QkFBUixDQUFSO0FBQ0EsYUFBUyxRQUFRLHdCQUFSLENBQVQ7Q0FaSjs7Ozs7QUFrQkEsVUFBVSxJQUFWLEdBQWlCLFFBQVEsd0JBQVIsQ0FBakI7QUFDQSxVQUFVLEdBQVYsR0FBZ0IsUUFBUSxzQkFBUixDQUFoQjtBQUNBLFVBQVUsR0FBVixHQUFnQixRQUFRLHNCQUFSLENBQWhCO0FBQ0EsVUFBVSxRQUFWLEdBQXFCLFFBQVEsNEJBQVIsQ0FBckI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Im1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcG9wbW90aW9uID0gcmVxdWlyZSgnLi4vcG9wbW90aW9uJyk7XG5cbi8qXG4gICAgQWRkIG9wdGlvbmFsIGN1c3RvbSB2YWx1ZSB0eXBlIHN1cHBvcnRcbiovXG5wb3Btb3Rpb24uYWRkVmFsdWVUeXBlKHtcbiAgICBhbHBoYTogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvYWxwaGEnKSxcbiAgICBhbmdsZTogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvYW5nbGUnKSxcbiAgICBweDogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvcHgnKSxcbiAgICBoc2w6IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL2hzbCcpLFxuICAgIHJnYjogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvcmdiJyksXG4gICAgaGV4OiByZXF1aXJlKCcuLi92YWx1ZS10eXBlcy9oZXgnKSxcbiAgICBjb2xvcjogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvY29sb3InKSxcbiAgICBwb3NpdGlvbnM6IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL3Bvc2l0aW9ucycpLFxuICAgIGRpbWVuc2lvbnM6IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL2RpbWVuc2lvbnMnKSxcbiAgICBzY2FsZTogcmVxdWlyZSgnLi4vdmFsdWUtdHlwZXMvc2NhbGUnKSxcbiAgICBzaGFkb3c6IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL3NoYWRvdycpLFxuICAgIGNvbXBsZXg6IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL2NvbXBsZXgnKVxufSk7XG5cbi8qXG4gICAgUHJlZGVmaW5lZCByb2xlc1xuKi9cbnBvcG1vdGlvbi5hdHRyID0gcmVxdWlyZSgnLi4vcm9sZXMvYXR0ci9hdHRyUm9sZScpO1xucG9wbW90aW9uLmNzcyA9IHJlcXVpcmUoJy4uL3JvbGVzL2Nzcy9jc3NSb2xlJyk7XG5wb3Btb3Rpb24uc3ZnID0gcmVxdWlyZSgnLi4vcm9sZXMvc3ZnL3N2Z1JvbGUnKTtcbnBvcG1vdGlvbi5kcmF3UGF0aCA9IHJlcXVpcmUoJy4uL3JvbGVzL3BhdGgvZHJhd1BhdGhSb2xlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9wbW90aW9uOyJdfQ==

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypes = __webpack_require__(3),
	    Popmotion = {

	    Actor: __webpack_require__(5),

	    Sequence: __webpack_require__(34),

	    Input: __webpack_require__(40),

	    Iterator: __webpack_require__(42),

	    Process: __webpack_require__(6),

	    Easing: __webpack_require__(37),

	    Role: __webpack_require__(21),

	    Action: __webpack_require__(15),
	    Tween: __webpack_require__(35),
	    Simulate: __webpack_require__(43),
	    Track: __webpack_require__(45),

	    /*
	        Create an Iterator of Actors with selected dom elements
	    */
	    select: __webpack_require__(47),

	    ease: __webpack_require__(36),

	    /*
	        Modify properties of inbuilt easing function
	    */
	    modifyEase: __webpack_require__(48),

	    addValueType: function (types) {
	        valueTypes.extend(types);
	        return Popmotion;
	    },

	    calc: __webpack_require__(13),
	    utils: __webpack_require__(4)
	};

	module.exports = Popmotion;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var each = __webpack_require__(4).each;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxPQUFPLFFBQVEsY0FBUixFQUF3QixJQUF4Qjs7QUFFYixPQUFPLE9BQVAsR0FBaUI7QUFDYixZQUFRLFVBQVUsS0FBVixFQUFpQjs7O0FBQ3JCLGFBQUssS0FBTCxFQUFZLFVBQUMsSUFBRCxFQUFPLElBQVAsRUFBZ0I7QUFDeEIsa0JBQUssSUFBTCxJQUFhLElBQWIsQ0FEd0I7U0FBaEIsQ0FBWixDQURxQjtLQUFqQjs7QUFNUixrQkFBYyxVQUFVLFFBQVYsRUFBb0IsR0FBcEIsRUFBeUI7QUFDbkMsWUFBSSxZQUFZLEtBQUssUUFBTCxDQUFaO1lBQ0EsZUFBZSxTQUFDLENBQVUsWUFBVixHQUEwQixVQUFVLFlBQVYsQ0FBdUIsR0FBdkIsS0FBK0IsVUFBVSxZQUFWLEdBQXlCLEVBQW5GLENBRmdCOztBQUluQyxlQUFPLFlBQVAsQ0FKbUM7S0FBekI7O0FBT2QsVUFBTSxVQUFVLEtBQVYsRUFBaUI7QUFDbkIsWUFBSSxPQUFPLEtBQVAsQ0FEZTs7QUFHbkIsYUFBSyxJQUFMLEVBQVcsVUFBQyxHQUFELEVBQU0sU0FBTixFQUFvQjtBQUMzQixnQkFBSSxVQUFVLElBQVYsSUFBa0IsVUFBVSxJQUFWLENBQWUsS0FBZixDQUFsQixFQUF5QztBQUN6Qyx1QkFBTyxHQUFQLENBRHlDO0FBRXpDLHVCQUFPLEtBQVAsQ0FGeUM7YUFBN0M7U0FETyxDQUFYLENBSG1COztBQVVuQixlQUFPLElBQVAsQ0FWbUI7S0FBakI7Q0FkViIsImZpbGUiOiJtYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZWFjaCA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLmVhY2g7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGV4dGVuZDogZnVuY3Rpb24gKHR5cGVzKSB7XG4gICAgICAgIGVhY2godHlwZXMsIChuYW1lLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdHlwZTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRlZmF1bHRQcm9wczogZnVuY3Rpb24gKHR5cGVOYW1lLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlVHlwZSA9IHRoaXNbdHlwZU5hbWVdLFxuICAgICAgICAgICAgZGVmYXVsdFByb3BzID0gKHZhbHVlVHlwZS5kZWZhdWx0UHJvcHMpID8gdmFsdWVUeXBlLmRlZmF1bHRQcm9wc1trZXldIHx8IHZhbHVlVHlwZS5kZWZhdWx0UHJvcHMgOiB7fTtcblxuICAgICAgICByZXR1cm4gZGVmYXVsdFByb3BzO1xuICAgIH0sXG5cbiAgICB0ZXN0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBmYWxzZTtcblxuICAgICAgICBlYWNoKHRoaXMsIChrZXksIHZhbHVlVHlwZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlVHlwZS50ZXN0ICYmIHZhbHVlVHlwZS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSBrZXk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG59O1xuIl19

/***/ },
/* 4 */
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
	//# sourceMappingURL=data:application/json;base64,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QUFOLENBQVksS0FBSyxHQUFMLENBQVosRUFBdUIsS0FBdkIsQ0FBNUMsR0FBNEUsS0FBNUUsQ0FENkI7S0FBakM7Ozs7Ozs7Ozs7QUFZakIsa0JBQWMsVUFBQyxLQUFELEVBQVc7QUFDckIsWUFBSSxXQUFXLE1BQU0sS0FBTixDQUFZLG1CQUFaLENBQVgsQ0FEaUI7O0FBR3JCLGVBQU87QUFDSCxtQkFBTyxTQUFTLENBQVQsQ0FBUDtBQUNBLGtCQUFPLFNBQVMsQ0FBVCxDQUFQO1NBRkosQ0FIcUI7S0FBWDs7Ozs7Ozs7O0FBZ0JkLGtCQUFjLFVBQUMsUUFBRCxFQUFXLEtBQVgsRUFBcUI7QUFDL0IsWUFBSSxVQUFVLEtBQUssUUFBUSxDQUFSLENBQUw7WUFDVixTQUFTLElBQUssSUFBSSxLQUFKO1lBQ2QsbUJBQW1CLEtBQUssR0FBTCxDQUFTLFdBQVcsTUFBWCxFQUFtQixDQUE1QixDQUFuQixDQUgyQjs7QUFLL0IsZUFBTyxLQUFLLEtBQUwsQ0FBVyxtQkFBbUIsT0FBbkIsQ0FBWCxHQUF5QyxPQUF6QyxDQUx3QjtLQUFyQjs7Ozs7OztBQWFkLGlCQUFhO2VBQU0sT0FBUSxXQUFQLEtBQXVCLFdBQXZCLElBQXNDLFlBQVksR0FBWixHQUFtQixZQUFZLEdBQVosRUFBMUQsR0FBOEUsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUE5RTtLQUFOO0NBL05YOztBQWtPTixPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwcm90ZWN0ZWRQcm9wZXJ0aWVzID0gWydzY29wZScsICAnZG9tJ107XG5jb25zdCBDQU1FTF9DQVNFX1BBVFRFUk4gPSAvKFthLXpdKShbQS1aXSkvZztcbmNvbnN0IFJFUExBQ0VfVEVNUExBVEUgPSAnJDEtJDInO1xuICAgIFxuY29uc3QgaXNQcm90ZWN0ZWQgPSBrZXkgPT4gKHByb3RlY3RlZFByb3BlcnRpZXMuaW5kZXhPZihrZXkpICE9PSAtMSk7XG5cbi8qXG4gICAgR2V0IHZhciB0eXBlIGFzIHN0cmluZ1xuICAgIFxuICAgIEBwYXJhbTogVmFyaWFibGUgdG8gdGVzdFxuICAgIEByZXR1cm4gW3N0cmluZ106IFJldHVybnMsIGZvciBpbnN0YW5jZSAnT2JqZWN0JyBpZiBbb2JqZWN0IE9iamVjdF1cbiovXG5jb25zdCB2YXJUeXBlID0gdmFyaWFibGUgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSk7XG5cbmNvbnN0IHV0aWxzID0ge1xuICAgIC8qXG4gICAgICAgIENvbnZlcnQgY2FtZWxDYXNlIHRvIGRhc2gtY2FzZVxuXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXVxuICAgICAgICBAcmV0dXJuIFtzdHJpbmddXG4gICAgKi9cbiAgICBjYW1lbFRvRGFzaDogKHN0cmluZykgPT4gc3RyaW5nLnJlcGxhY2UoQ0FNRUxfQ0FTRV9QQVRURVJOLCBSRVBMQUNFX1RFTVBMQVRFKS50b0xvd2VyQ2FzZSgpLFxuXG4gICAgLypcbiAgICAgICAgSXRlcmF0ZSBvdmVyIGFuIG9iamVjdCBhbmQgZmlyZSBhIGNhbGxiYWNrIGZvciBldmVyeSBpdGVtIGluIGl0XG5cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBQcm9wZXJ0aWVzXG4gICAgICAgIEBwYXJhbSBbZnVuY3Rpb25dOiBDYWxsYmFjayB0byBmaXJlXG4gICAgKi9cbiAgICBlYWNoOiAocHJvcHMsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHZhciBrZXlzID0gcHJvcHMgPyBPYmplY3Qua2V5cyhwcm9wcykgOiBbXSxcbiAgICAgICAgICAgIG51bUtleXMgPSBrZXlzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUtleXM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbaV0sXG4gICAgICAgICAgICAgICAgcHJvcCA9IHByb3BzW2tleV07XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhrZXksIHByb3ApID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIENoZWNrIGlmIG9iamVjdCBoYXMgcHJvcGVydHkgYW5kIGl0IGlzbid0IHVuZGVmaW5lZFxuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICAgICBAcGFyYW0gW3N0cmluZ11cbiAgICAgICAgQHJldHVybiBbYm9vbGVhbl1cbiAgICAqL1xuICAgIGhhczogKG9iamVjdCwgcHJvcGVydHlOYW1lKSA9PiBvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiBvYmplY3RbcHJvcGVydHlOYW1lXSAhPT0gdW5kZWZpbmVkLFxuICAgIFxuICAgIC8qXG4gICAgICAgIEhhcyBvbmUgb2JqZWN0IGNoYW5nZWQgZnJvbSB0aGUgb3RoZXJcbiAgICAgICAgXG4gICAgICAgIENvbXBhcmVzIHRoZSB0d28gcHJvdmlkZWQgaW5wdXRzIGFuZCByZXR1cm5zIHRydWUgaWYgdGhleSBhcmUgZGlmZmVyZW50XG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW29iamVjdF06IElucHV0IEFcbiAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBJbnB1dCBCXG4gICAgICAgIEByZXR1cm4gW2Jvb2xlYW5dOiBUcnVlIGlmIGRpZmZlcmVudFxuICAgICovXG4gICAgaGFzQ2hhbmdlZDogKGEsIGIpID0+IHtcbiAgICAgICAgdmFyIGhhc0NoYW5nZWQgPSBmYWxzZSxcbiAgICAgICAgICAgIGtleSA9ICcnO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KGtleSkgJiYgYi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFba2V5XSAhPT0gYltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIGhhc0NoYW5nZWQ7XG4gICAgfSxcbiAgICBcbiAgICAvKlxuICAgICAgICBJcyB1dGlscyB2YXIgYSBmdW5jdGlvbiA/IFxuICAgICAgICBcbiAgICAgICAgQHBhcmFtOiBWYXJpYWJsZSB0byB0ZXN0XG4gICAgICAgIEByZXR1cm4gW2Jvb2xlYW5dOiBSZXR1cm5zIHRydWUgaWYgdXRpbHMudmFyVHlwZSA9PT0gJ0Z1bmN0aW9uJ1xuICAgICovXG4gICAgaXNGdW5jOiBvYmogPT4gdmFyVHlwZShvYmopID09PSAnRnVuY3Rpb24nLFxuICAgIFxuICAgIC8qXG4gICAgICAgIElzIHV0aWxzIHZhciBhIG51bWJlcj9cbiAgICAgICAgXG4gICAgICAgIEBwYXJhbTogVmFyaWFibGUgdG8gdGVzdFxuICAgICAgICBAcmV0dXJuIFtib29sZWFuXTogUmV0dXJucyB0cnVlIGlmIHR5cGVvZiA9PT0gJ251bWJlcidcbiAgICAqL1xuICAgIGlzTnVtOiBudW0gPT4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicsXG4gICAgXG4gICAgLypcbiAgICAgICAgSXMgdXRpbHMgdmFyIGFuIG9iamVjdD9cbiAgICAgICAgXG4gICAgICAgIEBwYXJhbTogVmFyaWFibGUgdG8gdGVzdFxuICAgICAgICBAcmV0dXJuIFtib29sZWFuXTogUmV0dXJucyB0cnVlIGlmIHR5cGVvZiA9PT0gJ29iamVjdCdcbiAgICAqL1xuICAgIGlzT2JqOiBvYmogPT4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcsXG4gICAgXG4gICAgLypcbiAgICAgICAgSXMgdXRpbHMgdmFyIGEgc3RyaW5nID8gXG4gICAgICAgIFxuICAgICAgICBAcGFyYW06IFZhcmlhYmxlIHRvIHRlc3RcbiAgICAgICAgQHJldHVybiBbYm9vbGVhbl06IFJldHVybnMgdHJ1ZSBpZiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJ1xuICAgICovXG4gICAgaXNTdHJpbmc6IHN0ciA9PiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyxcblxuICAgIC8qXG4gICAgICAgIElzIHV0aWxzIGEgcmVsYXRpdmUgdmFsdWUgYXNzaWdubWVudD9cbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXTogVmFyaWFibGUgdG8gdGVzdFxuICAgICAgICBAcmV0dXJuIFtib29sZWFuXTogSWYgdXRpbHMgbG9va3MgbGlrZSBhIHJlbGF0aXZlIHZhbHVlIGFzc2lnbm1lbnRcbiAgICAqL1xuICAgIGlzUmVsYXRpdmVWYWx1ZTogdmFsdWUgPT4gKHZhbHVlICYmIHZhbHVlLmluZGV4T2YgJiYgdmFsdWUuaW5kZXhPZignPScpID4gMCkgPyB0cnVlIDogZmFsc2UsXG4gICAgXG4gICAgLypcbiAgICAgICAgSXMgdXRpbHMgdmFyIGFuIGFycmF5ID8gXG4gICAgICAgIFxuICAgICAgICBAcGFyYW06IFZhcmlhYmxlIHRvIHRlc3RcbiAgICAgICAgQHJldHVybiBbYm9vbGVhbl06IFJldHVybnMgdHJ1ZSBpZiB1dGlscy52YXJUeXBlID09PSAnQXJyYXknXG4gICAgKi9cbiAgICBpc0FycmF5OiBhcnIgPT4gdmFyVHlwZShhcnIpID09PSAnQXJyYXknLFxuICAgIFxuICAgIC8qXG4gICAgICAgIENvcHkgb2JqZWN0IG9yIGFycmF5XG4gICAgICAgIFxuICAgICAgICBDaGVja3Mgd2hldGhlciBiYXNlIGlzIGFuIGFycmF5IG9yIG9iamVjdCBhbmQgbWFrZXNcbiAgICAgICAgYXBwcm9wcmlhdGUgY29weVxuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFthcnJheSB8fCBvYmplY3RdOiBBcnJheSBvciBvYmplY3QgdG8gY29weVxuICAgICAgICBAcGFyYW0gW2FycmF5IHx8IG9iamVjdF06IE5ldyBjb3B5IG9mIGFycmF5IG9yIG9iamVjdFxuICAgICovXG4gICAgY29weTogYmFzZSA9PiB1dGlscy5pc0FycmF5KGJhc2UpID8gdXRpbHMuY29weUFycmF5KGJhc2UpIDogdXRpbHMuY29weU9iamVjdChiYXNlKSxcblxuICAgIC8qXG4gICAgICAgIERlZXAgY29weSBhbiBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIEl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGFuZCBjcmVhdGVzIGEgbmV3IGNvcHkgb2YgZXZlcnkgaXRlbSxcbiAgICAgICAgZGVlcCBjb3B5aW5nIGlmIGl0IGZpbmRzIGFueSBvYmplY3RzL2FycmF5c1xuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBPYmplY3QgdG8gY29weVxuICAgICAgICBAcGFyYW0gW29iamVjdF06IE5ldyBjb3B5IG9mIG9iamVjdFxuICAgICovXG5cbiAgICBjb3B5T2JqZWN0OiBiYXNlID0+IHtcbiAgICAgICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgICAgICBcbiAgICAgICAgdXRpbHMuZWFjaChiYXNlLCB1dGlscy5jb3B5RWFjaE9iamVjdC5iaW5kKG51bGwsIG5ld09iamVjdCkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9LFxuICAgICAgICBcbiAgICBjb3B5RWFjaE9iamVjdDogKG5ld09iamVjdCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBuZXdPYmplY3Rba2V5XSA9ICh1dGlscy5pc09iaih2YWx1ZSkgJiYgIWlzUHJvdGVjdGVkKGtleSkpID8gdXRpbHMuY29weSh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB9LFxuICAgIC8qXG4gICAgICAgIERlZXAgY29weSBhbiBhcnJheVxuICAgICAgICBcbiAgICAgICAgTG9vcHMgdGhyb3VnaCBhbiBhcnJheSBhbmQgY3JlYXRlcyBhIG5ldyBjb3B5IG9mIGV2ZXJ5IGl0ZW0sXG4gICAgICAgIGRlZXAgY29weWluZyBpZiBpdCBmaW5kcyBhbnkgb2JqZWN0cy9hcnJheXNcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbYXJyYXldOiBBcnJheSB0byBjb3B5XG4gICAgICAgIEByZXR1cm4gW2FycmF5XTogTmV3IGNvcHkgb2YgYXJyYXlcbiAgICAqL1xuICAgIGNvcHlBcnJheTogYmFzZSA9PiBiYXNlLFxuICAgIFxuICAgIC8qXG4gICAgICAgIE5vbi1kZXN0cnVjdGl2ZSBtZXJnZSBvZiBvYmplY3Qgb3IgYXJyYXlcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbYXJyYXkgfHwgb2JqZWN0XTogQXJyYXkgb3Igb2JqZWN0IHRvIHVzZSBhcyBiYXNlXG4gICAgICAgIEBwYXJhbSBbYXJyYXkgfHwgb2JqZWN0XTogQXJyYXkgb3Igb2JqZWN0IHRvIG92ZXJ3cml0ZSBiYXNlIHdpdGhcbiAgICAgICAgQHJldHVybiBbYXJyYXkgfHwgb2JqZWN0XTogTmV3IGFycmF5IG9yIG9iamVjdFxuICAgICovXG4gICAgbWVyZ2U6IChiYXNlLCBvdmVyd3JpdGUpID0+ICh1dGlscy5pc0FycmF5KGJhc2UpKSA/IHV0aWxzLmNvcHlBcnJheShvdmVyd3JpdGUpIDogdXRpbHMubWVyZ2VPYmplY3QoYmFzZSwgb3ZlcndyaXRlKSxcbiAgICBcbiAgICAvKlxuICAgICAgICBOb24tZGVzdHJ1Y3RpdmUgbWVyZ2Ugb2Ygb2JqZWN0XG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW29iamVjdF06IE9iamVjdCB0byB1c2UgYXMgYmFzZVxuICAgICAgICBAcGFyYW0gW29iamVjdF06IE9iamVjdCB0byBvdmVyd3JpdGUgYmFzZSB3aXRoXG4gICAgICAgIEByZXR1cm4gW29iamVjdF06IE5ldyBvYmplY3RcbiAgICAqL1xuICAgIG1lcmdlT2JqZWN0OiAoYmFzZSwgb3ZlcndyaXRlKSA9PiB7XG4gICAgICAgIHZhciBoYXNCYXNlID0gdXRpbHMuaXNPYmooYmFzZSksXG4gICAgICAgICAgICBuZXdPYmplY3QgPSBoYXNCYXNlID8gdXRpbHMuY29weShiYXNlKSA6IHV0aWxzLmNvcHkob3ZlcndyaXRlKTtcblxuICAgICAgICBpZiAoaGFzQmFzZSkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaChvdmVyd3JpdGUsIHV0aWxzLm1lcmdlRWFjaE9iamVjdC5iaW5kKG51bGwsIG5ld09iamVjdCwgYmFzZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICB9LFxuXG4gICAgbWVyZ2VFYWNoT2JqZWN0OiAobmV3T2JqZWN0LCBiYXNlLCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIG5ld09iamVjdFtrZXldID0gKHV0aWxzLmlzT2JqKHZhbHVlKSAmJiAhaXNQcm90ZWN0ZWQoa2V5KSkgPyB1dGlscy5tZXJnZShiYXNlW2tleV0sIHZhbHVlKSA6IHZhbHVlO1xuICAgIH0sXG4gICAgXG4gICAgLypcbiAgICAgICAgU3BsaXQgYSB2YWx1ZSBpbnRvIGEgdmFsdWUvdW5pdCBvYmplY3RcbiAgICAgICAgXG4gICAgICAgICAgICBcIjIwMHB4XCIgLT4geyB2YWx1ZTogMjAwLCB1bml0OiBcInB4XCIgfVxuICAgICAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXTogVmFsdWUgdG8gc3BsaXRcbiAgICAgICAgQHJldHVybiBbb2JqZWN0XTogT2JqZWN0IHdpdGggdmFsdWUgYW5kIHVuaXQgcHJvcHNcbiAgICAqL1xuICAgIHNwbGl0VmFsVW5pdDogKHZhbHVlKSA9PiB7XG4gICAgICAgIGxldCBzcGxpdFZhbCA9IHZhbHVlLm1hdGNoKC8oLT9cXGQqXFwuP1xcZCopKC4qKS8pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogc3BsaXRWYWxbMV0sXG4gICAgICAgICAgICB1bml0OiAgc3BsaXRWYWxbMl1cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgQ3JlYXRlIHN0ZXBwZWQgdmVyc2lvbiBvZiAwLTEgcHJvZ3Jlc3NcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogQ3VycmVudCB2YWx1ZVxuICAgICAgICBAcGFyYW0gW2ludF06IE51bWJlciBvZiBzdGVwc1xuICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBTdGVwcGVkIHZhbHVlXG4gICAgKi9cbiAgICBzdGVwUHJvZ3Jlc3M6IChwcm9ncmVzcywgc3RlcHMpID0+IHtcbiAgICAgICAgdmFyIHNlZ21lbnQgPSAxIC8gKHN0ZXBzIC0gMSksXG4gICAgICAgICAgICB0YXJnZXQgPSAxIC0gKDEgLyBzdGVwcyksXG4gICAgICAgICAgICBwcm9ncmVzc09mVGFyZ2V0ID0gTWF0aC5taW4ocHJvZ3Jlc3MgLyB0YXJnZXQsIDEpO1xuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHByb2dyZXNzT2ZUYXJnZXQgLyBzZWdtZW50KSAqIHNlZ21lbnQ7XG4gICAgfSxcbiAgICBcbiAgICAvKlxuICAgICAgICBHZW5lcmF0ZSBjdXJyZW50IHRpbWVzdGFtcFxuICAgICAgICBcbiAgICAgICAgQHJldHVybiBbdGltZXN0YW1wXTogQ3VycmVudCBVTklYIHRpbWVzdGFtcFxuICAgICovXG4gICAgY3VycmVudFRpbWU6ICgpID0+ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHBlcmZvcm1hbmNlLm5vdykgPyBwZXJmb3JtYW5jZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyJdfQ==

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Process = __webpack_require__(6),
	    Queue = __webpack_require__(10),
	    utils = __webpack_require__(4),
	    select = __webpack_require__(11),
	    valueOps = __webpack_require__(12),

	/*
	    Process methods
	*/
	update = __webpack_require__(14),
	    render = __webpack_require__(18),
	    postRender = __webpack_require__(19),

	/*
	    Role imports
	*/
	defaultRole = __webpack_require__(20),
	    cssRole = __webpack_require__(22),
	    svgRole = __webpack_require__(28),
	    drawPathRole = __webpack_require__(32),
	    Action = __webpack_require__(15),
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
	//# sourceMappingURL=data:application/json;base64,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SSxRQUFRLENBQUUsV0FBRCxHQUFnQixLQUFLLFlBQUwsR0FBb0IsS0FBSyxhQUFMO1lBQzdDLFdBQVcsTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFYOzs7QUFGa0MsWUFLbEMsYUFBYSxDQUFDLENBQUQsSUFBTSxVQUFuQixFQUErQjtBQUMvQixrQkFBTSxJQUFOLENBQVcsR0FBWDs7O0FBRCtCLGdCQUkzQixXQUFXLENBQUMsQ0FBRCxFQUFJO0FBQ2Ysc0JBQU0sTUFBTixDQUFhLFFBQWIsRUFBdUIsQ0FBdkIsRUFEZTthQUFuQjtTQUpKOzs7OztpQkF2VkY7O3lCQWtXYTtBQUNYLG1CQUFPLEtBQUssU0FBTCxDQURJOzs7Ozt1QkFLRixRQUFRO0FBQ2pCLGdCQUFJLFdBQVcsSUFBWCxFQUFpQjtBQUNqQixxQkFBSyxVQUFMLEdBQWtCLE1BQWxCLENBRGlCO2FBQXJCOztBQUlBLGlCQUFLLFNBQUwsR0FBaUIsTUFBakIsQ0FMaUI7Ozs7V0F2V25COzs7QUFnWE4sT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6IkFjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFByb2Nlc3MgPSByZXF1aXJlKCcuLi9wcm9jZXNzL1Byb2Nlc3MnKSxcbiAgICBRdWV1ZSA9IHJlcXVpcmUoJy4uL2luYy9RdWV1ZScpLFxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyksXG4gICAgc2VsZWN0ID0gcmVxdWlyZSgnLi4vaW5jL3NlbGVjdC1kb20nKSxcbiAgICB2YWx1ZU9wcyA9IHJlcXVpcmUoJy4vdmFsdWUtb3BlcmF0aW9ucycpLFxuXG4gICAgLypcbiAgICAgICAgUHJvY2VzcyBtZXRob2RzXG4gICAgKi9cbiAgICB1cGRhdGUgPSByZXF1aXJlKCcuL3VwZGF0ZScpLFxuICAgIHJlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyJyksXG4gICAgcG9zdFJlbmRlciA9IHJlcXVpcmUoJy4vcG9zdC1yZW5kZXInKSxcblxuICAgIC8qXG4gICAgICAgIFJvbGUgaW1wb3J0c1xuICAgICovXG4gICAgZGVmYXVsdFJvbGUgPSByZXF1aXJlKCcuLi9yb2xlcy9kZWZhdWx0Um9sZScpLFxuICAgIGNzc1JvbGUgPSByZXF1aXJlKCcuLi9yb2xlcy9jc3MvY3NzUm9sZScpLFxuICAgIHN2Z1JvbGUgPSByZXF1aXJlKCcuLi9yb2xlcy9zdmcvc3ZnUm9sZScpLFxuICAgIGRyYXdQYXRoUm9sZSA9IHJlcXVpcmUoJy4uL3JvbGVzL3BhdGgvZHJhd1BhdGhSb2xlJyksXG5cbiAgICBBY3Rpb24gPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbicpLFxuICAgIGVhY2ggPSB1dGlscy5lYWNoO1xuXG5jbGFzcyBBY3RvciB7XG5cbiAgICAvKlxuICAgICAgICBAcGFyYW0gW29iamVjdF1cbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgICAgICBsZXQgcHJvcHMgPSB1dGlscy5pc1N0cmluZyhvcHRzKSA/IHsgZWxlbWVudDogb3B0cyB9IDogb3B0cztcblxuICAgICAgICB0aGlzLnZhbHVlcyA9IHt9O1xuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZXM6IHt9IH07XG4gICAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoeyB1cGRhdGUsIHJlbmRlciwgcG9zdFJlbmRlciB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5hY3RpdmVBY3Rpb25zID0ge307XG4gICAgICAgIHRoaXMubnVtQWN0aXZlID0gMDtcbiAgICAgICAgdGhpcy5hY3Rpb25Db3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5hY3RpdmVWYWx1ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hY3RpdmVQYXJlbnRzID0gW107XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBHZXQgYWN0dWFsIGVsZW1lbnRzIGlmIHRoaXMgaXMgYSBzZWxlY3RvclxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocHJvcHMuZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHByb3BzLmVsZW1lbnQgPSBzZWxlY3QocHJvcHMuZWxlbWVudClbMF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFzc2lnblJvbGVzKHByb3BzLmVsZW1lbnQsIHByb3BzLmFzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZXQocHJvcHMpO1xuICAgICAgICB0aGlzLmluaXRSb2xlcygpO1xuICAgICAgICB0aGlzLnN5bmMoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBTZXQgQWN0b3IgcHJvcGVydGllcyBhbmQgdmFsdWVzXG5cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdXG4gICAgICAgIEByZXR1cm5zIFtBY3Rvcl1cbiAgICAqL1xuICAgIHNldChvcHRzKSB7XG4gICAgICAgIGVhY2gob3B0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICd2YWx1ZXMnICYmIGtleSAhPT0gJ2FjdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG9wdHMgJiYgb3B0cy52YWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVPcHMucHJvY2Vzcyh0aGlzLnZhbHVlcywgb3B0cy52YWx1ZXMsIG9wdHMsICdjdXJyZW50JywgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgYWN0aXZlIGFjdGlvbnMgZm9yIGFueSB0aGF0IGNhbiBiZSByZW1vdmVkXG4gICAgICAgIGVhY2godGhpcy5hY3RpdmVBY3Rpb25zLCAoaWQsIGFjdGlvbikgPT4ge1xuICAgICAgICAgICAgbGV0IGFjdGlvbklzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGVhY2godGhpcy52YWx1ZXMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uSXNBY3RpdmUgPSAodmFsdWUuYWN0aW9uID09PSBhY3Rpb24pID8gdHJ1ZSA6IGFjdGlvbklzQWN0aXZlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghYWN0aW9uSXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZEFjdGlvbihpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEJpbmQgQWN0aW9uLXNwZWNpZmljIGNvbnRyb2xzIHRvIEFjdG9yXG5cbiAgICAgICAgQHJldHVybnMgW0NvbnRyb2xzXVxuICAgICovXG4gICAgY29udHJvbHMoYWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IENvbnRyb2xzID0gYWN0aW9uLmdldENvbnRyb2xzKCk7XG4gICAgICAgIHJldHVybiBuZXcgQ29udHJvbHModGhpcywgYWN0aW9uLmdldFBsYXlhYmxlKCkpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFN0YXJ0IGEgbmV3IEFjdGlvblxuXG4gICAgICAgIEBwYXJhbSBbQWN0aW9uIHx8IG51bWJlcl1cbiAgICAgICAgQHBhcmFtIFtJbnB1dCB8fCBldmVudF0gKG9wdGlvbmFsKVxuICAgICAgICBAcGFyYW0gW2Jvb2xlYW5dIChvcHRpb25hbCk6IGRlZmluZWQgYHRydWVgIGlmIHdlIHN1cnByZXNzIG1ha2luZyBuZXcgcXVldWVcbiAgICAgICAgQHJldHVybnMgW0NvbnRyb2xzXVxuICAgICovXG4gICAgc3RhcnQodG9TZXQsIGlucHV0KSB7XG4gICAgICAgIGxldCBhY3Rpb25FeGlzdHMgPSB1dGlscy5pc051bSh0b1NldCk7XG4gICAgICAgIGxldCBhY3Rpb24gPSAoYWN0aW9uRXhpc3RzKSA/IHRoaXMuZ2V0QWN0aW9uKHRvU2V0KSA6IHRvU2V0LmdldFBsYXlhYmxlKCk7XG4gICAgICAgIGxldCBvcHRzID0gYWN0aW9uLmdldFNldCgpO1xuICAgICAgICBsZXQgc3VycHJlc3NRdWV1ZUNsZWFyID0gKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlKTtcblxuICAgICAgICBvcHRzLmFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICB0aGlzLnNldChvcHRzKTtcblxuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgIGFjdGlvbi5iaW5kSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdXJwcmVzc1F1ZXVlQ2xlYXIpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWUuY2xlYXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcmUgYWxsIFJvbGUgb25TdGFydHMgaWYgbm90IGFscmVhZHkgYWN0aXZlXG4gICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgbGV0IG51bVJvbGVzID0gdGhpcy5yb2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvbGVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm9sZSA9IHRoaXMucm9sZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHJvbGUuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9sZS5zdGFydC5jYWxsKHRoaXMsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcmUgbmV3IGFjdGlvbiBvblN0YXJ0XG4gICAgICAgIGlmICghYWN0aW9uLmlzQWN0aXZlICYmIGFjdGlvbi5vblN0YXJ0KSB7XG4gICAgICAgICAgICBhY3Rpb24ub25TdGFydCh0aGlzLCBhY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuXG4gICAgICAgIGlmICghYWN0aW9uRXhpc3RzKSB7XG4gICAgICAgICAgICBsZXQgQ29udHJvbHMgPSBhY3Rpb24uZ2V0Q29udHJvbHMoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udHJvbHModGhpcywgYWN0aW9uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFBhdXNlIGFsbCBhY3RpdmUgQWN0aW9uc1xuXG4gICAgICAgIEBwYXJhbSBbaW50XSAob3B0aW9uYWwpXG4gICAgICAgIEByZXR1cm5zIFtBY3Rvcl1cbiAgICAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGVhY2godGhpcy5hY3RpdmVBY3Rpb25zLCAoaWQsIGFjdGlvbikgPT4gYWN0aW9uLmRlYWN0aXZhdGUoKSk7XG4gICAgICAgIHRoaXMucHJvY2Vzcy5zdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFJlc3VtZSBhbGwgYWN0aXZlIEFjdGlvbnNcblxuICAgICAgICBAcGFyYW0gW2ludF0gKG9wdGlvbmFsKVxuICAgICAgICBAcmV0dXJucyBbQWN0b3JdO1xuICAgICovXG4gICAgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUFjdGlvbnMsIChpZCwgYWN0aW9uKSA9PiBhY3Rpb24uYWN0aXZhdGUoKSk7XG4gICAgICAgIHRoaXMucHJvY2Vzcy5zdGFydCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBTdG9wIGFsbCBhY3RpdmUgQWN0aW9uc1xuXG4gICAgICAgIEBwYXJhbSBbaW50XSAob3B0aW9uYWwpXG4gICAgICAgIEByZXR1cm5zIFtBY3Rvcl1cbiAgICAqL1xuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUFjdGlvbnMsIChpZCkgPT4gdGhpcy51bmJpbmRBY3Rpb24oaWQpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgVG9nZ2xlIGFsbCBhY3RpdmUgQWN0aW9uc1xuXG4gICAgICAgIEBwYXJhbSBbaW50XSAob3B0aW9uYWwpXG4gICAgICAgIEByZXR1cm5zIFtBY3Rvcl1cbiAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUgPyB0aGlzLnBhdXNlKCkgOiB0aGlzLnJlc3VtZSgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFN5bmNzIGBlbGVtZW50YCB3aXRoIGN1cnJlbnQgcHJvcGVydGllc1xuXG4gICAgICAgIEByZXR1cm5zIFtBY3Rvcl1cbiAgICAqL1xuICAgIHN5bmMoKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZXMgPSB7fTtcblxuICAgICAgICB1dGlscy5lYWNoKHRoaXMudmFsdWVzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlc1trZXldID0gdmFsdWUuY3VycmVudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGFydChuZXcgQWN0aW9uKHsgdmFsdWVzOiBjdXJyZW50VmFsdWVzIH0pKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQWRkIGEgbmV3IEFjdGlvbiB0byB0aGUgcXVldWVcbiAgICAqL1xuICAgIHRoZW4oKSB7XG4gICAgICAgIHRoaXMucXVldWUuYWRkLmFwcGx5KHRoaXMucXVldWUsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEV4ZWN1dGUgbmV4dCBpbiBxdWV1ZVxuICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLnF1ZXVlLm5leHQoKTtcblxuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgaWYgKHV0aWxzLmlzRnVuYyhuZXh0WzBdKSkge1xuICAgICAgICAgICAgICAgIG5leHRbMF0oKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIC8vIE9yIHRoaXMgaXMgYW4gYWN0aW9uXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHQucHVzaChmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydC5hcHBseSh0aGlzLCBuZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQXNzaWduIFJvbGVzIGJhc2VkIG9uIGVsZW1lbnQgYW5kIG1hbnVhbGx5IHByb3ZpZGVkIHByb3BzXG5cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBFbGVtZW50XG4gICAgICAgIEBwYXJhbSBbUm9sZSB8fCBhcnJheV1cbiAgICAgICAgQHBhcmFtIFtib29sZWFuXSAob3B0aW9uYWwpXG4gICAgKi9cbiAgICBhc3NpZ25Sb2xlcyhlbGVtZW50LCBtYW51YWxSb2xlcywgc3VycHJlc3NJbml0KSB7XG4gICAgICAgIC8vIEFsbCBBY3RvcnMgZ2V0IGEgZGVmYXVsdCBSb2xlIHRoYXQgaGFuZGxlcyB1c2VyIGNhbGxiYWNrc1xuICAgICAgICB0aGlzLnJvbGVzID0gWyBkZWZhdWx0Um9sZSBdO1xuXG4gICAgICAgIC8vIEF1dG8tYXNzaWduIGlmIG5vIG1hbnVhbGx5LXNldCBSb2xlc1xuICAgICAgICBpZiAoIW1hbnVhbFJvbGVzICYmIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b0Fzc2lnblJvbGVzKGVsZW1lbnQpO1xuXG4gICAgICAgIC8vIE9yIG1hbnVhbGx5IHNldCBpZiBwcm92aWRlZFxuICAgICAgICB9IGVsc2UgaWYgKG1hbnVhbFJvbGVzKSB7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShtYW51YWxSb2xlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvbGVzLnB1c2guYXBwbHkodGhpcy5yb2xlcywgbWFudWFsUm9sZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvbGVzLnB1c2gobWFudWFsUm9sZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdXJwcmVzc0luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFJvbGVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBBdXRvbWF0aWNhbGx5IGFzc2lnbiBSb2xlcyBiYXNlZCBvbiBlbGVtZW50LCBkZXNpZ25lZFxuICAgICAgICB0byBiZSBleHRlbmRlZFxuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XTogRWxlbWVudFxuICAgICovXG4gICAgYXV0b0Fzc2lnblJvbGVzKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gQWRkIENTUyByb2xlIGlmIEhUTUxFbGVtZW50XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgZWxlbWVudC50YWdOYW1lID09PSAnc3ZnJykge1xuICAgICAgICAgICAgdGhpcy5yb2xlcy5wdXNoKGNzc1JvbGUpO1xuXG4gICAgICAgIC8vIEFkZCBTVkcgcm9sZSBpZiBTVkcgZWxlbWVudFxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJvbGVzLnB1c2goc3ZnUm9sZSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBEcmF3IFBhdGggcm9sZSBpZiBwYXRoIGVsZW1lbnRcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdwYXRoJykge1xuICAgICAgICAgICAgICAgIHRoaXMucm9sZXMucHVzaChkcmF3UGF0aFJvbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgRmlyZSBpbml0IGNhbGxiYWNrc1xuICAgICovXG4gICAgaW5pdFJvbGVzKCkge1xuICAgICAgICAvLyBGaXJlIGluaXQgY2FsbGJhY2tcbiAgICAgICAgdGhpcy5yb2xlcy5mb3JFYWNoKChyb2xlKSA9PiB7XG4gICAgICAgICAgICBpZiAocm9sZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgcm9sZS5pbml0LmNhbGwodGhpcywgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFjdGl2YXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5maXJzdEZyYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzcy5zdGFydCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQmluZCBBY3Rpb24gYW5kIHJldHVybiBpdHMgdGFibGUgaWRcblxuICAgICAgICBAcGFyYW0gW0FjdGlvbl1cbiAgICAgICAgQHJldHVybnMgW2ludF1cbiAgICAqL1xuICAgIGJpbmRBY3Rpb24oYWN0aW9uLCBpZCkge1xuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmFjdGlvbkNvdW50ZXIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5oYXNBY3Rpb24oaWQpKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUFjdGlvbnNbaWRdID0gYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5udW1BY3RpdmUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICB1bmJpbmRBY3Rpb24oaWQpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLmFjdGl2ZUFjdGlvbnNbaWRdO1xuICAgICAgICAgICAgaWYgKGFjdGlvbi5pbnB1dCAmJiBhY3Rpb24uaW5wdXQuYXV0b1N0b3AgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24uaW5wdXQuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aW9uLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgIHRoaXMubnVtQWN0aXZlLS07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5hY3RpdmVBY3Rpb25zW2lkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5udW1BY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFjdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVBY3Rpb25zW2lkXTtcbiAgICB9XG5cbiAgICBoYXNBY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmdldEFjdGlvbihpZCkgIT09IHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgVXBkYXRlIHByb2Nlc3Npbmcgb3JkZXJcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXVxuICAgICAgICBAcGFyYW0gW2Jvb2xlYW5dXG4gICAgICAgIEBwYXJhbSBbYm9vbGVhbl1cbiAgICAqL1xuICAgIHVwZGF0ZU9yZGVyKGtleSwgbW92ZVRvQmFjaywgaGFzQ2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIG9yZGVyID0gKCFoYXNDaGlsZHJlbikgPyB0aGlzLmFjdGl2ZVZhbHVlcyA6IHRoaXMuYWN0aXZlUGFyZW50cyxcbiAgICAgICAgICAgIHBvc2l0aW9uID0gb3JkZXIuaW5kZXhPZihrZXkpO1xuXG4gICAgICAgIC8vIElmIGtleSBpc24ndCBsaXN0IG9yIG1vdmVUb0JhY2sgaXMgc2V0IHRvIHRydWUsIGFkZCBrZXlcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAtMSB8fCBtb3ZlVG9CYWNrKSB7XG4gICAgICAgICAgICBvcmRlci5wdXNoKGtleSk7XG5cbiAgICAgICAgICAgIC8vIElmIGtleSBhbHJlYWR5IGV4aXN0cywgcmVtb3ZlXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPiAtMSkge1xuICAgICAgICAgICAgICAgIG9yZGVyLnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBbYm9vbGVhbl06IElzIHRoaXMgQWN0b3IgYWN0aXZlP1xuICAgIGdldCBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlO1xuICAgIH1cblxuICAgIC8vIFNldCBoYXNDaGFuZ2VkIHRvIHRydWUgaXMgdGhpcyBpcyBub3cgYWN0aXZlXG4gICAgc2V0IGlzQWN0aXZlKHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmhhc0NoYW5nZWQgPSBzdGF0dXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pc0FjdGl2ZSA9IHN0YXR1cztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0b3I7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdfQ==

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var utils = __webpack_require__(4);
	var loop = __webpack_require__(7);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL1Byb2Nlc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU0sUUFBUSxRQUFRLGNBQVIsQ0FBUjtBQUNOLElBQU0sT0FBTyxRQUFRLFFBQVIsQ0FBUDs7SUFFQTs7Ozs7OztBQU1GLGFBTkUsT0FNRixDQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFBNkI7Ozs4QkFOM0IsU0FNMkI7OztBQUV6QixZQUFJLE1BQU0sTUFBTixDQUFhLFFBQWIsQ0FBSixFQUE0QjtBQUN4QixpQkFBSyxNQUFMLEdBQWMsUUFBZCxDQUR3QjtTQUE1QixNQUdPLElBQUksTUFBTSxLQUFOLENBQVksUUFBWixDQUFKLEVBQTJCO0FBQzlCLGtCQUFNLElBQU4sQ0FBVyxRQUFYLEVBQXFCLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDakMsc0JBQUssR0FBTCxJQUFZLEtBQVosQ0FEaUM7YUFBaEIsQ0FBckIsQ0FEOEI7U0FBM0I7O0FBTVAsYUFBSyxLQUFMLEdBQWEsTUFBTSxLQUFOLENBQVksS0FBWixJQUFxQixLQUFyQixHQUE2QixJQUE3QixDQVhZOztBQWF6QixhQUFLLGFBQUwsQ0FBbUIsVUFBVSxVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsQ0FBN0IsRUFieUI7O0FBZXpCLGFBQUssRUFBTCxHQUFVLEtBQUssWUFBTCxFQUFWLENBZnlCO0FBZ0J6QixhQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FoQnlCO0tBQTdCOztBQU5FLHNCQXlCRix5QkFBUTtBQUNKLGFBQUssUUFBTCxHQURJO0FBRUosZUFBTyxJQUFQLENBRkk7OztBQXpCTixzQkE4QkYsdUJBQU87QUFDSCxhQUFLLFVBQUwsR0FERztBQUVILGVBQU8sSUFBUCxDQUZHOzs7QUE5Qkwsc0JBbUNGLCtCQUFXO0FBQ1AsYUFBSyxRQUFMLEdBQWdCLElBQWhCLENBRE87QUFFUCxhQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLEtBQUssRUFBTCxDQUFwQixDQUZPOzs7QUFuQ1Qsc0JBd0NGLG1DQUFhO0FBQ1QsYUFBSyxRQUFMLEdBQWdCLEtBQWhCLENBRFM7QUFFVCxhQUFLLFVBQUwsQ0FBZ0IsS0FBSyxFQUFMLENBQWhCLENBRlM7OztBQXhDWCxzQkE2Q0YsdUJBQU87OztBQUNILGFBQUssT0FBTCxHQUFlLFlBQU07QUFDakIsbUJBQUssSUFBTCxHQURpQjtBQUVqQixtQkFBSyxPQUFMLEdBQWUsU0FBZixDQUZpQjtTQUFOLENBRFo7O0FBTUgsZUFBTyxLQUFLLEtBQUwsRUFBUCxDQU5HOzs7QUE3Q0wsc0JBc0RGLHVDQUFjLGlCQUFpQjtBQUMzQixhQUFLLFlBQUwsR0FBb0IsZUFBQyxLQUFvQixJQUFwQixHQUE0QixJQUE3QixHQUFvQyxLQUFwQyxDQURPO0FBRTNCLGVBQU8sSUFBUCxDQUYyQjs7O1dBdEQ3Qjs7O0FBNEROLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJQcm9jZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi9pbmMvdXRpbHMnKTtcbmNvbnN0IGxvb3AgPSByZXF1aXJlKCcuL2xvb3AnKTtcblxuY2xhc3MgUHJvY2VzcyB7XG5cbiAgICAvKlxuICAgICAgICBAcGFyYW0gW2Z1bmN0aW9uIHx8IG9iamVjdF1cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdIChvcHRpb25hbClcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBzY29wZSkge1xuICAgICAgICAvLyBTZXQgY2FsbGJhY2tcbiAgICAgICAgaWYgKHV0aWxzLmlzRnVuYyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaChjYWxsYmFjaywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY29wZSA9IHV0aWxzLmlzT2JqKHNjb3BlKSA/IHNjb3BlIDogdGhpcztcblxuICAgICAgICB0aGlzLnNldEJhY2tncm91bmQoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgdGhpcy5pZCA9IGxvb3AuZ2V0UHJvY2Vzc0lkKCk7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICBsb29wLmFjdGl2YXRlKHRoaXMsIHRoaXMuaWQpO1xuICAgIH1cblxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgbG9vcC5kZWFjdGl2YXRlKHRoaXMuaWQpO1xuICAgIH1cblxuICAgIG9uY2UoKSB7XG4gICAgICAgIHRoaXMuY2xlYW51cCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhbnVwID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBzZXRCYWNrZ3JvdW5kKHJ1bkluQmFja2dyb3VuZCkge1xuICAgICAgICB0aGlzLmlzQmFja2dyb3VuZCA9IChydW5JbkJhY2tncm91bmQgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvY2VzczsiXX0=

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var timer = __webpack_require__(8);
	var systemTick = __webpack_require__(9);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2xvb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQVI7QUFDTixJQUFNLGFBQWEsUUFBUSxlQUFSLENBQWI7O0FBRU4sSUFBTSxlQUFlLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsRUFBa0MsWUFBbEMsRUFBZ0QsU0FBaEQsQ0FBZjtBQUNOLElBQU0sa0JBQWtCLGFBQWEsTUFBYjs7O0FBR3hCLElBQUksbUJBQW1CLENBQW5COzs7QUFHSixJQUFJLGVBQWUsQ0FBZjs7O0FBR0osSUFBSSxjQUFjLENBQWQ7OztBQUdKLElBQUksYUFBYSxFQUFiOzs7QUFHSixJQUFJLG1CQUFtQixFQUFuQjs7O0FBR0osSUFBSSxrQkFBa0IsRUFBbEI7OztBQUdKLElBQUksWUFBWSxLQUFaOzs7Ozs7OztBQVFKLElBQU0sY0FBYyxVQUFDLEdBQUQsRUFBTSxZQUFOLEVBQXVCO0FBQ3ZDLFFBQU0sU0FBUyxNQUFNLENBQU4sR0FBVSxDQUFDLENBQUQsQ0FEYzs7QUFHdkMsb0JBQWdCLE1BQWhCLENBSHVDOztBQUt2QyxRQUFJLENBQUMsWUFBRCxFQUFlO0FBQ2YsdUJBQWUsTUFBZixDQURlO0tBQW5CO0NBTGdCOzs7OztBQWFwQixJQUFNLFFBQVEsWUFBTTtBQUNoQixRQUFJLGNBQWMsZ0JBQWdCLE1BQWhCLENBREY7O0FBR2hCLFdBQU8sYUFBUCxFQUFzQjtBQUNsQixZQUFNLGFBQWEsZ0JBQWdCLFdBQWhCLENBQWIsQ0FEWTtBQUVsQixZQUFNLGdCQUFnQixXQUFXLE9BQVgsQ0FBbUIsVUFBbkIsQ0FBaEI7OztBQUZZLFlBS2QsZ0JBQWdCLENBQUMsQ0FBRCxFQUFJO0FBQ3BCLHVCQUFXLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUMsQ0FBakMsRUFEb0I7O0FBR3BCLHdCQUFZLEtBQVosRUFBbUIsaUJBQWlCLFVBQWpCLEVBQTZCLFlBQTdCLENBQW5CLENBSG9COztBQUtwQixtQkFBTyxpQkFBaUIsVUFBakIsQ0FBUCxDQUxvQjtTQUF4QjtLQUxKOztBQWNBLHNCQUFrQixFQUFsQixDQWpCZ0I7Q0FBTjs7Ozs7Ozs7O0FBMkJkLElBQU0sVUFBVSxVQUFDLFVBQUQsRUFBYSxPQUFiLEVBQXlCO0FBQ3JDLFlBRHFDOztBQUdyQyxRQUFNLGFBQWEsWUFBYixDQUgrQjtBQUlyQyxTQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxlQUFKLEVBQXFCLEdBQXJDLEVBQTBDO0FBQ3RDLFlBQUksU0FBUyxhQUFhLENBQWIsQ0FBVCxDQURrQzs7QUFHdEMsYUFBSyxJQUFJLEtBQUksQ0FBSixFQUFPLEtBQUksVUFBSixFQUFnQixJQUFoQyxFQUFxQztBQUNqQyxnQkFBSSxVQUFVLGlCQUFpQixXQUFXLEVBQVgsQ0FBakIsQ0FBVixDQUQ2Qjs7QUFHakMsZ0JBQUksV0FBVyxRQUFRLE1BQVIsQ0FBWCxFQUE0QjtBQUM1Qix3QkFBUSxNQUFSLEVBQWdCLElBQWhCLENBQXFCLFFBQVEsS0FBUixFQUFlLFFBQVEsS0FBUixFQUFlLFVBQW5ELEVBQStELE9BQS9ELEVBRDRCO2FBQWhDO1NBSEo7S0FISjs7QUFZQSxZQWhCcUM7O0FBa0JyQyxXQUFPLGNBQWMsSUFBZCxHQUFxQixLQUFyQixDQWxCOEI7Q0FBekI7O0FBcUJoQixJQUFNLE9BQU87Ozs7QUFJVCxXQUFPLFlBQU07QUFDVCxtQkFBVyxLQUFLLFFBQUwsQ0FBWCxDQURTO0tBQU47O0FBSVAsY0FBVSxzQkFBYztBQUNwQixZQUFJLFNBQUosRUFBZTtBQUNYLGlCQUFLLEtBQUwsR0FEVztTQUFmOztBQUlBLGNBQU0sTUFBTixDQUFhLFVBQWIsRUFMb0I7QUFNcEIsb0JBQVksUUFBUSxVQUFSLEVBQW9CLE1BQU0sVUFBTixFQUFwQixDQUFaLENBTm9CO0tBQWQ7O0FBU1YsV0FBTyxZQUFNO0FBQ1QsWUFBSSxDQUFDLFNBQUQsRUFBWTtBQUNaLGtCQUFNLEtBQU4sR0FEWTtBQUVaLHdCQUFZLElBQVosQ0FGWTtBQUdaLGlCQUFLLEtBQUwsR0FIWTtTQUFoQjtLQURHOztBQVFQLFVBQU0sWUFBTTtBQUNSLG9CQUFZLEtBQVosQ0FEUTtLQUFOO0NBekJKOztBQThCTixPQUFPLE9BQVAsR0FBaUI7O0FBRWIsa0JBQWM7ZUFBTTtLQUFOOzs7Ozs7QUFNZCxjQUFVLFVBQUMsT0FBRCxFQUFVLFNBQVYsRUFBd0I7QUFDOUIsWUFBTSxhQUFhLGdCQUFnQixPQUFoQixDQUF3QixTQUF4QixDQUFiLENBRHdCO0FBRTlCLFlBQU0sV0FBWSxhQUFhLENBQUMsQ0FBRCxDQUZEO0FBRzlCLFlBQU0sWUFBYSxXQUFXLE9BQVgsQ0FBbUIsU0FBbkIsSUFBZ0MsQ0FBQyxDQUFEOzs7QUFIckIsWUFNMUIsUUFBSixFQUFjO0FBQ1YsNEJBQWdCLE1BQWhCLENBQXVCLFVBQXZCLEVBQW1DLENBQW5DLEVBRFU7U0FBZDs7O0FBTjhCLFlBVzFCLENBQUMsU0FBRCxFQUFZO0FBQ1osdUJBQVcsSUFBWCxDQUFnQixTQUFoQixFQURZO0FBRVosNkJBQWlCLFNBQWpCLElBQThCLE9BQTlCLENBRlk7O0FBSVosd0JBQVksSUFBWixFQUFrQixRQUFRLFlBQVIsQ0FBbEIsQ0FKWTtBQUtaLGlCQUFLLEtBQUwsR0FMWTtTQUFoQjtLQVhNOzs7OztBQXVCVixnQkFBWSxVQUFDLFNBQUQsRUFBZTtBQUN2QixZQUFJLGdCQUFnQixPQUFoQixDQUF3QixTQUF4QixNQUF1QyxDQUFDLENBQUQsRUFBSTtBQUMzQyw0QkFBZ0IsSUFBaEIsQ0FBcUIsU0FBckIsRUFEMkM7U0FBL0M7S0FEUTtDQS9CaEIiLCJmaWxlIjoibG9vcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpO1xuY29uc3Qgc3lzdGVtVGljayA9IHJlcXVpcmUoJy4vc3lzdGVtLXRpY2snKTtcblxuY29uc3QgcHJvY2Vzc09yZGVyID0gWyd1cGRhdGUnLCAncHJlUmVuZGVyJywgJ3JlbmRlcicsICdwb3N0UmVuZGVyJywgJ2NsZWFudXAnXTtcbmNvbnN0IG51bVByb2Nlc3NTdGVwcyA9IHByb2Nlc3NPcmRlci5sZW5ndGg7XG5cbi8vIFtpbnRdOiBQcm9jZXNzIElELCBpbmNyZW1lbnRlZCBmb3IgZWFjaCBuZXcgcHJvY2Vzc1xubGV0IGN1cnJlbnRQcm9jZXNzSWQgPSAwO1xuXG4vLyBbaW50XTogTnVtYmVyIG9mIHJ1bm5pbmcgcHJvY2Vzc2VzXG5sZXQgcnVubmluZ0NvdW50ID0gMDtcblxuLy8gW2ludF06IE51bWJlciBvZiBydW5uaW5nIG5vbi1iYWNrZ3JvdW5kIHByb2Nlc3Nlc1xubGV0IGFjdGl2ZUNvdW50ID0gMDtcblxuLy8gW2FycmF5XTogQXJyYXkgb2YgYWN0aXZlIHByb2Nlc3MgSURzXG5sZXQgcnVubmluZ0lkcyA9IFtdO1xuXG4vLyBbb2JqZWN0XTogTWFwIG9mIGFjdGl2ZSBwcm9jZXNzZXNcbmxldCBydW5uaW5nUHJvY2Vzc2VzID0ge307XG5cbi8vIFthcnJheV06IEFycmF5IG9mIHByb2Nlc3MgSURzIHF1ZXVlZCBmb3IgZGVhY3RpdmF0aW9uXG5sZXQgZGVhY3RpdmF0ZVF1ZXVlID0gW107XG5cbi8vIFtib29sZWFuXTogSXMgbG9vcCBydW5uaW5nP1xubGV0IGlzUnVubmluZyA9IGZhbHNlO1xuXG4vKlxuICAgIFVwZGF0ZSBydW5uaW5nXG5cbiAgICBAcGFyYW0gW2Jvb2xlYW5dXG4gICAgQHBhcmFtIFtib29sZWFuXVxuKi9cbmNvbnN0IHVwZGF0ZUNvdW50ID0gKGFkZCwgaXNCYWNrZ3JvdW5kKSA9PiB7XG4gICAgY29uc3QgbW9kaWZ5ID0gYWRkID8gMSA6IC0xO1xuXG4gICAgcnVubmluZ0NvdW50ICs9IG1vZGlmeTtcblxuICAgIGlmICghaXNCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGFjdGl2ZUNvdW50ICs9IG1vZGlmeTtcbiAgICB9XG59XG5cbi8qXG4gICAgUHVyZ2UgaXRlbXMgaW4gdGhlIGRlYWN0aXZhdGUgcXVldWUgZnJvbSBvdXIgcnVubmluZ1Byb2Nlc3Nlc1xuKi9cbmNvbnN0IHB1cmdlID0gKCkgPT4ge1xuICAgIGxldCBxdWV1ZUxlbmd0aCA9IGRlYWN0aXZhdGVRdWV1ZS5sZW5ndGg7XG5cbiAgICB3aGlsZSAocXVldWVMZW5ndGgtLSkge1xuICAgICAgICBjb25zdCBpZFRvRGVsZXRlID0gZGVhY3RpdmF0ZVF1ZXVlW3F1ZXVlTGVuZ3RoXTtcbiAgICAgICAgY29uc3QgYWN0aXZlSWRJbmRleCA9IHJ1bm5pbmdJZHMuaW5kZXhPZihpZFRvRGVsZXRlKTtcblxuICAgICAgICAvLyBJZiBwcm9jZXNzIGlzIGFjdGl2ZSwgZGVhY3RpdmF0ZVxuICAgICAgICBpZiAoYWN0aXZlSWRJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBydW5uaW5nSWRzLnNwbGljZShhY3RpdmVJZEluZGV4LCAxKTtcblxuICAgICAgICAgICAgdXBkYXRlQ291bnQoZmFsc2UsIHJ1bm5pbmdQcm9jZXNzZXNbaWRUb0RlbGV0ZV0uaXNCYWNrZ3JvdW5kKTtcblxuICAgICAgICAgICAgZGVsZXRlIHJ1bm5pbmdQcm9jZXNzZXNbaWRUb0RlbGV0ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlUXVldWUgPSBbXTtcbn1cblxuLypcbiAgICBGaXJlIGFsbCBhY3RpdmUgcHJvY2Vzc2VzXG4gICAgXG4gICAgQHBhcmFtIFtpbnRdOiBUaW1lc3RhbXAgb2YgZXhlY3V0aW5nIGZyYW1lc1xuICAgIEBwYXJhbSBbaW50XTogVGltZSBzaW5jZSBwcmV2aW91cyBmcmFtZVxuICAgIEByZXR1cm4gW2Jvb2xlYW5dOiBUcnVlIGlmIGFjdGl2ZSBwcm9jZXNzZXMgZm91bmRcbiovXG5jb25zdCBmaXJlQWxsID0gKGZyYW1lc3RhbXAsIGVsYXBzZWQpID0+IHtcbiAgICBwdXJnZSgpO1xuXG4gICAgY29uc3QgbnVtUnVubmluZyA9IHJ1bm5pbmdDb3VudDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVByb2Nlc3NTdGVwczsgaSsrKSB7XG4gICAgICAgIGxldCBtZXRob2QgPSBwcm9jZXNzT3JkZXJbaV07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1SdW5uaW5nOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzID0gcnVubmluZ1Byb2Nlc3Nlc1tydW5uaW5nSWRzW2ldXTtcblxuICAgICAgICAgICAgaWYgKHByb2Nlc3MgJiYgcHJvY2Vzc1ttZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc1ttZXRob2RdLmNhbGwocHJvY2Vzcy5zY29wZSwgcHJvY2Vzcy5zY29wZSwgZnJhbWVzdGFtcCwgZWxhcHNlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdXJnZSgpO1xuXG4gICAgcmV0dXJuIGFjdGl2ZUNvdW50ID8gdHJ1ZSA6IGZhbHNlO1xufVxuXG5jb25zdCBsb29wID0ge1xuICAgIC8qXG4gICAgICAgIEZpcmUgYWxsIGFjdGl2ZSBwcm9jZXNzZXMgb25jZSBwZXIgZnJhbWVcbiAgICAqL1xuICAgIGZyYW1lOiAoKSA9PiB7XG4gICAgICAgIHN5c3RlbVRpY2sobG9vcC5lYWNoVGljayk7XG4gICAgfSxcblxuICAgIGVhY2hUaWNrOiBmcmFtZXN0YW1wID0+IHtcbiAgICAgICAgaWYgKGlzUnVubmluZykge1xuICAgICAgICAgICAgbG9vcC5mcmFtZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGltZXIudXBkYXRlKGZyYW1lc3RhbXApO1xuICAgICAgICBpc1J1bm5pbmcgPSBmaXJlQWxsKGZyYW1lc3RhbXAsIHRpbWVyLmdldEVsYXBzZWQoKSk7XG4gICAgfSxcbiAgICBcbiAgICBzdGFydDogKCkgPT4ge1xuICAgICAgICBpZiAoIWlzUnVubmluZykge1xuICAgICAgICAgICAgdGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIGlzUnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICBsb29wLmZyYW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogKCkgPT4ge1xuICAgICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBJbmNyZW1lbnRzIGFuZCByZXR1cm5zIHRoZSBsYXRlc3QgcHJvY2VzcyBJRFxuICAgIGdldFByb2Nlc3NJZDogKCkgPT4gY3VycmVudFByb2Nlc3NJZCsrLFxuXG4gICAgLypcbiAgICAgICAgQHBhcmFtIFtQcm9jZXNzXVxuICAgICAgICBAcGFyYW0gW2ludF1cbiAgICAqL1xuICAgIGFjdGl2YXRlOiAocHJvY2VzcywgcHJvY2Vzc0lkKSA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZXVlSW5kZXggPSBkZWFjdGl2YXRlUXVldWUuaW5kZXhPZihwcm9jZXNzSWQpO1xuICAgICAgICBjb25zdCBpc1F1ZXVlZCA9IChxdWV1ZUluZGV4ID4gLTEpO1xuICAgICAgICBjb25zdCBpc1J1bm5pbmcgPSAocnVubmluZ0lkcy5pbmRleE9mKHByb2Nlc3NJZCkgPiAtMSk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGZyb20gZGVhY3RpdmF0ZVF1ZXVlIGlmIHF1ZXVlZFxuICAgICAgICBpZiAoaXNRdWV1ZWQpIHtcbiAgICAgICAgICAgIGRlYWN0aXZhdGVRdWV1ZS5zcGxpY2UocXVldWVJbmRleCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdG8gcnVubmluZyBwcm9jZXNzZXMgYXJyYXkgaWYgbm90IHRoZXJlXG4gICAgICAgIGlmICghaXNSdW5uaW5nKSB7XG4gICAgICAgICAgICBydW5uaW5nSWRzLnB1c2gocHJvY2Vzc0lkKTtcbiAgICAgICAgICAgIHJ1bm5pbmdQcm9jZXNzZXNbcHJvY2Vzc0lkXSA9IHByb2Nlc3M7XG5cbiAgICAgICAgICAgIHVwZGF0ZUNvdW50KHRydWUsIHByb2Nlc3MuaXNCYWNrZ3JvdW5kKTtcbiAgICAgICAgICAgIGxvb3Auc3RhcnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBAcGFyYW0gW2ludF1cbiAgICAqL1xuICAgIGRlYWN0aXZhdGU6IChwcm9jZXNzSWQpID0+IHtcbiAgICAgICAgaWYgKGRlYWN0aXZhdGVRdWV1ZS5pbmRleE9mKHByb2Nlc3NJZCkgPT09IC0xKSB7XG4gICAgICAgICAgICBkZWFjdGl2YXRlUXVldWUucHVzaChwcm9jZXNzSWQpO1xuICAgICAgICB9XG4gICAgfVxufTsiXX0=

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var currentTime = __webpack_require__(4).currentTime;
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL3RpbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxjQUFjLFFBQVEsY0FBUixFQUF3QixXQUF4QjtBQUNwQixJQUFNLGNBQWMsRUFBZDs7QUFFTixJQUFJLFVBQVUsQ0FBVjtBQUNKLElBQUksVUFBVSxJQUFWOztBQUVKLElBQU0sUUFBUTtBQUNWLFlBQVEsVUFBQyxVQUFELEVBQWdCO0FBQ3BCLFlBQU0sT0FBTyxPQUFQLENBRGM7QUFFcEIsa0JBQVUsVUFBVixDQUZvQjtBQUdwQixrQkFBVSxLQUFLLEdBQUwsQ0FBUyxVQUFVLElBQVYsRUFBZ0IsV0FBekIsQ0FBVixDQUhvQjs7QUFLcEIsZUFBTyxPQUFQLENBTG9CO0tBQWhCOztBQVFSLFdBQU87ZUFBTSxVQUFVLGFBQVY7S0FBTjs7QUFFUCxnQkFBWTtlQUFNO0tBQU47Q0FYVjs7QUFjTixPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjdXJyZW50VGltZSA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLmN1cnJlbnRUaW1lO1xuY29uc3QgTUFYX0VMQVBTRUQgPSAzMztcblxubGV0IGN1cnJlbnQgPSAwO1xubGV0IGVsYXBzZWQgPSAxNi43O1xuXG5jb25zdCB0aW1lciA9IHtcbiAgICB1cGRhdGU6IChmcmFtZXN0YW1wKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gZnJhbWVzdGFtcDtcbiAgICAgICAgZWxhcHNlZCA9IE1hdGgubWluKGN1cnJlbnQgLSBwcmV2LCBNQVhfRUxBUFNFRCk7XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfSxcblxuICAgIHN0YXJ0OiAoKSA9PiBjdXJyZW50ID0gY3VycmVudFRpbWUoKSxcblxuICAgIGdldEVsYXBzZWQ6ICgpID0+IGVsYXBzZWRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZXI7Il19

/***/ },
/* 9 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL3N5c3RlbS10aWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxTQUFTLE9BQVEsTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPLHFCQUFQLEdBQWdDLElBQWxFLEdBQXlFLEtBQXpFOztBQUVmLElBQUksZ0JBQUo7O0FBRUEsSUFBSSxNQUFKLEVBQVk7QUFDUixXQUFPLE9BQU8scUJBQVAsQ0FEQztDQUFaLE1BR087Ozs7Ozs7Ozs7Ozs7OztBQWVILFlBQUksV0FBVyxDQUFYOztBQUVKLGVBQU8sVUFBQyxRQUFELEVBQWM7QUFDakIsZ0JBQU0sY0FBYyxJQUFJLElBQUosR0FBVyxPQUFYLEVBQWQsQ0FEVztBQUVqQixnQkFBTSxhQUFhLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLGNBQWMsUUFBZCxDQUFOLENBQXpCLENBRlc7O0FBSWpCLHVCQUFXLGNBQWMsVUFBZCxDQUpNOztBQU1qQix1QkFBVzt1QkFBTSxTQUFTLFFBQVQ7YUFBTixFQUEwQixVQUFyQyxFQU5pQjtTQUFkO1NBakJKO0NBSFA7O0FBOEJBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJzeXN0ZW0tdGljay5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGhhc1JBRiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSA/IHRydWUgOiBmYWxzZTtcblxubGV0IHRpY2s7XG5cbmlmIChoYXNSQUYpIHtcbiAgICB0aWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxufSBlbHNlIHtcbiAgICAvKlxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGxcbiAgICAgICAgXG4gICAgICAgIEZvciBJRTgvOSBGbGluc3RvbmVzXG5cbiAgICAgICAgVGFrZW4gZnJvbSBQYXVsIElyaXNoLiBXZSd2ZSBzdHJpcHBlZCBvdXQgY2FuY2VsQW5pbWF0aW9uRnJhbWUgY2hlY2tzIGJlY2F1c2Ugd2UgZG9uJ3QgZm94IHdpdGggdGhhdFxuICAgICAgICBcbiAgICAgICAgaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAgICAgICAgaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuICAgICAgICAgXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiAgICAgICAgIFxuICAgICAgICBNSVQgbGljZW5zZVxuICAgICovXG4gICAgbGV0IGxhc3RUaW1lID0gMDtcblxuICAgIHRpY2sgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJlbnRUaW1lIC0gbGFzdFRpbWUpKTtcblxuICAgICAgICBsYXN0VGltZSA9IGN1cnJlbnRUaW1lICsgdGltZVRvQ2FsbDtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhbGxiYWNrKGxhc3RUaW1lKSwgdGltZVRvQ2FsbCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRpY2s7Il19

/***/ },
/* 10 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFNO0FBQ0YsYUFERSxLQUNGLEdBQWM7OEJBRFosT0FDWTs7QUFDVixhQUFLLEtBQUwsR0FEVTtLQUFkOzs7Ozs7QUFERSxvQkFRRixxQkFBTTtBQUNGLGFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBaEIsRUFERTs7Ozs7OztBQVJKLG9CQWVGLHVCQUFvQjtZQUFmLGtFQUFZLGlCQUFHOztBQUNoQixZQUFJLFFBQVEsS0FBSyxLQUFMO1lBQ1IsWUFBWSxLQUFaO1lBQ0EsUUFBUSxLQUFLLEtBQUw7OztBQUhJLFlBTVosU0FBUyxDQUFULElBQWMsUUFBUSxNQUFNLE1BQU4sRUFBYztBQUNwQyx3QkFBWSxNQUFNLEtBQU4sQ0FBWixDQURvQztBQUVwQyxpQkFBSyxLQUFMLEdBQWEsUUFBUSxTQUFSOzs7QUFGdUIsU0FBeEMsTUFLTztBQUNILHFCQUFLLEtBQUwsR0FERzthQUxQOztBQVNBLGVBQU8sU0FBUCxDQWZnQjs7Ozs7OztBQWZsQixvQkFvQ0YseUJBQVE7QUFDSixhQUFLLEtBQUwsR0FBYSxFQUFiLENBREk7QUFFSixhQUFLLEtBQUwsR0FBYSxDQUFiLENBRkk7OztXQXBDTjs7O0FBMENOLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJRdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEFkZCBhIHNldCBvZiBhcmd1bWVudHMgdG8gcXVldWVcbiAgICAqL1xuICAgIGFkZCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgR2V0IG5leHQgc2V0IG9mIGFyZ3VtZW50cyBmcm9tIHF1ZXVlXG4gICAgKi9cbiAgICBuZXh0KGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gdGhpcy5xdWV1ZSxcbiAgICAgICAgICAgIHJldHVyblZhbCA9IGZhbHNlLFxuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4O1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgb3VyIGluZGV4IGlzIGJldHdlZW4gMCBhbmQgdGhlIHF1ZXVlIGxlbmd0aCwgcmV0dXJuIHRoYXQgaXRlbVxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuVmFsID0gcXVldWVbaW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4ICsgZGlyZWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgLy8gT3IgY2xlYXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBSZXBsYWNlIHF1ZXVlIHdpdGggZW1wdHkgYXJyYXlcbiAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTsiXX0=

/***/ },
/* 11 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvc2VsZWN0LWRvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsUUFBVixFQUFvQjtBQUNqQyxRQUFJLFFBQVEsT0FBUSxRQUFQLEtBQW9CLFFBQXBCLEdBQWdDLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBakMsR0FBdUUsUUFBdkU7UUFDUixXQUFXLEVBQVg7OztBQUY2QixRQUs3QixNQUFNLEdBQU4sRUFBVztBQUNYLG1CQUFXLE1BQU0sR0FBTixFQUFYOzs7QUFEVyxLQUFmLE1BSU8sSUFBSSxNQUFNLE1BQU4sRUFBYztBQUNyQix1QkFBVyxHQUFHLEtBQUgsQ0FBUyxJQUFULENBQWMsS0FBZCxDQUFYOzs7QUFEcUIsU0FBbEIsTUFJQTtBQUNILHlCQUFTLElBQVQsQ0FBYyxLQUFkLEVBREc7YUFKQTs7QUFRUCxXQUFPLFFBQVAsQ0FqQmlDO0NBQXBCIiwiZmlsZSI6InNlbGVjdC1kb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICAgIEBwYXJhbSBbc3RyaW5nIHx8IE5vZGVMaXN0IHx8IGpRdWVyeSBvYmplY3RdOlxuICAgICAgICBJZiBzdHJpbmcsIHRyZWF0ZWQgYXMgc2VsZWN0b3IuXG4gICAgICAgIElmIG5vdCwgdHJlYXRlZCBhcyBwcmVleGlzdGluZyBOb2RlTGlzdCB8fCBqUXVlcnkgb2JqZWN0LlxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgdmFyIG5vZGVzID0gKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOiBzZWxlY3RvcixcbiAgICAgICAgZWxlbWVudHMgPSBbXTtcblxuICAgIC8vIElmIGpRdWVyeSBzZWxlY3Rpb24sIGdldCBhcnJheSBvZiBFbGVtZW50c1xuICAgIGlmIChub2Rlcy5nZXQpIHtcbiAgICAgICAgZWxlbWVudHMgPSBub2Rlcy5nZXQoKTtcblxuICAgIC8vIE9yIGNvbnZlcnQgTm9kZUxpc3QgdG8gYXJyYXlcbiAgICB9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwobm9kZXMpO1xuXG4gICAgLy8gT3IgaWYgaXQncyBqdXN0IGFuIEVsZW1lbnQsIHB1dCBpbnRvIGFycmF5XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChub2Rlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnRzO1xufTsiXX0=

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypesManager = __webpack_require__(3),
	    calc = __webpack_require__(13),
	    utils = __webpack_require__(4),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rvci92YWx1ZS1vcGVyYXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxvQkFBb0IsUUFBUSx3QkFBUixDQUFwQjtJQUNBLE9BQU8sUUFBUSxhQUFSLENBQVA7SUFDQSxRQUFRLFFBQVEsY0FBUixDQUFSO0lBQ0EsUUFBUSxNQUFNLEtBQU47SUFDUixPQUFPLE1BQU0sSUFBTjs7QUFFWCxJQUFNLGtCQUFrQixDQUFDLFNBQUQsRUFBWSxJQUFaLEVBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDLFVBQWhDLEVBQTRDLFVBQTVDLEVBQXdELFFBQXhELEVBQWtFLGNBQWxFLENBQWxCO0lBQ0YscUJBQXFCLGdCQUFnQixNQUFoQjtJQUNyQixlQUFlO0FBQ1gsYUFBUyxDQUFUO0FBQ0EsY0FBVSxDQUFWO0FBQ0EsV0FBTyxDQUFQO0FBQ0EsaUJBQWEsQ0FBYjtDQUpKOztBQU9KLFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUM7QUFDL0IsV0FBUSxnQkFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsSUFBZ0MsQ0FBQyxDQUFELENBRFQ7Q0FBbkM7Ozs7Ozs7Ozs7QUFZQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDN0IsUUFBSSxTQUFKLENBRDZCOztBQUc3QixTQUFLLEtBQUwsRUFBWSxVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDdkIsWUFBSSxLQUFLLFFBQUwsRUFBZTtBQUNmLHdCQUFZLEtBQUssUUFBTCxDQUFjLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBZCxLQUFpQyxTQUFqQyxDQURHO1NBQW5CO0tBRFEsQ0FBWixDQUg2Qjs7QUFTN0IsV0FBTyxTQUFQLENBVDZCO0NBQWpDOzs7Ozs7Ozs7OztBQXFCQSxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsUUFBdkMsRUFBaUQsS0FBakQsRUFBd0QsU0FBeEQsRUFBbUU7QUFDL0QsUUFBSSxTQUFKOzs7QUFEK0Qs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LE1BQU0sU0FBTixDQUFELElBQXFCLENBQUMsV0FBRCxFQUFjO0FBQzlELGdDQUFZLFFBQVEsU0FBUixFQUFtQixTQUFuQixFQUE4QixRQUE5QixFQUF3QyxLQUF4QyxDQUFaLENBRDhEO2lCQUFsRTs7QUFJQSx5QkFBUyxTQUFULElBQXNCLFNBQXRCOzs7QUFOa0Msb0JBUzlCLGNBQWMsSUFBZCxFQUFvQjtBQUNwQiw2QkFBUyxNQUFULEdBQWtCLFNBQVMsRUFBVCxDQURFO2lCQUF4QjthQVRRLENBQVosQ0FYK0I7O0FBeUIvQixxQkFBUyxNQUFULEdBQWtCLFNBQVMsT0FBVCxDQXpCYTtBQTBCL0IscUJBQVMsUUFBVCxHQUFvQixLQUFDLENBQU0sU0FBUyxHQUFULENBQU4sSUFBdUIsTUFBTSxTQUFTLEdBQVQsQ0FBN0IsR0FBOEMsSUFBL0MsR0FBc0QsS0FBdEQsQ0ExQlc7O0FBNEIvQixxQkFBUyxHQUFULElBQWdCLFFBQWhCLENBNUIrQjtBQTZCL0Isa0JBQU0sV0FBTixDQUFrQixHQUFsQixFQUF1QixNQUFNLEdBQU4sQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLENBQXZCLEVBQXFELFdBQXJELEVBN0IrQjtTQUFoQixDQUFuQixDQUxnRTs7QUFxQ2hFLGVBQU8sUUFBUCxDQXJDZ0U7S0FBM0Q7Q0F0QmIiLCJmaWxlIjoidmFsdWUtb3BlcmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB2YWx1ZVR5cGVzTWFuYWdlciA9IHJlcXVpcmUoJy4uL3ZhbHVlLXR5cGVzL21hbmFnZXInKSxcbiAgICBjYWxjID0gcmVxdWlyZSgnLi4vaW5jL2NhbGMnKSxcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLFxuICAgIGlzTnVtID0gdXRpbHMuaXNOdW0sXG4gICAgZWFjaCA9IHV0aWxzLmVhY2g7XG5cbmNvbnN0IG51bWVyaWNhbFZhbHVlcyA9IFsnY3VycmVudCcsICd0bycsICdtaW4nLCAnbWF4JywgJ3ZlbG9jaXR5JywgJ2ZyaWN0aW9uJywgJ3NwcmluZycsICdhY2NlbGVyYXRpb24nXSxcbiAgICBudW1OdW1lcmljYWxWYWx1ZXMgPSBudW1lcmljYWxWYWx1ZXMubGVuZ3RoLFxuICAgIGRlZmF1bHRWYWx1ZSA9IHtcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICAgIHNwZWVkOiAwLFxuICAgICAgICBmcmFtZUNoYW5nZTogMFxuICAgIH07XG5cbmZ1bmN0aW9uIGNoZWNrTnVtZXJpY2FsVmFsdWUobmFtZSkge1xuICAgIHJldHVybiAobnVtZXJpY2FsVmFsdWVzLmluZGV4T2YobmFtZSkgPiAtMSk7XG59XG5cbi8qXG4gICAgQ2hlY2sgUm9sZSB0eXBlTWFwcyB0byBzZWUgaWYgdGhpcyB2YWx1ZSBuYW1lIGhhcyBiZWVuIG1hcHBlZFxuICAgIHRvIGEgc3BlY2lmaWMgdmFsdWUgdHlwZVxuXG4gICAgQHBhcmFtIFtzdHJpbmddXG4gICAgQHBhcmFtIFthcnJheV1cbiAgICBAcmV0dXJucyBbc3RyaW5nXTogVmFsdWUgdHlwZVxuKi9cbmZ1bmN0aW9uIGNoZWNrUm9sZXMobmFtZSwgcm9sZXMpIHtcbiAgICB2YXIgdmFsdWVUeXBlO1xuXG4gICAgZWFjaChyb2xlcywgKGtleSwgcm9sZSkgPT4ge1xuICAgICAgICBpZiAocm9sZS5fdHlwZU1hcCkge1xuICAgICAgICAgICAgdmFsdWVUeXBlID0gcm9sZS5fdHlwZU1hcFtyb2xlLm1hcChuYW1lKV0gfHwgdmFsdWVUeXBlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWVUeXBlO1xufVxuXG4vKlxuICAgIENoZWNrIHZhbHVlIGZvciBzcGVjaWFsIHR5cGVcblxuICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgIEBwYXJhbSBbc3RyaW5nXVxuICAgIEByZXR1cm5zIFtzdHJpbmcgfHwgZmFsc2VdXG4qL1xuZnVuY3Rpb24gY2hlY2tWYWx1ZVR5cGUoZXhpc3RpbmdWYWx1ZSwgbmV3VmFsdWUsIHNjb3BlLCB2YWx1ZU5hbWUpIHtcbiAgICB2YXIgdmFsdWVUeXBlO1xuXG4gICAgLy8gQ2hlY2sgZXhpc3RpbmcgdmFsdWUgZm9yIHR5cGUgYWxyZWFkeSBzZXRcbiAgICBpZiAoZXhpc3RpbmdWYWx1ZSAmJiBleGlzdGluZ1ZhbHVlLnR5cGUpIHtcbiAgICAgICAgdmFsdWVUeXBlID0gZXhpc3RpbmdWYWx1ZS50eXBlO1xuICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE9yIGNoZWNrIFJvbGUgX3R5cGVNYXAgcHJvcGVydGllc1xuICAgICAgICBpZiAoc2NvcGUucm9sZXMpIHtcbiAgICAgICAgICAgIHZhbHVlVHlwZSA9IGNoZWNrUm9sZXModmFsdWVOYW1lLCBzY29wZS5yb2xlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbGx5IHJ1biB0ZXN0c1xuICAgICAgICBpZiAoIXZhbHVlVHlwZSAmJiB1dGlscy5pc1N0cmluZyhuZXdWYWx1ZS5jdXJyZW50KSkge1xuICAgICAgICAgICAgdmFsdWVUeXBlID0gdmFsdWVUeXBlc01hbmFnZXIudGVzdChuZXdWYWx1ZS5jdXJyZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVR5cGU7XG59XG5cbi8qXG4gICAgUmVzb2x2ZSBhIHByb3BlcnR5XG5cbiAgICBAcGFyYW0gW3N0cmluZ11cbiAgICBAcGFyYW0gW3N0cmluZyB8fCBmdW5jdGlvbiB8fCBudW1iZXJdXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICAgQHJldHVybnMgW251bWJlcl1cbiovXG5mdW5jdGlvbiByZXNvbHZlKG5hbWUsIHByb3AsIHZhbHVlLCBzY29wZSkge1xuICAgIGxldCBpc051bWVyaWNhbFZhbHVlID0gY2hlY2tOdW1lcmljYWxWYWx1ZShuYW1lKTtcblxuICAgIC8vIElmIGZ1bmN0aW9uLCByZXNvbHZlXG4gICAgaWYgKHV0aWxzLmlzRnVuYyhwcm9wKSAmJiBpc051bWVyaWNhbFZhbHVlKSB7XG4gICAgICAgIHByb3AgPSBwcm9wLmNhbGwoc2NvcGUsIHNjb3BlKTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdHJpbmcsIGNoZWNrIGZvciByZWxhdGl2ZSBudW1iZXJzIGFuZCB1bml0c1xuICAgIGlmICh1dGlscy5pc1N0cmluZyhwcm9wKSkge1xuICAgICAgICAvLyBJZiByZWxhdGl2ZSB2YWx1ZVxuICAgICAgICBpZiAocHJvcC5pbmRleE9mKCc9JykgPiAwKSB7XG4gICAgICAgICAgICBwcm9wID0gY2FsYy5yZWxhdGl2ZVZhbHVlKHZhbHVlLmN1cnJlbnQsIHByb3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdW5pdFxuICAgICAgICBpZiAoaXNOdW1lcmljYWxWYWx1ZSkge1xuICAgICAgICAgICAgc3BsaXRVbml0KHByb3AsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc051bWVyaWNhbFZhbHVlKSB7XG4gICAgICAgIHByb3AgPSBwYXJzZUZsb2F0KHByb3ApO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9wO1xufVxuXG4vKlxuICAgIFNwbGl0IGEgdmFsdWUgaW50byBzdWItdmFsdWVzXG5cbiAgICBAcGFyYW0gW3N0cmluZ11cbiAgICBAcGFyYW0gW29iamVjdF1cbiAgICBAcGFyYW0gW29iamVjdF1cbiAgICBAcGFyYW0gW3ZhbHVlVHlwZUhhbmRsZXJdXG4gICAgQHJldHVybnMgW29iamVjdF1cbiovXG5mdW5jdGlvbiBzcGxpdChuYW1lLCB2YWx1ZSwgc2NvcGUsIHZhbHVlVHlwZUhhbmRsZXIpIHtcbiAgICB2YXIgc3BsaXRWYWx1ZXMgPSB7fSxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBmb3IgKDsgaSA8IG51bU51bWVyaWNhbFZhbHVlczsgaSsrKSB7XG4gICAgICAgIGxldCBwcm9wTmFtZSA9IG51bWVyaWNhbFZhbHVlc1tpXTtcbiAgICAgICAgbGV0IHNwbGl0UHJvcCA9IHt9O1xuXG4gICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZVByb3AgPSB2YWx1ZVtwcm9wTmFtZV07XG5cbiAgICAgICAgICAgIC8vIElmIHdlIG5lZWQgdG8gZmlyc3QgcmVzb2x2ZSB0aGlzLCByZXNvbHZlXG4gICAgICAgICAgICBpZiAodXRpbHMuaXNGdW5jKHZhbHVlUHJvcCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVByb3AgPSB2YWx1ZVByb3AuY2FsbChzY29wZSwgc2NvcGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXV0aWxzLmlzU3RyaW5nKHZhbHVlUHJvcCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3BsaXRQcm9wID0gdmFsdWVUeXBlSGFuZGxlci5zcGxpdCh2YWx1ZVByb3ApO1xuXG4gICAgICAgICAgICAvLyBBc3NpZ24gc3BsaXQgcHJvcGVydGllcyB0byBlYWNoIGNoaWxkIHZhbHVlXG4gICAgICAgICAgICBlYWNoKHNwbGl0UHJvcCwgKGtleSwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdmFsdWUgaWYgbm9uZSBleGlzdHNcbiAgICAgICAgICAgICAgICBzcGxpdFZhbHVlc1trZXldID0gc3BsaXRWYWx1ZXNba2V5XSB8fCB1dGlscy5jb3B5KHZhbHVlVHlwZXNNYW5hZ2VyLmRlZmF1bHRQcm9wcyh2YWx1ZS50eXBlLCBrZXkpKTtcbiAgICAgICAgICAgICAgICBzcGxpdFZhbHVlc1trZXldW3Byb3BOYW1lXSA9IHByb3A7XG5cbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoc3BsaXRQcm9wW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGl0VW5pdChzcGxpdFZhbHVlc1trZXldW3Byb3BOYW1lXSwgc3BsaXRWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3BsaXRWYWx1ZXM7XG59XG5cbi8qXG4gICAgU3BsaXQgdmFsdWUgaW50byBudW1iZXIgYW5kIHVuaXQsIGFuZCBzZXQgdW5pdCB0byB2YWx1ZVxuXG4gICAgQHBhcmFtIFtzdHJpbmddXG4gICAgQHBhcmFtIFtvYmplY3RdXG4qL1xuZnVuY3Rpb24gc3BsaXRVbml0KHByb3BlcnR5LCBob3N0VmFsdWUpIHtcbiAgICBpZiAodXRpbHMuaXNOdW0ocHJvcGVydHkpKSB7IHJldHVybiBwcm9wZXJ0eTsgfVxuICAgIGxldCByZXR1cm5WYWwgPSBwcm9wZXJ0eSxcbiAgICAgICAgeyB2YWx1ZSwgdW5pdCB9ID0gdXRpbHMuc3BsaXRWYWxVbml0KHByb3BlcnR5KTtcblxuICAgIGlmICghaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHJldHVyblZhbCA9IHZhbHVlO1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgaG9zdFZhbHVlLnVuaXQgPSB1bml0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbDtcbn1cblxuLypcbiAgICBQcmVwcm9jZXNzIGluY29taW5nIHZhbHVlcywgc3BsaXR0aW5nIG5vbi1udW1lcmljYWwgdmFsdWVzXG4gICAgaW50byBzdWItdmFsdWVzIGllIGhleFxuXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICAgQHBhcmFtIFtzdHJpbmddXG4qL1xuZnVuY3Rpb24gcHJlcHJvY2VzcyhleGlzdGluZywgaW5jb21pbmcsIHNjb3BlLCBkZWZhdWx0UHJvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB7fTtcblxuICAgIGVhY2goaW5jb21pbmcsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGxldCBleGlzdGluZ1ZhbHVlID0gZXhpc3Rpbmdba2V5XSxcbiAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzT2JqKHZhbHVlKSkge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlW2RlZmF1bHRQcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdmFsdWUgZG9lc24ndCBoYXZlIGEgc3BlY2lhbCB0eXBlLCBjaGVjayBmb3Igb25lXG4gICAgICAgIG5ld1ZhbHVlLnR5cGUgPSBjaGVja1ZhbHVlVHlwZShleGlzdGluZ1ZhbHVlLCBuZXdWYWx1ZSwgc2NvcGUsIGtleSk7XG5cbiAgICAgICAgdmFsdWVzW2tleV0gPSBuZXdWYWx1ZTtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgdHlwZSBwcm9wZXJ0eSwgc3BsaXQvYXNzaWduIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgaWYgKG5ld1ZhbHVlLnR5cGUpIHtcbiAgICAgICAgICAgIGxldCB0eXBlSGFuZGxlciA9IHZhbHVlVHlwZXNNYW5hZ2VyW25ld1ZhbHVlLnR5cGVdO1xuXG4gICAgICAgICAgICAvLyBJZiB2YWx1ZVR5cGUgaGFuZGxlciBoYXMgYSBzcGxpdCBmdW5jdGlvbiwgc3BsaXQgdGhpcyB2YWx1ZVxuICAgICAgICAgICAgaWYgKHR5cGVIYW5kbGVyLnNwbGl0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHNwbGl0VmFsdWVzID0gc3BsaXQoa2V5LCBuZXdWYWx1ZSwgc2NvcGUsIHR5cGVIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZS5jaGlsZHJlbiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZWFjaChzcGxpdFZhbHVlcywgKGNoaWxkTmFtZSwgY2hpbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlYWNoKG5ld1ZhbHVlLCAoa2V5ICx2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90IGdyZWF0IGlzIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2FjdGlvbicgJiYgY2hpbGRWYWx1ZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFZhbHVlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2hpbGRWYWx1ZS5wYXJlbnQgPSBjaGlsZFZhbHVlLm5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkVmFsdWUucHJvcE5hbWUgPSBjaGlsZE5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNoaWxkVmFsdWUudHlwZTtcblxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZS5jaGlsZHJlbltjaGlsZE5hbWVdID0gdmFsdWVzW2tleSArIGNoaWxkTmFtZV0gPSBjaGlsZFZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVIYW5kbGVyLnRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlLnRlbXBsYXRlID0gZXhpc3RpbmdWYWx1ZSA/IGV4aXN0aW5nVmFsdWUudGVtcGxhdGUgOiB0eXBlSGFuZGxlci50ZW1wbGF0ZShuZXdWYWx1ZS5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE9yIGp1c3QgYXNzaWduIGRlZmF1bHQgcHJvcGVydGllcyBmb3IgdGhpcyB2YWx1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNba2V5XSA9IHV0aWxzLm1lcmdlKHZhbHVlVHlwZXNNYW5hZ2VyLmRlZmF1bHRQcm9wcyhuZXdWYWx1ZS50eXBlLCBrZXkpLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLypcbiAgICAgICAgRmxpcCB2YWx1ZSB0YXJnZXQvb3JpZ2luXG4gICAgKi9cbiAgICBmbGlwOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9ICh2YWx1ZS50YXJnZXQgIT09IHVuZGVmaW5lZCkgPyB2YWx1ZS50YXJnZXQgOiB2YWx1ZS5jdXJyZW50O1xuICAgICAgICB2YWx1ZS50YXJnZXQgPSB2YWx1ZS50byA9IHZhbHVlLm9yaWdpbjtcbiAgICAgICAgdmFsdWUub3JpZ2luID0gdGFyZ2V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBNZXJnZSBleGlzdGluZyBhbmQgaW5jb21pbmcgdmFsdWVzLCByZXNvbHZpbmcgcHJvcGVydGllc1xuICAgICAgICBzZXQgYXMgZnVuY3Rpb25zIGFuZCBzcGxpdHRpbmcgbm9uLW51bWVyaWNhbCB2YWx1ZXMgaWUgaGV4XG5cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICAgICBAcGFyYW0gW29iamVjdF1cbiAgICAgICAgQHBhcmFtIFtzdHJpbmddIChvcHRpb25hbClcbiAgICAgICAgQHBhcmFtIFtvYmplY3RdXG4gICAgICAgIEByZXR1cm5zIFtvYmplY3RdOiBOZXcgdmFsdWVzIG9iamVjdFxuICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24gKGV4aXN0aW5nLCBpbmNvbWluZywgaW5oZXJpdCwgZGVmYXVsdFByb3AsIHNjb3BlKSB7XG4gICAgICAgIGV4aXN0aW5nID0gZXhpc3RpbmcgfHwge307XG4gICAgICAgIGRlZmF1bHRQcm9wID0gZGVmYXVsdFByb3AgfHwgJ2N1cnJlbnQnO1xuICAgICAgICBsZXQgcHJlcHJvY2Vzc2VkID0gcHJlcHJvY2VzcyhleGlzdGluZywgaW5jb21pbmcsIHNjb3BlLCBkZWZhdWx0UHJvcCk7XG5cbiAgICAgICAgZWFjaChwcmVwcm9jZXNzZWQsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBleGlzdGluZ1trZXldIHx8IHV0aWxzLmNvcHkoZGVmYXVsdFZhbHVlKSxcbiAgICAgICAgICAgICAgICBoYXNDaGlsZHJlbiA9ICh2YWx1ZS5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0QWN0aW9uVmFsdWUgPSBpbmhlcml0LmFjdGlvbiA/IGluaGVyaXQuYWN0aW9uLmdldERlZmF1bHRWYWx1ZSgpIDoge307XG5cbiAgICAgICAgICAgIHZhbHVlLmFjdGlvbiA9IGluaGVyaXQuYWN0aW9uO1xuXG4gICAgICAgICAgICBlYWNoKGRlZmF1bHRBY3Rpb25WYWx1ZSwgKHByb3BOYW1lLCBkZWZhdWx0QWN0aW9uUHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlW3Byb3BOYW1lXSA9IChpbmhlcml0Lmhhc093blByb3BlcnR5KHByb3BOYW1lKSAmJiAhdmFsdWUuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSA/IGluaGVyaXRbcHJvcE5hbWVdIDogZGVmYXVsdEFjdGlvblByb3A7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWFjaCh2YWx1ZSwgKHZhbHVlTmFtZSwgdmFsdWVQcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcHJvcGVydHkgaXMgbm90IHVuZGVmaW5lZCBvciBhIG51bWJlciwgcmVzb2x2ZVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVByb3AgIT09IHVuZGVmaW5lZCAmJiAhaXNOdW0odmFsdWVQcm9wKSAmJiAhaGFzQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVQcm9wID0gcmVzb2x2ZSh2YWx1ZU5hbWUsIHZhbHVlUHJvcCwgbmV3VmFsdWUsIHNjb3BlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXdWYWx1ZVt2YWx1ZU5hbWVdID0gdmFsdWVQcm9wO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGludGVybmFsIHRhcmdldCBpZiB0aGlzIHByb3BlcnR5IGlzICd0bydcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVOYW1lID09PSAndG8nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlLnRhcmdldCA9IG5ld1ZhbHVlLnRvO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBuZXdWYWx1ZS5vcmlnaW4gPSBuZXdWYWx1ZS5jdXJyZW50O1xuICAgICAgICAgICAgbmV3VmFsdWUuaGFzUmFuZ2UgPSAoaXNOdW0obmV3VmFsdWUubWluKSB8fCBpc051bShuZXdWYWx1ZS5tYXgpKSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgICAgZXhpc3Rpbmdba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgc2NvcGUudXBkYXRlT3JkZXIoa2V5LCB1dGlscy5oYXMobmV3VmFsdWUsICd3YXRjaCcpLCBoYXNDaGlsZHJlbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICB9XG59OyJdfQ==

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvY2FsYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFlBQVIsQ0FBUjtJQUVBLFlBQVk7QUFDUixPQUFHLENBQUg7QUFDQSxPQUFHLENBQUg7Q0FGSjtJQUtBLE9BQU87Ozs7Ozs7Ozs7OztBQVlILFdBQU8sVUFBQyxDQUFEO1lBQUksMERBQUk7ZUFBYyxLQUFLLGVBQUwsQ0FBcUIsRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFGLEVBQUssRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFGO0tBQTVEOzs7Ozs7Ozs7Ozs7QUFZUCxxQkFBaUIsVUFBQyxDQUFELEVBQUksQ0FBSjtlQUFVLEtBQUssZ0JBQUwsQ0FBc0IsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBdEI7S0FBVjs7Ozs7Ozs7QUFRakIsc0JBQWtCO2VBQVcsVUFBVSxLQUFLLEVBQUwsR0FBVSxHQUFwQjtLQUFYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CbEIsWUFBUSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sUUFBUDtlQUFvQixJQUFLLENBQUMsSUFBSSxDQUFKLENBQUQsR0FBVSxRQUFWO0tBQXpCOzs7Ozs7Ozs7Ozs7QUFZUixjQUFVLFVBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxNQUFNLEtBQU4sQ0FBWSxDQUFaLElBQWlCLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFqQixHQUF5QyxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBekM7S0FBVjs7Ozs7Ozs7Ozs7QUFXVixnQkFBWSxVQUFDLENBQUQ7WUFBSSwwREFBSTtlQUFNLEtBQUssR0FBTCxDQUFTLElBQUksQ0FBSjtLQUF2Qjs7Ozs7Ozs7Ozs7O0FBWVosZ0JBQVksVUFBQyxDQUFEO1lBQUksMERBQUk7ZUFBYyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxHQUFMLENBQVMsRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFGLENBQS9CLEVBQXFDLEtBQUssR0FBTCxDQUFTLEVBQUUsQ0FBRixHQUFNLEVBQUUsQ0FBRixDQUFwRDtLQUF0Qjs7Ozs7Ozs7Ozs7QUFXWixnQkFBWSxVQUFDLENBQUQsRUFBSSxDQUFKO2VBQVUsS0FBSyxJQUFMLENBQVUsQ0FBQyxHQUFJLENBQUosR0FBVSxJQUFJLENBQUo7S0FBL0I7Ozs7Ozs7Ozs7O0FBV1osWUFBUSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVU7QUFDZCxZQUFJLFNBQVMsRUFBVCxDQURVOztBQUdkLGNBQU0sSUFBTixDQUFXLENBQVgsRUFBYyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQzFCLG1CQUFPLEdBQVAsSUFBYyxFQUFFLGNBQUYsQ0FBaUIsR0FBakIsSUFBd0IsUUFBUSxFQUFFLEdBQUYsQ0FBUixHQUFpQixDQUF6QyxDQURZO1NBQWhCLENBQWQsQ0FIYzs7QUFPZCxZQUFJLE1BQU0sS0FBTixDQUFZLE9BQU8sQ0FBUCxDQUFaLElBQXlCLE1BQU0sS0FBTixDQUFZLE9BQU8sQ0FBUCxDQUFyQyxFQUFnRDtBQUNoRCxtQkFBTyxLQUFQLEdBQWUsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZixDQURnRDtBQUVoRCxtQkFBTyxRQUFQLEdBQWtCLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFsQixDQUZnRDtTQUFwRDs7QUFLQSxlQUFPLE1BQVAsQ0FaYztLQUFWOzs7Ozs7Ozs7O0FBdUJSLCtCQUEyQixVQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFFBQWhCLEVBQTZCO0FBQ3BELGdCQUFRLEtBQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBUixDQURvRDs7QUFHcEQsZUFBTztBQUNILGVBQUcsV0FBVyxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQVgsR0FBNkIsT0FBTyxDQUFQO0FBQ2hDLGVBQUcsV0FBVyxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQVgsR0FBNkIsT0FBTyxDQUFQO1NBRnBDLENBSG9EO0tBQTdCOzs7Ozs7Ozs7Ozs7OztBQXFCM0IsY0FBVSxVQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsRUFBZDtlQUFxQixDQUFDLFFBQVEsSUFBUixDQUFELElBQWtCLEtBQUssSUFBTCxDQUFsQjtLQUFyQjs7Ozs7Ozs7QUFRVixzQkFBa0I7ZUFBVyxVQUFVLEdBQVYsR0FBZ0IsS0FBSyxFQUFMO0tBQTNCOzs7Ozs7Ozs7QUFTbEIsWUFBUTtZQUFDLDREQUFNO1lBQUcsNERBQU07ZUFBTSxLQUFLLE1BQUwsTUFBaUIsTUFBTSxHQUFOLENBQWpCLEdBQThCLEdBQTlCO0tBQXRCOzs7Ozs7Ozs7Ozs7QUFZUixtQkFBZSxVQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWtCO0FBQ3pCLHVCQUFXLE9BQVgsQ0FEeUI7QUFFekIsdUJBQVcsSUFBSSxLQUFKLENBQVUsR0FBVixDQUFYLENBRnlCO0FBR3pCLHVCQUFXLFNBQVMsQ0FBVCxDQUFYLENBSHlCOztrQ0FJUCxNQUFNLFlBQU4sQ0FBbUIsU0FBUyxDQUFULENBQW5CLEVBSk87O1lBSXZCLGdDQUp1QjtZQUlqQixrQ0FKaUI7O0FBTTdCLGdCQUFRLFdBQVcsS0FBWCxDQUFSLENBTjZCOztBQVE3QixnQkFBUSxRQUFSO0FBQ0ksaUJBQUssR0FBTDtBQUNJLDRCQUFZLEtBQVosQ0FESjtBQUVJLHNCQUZKO0FBREosaUJBSVMsR0FBTDtBQUNJLDRCQUFZLEtBQVosQ0FESjtBQUVJLHNCQUZKO0FBSkosaUJBT1MsR0FBTDtBQUNJLDRCQUFZLEtBQVosQ0FESjtBQUVJLHNCQUZKO0FBUEosaUJBVVMsR0FBTDtBQUNJLDRCQUFZLEtBQVosQ0FESjtBQUVJLHNCQUZKO0FBVkosU0FSNkI7O0FBdUI3QixZQUFJLElBQUosRUFBVTtBQUNOLHdCQUFZLElBQVosQ0FETTtTQUFWOztBQUlBLGVBQU8sUUFBUCxDQTNCNkI7S0FBbEI7Ozs7Ozs7Ozs7OztBQXdDZixnQkFBWSxVQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsR0FBYixFQUFxQjtBQUM3QixZQUFJLE1BQU0sS0FBTixDQUFZLEdBQVosQ0FBSixFQUFzQjtBQUNsQixvQkFBUSxLQUFLLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBQVIsQ0FEa0I7U0FBdEI7O0FBSUEsWUFBSSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQUosRUFBc0I7QUFDbEIsb0JBQVEsS0FBSyxHQUFMLENBQVMsS0FBVCxFQUFnQixHQUFoQixDQUFSLENBRGtCO1NBQXRCOztBQUlBLGVBQU8sS0FBUCxDQVQ2QjtLQUFyQjs7Ozs7Ozs7O0FBb0JaLFlBQVEsVUFBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixRQUFyQjtZQUErQixrRUFBWTtlQUFNLEtBQUssU0FBTCxDQUFlLFdBQVksWUFBWSxXQUFXLFFBQVgsQ0FBWixHQUFtQyxLQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLFFBQXBCLENBQW5DO0tBQTVFOzs7Ozs7OztBQVFSLG1CQUFlLFVBQUMsR0FBRCxFQUFNLGFBQU47ZUFBd0IsS0FBQyxDQUFNLEtBQU4sQ0FBWSxHQUFaLENBQUQsR0FBcUIsT0FBTyxPQUFPLGFBQVAsQ0FBUCxHQUErQixDQUFwRDtLQUF4Qjs7Ozs7Ozs7QUFRZixvQkFBZ0IsVUFBQyxRQUFELEVBQVcsYUFBWDtlQUE2QixZQUFZLE9BQU8sYUFBUCxDQUFaO0tBQTdCOzs7OztBQUtoQixlQUFXLFVBQUMsR0FBRCxFQUF3QjtZQUFsQixrRUFBWSxpQkFBTTs7QUFDL0IsNkJBQVksSUFBTSxVQUFsQixDQUQrQjtBQUUvQixlQUFPLEtBQUssS0FBTCxDQUFXLE1BQU0sU0FBTixDQUFYLEdBQThCLFNBQTlCLENBRndCO0tBQXhCOzs7Ozs7Ozs7Ozs7O0FBZ0JYLFdBQU8sVUFBQyxRQUFELEVBQVcsSUFBWCxFQUFpQixFQUFqQjtlQUF3QixDQUFHLFFBQUYsR0FBYSxJQUFiLEdBQXNCLFdBQVcsRUFBWCxHQUFpQixJQUF4QztLQUF4Qjs7Ozs7Ozs7Ozs7Ozs7QUFlUCxnQkFBWSxVQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLEVBQWpCLEVBQXFCLE1BQXJCO2VBQWdDLEtBQUssS0FBTCxDQUFXLE9BQU8sUUFBUCxDQUFYLEVBQTZCLElBQTdCLEVBQW1DLEVBQW5DO0tBQWhDO0NBdFNoQjs7QUF5U0osT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImNhbGMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyksXG5cbiAgICB6ZXJvUG9pbnQgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICB9LFxuXG4gICAgY2FsYyA9IHtcbiAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBBbmdsZSBiZXR3ZWVuIHBvaW50c1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBUcmFuc2xhdGVzIHRoZSBoeXBvdGhldGljYWwgbGluZSBzbyB0aGF0IHRoZSAnZnJvbScgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIGFyZSBhdCAwLDAsIHRoZW4gcmV0dXJuIHRoZSBhbmdsZSB1c2luZyAuYW5nbGVGcm9tQ2VudGVyKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBYIGFuZCBZIGNvb3JkaW5hdGVzIG9mIGZyb20gcG9pbnRcbiAgICAgICAgICAgIEBwYXJhbSBbb2JqZWN0XTogWCBhbmQgWSBjb3JkaW5hdGVzIG9mIHRvIHBvaW50XG4gICAgICAgICAgICBAcmV0dXJuIFtyYWRpYW5dOiBBbmdsZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzIGluIHJhZGlhbnNcbiAgICAgICAgKi9cbiAgICAgICAgYW5nbGU6IChhLCBiID0gemVyb1BvaW50KSA9PiBjYWxjLmFuZ2xlRnJvbUNlbnRlcihhLnggLSBiLngsIGEueSAtIGIueSksXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIEFuZ2xlIGZyb20gY2VudGVyXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJldHVybnMgdGhlIGN1cnJlbnQgYW5nbGUsIGluIHJhZGlhbnMsIG9mIGEgZGVmaW5lZCBwb2ludFxuICAgICAgICAgICAgZnJvbSBhIGNlbnRlciAoYXNzdW1lZCAwLDApXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogWCBjb29yZGluYXRlIG9mIHNlY29uZCBwb2ludFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBZIGNvb3JkaW5hdGUgb2Ygc2Vjb25kIHBvaW50XG4gICAgICAgICAgICBAcmV0dXJuIFtyYWRpYW5dOiBBbmdsZSBiZXR3ZWVuIDAsIDAgYW5kIHBvaW50IGluIHJhZGlhbnNcbiAgICAgICAgKi9cbiAgICAgICAgYW5nbGVGcm9tQ2VudGVyOiAoeCwgeSkgPT4gY2FsYy5yYWRpYW5zVG9EZWdyZWVzKE1hdGguYXRhbjIoeSwgeCkpLFxuICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogVmFsdWUgaW4gZGVncmVlc1xuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgaW4gcmFkaWFuc1xuICAgICAgICAqL1xuICAgICAgICBkZWdyZWVzVG9SYWRpYW5zOiBkZWdyZWVzID0+IGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwLFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBEaWxhdGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ2hhbmdlIHRoZSBwcm9ncmVzc2lvbiBiZXR3ZWVuIGEgYW5kIGIgYWNjb3JkaW5nIHRvIGRpbGF0aW9uLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTbyBkaWxhdGlvbiA9IDAuNSB3b3VsZCBjaGFuZ2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYSAtLS0tLS0tLS0gYlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0b1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhIC0tLS0gYlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFByZXZpb3VzIHZhbHVlXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IEN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogRGlsYXRlIHByb2dyZXNzIGJ5IHhcbiAgICAgICAgICAgIEByZXR1cm4gW251bWJlcl06IFByZXZpb3VzIHZhbHVlIHBsdXMgdGhlIGRpbGF0ZWQgZGlmZmVyZW5jZVxuICAgICAgICAqL1xuICAgICAgICBkaWxhdGU6IChhLCBiLCBkaWxhdGlvbikgPT4gYSArICgoYiAtIGEpICogZGlsYXRpb24pLFxuICAgICAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBEaXN0YW5jZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBSZXR1cm5zIHRoZSBkaXN0YW5jZSBiZXR3ZWVuICgwLDApIGFuZCBwb2ludEEsIHVubGVzcyBwb2ludEJcbiAgICAgICAgICAgIGlzIHByb3ZpZGVkLCB0aGVuIHdlIHJldHVybiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbSBbb2JqZWN0L251bWJlcl06IHggYW5kIHkgb3IganVzdCB4IG9mIHBvaW50IEFcbiAgICAgICAgICAgIEBwYXJhbSBbb2JqZWN0L251bWJlcl06IChvcHRpb25hbCk6IHggYW5kIHkgb3IganVzdCB4IG9mIHBvaW50IEJcbiAgICAgICAgICAgIEByZXR1cm4gW251bWJlcl06IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzXG4gICAgICAgICovXG4gICAgICAgIGRpc3RhbmNlOiAoYSwgYikgPT4gdXRpbHMuaXNOdW0oYSkgPyBjYWxjLmRpc3RhbmNlMUQoYSwgYikgOiBjYWxjLmRpc3RhbmNlMkQoYSwgYiksXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIERpc3RhbmNlIDFEXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gcG9pbnQgQSBhbmQgcG9pbnQgQlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFBvaW50IEFcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogKG9wdGlvbmFsKTogUG9pbnQgQlxuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHNcbiAgICAgICAgKi9cbiAgICAgICAgZGlzdGFuY2UxRDogKGEsIGIgPSAwKSA9PiBNYXRoLmFicyhhIC0gYiksXG4gICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIERpc3RhbmNlIDJEXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gKDAsMCkgYW5kIHBvaW50IEEsIHVubGVzcyBwb2ludCBCXG4gICAgICAgICAgICBpcyBwcm92aWRlZCwgdGhlbiB3ZSByZXR1cm4gdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW29iamVjdF06IHggYW5kIHkgb2YgcG9pbnQgQVxuICAgICAgICAgICAgQHBhcmFtIFtvYmplY3RdOiAob3B0aW9uYWwpOiB4IGFuZCB5IG9mIHBvaW50IEJcbiAgICAgICAgICAgIEByZXR1cm4gW251bWJlcl06IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzXG4gICAgICAgICovXG4gICAgICAgIGRpc3RhbmNlMkQ6IChhLCBiID0gemVyb1BvaW50KSA9PiBjYWxjLmh5cG90ZW51c2UoTWF0aC5hYnMoYS54IC0gYi54KSwgTWF0aC5hYnMoYS55IC0gYi55KSksXG4gICAgICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIEh5cG90ZW51c2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgUmV0dXJucyB0aGUgaHlwb3RlbnVzZSwgc2lkZSBDLCBnaXZlbiB0aGUgbGVuZ3RocyBvZiBzaWRlcyBBIGFuZCBCLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IExlbmd0aCBvZiBBXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IExlbmd0aCBvZiBCXG4gICAgICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBMZW5ndGggb2YgQ1xuICAgICAgICAqL1xuICAgICAgICBoeXBvdGVudXNlOiAoYSwgYikgPT4gTWF0aC5zcXJ0KChhICogYSkgKyAoYiAqIGIpKSxcbiAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBPZmZzZXQgYmV0d2VlbiB0d28gaW5wdXRzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENhbGN1bGF0ZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHR3byBkaWZmZXJlbnQgaW5wdXRzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbSBbUG9pbnRdOiBGaXJzdCBpbnB1dFxuICAgICAgICAgICAgQHBhcmFtIFtQb2ludF06IFNlY29uZCBpbnB1dFxuICAgICAgICAgICAgQHJldHVybiBbT2Zmc2V0XTogRGlzdGFuY2UgbWV0cmljcyBiZXR3ZWVuIHR3byBwb2ludHNcbiAgICAgICAgKi9cbiAgICAgICAgb2Zmc2V0OiAoYSwgYikgPT4ge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHt9O1xuXG4gICAgICAgICAgICB1dGlscy5lYWNoKGIsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0W2tleV0gPSBhLmhhc093blByb3BlcnR5KGtleSkgPyB2YWx1ZSAtIGFba2V5XSA6IDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHV0aWxzLmlzTnVtKG9mZnNldC54KSAmJiB1dGlscy5pc051bShvZmZzZXQueSkpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQuYW5nbGUgPSBjYWxjLmFuZ2xlKGEsIGIpO1xuICAgICAgICAgICAgICAgIG9mZnNldC5kaXN0YW5jZSA9IGNhbGMuZGlzdGFuY2UyRChhLCBiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBQb2ludCBmcm9tIGFuZ2xlIGFuZCBkaXN0YW5jZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW29iamVjdF06IDJEIHBvaW50IG9mIG9yaWdpblxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBBbmdsZSBmcm9tIG9yaWdpblxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBEaXN0YW5jZSBmcm9tIG9yaWdpblxuICAgICAgICAgICAgQHJldHVybiBbb2JqZWN0XTogQ2FsY3VsYXRlZCAyRCBwb2ludFxuICAgICAgICAqL1xuICAgICAgICBwb2ludEZyb21BbmdsZUFuZERpc3RhbmNlOiAob3JpZ2luLCBhbmdsZSwgZGlzdGFuY2UpID0+IHtcbiAgICAgICAgICAgIGFuZ2xlID0gY2FsYy5kZWdyZWVzVG9SYWRpYW5zKGFuZ2xlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiBkaXN0YW5jZSAqIE1hdGguY29zKGFuZ2xlKSArIG9yaWdpbi54LFxuICAgICAgICAgICAgICAgIHk6IGRpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUpICsgb3JpZ2luLnlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBQcm9ncmVzcyB3aXRoaW4gZ2l2ZW4gcmFuZ2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgR2l2ZW4gYSBsb3dlciBsaW1pdCBhbmQgYW4gdXBwZXIgbGltaXQsIHdlIHJldHVybiB0aGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgIChleHByZXNzZWQgYXMgYSBudW1iZXIgMC0xKSByZXByZXNlbnRlZCBieSB0aGUgZ2l2ZW4gdmFsdWUsIGFuZFxuICAgICAgICAgICAgbGltaXQgdGhhdCBwcm9ncmVzcyB0byB3aXRoaW4gMC0xLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFZhbHVlIHRvIGZpbmQgcHJvZ3Jlc3Mgd2l0aGluIGdpdmVuIHJhbmdlXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IExvd2VyIGxpbWl0IFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBVcHBlciBsaW1pdFxuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogUHJvZ3Jlc3Mgb2YgdmFsdWUgd2l0aGluIHJhbmdlIGFzIGV4cHJlc3NlZCAwLTFcbiAgICAgICAgKi9cbiAgICAgICAgcHJvZ3Jlc3M6ICh2YWx1ZSwgZnJvbSwgdG8pID0+ICh2YWx1ZSAtIGZyb20pIC8gKHRvIC0gZnJvbSksXG4gICAgICAgIFxuICAgICAgICAvKlxuICAgICAgICAgICAgQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBWYWx1ZSBpbiByYWRpYW5zXG4gICAgICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBWYWx1ZSBpbiBkZWdyZWVzXG4gICAgICAgICovXG4gICAgICAgIHJhZGlhbnNUb0RlZ3JlZXM6IHJhZGlhbnMgPT4gcmFkaWFucyAqIDE4MCAvIE1hdGguUEksXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIFJldHVybiByYW5kb20gbnVtYmVyIGJldHdlZW4gcmFuZ2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdIChvcHRpb25hbCk6IE91dHB1dCBtaW5pbXVtXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl0gKG9wdGlvbmFsKTogT3V0cHV0IG1heGltdW1cbiAgICAgICAgICAgIEByZXR1cm4gW251bWJlcl06IFJhbmRvbSBudW1iZXIgd2l0aGluIHJhbmdlLCBvciAwIGFuZCAxIGlmIG5vbmUgcHJvdmlkZWRcbiAgICAgICAgKi9cbiAgICAgICAgcmFuZG9tOiAobWluID0gMCwgbWF4ID0gMSkgPT4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluLFxuICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIENhbGN1bGF0ZSByZWxhdGl2ZSB2YWx1ZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUYWtlcyB0aGUgb3BlcmF0b3IgYW5kIHZhbHVlIGZyb20gYSBzdHJpbmcsIGllIFwiKz01XCIsIGFuZCBhcHBsaWVzXG4gICAgICAgICAgICB0byB0aGUgY3VycmVudCB2YWx1ZSB0byByZXNvbHZlIGEgbmV3IHRhcmdldC5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBDdXJyZW50IHZhbHVlXG4gICAgICAgICAgICBAcGFyYW0gW3N0cmluZ106IFJlbGF0aXZlIHZhbHVlXG4gICAgICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBOZXcgdmFsdWVcbiAgICAgICAgKi9cbiAgICAgICAgcmVsYXRpdmVWYWx1ZTogKGN1cnJlbnQsIHJlbCkgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gY3VycmVudCxcbiAgICAgICAgICAgICAgICBlcXVhdGlvbiA9IHJlbC5zcGxpdCgnPScpLFxuICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gZXF1YXRpb25bMF0sXG4gICAgICAgICAgICAgICAgeyB1bml0LCB2YWx1ZSB9ID0gdXRpbHMuc3BsaXRWYWxVbml0KGVxdWF0aW9uWzFdKTtcblxuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlIC09IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgKj0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy8nOlxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSAvPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1bml0KSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgKz0gdW5pdDtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgICAgfSxcbiAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIFJlc3RyaWN0IHZhbHVlIHRvIHJhbmdlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJldHVybiB2YWx1ZSB3aXRoaW4gdGhlIHJhbmdlIG9mIGxvd2VyTGltaXQgYW5kIHVwcGVyTGltaXRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBWYWx1ZSB0byBrZWVwIHdpdGhpbiByYW5nZVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBMb3dlciBsaW1pdCBvZiByYW5nZVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBVcHBlciBsaW1pdCBvZiByYW5nZVxuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgYXMgbGltaXRlZCB3aXRoaW4gZ2l2ZW4gcmFuZ2VcbiAgICAgICAgKi9cbiAgICAgICAgcmVzdHJpY3RlZDogKHZhbHVlLCBtaW4sIG1heCkgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWxzLmlzTnVtKG1pbikpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGgubWF4KHZhbHVlLCBtaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXRpbHMuaXNOdW0obWF4KSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5taW4odmFsdWUsIG1heCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgRnJhbWVyYXRlLWluZGVwZW5kZW50IHNtb290aGluZ1xuXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IE5ldyB2YWx1ZVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBPbGQgdmFsdWVcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogRnJhbWUgZHVyYXRpb25cbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXSAob3B0aW9uYWwpOiBTbW9vdGhpbmcgKDAgaXMgbm9uZSlcbiAgICAgICAgKi9cbiAgICAgICAgc21vb3RoOiAobmV3VmFsdWUsIG9sZFZhbHVlLCBkdXJhdGlvbiwgc21vb3RoaW5nID0gMCkgPT4gY2FsYy50b0RlY2ltYWwob2xkVmFsdWUgKyAoZHVyYXRpb24gKiAobmV3VmFsdWUgLSBvbGRWYWx1ZSkgLyBNYXRoLm1heChzbW9vdGhpbmcsIGR1cmF0aW9uKSkpLFxuICAgIFxuICAgICAgICAvKlxuICAgICAgICAgICAgQ29udmVydCB4IHBlciBzZWNvbmQgdG8gcGVyIGZyYW1lIHZlbG9jaXR5IGJhc2VkIG9uIGZwc1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFVuaXQgcGVyIHNlY29uZFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBGcmFtZSBkdXJhdGlvbiBpbiBtc1xuICAgICAgICAqL1xuICAgICAgICBzcGVlZFBlckZyYW1lOiAoeHBzLCBmcmFtZUR1cmF0aW9uKSA9PiAodXRpbHMuaXNOdW0oeHBzKSkgPyB4cHMgLyAoMTAwMCAvIGZyYW1lRHVyYXRpb24pIDogMCxcbiAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIENvbnZlcnQgdmVsb2NpdHkgaW50byB2ZWxpY2l0eSBwZXIgc2Vjb25kXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogVW5pdCBwZXIgZnJhbWVcbiAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogRnJhbWUgZHVyYXRpb24gaW4gbXNcbiAgICAgICAgKi9cbiAgICAgICAgc3BlZWRQZXJTZWNvbmQ6ICh2ZWxvY2l0eSwgZnJhbWVEdXJhdGlvbikgPT4gdmVsb2NpdHkgKiAoMTAwMCAvIGZyYW1lRHVyYXRpb24pLFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBDb252ZXJ0IG51bWJlciB0byBkZWNpbWFsIHBsYWNlXG4gICAgICAgICovXG4gICAgICAgIHRvRGVjaW1hbDogKG51bSwgcHJlY2lzaW9uID0gMikgPT4ge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gMTAgKiogcHJlY2lzaW9uO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtICogcHJlY2lzaW9uKSAvIHByZWNpc2lvbjtcbiAgICAgICAgfSxcbiAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBWYWx1ZSBpbiByYW5nZSBmcm9tIHByb2dyZXNzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHZhbHVlIHdpdGhpblxuICAgICAgICAgICAgdGhhdCByYW5nZSBhcyBleHByZXNzZWQgYnkgcHJvZ3Jlc3MgKGEgbnVtYmVyIGZyb20gMC0xKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFRoZSBwcm9ncmVzcyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBsaW1pdHMgZXhwcmVzc2VkIDAtMVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBMb3dlciBsaW1pdCBvZiByYW5nZVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBVcHBlciBsaW1pdCBvZiByYW5nZVxuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgYXMgY2FsY3VsYXRlZCBmcm9tIHByb2dyZXNzIHdpdGhpbiByYW5nZSAobm90IGxpbWl0ZWQgd2l0aGluIHJhbmdlKVxuICAgICAgICAqL1xuICAgICAgICB2YWx1ZTogKHByb2dyZXNzLCBmcm9tLCB0bykgPT4gKC0gcHJvZ3Jlc3MgKiBmcm9tKSArIChwcm9ncmVzcyAqIHRvKSArIGZyb20sXG4gICAgXG4gICAgXG4gICAgICAgIC8qXG4gICAgICAgICAgICBFYXNlZCB2YWx1ZSBpbiByYW5nZSBmcm9tIHByb2dyZXNzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHZhbHVlIHdpdGhpblxuICAgICAgICAgICAgdGhhdCByYW5nZSBhcyBleHByZXNzZWQgYnkgcHJvZ3Jlc3MgKGEgbnVtYmVyIGZyb20gMC0xKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcGFyYW0gW251bWJlcl06IFRoZSBwcm9ncmVzcyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBsaW1pdHMgZXhwcmVzc2VkIDAtMVxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBMb3dlciBsaW1pdCBvZiByYW5nZSwgb3IgdXBwZXIgaWYgbGltaXQyIG5vdCBwcm92aWRlZFxuICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBVcHBlciBsaW1pdCBvZiByYW5nZVxuICAgICAgICAgICAgQHBhcmFtIFtmdW5jdGlvbl06IEVhc2luZyB0byBhcHBseSB0byB2YWx1ZVxuICAgICAgICAgICAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgYXMgY2FsY3VsYXRlZCBmcm9tIHByb2dyZXNzIHdpdGhpbiByYW5nZSAobm90IGxpbWl0ZWQgd2l0aGluIHJhbmdlKVxuICAgICAgICAqL1xuICAgICAgICB2YWx1ZUVhc2VkOiAocHJvZ3Jlc3MsIGZyb20sIHRvLCBlYXNpbmcpID0+IGNhbGMudmFsdWUoZWFzaW5nKHByb2dyZXNzKSwgZnJvbSwgdG8pXG4gICAgfTtcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gY2FsYzsiXX0=

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var calc = __webpack_require__(13);
	var utils = __webpack_require__(4);
	var Action = __webpack_require__(15);
	var defaultAction = new Action();
	var Watch = __webpack_require__(17);
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rvci91cGRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLE9BQU8sUUFBUSxhQUFSLENBQVA7QUFDTixJQUFNLFFBQVEsUUFBUSxjQUFSLENBQVI7QUFDTixJQUFNLFNBQVMsUUFBUSxtQkFBUixDQUFUO0FBQ04sSUFBTSxnQkFBZ0IsSUFBSSxNQUFKLEVBQWhCO0FBQ04sSUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBUjtBQUNOLElBQU0sVUFBVSxJQUFJLEtBQUosRUFBVjs7QUFFTixPQUFPLE9BQVAsR0FBaUIsVUFBQyxLQUFELEVBQVEsVUFBUixFQUFvQixhQUFwQixFQUFzQztBQUNuRCxRQUFNLGtCQUFrQixNQUFNLFlBQU4sQ0FBbUIsTUFBbkIsQ0FEMkI7QUFFbkQsUUFBSSxRQUFRLE1BQU0sS0FBTixDQUZ1Qzs7QUFJbkQsVUFBTSxVQUFOLEdBQW1CLEtBQW5CLENBSm1EOztBQU1uRCxTQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxlQUFKLEVBQXFCLEdBQXJDLEVBQTBDOztBQUV0QyxZQUFJLE1BQU0sTUFBTSxZQUFOLENBQW1CLENBQW5CLENBQU4sQ0FGa0M7QUFHdEMsWUFBSSxRQUFRLE1BQU0sTUFBTixDQUFhLEdBQWIsQ0FBUixDQUhrQztBQUl0QyxZQUFJLFNBQVMsQ0FBRSxNQUFNLE1BQU4sSUFBZ0IsTUFBTSxNQUFOLElBQWdCLENBQUMsTUFBTSxNQUFOLENBQWEsUUFBYixHQUF5QixhQUE1RCxHQUE0RSxNQUFNLE1BQU47OztBQUpuRCxZQU9sQyxPQUFPLFlBQVAsSUFBdUIsT0FBTyxVQUFQLEtBQXNCLFVBQXRCLEVBQWtDO0FBQ3pELG1CQUFPLFlBQVAsQ0FBb0IsS0FBcEIsRUFBMkIsYUFBM0IsRUFBMEMsVUFBMUMsRUFEeUQ7QUFFekQsbUJBQU8sVUFBUCxHQUFvQixVQUFwQixDQUZ5RDtTQUE3RDs7O0FBUHNDLFlBYWxDLGVBQWUsTUFBTSxHQUFOLENBQVUsS0FBVixFQUFpQixPQUFqQixJQUE0QixRQUFRLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBNUIsR0FBNEQsT0FBTyxPQUFQLENBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixHQUE3QixFQUFrQyxhQUFsQyxDQUE1RDs7O0FBYm1CLFlBZ0JsQyxNQUFNLFNBQU4sRUFBaUI7QUFDakIsMkJBQWUsTUFBTSxTQUFOLENBQWdCLFlBQWhCLEVBQThCLEdBQTlCLEVBQW1DLEtBQW5DLENBQWYsQ0FEaUI7U0FBckI7OztBQWhCc0MsWUFxQmxDLE9BQU8sS0FBUCxJQUFnQixNQUFNLFFBQU4sRUFBZ0I7QUFDaEMsMkJBQWUsT0FBTyxLQUFQLENBQWEsWUFBYixFQUEyQixLQUEzQixDQUFmLENBRGdDO1NBQXBDOzs7QUFyQnNDLFlBMEJsQyxNQUFNLE1BQU4sRUFBYztBQUNkLDJCQUFlLEtBQUssTUFBTCxDQUFZLFlBQVosRUFBMEIsTUFBTSxPQUFOLEVBQWUsYUFBekMsRUFBd0QsTUFBTSxNQUFOLENBQXZFLENBRGM7U0FBbEI7OztBQTFCc0MsWUErQmxDLE1BQU0sS0FBTixFQUFhO0FBQ2IsMkJBQWUsS0FBSyxLQUFMLENBQVcsWUFBWCxDQUFmLENBRGE7U0FBakI7OztBQS9Cc0MsYUFvQ3RDLENBQU0sV0FBTixHQUFvQixlQUFlLE1BQU0sT0FBTjs7O0FBcENHLFlBdUNsQyxDQUFDLE9BQU8sa0JBQVAsRUFBMkI7QUFDNUIsa0JBQU0sUUFBTixHQUFpQixLQUFLLGNBQUwsQ0FBb0IsTUFBTSxXQUFOLEVBQW1CLGFBQXZDLENBQWpCLENBRDRCO1NBQWhDOzs7QUF2Q3NDLGFBNEN0QyxDQUFNLEtBQU4sR0FBYyxLQUFLLEdBQUwsQ0FBUyxNQUFNLFFBQU4sQ0FBdkI7OztBQTVDc0MsWUErQ2xDLE1BQU0sT0FBTixLQUFrQixZQUFsQixJQUFrQyxNQUFNLFVBQU4sRUFBa0I7QUFDcEQsa0JBQU0sVUFBTixHQUFtQixJQUFuQixDQURvRDtTQUF4RDs7O0FBL0NzQyxhQW9EdEMsQ0FBTSxPQUFOLEdBQWdCLFlBQWhCLENBcERzQztBQXFEdEMsWUFBSSxhQUFhLEtBQUMsQ0FBTSxJQUFOLEdBQWMsZUFBZSxNQUFNLElBQU4sR0FBYSxZQUEzQzs7O0FBckRxQixZQXdEbEMsQ0FBQyxNQUFNLE1BQU4sRUFBYztBQUNmLGtCQUFNLE1BQU4sQ0FBYSxHQUFiLElBQW9CLFVBQXBCOzs7QUFEZSxTQUFuQixNQUlPO0FBQ0gsc0JBQU0sTUFBTSxNQUFOLENBQU4sR0FBc0IsTUFBTSxNQUFNLE1BQU4sQ0FBTixJQUF1QixFQUF2QixDQURuQjtBQUVILHNCQUFNLE1BQU0sTUFBTixDQUFOLENBQW9CLE1BQU0sUUFBTixDQUFwQixHQUFzQyxVQUF0QyxDQUZHO2FBSlA7S0F4REo7Q0FOYSIsImZpbGUiOiJ1cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjYWxjID0gcmVxdWlyZSgnLi4vaW5jL2NhbGMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyk7XG5jb25zdCBBY3Rpb24gPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbicpO1xuY29uc3QgZGVmYXVsdEFjdGlvbiA9IG5ldyBBY3Rpb24oKTtcbmNvbnN0IFdhdGNoID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9XYXRjaCcpO1xuY29uc3Qgd2F0Y2hlciA9IG5ldyBXYXRjaCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhY3RvciwgZnJhbWVzdGFtcCwgZnJhbWVEdXJhdGlvbikgPT4ge1xuICAgIGNvbnN0IG51bUFjdGl2ZVZhbHVlcyA9IGFjdG9yLmFjdGl2ZVZhbHVlcy5sZW5ndGg7XG4gICAgbGV0IHN0YXRlID0gYWN0b3Iuc3RhdGU7XG5cbiAgICBhY3Rvci5oYXNDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUFjdGl2ZVZhbHVlczsgaSsrKSB7XG4gICAgICAgIC8vIEdldCB2YWx1ZSBhbmQga2V5XG4gICAgICAgIGxldCBrZXkgPSBhY3Rvci5hY3RpdmVWYWx1ZXNbaV07XG4gICAgICAgIGxldCB2YWx1ZSA9IGFjdG9yLnZhbHVlc1trZXldO1xuICAgICAgICBsZXQgYWN0aW9uID0gKCF2YWx1ZS5hY3Rpb24gfHwgdmFsdWUuYWN0aW9uICYmICF2YWx1ZS5hY3Rpb24uaXNBY3RpdmUpID8gZGVmYXVsdEFjdGlvbiA6IHZhbHVlLmFjdGlvbjtcblxuICAgICAgICAvLyBGaXJlIGFjdGlvbiBvbkZyYW1lU3RhcnQgaWYgbm90IGFscmVhZHkgZmlyZWRcbiAgICAgICAgaWYgKGFjdGlvbi5vbkZyYW1lU3RhcnQgJiYgYWN0aW9uLmxhc3RVcGRhdGUgIT09IGZyYW1lc3RhbXApIHtcbiAgICAgICAgICAgIGFjdGlvbi5vbkZyYW1lU3RhcnQoYWN0b3IsIGZyYW1lRHVyYXRpb24sIGZyYW1lc3RhbXApO1xuICAgICAgICAgICAgYWN0aW9uLmxhc3RVcGRhdGUgPSBmcmFtZXN0YW1wO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIENhbGN1bGF0ZSBuZXcgdmFsdWVcbiAgICAgICAgbGV0IHVwZGF0ZWRWYWx1ZSA9IHV0aWxzLmhhcyh2YWx1ZSwgJ3dhdGNoJykgPyB3YXRjaGVyLnByb2Nlc3MoYWN0b3IsIHZhbHVlKSA6IGFjdGlvbi5wcm9jZXNzKGFjdG9yLCB2YWx1ZSwga2V5LCBmcmFtZUR1cmF0aW9uKTtcblxuICAgICAgICAvLyBVc2VyLWRlZmluZWQgdHJhbnNmb3JtIGZ1bmN0aW9uXG4gICAgICAgIGlmICh2YWx1ZS50cmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIHVwZGF0ZWRWYWx1ZSA9IHZhbHVlLnRyYW5zZm9ybSh1cGRhdGVkVmFsdWUsIGtleSwgYWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGltaXQgaWYgYWN0b3IgYWN0aW9uIGRvZXMgdGhhdCBraW5kIG9mIHRoaW5nXG4gICAgICAgIGlmIChhY3Rpb24ubGltaXQgJiYgdmFsdWUuaGFzUmFuZ2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZWRWYWx1ZSA9IGFjdGlvbi5saW1pdCh1cGRhdGVkVmFsdWUsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNtb290aCB2YWx1ZSBpZiB3ZSBoYXZlIHNtb290aGluZ1xuICAgICAgICBpZiAodmFsdWUuc21vb3RoKSB7XG4gICAgICAgICAgICB1cGRhdGVkVmFsdWUgPSBjYWxjLnNtb290aCh1cGRhdGVkVmFsdWUsIHZhbHVlLmN1cnJlbnQsIGZyYW1lRHVyYXRpb24sIHZhbHVlLnNtb290aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSb3VuZCB2YWx1ZSBpZiByb3VuZCBpcyB0cnVlXG4gICAgICAgIGlmICh2YWx1ZS5yb3VuZCkge1xuICAgICAgICAgICAgdXBkYXRlZFZhbHVlID0gTWF0aC5yb3VuZCh1cGRhdGVkVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIGZyYW1lQ2hhbmdlXG4gICAgICAgIHZhbHVlLmZyYW1lQ2hhbmdlID0gdXBkYXRlZFZhbHVlIC0gdmFsdWUuY3VycmVudDtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdmVsb2NpdHkgaWYgQWN0aW9uIGhhc24ndFxuICAgICAgICBpZiAoIWFjdGlvbi5jYWxjdWxhdGVzVmVsb2NpdHkpIHtcbiAgICAgICAgICAgIHZhbHVlLnZlbG9jaXR5ID0gY2FsYy5zcGVlZFBlclNlY29uZCh2YWx1ZS5mcmFtZUNoYW5nZSwgZnJhbWVEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudCBzcGVlZFxuICAgICAgICB2YWx1ZS5zcGVlZCA9IE1hdGguYWJzKHZhbHVlLnZlbG9jaXR5KTtcblxuICAgICAgICAvLyBDaGVjayBpZiB2YWx1ZSdzIGNoYW5nZWRcbiAgICAgICAgaWYgKHZhbHVlLmN1cnJlbnQgIT09IHVwZGF0ZWRWYWx1ZSB8fCBhY3Rvci5maXJzdEZyYW1lKSB7XG4gICAgICAgICAgICBhY3Rvci5oYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBuZXcgY3VycmVudCBcbiAgICAgICAgdmFsdWUuY3VycmVudCA9IHVwZGF0ZWRWYWx1ZTtcbiAgICAgICAgbGV0IHZhbHVlU3RhdGUgPSAodmFsdWUudW5pdCkgPyB1cGRhdGVkVmFsdWUgKyB2YWx1ZS51bml0IDogdXBkYXRlZFZhbHVlO1xuXG4gICAgICAgIC8vIFB1dCB2YWx1ZSBpbiBzdGF0ZSBpZiBubyBwYXJlbnRcbiAgICAgICAgaWYgKCF2YWx1ZS5wYXJlbnQpIHtcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlc1trZXldID0gdmFsdWVTdGF0ZTtcblxuICAgICAgICAvLyBPciwgYWRkIHRvIHBhcmVudCBzdGF0ZSB0byBiZSBjb21iaW5lZCBsYXRlclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGVbdmFsdWUucGFyZW50XSA9IHN0YXRlW3ZhbHVlLnBhcmVudF0gfHwge307XG4gICAgICAgICAgICBzdGF0ZVt2YWx1ZS5wYXJlbnRdW3ZhbHVlLnByb3BOYW1lXSA9IHZhbHVlU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG59Il19

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Imports
	var calc = __webpack_require__(13);
	var utils = __webpack_require__(4);
	var Controls = __webpack_require__(16);
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLElBQU0sT0FBTyxRQUFRLGFBQVIsQ0FBUDtBQUNOLElBQU0sUUFBUSxRQUFRLGNBQVIsQ0FBUjtBQUNOLElBQU0sV0FBVyxRQUFRLHNCQUFSLENBQVg7QUFDTixJQUFNLE9BQU8sTUFBTSxJQUFOOzs7QUFHYixJQUFNLGVBQWUsU0FBZjtBQUNOLElBQU0sVUFBVSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFVBQXZCLEVBQW1DLFlBQW5DLENBQVY7O0lBRUE7Ozs7Ozs7O0FBUUYsYUFSRSxNQVFGLENBQVksS0FBWixFQUFtQjs7OzhCQVJqQixRQVFpQjs7QUFDZixhQUFLLEtBQUssZUFBTCxFQUFMLEVBQTZCLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDekMsa0JBQUssR0FBTCxJQUFZLEtBQVosQ0FEeUM7U0FBaEIsQ0FBN0IsQ0FEZTs7QUFLZixhQUFLLE1BQUwsR0FBYyxFQUFkLENBTGU7QUFNZixhQUFLLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEtBQUssbUJBQUwsRUFBaEIsRUFOZTtLQUFuQjs7Ozs7Ozs7OztBQVJFLHFCQXlCRixxQkFBNEM7OztZQUF4Qyw4REFBUSxrQkFBZ0M7WUFBNUIsb0VBQWMsNEJBQWM7OztBQUV4QyxhQUFLLEtBQUwsRUFBWSxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ3hCLGdCQUFJLFFBQVEsUUFBUixFQUFrQjtBQUNsQix1QkFBSyxHQUFMLElBQVksS0FBWixDQURrQjthQUF0QjtTQURRLENBQVo7OztBQUZ3QyxZQVNwQyxNQUFNLE1BQU4sRUFBYzs7QUFDZCxvQkFBSSxnQkFBZ0IsT0FBSyxNQUFMOztBQUVwQixxQkFBSyxNQUFNLE1BQU4sRUFBYyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQy9CLHdCQUFNLGdCQUFnQixjQUFjLEdBQWQsQ0FBaEIsQ0FEeUI7QUFFL0Isd0JBQUksV0FBVyxFQUFYLENBRjJCOztBQUkvQix3QkFBSSxNQUFNLEtBQU4sQ0FBWSxLQUFaLENBQUosRUFBd0I7QUFDcEIsbUNBQVcsS0FBWCxDQURvQjtxQkFBeEIsTUFFTztBQUNILGlDQUFTLFdBQVQsSUFBd0IsS0FBeEIsQ0FERztxQkFGUDs7QUFNQSxrQ0FBYyxHQUFkLElBQXFCLGdCQUFrQixNQUFNLEtBQU4sQ0FBWSxhQUFaLEVBQTJCLFFBQTNCLENBQWxCLEdBQXlELFFBQXpELENBVlU7aUJBQWhCLENBQW5CO2lCQUhjO1NBQWxCOztBQWlCQSxlQUFPLElBQVAsQ0ExQndDOzs7Ozs7Ozs7OztBQXpCMUMscUJBOERGLDJCQUFRLE9BQU8sT0FBTztBQUNsQixlQUFPLE1BQU0sT0FBTixDQURXOzs7Ozs7Ozs7O0FBOURwQixxQkF3RUYsK0JBQVc7QUFDUCxlQUFPLElBQVAsQ0FETzs7Ozs7Ozs7Ozs7QUF4RVQscUJBb0ZGLHVCQUFNLFFBQVEsT0FBTztBQUNqQixZQUFNLGFBQWEsS0FBSyxVQUFMLENBQWdCLE1BQWhCLEVBQXdCLE1BQU0sR0FBTixFQUFXLE1BQU0sR0FBTixDQUFoRCxDQURXO0FBRWpCLFlBQU0sWUFBWSxNQUFNLFNBQU4sS0FBb0IsU0FBcEIsR0FBZ0MsTUFBTSxTQUFOLEdBQWtCLENBQWxELENBRkQ7O0FBSWpCLGVBQU8sYUFBYyxDQUFDLFNBQVMsVUFBVCxDQUFELEdBQXdCLFNBQXhCLENBSko7Ozs7Ozs7OztBQXBGbkIscUJBaUdGLHFDQUFjO0FBQ1YsZUFBTyxRQUFQLENBRFU7Ozs7Ozs7O0FBakdaLHFCQTBHRiw2Q0FBa0I7QUFDZCxlQUFPLEVBQVAsQ0FEYzs7Ozs7Ozs7QUExR2hCLHFCQW1IRiw2Q0FBa0I7QUFDZCxlQUFPLEVBQVAsQ0FEYzs7Ozs7Ozs7O0FBbkhoQixxQkE2SEYscURBQXNCO0FBQ2xCLGVBQU8sWUFBUCxDQURrQjs7Ozs7Ozs7O0FBN0hwQixxQkF1SUYsMkJBQVM7OztBQUNMLFlBQUksTUFBTSxFQUFFLFFBQVEsS0FBSyxNQUFMLEVBQWhCLENBREM7O0FBR0wsYUFBSyxJQUFMLEVBQVcsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3RCLGdCQUFJLE9BQUssY0FBTCxDQUFvQixHQUFwQixLQUE0QixRQUFRLE9BQVIsQ0FBZ0IsR0FBaEIsTUFBeUIsQ0FBQyxDQUFELEVBQUk7QUFDekQsb0JBQUksR0FBSixJQUFXLElBQVgsQ0FEeUQ7YUFBN0Q7U0FETyxDQUFYLENBSEs7O0FBU0wsZUFBTyxHQUFQLENBVEs7Ozs7Ozs7Ozs7QUF2SVAscUJBMEpGLHlCQUFPLE9BQU87QUFDVixlQUFPLElBQUksS0FBSyxXQUFMLENBQWlCLE1BQU0sS0FBTixDQUFZLElBQVosRUFBa0IsS0FBbEIsQ0FBckIsRUFBK0MsS0FBSyxtQkFBTCxFQUEvQyxDQUFQLENBRFU7Ozs7Ozs7O0FBMUpaLHFCQW1LRixxQ0FBYztBQUNWLGVBQU8sS0FBSyxNQUFMLEVBQVAsQ0FEVTs7Ozs7Ozs7QUFuS1oscUJBNEtGLCtCQUFXO0FBQ1AsYUFBSyxRQUFMLEdBQWdCLElBQWhCLENBRE87QUFFUCxlQUFPLElBQVAsQ0FGTzs7Ozs7Ozs7QUE1S1QscUJBc0xGLG1DQUFhO0FBQ1QsYUFBSyxRQUFMLEdBQWdCLEtBQWhCLENBRFM7QUFFVCxlQUFPLElBQVAsQ0FGUzs7O1dBdExYOzs7QUE0TE4sT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6IkFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmNvbnN0IGNhbGMgPSByZXF1aXJlKCcuLi9pbmMvY2FsYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi9pbmMvdXRpbHMnKTtcbmNvbnN0IENvbnRyb2xzID0gcmVxdWlyZSgnLi4vY29udHJvbHMvQ29udHJvbHMnKTtcbmNvbnN0IGVhY2ggPSB1dGlscy5lYWNoO1xuXG4vLyBWYWx1ZXNcbmNvbnN0IERFRkFVTFRfUFJPUCA9ICdjdXJyZW50JztcbmNvbnN0IFBSSVZBVEUgPSBbJ29uU3RhcnQnLCAnb25GcmFtZScsICdvblVwZGF0ZScsICdvbkNvbXBsZXRlJ107XG5cbmNsYXNzIEFjdGlvbiB7XG5cbiAgICAvKlxuICAgICAgICAjIEFjdGlvbiBjbGFzcyBjb25zdHJ1Y3RvclxuICAgICAgICAjIyBBc3NpZ24gZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIEFjdGlvbiBvciBleHRlbmRlZCBjbGFzcyBhbmQgc2V0IHVzZXItZGVmaW5lZCBwcm9wc1xuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICovXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgZWFjaCh0aGlzLmdldERlZmF1bHRQcm9wcygpLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmFsdWVzID0ge307XG4gICAgICAgIHRoaXMuc2V0KHByb3BzLCB0aGlzLmdldERlZmF1bHRWYWx1ZVByb3AoKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBTZXQgQWN0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgIyMgU2V0IHVzZXItZGVmaW5lZCBBY3Rpb24gcHJvcGVydGllc1xuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICAgICBAcGFyYW0gW3N0cmluZ106IE5hbWUgb2YgZGVmYXVsdCB2YWx1ZSBwcm9wZXJ0eSAoc2V0IHdoZW4gYHZhbHVlYCBpcyAqKm5vdCoqIHByb3ZpZGVkIGFzIG9iamVjdClcbiAgICAgICAgQHJldHVybiBbQWN0aW9uXVxuICAgICovXG4gICAgc2V0KHByb3BzID0ge30sIGRlZmF1bHRQcm9wID0gREVGQVVMVF9QUk9QKSB7XG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBub24tYHZhbHVlYCBwcm9wZXJ0aWVzIGFuZCBzZXRcbiAgICAgICAgZWFjaChwcm9wcywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICd2YWx1ZXMnKSB7XG4gICAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1lcmdlIGB2YWx1ZWAgcHJvcGVydGllcyB3aXRoIGV4aXN0aW5nXG4gICAgICAgIGlmIChwcm9wcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWVzID0gdGhpcy52YWx1ZXM7XG5cbiAgICAgICAgICAgIGVhY2gocHJvcHMudmFsdWVzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWUgPSBjdXJyZW50VmFsdWVzW2tleV07XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzT2JqKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2RlZmF1bHRQcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZXNba2V5XSA9IChleGlzdGluZ1ZhbHVlKSA/IHV0aWxzLm1lcmdlKGV4aXN0aW5nVmFsdWUsIG5ld1ZhbHVlKSA6IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIFByb2Nlc3MgbGF0ZXN0IGBjdXJyZW50YCB2YWx1ZVxuICAgICAgICAjIyBBY3Rpb25zIHBlcmZvcm1zIGV4aXN0aW5nIGBjdXJyZW50YCB2YWx1ZVxuXG4gICAgICAgIEBwYXJhbSBbQWN0b3JdXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICAgICBAcmV0dXJuIFtudW1iZXJdXG4gICAgKi9cbiAgICBwcm9jZXNzKGFjdG9yLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuY3VycmVudDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEhhcyBBY3Rpb24gZW5kZWQ/XG4gICAgICAgICMjIFJldHVybnMgYHRydWVgIHRvIGVuZCBBY3Rpb24gKEFjdGlvbiBvbmx5IGZpcmVzIG9uY2UpLlxuICAgICAgICBcbiAgICAgICAgQHJldHVybiBbYm9vbGVhbl1cbiAgICAqL1xuICAgIGhhc0VuZGVkKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIExpbWl0IHZhbHVlIHRvIHdpdGhpbiBzZXQgcGFyYW1ldGVyc1xuICAgICAgICAjIyBSZXR1cm4gdmFsdWUgd2l0aGluIG1pbi9tYXgsIHdpdGggb3V0bHlpbmcgdmFsdWVzIG11bHRpcGxpZWQgYnkgYGVzY2FwZUFtcGBcblxuICAgICAgICBAcGFyYW0gW251bWJlcl1cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdIHsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBlc2NhcGVBbXA6IGZhY3RvciB9XG4gICAgICAgIEByZXR1cm4gW251bWJlcl1cbiAgICAqL1xuICAgIGxpbWl0KG91dHB1dCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdHJpY3RlZCA9IGNhbGMucmVzdHJpY3RlZChvdXRwdXQsIHZhbHVlLm1pbiwgdmFsdWUubWF4KTtcbiAgICAgICAgY29uc3QgZXNjYXBlQW1wID0gdmFsdWUuZXNjYXBlQW1wICE9PSB1bmRlZmluZWQgPyB2YWx1ZS5lc2NhcGVBbXAgOiAwO1xuXG4gICAgICAgIHJldHVybiByZXN0cmljdGVkICsgKChvdXRwdXQgLSByZXN0cmljdGVkKSAqIGVzY2FwZUFtcCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBHZXQgQ29udHJvbHMgY2xhc3MgZm9yIHRoaXMgQWN0aW9uXG4gICAgICAgICMjIEluaGVyaXRlZCBBY3Rpb25zIG1heSByZXR1cm4gZGlmZmVyZW50IENvbnRyb2xzIGNsYXNzXG5cbiAgICAgICAgQHJldHVybiBbQ29udHJvbHNdXG4gICAgKi9cbiAgICBnZXRDb250cm9scygpIHtcbiAgICAgICAgcmV0dXJuIENvbnRyb2xzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgICMgR2V0IGRlZmF1bHQgQWN0aW9uIHByb3BlcnRpZXNcblxuICAgICAgICBAcmV0dXJuIFtvYmplY3RdXG4gICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEdldCBkZWZhdWx0IEFjdGlvbiB2YWx1ZSBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQHJldHVybiBbb2JqZWN0XVxuICAgICovXG4gICAgZ2V0RGVmYXVsdFZhbHVlKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBHZXQgZGVmYXVsdCBBY3Rpb24gdmFsdWUgcHJvcGVydHkgbmFtZVxuICAgICAgICAjIyBTZXQgdGhpcyBgdmFsdWVgIHByb3BlcnR5IHdoZW4gc2V0IGFzIHZhbHVlIGluc3RlYWQgb2Ygb2JqZWN0XG5cbiAgICAgICAgQHJldHVybiBbc3RyaW5nXVxuICAgICovXG4gICAgZ2V0RGVmYXVsdFZhbHVlUHJvcCgpIHtcbiAgICAgICAgcmV0dXJuIERFRkFVTFRfUFJPUDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEdldCBzZXQgcHJvcGVydGllc1xuICAgICAgICAjIyBHZXQgdXNlci1zZXQgcHJvcGVydGllcyBmb3IgdGhpcyBBY3Rpb25cblxuICAgICAgICBAcmV0dXJuIFtvYmplY3RdXG4gICAgKi9cbiAgICBnZXRTZXQoKSB7XG4gICAgICAgIGxldCBzZXQgPSB7IHZhbHVlczogdGhpcy52YWx1ZXMgfTtcblxuICAgICAgICBlYWNoKHRoaXMsIChrZXksIHByb3ApID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkgJiYgUFJJVkFURS5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0W2tleV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2V0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgICMgRXh0ZW5kIHRoaXMgQWN0aW9uIHdpdGggbmV3IHByb3BlcnRpZXNcbiAgICAgICAgIyMgUmV0dXJucyBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBBY3Rpb24ncyBgcHJvdG90eXBlYCB3aXRoIGV4aXN0aW5nIGFuZCBuZXcgcHJvcGVydGllc1xuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XSAob3B0aW9uYWwpXG4gICAgICAgIEByZXR1cm4gW0FjdGlvbl1cbiAgICAqL1xuICAgIGV4dGVuZChwcm9wcykge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodXRpbHMubWVyZ2UodGhpcywgcHJvcHMpLCB0aGlzLmdldERlZmF1bHRWYWx1ZVByb3AoKSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBHZXQgYSBuZXcgcGxheWFibGUgdmVyc2lvbiBvZiB0aGlzIEFjdGlvblxuXG4gICAgICAgIEByZXR1cm4gW0FjdGlvbl1cbiAgICAqL1xuICAgIGdldFBsYXlhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5leHRlbmQoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEFjdGl2YXRlIHRoaXMgQWN0aW9uXG5cbiAgICAgICAgQHJldHVybiBbQWN0aW9uXVxuICAgICovXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIERlYWN0aXZhdGUgdGhpcyBBY3Rpb25cblxuICAgICAgICBAcmV0dXJuIFtBY3Rpb25dXG4gICAgKi9cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247Il19

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var each = __webpack_require__(4).each;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9scy9Db250cm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTSxPQUFPLFFBQVEsY0FBUixFQUF3QixJQUF4Qjs7SUFFUDtBQUNGLGFBREUsUUFDRixDQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkIsVUFBM0IsRUFBdUM7OEJBRHJDLFVBQ3FDOztBQUNuQyxhQUFLLEtBQUwsR0FBYSxLQUFiLENBRG1DO0FBRW5DLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FGbUM7QUFHbkMsYUFBSyxXQUFMLEdBSG1DOztBQUtuQyxZQUFJLFVBQUosRUFBZ0I7QUFDWixpQkFBSyxFQUFMLEdBQVUsS0FBSyxVQUFMLEVBQVYsQ0FEWTtBQUVaLGlCQUFLLE1BQUwsQ0FBWSxRQUFaLEdBRlk7U0FBaEI7S0FMSjs7QUFERSx1QkFZRix1QkFBTSxPQUFPO0FBQ1QsYUFBSyxFQUFMLEdBQVUsS0FBSyxVQUFMLEVBQVYsQ0FEUztBQUVULGFBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsS0FBSyxFQUFMLEVBQVMsS0FBMUIsRUFGUztBQUdULGFBQUssTUFBTCxDQUFZLFFBQVosR0FIUztBQUlULGVBQU8sSUFBUCxDQUpTOzs7QUFaWCx1QkFtQkYsdUJBQU87QUFDSCxhQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLEtBQUssRUFBTCxDQUF4QixDQURHO0FBRUgsYUFBSyxNQUFMLENBQVksVUFBWixHQUZHOztBQUlILGVBQU8sSUFBUCxDQUpHOzs7QUFuQkwsdUJBMEJGLHlCQUFRO0FBQ0osYUFBSyxNQUFMLENBQVksVUFBWixHQURJO0FBRUosZUFBTyxJQUFQLENBRkk7OztBQTFCTix1QkErQkYsMkJBQVM7QUFDTCxhQUFLLE1BQUwsQ0FBWSxRQUFaLEdBREs7QUFFTCxlQUFPLElBQVAsQ0FGSzs7O0FBL0JQLHVCQW9DRiwyQkFBUztBQUNMLFlBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEtBQUssRUFBTCxDQUFyQixHQUFnQyxLQUFLLE1BQUwsR0FBYyxLQUFLLEtBQUwsQ0FEdEQ7QUFFTCxlQUFPLEtBQUssTUFBTCxDQUFZLFFBQVosR0FBdUIsS0FBSyxLQUFMLEVBQXZCLEdBQXNDLE9BQU8sSUFBUCxDQUFZLElBQVosQ0FBdEMsQ0FGRjs7O0FBcENQLHVCQXlDRix1QkFBYzs7O0FBQ1YsdUJBQUssS0FBTCxFQUFXLElBQVgsMEJBRFU7QUFFVixlQUFPLElBQVAsQ0FGVTs7O0FBekNaLHVCQThDRixtQ0FBYTtBQUNULGVBQU8sS0FBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixLQUFLLE1BQUwsRUFBYSxLQUFLLEVBQUwsQ0FBMUMsQ0FEUzs7O0FBOUNYLHVCQWtERixxQ0FBYzs7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsRUFBZixDQURVOztBQUdWLGFBQUssS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ3JDLGdCQUFJLGFBQWEsTUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixHQUFsQixDQUFiLENBRGlDOztBQUdyQyxrQkFBSyxPQUFMLENBQWEsR0FBYixJQUFvQixXQUFXLE9BQVgsQ0FIaUI7O0FBS3JDLGdCQUFJLFdBQVcsUUFBWCxFQUFxQjtBQUNyQixxQkFBSyxXQUFXLFFBQVgsRUFBcUIsVUFBQyxRQUFELEVBQVcsVUFBWCxFQUEwQjtBQUNoRCwwQkFBSyxPQUFMLENBQWEsTUFBTSxRQUFOLENBQWIsR0FBK0IsTUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFNLFFBQU4sQ0FBbEIsQ0FBa0MsT0FBbEMsQ0FEaUI7aUJBQTFCLENBQTFCLENBRHFCO2FBQXpCO1NBTHFCLENBQXpCLENBSFU7OztBQWxEWix1QkFrRUYsMkNBQWlCOzs7QUFDYixhQUFLLEtBQUssT0FBTCxFQUFjLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDL0IsbUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBdkIsR0FBZ0MsS0FBaEMsQ0FEK0I7U0FBaEIsQ0FBbkIsQ0FEYTs7O1dBbEVmOzs7QUF5RU4sT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6IkNvbnRyb2xzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZWFjaCA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLmVhY2g7XG5cbmNsYXNzIENvbnRyb2xzIHtcbiAgICBjb25zdHJ1Y3RvcihhY3RvciwgYWN0aW9uLCBoYXNTdGFydGVkKSB7XG4gICAgICAgIHRoaXMuYWN0b3IgPSBhY3RvcjtcbiAgICAgICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgIHRoaXMuc2F2ZU9yaWdpbnMoKTtcblxuICAgICAgICBpZiAoaGFzU3RhcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMuYmluZEFjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb24uYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0KGlucHV0KSB7XG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLmJpbmRBY3Rpb24oKTtcbiAgICAgICAgdGhpcy5hY3Rvci5zdGFydCh0aGlzLmlkLCBpbnB1dCk7XG4gICAgICAgIHRoaXMuYWN0aW9uLmFjdGl2YXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuYWN0b3IudW5iaW5kQWN0aW9uKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLmFjdGlvbi5kZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLmFjdGlvbi5hY3RpdmF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIGxldCByZXN1bWUgPSB0aGlzLmFjdG9yLmhhc0FjdGlvbih0aGlzLmlkKSA/IHRoaXMucmVzdW1lIDogdGhpcy5zdGFydDtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uLmlzQWN0aXZlID8gdGhpcy5wYXVzZSgpIDogcmVzdW1lLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgdGhlbiguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuYWN0b3IudGhlbiguLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYmluZEFjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0b3IuYmluZEFjdGlvbih0aGlzLmFjdGlvbiwgdGhpcy5pZCk7XG4gICAgfVxuXG4gICAgc2F2ZU9yaWdpbnMoKSB7XG4gICAgICAgIHRoaXMub3JpZ2lucyA9IHt9O1xuXG4gICAgICAgIGVhY2godGhpcy5hY3Rpb24udmFsdWVzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGFjdG9yVmFsdWUgPSB0aGlzLmFjdG9yLnZhbHVlc1trZXldO1xuXG4gICAgICAgICAgICB0aGlzLm9yaWdpbnNba2V5XSA9IGFjdG9yVmFsdWUuY3VycmVudDtcblxuICAgICAgICAgICAgaWYgKGFjdG9yVmFsdWUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBlYWNoKGFjdG9yVmFsdWUuY2hpbGRyZW4sIChjaGlsZEtleSwgY2hpbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbnNba2V5ICsgY2hpbGRLZXldID0gdGhpcy5hY3Rvci52YWx1ZXNba2V5ICsgY2hpbGRLZXldLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc3RvcmVPcmlnaW5zKCkge1xuICAgICAgICBlYWNoKHRoaXMub3JpZ2lucywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWN0b3IudmFsdWVzW2tleV0ub3JpZ2luID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sczsiXX0=

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(15),
	    calc = __webpack_require__(13),
	    isString = __webpack_require__(4).isString,

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1dhdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFUO0lBQ0EsT0FBTyxRQUFRLGFBQVIsQ0FBUDtJQUNBLFdBQVcsUUFBUSxjQUFSLEVBQXdCLFFBQXhCOzs7Ozs7Ozs7O0FBVVgsa0JBQWtCLFVBQVUsUUFBVixFQUFvQixXQUFwQixFQUFpQyxPQUFqQyxFQUEwQyxPQUExQyxFQUFtRCxLQUFuRCxFQUEwRDtBQUN4RSxRQUFJLFlBQVksUUFBUSxNQUFSO1FBQ1osSUFBSSxDQUFKO1FBQ0EsYUFGSjtRQUdJLGFBSEo7UUFJSSxXQUpKO1FBS0ksV0FMSixDQUR3RTs7QUFReEUsV0FBTyxJQUFJLFNBQUosRUFBZSxHQUF0QixFQUEyQjs7QUFFdkIsd0JBQWdCLFNBQVMsUUFBUSxJQUFJLENBQUosQ0FBakIsSUFBMkIsWUFBWSxRQUFRLElBQUksQ0FBSixDQUFwQixDQUEzQixHQUF5RCxRQUFRLElBQUksQ0FBSixDQUFqRSxDQUZPO0FBR3ZCLHdCQUFnQixTQUFTLFFBQVEsQ0FBUixDQUFULElBQXVCLFlBQVksUUFBUSxDQUFSLENBQVosQ0FBdkIsR0FBaUQsUUFBUSxDQUFSLENBQWpELENBSE87QUFJdkIsc0JBQWMsU0FBUyxNQUFNLElBQUksQ0FBSixDQUFmLElBQXlCLFFBQVEsTUFBTSxJQUFJLENBQUosQ0FBZCxDQUF6QixHQUFpRCxNQUFNLElBQUksQ0FBSixDQUF2RCxDQUpTO0FBS3ZCLHNCQUFjLFNBQVMsTUFBTSxDQUFOLENBQVQsSUFBcUIsUUFBUSxNQUFNLENBQU4sQ0FBUixDQUFyQixHQUF5QyxNQUFNLENBQU4sQ0FBekM7OztBQUxTLFlBUW5CLFdBQVcsYUFBWCxJQUE0QixNQUFNLFlBQVksQ0FBWixFQUFlO0FBQ2pELHVCQUFXLEtBQUssS0FBTCxDQUFXLEtBQUssVUFBTCxDQUFnQixLQUFLLFFBQUwsQ0FBYyxRQUFkLEVBQXdCLGFBQXhCLEVBQXVDLGFBQXZDLENBQWhCLEVBQXVFLENBQXZFLEVBQTBFLENBQTFFLENBQVgsRUFBeUYsV0FBekYsRUFBc0csV0FBdEcsQ0FBWCxDQURpRDtBQUVqRCxrQkFGaUQ7U0FBckQ7S0FSSjs7QUFjQSxXQUFPLFFBQVAsQ0F0QndFO0NBQTFEOztJQXlCaEI7OztBQUNGLGFBREUsS0FDRixHQUFxQjs4QkFEbkIsT0FDbUI7OzBDQUFOOztTQUFNOztxREFDakIsMENBQVMsS0FBVCxHQURpQjs7QUFFakIsY0FBSyxRQUFMLEdBQWdCLElBQWhCLENBRmlCOztLQUFyQjs7Ozs7Ozs7Ozs7Ozs7QUFERSxvQkFpQkYsMkJBQVEsT0FBTyxPQUFPLEtBQUs7QUFDdkIsWUFBTSxhQUFhLE1BQU0sS0FBTixDQURJO0FBRXZCLFlBQUksZUFBZSxDQUFmLENBRm1CO0FBR3ZCLFlBQUksU0FBUyxNQUFNLE1BQU4sQ0FIVTtBQUl2QixZQUFJLFdBQVcsTUFBTSxPQUFOLENBSlE7QUFLdkIsWUFBSSxjQUFjLE1BQU0sTUFBTixHQUFlLE1BQU0sTUFBTixDQUFhLFdBQWIsR0FBMkIsS0FBMUMsQ0FMSzs7QUFPdkIsWUFBSSxTQUFTLFVBQVQsQ0FBSixFQUEwQjtBQUN0QiwyQkFBZSxPQUFPLFVBQVAsSUFBcUIsT0FBTyxVQUFQLENBQXJCLEdBQTBDLEVBQTFDOzs7QUFETyxnQkFJbEIsYUFBYSxPQUFiLEtBQXlCLFNBQXpCLElBQXNDLFFBQVEsVUFBUixFQUFvQjtBQUMxRCwyQkFBVyxhQUFhLE9BQWI7OztBQUQrQyxhQUE5RCxNQUlPLElBQUksZUFBZSxZQUFZLGNBQVosQ0FBMkIsVUFBM0IsQ0FBZixFQUF1RDtBQUM5RCwrQkFBVyxNQUFNLE1BQU4sQ0FBYSxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLFVBQW5DLENBQVgsQ0FEOEQ7aUJBQTNEO1NBUlgsTUFZTztBQUNILHVCQUFXLFdBQVcsS0FBWCxDQUFYLENBREc7U0FaUDs7O0FBUHVCLFlBd0JuQixNQUFNLE9BQU4sSUFBaUIsTUFBTSxLQUFOLEVBQWE7QUFDOUIsdUJBQVcsZ0JBQWdCLFFBQWhCLEVBQTBCLFlBQTFCLEVBQXdDLEtBQXhDLEVBQStDLE1BQU0sT0FBTixFQUFlLE1BQU0sS0FBTixDQUF6RSxDQUQ4QjtTQUFsQzs7QUFJQSxlQUFPLFFBQVAsQ0E1QnVCOzs7V0FqQnpCO0VBQWM7O0FBaURwQixPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiV2F0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgQWN0aW9uID0gcmVxdWlyZSgnLi9BY3Rpb24nKSxcbiAgICBjYWxjID0gcmVxdWlyZSgnLi4vaW5jL2NhbGMnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLmlzU3RyaW5nLFxuXG4gICAgLypcbiAgICAgICAgVHJhbnNsYXRlIG91ciBtYXBMaW5rIHZhbHVlIGludG8gbWFwVG9cbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogQ2FsY3VsYXRlZCB2YWx1ZSBmcm9tIGxpbmtlZCB2YWx1ZVxuICAgICAgICBAcGFyYW0gW1ZhbHVlIHx8IG9iamVjdF06IExpbmtlZCB2YWx1ZSBvciBlbXB0eSBvYmplY3QgaWYgd2UncmUgbGlua2luZyB0byBpbnB1dFxuICAgICAgICBAcGFyYW0gW2FycmF5XTogTGlzdCBvZiBudW1iZXJzIHJlbGF0aW5nIHRvIGxpbmtlZCB2YWx1ZVxuICAgICAgICBAcGFyYW0gW2FycmF5XTogTGlzdCBvZiBudW1iZXJzIHJlbGF0aW5nIHRvIHRoaXMgdmFsdWVcbiAgICAqL1xuICAgIGZpbmRNYXBwZWRWYWx1ZSA9IGZ1bmN0aW9uIChuZXdWYWx1ZSwgbGlua2VkVmFsdWUsIHRvVmFsdWUsIG1hcExpbmssIG1hcFRvKSB7XG4gICAgICAgIHZhciBtYXBMZW5ndGggPSBtYXBMaW5rLmxlbmd0aCxcbiAgICAgICAgICAgIGkgPSAxLFxuICAgICAgICAgICAgbGFzdExpbmtWYWx1ZSxcbiAgICAgICAgICAgIHRoaXNMaW5rVmFsdWUsXG4gICAgICAgICAgICBsYXN0VG9WYWx1ZSxcbiAgICAgICAgICAgIHRoaXNUb1ZhbHVlO1xuXG4gICAgICAgIGZvciAoOyBpIDwgbWFwTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEFzc2lnbiB2YWx1ZXMgZnJvbSBhcnJheSwgb3IgaWYgdGhleSdyZSBzdHJpbmdzLCBsb29rIGZvciB0aGVtIGluIGxpbmtlZFZhbHVlXG4gICAgICAgICAgICBsYXN0TGlua1ZhbHVlID0gaXNTdHJpbmcobWFwTGlua1tpIC0gMV0pID8gbGlua2VkVmFsdWVbbWFwTGlua1tpIC0gMV1dIDogbWFwTGlua1tpIC0gMV07XG4gICAgICAgICAgICB0aGlzTGlua1ZhbHVlID0gaXNTdHJpbmcobWFwTGlua1tpXSkgPyBsaW5rZWRWYWx1ZVttYXBMaW5rW2ldXSA6IG1hcExpbmtbaV07XG4gICAgICAgICAgICBsYXN0VG9WYWx1ZSA9IGlzU3RyaW5nKG1hcFRvW2kgLSAxXSkgPyB0b1ZhbHVlW21hcFRvW2kgLSAxXV0gOiBtYXBUb1tpIC0gMV07XG4gICAgICAgICAgICB0aGlzVG9WYWx1ZSA9IGlzU3RyaW5nKG1hcFRvW2ldKSA/IHRvVmFsdWVbbWFwVG9baV1dIDogbWFwVG9baV07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlJ3ZlIGdvbmUgcGFzdCBvdXIgY2FsY3VsYXRlZCB2YWx1ZSwgb3IgaWYgd2UncmUgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXlcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA8IHRoaXNMaW5rVmFsdWUgfHwgaSA9PT0gbWFwTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gY2FsYy52YWx1ZShjYWxjLnJlc3RyaWN0ZWQoY2FsYy5wcm9ncmVzcyhuZXdWYWx1ZSwgbGFzdExpbmtWYWx1ZSwgdGhpc0xpbmtWYWx1ZSksIDAsIDEpLCBsYXN0VG9WYWx1ZSwgdGhpc1RvVmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgfTtcblxuY2xhc3MgV2F0Y2ggZXh0ZW5kcyBBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFByb2Nlc3MgdGhpcyB2YWx1ZVxuICAgICAgICBcbiAgICAgICAgRmlyc3QgY2hlY2sgaWYgdGhpcyB2YWx1ZSBleGlzdHMgYXMgYSBWYWx1ZSwgaWYgbm90XG4gICAgICAgIGNoZWNrIHdpdGhpbiBJbnB1dCAoaWYgd2UgaGF2ZSBvbmUpXG4gICAgICAgICAgICBcbiAgICAgICAgQHBhcmFtIFtBY3Rvcl1cbiAgICAgICAgQHBhcmFtIFtWYWx1ZV06IEN1cnJlbnQgdmFsdWVcbiAgICAgICAgQHBhcmFtIFtzdHJpbmddOiBLZXkgb2YgY3VycmVudCB2YWx1ZVxuICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBDYWxjdWxhdGVkIHZhbHVlXG4gICAgKi9cbiAgICBwcm9jZXNzKGFjdG9yLCB2YWx1ZSwga2V5KSB7XG4gICAgICAgIGNvbnN0IHdhdGNoZWRLZXkgPSB2YWx1ZS53YXRjaDtcbiAgICAgICAgbGV0IHdhdGNoZWRWYWx1ZSA9IDA7XG4gICAgICAgIGxldCB2YWx1ZXMgPSBhY3Rvci52YWx1ZXM7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHZhbHVlLmN1cnJlbnQ7XG4gICAgICAgIGxldCBpbnB1dE9mZnNldCA9IHZhbHVlLmFjdGlvbiA/IHZhbHVlLmFjdGlvbi5pbnB1dE9mZnNldCA6IGZhbHNlO1xuXG4gICAgICAgIGlmIChpc1N0cmluZyh3YXRjaGVkS2V5KSkge1xuICAgICAgICAgICAgd2F0Y2hlZFZhbHVlID0gdmFsdWVzW3dhdGNoZWRLZXldID8gdmFsdWVzW3dhdGNoZWRLZXldIDoge307XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IGxvb2sgYXQgQWN0aW9uIGFuZCBjaGVjayB2YWx1ZSBpc24ndCBsaW5raW5nIGl0c2VsZlxuICAgICAgICAgICAgaWYgKHdhdGNoZWRWYWx1ZS5jdXJyZW50ICE9PSB1bmRlZmluZWQgJiYga2V5ICE9PSB3YXRjaGVkS2V5KSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB3YXRjaGVkVmFsdWUuY3VycmVudDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gVGhlbiBjaGVjayB2YWx1ZXMgaW4gSW5wdXRcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRPZmZzZXQgJiYgaW5wdXRPZmZzZXQuaGFzT3duUHJvcGVydHkod2F0Y2hlZEtleSkpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlLmFjdGlvbi5wcm9jZXNzKGFjdG9yLCB2YWx1ZSwgd2F0Y2hlZEtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gd2F0Y2hlZEtleShhY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIG1hcEZyb20gYW5kIG1hcFRvIHByb3BlcnRpZXMsIHRyYW5zbGF0ZSB0aGUgbmV3IHZhbHVlXG4gICAgICAgIGlmICh2YWx1ZS5tYXBGcm9tICYmIHZhbHVlLm1hcFRvKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IGZpbmRNYXBwZWRWYWx1ZShuZXdWYWx1ZSwgd2F0Y2hlZFZhbHVlLCB2YWx1ZSwgdmFsdWUubWFwRnJvbSwgdmFsdWUubWFwVG8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaDsiXX0=

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var valueTypeManager = __webpack_require__(3);
	var each = __webpack_require__(4).each;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rvci9yZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLG1CQUFtQixRQUFRLHdCQUFSLENBQW5CO0FBQ04sSUFBTSxPQUFPLFFBQVEsY0FBUixFQUF3QixJQUF4Qjs7QUFFYixJQUFNLGVBQWUsVUFBQyxJQUFELEVBQU8sWUFBUDtXQUF3QixVQUFDLElBQUQsRUFBTyxHQUFQO2VBQWUsYUFBYSxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWIsSUFBK0IsR0FBL0I7S0FBZjtDQUF4Qjs7QUFFckIsT0FBTyxPQUFQLEdBQWlCLFVBQUMsS0FBRCxFQUFXO0FBQ3hCLFFBQU0sbUJBQW1CLE1BQU0sYUFBTixDQUFvQixNQUFwQixDQUREO0FBRXhCLFFBQU0sV0FBVyxNQUFNLEtBQU4sQ0FBWSxNQUFaOzs7QUFGTyxTQUtuQixJQUFJLElBQUksQ0FBSixFQUFPLElBQUksZ0JBQUosRUFBc0IsR0FBdEMsRUFBMkM7QUFDdkMsWUFBSSxNQUFNLE1BQU0sYUFBTixDQUFvQixDQUFwQixDQUFOLENBRG1DO0FBRXZDLFlBQUksUUFBUSxNQUFNLE1BQU4sQ0FBYSxHQUFiLENBQVI7OztBQUZtQyxhQUt2QyxDQUFNLE9BQU4sR0FBZ0IsaUJBQWlCLE1BQU0sSUFBTixDQUFqQixDQUE2QixPQUE3QixDQUFxQyxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQXJDLEVBQXVELE1BQU0sUUFBTixDQUF2RTs7O0FBTHVDLGFBUXZDLENBQU0sS0FBTixDQUFZLE1BQVosQ0FBbUIsR0FBbkIsSUFBMEIsTUFBTSxPQUFOLENBUmE7S0FBM0M7OztBQUx3QixTQWlCbkIsSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFFBQUosRUFBYyxHQUE5QixFQUFtQztBQUMvQixZQUFJLE9BQU8sTUFBTSxLQUFOLENBQVksQ0FBWixDQUFQLENBRDJCO0FBRS9CLFlBQUksZUFBZSxFQUFmLENBRjJCOztBQUkvQixhQUFLLE1BQU0sS0FBTixDQUFZLE1BQVosRUFBb0IsYUFBYSxJQUFiLEVBQW1CLFlBQW5CLENBQXpCLEVBSitCOztBQU0vQixZQUFJLEtBQUssS0FBTCxFQUFZO0FBQ1osaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsWUFBdkIsRUFBcUMsS0FBckMsRUFEWTtTQUFoQjs7QUFJQSxZQUFJLEtBQUssTUFBTCxJQUFlLE1BQU0sVUFBTixFQUFrQjtBQUNqQyxpQkFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQixFQUF3QixZQUF4QixFQUFzQyxLQUF0QyxFQURpQztTQUFyQztLQVZKO0NBakJhIiwiZmlsZSI6InJlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHZhbHVlVHlwZU1hbmFnZXIgPSByZXF1aXJlKCcuLi92YWx1ZS10eXBlcy9tYW5hZ2VyJyk7XG5jb25zdCBlYWNoID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJykuZWFjaDtcblxuY29uc3QgY3JlYXRlTWFwcGVyID0gKHJvbGUsIG1hcHBlZFZhbHVlcykgPT4gKG5hbWUsIHZhbCkgPT4gbWFwcGVkVmFsdWVzW3JvbGUubWFwKG5hbWUpXSA9IHZhbDtcblxubW9kdWxlLmV4cG9ydHMgPSAoYWN0b3IpID0+IHtcbiAgICBjb25zdCBudW1BY3RpdmVQYXJlbnRzID0gYWN0b3IuYWN0aXZlUGFyZW50cy5sZW5ndGg7XG4gICAgY29uc3QgbnVtUm9sZXMgPSBhY3Rvci5yb2xlcy5sZW5ndGg7XG5cbiAgICAvLyBVcGRhdGUgcGFyZW50IHZhbHVlcyBmcm9tIGNhbGN1bGF0ZWQgY2hpbGRyZW5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUFjdGl2ZVBhcmVudHM7IGkrKykge1xuICAgICAgICBsZXQga2V5ID0gYWN0b3IuYWN0aXZlUGFyZW50c1tpXTtcbiAgICAgICAgbGV0IHZhbHVlID0gYWN0b3IudmFsdWVzW2tleV07XG5cbiAgICAgICAgLy8gVXBkYXRlIHBhcmVudCB2YWx1ZSBjdXJyZW50IHByb3BlcnR5XG4gICAgICAgIHZhbHVlLmN1cnJlbnQgPSB2YWx1ZVR5cGVNYW5hZ2VyW3ZhbHVlLnR5cGVdLmNvbWJpbmUoYWN0b3Iuc3RhdGVba2V5XSwgdmFsdWUudGVtcGxhdGUpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgICBhY3Rvci5zdGF0ZS52YWx1ZXNba2V5XSA9IHZhbHVlLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLy8gRmlyZSBgZnJhbWVgIGFuZCBgdXBkYXRlYCBjYWxsYmFja3Mgb24gYWxsIFJvbGVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Sb2xlczsgaSsrKSB7XG4gICAgICAgIGxldCByb2xlID0gYWN0b3Iucm9sZXNbaV07XG4gICAgICAgIGxldCBtYXBwZWRWYWx1ZXMgPSB7fTtcblxuICAgICAgICBlYWNoKGFjdG9yLnN0YXRlLnZhbHVlcywgY3JlYXRlTWFwcGVyKHJvbGUsIG1hcHBlZFZhbHVlcykpO1xuXG4gICAgICAgIGlmIChyb2xlLmZyYW1lKSB7XG4gICAgICAgICAgICByb2xlLmZyYW1lLmNhbGwoYWN0b3IsIG1hcHBlZFZhbHVlcywgYWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvbGUudXBkYXRlICYmIGFjdG9yLmhhc0NoYW5nZWQpIHtcbiAgICAgICAgICAgIHJvbGUudXBkYXRlLmNhbGwoYWN0b3IsIG1hcHBlZFZhbHVlcywgYWN0b3IpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rvci9wb3N0LXJlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQU0sUUFBUSxRQUFRLGNBQVIsQ0FBUjtBQUNOLElBQU0sT0FBTyxNQUFNLElBQU47Ozs7Ozs7OztBQVNiLElBQU0sMkJBQTJCLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDcEQsUUFBSSxXQUFXLElBQVgsQ0FEZ0Q7QUFFcEQsUUFBSSxTQUFTLE1BQU0sS0FBTixDQUFZLE1BQVosQ0FGdUM7O0FBSXBELFNBQUssTUFBTSxhQUFOLEVBQXFCLFVBQUMsR0FBRCxFQUFNLE1BQU4sRUFBaUI7O0FBRXZDLFlBQUksQ0FBQyxNQUFELEVBQVM7QUFBRSxtQkFBRjtTQUFiOztBQUVBLFlBQUksT0FBTyxPQUFQLEVBQWdCO0FBQ2hCLG1CQUFPLE9BQVAsQ0FBZSxJQUFmLENBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBQW1DLEtBQW5DLEVBQTBDLE1BQTFDLEVBRGdCO1NBQXBCOztBQUlBLFlBQUksT0FBTyxRQUFQLElBQW1CLFVBQW5CLEVBQStCO0FBQy9CLG1CQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBcEMsRUFBMkMsTUFBM0MsRUFEK0I7U0FBbkM7O0FBSUEsWUFBSSxPQUFPLFFBQVAsSUFBbUIsT0FBTyxRQUFQLENBQWdCLEtBQWhCLE1BQTJCLEtBQTNCLEVBQWtDO0FBQ3JELHVCQUFXLEtBQVgsQ0FEcUQ7U0FBekQsTUFFTztBQUNILGdCQUFJLE9BQU8sVUFBUCxFQUFtQjtBQUNuQix1QkFBTyxVQUFQLENBQWtCLElBQWxCLENBQXVCLEtBQXZCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBRG1CO2FBQXZCO0FBR0Esa0JBQU0sWUFBTixDQUFtQixHQUFuQixFQUpHO1NBRlA7S0Fac0IsQ0FBMUIsQ0FKb0Q7O0FBMEJwRCxXQUFPLFFBQVAsQ0ExQm9EO0NBQXZCOztBQTZCakMsT0FBTyxPQUFQLEdBQWlCLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDcEMsUUFBSSxNQUFNLFFBQU4sRUFBZ0I7QUFDaEIsY0FBTSxRQUFOLEdBQWlCLEtBQWpCLENBRGdCOztBQUdoQixZQUFJLHlCQUF5QixLQUF6QixFQUFnQyxNQUFNLFVBQU4sQ0FBcEMsRUFBdUQ7QUFDbkQsZ0JBQU0sV0FBVyxNQUFNLEtBQU4sQ0FBWSxNQUFaOzs7QUFEa0MsaUJBSTlDLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxRQUFKLEVBQWMsR0FBOUIsRUFBbUM7QUFDL0Isb0JBQUksT0FBTyxNQUFNLEtBQU4sQ0FBWSxDQUFaLENBQVAsQ0FEMkI7QUFFL0Isb0JBQUksS0FBSyxRQUFMLEVBQWU7QUFDZix5QkFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixLQUFuQixFQUEwQixLQUExQixFQURlO2lCQUFuQjthQUZKOztBQU9BLGdCQUFJLENBQUMsTUFBTSxRQUFOLEVBQWdCO0FBQ2pCLHNCQUFNLElBQU4sR0FEaUI7YUFBckI7U0FYSixNQWNPO0FBQ0gsa0JBQU0sUUFBTixHQUFpQixJQUFqQixDQURHO0FBRUgsa0JBQU0sVUFBTixHQUFtQixLQUFuQixDQUZHO1NBZFA7S0FISjs7QUF1QkEsVUFBTSxVQUFOLEdBQW1CLFVBQW5CLENBeEJvQztDQUF2QiIsImZpbGUiOiJwb3N0LXJlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyk7XG5jb25zdCBlYWNoID0gdXRpbHMuZWFjaDtcblxuLypcbiAgICBDaGVjayBhbGwgQWN0aW9ucyBmb3IgYG9uRW5kYCwgcmV0dXJuIHRydWUgaWYgYWxsIGFyZSB0cnVlXG5cbiAgICBAcGFyYW0gW0FjdG9yXVxuICAgIEBwYXJhbSBbYm9vbGVhbl1cbiAgICBAcmV0dXJucyBbYm9vbGVhbl1cbiovXG5jb25zdCBjaGVja0FsbEFjdGlvbnNIYXZlRW5kZWQgPSAoYWN0b3IsIGhhc0NoYW5nZWQpID0+IHtcbiAgICBsZXQgaGFzRW5kZWQgPSB0cnVlO1xuICAgIGxldCB2YWx1ZXMgPSBhY3Rvci5zdGF0ZS52YWx1ZXM7XG5cbiAgICBlYWNoKGFjdG9yLmFjdGl2ZUFjdGlvbnMsIChrZXksIGFjdGlvbikgPT4ge1xuICAgICAgICAvLyBSZXR1cm4gaWYgYWN0aW9uIGhhcyBiZWVuIGRlbGV0ZWQgZWxzZXdoZXJlXG4gICAgICAgIGlmICghYWN0aW9uKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmIChhY3Rpb24ub25GcmFtZSkge1xuICAgICAgICAgICAgYWN0aW9uLm9uRnJhbWUuY2FsbChhY3RvciwgdmFsdWVzLCBhY3RvciwgYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhY3Rpb24ub25VcGRhdGUgJiYgaGFzQ2hhbmdlZCkge1xuICAgICAgICAgICAgYWN0aW9uLm9uVXBkYXRlLmNhbGwoYWN0b3IsIHZhbHVlcywgYWN0b3IsIGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0aW9uLmhhc0VuZGVkICYmIGFjdGlvbi5oYXNFbmRlZChhY3RvcikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBoYXNFbmRlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGFjdGlvbi5vbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uLm9uQ29tcGxldGUuY2FsbChhY3RvciwgYWN0b3IsIGFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3Rvci51bmJpbmRBY3Rpb24oa2V5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhhc0VuZGVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoYWN0b3IsIGZyYW1lc3RhbXApID0+IHtcbiAgICBpZiAoYWN0b3IuaXNBY3RpdmUpIHtcbiAgICAgICAgYWN0b3IuaXNBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICBpZiAoY2hlY2tBbGxBY3Rpb25zSGF2ZUVuZGVkKGFjdG9yLCBhY3Rvci5oYXNDaGFuZ2VkKSkge1xuICAgICAgICAgICAgY29uc3QgbnVtUm9sZXMgPSBhY3Rvci5yb2xlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIEZpcmUgYGNvbXBsZXRlYCBjYWxsYmFja3NcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm9sZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb2xlID0gYWN0b3Iucm9sZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHJvbGUuY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9sZS5jb21wbGV0ZS5jYWxsKGFjdG9yLCBhY3Rvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWFjdG9yLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgYWN0b3IubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWN0b3IuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgYWN0b3IuZmlyc3RGcmFtZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICAgICAgXG4gICAgYWN0b3IuZnJhbWVzdGFtcCA9IGZyYW1lc3RhbXA7XG59OyJdfQ==

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Role = __webpack_require__(21);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2xlcy9kZWZhdWx0Um9sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTyxRQUFRLFFBQVIsQ0FBUDs7QUFFSixPQUFPLE9BQVAsR0FBaUIsSUFBSSxJQUFKLENBQVM7QUFDdEIsVUFBTSxVQUFVLEtBQVYsRUFBaUI7QUFDbkIsWUFBSSxNQUFNLElBQU4sRUFBWTtBQUNaLGtCQUFNLElBQU4sQ0FBVyxLQUFYLEVBRFk7U0FBaEI7S0FERTs7QUFNTixXQUFPLFVBQVUsS0FBVixFQUFpQjtBQUNwQixZQUFJLE1BQU0sT0FBTixFQUFlO0FBQ2Ysa0JBQU0sT0FBTixDQUFjLEtBQWQsRUFEZTtTQUFuQjtLQURHOztBQU1QLFdBQU8sVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzNCLFlBQUksTUFBTSxPQUFOLEVBQWU7QUFDZixrQkFBTSxPQUFOLENBQWMsS0FBZCxFQUFxQixLQUFyQixFQURlO1NBQW5CO0tBREc7O0FBTVAsWUFBUSxVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0I7QUFDNUIsWUFBSSxNQUFNLFFBQU4sRUFBZ0I7QUFDaEIsa0JBQU0sUUFBTixDQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFEZ0I7U0FBcEI7S0FESTs7QUFNUixjQUFVLFVBQVUsS0FBVixFQUFpQjtBQUN2QixZQUFJLE1BQU0sVUFBTixFQUFrQjtBQUNsQixrQkFBTSxVQUFOLENBQWlCLEtBQWpCLEVBRGtCO1NBQXRCO0tBRE07Q0F6QkcsQ0FBakIiLCJmaWxlIjoiZGVmYXVsdFJvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUm9sZSA9IHJlcXVpcmUoJy4vUm9sZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSb2xlKHtcbiAgICBpbml0OiBmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgaWYgKGFjdG9yLmluaXQpIHtcbiAgICAgICAgICAgIGFjdG9yLmluaXQoYWN0b3IpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgICAgaWYgKGFjdG9yLm9uU3RhcnQpIHtcbiAgICAgICAgICAgIGFjdG9yLm9uU3RhcnQoYWN0b3IpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZyYW1lOiBmdW5jdGlvbiAoc3RhdGUsIGFjdG9yKSB7XG4gICAgICAgIGlmIChhY3Rvci5vbkZyYW1lKSB7XG4gICAgICAgICAgICBhY3Rvci5vbkZyYW1lKHN0YXRlLCBhY3Rvcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoc3RhdGUsIGFjdG9yKSB7XG4gICAgICAgIGlmIChhY3Rvci5vblVwZGF0ZSkge1xuICAgICAgICAgICAgYWN0b3Iub25VcGRhdGUoc3RhdGUsIGFjdG9yKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24gKGFjdG9yKSB7XG4gICAgICAgIGlmIChhY3Rvci5vbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICBhY3Rvci5vbkNvbXBsZXRlKGFjdG9yKTtcbiAgICAgICAgfVxuICAgIH1cbn0pOyJdfQ==

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2xlcy9Sb2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsY0FBUixDQUFSO0FBQ0osSUFBSSxPQUFPLE1BQU0sSUFBTjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQlgsSUFBSSxPQUFPLFVBQVUsT0FBVixFQUFtQjtBQUMxQixRQUFJLE9BQU8sVUFBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCO0FBQ3RDLFlBQUksYUFBYSxPQUFPLElBQVA7OztBQURxQixZQUlsQyxlQUFlLFFBQWYsSUFBMkIsSUFBM0IsRUFBaUM7QUFDakMsaUJBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEI7OztBQURpQyxTQUFyQyxNQUlPLElBQUksZUFBZSxRQUFmLEVBQXlCO0FBQ2hDLHFCQUFLLElBQUwsRUFBVyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ3ZCLHlCQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEdBQWxCLEVBQXVCLEtBQXZCLEVBRHVCO2lCQUFoQixDQUFYOzs7QUFEZ0MsYUFBN0IsTUFNQTtBQUNILDJCQUFPLEtBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsSUFBbEIsQ0FBUCxDQURHO2lCQU5BOztBQVVQLGVBQU8sSUFBUCxDQWxCc0M7S0FBL0IsQ0FEZTs7QUFzQjFCLFNBQUssSUFBTCxHQUFZLEVBQVosQ0F0QjBCOztBQXdCMUIsU0FBSyxPQUFMLEVBQWMsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCO0FBQ2xDLGFBQUssSUFBTCxJQUFhLENBQUUsTUFBTSxLQUFOLENBQVksTUFBWixDQUFELEdBQXdCLE1BQXpCLEdBQWtDLE1BQU0sSUFBTixDQUFXLE1BQVgsQ0FBbEMsQ0FEcUI7S0FBeEIsQ0FBZDs7Ozs7Ozs7Ozs7QUF4QjBCLFFBd0MxQixDQUFLLEdBQUwsR0FBVyxVQUFVLE1BQVYsRUFBa0I7OztBQUd6QixlQUFPLEtBQUMsQ0FBTSxRQUFOLENBQWUsTUFBZixDQUFELEdBQTJCLEtBQUssSUFBTCxDQUFVLE1BQVYsS0FBcUIsTUFBckIsR0FBOEIsV0FBVyxJQUFYLEVBQWlCLE1BQWpCLENBQXpELENBSGtCO0tBQWxCLENBeENlOztBQThDMUIsV0FBTyxJQUFQLENBOUMwQjtDQUFuQjs7Ozs7Ozs7O0FBd0RYLElBQUksYUFBYSxVQUFVLE9BQVYsRUFBbUIsTUFBbkIsRUFBMkI7QUFDeEMsUUFBSSxVQUFVLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBVixDQURvQzs7QUFHeEMsU0FBSyxNQUFMLEVBQWEsVUFBVSxHQUFWLEVBQWUsS0FBZixFQUFzQjtBQUMvQixnQkFBUSxJQUFSLENBQWEsR0FBYixJQUFvQixLQUFwQixDQUQrQjtLQUF0QixDQUFiLENBSHdDOztBQU94QyxXQUFPLE9BQVAsQ0FQd0M7Q0FBM0I7O0FBVWpCLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJSb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyk7XG52YXIgZWFjaCA9IHV0aWxzLmVhY2g7XG5cbi8qXG4gICAgUm9sZSBjbGFzcyBjb25zdHJ1Y3RvclxuXG4gICAgQHBhcmFtIFtvYmplY3RdOiBPcHRpb25hbCBtZXRob2RzIGFuZCBwcm9wcyB0byBhZGQ6XG4gICAgICAgIG5hbWUgW3N0cmluZ106ICAgICAgTmFtZSBvZiBnZW5lcmF0ZWQgZ2V0dGVyL3NldHRlciBtZXRob2Qgb24gQWN0b3JcbiAgICAgICAgX21hcCBbb2JqZWN0XTogICAgICBNYXAgQWN0b3IgdmFsdWVzIHRvIHRoZXNlIHZhbHVlcyBmb3IgdGhpcyBSb2xlXG4gICAgICAgIF90eXBlTWFwIFtvYmplY3RdOiAgTWFwIHZhbHVlcyB0byB2YWx1ZSB0eXBlc1xuICAgICAgICBpbml0IFtmdW5jdGlvbl06ICAgIENhbGxiYWNrIHRvIHJ1biB3aGVuIHRoaXMgUm9sZSBpcyBhZGRlZCB0byBhbiBBY3RvclxuICAgICAgICBzdGFydCBbZnVuY3Rpb25dOiAgIENhbGxiYWNrIHRvIHJ1biB3aGVuIGhvc3QgQWN0b3Igc3RhcnRzIGFuIGFjdGlvblxuICAgICAgICBjb21wbGV0ZSBbZnVuY3Rpb25dOiBDYWxsYmFjayB0byBydW4gd2hlbiBhY3Rpb24gY29tcGxldGVzXG4gICAgICAgIGZyYW1lIFtmdW5jdGlvbl06ICAgQ2FsbGJhY2sgdG8gZmlyZSBvbmNlIHBlciBmcmFtZVxuICAgICAgICB1cGRhdGUgW2Z1bmN0aW9uXTogIENhbGxiYWNrIHRvIGZpcmUgd2hlbiB2YWx1ZXMgY2hhbmdlXG4gICAgICAgIGdldCBbZnVuY3Rpb25dOiAgICAgUmVhZCB2YWx1ZSBmcm9tIGFjdHVhbCBlbGVtZW50XG4gICAgICAgIHNldCBbZnVuY3Rpb25dOiAgICAgU2V0IHZhbHVlIG9uIGFjdHVhbCBlbGVtZW50XG4qL1xudmFyIFJvbGUgPSBmdW5jdGlvbiAobWV0aG9kcykge1xuICAgIHZhciByb2xlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdHMsIHByb3ApIHtcbiAgICAgICAgdmFyIHR5cGVPZk9wdHMgPSB0eXBlb2Ygb3B0cztcblxuICAgICAgICAvLyBTZXQgc2luZ2xlLCBpZiB0aGlzIGlzIGEgc3RyaW5nIGFuZCB3ZSBoYXZlIGEgcHJvcGVydHlcbiAgICAgICAgaWYgKHR5cGVPZk9wdHMgPT09ICdzdHJpbmcnICYmIHByb3ApIHtcbiAgICAgICAgICAgIHJvbGUuc2V0KGVsZW1lbnQsIG9wdHMsIHByb3ApO1xuICAgICAgICBcbiAgICAgICAgLy8gU2V0IG11bHRpLCBpZiB0aGlzIGlzIGFuIG9iamVjdFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVPZk9wdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBlYWNoKG9wdHMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgcm9sZS5zZXQoZWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIE9yIHRoaXMgaXMgYSBnZXQgaWYgd2UgaGF2ZSBhIHN0cmluZyBhbmQgbm8gcHJvcHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb2xlLmdldChlbGVtZW50LCBvcHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb2xlO1xuICAgIH07XG5cbiAgICByb2xlLl9tYXAgPSB7fTtcblxuICAgIGVhY2gobWV0aG9kcywgZnVuY3Rpb24gKG5hbWUsIG1ldGhvZCkge1xuICAgICAgICByb2xlW25hbWVdID0gKCF1dGlscy5pc09iaihtZXRob2QpKSA/IG1ldGhvZCA6IHV0aWxzLmNvcHkobWV0aG9kKTtcbiAgICB9KTtcblxuXG4gICAgLypcbiAgICAgICAgTWFwIHZhbHVlIGtleXMgb3IgZ2VuZXJhdGUgbmV3IFJvbGUgd2l0aCB1cGRhdGVkIG1hcFxuXG4gICAgICAgIEdldHRlcjpcbiAgICAgICAgICAgIEBwYXJhbSBbc3RyaW5nXTogS2V5IHRvIG1hcFxuICAgICAgICAgICAgQHJldHVybiBbc3RyaW5nXTogTWFwcGVkIGtleSwgb3Iga2V5IGlmIG5vIG1hcHBlZCBrZXkgZm91bmRcblxuICAgICAgICBTZXR0ZXI6IFxuICAgICAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBNYXAgb2YgQWN0b3Iga2V5cyAtPiBSb2xlIGtleXNcbiAgICAgICAgICAgIEByZXR1cm4gW1JvbGVdOiBOZXcgUm9sZSB3aXRoIHVuaXF1ZSBtYXBcbiAgICAqL1xuICAgIHJvbGUubWFwID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgc3RyaW5nLCBnZXQgbWFwcGVkIHZhbHVlXG4gICAgICAgIC8vIE90aGVyd2lzZSB0aGlzIGlzIGEgbWFwLCBkdXBsaWNhdGVkIHJvbGUgd2l0aCB1cGRhdGVkIG1hcFxuICAgICAgICByZXR1cm4gKHV0aWxzLmlzU3RyaW5nKHZhbHVlcykpID8gdGhpcy5fbWFwW3ZhbHVlc10gfHwgdmFsdWVzIDogY3JlYXRlUm9sZSh0aGlzLCB2YWx1ZXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcm9sZTtcbn07XG5cbi8qXG4gICAgQ3JlYXRlIGEgbmV3IHJvbGVcblxuICAgIEBwYXJhbSBbb2JqZWN0XTogT3B0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcHMgdG8gYWRkXG4gICAgQHBhcmFtIFt2YWx1ZXNUb01hcF06IE92ZXJyaWRlIGV4aXN0aW5nIG1hcCB3aXRoIHRoZXNlIHZhbHVlc1xuICAgIEByZXR1cm4gW1JvbGVdOiBOZXcgUm9sZVxuKi9cbnZhciBjcmVhdGVSb2xlID0gZnVuY3Rpb24gKG1ldGhvZHMsIHZhbHVlcykge1xuICAgIHZhciBuZXdSb2xlID0gbmV3IFJvbGUobWV0aG9kcyk7XG5cbiAgICBlYWNoKHZhbHVlcywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgbmV3Um9sZS5fbWFwW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdSb2xlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb2xlOyJdfQ==

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(21);
	var build = __webpack_require__(23);

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
	    _map: __webpack_require__(26),
	    _typeMap: __webpack_require__(27),

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9jc3MvY3NzUm9sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVA7QUFDSixJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVI7O0FBRUosSUFBSSxXQUFXLENBQUMsUUFBRCxFQUFVLEtBQVYsRUFBZ0IsR0FBaEIsRUFBb0IsSUFBcEIsRUFBMEIsRUFBMUIsQ0FBWDtBQUNKLElBQUksY0FBYyxTQUFTLE1BQVQ7QUFDbEIsSUFBSSxvQkFBb0IsRUFBcEI7QUFDSixJQUFJLFdBQUo7Ozs7Ozs7O0FBUUEsSUFBSSxhQUFhLFVBQVUsR0FBVixFQUFlO0FBQzVCLGtCQUFjLGVBQWUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWYsQ0FEYzs7QUFHNUIsUUFBSSxrQkFBa0IsR0FBbEIsTUFBMkIsS0FBM0IsRUFBa0M7QUFDbEMsZUFBTyxLQUFQLENBRGtDO0tBQXRDLE1BRU87QUFDSCwwQkFBa0IsR0FBbEIsSUFBeUIsS0FBekIsQ0FERztLQUZQOztBQU1BLFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFdBQUosRUFBaUIsR0FBakMsRUFBc0M7QUFDbEMsWUFBSSxTQUFTLFNBQVMsQ0FBVCxDQUFUO1lBQ0EsV0FBVyxNQUFDLEtBQVcsRUFBWCxHQUFpQixHQUFsQixHQUF3QixTQUFTLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxXQUFkLEVBQVQsR0FBdUMsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUF2QyxDQUZMOztBQUlsQyxZQUFJLFlBQVksWUFBWSxLQUFaLEVBQW1CO0FBQy9CLDhCQUFrQixHQUFsQixJQUF5QixRQUF6QixDQUQrQjtTQUFuQztLQUpKOztBQVNBLFdBQU8sa0JBQWtCLEdBQWxCLENBQVAsQ0FsQjRCO0NBQWY7O0FBcUJqQixJQUFJLFVBQVUsSUFBSSxJQUFKLENBQVM7QUFDbkIsVUFBTSxRQUFRLE9BQVIsQ0FBTjtBQUNBLGNBQVUsUUFBUSxZQUFSLENBQVY7O0FBRUEsVUFBTSxVQUFVLEtBQVYsRUFBaUI7QUFDbkIsY0FBTSxTQUFOLEdBQWtCLEVBQWxCLENBRG1CO0tBQWpCOztBQUlOLFlBQVEsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzVCLGdCQUFRLE1BQU0sT0FBTixFQUFlLE1BQU0sS0FBTixFQUFhLE1BQU0sU0FBTixDQUFwQyxFQUQ0QjtLQUF4Qjs7QUFJUixTQUFLLFVBQVUsT0FBVixFQUFtQixHQUFuQixFQUF3QjtBQUN6QixjQUFNLGtCQUFrQixHQUFsQixLQUEwQixXQUFXLEdBQVgsQ0FBMUIsQ0FEbUI7O0FBR3pCLFlBQUksR0FBSixFQUFTO0FBQ0wsbUJBQU8sT0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxJQUFqQyxFQUF1QyxHQUF2QyxDQUFQLENBREs7U0FBVDtLQUhDOztBQVFMLFNBQUssVUFBVSxPQUFWLEVBQW1CLEdBQW5CLEVBQXdCLEtBQXhCLEVBQStCO0FBQ2hDLGNBQU0sa0JBQWtCLEdBQWxCLEtBQTBCLFdBQVcsR0FBWCxDQUExQixDQUQwQjs7QUFHaEMsWUFBSSxHQUFKLEVBQVM7QUFDTCxvQkFBUSxLQUFSLENBQWMsR0FBZCxJQUFxQixLQUFyQixDQURLO1NBQVQ7S0FIQzs7Q0FwQkssQ0FBVjs7QUE4QkosT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6ImNzc1JvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJvbGUgPSByZXF1aXJlKCcuLi9Sb2xlJyk7XG52YXIgYnVpbGQgPSByZXF1aXJlKCcuL2J1aWxkJyk7XG5cbnZhciBwcmVmaXhlcyA9IFsnV2Via2l0JywnTW96JywnTycsJ21zJywgJyddO1xudmFyIG51bVByZWZpeGVzID0gcHJlZml4ZXMubGVuZ3RoO1xudmFyIHByb3BlcnR5TmFtZUNhY2hlID0ge307XG52YXIgdGVzdEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIFxuLypcbiAgICBUZXN0IHN0eWxlIHByb3BlcnR5IGZvciBwcmVmaXhlZCB2ZXJzaW9uXG4gICAgXG4gICAgQHBhcmFtIFtzdHJpbmddOiBTdHlsZSBwcm9wZXJ0eVxuICAgIEByZXR1cm4gW3N0cmluZ106IENhY2hlZCBwcm9wZXJ0eSBuYW1lXG4qL1xudmFyIHRlc3RQcmVmaXggPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdGVzdEVsZW1lbnQgPSB0ZXN0RWxlbWVudCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGlmIChwcm9wZXJ0eU5hbWVDYWNoZVtrZXldID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJvcGVydHlOYW1lQ2FjaGVba2V5XSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtUHJlZml4ZXM7IGkrKykge1xuICAgICAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV0sXG4gICAgICAgICAgICBwcmVmaXhlZCA9IChwcmVmaXggPT09ICcnKSA/IGtleSA6IHByZWZpeCArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKTtcblxuICAgICAgICBpZiAocHJlZml4ZWQgaW4gdGVzdEVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZUNhY2hlW2tleV0gPSBwcmVmaXhlZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcHJvcGVydHlOYW1lQ2FjaGVba2V5XTtcbn07XG5cbnZhciBjc3NSb2xlID0gbmV3IFJvbGUoe1xuICAgIF9tYXA6IHJlcXVpcmUoJy4vbWFwJyksXG4gICAgX3R5cGVNYXA6IHJlcXVpcmUoJy4vdHlwZS1tYXAnKSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICBhY3Rvci5fY3NzQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoc3RhdGUsIGFjdG9yKSB7XG4gICAgICAgIGNzc1JvbGUoYWN0b3IuZWxlbWVudCwgYnVpbGQoc3RhdGUsIGFjdG9yLl9jc3NDYWNoZSkpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcbiAgICAgICAga2V5ID0gcHJvcGVydHlOYW1lQ2FjaGVba2V5XSB8fCB0ZXN0UHJlZml4KGtleSk7XG5cbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpW2tleV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiAoZWxlbWVudCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBrZXkgPSBwcm9wZXJ0eU5hbWVDYWNoZVtrZXldIHx8IHRlc3RQcmVmaXgoa2V5KTtcblxuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY3NzUm9sZTsiXX0=

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var each = __webpack_require__(4).each,
	    transformDictionary = __webpack_require__(24),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9jc3MvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsSUFBSSxPQUFPLFFBQVEsaUJBQVIsRUFBMkIsSUFBM0I7SUFDUCxzQkFBc0IsUUFBUSx3QkFBUixDQUF0QjtJQUNBLGlCQUFpQixvQkFBb0IsS0FBcEI7SUFFakIsY0FBYyxZQUFkOztBQUVKLE9BQU8sT0FBUCxHQUFpQixVQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUI7QUFDdEMsUUFBSSxNQUFNLEVBQU47UUFDQSxZQUFZLEVBQVo7UUFDQSxnQkFBZ0IsS0FBaEI7OztBQUhrQyxRQU10QyxDQUFLLE1BQUwsRUFBYSxVQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCOztBQUU5QixZQUFJLGVBQWUsR0FBZixDQUFKLEVBQXlCO0FBQ3JCLHlCQUFhLE1BQU0sR0FBTixHQUFZLElBQVosR0FBbUIsR0FBbkIsQ0FEUTtBQUVyQiw0QkFBZ0IsR0FBQyxLQUFRLFdBQVIsR0FBdUIsSUFBeEIsR0FBK0IsYUFBL0I7OztBQUZLLFNBQXpCLE1BS087QUFDSCxvQkFBSSxTQUFTLE1BQU0sR0FBTixDQUFULEVBQXFCO0FBQ3JCLDBCQUFNLEdBQU4sSUFBYSxJQUFJLEdBQUosSUFBVyxJQUFYLENBRFE7aUJBQXpCO2FBTko7S0FGUyxDQUFiOzs7QUFOc0MsUUFxQmxDLGNBQWMsRUFBZCxFQUFrQjtBQUNsQixZQUFJLENBQUMsYUFBRCxFQUFnQjtBQUNoQix5QkFBYSxNQUFNLFdBQU4sR0FBb0IsT0FBcEIsQ0FERztTQUFwQjs7QUFJQSxZQUFJLGNBQWMsTUFBTSxTQUFOLEVBQWlCO0FBQy9CLGdCQUFJLFNBQUosR0FBZ0IsU0FBaEIsQ0FEK0I7U0FBbkM7O0FBSUEsY0FBTSxTQUFOLEdBQWtCLFNBQWxCLENBVGtCO0tBQXRCOztBQVlBLFdBQU8sR0FBUCxDQWpDc0M7Q0FBekIiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVhY2ggPSByZXF1aXJlKCcuLi8uLi9pbmMvdXRpbHMnKS5lYWNoLFxuICAgIHRyYW5zZm9ybURpY3Rpb25hcnkgPSByZXF1aXJlKCcuL3RyYW5zZm9ybS1kaWN0aW9uYXJ5JyksXG4gICAgdHJhbnNmb3JtUHJvcHMgPSB0cmFuc2Zvcm1EaWN0aW9uYXJ5LnByb3BzLFxuXG4gICAgVFJBTlNMQVRFX1ogPSAndHJhbnNsYXRlWic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG91dHB1dCwgY2FjaGUpIHtcbiAgICB2YXIgY3NzID0ge30sXG4gICAgICAgIHRyYW5zZm9ybSA9ICcnLFxuICAgICAgICB0cmFuc2Zvcm1IYXNaID0gZmFsc2U7XG4gICAgICAgIFxuICAgIC8vIExvb3AgdGhyb3VnaCBvdXRwdXQsIGNoZWNrIGZvciB0cmFuc2Zvcm0gcHJvcGVydGllc1xuICAgIGVhY2gob3V0cHV0LCBmdW5jdGlvbiAoa2V5LCBydWxlKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc2Zvcm0gcHJvcGVydHksIGFkZCB0byB0cmFuc2Zvcm0gc3RyaW5nXG4gICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wc1trZXldKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0gKz0ga2V5ICsgJygnICsgcnVsZSArICcpJztcbiAgICAgICAgICAgIHRyYW5zZm9ybUhhc1ogPSAoa2V5ID09PSBUUkFOU0xBVEVfWikgPyB0cnVlIDogdHJhbnNmb3JtSGFzWjtcbiAgICAgICAgXG4gICAgICAgIC8vIE9yIGp1c3QgYXNzaWduIGRpcmVjdGx5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocnVsZSAhPT0gY2FjaGVba2V5XSkge1xuICAgICAgICAgICAgICAgIGNhY2hlW2tleV0gPSBjc3Nba2V5XSA9IHJ1bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIElmIHdlIGhhdmUgdHJhbnNmb3JtIHByb3BlcnRpZXMsIGFkZCB0cmFuc2xhdGVaXG4gICAgaWYgKHRyYW5zZm9ybSAhPT0gJycpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1IYXNaKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0gKz0gJyAnICsgVFJBTlNMQVRFX1ogKyAnKDBweCknO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyYW5zZm9ybSAhPT0gY2FjaGUudHJhbnNmb3JtKSB7XG4gICAgICAgICAgICBjc3MudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjYWNoZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzcztcbn07Il19

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var positionTerms = __webpack_require__(25).positions,
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9jc3MvdHJhbnNmb3JtLWRpY3Rpb25hcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSx1Q0FBUixFQUFpRCxTQUFqRDtJQUNoQixtQkFBbUIsY0FBYyxNQUFkO0lBRW5CLHdCQUF3QixzQkFBeEI7SUFDQSxRQUFRLE9BQVI7SUFDQSxTQUFTLFFBQVQ7SUFDQSxRQUFRO0FBQ0osV0FBTyxDQUFDLFdBQUQsRUFBYyxLQUFkLEVBQXFCLE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDLHFCQUFyQyxDQUFQO0FBQ0EsV0FBTyxFQUFQO0FBRkksQ0FBUjs7O0FBTUosQ0FBQyxZQUFZO0FBQ1QsUUFBSSxRQUFRLE1BQU0sS0FBTjtRQUNSLFFBQVEsTUFBTSxLQUFOO1FBQ1IsV0FBVyxNQUFNLE1BQU47UUFDWCxJQUFJLENBQUo7UUFFQSxjQUFjLFVBQVUsUUFBVixFQUFvQjtBQUM5QixZQUFJLElBQUksQ0FBSixDQUQwQjs7QUFHOUIsZUFBTyxJQUFJLGdCQUFKLEVBQXNCLEdBQTdCLEVBQWtDO0FBQzlCLGtCQUFNLFdBQVcsY0FBYyxDQUFkLENBQVgsQ0FBTixHQUFxQyxJQUFyQyxDQUQ4QjtTQUFsQztLQUhVOzs7QUFOVCxTQWVULENBQU0sTUFBTixJQUFnQixNQUFNLEtBQU4sSUFBZSxNQUFNLHFCQUFOLElBQStCLElBQS9COzs7QUFmdEIsV0FrQkYsSUFBSSxRQUFKLEVBQWMsR0FBckIsRUFBMEI7QUFDdEIsb0JBQVksTUFBTSxDQUFOLENBQVosRUFEc0I7S0FBMUI7Q0FsQkgsQ0FBRDs7QUF1QkEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6InRyYW5zZm9ybS1kaWN0aW9uYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwb3NpdGlvblRlcm1zID0gcmVxdWlyZSgnLi4vLi4vdmFsdWUtdHlwZXMvc2V0dGluZ3MvZGljdGlvbmFyeScpLnBvc2l0aW9ucyxcbiAgICBudW1Qb3NpdGlvblRlcm1zID0gcG9zaXRpb25UZXJtcy5sZW5ndGgsXG5cbiAgICBUUkFOU0ZPUk1fUEVSU1BFQ1RJVkUgPSAndHJhbnNmb3JtUGVyc3BlY3RpdmUnLFxuICAgIFNDQUxFID0gJ3NjYWxlJyxcbiAgICBST1RBVEUgPSAncm90YXRlJyxcbiAgICB0ZXJtcyA9IHtcbiAgICAgICAgZnVuY3M6IFsndHJhbnNsYXRlJywgU0NBTEUsIFJPVEFURSwgJ3NrZXcnLCBUUkFOU0ZPUk1fUEVSU1BFQ1RJVkVdLFxuICAgICAgICBwcm9wczoge30gLy8gb2JqZWN0cyBhcmUgZmFzdGVyIGF0IGRpcmVjdCBsb29rdXBzXG4gICAgfTtcblxuLy8gQ3JlYXRlIHRyYW5zZm9ybSB0ZXJtc1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVuY3MgPSB0ZXJtcy5mdW5jcyxcbiAgICAgICAgcHJvcHMgPSB0ZXJtcy5wcm9wcyxcbiAgICAgICAgbnVtRnVuY3MgPSBmdW5jcy5sZW5ndGgsXG4gICAgICAgIGkgPSAwLFxuXG4gICAgICAgIGNyZWF0ZVByb3BzID0gZnVuY3Rpb24gKGZ1bmNOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoOyBqIDwgbnVtUG9zaXRpb25UZXJtczsgaisrKSB7XG4gICAgICAgICAgICAgICAgcHJvcHNbZnVuY05hbWUgKyBwb3NpdGlvblRlcm1zW2pdXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgXG4gICAgLy8gTWFudWFsbHkgYWRkIHNrZXcgYW5kIHRyYW5zZm9ybSBwZXJzcGVjdGl2ZSAgXG4gICAgcHJvcHNbUk9UQVRFXSA9IHByb3BzW1NDQUxFXSA9IHByb3BzW1RSQU5TRk9STV9QRVJTUEVDVElWRV0gPSB0cnVlO1xuICAgIFxuICAgIC8vIExvb3Agb3ZlciBlYWNoIGZ1bmN0aW9uIG5hbWUgYW5kIGNyZWF0ZSBmdW5jdGlvbi9wcm9wZXJ0eSB0ZXJtc1xuICAgIGZvciAoOyBpIDwgbnVtRnVuY3M7IGkrKykge1xuICAgICAgICBjcmVhdGVQcm9wcyhmdW5jc1tpXSk7XG4gICAgfVxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXJtczsiXX0=

/***/ },
/* 25 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9zZXR0aW5ncy9kaWN0aW9uYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxJQUFJLEdBQUo7SUFDQSxJQUFJLEdBQUo7SUFDQSxRQUFRLE9BQVI7SUFFQSxRQUFRO0FBQ0osWUFBUSxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLE1BQWpCLEVBQXlCLEtBQXpCLENBQVI7QUFDQSxlQUFXLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxHQUFQLENBQVg7QUFDQSxnQkFBWSxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLENBQVo7QUFDQSxZQUFRLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxRQUFQLEVBQWlCLFFBQWpCLEVBQTJCLE9BQTNCLENBQVI7QUFDQSxTQUFLLENBQUMsS0FBRCxFQUFRLFlBQVIsRUFBc0IsV0FBdEIsRUFBbUMsS0FBbkMsQ0FBTDtDQUxKOztBQVFKLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJkaWN0aW9uYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFggPSAnWCcsXG4gICAgWSA9ICdZJyxcbiAgICBBTFBIQSA9ICdBbHBoYScsXG5cbiAgICB0ZXJtcyA9IHtcbiAgICAgICAgY29sb3JzOiBbJ1JlZCcsICdHcmVlbicsICdCbHVlJywgQUxQSEFdLFxuICAgICAgICBwb3NpdGlvbnM6IFtYLCBZLCAnWiddLFxuICAgICAgICBkaW1lbnNpb25zOiBbJ1RvcCcsICdSaWdodCcsICdCb3R0b20nLCAnTGVmdCddLFxuICAgICAgICBzaGFkb3c6IFtYLCBZLCAnUmFkaXVzJywgJ1NwcmVhZCcsICdDb2xvciddLFxuICAgICAgICBoc2w6IFsnSHVlJywgJ1NhdHVyYXRpb24nLCAnTGlnaHRuZXNzJywgQUxQSEFdXG4gICAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXJtczsiXX0=

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	var TRANSLATE = 'translate';

	module.exports = {
	    x: TRANSLATE + 'X',
	    y: TRANSLATE + 'Y',
	    z: TRANSLATE + 'Z'
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9jc3MvbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFdBQVo7O0FBRUosT0FBTyxPQUFQLEdBQWlCO0FBQ2IsT0FBRyxZQUFZLEdBQVo7QUFDSCxPQUFHLFlBQVksR0FBWjtBQUNILE9BQUcsWUFBWSxHQUFaO0NBSFAiLCJmaWxlIjoibWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFRSQU5TTEFURSA9ICd0cmFuc2xhdGUnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB4OiBUUkFOU0xBVEUgKyAnWCcsXG4gICAgeTogVFJBTlNMQVRFICsgJ1knLFxuICAgIHo6IFRSQU5TTEFURSArICdaJ1xufTsiXX0=

/***/ },
/* 27 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9jc3MvdHlwZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsT0FBUjtJQUNBLFlBQVksV0FBWjtJQUNBLGFBQWEsWUFBYjtJQUNBLFFBQVEsT0FBUjtJQUNBLFNBQVMsUUFBVDtJQUNBLFFBQVEsT0FBUjtJQUNBLFFBQVEsT0FBUjtJQUNBLEtBQUssSUFBTDs7QUFFSixPQUFPLE9BQVAsR0FBaUI7O0FBRWIsV0FBTyxLQUFQO0FBQ0EscUJBQWlCLEtBQWpCO0FBQ0Esa0JBQWMsS0FBZDtBQUNBLFVBQU0sS0FBTjtBQUNBLFlBQVEsS0FBUjs7QUFFQSxpQkFBYSxLQUFiO0FBQ0Esb0JBQWdCLEtBQWhCO0FBQ0Esc0JBQWtCLEtBQWxCO0FBQ0EsdUJBQW1CLEtBQW5CO0FBQ0EscUJBQWlCLEtBQWpCO0FBQ0Esa0JBQWMsRUFBZDs7QUFFQSxZQUFRLFVBQVI7QUFDQSxhQUFTLFVBQVQ7QUFDQSxXQUFPLEVBQVA7QUFDQSxZQUFRLEVBQVI7O0FBRUEsd0JBQW9CLFNBQXBCO0FBQ0EsdUJBQW1CLFNBQW5CO0FBQ0EscUJBQWlCLFNBQWpCOztBQUVBLGdCQUFZLE1BQVo7QUFDQSxlQUFXLE1BQVg7O0FBRUEsWUFBUSxLQUFSO0FBQ0EsYUFBUyxLQUFUO0FBQ0EsYUFBUyxLQUFUO0FBQ0EsYUFBUyxLQUFUO0FBQ0EsV0FBTyxLQUFQO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsV0FBTyxLQUFQO0FBQ0EsV0FBTyxLQUFQO0FBQ0EsY0FBVSxFQUFWO0FBQ0EsZ0JBQVksRUFBWjtBQUNBLGdCQUFZLEVBQVo7QUFDQSxnQkFBWSxFQUFaO0FBQ0EsaUJBQWEsRUFBYjtBQUNBLGFBQVMsS0FBVDtDQTFDSiIsImZpbGUiOiJ0eXBlLW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDT0xPUiA9ICdjb2xvcicsXG4gICAgUE9TSVRJT05TID0gJ3Bvc2l0aW9ucycsXG4gICAgRElNRU5TSU9OUyA9ICdkaW1lbnNpb25zJyxcbiAgICBTQ0FMRSA9ICdzY2FsZScsXG4gICAgU0hBRE9XID0gJ3NoYWRvdycsXG4gICAgQU5HTEUgPSAnYW5nbGUnLFxuICAgIEFMUEhBID0gJ2FscGhhJyxcbiAgICBQWCA9ICdweCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIENvbG9yIHByb3BlcnRpZXNcbiAgICBjb2xvcjogQ09MT1IsXG4gICAgYmFja2dyb3VuZENvbG9yOiBDT0xPUixcbiAgICBvdXRsaW5lQ29sb3I6IENPTE9SLFxuICAgIGZpbGw6IENPTE9SLFxuICAgIHN0cm9rZTogQ09MT1IsXG4gICAgLy8gQm9yZGVyXG4gICAgYm9yZGVyQ29sb3I6IENPTE9SLFxuICAgIGJvcmRlclRvcENvbG9yOiBDT0xPUixcbiAgICBib3JkZXJSaWdodENvbG9yOiBDT0xPUixcbiAgICBib3JkZXJCb3R0b21Db2xvcjogQ09MT1IsXG4gICAgYm9yZGVyTGVmdENvbG9yOiBDT0xPUixcbiAgICBib3JkZXJSYWRpdXM6IFBYLFxuICAgIC8vIERpbWVuc2lvbnNcbiAgICBtYXJnaW46IERJTUVOU0lPTlMsXG4gICAgcGFkZGluZzogRElNRU5TSU9OUyxcbiAgICB3aWR0aDogUFgsXG4gICAgaGVpZ2h0OiBQWCwgICAgXG4gICAgLy8gUG9zaXRpb25zXG4gICAgYmFja2dyb3VuZFBvc2l0aW9uOiBQT1NJVElPTlMsXG4gICAgcGVyc3BlY3RpdmVPcmlnaW46IFBPU0lUSU9OUyxcbiAgICB0cmFuc2Zvcm1PcmlnaW46IFBPU0lUSU9OUyxcbiAgICAvLyBTaGFkb3dzXG4gICAgdGV4dFNoYWRvdzogU0hBRE9XLFxuICAgIGJveFNoYWRvdzogU0hBRE9XLCAgICBcbiAgICAvLyBUcmFuc2Zvcm0gcHJvcGVydGllc1xuICAgIHJvdGF0ZTogQU5HTEUsXG4gICAgcm90YXRlWDogQU5HTEUsXG4gICAgcm90YXRlWTogQU5HTEUsXG4gICAgcm90YXRlWjogQU5HTEUsXG4gICAgc2NhbGU6IFNDQUxFLFxuICAgIHNjYWxlWDogU0NBTEUsXG4gICAgc2NhbGVZOiBTQ0FMRSxcbiAgICBzY2FsZVo6IFNDQUxFLFxuICAgIHNrZXdYOiBBTkdMRSxcbiAgICBza2V3WTogQU5HTEUsXG4gICAgZGlzdGFuY2U6IFBYLFxuICAgIHRyYW5zbGF0ZVg6IFBYLFxuICAgIHRyYW5zbGF0ZVk6IFBYLFxuICAgIHRyYW5zbGF0ZVo6IFBYLFxuICAgIHBlcnNwZWN0aXZlOiBQWCxcbiAgICBvcGFjaXR5OiBBTFBIQVxufTsiXX0=

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(21),
	    attrRole = __webpack_require__(29),
	    build = __webpack_require__(30),
	    each = __webpack_require__(4).each;

	module.exports = new Role({
	    _map: __webpack_require__(26),
	    _typeMap: __webpack_require__(31),

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9zdmcvc3ZnUm9sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVA7SUFDQSxXQUFXLFFBQVEsa0JBQVIsQ0FBWDtJQUNBLFFBQVEsUUFBUSxTQUFSLENBQVI7SUFDQSxPQUFPLFFBQVEsaUJBQVIsRUFBMkIsSUFBM0I7O0FBRVgsT0FBTyxPQUFQLEdBQWlCLElBQUksSUFBSixDQUFTO0FBQ3RCLFVBQU0sUUFBUSxZQUFSLENBQU47QUFDQSxjQUFVLFFBQVEsWUFBUixDQUFWOztBQUVBLFdBQU8sWUFBWTtBQUNmLFlBQUksY0FBYyxLQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQWQ7WUFDQSxTQUFTLEtBQUssTUFBTDs7O0FBRVQsMkJBQW1CLE9BQU8sZ0JBQVAsR0FBMEIsT0FBTyxnQkFBUCxDQUF3QixPQUF4QixHQUFrQyxFQUE1RDtZQUNuQixtQkFBbUIsT0FBTyxnQkFBUCxHQUEwQixPQUFPLGdCQUFQLENBQXdCLE9BQXhCLEdBQWtDLEVBQTVEO1lBQ25CLFNBQVM7QUFDTCxlQUFHLFlBQVksS0FBWixJQUFxQixtQkFBbUIsR0FBbkIsQ0FBckIsR0FBK0MsWUFBWSxDQUFaO0FBQ2xELGVBQUcsWUFBWSxNQUFaLElBQXNCLG1CQUFtQixHQUFuQixDQUF0QixHQUFnRCxZQUFZLENBQVo7U0FGdkQsQ0FOVzs7QUFXZixhQUFLLFNBQUwsR0FBaUIsTUFBakIsQ0FYZTtLQUFaOztBQWNQLFlBQVEsVUFBVSxLQUFWLEVBQWlCO0FBQ3JCLFlBQUksUUFBUSxJQUFSLENBRGlCO0FBRXJCLGFBQUssTUFBTSxLQUFOLEVBQWEsS0FBSyxTQUFMLENBQWxCLEVBQW1DLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDckQscUJBQVMsR0FBVCxDQUFhLE1BQU0sT0FBTixFQUFlLEdBQTVCLEVBQWlDLEtBQWpDLEVBRHFEO1NBQXRCLENBQW5DLENBRnFCO0tBQWpCOztDQWxCSyxDQUFqQiIsImZpbGUiOiJzdmdSb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSb2xlID0gcmVxdWlyZSgnLi4vUm9sZScpLFxuICAgIGF0dHJSb2xlID0gcmVxdWlyZSgnLi4vYXR0ci9hdHRyUm9sZScpLFxuICAgIGJ1aWxkID0gcmVxdWlyZSgnLi9idWlsZCcpLFxuICAgIGVhY2ggPSByZXF1aXJlKCcuLi8uLi9pbmMvdXRpbHMnKS5lYWNoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSb2xlKHtcbiAgICBfbWFwOiByZXF1aXJlKCcuLi9jc3MvbWFwJyksXG4gICAgX3R5cGVNYXA6IHJlcXVpcmUoJy4vdHlwZS1tYXAnKSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib3VuZGluZ0JveCA9IHRoaXMuZWxlbWVudC5nZXRCQm94KCksXG4gICAgICAgICAgICB2YWx1ZXMgPSB0aGlzLnZhbHVlcyxcbiAgICAgICAgICAgIC8vIFRPRE86IFN1cHBvcnQgcHhcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpblggPSB2YWx1ZXMudHJhbnNmb3JtT3JpZ2luWCA/IHZhbHVlcy50cmFuc2Zvcm1PcmlnaW5YLmN1cnJlbnQgOiA1MCxcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpblkgPSB2YWx1ZXMudHJhbnNmb3JtT3JpZ2luWSA/IHZhbHVlcy50cmFuc2Zvcm1PcmlnaW5ZLmN1cnJlbnQgOiA1MCxcbiAgICAgICAgICAgIG9yaWdpbiA9IHtcbiAgICAgICAgICAgICAgICB4OiBib3VuZGluZ0JveC53aWR0aCAqICh0cmFuc2Zvcm1PcmlnaW5YIC8gMTAwKSArIGJvdW5kaW5nQm94LngsXG4gICAgICAgICAgICAgICAgeTogYm91bmRpbmdCb3guaGVpZ2h0ICogKHRyYW5zZm9ybU9yaWdpblkgLyAxMDApICsgYm91bmRpbmdCb3gueVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnN2Z09yaWdpbiA9IG9yaWdpbjtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGFjdG9yID0gdGhpcztcbiAgICAgICAgZWFjaChidWlsZChzdGF0ZSwgdGhpcy5zdmdPcmlnaW4pLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgYXR0clJvbGUuc2V0KGFjdG9yLmVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pOyJdfQ==

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(21);
	var each = __webpack_require__(4).each;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9hdHRyL2F0dHJSb2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUksT0FBTyxRQUFRLFNBQVIsQ0FBUDtBQUNKLElBQUksT0FBTyxRQUFRLGlCQUFSLEVBQTJCLElBQTNCOztBQUVYLElBQUksV0FBVyxJQUFJLElBQUosQ0FBUztBQUNwQixZQUFRLFVBQVUsS0FBVixFQUFpQjtBQUNyQixZQUFJLFFBQVEsSUFBUixDQURpQjs7QUFHckIsYUFBSyxLQUFMLEVBQVksVUFBVSxHQUFWLEVBQWUsS0FBZixFQUFzQjtBQUM5QixxQkFBUyxHQUFULENBQWEsTUFBTSxPQUFOLEVBQWUsR0FBNUIsRUFBaUMsS0FBakMsRUFEOEI7U0FBdEIsQ0FBWixDQUhxQjtLQUFqQjs7QUFRUixTQUFLLFVBQVUsT0FBVixFQUFtQixHQUFuQixFQUF3QjtBQUN6QixlQUFPLFFBQVEsWUFBUixDQUFxQixHQUFyQixDQUFQLENBRHlCO0tBQXhCOztBQUlMLFNBQUssVUFBVSxPQUFWLEVBQW1CLEdBQW5CLEVBQXdCLEtBQXhCLEVBQStCO0FBQ2hDLGdCQUFRLFlBQVIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFEZ0M7S0FBL0I7Q0FiTSxDQUFYOztBQWtCSixPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiYXR0clJvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJvbGUgPSByZXF1aXJlKCcuLi9Sb2xlJyk7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4uLy4uL2luYy91dGlscycpLmVhY2g7XG5cbnZhciBhdHRyUm9sZSA9IG5ldyBSb2xlKHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICB2YXIgYWN0b3IgPSB0aGlzO1xuXG4gICAgICAgIGVhY2goc3RhdGUsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBhdHRyUm9sZS5zZXQoYWN0b3IuZWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGtleSk7XG4gICAgfSxcblxuICAgIHNldDogZnVuY3Rpb24gKGVsZW1lbnQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXR0clJvbGU7XG5cbiJdfQ==

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var transformDictionary = __webpack_require__(24);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9zdmcvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLFFBQVEsUUFBUSxpQkFBUixDQUFSO0FBQ04sSUFBTSxzQkFBc0IsUUFBUSw2QkFBUixDQUF0Qjs7QUFFTixJQUFNLE9BQU8sTUFBTSxJQUFOO0FBQ2IsSUFBTSxjQUFjLE1BQU0sV0FBTjtBQUNwQixJQUFNLGlCQUFpQixvQkFBb0IsS0FBcEI7QUFDdkIsSUFBTSxjQUFjLE1BQWQ7O0FBRU4sT0FBTyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQjtBQUN2QyxRQUFJLFFBQVEsRUFBUjtRQUNBLGVBQWUsS0FBZjtRQUNBLFFBQVEsT0FBTyxLQUFQLEtBQWlCLFNBQWpCLEdBQTZCLE9BQU8sS0FBUCxJQUFnQixXQUFoQixHQUE4QixPQUFPLE1BQVAsSUFBaUIsQ0FBakI7UUFDbkUsU0FBUyxPQUFPLE1BQVAsS0FBa0IsU0FBbEIsR0FBOEIsT0FBTyxNQUFQLElBQWlCLFdBQWpCLEdBQStCLFNBQVMsQ0FBVDtRQUN0RSxtQkFBbUIsT0FBTyxDQUFQO1FBQ25CLG1CQUFtQixPQUFPLENBQVA7UUFDbkIsa0JBQWtCLENBQUUsZ0JBQUYsSUFBc0IsUUFBUSxDQUFSLENBQXRCO1FBQ2xCLGtCQUFrQixDQUFFLGdCQUFGLElBQXNCLFNBQVMsQ0FBVCxDQUF0QjtRQUNsQixnQkFBZ0IsbUJBQW1CLEtBQW5CO1FBQ2hCLGdCQUFnQixtQkFBbUIsTUFBbkI7UUFDaEIsWUFBWTtBQUNSLGtDQUF3QixPQUFPLFVBQVAsVUFBc0IsT0FBTyxVQUFQLE9BQTlDO0FBQ0EsOEJBQW9CLHlCQUFvQiwrQkFBMEIsZUFBVSwwQkFBcUIsdUJBQWtCLG9CQUFuSDtBQUNBLDRCQUFrQixPQUFPLE1BQVAsVUFBa0IsMEJBQXFCLHVCQUF6RDtBQUNBLDBCQUFnQixPQUFPLEtBQVAsT0FBaEI7QUFDQSwwQkFBZ0IsT0FBTyxLQUFQLE9BQWhCO0tBTEosQ0FYbUM7O0FBbUJ2QyxTQUFLLE1BQUwsRUFBYSxVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQy9CLFlBQUksZUFBZSxHQUFmLENBQUosRUFBeUI7QUFDckIsMkJBQWUsSUFBZixDQURxQjtTQUF6QixNQUVPO0FBQ0gsa0JBQU0sWUFBWSxHQUFaLENBQU4sSUFBMEIsS0FBMUIsQ0FERztTQUZQO0tBRFMsQ0FBYixDQW5CdUM7O0FBMkJ2QyxRQUFJLFlBQUosRUFBa0I7QUFDZCxjQUFNLFNBQU4sR0FBa0IsRUFBbEIsQ0FEYzs7QUFHZCxhQUFLLFNBQUwsRUFBZ0IsVUFBVSxHQUFWLEVBQWUsS0FBZixFQUFzQjtBQUNsQyxnQkFBSSxlQUFlLEdBQUMsS0FBUSxPQUFSLEdBQW1CLEdBQXBCLEdBQTBCLEdBQTFCLENBRGU7QUFFbEMsa0JBQU0sU0FBTixJQUFtQixNQUFNLE9BQU4sQ0FBYyxZQUFkLEVBQTRCLFlBQTVCLENBQW5CLENBRmtDO1NBQXRCLENBQWhCLENBSGM7S0FBbEI7O0FBU0EsV0FBTyxLQUFQLENBcEN1QztDQUExQiIsImZpbGUiOiJidWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vLi4vaW5jL3V0aWxzJyk7XG5jb25zdCB0cmFuc2Zvcm1EaWN0aW9uYXJ5ID0gcmVxdWlyZSgnLi4vY3NzL3RyYW5zZm9ybS1kaWN0aW9uYXJ5Jyk7XG5cbmNvbnN0IGVhY2ggPSB1dGlscy5lYWNoO1xuY29uc3QgY2FtZWxUb0Rhc2ggPSB1dGlscy5jYW1lbFRvRGFzaDtcbmNvbnN0IHRyYW5zZm9ybVByb3BzID0gdHJhbnNmb3JtRGljdGlvbmFyeS5wcm9wcztcbmNvbnN0IHplcm9Ob3RaZXJvID0gMC4wMDAxO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvdXRwdXQsIG9yaWdpbikge1xuICAgIGxldCBwcm9wcyA9IHt9LFxuICAgICAgICBoYXNUcmFuc2Zvcm0gPSBmYWxzZSxcbiAgICAgICAgc2NhbGUgPSBvdXRwdXQuc2NhbGUgIT09IHVuZGVmaW5lZCA/IG91dHB1dC5zY2FsZSB8fCB6ZXJvTm90WmVybyA6IG91dHB1dC5zY2FsZVggfHwgMSxcbiAgICAgICAgc2NhbGVZID0gb3V0cHV0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gb3V0cHV0LnNjYWxlWSB8fCB6ZXJvTm90WmVybyA6IHNjYWxlIHx8IDEsXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpblggPSBvcmlnaW4ueCxcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luWSA9IG9yaWdpbi55LFxuICAgICAgICBzY2FsZVRyYW5zZm9ybVggPSAtIHRyYW5zZm9ybU9yaWdpblggKiAoc2NhbGUgKiAxKSxcbiAgICAgICAgc2NhbGVUcmFuc2Zvcm1ZID0gLSB0cmFuc2Zvcm1PcmlnaW5ZICogKHNjYWxlWSAqIDEpLFxuICAgICAgICBzY2FsZVJlcGxhY2VYID0gdHJhbnNmb3JtT3JpZ2luWCAvIHNjYWxlLFxuICAgICAgICBzY2FsZVJlcGxhY2VZID0gdHJhbnNmb3JtT3JpZ2luWSAvIHNjYWxlWSxcbiAgICAgICAgdHJhbnNmb3JtID0ge1xuICAgICAgICAgICAgdHJhbnNsYXRlOiBgdHJhbnNsYXRlKCR7b3V0cHV0LnRyYW5zbGF0ZVh9LCAke291dHB1dC50cmFuc2xhdGVZfSkgYCxcbiAgICAgICAgICAgIHNjYWxlOiBgdHJhbnNsYXRlKCR7c2NhbGVUcmFuc2Zvcm1YfSwgJHtzY2FsZVRyYW5zZm9ybVl9KSBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZVl9KSB0cmFuc2xhdGUoJHtzY2FsZVJlcGxhY2VYfSwgJHtzY2FsZVJlcGxhY2VZfSkgYCxcbiAgICAgICAgICAgIHJvdGF0ZTogYHJvdGF0ZSgke291dHB1dC5yb3RhdGV9LCAke3RyYW5zZm9ybU9yaWdpblh9LCAke3RyYW5zZm9ybU9yaWdpbll9KSBgLFxuICAgICAgICAgICAgc2tld1g6IGBza2V3WCgke291dHB1dC5za2V3WH0pIGAsXG4gICAgICAgICAgICBza2V3WTogYHNrZXdZKCR7b3V0cHV0LnNrZXdZfSkgYFxuICAgICAgICB9O1xuXG4gICAgZWFjaChvdXRwdXQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wc1trZXldKSB7XG4gICAgICAgICAgICBoYXNUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcHNbY2FtZWxUb0Rhc2goa2V5KV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGhhc1RyYW5zZm9ybSkge1xuICAgICAgICBwcm9wcy50cmFuc2Zvcm0gPSAnJztcblxuICAgICAgICBlYWNoKHRyYW5zZm9ybSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAoa2V5ID09PSAnc2NhbGUnKSA/ICcxJyA6ICcwJztcbiAgICAgICAgICAgIHByb3BzLnRyYW5zZm9ybSArPSB2YWx1ZS5yZXBsYWNlKC91bmRlZmluZWQvZywgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3BzO1xufTsiXX0=

/***/ },
/* 31 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9zdmcvdHlwZS1tYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLFFBQVEsT0FBUjtBQUNOLElBQU0sUUFBUSxPQUFSO0FBQ04sSUFBTSxRQUFRLE9BQVI7O0FBRU4sT0FBTyxPQUFQLEdBQWlCO0FBQ2IsVUFBTSxLQUFOO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsV0FBTyxLQUFQO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsWUFBUSxLQUFSO0FBQ0EscUJBQWlCLFdBQWpCO0FBQ0EsT0FBRyxTQUFIO0FBQ0EsYUFBUyxLQUFUO0FBQ0EsaUJBQWEsS0FBYjtBQUNBLG1CQUFlLEtBQWY7Q0FWSiIsImZpbGUiOiJ0eXBlLW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFMUEhBID0gJ2FscGhhJztcbmNvbnN0IENPTE9SID0gJ2NvbG9yJztcbmNvbnN0IFNDQUxFID0gJ3NjYWxlJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZmlsbDogQ09MT1IsXG4gICAgc3Ryb2tlOiBDT0xPUixcbiAgICBzY2FsZTogU0NBTEUsXG4gICAgc2NhbGVYOiBTQ0FMRSxcbiAgICBzY2FsZVk6IFNDQUxFLFxuICAgIHRyYW5zZm9ybU9yaWdpbjogJ3Bvc2l0aW9ucycsXG4gICAgZDogJ2NvbXBsZXgnLFxuICAgIG9wYWNpdHk6IEFMUEhBLFxuICAgIGZpbGxPcGFjaXR5OiBBTFBIQSxcbiAgICBzdHJva2VPcGFjaXR5OiBBTFBIQVxufTsiXX0=

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Role = __webpack_require__(21);
	var attrRole = __webpack_require__(29);
	var each = __webpack_require__(4).each;

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
	    _map: __webpack_require__(33),

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9wYXRoL2RyYXdQYXRoUm9sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVA7QUFDSixJQUFJLFdBQVcsUUFBUSxrQkFBUixDQUFYO0FBQ0osSUFBSSxPQUFPLFFBQVEsaUJBQVIsRUFBMkIsSUFBM0I7Ozs7Ozs7O0FBUVgsSUFBSSxrQkFBa0IsVUFBVSxVQUFWLEVBQXNCLE1BQXRCLEVBQThCO0FBQ2hELFdBQU8sVUFBQyxDQUFXLFVBQVgsSUFBeUIsR0FBekIsR0FBZ0MsTUFBakMsR0FBMEMsSUFBMUMsQ0FEeUM7Q0FBOUI7Ozs7Ozs7OztBQVd0QixJQUFJLGVBQWUsVUFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3hDLFFBQUksZUFBZSxLQUFmO1FBQ0Esa0JBQWtCO0FBQ2QsZ0JBQVEsQ0FBUjtBQUNBLGlCQUFTLFNBQVMsSUFBVDtLQUZiO1FBSUEsU0FBUyxFQUFULENBTm9DOztBQVF4QyxTQUFLLEtBQUwsRUFBWSxVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQzlCLGNBQU0sWUFBWSxJQUFaLENBQWlCLEdBQWpCLEtBQXlCLEdBQXpCLENBRHdCOztBQUc5QixnQkFBUSxHQUFSO0FBQ0ksaUJBQUssUUFBTCxDQURKO0FBRUksaUJBQUssU0FBTDtBQUNJLCtCQUFlLElBQWYsQ0FESjtBQUVJLGdDQUFnQixHQUFoQixJQUF1QixnQkFBZ0IsS0FBaEIsRUFBdUIsTUFBdkIsQ0FBdkIsQ0FGSjtBQUdJLHNCQUhKO0FBRkosaUJBTVMsUUFBTDtBQUNJLHVCQUFPLG1CQUFQLElBQThCLGdCQUFnQixDQUFDLEtBQUQsRUFBUSxNQUF4QixDQUE5QixDQURKO0FBRUksc0JBRko7QUFOSjtBQVVRLHVCQUFPLEdBQVAsSUFBYyxLQUFkLENBREo7QUFUSixTQUg4QjtLQUF0QixDQUFaLENBUndDOztBQXlCeEMsUUFBSSxZQUFKLEVBQWtCO0FBQ2QsZUFBTyxrQkFBUCxJQUE2QixnQkFBZ0IsTUFBaEIsR0FBeUIsR0FBekIsR0FBK0IsZ0JBQWdCLE9BQWhCLENBRDlDO0tBQWxCOztBQUlBLFdBQU8sTUFBUCxDQTdCd0M7Q0FBekI7Ozs7O0FBbUNuQixJQUFJLGNBQWMsSUFBSSxJQUFKLENBQVM7QUFDdkIsVUFBTSxRQUFRLE9BQVIsQ0FBTjs7QUFFQSxjQUFVO0FBQ04sZ0JBQVEsT0FBUjtBQUNBLFdBQUcsU0FBSDtLQUZKOztBQUtBLFVBQU0sWUFBWTtBQUNkLGFBQUssVUFBTCxHQUFrQixLQUFLLE9BQUwsQ0FBYSxjQUFiLEVBQWxCLENBRGM7S0FBWjs7Ozs7O0FBUU4sWUFBUSxVQUFVLEtBQVYsRUFBaUI7QUFDckIsaUJBQVMsTUFBVCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixFQUEyQixhQUFhLEtBQWIsRUFBb0IsS0FBSyxVQUFMLENBQS9DLEVBRHFCO0tBQWpCO0NBaEJNLENBQWQ7O0FBcUJKLE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJkcmF3UGF0aFJvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJvbGUgPSByZXF1aXJlKCcuLi9Sb2xlJyk7XG52YXIgYXR0clJvbGUgPSByZXF1aXJlKCcuLi9hdHRyL2F0dHJSb2xlJyk7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4uLy4uL2luYy91dGlscycpLmVhY2g7XG5cbi8qXG4gICAgQ29udmVydCBwZXJjZW50YWdlIHRvIHBpeGVsc1xuICAgIFxuICAgIEBwYXJhbSBbbnVtYmVyXTogUGVyY2VudGFnZSBvZiB0b3RhbCBsZW5ndGhcbiAgICBAcGFyYW0gW251bWJlcl06IFRvdGFsIGxlbmd0aFxuKi9cbnZhciBwZXJjZW50VG9QaXhlbHMgPSBmdW5jdGlvbiAocGVyY2VudGFnZSwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIChwYXJzZUZsb2F0KHBlcmNlbnRhZ2UpIC8gMTAwKSAqIGxlbmd0aCArICdweCc7XG59O1xuXG4vKlxuICAgIENyZWF0ZSBzdHlsZXNcbiAgICBcbiAgICBAcGFyYW0gW29iamVjdF06IFNWRyBQYXRoIHByb3BlcnRpZXNcbiAgICBAcGFyYW0gW29iamVjdF06IExlbmd0aCBvZiBwYXRoXG4gICAgQHJldHVybnMgW29iamVjdF06IEtleS92YWx1ZSBwYWlycyBvZiB2YWxpZCBDU1MgcHJvcGVydGllc1xuKi9cbnZhciBjcmVhdGVTdHlsZXMgPSBmdW5jdGlvbiAocHJvcHMsIGxlbmd0aCkge1xuICAgIHZhciBoYXNEYXNoQXJyYXkgPSBmYWxzZSxcbiAgICAgICAgZGFzaEFycmF5U3R5bGVzID0ge1xuICAgICAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICAgICAgc3BhY2luZzogbGVuZ3RoICsgJ3B4J1xuICAgICAgICB9LFxuICAgICAgICBzdHlsZXMgPSB7fTtcblxuICAgIGVhY2gocHJvcHMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGtleSA9IFNWR0RyYXdQYXRoLl9tYXBba2V5XSB8fCBrZXk7XG5cbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xlbmd0aCc6XG4gICAgICAgICAgICBjYXNlICdzcGFjaW5nJzpcbiAgICAgICAgICAgICAgICBoYXNEYXNoQXJyYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRhc2hBcnJheVN0eWxlc1trZXldID0gcGVyY2VudFRvUGl4ZWxzKHZhbHVlLCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb2Zmc2V0JzpcbiAgICAgICAgICAgICAgICBzdHlsZXNbJ3N0cm9rZS1kYXNob2Zmc2V0J10gPSBwZXJjZW50VG9QaXhlbHMoLXZhbHVlLCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBzdHlsZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaGFzRGFzaEFycmF5KSB7XG4gICAgICAgIHN0eWxlc1snc3Ryb2tlLWRhc2hhcnJheSddID0gZGFzaEFycmF5U3R5bGVzLmxlbmd0aCArICcgJyArIGRhc2hBcnJheVN0eWxlcy5zcGFjaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG59O1xuXG4vKlxuICAgIERyYXcgUGF0aCByb2xlXG4qL1xudmFyIFNWR0RyYXdQYXRoID0gbmV3IFJvbGUoe1xuICAgIF9tYXA6IHJlcXVpcmUoJy4vbWFwJyksXG5cbiAgICBfdHlwZU1hcDoge1xuICAgICAgICBzdHJva2U6ICdjb2xvcicsXG4gICAgICAgIGQ6ICdjb21wbGV4J1xuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGF0aExlbmd0aCA9IHRoaXMuZWxlbWVudC5nZXRUb3RhbExlbmd0aCgpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBVcGRhdGUgYHBhdGhgIHN0eWxlcyBhbmQgaWYgYGVsZW1lbnRgIGlzIHByZXNlbnQsIHNldFxuICAgICAgICB4LCB5IGFuZCByb3RhdGlvblxuICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgYXR0clJvbGUudXBkYXRlLmNhbGwodGhpcywgY3JlYXRlU3R5bGVzKHN0YXRlLCB0aGlzLnBhdGhMZW5ndGgpKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkdEcmF3UGF0aDsiXX0=

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	var STROKE = 'stroke';

	module.exports = {
	    opacity: STROKE + '-opacity',
	    width: STROKE + '-width',
	    miterlimit: STROKE + '-miterlimit'
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb2xlcy9wYXRoL21hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxRQUFUOztBQUVKLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGFBQVMsU0FBUyxVQUFUO0FBQ1QsV0FBTyxTQUFTLFFBQVQ7QUFDUCxnQkFBWSxTQUFTLGFBQVQ7Q0FIaEIiLCJmaWxlIjoibWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNUUk9LRSA9ICdzdHJva2UnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBvcGFjaXR5OiBTVFJPS0UgKyAnLW9wYWNpdHknLFxuICAgIHdpZHRoOiBTVFJPS0UgKyAnLXdpZHRoJyxcbiAgICBtaXRlcmxpbWl0OiBTVFJPS0UgKyAnLW1pdGVybGltaXQnXG59OyJdfQ==

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Actor = __webpack_require__(5);
	var Tween = __webpack_require__(35);
	var utils = __webpack_require__(4);
	var calcRelative = __webpack_require__(13).relativeValue;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXF1ZW5jZS9TZXF1ZW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sUUFBUSxRQUFRLGdCQUFSLENBQVI7QUFDTixJQUFNLFFBQVEsUUFBUSxrQkFBUixDQUFSO0FBQ04sSUFBTSxRQUFRLFFBQVEsY0FBUixDQUFSO0FBQ04sSUFBTSxlQUFlLFFBQVEsYUFBUixFQUF1QixhQUF2Qjs7QUFFckIsSUFBTSxXQUFXLElBQUksS0FBSixDQUFVO0FBQ3ZCLFVBQU0sUUFBTjtBQUNBLFlBQVE7QUFDSixrQkFBVSxDQUFWO0tBREo7Q0FGYSxDQUFYOztBQU9OLElBQU0sZUFBZSxnQkFBZSxRQUFmLEVBQTRCO1FBQXpCLHlCQUF5Qjs7QUFDN0MsUUFBSSxJQUFJLFNBQVMsS0FBVCxDQUFlLE1BQWYsQ0FEcUM7O0FBRzdDLFdBQU8sR0FBUCxFQUFZO0FBQ1IsWUFBSSxVQUFVLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBVixDQURJOztBQUdSLFlBQUksWUFBWSxRQUFRLFNBQVIsRUFBbUI7QUFDL0Isb0JBQVEsUUFBUixHQUQrQjtBQUUvQixxQkFBUyxLQUFULENBQWUsTUFBZixDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUYrQjtTQUFuQztLQUhKO0NBSGlCOztBQWFyQixJQUFNLG1CQUFtQixVQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQ3hDLFFBQUksb0JBQUosQ0FEd0M7O0FBR3hDLFFBQUksTUFBTSxJQUFOLEVBQVk7QUFDWixtQkFBVyxZQUFNO0FBQ2Isa0JBQU0sSUFBTixDQUFXLE1BQVgsRUFEYTtTQUFOLENBREM7S0FBaEIsTUFJTztBQUNILG1CQUFXLFlBQU07QUFDYixrQkFBTSxLQUFOLENBQVksTUFBWixFQURhO1NBQU4sQ0FEUjtLQUpQOztBQVVBLFdBQU8sUUFBUCxDQWJ3QztDQUFuQjs7SUFnQm5COzs7QUFFRixhQUZFLFFBRUYsR0FBYzs4QkFGWixVQUVZOztnREFDVixrQkFBTTtBQUNGLG1CQUFPLEVBQVA7QUFDQSxzQkFBVSxFQUFWO0FBQ0Esc0JBQVUsQ0FBVjtBQUNBLDhCQUFrQixDQUFsQjtBQUNBLDJCQUFlLENBQWY7QUFDQSxzQkFBVSxZQUFWO1NBTkosR0FEVTtLQUFkOztBQUZFLHVCQWFGLGtCQUFHLE9BQU8sUUFBUTtBQUNkLFlBQU0sYUFBYSxNQUFNLE1BQU4sQ0FBYSxLQUFiLENBQWIsQ0FEUTs7QUFHZCxhQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CO0FBQ2YsdUJBQVcsS0FBSyxnQkFBTDtBQUNYLHNCQUFVLGFBQWEsS0FBYixHQUFxQixpQkFBaUIsS0FBakIsRUFBd0IsTUFBeEIsQ0FBckI7U0FGZCxFQUhjOztBQVFkLFlBQUksVUFBVSxPQUFPLFFBQVAsRUFBaUI7QUFDM0IsaUJBQUssYUFBTCxHQUFxQixLQUFLLGdCQUFMLEdBQXdCLE9BQU8sUUFBUCxDQURsQjtTQUEvQjs7QUFJQSxlQUFPLElBQVAsQ0FaYzs7O0FBYmhCLHVCQTRCRiwyQkFBUSxVQUFVLFFBQVEsY0FBYztBQUNwQyxZQUFNLFdBQVcsU0FBUyxPQUFULENBQWlCLE1BQWpCLENBRG1CO0FBRXBDLFlBQU0sV0FBVyxNQUFNLEtBQU4sQ0FBWSxZQUFaLElBQTRCLFlBQTVCLEdBQTJDLGFBQWEsUUFBYixJQUF5QixHQUF6QixDQUZ4QjtBQUdwQyxZQUFNLFdBQVcsT0FBTyxRQUFQLEdBQWtCLE9BQU8sUUFBUCxHQUFrQixDQUFwQyxDQUhtQjs7QUFLcEMsYUFBSyxFQUFMLENBQVEsUUFBUixFQUFrQixZQUFNO0FBQ3BCLHFCQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsWUFBekIsRUFEb0I7U0FBTixDQUFsQixDQUxvQzs7QUFTcEMsYUFBSyxhQUFMLEdBQXFCLEtBQUssZ0JBQUwsR0FBd0IsUUFBeEIsR0FBb0MsV0FBVyxRQUFYLENBVHJCOztBQVdwQyxlQUFPLElBQVAsQ0FYb0M7OztBQTVCdEMsdUJBMENGLGlCQUFHLFdBQVc7QUFDVixZQUFJLE1BQU0sUUFBTixDQUFlLFNBQWYsQ0FBSixFQUErQjtBQUMzQix3QkFBWSxhQUFhLEtBQUssZ0JBQUwsRUFBdUIsU0FBcEMsQ0FBWixDQUQyQjtTQUEvQjs7QUFJQSxhQUFLLGdCQUFMLEdBQXdCLFNBQXhCLENBTFU7QUFNVixhQUFLLFFBQUwsR0FBZ0IsS0FBSyxHQUFMLENBQVMsS0FBSyxnQkFBTCxFQUF1QixLQUFLLFFBQUwsQ0FBaEQsQ0FOVTtBQU9WLGVBQU8sSUFBUCxDQVBVOzs7QUExQ1osdUJBb0RGLHVCQUFxQjtZQUFoQiwrREFBUyxxQkFBTzs7QUFDakIsYUFBSyxFQUFMLENBQVEsYUFBYSxLQUFLLGFBQUwsRUFBb0IsTUFBakMsQ0FBUixFQURpQjtBQUVqQixlQUFPLElBQVAsQ0FGaUI7OztBQXBEbkIsdUJBeURGLHlCQUFRO0FBQ0oseUJBQU0sS0FBTixZQUFZLFNBQVMsTUFBVCxDQUFnQjtBQUN4QixzQkFBVSxLQUFLLFFBQUw7QUFDVixvQkFBUTtBQUNKLDBCQUFVO0FBQ04sNkJBQVMsQ0FBVDtBQUNBLHdCQUFJLEtBQUssUUFBTDtpQkFGUjthQURKO1NBRlEsQ0FBWixFQURJOztBQVdKLGVBQU8sSUFBUCxDQVhJOzs7QUF6RE4sdUJBdUVGLDZCQUFVO0FBQ04sYUFBSyxLQUFMLEdBQWEsS0FBSyxRQUFMLENBQWMsS0FBZCxFQUFiLENBRE07OztBQXZFUix1QkEyRUYseUJBQVE7QUFDSixhQUFLLFFBQUwsR0FBZ0IsRUFBaEIsQ0FESTtBQUVKLGFBQUssUUFBTCxHQUFnQixLQUFLLGdCQUFMLEdBQXdCLEtBQUssYUFBTCxHQUFxQixDQUFyQixDQUZwQztBQUdKLGVBQU8sSUFBUCxDQUhJOzs7V0EzRU47RUFBaUI7O0FBa0Z2QixPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiU2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBY3RvciA9IHJlcXVpcmUoJy4uL2FjdG9yL0FjdG9yJyk7XG5jb25zdCBUd2VlbiA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHdlZW4nKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyk7XG5jb25zdCBjYWxjUmVsYXRpdmUgPSByZXF1aXJlKCcuLi9pbmMvY2FsYycpLnJlbGF0aXZlVmFsdWU7XG5cbmNvbnN0IHRpbWVsaW5lID0gbmV3IFR3ZWVuKHtcbiAgICBlYXNlOiAnbGluZWFyJyxcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgcGxheWhlYWQ6IDBcbiAgICB9XG59KTtcblxuY29uc3QgY2hlY2tBY3Rpb25zID0gKHsgcGxheWhlYWQgfSwgc2VxdWVuY2UpID0+IHtcbiAgICBsZXQgaSA9IHNlcXVlbmNlLmNoZWNrLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgbGV0IHRvQ2hlY2sgPSBzZXF1ZW5jZS5jaGVja1tpXTtcblxuICAgICAgICBpZiAocGxheWhlYWQgPj0gdG9DaGVjay50aW1lc3RhbXApIHtcbiAgICAgICAgICAgIHRvQ2hlY2suY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHNlcXVlbmNlLmNoZWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgZ2VuZXJhdGVDYWxsYmFjayA9IChhY3RvciwgYWN0aW9uKSA9PiB7XG4gICAgbGV0IGNhbGxiYWNrO1xuXG4gICAgaWYgKGFjdG9yLmVhY2gpIHtcbiAgICAgICAgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBhY3Rvci5lYWNoKGFjdGlvbik7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBhY3Rvci5zdGFydChhY3Rpb24pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBjYWxsYmFjaztcbn1cblxuY2xhc3MgU2VxdWVuY2UgZXh0ZW5kcyBBY3RvciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgY2hlY2s6IFtdLFxuICAgICAgICAgICAgc2VxdWVuY2U6IFtdLFxuICAgICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgICBjdXJyZW50VGltZXN0YW1wOiAwLFxuICAgICAgICAgICAgcHJldkFjdGlvbkVuZDogMCxcbiAgICAgICAgICAgIG9uVXBkYXRlOiBjaGVja0FjdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG8oYWN0b3IsIGFjdGlvbikge1xuICAgICAgICBjb25zdCBpc0NhbGxiYWNrID0gdXRpbHMuaXNGdW5jKGFjdG9yKTtcblxuICAgICAgICB0aGlzLnNlcXVlbmNlLnB1c2goe1xuICAgICAgICAgICAgdGltZXN0YW1wOiB0aGlzLmN1cnJlbnRUaW1lc3RhbXAsXG4gICAgICAgICAgICBjYWxsYmFjazogaXNDYWxsYmFjayA/IGFjdG9yIDogZ2VuZXJhdGVDYWxsYmFjayhhY3RvciwgYWN0aW9uKVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi5kdXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcmV2QWN0aW9uRW5kID0gdGhpcy5jdXJyZW50VGltZXN0YW1wICsgYWN0aW9uLmR1cmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhZ2dlcihpdGVyYXRvciwgYWN0aW9uLCBzdGFnZ2VyUHJvcHMpIHtcbiAgICAgICAgY29uc3QgbnVtSXRlbXMgPSBpdGVyYXRvci5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB1dGlscy5pc051bShzdGFnZ2VyUHJvcHMpID8gc3RhZ2dlclByb3BzIDogc3RhZ2dlclByb3BzLmludGVydmFsIHx8IDEwMDtcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSBhY3Rpb24uZHVyYXRpb24gPyBhY3Rpb24uZHVyYXRpb24gOiAwO1xuXG4gICAgICAgIHRoaXMuZG8oaXRlcmF0b3IsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLnN0YWdnZXIoYWN0aW9uLCBzdGFnZ2VyUHJvcHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByZXZBY3Rpb25FbmQgPSB0aGlzLmN1cnJlbnRUaW1lc3RhbXAgKyBkdXJhdGlvbiArIChpbnRlcnZhbCAqIG51bUl0ZW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdCh0aW1lc3RhbXApIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHRpbWVzdGFtcCkpIHtcbiAgICAgICAgICAgIHRpbWVzdGFtcCA9IGNhbGNSZWxhdGl2ZSh0aGlzLmN1cnJlbnRUaW1lc3RhbXAsIHRpbWVzdGFtcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBNYXRoLm1heCh0aGlzLmN1cnJlbnRUaW1lc3RhbXAsIHRoaXMuZHVyYXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGVuKG9mZnNldCA9IFwiKz0wXCIpIHtcbiAgICAgICAgdGhpcy5hdChjYWxjUmVsYXRpdmUodGhpcy5wcmV2QWN0aW9uRW5kLCBvZmZzZXQpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHN1cGVyLnN0YXJ0KHRpbWVsaW5lLmV4dGVuZCh7XG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5kdXJhdGlvbixcbiAgICAgICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICAgICAgIHBsYXloZWFkOiB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvOiB0aGlzLmR1cmF0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5jaGVjayA9IHRoaXMuc2VxdWVuY2Uuc2xpY2UoKTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5zZXF1ZW5jZSA9IFtdO1xuICAgICAgICB0aGlzLmR1cmF0aW9uID0gdGhpcy5jdXJyZW50VGltZXN0YW1wID0gdGhpcy5wcmV2QWN0aW9uRW5kID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcXVlbmNlOyJdfQ==

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(15);
	var calc = __webpack_require__(13);
	var utils = __webpack_require__(4);
	var presetEasing = __webpack_require__(36);
	var valueOps = __webpack_require__(12);
	var TweenControls = __webpack_require__(39);
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1R3ZWVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFUO0FBQ04sSUFBTSxPQUFPLFFBQVEsYUFBUixDQUFQO0FBQ04sSUFBTSxRQUFRLFFBQVEsY0FBUixDQUFSO0FBQ04sSUFBTSxlQUFlLFFBQVEsdUJBQVIsQ0FBZjtBQUNOLElBQU0sV0FBVyxRQUFRLDJCQUFSLENBQVg7QUFDTixJQUFNLGdCQUFnQixRQUFRLHVCQUFSLENBQWhCO0FBQ04sSUFBTSxPQUFPLE1BQU0sSUFBTjs7QUFFYixJQUFNLFFBQVEsT0FBUjtBQUNOLElBQU0sYUFBYTtBQUNmLFVBQU0sU0FBTjtBQUNBLFVBQU0sU0FBTjtBQUNBLFVBQU0sWUFBTjtDQUhFOzs7Ozs7Ozs7Ozs7QUFnQk4sU0FBUyxJQUFULENBQWMsUUFBZCxFQUF3QixJQUF4QixFQUE4QixFQUE5QixFQUFrQyxJQUFsQyxFQUF3QztBQUNwQyxRQUFNLGtCQUFrQixLQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBbEIsQ0FEOEI7QUFFcEMsUUFBTSxpQkFBaUIsTUFBTSxRQUFOLENBQWUsSUFBZixJQUF1QixhQUFhLElBQWIsQ0FBdkIsR0FBNEMsSUFBNUMsQ0FGYTs7QUFJcEMsV0FBTyxLQUFLLFVBQUwsQ0FBZ0IsZUFBaEIsRUFBaUMsSUFBakMsRUFBdUMsRUFBdkMsRUFBMkMsY0FBM0MsQ0FBUCxDQUpvQztDQUF4Qzs7SUFPTTs7Ozs7Ozs7O29CQUNGLHFDQUFjO0FBQ1YsZUFBTyxhQUFQLENBRFU7OztBQURaLG9CQUtGLDZDQUFrQjtBQUNkLGVBQU87QUFDSCxtQkFBTyxDQUFQO0FBQ0Esb0JBQVEsQ0FBUjtBQUNBLHNCQUFVLEdBQVY7QUFDQSxrQkFBTSxLQUFOO0FBQ0Esa0JBQU0sS0FBTjtBQUNBLGtCQUFNLEtBQU47QUFDQSwyQkFBZSxDQUFmO0FBQ0EsbUJBQU8s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QVAsQ0FBWSxJQUFaLEVBQWtCLEtBQWxCLEVBRDBCO0FBRTFCLDRCQUFZLElBQVosQ0FGMEI7YUFBOUI7U0FKSjs7QUFVQSxlQUFPLFNBQVAsQ0FoQitCOzs7QUE1R2pDLG9CQStIRixpQ0FBVyxPQUFPO0FBQ2QsWUFBTSxjQUFjLE1BQU0sTUFBTixDQUROO0FBRWQsYUFBSyxPQUFMLEdBQWUsS0FBSyxRQUFMLEdBQWdCLEtBQUssT0FBTCxDQUZqQjs7QUFJZCxhQUFLLEtBQUssTUFBTCxFQUFhLFVBQUMsR0FBRCxFQUFTO0FBQ3ZCLGdCQUFNLFFBQVEsWUFBWSxHQUFaLENBQVIsQ0FEaUI7O0FBR3ZCLGdCQUFJLE1BQU0sUUFBTixFQUFnQjtBQUNoQixxQkFBSyxNQUFNLFFBQU4sRUFBZ0IsVUFBQyxRQUFELEVBQWM7QUFDL0IsNkJBQVMsSUFBVCxDQUFjLFlBQVksTUFBTSxRQUFOLENBQTFCLEVBRCtCO2lCQUFkLENBQXJCLENBRGdCO2FBQXBCOztBQU1BLHFCQUFTLElBQVQsQ0FBYyxLQUFkLEVBVHVCO1NBQVQsQ0FBbEIsQ0FKYzs7O0FBL0hoQixvQkFnSkYsNkJBQVU7QUFDTixhQUFLLGFBQUwsSUFBc0IsQ0FBQyxDQUFELENBRGhCOzs7QUFoSlIsb0JBb0pGLDZCQUFVO0FBQ04sYUFBSyxPQUFMLEdBQWUsSUFBQyxDQUFLLGFBQUwsS0FBdUIsQ0FBdkIsR0FBNEIsQ0FBN0IsR0FBaUMsS0FBSyxRQUFMLENBRDFDO0FBRU4sYUFBSyxPQUFMLEdBQWUsTUFBTSxXQUFOLEVBQWYsQ0FGTTs7O1dBcEpSO0VBQWM7O0FBMEpwQixPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiVHdlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBY3Rpb24gPSByZXF1aXJlKCcuL0FjdGlvbicpO1xuY29uc3QgY2FsYyA9IHJlcXVpcmUoJy4uL2luYy9jYWxjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpO1xuY29uc3QgcHJlc2V0RWFzaW5nID0gcmVxdWlyZSgnLi90d2Vlbi9wcmVzZXQtZWFzaW5nJyk7XG5jb25zdCB2YWx1ZU9wcyA9IHJlcXVpcmUoJy4uL2FjdG9yL3ZhbHVlLW9wZXJhdGlvbnMnKTtcbmNvbnN0IFR3ZWVuQ29udHJvbHMgPSByZXF1aXJlKCcuL3R3ZWVuL1R3ZWVuQ29udHJvbHMnKTtcbmNvbnN0IGVhY2ggPSB1dGlscy5lYWNoO1xuXG5jb25zdCBDT1VOVCA9ICdjb3VudCc7XG5jb25zdCBORVhUX1NURVBTID0ge1xuICAgIGxvb3A6ICdyZXN0YXJ0JyxcbiAgICB5b3lvOiAncmV2ZXJzZScsXG4gICAgZmxpcDogJ2ZsaXBWYWx1ZXMnXG59O1xuXG4vKlxuICAgIEVhc2UgdmFsdWUgd2l0aGluIHJhbmdlZCBwYXJhbWV0ZXJzXG4gICAgXG4gICAgQHBhcmFtIFtudW1iZXJdOiBQcm9ncmVzcyBiZXR3ZWVuIDAgYW5kIDFcbiAgICBAcGFyYW0gW251bWJlcl06IFZhbHVlIG9mIDAgcHJvZ3Jlc3NcbiAgICBAcGFyYW0gW251bWJlcl06IFZhbHVlIG9mIDEgcHJvZ3Jlc3NcbiAgICBAcGFyYW0gW3N0cmluZyB8fCBmdW5jdGlvbl06IE5hbWUgb2YgcHJlc2V0IGVhc2luZ1xuICAgICAgICB0byB1c2Ugb3IgZ2VuZXJhdGVkIGVhc2luZyBmdW5jdGlvblxuICAgIEByZXR1cm4gW251bWJlcl06IFZhbHVlIG9mIGVhc2VkIHByb2dyZXNzIGluIHJhbmdlXG4qLyBcbmZ1bmN0aW9uIGVhc2UocHJvZ3Jlc3MsIGZyb20sIHRvLCBlYXNlKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NMaW1pdGVkID0gY2FsYy5yZXN0cmljdGVkKHByb2dyZXNzLCAwLCAxKTtcbiAgICBjb25zdCBlYXNpbmdGdW5jdGlvbiA9IHV0aWxzLmlzU3RyaW5nKGVhc2UpID8gcHJlc2V0RWFzaW5nW2Vhc2VdIDogZWFzZTtcblxuICAgIHJldHVybiBjYWxjLnZhbHVlRWFzZWQocHJvZ3Jlc3NMaW1pdGVkLCBmcm9tLCB0bywgZWFzaW5nRnVuY3Rpb24pO1xufTtcblxuY2xhc3MgVHdlZW4gZXh0ZW5kcyBBY3Rpb24ge1xuICAgIGdldENvbnRyb2xzKCkge1xuICAgICAgICByZXR1cm4gVHdlZW5Db250cm9scztcbiAgICB9XG4gICAgXG4gICAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgICAgICBkaWxhdGU6IDEsXG4gICAgICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICB5b3lvOiBmYWxzZSxcbiAgICAgICAgICAgIGZsaXA6IGZhbHNlLFxuICAgICAgICAgICAgcGxheURpcmVjdGlvbjogMSxcbiAgICAgICAgICAgIGVuZGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGVsYXBzZWQ6IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgICAgICAgICBlYXNlOiAnZWFzZU91dCcsXG4gICAgICAgICAgICBzdGFnZ2VyOiAwLFxuICAgICAgICAgICAgc3RlcHM6IDAsXG4gICAgICAgICAgICB0bzogMCxcbiAgICAgICAgICAgIHJvdW5kOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldERlZmF1bHRWYWx1ZVByb3AoKSB7XG4gICAgICAgIHJldHVybiAndG8nO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIFVwZGF0ZSBBY3Rpb24gZWxhcHNlZCB0aW1lXG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW29iamVjdF06IEFjdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogVGltZXN0YW1wIG9mIGN1cnJlbnQgZnJhbWVcbiAgICAqL1xuICAgIG9uRnJhbWVTdGFydChhY3RvciwgZnJhbWVEdXJhdGlvbikge1xuICAgICAgICB0aGlzLmVsYXBzZWQgPSB0aGlzLmVsYXBzZWQgfHwgMDtcblxuICAgICAgICBpZiAoZnJhbWVEdXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5lbGFwc2VkICs9IChmcmFtZUR1cmF0aW9uICogYWN0b3IuZGlsYXRlKSAqIHRoaXMucGxheURpcmVjdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQ2FsY3VsYXRlIHByb2dyZXNzIG9mIHZhbHVlIGJhc2VkIG9uIHRpbWUgZWxhcHNlZCxcbiAgICAgICAgdmFsdWUgZGVsYXkvZHVyYXRpb24vc3RhZ2dlciBwcm9wZXJ0aWVzXG5cbiAgICAgICAgQHBhcmFtIFtBY3Rvcl1cbiAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBWYWx1ZSBzdGF0ZSBhbmQgcHJvcGVydGllc1xuICAgICAgICBAcmV0dXJuIFtudW1iZXJdOiBDYWxjdWxhdGVkIHZhbHVlXG4gICAgKi9cbiAgICBwcm9jZXNzKGFjdG9yLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB2YWx1ZS50bztcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NUYXJnZXQgPSAodGhpcy5wbGF5RGlyZWN0aW9uID09PSAxKSA/IDEgOiAwO1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSB2YWx1ZS5jdXJyZW50O1xuXG4gICAgICAgIC8vIElmIHRoaXMgdmFsdWUgaGFzIGEgdG8gcHJvcGVydHksIG90aGVyd2lzZSB3ZSBqdXN0IHJldHVybiBjdXJyZW50IHZhbHVlXG4gICAgICAgIGlmICh0YXJnZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IHByb2dyZXNzID0gY2FsYy5yZXN0cmljdGVkKGNhbGMucHJvZ3Jlc3ModGhpcy5lbGFwc2VkIC0gdmFsdWUuZGVsYXksIDAsIHZhbHVlLmR1cmF0aW9uKSAtIHZhbHVlLnN0YWdnZXIsIDAsIDEpO1xuXG4gICAgICAgICAgICAvLyBNYXJrIEFjdGlvbiBhcyBOT1QgZW5kZWQgaWYgc3RpbGwgaW4gcHJvZ3Jlc3NcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyAhPT0gcHJvZ3Jlc3NUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgcHJvZ3Jlc3MgaWYgd2UncmUgc3RlcHBpbmdcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zdGVwcykge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gdXRpbHMuc3RlcFByb2dyZXNzKHByb2dyZXNzLCB2YWx1ZS5zdGVwcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVhc2UgdmFsdWVcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gZWFzZShwcm9ncmVzcywgdmFsdWUub3JpZ2luLCB0YXJnZXQsIHZhbHVlLmVhc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIElmIHRoaXMgdHdlZW4gaGFzIGVuZGVkLCBjaGVjayBpZiB3ZSBsb29wL3lveW8vZmxpcFxuICAgICAgICBcbiAgICAgICAgQHJldHVybiBbYm9vbGVhbl06IEhhcyB0aGlzIHR3ZWVuIHJlYWxseSByZWFsbHkgZW5kZWQ/XG4gICAgKi9cbiAgICBoYXNFbmRlZChhY3Rvcikge1xuICAgICAgICBsZXQgZW5kZWQgPSB0aGlzLmVuZGVkO1xuXG4gICAgICAgIGlmIChlbmRlZCkge1xuICAgICAgICAgICAgZWFjaChORVhUX1NURVBTLCAobmFtZSwgbWV0aG9kTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrTmV4dFN0ZXAoYWN0b3IsIG5hbWUsIHRoaXNbbWV0aG9kTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFjdG9yLmhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNldCBgZW5kZWRgXG4gICAgICAgIHRoaXMuZW5kZWQgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gZW5kZWQ7XG4gICAgfVxuXG4gICAgY2hlY2tOZXh0U3RlcChhY3RvciwgbmFtZSwgbWV0aG9kKSB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzW25hbWVdO1xuICAgICAgICBjb25zdCBmb3JldmVyID0gKHN0ZXAgPT09IHRydWUpO1xuICAgICAgICBsZXQgY291bnQgPSB0aGlzW25hbWUgKyBDT1VOVF0gfHwgMDtcbiAgICAgICAgbGV0IHN0ZXBUYWtlbiA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChmb3JldmVyIHx8IHV0aWxzLmlzTnVtKHN0ZXApKSB7XG4gICAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgICAgdGhpc1tuYW1lICsgQ09VTlRdID0gY291bnQ7XG5cbiAgICAgICAgICAgIGlmIChmb3JldmVyIHx8IGNvdW50IDw9IHN0ZXApIHtcbiAgICAgICAgICAgICAgICBtZXRob2QuY2FsbCh0aGlzLCBhY3Rvcik7XG4gICAgICAgICAgICAgICAgc3RlcFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGVwVGFrZW47XG4gICAgfVxuXG4gICAgZmxpcFZhbHVlcyhhY3Rvcikge1xuICAgICAgICBjb25zdCBhY3RvclZhbHVlcyA9IGFjdG9yLnZhbHVlcztcbiAgICAgICAgdGhpcy5lbGFwc2VkID0gdGhpcy5kdXJhdGlvbiAtIHRoaXMuZWxhcHNlZDtcblxuICAgICAgICBlYWNoKHRoaXMudmFsdWVzLCAoa2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGFjdG9yVmFsdWVzW2tleV07XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGVhY2godmFsdWUuY2hpbGRyZW4sIChjaGlsZEtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZU9wcy5mbGlwKGFjdG9yVmFsdWVzW2tleSArIGNoaWxkS2V5XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlT3BzLmZsaXAodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXZlcnNlKCkge1xuICAgICAgICB0aGlzLnBsYXlEaXJlY3Rpb24gKj0gLTE7XG4gICAgfVxuXG4gICAgcmVzdGFydCgpIHtcbiAgICAgICAgdGhpcy5lbGFwc2VkID0gKHRoaXMucGxheURpcmVjdGlvbiA9PT0gMSkgPyAwIDogdGhpcy5kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdXRpbHMuY3VycmVudFRpbWUoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHdlZW47Il19

/***/ },
/* 36 */
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
	var Easing = __webpack_require__(37);
	var utils = __webpack_require__(4);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL3ByZXNldC1lYXNpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNLFNBQVMsUUFBUSxVQUFSLENBQVQ7QUFDTixJQUFNLFFBQVEsUUFBUSxpQkFBUixDQUFSOzs7QUFHTixJQUFNLHdCQUF3QixLQUF4QjtBQUNOLElBQU0sdUJBQXVCLENBQXZCOzs7QUFHTixJQUFNLHNCQUFzQjtXQUFZLFVBQUMsUUFBRCxFQUFXLFFBQVg7ZUFBd0IsV0FBVyxJQUFYLENBQWdCLFFBQWhCLEVBQTBCLFFBQTFCO0tBQXhCO0NBQVo7Ozs7Ozs7O0FBUTVCLElBQUksYUFBYTtBQUNiLFVBQU0sVUFBQyxRQUFEO1lBQVcsaUVBQVc7d0JBQXlCLFVBQVk7S0FBM0Q7QUFDTixVQUFNO2VBQVksSUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLElBQUwsQ0FBVSxRQUFWLENBQVQsQ0FBSjtLQUFaO0FBQ04sVUFBTSxVQUFDLFFBQUQ7WUFBVyxpRUFBVztlQUEwQixRQUFDLEdBQVcsUUFBWCxJQUF3QixDQUFDLFdBQVcsQ0FBWCxDQUFELEdBQWlCLFFBQWpCLEdBQTRCLFFBQTVCLENBQXpCO0tBQWhEO0NBSE47O0FBTUosQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QixPQUE1QixDQUFvQyxVQUFVLFVBQVYsRUFBc0IsQ0FBdEIsRUFBeUI7QUFDekQsZUFBVyxVQUFYLElBQXlCLG9CQUFvQixJQUFJLENBQUosQ0FBN0MsQ0FEeUQ7Q0FBekIsQ0FBcEM7OztBQUtBLE1BQU0sSUFBTixDQUFXLFVBQVgsRUFBdUIsVUFBQyxHQUFELEVBQU0sUUFBTixFQUFtQjtBQUN0QyxRQUFJLGlCQUFpQixJQUFJLE1BQUosQ0FBVyxRQUFYLENBQWpCLENBRGtDO0FBRXRDLGVBQWMsVUFBZCxJQUF5QixlQUFlLEVBQWYsQ0FGYTtBQUd0QyxlQUFjLFdBQWQsSUFBMEIsZUFBZSxHQUFmLENBSFk7QUFJdEMsZUFBYyxhQUFkLElBQTRCLGVBQWUsS0FBZixDQUpVO0NBQW5CLENBQXZCOztBQU9BLFdBQVcsTUFBWCxHQUFvQjtXQUFZO0NBQVo7QUFDcEIsV0FBVyxVQUFYLEdBQXdCLFVBQUMsUUFBRDtRQUFXLGlFQUFXO1dBQzFDLENBQUUsWUFBVSxDQUFWLENBQUQsR0FBZ0IsQ0FBaEIsR0FBcUIsTUFBTSxXQUFXLE1BQVgsQ0FBa0IsUUFBbEIsRUFBNEIsUUFBNUIsQ0FBTixHQUErQyxPQUFPLElBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsRUFBRCxJQUFPLFdBQVcsQ0FBWCxDQUFQLENBQWhCLENBQVA7Q0FEakQ7O0FBR3hCLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJwcmVzZXQtZWFzaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgICBFYXNpbmcgZnVuY3Rpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIEdlbmVyYXRlcyBhbmQgcHJvdmlkZXMgZWFzaW5nIGZ1bmN0aW9ucyBiYXNlZCBvbiBiYXNlRnVuY3Rpb24gZGVmaW5pdGlvbnNcbiAgICBcbiAgICBBIGNhbGwgdG8gZWFzaW5nRnVuY3Rpb24uZ2V0KCdmdW5jdGlvbk5hbWUnKSByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgcGFzc2VkOlxuICAgICAgICBAcGFyYW0gW251bWJlcl06IFByb2dyZXNzIDAtMVxuICAgICAgICBAcGFyYW0gW251bWJlcl0gKG9wdGlvbmFsKTogQW1wIG1vZGlmaWVyLCBvbmx5IGFjY2VwdGVkIGluIHNvbWUgZWFzaW5nIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGlzIHVzZWQgdG8gYWRqdXN0IG92ZXJhbGwgc3RyZW5ndGhcbiAgICAgICAgQHJldHVybiBbbnVtYmVyXTogRWFzZWQgcHJvZ3Jlc3NcbiAgICAgICAgXG4gICAgV2UgY2FuIGdlbmVyYXRlIG5ldyBmdW5jdGlvbnMgYnkgc2VuZGluZyBhbiBlYXNpbmcgZnVuY3Rpb24gdGhyb3VnaCBlYXNpbmdGdW5jdGlvbi5leHRlbmQobmFtZSwgbWV0aG9kKS5cbiAgICBXaGljaCB3aWxsIG1ha2UgbmFtZUluLCBuYW1lT3V0IGFuZCBuYW1lSW5PdXQgZnVuY3Rpb25zIGF2YWlsYWJsZSB0byB1c2UuXG4gICAgICAgIFxuICAgIEVhc2luZyBmdW5jdGlvbnMgZnJvbSBSb2JlcnQgUGVubmVyXG4gICAgaHR0cDovL3d3dy5yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbiAgICAgICAgXG4gICAgQmV6aWVyIGN1cnZlIGludGVycHJldG9yIGNyZWF0ZWQgZnJvbSBHYcOrdGFuIFJlbmF1ZGVhdSdzIG9yaWdpbmFsIEJlemllckVhc2luZyAgXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL2dyZS9iZXppZXItZWFzaW5nL2Jsb2IvbWFzdGVyL2luZGV4LmpzICBcbiAgICBodHRwczovL2dpdGh1Yi5jb20vZ3JlL2Jlemllci1lYXNpbmcvYmxvYi9tYXN0ZXIvTElDRU5TRVxuXG4gICAgQW50aWNpcGF0ZSBlYXNpbmcgY3JlYXRlZCBieSBFbGxpb3QgR2lub1xuICAgIGh0dHBzOi8vdHdpdHRlci5jb20vRWxsaW90R2Vub1xuKi9cbi8vIEltcG9ydHNcbmNvbnN0IEVhc2luZyA9IHJlcXVpcmUoJy4vRWFzaW5nJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uLy4uL2luYy91dGlscycpO1xuXG4vLyBWYWx1ZXNcbmNvbnN0IERFRkFVTFRfQkFDS19TVFJFTkdUSCA9IDEuNTI1O1xuY29uc3QgREVGQVVMVF9QT1dfU1RSRU5HVEggPSAyO1xuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uc1xuY29uc3QgZ2VuZXJhdGVQb3dlckVhc2luZyA9IHN0cmVuZ3RoID0+IChwcm9ncmVzcywgc3RyZW5ndGgpID0+IGJhc2VFYXNpbmcuZWFzZShwcm9ncmVzcywgc3RyZW5ndGgpO1xuXG4vKlxuICAgIEVhY2ggb2YgdGhlc2UgYmFzZSBmdW5jdGlvbnMgaXMgYW4gZWFzZUluXG4gICAgXG4gICAgT24gaW5pdCwgd2UgdXNlIC5taXJyb3IgYW5kIC5yZXZlcnNlIHRvIGdlbmVyYXRlIGVhc2VJbk91dCBhbmRcbiAgICBlYXNlT3V0IGZ1bmN0aW9ucyByZXNwZWN0aXZlbHkuXG4qL1xubGV0IGJhc2VFYXNpbmcgPSB7XG4gICAgZWFzZTogKHByb2dyZXNzLCBzdHJlbmd0aCA9IERFRkFVTFRfUE9XX1NUUkVOR1RIKSA9PiBwcm9ncmVzcyAqKiBzdHJlbmd0aCxcbiAgICBjaXJjOiBwcm9ncmVzcyA9PiAxIC0gTWF0aC5zaW4oTWF0aC5hY29zKHByb2dyZXNzKSksXG4gICAgYmFjazogKHByb2dyZXNzLCBzdHJlbmd0aCA9IERFRkFVTFRfQkFDS19TVFJFTkdUSCkgPT4gKHByb2dyZXNzICogcHJvZ3Jlc3MpICogKChzdHJlbmd0aCArIDEpICogcHJvZ3Jlc3MgLSBzdHJlbmd0aClcbn07XG5cblsnY3ViaWMnLCAncXVhcnQnLCAncXVpbnQnXS5mb3JFYWNoKGZ1bmN0aW9uIChlYXNpbmdOYW1lLCBpKSB7XG4gICAgYmFzZUVhc2luZ1tlYXNpbmdOYW1lXSA9IGdlbmVyYXRlUG93ZXJFYXNpbmcoaSArIDMpO1xufSk7XG5cbi8vIEdlbmVyYXRlIGluL291dC9pbk91dCB2YXJpYXRpb25zXG51dGlscy5lYWNoKGJhc2VFYXNpbmcsIChrZXksIGJhc2VFYXNlKSA9PiB7XG4gICAgbGV0IGVhc2luZ0Z1bmN0aW9uID0gbmV3IEVhc2luZyhiYXNlRWFzZSk7XG4gICAgYmFzZUVhc2luZ1tgJHtrZXl9SW5gXSA9IGVhc2luZ0Z1bmN0aW9uLmluO1xuICAgIGJhc2VFYXNpbmdbYCR7a2V5fU91dGBdID0gZWFzaW5nRnVuY3Rpb24ub3V0O1xuICAgIGJhc2VFYXNpbmdbYCR7a2V5fUluT3V0YF0gPSBlYXNpbmdGdW5jdGlvbi5pbk91dDtcbn0pO1xuXG5iYXNlRWFzaW5nLmxpbmVhciA9IHByb2dyZXNzID0+IHByb2dyZXNzO1xuYmFzZUVhc2luZy5hbnRpY2lwYXRlID0gKHByb2dyZXNzLCBzdHJlbmd0aCA9IERFRkFVTFRfQkFDS19TVFJFTkdUSCkgPT5cbiAgICAoKHByb2dyZXNzKj0yKSA8IDEpID8gMC41ICogYmFzZUVhc2luZy5iYWNrSW4ocHJvZ3Jlc3MsIHN0cmVuZ3RoKSA6ICAwLjUgKiAoMiAtIE1hdGgucG93KDIsIC0xMCAqIChwcm9ncmVzcyAtIDEpKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhc2luZzsiXX0=

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bezier = __webpack_require__(38),

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL0Vhc2luZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBVDs7Ozs7Ozs7Ozs7O0FBWUEsZUFBZTtXQUFVLFVBQUMsUUFBRCxFQUFXLFFBQVg7ZUFBd0IsUUFBQyxJQUFZLEdBQVosR0FBbUIsT0FBTyxJQUFJLFFBQUosRUFBYyxRQUFyQixJQUFpQyxDQUFqQyxHQUFxQyxDQUFDLElBQUksT0FBTyxLQUFLLElBQUksUUFBSixDQUFMLEVBQW9CLFFBQTNCLENBQUosQ0FBRCxHQUE2QyxDQUE3QztLQUFqRjtDQUFWOzs7Ozs7Ozs7Ozs7QUFZZixnQkFBZ0I7V0FBVSxVQUFDLFFBQUQsRUFBVyxRQUFYO2VBQXdCLElBQUksT0FBTyxJQUFJLFFBQUosRUFBYyxRQUFyQixDQUFKO0tBQXhCO0NBQVY7Ozs7Ozs7Ozs7QUFVcEIsSUFBSSxTQUFTLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEI7QUFDbkMsUUFBSSxTQUFTLEVBQVQ7UUFDQSxjQURKOzs7QUFEbUMsUUFLL0IsVUFBVSxNQUFWLEdBQW1CLENBQW5CLEVBQXNCO0FBQ3RCLHlCQUFpQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixFQUFuQixFQUF1QixFQUF2QixDQUFqQixDQURzQjtLQUExQixNQUdPO0FBQ0gseUJBQWlCLFVBQUMsUUFBRCxFQUFXLFFBQVg7bUJBQXdCLE9BQU8sUUFBUCxFQUFpQixRQUFqQjtTQUF4QixDQURkO0FBRUgsdUJBQWUsRUFBZixHQUFvQixVQUFDLFFBQUQsRUFBVyxRQUFYO21CQUF3QixPQUFPLFFBQVAsRUFBaUIsUUFBakI7U0FBeEIsQ0FGakI7QUFHSCx1QkFBZSxHQUFmLEdBQXFCLGNBQWMsTUFBZCxDQUFyQixDQUhHO0FBSUgsdUJBQWUsS0FBZixHQUF1QixhQUFhLE1BQWIsQ0FBdkIsQ0FKRztLQUhQOztBQVVBLFdBQU8sY0FBUCxDQWZtQztDQUExQjs7QUFrQmIsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6IkVhc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCZXppZXIgPSByZXF1aXJlKCcuL0JlemllcicpLFxuXG4gICAgLypcbiAgICAgICAgTWlycm9yIGVhc2luZ1xuICAgICAgICBcbiAgICAgICAgTWlycm9ycyB0aGUgcHJvdmlkZWQgZWFzaW5nIGZ1bmN0aW9uLCB1c2VkIGhlcmUgZm9yIG1pcnJvcmluZyBhblxuICAgICAgICBlYXNlSW4gaW50byBhbiBlYXNlSW5PdXRcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogUHJvZ3Jlc3MsIGZyb20gMCAtIDEsIG9mIGN1cnJlbnQgc2hpZnRcbiAgICAgICAgQHBhcmFtIFtmdW5jdGlvbl06IFRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gbWlycm9yXG4gICAgICAgIEByZXR1cm5zIFtudW1iZXJdOiBUaGUgZWFzaW5nLWFkanVzdGVkIGRlbHRhXG4gICAgKi9cbiAgICBtaXJyb3JFYXNpbmcgPSBtZXRob2QgPT4gKHByb2dyZXNzLCBzdHJlbmd0aCkgPT4gKHByb2dyZXNzIDw9IDAuNSkgPyBtZXRob2QoMiAqIHByb2dyZXNzLCBzdHJlbmd0aCkgLyAyIDogKDIgLSBtZXRob2QoMiAqICgxIC0gcHJvZ3Jlc3MpLCBzdHJlbmd0aCkpIC8gMixcbiAgICAgICAgICAgIFxuICAgIC8qXG4gICAgICAgIFJldmVyc2UgZWFzaW5nXG4gICAgICAgIFxuICAgICAgICBSZXZlcnNlcyB0aGUgb3V0cHV0IG9mIHRoZSBwcm92aWRlZCBlYXNpbmcgZnVuY3Rpb24sIHVzZWQgZm9yIGZsaXBwaW5nIGVhc2VJblxuICAgICAgICBjdXJ2ZSB0byBhbiBlYXNlT3V0LlxuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBQcm9ncmVzcywgZnJvbSAwIC0gMSwgb2YgY3VycmVudCBzaGlmdFxuICAgICAgICBAcGFyYW0gW2Z1bmN0aW9uXTogVGhlIGVhc2luZyBmdW5jdGlvbiB0byByZXZlcnNlXG4gICAgICAgIEByZXR1cm5zIFtudW1iZXJdOiBUaGUgZWFzaW5nLWFkanVzdGVkIGRlbHRhXG4gICAgKi9cbiAgICByZXZlcnNlRWFzaW5nID0gbWV0aG9kID0+IChwcm9ncmVzcywgc3RyZW5ndGgpID0+IDEgLSBtZXRob2QoMSAtIHByb2dyZXNzLCBzdHJlbmd0aCk7XG5cbi8qXG4gICAgRWFzaW5nIGNsYXNzXG5cbiAgICBJZiBwcm92aWRlZCBlYXNpbmcgZnVuY3Rpb24sIHJldHVybnMgZWFzaW5nIGZ1bmN0aW9uIHdpdGggXG4gICAgaW4vb3V0L2luT3V0IHZhcmlhdGlvbnNcblxuICAgIElmIHByb3ZpZGVkIGZvdXIgYXJndW1lbnRzLCByZXR1cm5zIG5ldyBCZXppZXIgY2xhc3MgaW5zdGVhZC5cbiovXG52YXIgRWFzaW5nID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIG1ldGhvZCA9IHgxLFxuICAgICAgICBlYXNpbmdGdW5jdGlvbjtcblxuICAgIC8vIElmIHRoaXMgaXMgYSBiZXppZXIgY3VydmUsIHJldHVybiBhIGJlemllciBmdW5jdGlvblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBlYXNpbmdGdW5jdGlvbiA9IG5ldyBCZXppZXIoeDEsIHkxLCB4MiwgeTIpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWFzaW5nRnVuY3Rpb24gPSAocHJvZ3Jlc3MsIHN0cmVuZ3RoKSA9PiBtZXRob2QocHJvZ3Jlc3MsIHN0cmVuZ3RoKTtcbiAgICAgICAgZWFzaW5nRnVuY3Rpb24uaW4gPSAocHJvZ3Jlc3MsIHN0cmVuZ3RoKSA9PiBtZXRob2QocHJvZ3Jlc3MsIHN0cmVuZ3RoKTtcbiAgICAgICAgZWFzaW5nRnVuY3Rpb24ub3V0ID0gcmV2ZXJzZUVhc2luZyhtZXRob2QpO1xuICAgICAgICBlYXNpbmdGdW5jdGlvbi5pbk91dCA9IG1pcnJvckVhc2luZyhtZXRob2QpO1xuICAgIH1cblxuICAgIHJldHVybiBlYXNpbmdGdW5jdGlvbjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWFzaW5nOyJdfQ==

/***/ },
/* 38 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL0Jlemllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBYUE7O0FBRUEsSUFBSSxvQkFBb0IsQ0FBcEI7SUFDQSxtQkFBbUIsS0FBbkI7SUFDQSx3QkFBd0IsU0FBeEI7SUFDQSw2QkFBNkIsRUFBN0I7SUFDQSxzQkFBc0IsRUFBdEI7SUFDQSxxQkFBcUIsT0FBTyxzQkFBc0IsR0FBdEIsQ0FBUDtJQUNyQixxQkFBc0IsT0FBTyxZQUFQLEtBQXdCLFdBQXhCO0lBRXRCLElBQUksVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQjtBQUNsQixXQUFPLE1BQU0sTUFBTSxFQUFOLEdBQVcsTUFBTSxFQUFOLENBRE47Q0FBbEI7SUFJSixJQUFJLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0I7QUFDbEIsV0FBTyxNQUFNLEVBQU4sR0FBVyxNQUFNLEVBQU4sQ0FEQTtDQUFsQjtJQUlKLElBQUksVUFBVSxFQUFWLEVBQWM7QUFDZCxXQUFPLE1BQU0sRUFBTixDQURPO0NBQWQ7SUFJSixXQUFXLFVBQVUsQ0FBVixFQUFhLEVBQWIsRUFBaUIsRUFBakIsRUFBcUI7QUFDNUIsV0FBTyxNQUFNLEVBQUUsRUFBRixFQUFNLEVBQU4sQ0FBTixHQUFrQixDQUFsQixHQUFzQixDQUF0QixHQUEwQixNQUFNLEVBQUUsRUFBRixFQUFNLEVBQU4sQ0FBTixHQUFrQixDQUFsQixHQUFzQixFQUFFLEVBQUYsQ0FBaEQsQ0FEcUI7Q0FBckI7SUFJWCxhQUFhLFVBQVUsQ0FBVixFQUFhLEVBQWIsRUFBaUIsRUFBakIsRUFBcUI7QUFDOUIsV0FBTyxDQUFDLENBQUMsRUFBRSxFQUFGLEVBQU0sRUFBTixJQUFZLENBQVosR0FBZ0IsRUFBRSxFQUFGLEVBQU0sRUFBTixDQUFoQixDQUFELEdBQThCLENBQTlCLEdBQWtDLEVBQUUsRUFBRixDQUFsQyxDQUFELEdBQTRDLENBQTVDLENBRHVCO0NBQXJCOzs7OztBQU9iLFNBQVMsVUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUNuQyxRQUFJLGVBQWUscUJBQXFCLElBQUksWUFBSixDQUFpQixtQkFBakIsQ0FBckIsR0FBNkQsSUFBSSxLQUFKLENBQVUsbUJBQVYsQ0FBN0Q7UUFDZixlQUFlLEtBQWY7UUFFQSxrQkFBa0IsVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUNwQyxZQUFJLFFBQUo7WUFBYyxRQUFkO1lBQXdCLElBQUksQ0FBSixDQURZOztBQUdwQyxXQUFHO0FBQ0MsdUJBQVcsS0FBSyxDQUFDLEtBQUssRUFBTCxDQUFELEdBQVksR0FBWixDQURqQjtBQUVDLHVCQUFXLFdBQVcsUUFBWCxFQUFxQixHQUFyQixFQUEwQixHQUExQixJQUFpQyxFQUFqQyxDQUZaO0FBR0MsZ0JBQUksV0FBVyxHQUFYLEVBQWdCO0FBQ2hCLHFCQUFLLFFBQUwsQ0FEZ0I7YUFBcEIsTUFFTztBQUNILHFCQUFLLFFBQUwsQ0FERzthQUZQO1NBSEosUUFRUyxLQUFLLEdBQUwsQ0FBUyxRQUFULElBQXFCLHFCQUFyQixJQUE4QyxFQUFFLENBQUYsR0FBTSwwQkFBTixFQVhuQjs7QUFhcEMsZUFBTyxRQUFQLENBYm9DO0tBQXRCO1FBZ0JsQix1QkFBdUIsVUFBVSxFQUFWLEVBQWMsT0FBZCxFQUF1QjtBQUMxQyxZQUFJLElBQUksQ0FBSjtZQUNBLGVBQWUsR0FBZjtZQUNBLFFBRkosQ0FEMEM7O0FBSzFDLGVBQU8sSUFBSSxpQkFBSixFQUF1QixFQUFFLENBQUYsRUFBSztBQUMvQiwyQkFBZSxTQUFTLE9BQVQsRUFBa0IsR0FBbEIsRUFBdUIsR0FBdkIsQ0FBZixDQUQrQjs7QUFHL0IsZ0JBQUksaUJBQWlCLEdBQWpCLEVBQXNCO0FBQ3RCLHVCQUFPLE9BQVAsQ0FEc0I7YUFBMUI7O0FBSUEsdUJBQVcsV0FBVyxPQUFYLEVBQW9CLEdBQXBCLEVBQXlCLEdBQXpCLElBQWdDLEVBQWhDLENBUG9CO0FBUS9CLHVCQUFXLFdBQVcsWUFBWCxDQVJvQjtTQUFuQzs7QUFXQSxlQUFPLE9BQVAsQ0FoQjBDO0tBQXZCO1FBb0J2QixtQkFBbUIsWUFBWTtBQUMzQixhQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxtQkFBSixFQUF5QixFQUFFLENBQUYsRUFBSztBQUMxQyx5QkFBYSxDQUFiLElBQWtCLFdBQVcsSUFBSSxrQkFBSixFQUF3QixHQUFuQyxFQUF3QyxHQUF4QyxDQUFsQixDQUQwQztTQUE5QztLQURlO1FBT25CLFdBQVcsVUFBVSxFQUFWLEVBQWM7QUFDckIsWUFBSSxnQkFBZ0IsR0FBaEI7WUFDQSxnQkFBZ0IsQ0FBaEI7WUFDQSxhQUFhLHNCQUFzQixDQUF0QjtZQUNiLE9BQU8sR0FBUDtZQUNBLFlBQVksR0FBWjtZQUNBLGVBQWUsR0FBZixDQU5pQjs7QUFRckIsZUFBTyxpQkFBaUIsVUFBakIsSUFBK0IsYUFBYSxhQUFiLEtBQStCLEVBQS9CLEVBQW1DLEVBQUUsYUFBRixFQUFpQjtBQUN0Riw2QkFBaUIsa0JBQWpCLENBRHNGO1NBQTFGOztBQUlBLFVBQUUsYUFBRixDQVpxQjs7QUFjckIsZUFBTyxDQUFDLEtBQUssYUFBYSxhQUFiLENBQUwsQ0FBRCxJQUFzQyxhQUFhLGdCQUFjLENBQWQsQ0FBYixHQUFnQyxhQUFhLGFBQWIsQ0FBaEMsQ0FBdEMsQ0FkYztBQWVyQixvQkFBWSxnQkFBZ0IsT0FBTyxrQkFBUCxDQWZQOztBQWlCckIsdUJBQWUsU0FBUyxTQUFULEVBQW9CLEdBQXBCLEVBQXlCLEdBQXpCLENBQWY7OztBQWpCcUIsWUFvQmpCLGdCQUFnQixnQkFBaEIsRUFBa0M7QUFDbEMsbUJBQU8scUJBQXFCLEVBQXJCLEVBQXlCLFNBQXpCLENBQVA7O0FBRGtDLFNBQXRDLE1BR08sSUFBSSxpQkFBaUIsR0FBakIsRUFBc0I7QUFDN0IsdUJBQU8sU0FBUDs7QUFENkIsYUFBMUIsTUFHQTtBQUNILDJCQUFPLGdCQUFnQixFQUFoQixFQUFvQixhQUFwQixFQUFtQyxnQkFBZ0Isa0JBQWhCLENBQTFDLENBREc7aUJBSEE7S0F2QkE7UUErQlgsYUFBYSxZQUFZO0FBQ3JCLHVCQUFlLElBQWYsQ0FEcUI7QUFFckIsWUFBSSxPQUFPLEdBQVAsSUFBYyxPQUFPLEdBQVAsRUFBWTtBQUMxQiwrQkFEMEI7U0FBOUI7S0FGUzs7Ozs7OztBQVliLFFBQUksVUFBVSxFQUFWLEVBQWM7QUFDZCxZQUFJLFdBQUosQ0FEYzs7QUFHZCxZQUFJLENBQUMsWUFBRCxFQUFlO0FBQ2YseUJBRGU7U0FBbkI7OztBQUhjLFlBUVYsUUFBUSxHQUFSLElBQWUsUUFBUSxHQUFSLEVBQWE7QUFDNUIsMEJBQWMsRUFBZDs7O0FBRDRCLFNBQWhDLE1BSU8sSUFBSSxPQUFPLENBQVAsRUFBVTtBQUNqQiw4QkFBYyxDQUFkOzs7QUFEaUIsYUFBZCxNQUlBLElBQUksT0FBTyxDQUFQLEVBQVU7QUFDakIsa0NBQWMsQ0FBZCxDQURpQjtpQkFBZCxNQUdBO0FBQ0gsa0NBQWMsV0FBVyxTQUFTLEVBQVQsQ0FBWCxFQUF5QixHQUF6QixFQUE4QixHQUE5QixDQUFkLENBREc7aUJBSEE7O0FBT1AsZUFBTyxXQUFQLENBdkJjO0tBQWQsQ0ExRjJCOztBQW9IL0IsV0FBTyxDQUFQLENBcEgrQjtDQUE5Qjs7QUF1SGIsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6IkJlemllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgQmV6aWVyIGZ1bmN0aW9uIGdlbmVyYXRvclxuICAgICAgICBcbiAgICBHYcOrdGFuIFJlbmF1ZGVhdSdzIEJlemllckVhc2luZ1xuICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmUvYmV6aWVyLWVhc2luZy9ibG9iL21hc3Rlci9pbmRleC5qcyAgXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL2dyZS9iZXppZXItZWFzaW5nL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAgICBZb3UncmUgYSBoZXJvXG4gICAgXG4gICAgVXNlXG4gICAgXG4gICAgICAgIHZhciBlYXNlT3V0ID0gbmV3IEJlemllciguMTcsLjY3LC44MywuNjcpLFxuICAgICAgICAgICAgeCA9IGVhc2VPdXQoMC41KTsgLy8gcmV0dXJucyAwLjYyNy4uLlxuKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgTkVXVE9OX0lURVJBVElPTlMgPSA4LFxuICAgIE5FV1RPTl9NSU5fU0xPUEUgPSAwLjAwMSxcbiAgICBTVUJESVZJU0lPTl9QUkVDSVNJT04gPSAwLjAwMDAwMDEsXG4gICAgU1VCRElWSVNJT05fTUFYX0lURVJBVElPTlMgPSAxMCxcbiAgICBLX1NQTElORV9UQUJMRV9TSVpFID0gMTEsXG4gICAgS19TQU1QTEVfU1RFUF9TSVpFID0gMS4wIC8gKEtfU1BMSU5FX1RBQkxFX1NJWkUgLSAxLjApLFxuICAgIEZMT0FUXzMyX1NVUFBPUlRFRCA9ICh0eXBlb2YgRmxvYXQzMkFycmF5ICE9PSAndW5kZWZpbmVkJyksXG4gICAgXG4gICAgYSA9IGZ1bmN0aW9uIChhMSwgYTIpIHtcbiAgICAgICAgcmV0dXJuIDEuMCAtIDMuMCAqIGEyICsgMy4wICogYTE7XG4gICAgfSxcbiAgICBcbiAgICBiID0gZnVuY3Rpb24gKGExLCBhMikge1xuICAgICAgICByZXR1cm4gMy4wICogYTIgLSA2LjAgKiBhMTtcbiAgICB9LFxuICAgIFxuICAgIGMgPSBmdW5jdGlvbiAoYTEpIHtcbiAgICAgICAgcmV0dXJuIDMuMCAqIGExO1xuICAgIH0sXG5cbiAgICBnZXRTbG9wZSA9IGZ1bmN0aW9uICh0LCBhMSwgYTIpIHtcbiAgICAgICAgcmV0dXJuIDMuMCAqIGEoYTEsIGEyKSAqIHQgKiB0ICsgMi4wICogYihhMSwgYTIpICogdCArIGMoYTEpO1xuICAgIH0sXG5cbiAgICBjYWxjQmV6aWVyID0gZnVuY3Rpb24gKHQsIGExLCBhMikge1xuICAgICAgICByZXR1cm4gKChhKGExLCBhMikgKiB0ICsgYihhMSwgYTIpKSAqIHQgKyBjKGExKSkgKiB0O1xuICAgIH0sXG4gICAgXG4gICAgLypcbiAgICAgICAgQmV6aWVyIGNvbnN0cnVjdG9yXG4gICAgKi9cbiAgICBCZXppZXIgPSBmdW5jdGlvbiAobVgxLCBtWTEsIG1YMiwgbVkyKSB7XG4gICAgICAgIHZhciBzYW1wbGVWYWx1ZXMgPSBGTE9BVF8zMl9TVVBQT1JURUQgPyBuZXcgRmxvYXQzMkFycmF5KEtfU1BMSU5FX1RBQkxFX1NJWkUpIDogbmV3IEFycmF5KEtfU1BMSU5FX1RBQkxFX1NJWkUpLFxuICAgICAgICAgICAgX3ByZWNvbXB1dGVkID0gZmFsc2UsXG4gICAgXG4gICAgICAgICAgICBiaW5hcnlTdWJkaXZpZGUgPSBmdW5jdGlvbiAoYVgsIGFBLCBhQikge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50WCwgY3VycmVudFQsIGkgPSAwO1xuXG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VCA9IGFBICsgKGFCIC0gYUEpIC8gMi4wO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50WCA9IGNhbGNCZXppZXIoY3VycmVudFQsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFggPiAwLjApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFCID0gY3VycmVudFQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhQSA9IGN1cnJlbnRUO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoTWF0aC5hYnMoY3VycmVudFgpID4gU1VCRElWSVNJT05fUFJFQ0lTSU9OICYmICsraSA8IFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50VDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAgICAgbmV3dG9uUmFwaHNvbkl0ZXJhdGUgPSBmdW5jdGlvbiAoYVgsIGFHdWVzc1QpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTbG9wZSA9IDAuMCxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFg7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBORVdUT05fSVRFUkFUSU9OUzsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTbG9wZSA9IGdldFNsb3BlKGFHdWVzc1QsIG1YMSwgbVgyKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2xvcGUgPT09IDAuMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihhR3Vlc3NULCBtWDEsIG1YMikgLSBhWDtcbiAgICAgICAgICAgICAgICAgICAgYUd1ZXNzVCAtPSBjdXJyZW50WCAvIGN1cnJlbnRTbG9wZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGNTYW1wbGVWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBLX1NQTElORV9UQUJMRV9TSVpFOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtcGxlVmFsdWVzW2ldID0gY2FsY0JlemllcihpICogS19TQU1QTEVfU1RFUF9TSVpFLCBtWDEsIG1YMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXRURm9yWCA9IGZ1bmN0aW9uIChhWCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnRlcnZhbFN0YXJ0ID0gMC4wLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2FtcGxlID0gMSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNhbXBsZSA9IEtfU1BMSU5FX1RBQkxFX1NJWkUgLSAxLFxuICAgICAgICAgICAgICAgICAgICBkaXN0ID0gMC4wLFxuICAgICAgICAgICAgICAgICAgICBndWVzc0ZvclQgPSAwLjAsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxTbG9wZSA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yICg7IGN1cnJlbnRTYW1wbGUgIT0gbGFzdFNhbXBsZSAmJiBzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0gPD0gYVg7ICsrY3VycmVudFNhbXBsZSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbFN0YXJ0ICs9IEtfU0FNUExFX1NURVBfU0laRTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLS1jdXJyZW50U2FtcGxlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRpc3QgPSAoYVggLSBzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pIC8gKHNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlKzFdIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKTtcbiAgICAgICAgICAgICAgICBndWVzc0ZvclQgPSBpbnRlcnZhbFN0YXJ0ICsgZGlzdCAqIEtfU0FNUExFX1NURVBfU0laRTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpbml0aWFsU2xvcGUgPSBnZXRTbG9wZShndWVzc0ZvclQsIG1YMSwgbVgyKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiBzbG9wZSBpcyBncmVhdGVyIHRoYW4gbWluXG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxTbG9wZSA+PSBORVdUT05fTUlOX1NMT1BFKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgZ3Vlc3NGb3JUKTtcbiAgICAgICAgICAgICAgICAvLyBTbG9wZSBpcyBlcXVhbCB0byBtaW5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXRpYWxTbG9wZSA9PT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBndWVzc0ZvclQ7XG4gICAgICAgICAgICAgICAgLy8gU2xvcGUgaXMgbGVzcyB0aGFuIG1pblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5hcnlTdWJkaXZpZGUoYVgsIGludGVydmFsU3RhcnQsIGludGVydmFsU3RhcnQgKyBLX1NBTVBMRV9TVEVQX1NJWkUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHByZWNvbXB1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3ByZWNvbXB1dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobVgxICE9IG1ZMSB8fCBtWDIgIT0gbVkyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGNTYW1wbGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIEdlbmVyYXRlZCBmdW5jdGlvblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFJldHVybnMgdmFsdWUgMC0xIGJhc2VkIG9uIFhcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBmID0gZnVuY3Rpb24gKGFYKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldHVyblZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFfcHJlY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcHV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJZiBsaW5lYXIgZ3JhZGllbnQsIHJldHVybiBYIGFzIFRcbiAgICAgICAgICAgICAgICBpZiAobVgxID09PSBtWTEgJiYgbVgyID09PSBtWTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBhWDtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gSWYgYXQgc3RhcnQsIHJldHVybiAwXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhWCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIElmIGF0IGVuZCwgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFYID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gMTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gY2FsY0JlemllcihnZXRURm9yWChhWCksIG1ZMSwgbVkyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZXppZXI7Il19

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Controls = __webpack_require__(16);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL1R3ZWVuQ29udHJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsUUFBUSx5QkFBUixDQUFYOztJQUVBOzs7Ozs7Ozs7NEJBQ0YsNkJBQVU7QUFDTixhQUFLLGNBQUwsR0FETTtBQUVOLGFBQUssTUFBTCxDQUFZLE9BQVosR0FGTTtBQUdOLGVBQU8sSUFBUCxDQUhNOzs7QUFEUiw0QkFPRiw2QkFBVTtBQUNOLGFBQUssY0FBTCxHQURNO0FBRU4sYUFBSyxNQUFMLENBQVksT0FBWixHQUZNO0FBR04sZUFBTyxJQUFQLENBSE07OztBQVBSLDRCQWFGLHFCQUFLLFVBQVU7QUFDWCxZQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixLQUFLLEVBQUwsQ0FBdEIsRUFBZ0M7QUFDaEMsaUJBQUssS0FBTCxHQUFhLEtBQWIsR0FEZ0M7U0FBcEM7O0FBSUEsYUFBSyxNQUFMLENBQVksT0FBWixHQUFzQixLQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLFFBQXZCLENBTFg7O0FBT1gsWUFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLFFBQVosRUFBc0I7QUFDdkIsaUJBQUssTUFBTCxDQUFZLFFBQVosR0FEdUI7QUFFdkIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsSUFBbkIsR0FGdUI7QUFHdkIsaUJBQUssTUFBTCxDQUFZLFVBQVosR0FIdUI7U0FBM0I7O0FBTUEsZUFBTyxJQUFQLENBYlc7OztXQWJiO0VBQXNCOztBQThCNUIsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6IlR3ZWVuQ29udHJvbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDb250cm9scyA9IHJlcXVpcmUoJy4uLy4uL2NvbnRyb2xzL0NvbnRyb2xzJyk7XG5cbmNsYXNzIFR3ZWVuQ29udHJvbHMgZXh0ZW5kcyBDb250cm9scyB7XG4gICAgcmVzdGFydCgpIHtcbiAgICAgICAgdGhpcy5yZXN0b3JlT3JpZ2lucygpO1xuICAgICAgICB0aGlzLmFjdGlvbi5yZXN0YXJ0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldmVyc2UoKSB7XG4gICAgICAgIHRoaXMucmVzdG9yZU9yaWdpbnMoKTtcbiAgICAgICAgdGhpcy5hY3Rpb24ucmV2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWVrKHByb2dyZXNzKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3Rvci5oYXNBY3Rpb24odGhpcy5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKS5wYXVzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpb24uZWxhcHNlZCA9IHRoaXMuYWN0aW9uLmR1cmF0aW9uICogcHJvZ3Jlc3M7XG5cbiAgICAgICAgaWYgKCF0aGlzLmFjdGlvbi5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5hY3Rpb24uYWN0aXZhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuYWN0b3IucHJvY2Vzcy5maXJlKCk7XG4gICAgICAgICAgICB0aGlzLmFjdGlvbi5kZWFjdGl2YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHdlZW5Db250cm9sczsiXX0=

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Input controller
	*/
	"use strict";

	var calc = __webpack_require__(13),
	    utils = __webpack_require__(4),
	    History = __webpack_require__(41),

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnB1dC9JbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQTs7QUFFQSxJQUFJLE9BQU8sUUFBUSxnQkFBUixDQUFQO0lBQ0EsUUFBUSxRQUFRLGlCQUFSLENBQVI7SUFDQSxVQUFVLFFBQVEsbUJBQVIsQ0FBVjs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxRQUFRLFlBQVk7QUFDaEIsUUFBSSxVQUFVLFVBQVUsTUFBVixHQUFtQixDQUFuQixDQURFOztBQUdoQixTQUFLLE9BQUwsR0FBZSxFQUFmLENBSGdCO0FBSWhCLFNBQUssTUFBTCxHQUFjLEVBQWQsQ0FKZ0I7QUFLaEIsU0FBSyxRQUFMLEdBQWdCLEVBQWhCLENBTGdCO0FBTWhCLFNBQUssT0FBTCxHQUFlLElBQUksT0FBSixFQUFmLENBTmdCO0FBT2hCLFNBQUssTUFBTCxDQUFZLFVBQVUsQ0FBVixDQUFaLEVBQTBCLFVBQVUsQ0FBVixDQUExQixFQVBnQjs7QUFTaEIsUUFBSSxNQUFNLE1BQU4sQ0FBYSxVQUFVLE9BQVYsQ0FBYixDQUFKLEVBQXNDO0FBQ2xDLGFBQUssSUFBTCxHQUFZLFVBQVUsT0FBVixDQUFaLENBRGtDO0tBQXRDO0NBVEk7O0FBY1osTUFBTSxTQUFOLEdBQWtCOzs7QUFHZCx1QkFBbUIsQ0FBbkI7OztBQUdBLG9CQUFnQixDQUFoQjs7Ozs7Ozs7QUFRQSxTQUFLLFVBQVUsSUFBVixFQUFnQjtBQUNqQixZQUFJLFNBQVMsS0FBSyxPQUFMLENBQWEsR0FBYixFQUFUO1lBQ0EsTUFBTSxJQUFDLEtBQVMsU0FBVCxHQUFzQixPQUFPLElBQVAsQ0FBdkIsR0FBc0MsTUFBdEMsQ0FGTztBQUdqQixlQUFPLEdBQVAsQ0FIaUI7S0FBaEI7Ozs7Ozs7Ozs7Ozs7OztBQW1CTCxZQUFRLFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQjtBQUMxQixZQUFJLFNBQVMsRUFBVCxDQURzQjs7QUFHMUIsWUFBSSxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQUosRUFBdUI7QUFDbkIsbUJBQU8sSUFBUCxJQUFlLElBQWYsQ0FEbUI7U0FBdkIsTUFFTztBQUNILHFCQUFTLElBQVQsQ0FERztTQUZQOztBQU1BLGFBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsTUFBTSxLQUFOLENBQVksS0FBSyxPQUFMLEVBQWMsTUFBMUIsQ0FBakIsRUFUMEI7O0FBVzFCLGVBQU8sSUFBUCxDQVgwQjtLQUF0Qjs7Ozs7Ozs7QUFvQlIsYUFBUyxVQUFVLFNBQVYsRUFBcUI7QUFDMUIsWUFBSSxNQUFKLEVBQVksVUFBWjs7O0FBRDBCLFlBSXRCLGNBQWMsS0FBSyxTQUFMLEVBQWdCO0FBQzlCLG1CQUQ4QjtTQUFsQzs7QUFJQSxpQkFBUyxJQUFDLENBQUssSUFBTCxHQUFhLEtBQUssSUFBTCxFQUFkLEdBQTRCLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBNUIsQ0FSaUI7QUFTMUIscUJBQWEsTUFBTSxVQUFOLENBQWlCLEtBQUssT0FBTCxFQUFjLE1BQS9CLENBQWI7OztBQVQwQixZQVl0QixVQUFKLEVBQWdCO0FBQ1osaUJBQUssUUFBTCxHQUFnQixLQUFLLE1BQUwsQ0FBWSxLQUFLLE9BQUwsRUFBYyxNQUExQixDQUFoQixDQURZO0FBRVosaUJBQUssT0FBTCxHQUFlLE1BQWYsQ0FGWTtBQUdaLGlCQUFLLGNBQUwsR0FBc0IsQ0FBdEI7OztBQUhZLFNBQWhCLE1BTU8sSUFBSSxLQUFLLGNBQUwsSUFBdUIsS0FBSyxpQkFBTCxFQUF3QjtBQUN0RCxxQkFBSyxRQUFMLEdBQWdCLEtBQUssTUFBTCxDQUFZLEtBQUssT0FBTCxFQUFjLEtBQUssT0FBTCxDQUExQzs7O0FBRHNELGFBQW5ELE1BSUE7QUFDSCx5QkFBSyxjQUFMLEdBREc7aUJBSkE7O0FBUVAsYUFBSyxTQUFMLEdBQWlCLFNBQWpCLENBMUIwQjs7QUE0QjFCLGVBQU8sSUFBUCxDQTVCMEI7S0FBckI7Q0FyRGI7O0FBcUZBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJJbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgSW5wdXQgY29udHJvbGxlclxuKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2FsYyA9IHJlcXVpcmUoJy4uL2luYy9jYWxjLmpzJyksXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuLi9pbmMvdXRpbHMuanMnKSxcbiAgICBIaXN0b3J5ID0gcmVxdWlyZSgnLi4vaW5jL0hpc3RvcnkuanMnKSxcblxuICAgIC8qXG4gICAgICAgIElucHV0IGNvbnN0cnVjdG9yXG4gICAgICAgIFxuICAgICAgICAgICAgU3ludGF4XG4gICAgICAgICAgICAgICAgbmV3SW5wdXQobmFtZSwgdmFsdWVbLCBwb2xsXSlcbiAgICAgICAgICAgICAgICAgICAgQHBhcmFtIFtzdHJpbmddOiBOYW1lIG9mIHRvIHRyYWNrXG4gICAgICAgICAgICAgICAgICAgIEBwYXJhbSBbbnVtYmVyXTogSW5pdGlhbCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBAcGFyYW0gW2Z1bmN0aW9uXSAob3B0aW9uYWwpOiBGdW5jdGlvbiB0byBwb2xsIElucHV0IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmV3SW5wdXQocHJvcHNbLCBwb2xsXSlcbiAgICAgICAgICAgICAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBPYmplY3Qgb2YgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIEBwYXJhbSBbZnVuY3Rpb25dIChvcHRpb25hbCk6IEZ1bmN0aW9uIHRvIHBvbGwgSW5wdXQgZGF0YVxuXG4gICAgICAgIEByZXR1cm4gW0lucHV0XVxuICAgICovXG4gICAgSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwb2xsUG9zID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50ID0ge307XG4gICAgICAgIHRoaXMub2Zmc2V0ID0ge307XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdGhpcy5oaXN0b3J5ID0gbmV3IEhpc3RvcnkoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKHV0aWxzLmlzRnVuYyhhcmd1bWVudHNbcG9sbFBvc10pKSB7XG4gICAgICAgICAgICB0aGlzLnBvbGwgPSBhcmd1bWVudHNbcG9sbFBvc107XG4gICAgICAgIH1cbiAgICB9O1xuXG5JbnB1dC5wcm90b3R5cGUgPSB7XG4gICAgXG4gICAgLy8gW251bWJlcl06IE51bWJlciBvZiBmcmFtZXMgb2YgaW5hY3Rpdml0eSBiZWZvcmUgdmVsb2NpdHkgaXMgdHVybmVkIHRvIDBcbiAgICBtYXhJbmFjdGl2ZUZyYW1lczogMixcbiAgICBcbiAgICAvLyBbbnVtYmVyXTogTnVtYmVyIG9mIGZyYW1lcyBpbnB1dCBoYXNuJ3QgYmVlbiB1cGRhdGVkXG4gICAgaW5hY3RpdmVGcmFtZXM6IDAsXG4gICAgXG4gICAgLypcbiAgICAgICAgR2V0IGxhdGVzdCBpbnB1dCB2YWx1ZXNcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXSAob3B0aW9uYWwpOiBOYW1lIG9mIHNwZWNpZmljIHByb3BlcnR5IHRvIHJldHVyblxuICAgICAgICBAcmV0dXJuIFtvYmplY3QgfHwgbnVtYmVyXTogTGF0ZXN0IGlucHV0IHZhbHVlcyBvciwgaWYgc3BlY2lmaWVkLCBzaW5nbGUgdmFsdWVcbiAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgdmFyIGxhdGVzdCA9IHRoaXMuaGlzdG9yeS5nZXQoKSxcbiAgICAgICAgICAgIHZhbCA9IChwcm9wICE9PSB1bmRlZmluZWQpID8gbGF0ZXN0W3Byb3BdIDogbGF0ZXN0O1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBVcGRhdGUgdGhlIGlucHV0IHZhbHVlc1xuICAgICAgICBcbiAgICAgICAgU3ludGF4XG4gICAgICAgICAgICBpbnB1dC51cGRhdGUobmFtZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgQHBhcmFtIFtzdHJpbmddOiBOYW1lIG9mIHRvIHRyYWNrXG4gICAgICAgICAgICAgICAgQHBhcmFtIFtudW1iZXJdOiBJbml0aWFsIHZhbHVlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpbnB1dC51cGRhdGUocHJvcHMpXG4gICAgICAgICAgICAgICAgQHBhcmFtIFtvYmplY3RdOiBPYmplY3Qgb2YgdmFsdWVzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEByZXR1cm4gW0lucHV0XVxuICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoYXJnMCwgYXJnMSkge1xuICAgICAgICB2YXIgdmFsdWVzID0ge307XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzTnVtKGFyZzEpKSB7XG4gICAgICAgICAgICB2YWx1ZXNbYXJnMF0gPSBhcmcxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzID0gYXJnMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGlzdG9yeS5hZGQodXRpbHMubWVyZ2UodGhpcy5jdXJyZW50LCB2YWx1ZXMpKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgXG4gICAgLypcbiAgICAgICAgQ2hlY2sgZm9yIGlucHV0IG1vdmVtZW50IGFuZCB1cGRhdGUgcG9pbnRlciBvYmplY3QncyBwcm9wZXJ0aWVzXG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW251bWJlcl06IFRpbWVzdGFtcCBvZiBmcmFtZVxuICAgICAgICBAcmV0dXJuIFtJbnB1dF1cbiAgICAqL1xuICAgIG9uRnJhbWU6IGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIGxhdGVzdCwgaGFzQ2hhbmdlZDtcbiAgICAgICAgXG4gICAgICAgIC8vIENoZWNrIHByb3ZpZGVkIHRpbWVzdGFtcCBhZ2FpbnN0IGxhc3RGcmFtZSB0aW1lc3RhbXAgYW5kIHJldHVybiBpbnB1dCBoYXMgYWxyZWFkeSBiZWVuIHVwZGF0ZWRcbiAgICAgICAgaWYgKHRpbWVzdGFtcCA9PT0gdGhpcy5sYXN0RnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGF0ZXN0ID0gKHRoaXMucG9sbCkgPyB0aGlzLnBvbGwoKSA6IHRoaXMuaGlzdG9yeS5nZXQoKTtcbiAgICAgICAgaGFzQ2hhbmdlZCA9IHV0aWxzLmhhc0NoYW5nZWQodGhpcy5jdXJyZW50LCBsYXRlc3QpO1xuXG4gICAgICAgIC8vIElmIGlucHV0IGhhcyBjaGFuZ2VkIGJldHdlZW4gZnJhbWVzICBcbiAgICAgICAgaWYgKGhhc0NoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSBjYWxjLm9mZnNldCh0aGlzLmN1cnJlbnQsIGxhdGVzdCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBsYXRlc3Q7XG4gICAgICAgICAgICB0aGlzLmluYWN0aXZlRnJhbWVzID0gMDtcblxuICAgICAgICAvLyBPciBpdCBoYXNuJ3QgbW92ZWQgYW5kIG91ciBmcmFtZSBsaW1pdCBoYXMgYmVlbiByZWFjaGVkXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbmFjdGl2ZUZyYW1lcyA+PSB0aGlzLm1heEluYWN0aXZlRnJhbWVzKSB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gY2FsYy5vZmZzZXQodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQpO1xuICAgICAgICBcbiAgICAgICAgLy8gT3IgaW5wdXQgaGFzbid0IGNoYW5nZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5hY3RpdmVGcmFtZXMrKztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5sYXN0RnJhbWUgPSB0aW1lc3RhbXA7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0OyJdfQ==

/***/ },
/* 41 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvSGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTSxpQkFBaUIsQ0FBakI7O0lBRUE7Ozs7Ozs7OztBQVFGLGFBUkUsT0FRRixDQUFZLEdBQVosRUFBdUM7WUFBdEIsNERBQU0sOEJBQWdCOzs4QkFSckMsU0FRcUM7O0FBQ25DLGFBQUssR0FBTCxHQUFXLEdBQVgsQ0FEbUM7QUFFbkMsYUFBSyxPQUFMLEdBQWUsRUFBZixDQUZtQztBQUduQyxhQUFLLEdBQUwsQ0FBUyxHQUFULEVBSG1DO0tBQXZDOzs7Ozs7Ozs7O0FBUkUsc0JBcUJGLG1CQUFJLEtBQUs7QUFDTCxhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEdBQWxCLEVBREs7O0FBR0wsWUFBSSxLQUFLLE9BQUwsTUFBa0IsS0FBSyxHQUFMLEVBQVU7QUFDNUIsaUJBQUssT0FBTCxDQUFhLEtBQWIsR0FENEI7U0FBaEM7Ozs7Ozs7OztBQXhCRixzQkFtQ0YscUJBQTRCO1lBQXhCLDBEQUFJLEtBQUssT0FBTCxLQUFpQixDQUFqQixnQkFBb0I7O0FBQ3hCLGVBQU8sS0FBSyxPQUFMLENBQWEsQ0FBYixDQUFQLENBRHdCOzs7Ozs7Ozs7QUFuQzFCLHNCQTRDRixxQ0FBYztBQUNWLGVBQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxPQUFMLEtBQWlCLENBQWpCLENBQWhCLENBRFU7Ozs7Ozs7OztBQTVDWixzQkFxREYsNkJBQVU7QUFDTixlQUFPLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FERDs7O1dBckRSOzs7QUEwRE4sT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtYXhIaXN0b3J5U2l6ZSA9IDM7XG5cbmNsYXNzIEhpc3Rvcnkge1xuXG4gICAgLypcbiAgICAgICAgSGlzdG9yeSBjb25zdHJ1Y3RvclxuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFt2YXJdOiBWYXJpYWJsZSB0byBzdG9yZSBpbiBmaXJzdCBoaXN0b3J5IHNsb3RcbiAgICAgICAgQHBhcmFtIFtpbnRdIChvcHRpb25hbCk6IE1heGltdW0gc2l6ZSBvZiBoaXN0b3J5XG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvYmosIG1heCA9IG1heEhpc3RvcnlTaXplKSB7XG4gICAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgICAgICB0aGlzLmVudHJpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGQob2JqKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBQdXNoIG5ldyB2YXIgdG8gaGlzdG9yeVxuICAgICAgICBcbiAgICAgICAgU2hpZnQgb3V0IG9sZGVzdCBlbnRyeSBpZiB3ZSd2ZSByZWFjaGVkIG1heGltdW0gY2FwYWNpdHlcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbdmFyXTogVmFyaWFibGUgdG8gcHVzaCBpbnRvIGhpc3RvcnkuZW50cmllc1xuICAgICovXG4gICAgYWRkKG9iaikge1xuICAgICAgICB0aGlzLmVudHJpZXMucHVzaChvYmopO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID49IHRoaXMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmVudHJpZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKlxuICAgICAgICBHZXQgdmFyaWFibGUgYXQgc3BlY2lmaWVkIGluZGV4XG5cbiAgICAgICAgQHBhcmFtIFtpbnRdOiBJbmRleFxuICAgICAgICBAcmV0dXJuIFt2YXJdOiBWYXIgZm91bmQgYXQgc3BlY2lmaWVkIGluZGV4XG4gICAgKi9cbiAgICBnZXQoaSA9IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRyaWVzW2ldO1xuICAgIH1cbiAgICBcbiAgICAvKlxuICAgICAgICBHZXQgdGhlIHNlY29uZCBuZXdlc3QgaGlzdG9yeSBlbnRyeVxuICAgICAgICBcbiAgICAgICAgQHJldHVybiBbdmFyXTogRW50cnkgZm91bmQgYXQgaW5kZXggc2l6ZSAtIDJcbiAgICAqL1xuICAgIGdldFByZXZpb3VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy5nZXRTaXplKCkgLSAyKTtcbiAgICB9XG4gICAgXG4gICAgLypcbiAgICAgICAgR2V0IGN1cnJlbnQgaGlzdG9yeSBzaXplXG4gICAgICAgIFxuICAgICAgICBAcmV0dXJuIFtpbnRdOiBDdXJyZW50IGxlbmd0aCBvZiBlbnRyaWVzLmxlbmd0aFxuICAgICovXG4gICAgZ2V0U2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50cmllcy5sZW5ndGg7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhpc3Rvcnk7Il19

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Actor = __webpack_require__(5);
	var Tween = __webpack_require__(35);
	var utils = __webpack_require__(4);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pdGVyYXRvci9JdGVyYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTSxRQUFRLFFBQVEsZ0JBQVIsQ0FBUjtBQUNOLElBQU0sUUFBUSxRQUFRLGtCQUFSLENBQVI7QUFDTixJQUFNLFFBQVEsUUFBUSxjQUFSLENBQVI7O0FBRU4sSUFBTSx1QkFBdUIsUUFBdkI7O0FBRU4sU0FBUyxnQkFBVCxDQUEwQixNQUExQixFQUEyQztzQ0FBTjs7S0FBTTs7QUFDdkMsUUFBSSxXQUFXLE1BQVgsQ0FEbUM7O0FBR3ZDLFFBQUksTUFBTSxRQUFOLENBQWUsTUFBZixDQUFKLEVBQTRCO0FBQ3hCLG1CQUFXLFVBQUMsTUFBRDttQkFBWSxPQUFPLE9BQVAsZUFBa0IsSUFBbEI7U0FBWixDQURhO0tBQTVCLE1BRU8sSUFBSSxDQUFDLE1BQU0sTUFBTixDQUFhLE1BQWIsQ0FBRCxFQUF1QjtBQUM5QixtQkFBVyxVQUFDLE1BQUQsRUFBWTtBQUNuQixtQkFBTyxLQUFQLGdCQUFhLGVBQVcsS0FBeEIsRUFEbUI7U0FBWixDQURtQjtLQUEzQjs7QUFNUCxXQUFPLFFBQVAsQ0FYdUM7Q0FBM0M7O0lBY007QUFDRixhQURFLFFBQ0YsQ0FBWSxPQUFaLEVBQXFCOzhCQURuQixVQUNtQjs7QUFDakIsYUFBSyxLQUFMLEdBRGlCOztBQUdqQixZQUFJLE9BQUosRUFBYTtBQUNULGlCQUFLLEdBQUwsQ0FBUyxPQUFULEVBRFM7U0FBYjs7QUFJQSxhQUFLLFFBQUwsR0FBZ0IsSUFBSSxLQUFKLEVBQWhCLENBUGlCO0tBQXJCOztBQURFLHVCQVdGLG1CQUFJLFNBQVM7QUFDVCxhQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLE9BQXBCLENBQWYsQ0FEUztBQUVULGVBQU8sSUFBUCxDQUZTOzs7QUFYWCx1QkFnQkYseUJBQVE7QUFDSixhQUFLLE9BQUwsR0FBZSxFQUFmLENBREk7QUFFSixlQUFPLElBQVAsQ0FGSTs7O0FBaEJOLHVCQXFCRixxQkFBSyxRQUFpQjsyQ0FBTjs7U0FBTTs7QUFDbEIsWUFBTSxXQUFXLG1DQUFpQixlQUFXLEtBQTVCLENBQVgsQ0FEWTtBQUVsQixhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFFBQXJCLEVBRmtCO0FBR2xCLGVBQU8sSUFBUCxDQUhrQjs7O0FBckJwQix1QkEyQkYsbUNBQVksUUFBaUI7MkNBQU47O1NBQU07O0FBQ3pCLFlBQU0sV0FBVyxtQ0FBaUIsZUFBVyxLQUE1QixDQUFYLENBRG1CO0FBRXpCLFlBQU0sY0FBYyxJQUFJLFFBQUosRUFBZCxDQUZtQjs7QUFJekIsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixVQUFDLE1BQUQ7bUJBQVksWUFBWSxHQUFaLENBQWdCLFNBQVMsTUFBVCxDQUFoQjtTQUFaLENBQXJCLENBSnlCOztBQU16QixlQUFPLFdBQVAsQ0FOeUI7OztBQTNCM0IsdUJBb0NGLDJCQUFRLFFBQVEsT0FBZ0I7QUFDNUIsWUFBTSxjQUFjLE1BQU0sU0FBTixDQUFnQixLQUFLLE9BQUwsQ0FBOUIsQ0FEc0I7QUFFNUIsWUFBTSxhQUFhLFlBQVksTUFBWixDQUZTO0FBRzVCLFlBQU0sa0JBQWtCLE1BQU0sS0FBTixDQUFZLEtBQVosQ0FBbEIsQ0FIc0I7QUFJNUIsWUFBTSxXQUFXLGtCQUFrQixLQUFsQixHQUEwQixNQUFNLFFBQU4sSUFBa0IsR0FBbEIsQ0FKZjs7MkNBQU47O1NBQU07O0FBSzVCLFlBQU0sV0FBVyxtQ0FBaUIsZUFBVyxLQUE1QixDQUFYLENBTHNCOztBQU81QixZQUFJLElBQUksQ0FBQyxDQUFELENBUG9CO0FBUTVCLFlBQUksZUFBZSxFQUFmLENBUndCOztBQVU1QixxQkFBYSxNQUFiLEdBQXNCO0FBQ2xCLGVBQUc7QUFDQyx5QkFBUyxDQUFDLEdBQUQ7QUFDVCwwQkFBVSxXQUFXLFVBQVg7QUFDVixzQkFBTSxrQkFBa0Isb0JBQWxCLEdBQXlDLE1BQU0sSUFBTixJQUFjLG9CQUFkO0FBQy9DLHVCQUFPLElBQVA7QUFDQSxvQkFBSSxhQUFhLEdBQWI7YUFMUjtTQURKLENBVjRCOztBQW9CNUIscUJBQWEsVUFBYixHQUEwQixrQkFBa0IsU0FBbEIsR0FBOEIsTUFBTSxVQUFOLENBcEI1Qjs7QUFzQjVCLHFCQUFhLFFBQWIsR0FBd0IsVUFBQyxNQUFELEVBQVk7QUFDaEMsZ0JBQU0sV0FBVyxPQUFPLENBQVAsQ0FEZTtBQUVoQyxnQkFBSSxXQUFXLElBQUksQ0FBSjs7O0FBRmlCLGdCQUs1QixhQUFhLElBQUksQ0FBSixFQUFPO0FBQ3BCLHlCQUFTLFlBQVksUUFBWixDQUFULEVBQWdDLFFBQWhDOzs7QUFEb0IsYUFBeEIsTUFJTztBQUNILDJCQUFPLFlBQVksUUFBWixFQUFzQixVQUE3QixFQUF5QztBQUNyQyxpQ0FBUyxZQUFZLFFBQVosQ0FBVCxFQUFnQyxRQUFoQyxFQURxQztxQkFBekM7aUJBTEo7O0FBVUEsZ0JBQUksUUFBSixDQWZnQztTQUFaLENBdEJJOztBQXdDNUIsYUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFJLEtBQUosQ0FBVSxZQUFWLENBQXBCLEVBeEM0Qjs7QUEwQzVCLGVBQU8sSUFBUCxDQTFDNEI7Ozs7Ozs7QUFwQzlCLHVCQW9GRiw2QkFBVTtBQUNOLGFBQUssT0FBTCxDQUFhLE9BQWIsR0FETTtBQUVOLGVBQU8sSUFBUCxDQUZNOzs7V0FwRlI7OztBQTBGTixPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiSXRlcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBY3RvciA9IHJlcXVpcmUoJy4uL2FjdG9yL0FjdG9yJyk7XG5jb25zdCBUd2VlbiA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVHdlZW4nKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyk7XG5cbmNvbnN0IERFRkFVTFRfU1RBR0dFUl9FQVNFID0gJ2xpbmVhcic7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2FsbGJhY2sobWV0aG9kLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gbWV0aG9kO1xuXG4gICAgaWYgKHV0aWxzLmlzU3RyaW5nKG1ldGhvZCkpIHtcbiAgICAgICAgY2FsbGJhY2sgPSAobWVtYmVyKSA9PiBtZW1iZXJbbWV0aG9kXSguLi5hcmdzKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc0Z1bmMobWV0aG9kKSkge1xuICAgICAgICBjYWxsYmFjayA9IChtZW1iZXIpID0+IHtcbiAgICAgICAgICAgIG1lbWJlci5zdGFydChtZXRob2QsIC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGxiYWNrO1xufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gICAgY29uc3RydWN0b3IobWVtYmVycykge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgaWYgKG1lbWJlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKG1lbWJlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3RhZ2dlciA9IG5ldyBBY3RvcigpO1xuICAgIH1cblxuICAgIGFkZChtZW1iZXJzKSB7XG4gICAgICAgIHRoaXMubWVtYmVycyA9IHRoaXMubWVtYmVycy5jb25jYXQobWVtYmVycyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZWFjaChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBnZW5lcmF0ZUNhbGxiYWNrKG1ldGhvZCwgLi4uYXJncyk7XG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZWFjaEludG9OZXcobWV0aG9kLCAuLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZ2VuZXJhdGVDYWxsYmFjayhtZXRob2QsIC4uLmFyZ3MpO1xuICAgICAgICBjb25zdCBuZXdJdGVyYXRvciA9IG5ldyBJdGVyYXRvcigpO1xuXG4gICAgICAgIHRoaXMubWVtYmVycy5mb3JFYWNoKChtZW1iZXIpID0+IG5ld0l0ZXJhdG9yLmFkZChjYWxsYmFjayhtZW1iZXIpKSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0l0ZXJhdG9yO1xuICAgIH1cblxuICAgIHN0YWdnZXIobWV0aG9kLCBwcm9wcywgLi4uYXJncykge1xuICAgICAgICBjb25zdCB0ZW1wTWVtYmVycyA9IHV0aWxzLmNvcHlBcnJheSh0aGlzLm1lbWJlcnMpO1xuICAgICAgICBjb25zdCBudW1NZW1iZXJzID0gdGVtcE1lbWJlcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBwcm9wc0lzSW50ZXJ2YWwgPSB1dGlscy5pc051bShwcm9wcyk7XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gcHJvcHNJc0ludGVydmFsID8gcHJvcHMgOiBwcm9wcy5pbnRlcnZhbCB8fCAxMDA7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZ2VuZXJhdGVDYWxsYmFjayhtZXRob2QsIC4uLmFyZ3MpO1xuXG4gICAgICAgIGxldCBpID0gLTE7XG4gICAgICAgIGxldCBzdGFnZ2VyUHJvcHMgPSB7fTtcblxuICAgICAgICBzdGFnZ2VyUHJvcHMudmFsdWVzID0ge1xuICAgICAgICAgICAgaToge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IC0wLjYsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGludGVydmFsICogbnVtTWVtYmVycyxcbiAgICAgICAgICAgICAgICBlYXNlOiBwcm9wc0lzSW50ZXJ2YWwgPyBERUZBVUxUX1NUQUdHRVJfRUFTRSA6IHByb3BzLmVhc2UgfHwgREVGQVVMVF9TVEFHR0VSX0VBU0UsXG4gICAgICAgICAgICAgICAgcm91bmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdG86IG51bU1lbWJlcnMgLSAwLjZcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzdGFnZ2VyUHJvcHMub25Db21wbGV0ZSA9IHByb3BzSXNJbnRlcnZhbCA/IHVuZGVmaW5lZCA6IHByb3BzLm9uQ29tcGxldGU7XG5cbiAgICAgICAgc3RhZ2dlclByb3BzLm9uVXBkYXRlID0gKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3SW5kZXggPSBvdXRwdXQuaTtcbiAgICAgICAgICAgIGxldCBnYXBJbmRleCA9IGkgKyAxO1xuXG4gICAgICAgICAgICAvLyBJZiBvdXIgbmV3IGluZGV4IGlzIG9ubHkgb25lIG1vcmUgdGhhbiB0aGUgcHJldmlvdXMgaW5kZXgsIGZpcmUgaW1tZWRpZXRseVxuICAgICAgICAgICAgaWYgKG5ld0luZGV4ID09PSBpICsgMSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRlbXBNZW1iZXJzW2dhcEluZGV4XSwgZ2FwSW5kZXgpO1xuXG4gICAgICAgICAgICAvLyBPciBsb29wIHRocm91Z2ggdGhlIGRpc3RhbmNlIHRvIGZpcmUgYWxsIGluZGVjaWVzLiBJbmNyZWFzZSBkZWxheS5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICg7IGdhcEluZGV4IDw9IG5ld0luZGV4OyBnYXBJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRlbXBNZW1iZXJzW2dhcEluZGV4XSwgZ2FwSW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaSA9IG5ld0luZGV4O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3N0YWdnZXIuc3RhcnQobmV3IFR3ZWVuKHN0YWdnZXJQcm9wcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEFycmF5IG1hbmlwdWxhdGlvblxuICAgICovXG4gICAgcmV2ZXJzZSgpIHtcbiAgICAgICAgdGhpcy5tZW1iZXJzLnJldmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yOyJdfQ==

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Imports
	var Action = __webpack_require__(15);
	var calc = __webpack_require__(13);
	var utils = __webpack_require__(4);
	var simulations = __webpack_require__(44);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1NpbXVsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLElBQU0sU0FBUyxRQUFRLFVBQVIsQ0FBVDtBQUNOLElBQU0sT0FBTyxRQUFRLGFBQVIsQ0FBUDtBQUNOLElBQU0sUUFBUSxRQUFRLGNBQVIsQ0FBUjtBQUNOLElBQU0sY0FBYyxRQUFRLHdCQUFSLENBQWQ7OztBQUdOLElBQU0sZUFBZSxVQUFmOztJQUVBOzs7Ozs7Ozs7QUFPRixhQVBFLFFBT0YsR0FBcUI7OEJBUG5CLFVBT21COzswQ0FBTjs7U0FBTTs7cURBQ2pCLDBDQUFTLEtBQVQsR0FEaUI7O0FBRWpCLGNBQUssa0JBQUwsR0FBMEIsSUFBMUIsQ0FGaUI7QUFHakIsY0FBSyxjQUFMLEdBQXNCLENBQXRCLENBSGlCOztLQUFyQjs7Ozs7OztBQVBFLHVCQWtCRiw2Q0FBa0I7QUFDZCxlQUFPO0FBQ0gscUJBQVMsSUFBVDtBQUNBLCtCQUFtQixDQUFuQjtTQUZKLENBRGM7Ozs7Ozs7O0FBbEJoQix1QkE4QkYsNkNBQWtCO0FBQ2QsZUFBTzs7QUFFSCxzQkFBVSxZQUFWOzs7QUFHQSwwQkFBYyxDQUFkOzs7QUFHQSxvQkFBUSxDQUFSOzs7QUFHQSxvQkFBUSxFQUFSOzs7QUFHQSwwQkFBYyxHQUFkOzs7QUFHQSx1QkFBVyxNQUFYOzs7QUFHQSxxQkFBUyxLQUFUOzs7QUFHQSxzQkFBVSxDQUFWOztBQUVBLGdCQUFJLENBQUo7QUFDQSxtQkFBTyxLQUFQO1NBMUJKLENBRGM7Ozs7Ozs7OztBQTlCaEIsdUJBbUVGLHFEQUFzQjtBQUNsQixlQUFPLFlBQVAsQ0FEa0I7Ozs7Ozs7O0FBbkVwQix1QkEyRUYsNkJBQVU7QUFDTixhQUFLLE9BQUwsR0FBZSxNQUFNLFdBQU4sRUFBZixDQURNOzs7Ozs7OztBQTNFUix1QkFtRkYsdUNBQWU7QUFDWCxhQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FEVzs7Ozs7Ozs7Ozs7OztBQW5GYix1QkFnR0YsMkJBQVEsT0FBTyxPQUFPLEtBQUssb0JBQW9CO0FBQzNDLFlBQU0sVUFBVSxNQUFNLE9BQU4sQ0FEMkI7QUFFM0MsWUFBTSxXQUFXLE1BQU0sUUFBTixDQUYwQjtBQUczQyxZQUFJLFdBQVcsT0FBWDs7O0FBSHVDLFlBTXJDLGFBQWEsTUFBTSxRQUFOLENBQWUsUUFBZixJQUEyQixZQUFZLFFBQVosQ0FBM0IsR0FBbUQsUUFBbkQsQ0FOd0I7O0FBUTNDLFlBQU0sY0FBYyxhQUFhLFdBQVcsS0FBWCxFQUFrQixrQkFBbEIsRUFBc0MsS0FBSyxPQUFMLENBQW5ELEdBQW1FLENBQW5FLENBUnVCOztBQVUzQyxjQUFNLFFBQU4sR0FBaUIsSUFBQyxDQUFLLEdBQUwsQ0FBUyxXQUFULEtBQXlCLE1BQU0sU0FBTixHQUFtQixXQUE3QyxHQUEyRCxDQUEzRCxDQVYwQjs7QUFZM0MsbUJBQVcsTUFBTSxPQUFOLEdBQWdCLEtBQUssYUFBTCxDQUFtQixNQUFNLFFBQU4sRUFBZ0Isa0JBQW5DLENBQWhCLENBWmdDOztBQWMzQyxZQUFJLGFBQWEsT0FBYixFQUFzQjtBQUN0QixpQkFBSyxVQUFMLEdBQWtCLElBQWxCLENBRHNCO1NBQTFCOztBQUlBLGVBQU8sUUFBUCxDQWxCMkM7Ozs7Ozs7Ozs7OztBQWhHN0MsdUJBNkhGLDZCQUFTLE9BQU87QUFDWixZQUFJLFFBQVEsS0FBUixDQURROztBQUdaLFlBQUksS0FBSyxPQUFMLEVBQWM7QUFDZCxpQkFBSyxjQUFMLEdBQXNCLEtBQUssVUFBTCxHQUFrQixDQUFsQixHQUFzQixLQUFLLGNBQUwsR0FBc0IsQ0FBdEIsQ0FEOUI7QUFFZCxvQkFBUyxLQUFLLGNBQUwsR0FBc0IsTUFBTSxpQkFBTixDQUZqQjtTQUFsQjs7QUFLQSxlQUFPLEtBQVAsQ0FSWTs7Ozs7Ozs7Ozs7OztBQTdIZCx1QkFpSkYsdUJBQU0sUUFBUSxPQUFPO0FBQ2pCLFlBQU0sZUFBZ0IsVUFBVSxNQUFNLEdBQU4sQ0FEZjtBQUVqQixZQUFNLGVBQWdCLFVBQVUsTUFBTSxHQUFOLENBRmY7QUFHakIsWUFBTSxpQkFBaUIsZ0JBQWdCLFlBQWhCLENBSE47O0FBS2pCLFlBQUksY0FBSixFQUFvQjtBQUNoQixxQkFBUyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsRUFBd0IsTUFBTSxHQUFOLEVBQVcsTUFBTSxHQUFOLENBQTVDLENBRGdCOztBQUdoQixnQkFBSSxNQUFNLE1BQU4sRUFBYztBQUNkLHNCQUFNLFFBQU4sR0FBaUIsWUFBWSxNQUFaLENBQW1CLEtBQW5CLENBQWpCLENBRGM7YUFBbEIsTUFFTyxJQUFJLE1BQU0sT0FBTixFQUFlO0FBQ3RCLDRCQUFZLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsZUFBZSxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQU4sQ0FBdEQsQ0FEc0I7YUFBbkI7U0FMWDs7QUFVQSxlQUFPLE1BQVAsQ0FmaUI7OztXQWpKbkI7RUFBaUI7O0FBb0t2QixPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiU2ltdWxhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5jb25zdCBBY3Rpb24gPSByZXF1aXJlKCcuL0FjdGlvbicpO1xuY29uc3QgY2FsYyA9IHJlcXVpcmUoJy4uL2luYy9jYWxjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpO1xuY29uc3Qgc2ltdWxhdGlvbnMgPSByZXF1aXJlKCcuL3NpbXVsYXRlL3NpbXVsYXRpb25zJyk7XG5cbi8vIFZhbHVlc1xuY29uc3QgREVGQVVMVF9QUk9QID0gJ3ZlbG9jaXR5JztcblxuY2xhc3MgU2ltdWxhdGUgZXh0ZW5kcyBBY3Rpb24ge1xuICAgIC8qXG4gICAgICAgICMgU2ltdWxhdGUgY2xhc3MgY29uc3RydWN0b3JcbiAgICAgICAgIyMgU2V0cyBwYXJlbnQgQWN0aW9uIGNsYXNzIGFuZCB0aGVuIGRlZmF1bHQgU2ltdWxhdGUgcHJvcGVydGllc1xuXG4gICAgICAgIEBwYXJhbSBbb2JqZWN0XVxuICAgICovXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVzVmVsb2NpdHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmluYWN0aXZlRnJhbWVzID0gMDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEdldCBkZWZhdWx0IFNpbXVsYXRlIHByb3BzXG5cbiAgICAgICAgQHJldHVybiBbb2JqZWN0XVxuICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXV0b0VuZDogdHJ1ZSxcbiAgICAgICAgICAgIG1heEluYWN0aXZlRnJhbWVzOiAzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBHZXQgZGVmYXVsdCBTaW11bGF0ZSB2YWx1ZSBwcm9wc1xuXG4gICAgICAgIEByZXR1cm4gW29iamVjdF1cbiAgICAqL1xuICAgIGdldERlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIFtzdHJpbmddOiBTaW11bGF0aW9uIHRvIC5ydW5cbiAgICAgICAgICAgIHNpbXVsYXRlOiBERUZBVUxUX1BST1AsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFtudW1iZXJdOiBBY2NlbGVyYXRpb24gdG8gYXBwbHkgdG8gdmFsdWUsIGluIHVuaXRzIHBlciBzZWNvbmRcbiAgICAgICAgICAgIGFjY2VsZXJhdGlvbjogMCxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gW251bWJlcl06IEZhY3RvciB0byBtdWx0aXBseSB2ZWxvY2l0eSBieSBvbiBib3VuY2VcbiAgICAgICAgICAgIGJvdW5jZTogMCxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gW251bWJlcl06IFNwcmluZyBzdHJlbmd0aCBkdXJpbmcgJ3N0cmluZydcbiAgICAgICAgICAgIHNwcmluZzogODAsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFtudW1iZXJdOiBUaW1lY29uc3RhbnQgb2YgZ2xpZGVcbiAgICAgICAgICAgIHRpbWVDb25zdGFudDogMzk1LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBbbnVtYmVyXTogU3RvcCBzaW11bGF0aW9uIHVuZGVyIHRoaXMgc3BlZWRcbiAgICAgICAgICAgIHN0b3BTcGVlZDogMC4wMDAxLFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBbYm9vbGVhbl06IENhcHR1cmUgd2l0aCBzcHJpbmcgcGh5c2ljcyBvbiBsaW1pdCBicmVhY2hcbiAgICAgICAgICAgIGNhcHR1cmU6IGZhbHNlLFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBbbnVtYmVyXTogRnJpY3Rpb24gdG8gYXBwbHkgcGVyIGZyYW1lXG4gICAgICAgICAgICBmcmljdGlvbjogMCxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdG86IDAsXG4gICAgICAgICAgICByb3VuZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEdldCBkZWZhdWx0IFNpbXVsYXRlIHZhbHVlIHByb3BlcnR5IG5hbWVcbiAgICAgICAgIyMgU2V0IHZhbHVlcyB0byB0aGlzIHdoZW4gYSBgdmFsdWVgIGlzIG5vdCBwcm92aWRlZCBhcyBhbiBvYmplY3RcblxuICAgICAgICBAcmV0dXJuIFtzdHJpbmddXG4gICAgKi9cbiAgICBnZXREZWZhdWx0VmFsdWVQcm9wKCkge1xuICAgICAgICByZXR1cm4gREVGQVVMVF9QUk9QO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgICMgTWV0aG9kIHRvIGZpcmUgd2hlbiBBY3Rpb24gc3RhcnRzXG4gICAgICAgICMjIFNldCBgc3RhcnRlZGAgdG8gY3VycmVudCB0aW1lLlxuICAgICovXG4gICAgb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdXRpbHMuY3VycmVudFRpbWUoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICAjIEZpcmUgYXQgc3RhcnQgb2YgZXZlcnkgZnJhbWVcbiAgICAgICAgIyMgU2V0IGBoYXNDaGFuZ2VkYCB0byBmYWxzZVxuICAgICovXG4gICAgb25GcmFtZVN0YXJ0KCkge1xuICAgICAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLypcbiAgICAgICAgIyBTaW11bGF0ZSB0aGUgYHZhbHVlYHMgcGVyLWZyYW1lIG1vdmVtZW50XG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW0FjdG9yXVxuICAgICAgICBAcGFyYW0gW1ZhbHVlXTogQ3VycmVudCB2YWx1ZVxuICAgICAgICBAcGFyYW0gW3N0cmluZ106IEtleSBvZiBjdXJyZW50IHZhbHVlXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogRHVyYXRpb24gb2YgZnJhbWUgaW4gbXNcbiAgICAgICAgQHJldHVybiBbbnVtYmVyXTogQ2FsY3VsYXRlZCB2YWx1ZVxuICAgICovXG4gICAgcHJvY2VzcyhhY3RvciwgdmFsdWUsIGtleSwgdGltZVNpbmNlTGFzdEZyYW1lKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB2YWx1ZS5jdXJyZW50O1xuICAgICAgICBjb25zdCBzaW11bGF0ZSA9IHZhbHVlLnNpbXVsYXRlO1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSBjdXJyZW50O1xuXG4gICAgICAgIC8vIElmIHN0cmluZywgdXNlIGluLWJ1aWx0IHNpbXVsYXRpb24gb3RoZXJ3aXNlIHRyZWF0IGFzIGZ1bmN0aW9uXG4gICAgICAgIGNvbnN0IHNpbXVsYXRpb24gPSB1dGlscy5pc1N0cmluZyhzaW11bGF0ZSkgPyBzaW11bGF0aW9uc1tzaW11bGF0ZV0gOiBzaW11bGF0ZTtcblxuICAgICAgICBjb25zdCBuZXdWZWxvY2l0eSA9IHNpbXVsYXRpb24gPyBzaW11bGF0aW9uKHZhbHVlLCB0aW1lU2luY2VMYXN0RnJhbWUsIHRoaXMuc3RhcnRlZCkgOiAwO1xuXG4gICAgICAgIHZhbHVlLnZlbG9jaXR5ID0gKE1hdGguYWJzKG5ld1ZlbG9jaXR5KSA+PSB2YWx1ZS5zdG9wU3BlZWQpID8gbmV3VmVsb2NpdHkgOiAwO1xuXG4gICAgICAgIG5ld1ZhbHVlID0gdmFsdWUuY3VycmVudCArIGNhbGMuc3BlZWRQZXJGcmFtZSh2YWx1ZS52ZWxvY2l0eSwgdGltZVNpbmNlTGFzdEZyYW1lKTtcblxuICAgICAgICBpZiAobmV3VmFsdWUgIT09IGN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgfVxuICAgIFxuICAgIC8qXG4gICAgICAgICMgSGFzIHRoaXMgYWN0aW9uIGVuZGVkP1xuICAgICAgICAjIyBVc2UgYSBmcmFtZWNvdW50ZXIgdG8gc2VlIGlmIEFjdGlvbiBoYXMgY2hhbmdlZCBpbiB0aGUgbGFzdCB4IGZyYW1lc1xuICAgICAgICBhbmQgZGVjbGFyZSBlbmRlZCBpZiBub3RcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbQWN0b3JdXG4gICAgICAgIEByZXR1cm4gW2Jvb2xlYW5dOiBIYXMgQWN0aW9uIGVuZGVkP1xuICAgICovXG4gICAgaGFzRW5kZWQoYWN0b3IpIHtcbiAgICAgICAgbGV0IGVuZGVkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b0VuZCkge1xuICAgICAgICAgICAgdGhpcy5pbmFjdGl2ZUZyYW1lcyA9IHRoaXMuaGFzQ2hhbmdlZCA/IDAgOiB0aGlzLmluYWN0aXZlRnJhbWVzICsgMTtcbiAgICAgICAgICAgIGVuZGVkID0gKHRoaXMuaW5hY3RpdmVGcmFtZXMgPiBhY3Rvci5tYXhJbmFjdGl2ZUZyYW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW5kZWQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgIyBMaW1pdCBvdXRwdXQgdG8gdmFsdWUgcmFuZ2UsIGlmIGFueVxuICAgICAgICAjIyBJZiB2ZWxvY2l0eSBpcyBhdCBvciBtb3JlIHRoYW4gcmFuZ2UsIGFuZCB2YWx1ZSBoYXMgYSBib3VuY2UgcHJvcGVydHksXG4gICAgICAgIHJ1biB0aGUgYm91bmNlIHNpbXVsYXRpb25cbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbbnVtYmVyXTogQ2FsY3VsYXRlZCBvdXRwdXRcbiAgICAgICAgQHBhcmFtIFtWYWx1ZV06IEN1cnJlbnQgVmFsdWVcbiAgICAgICAgQHJldHVybiBbbnVtYmVyXTogTGltaXQtYWRqdXN0ZWQgb3V0cHV0XG4gICAgKi9cbiAgICBsaW1pdChvdXRwdXQsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGlzT3V0c2lkZU1heCA9IChvdXRwdXQgPj0gdmFsdWUubWF4KTtcbiAgICAgICAgY29uc3QgaXNPdXRzaWRlTWluID0gKG91dHB1dCA8PSB2YWx1ZS5taW4pO1xuICAgICAgICBjb25zdCBpc091dHNpZGVSYW5nZSA9IGlzT3V0c2lkZU1heCB8fCBpc091dHNpZGVNaW47XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKGlzT3V0c2lkZVJhbmdlKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBjYWxjLnJlc3RyaWN0ZWQob3V0cHV0LCB2YWx1ZS5taW4sIHZhbHVlLm1heCk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5ib3VuY2UpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS52ZWxvY2l0eSA9IHNpbXVsYXRpb25zLmJvdW5jZSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNhcHR1cmUpIHtcbiAgICAgICAgICAgICAgICBzaW11bGF0aW9ucy5jYXB0dXJlKHZhbHVlLCBpc091dHNpZGVNYXggPyB2YWx1ZS5tYXggOiB2YWx1ZS5taW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2ltdWxhdGU7Il19

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var calc = __webpack_require__(13),
	    utils = __webpack_require__(4),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3NpbXVsYXRlL3NpbXVsYXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUksT0FBTyxRQUFRLGdCQUFSLENBQVA7SUFDQSxRQUFRLFFBQVEsaUJBQVIsQ0FBUjtJQUNBLGdCQUFnQixLQUFLLGFBQUw7Ozs7O0FBS3BCLElBQUksY0FBYzs7Ozs7Ozs7QUFRZCxjQUFVLFVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQjtBQUNqQyxjQUFNLFFBQU4sR0FBaUIsTUFBTSxRQUFOLEdBQWlCLGNBQWMsTUFBTSxZQUFOLEVBQW9CLFFBQWxDLENBQWpCLENBRGdCOztBQUdqQyxlQUFPLFlBQVksUUFBWixDQUFxQixLQUFyQixFQUE0QixRQUE1QixDQUFQLENBSGlDO0tBQTNCOzs7Ozs7OztBQVlWLFdBQU8sVUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCLE9BQTNCLEVBQW9DO0FBQ3ZDLFlBQUksb0JBQW9CLENBQUUsTUFBTSxXQUFOLEVBQUYsR0FBd0IsT0FBeEI7WUFDcEIsUUFBUSxDQUFFLE1BQU0sRUFBTixHQUFXLEtBQUssR0FBTCxDQUFTLG9CQUFvQixNQUFNLFlBQU4sQ0FBMUMsQ0FGMkI7O0FBSXZDLGVBQU8sS0FBQyxDQUFNLEVBQU4sR0FBVyxLQUFYLEdBQW9CLE1BQU0sT0FBTixDQUpXO0tBQXBDOzs7Ozs7O0FBYVAsY0FBVSxVQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkI7QUFDakMsWUFBSSxjQUFjLGNBQWMsTUFBTSxRQUFOLEVBQWdCLFFBQTlCLEtBQTJDLElBQUksTUFBTSxRQUFOLENBQS9DLENBRGU7O0FBR2pDLGVBQU8sS0FBSyxjQUFMLENBQW9CLFdBQXBCLEVBQWlDLFFBQWpDLENBQVAsQ0FIaUM7S0FBM0I7O0FBTVYsWUFBUSxVQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkI7QUFDL0IsWUFBSSxXQUFXLE1BQU0sRUFBTixHQUFXLE1BQU0sT0FBTixDQURLOztBQUcvQixjQUFNLFFBQU4sSUFBa0IsV0FBVyxjQUFjLE1BQU0sTUFBTixFQUFjLFFBQTVCLENBQVgsQ0FIYTs7QUFLL0IsZUFBTyxZQUFZLFFBQVosQ0FBcUIsS0FBckIsRUFBNEIsUUFBNUIsQ0FBUCxDQUwrQjtLQUEzQjs7QUFRUixZQUFRLFVBQVUsS0FBVixFQUFpQjtBQUNyQixZQUFJLFdBQVcsQ0FBWDtZQUNBLEtBQUssTUFBTSxFQUFOO1lBQ0wsVUFBVSxNQUFNLE9BQU47WUFDVixTQUFTLE1BQU0sTUFBTjs7O0FBSlEsWUFPakIsTUFBTSxRQUFOLEtBQW1CLE9BQW5CLEVBQTRCO0FBQzVCLHVCQUFXLEtBQUssT0FBTCxDQURpQjtBQUU1QixrQkFBTSxFQUFOLEdBQVcsVUFBVyxXQUFXLE1BQVgsQ0FGTTtTQUFoQzs7QUFLQSxlQUFPLE1BQU0sUUFBTixJQUFrQixDQUFFLE1BQUYsQ0FaSjtLQUFqQjs7QUFlUixhQUFTLFVBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5QjtBQUM5QixjQUFNLEVBQU4sR0FBVyxNQUFYLENBRDhCO0FBRTlCLGNBQU0sUUFBTixHQUFpQixRQUFqQixDQUY4QjtBQUc5QixjQUFNLE9BQU4sR0FBZ0IsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFOLEdBQVksU0FBWixDQUhFO0tBQXpCO0NBOURUOztBQXFFSixPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoic2ltdWxhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNhbGMgPSByZXF1aXJlKCcuLi8uLi9pbmMvY2FsYycpLFxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi4vLi4vaW5jL3V0aWxzJyksXG4gICAgc3BlZWRQZXJGcmFtZSA9IGNhbGMuc3BlZWRQZXJGcmFtZTtcblxuLypcbiAgICBBZGQgY29yZSBwaHlzaWNzIHNpbXVsYXRpb25zXG4qL1xudmFyIHNpbXVsYXRpb25zID0ge1xuICAgIC8qXG4gICAgICAgIFZlbG9jaXR5XG4gICAgICAgIFxuICAgICAgICBUaGUgZGVmYXVsdCAucnVuKCkgc2ltdWxhdGlvbi5cbiAgICAgICAgXG4gICAgICAgIEFwcGxpZXMgYW55IHNldCBkZWNlbGVyYXRpb24gYW5kIGFjY2VsZXJhdGlvbiB0byBleGlzdGluZyB2ZWxvY2l0eVxuICAgICovXG4gICAgdmVsb2NpdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZHVyYXRpb24pIHtcbiAgICAgICAgdmFsdWUudmVsb2NpdHkgPSB2YWx1ZS52ZWxvY2l0eSArIHNwZWVkUGVyRnJhbWUodmFsdWUuYWNjZWxlcmF0aW9uLCBkdXJhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHNpbXVsYXRpb25zLmZyaWN0aW9uKHZhbHVlLCBkdXJhdGlvbik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIEdsaWRlXG4gICAgICAgIFxuICAgICAgICBFbXVsYXRlcyB0b3VjaCBkZXZpY2Ugc2Nyb2xsaW5nIGVmZmVjdHMgd2l0aCBleHBvbmVudGlhbCBkZWNheVxuICAgICAgICBodHRwOi8vYXJpeWEub2ZpbGFicy5jb20vMjAxMy8xMS9qYXZhc2NyaXB0LWtpbmV0aWMtc2Nyb2xsaW5nLXBhcnQtMi5odG1sXG4gICAgKi9cbiAgICBnbGlkZTogZnVuY3Rpb24gKHZhbHVlLCBkdXJhdGlvbiwgc3RhcnRlZCkge1xuICAgICAgICB2YXIgdGltZVVudGlsRmluaXNoZWQgPSAtIHV0aWxzLmN1cnJlbnRUaW1lKCkgLSBzdGFydGVkLFxuICAgICAgICAgICAgZGVsdGEgPSAtIHZhbHVlLnRvICogTWF0aC5leHAodGltZVVudGlsRmluaXNoZWQgLyB2YWx1ZS50aW1lQ29uc3RhbnQpO1xuXG4gICAgICAgIHJldHVybiAodmFsdWUudG8gKyBkZWx0YSkgLSB2YWx1ZS5jdXJyZW50O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBGcmljdGlvblxuXG4gICAgICAgIEFwcGx5IGZyaWN0aW9uIHRvIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgICAgIFRPRE86IE1ha2UgdGhpcyBmcmFtZXJhdGUtaW5kZXBlbmRlbnRcbiAgICAqL1xuICAgIGZyaWN0aW9uOiBmdW5jdGlvbiAodmFsdWUsIGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBuZXdWZWxvY2l0eSA9IHNwZWVkUGVyRnJhbWUodmFsdWUudmVsb2NpdHksIGR1cmF0aW9uKSAqICgxIC0gdmFsdWUuZnJpY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiBjYWxjLnNwZWVkUGVyU2Vjb25kKG5ld1ZlbG9jaXR5LCBkdXJhdGlvbik7XG4gICAgfSxcblxuICAgIHNwcmluZzogZnVuY3Rpb24gKHZhbHVlLCBkdXJhdGlvbikge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSB2YWx1ZS50byAtIHZhbHVlLmN1cnJlbnQ7XG5cbiAgICAgICAgdmFsdWUudmVsb2NpdHkgKz0gZGlzdGFuY2UgKiBzcGVlZFBlckZyYW1lKHZhbHVlLnNwcmluZywgZHVyYXRpb24pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNpbXVsYXRpb25zLmZyaWN0aW9uKHZhbHVlLCBkdXJhdGlvbik7XG4gICAgfSxcblxuICAgIGJvdW5jZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IDAsXG4gICAgICAgICAgICB0byA9IHZhbHVlLnRvLFxuICAgICAgICAgICAgY3VycmVudCA9IHZhbHVlLmN1cnJlbnQsXG4gICAgICAgICAgICBib3VuY2UgPSB2YWx1ZS5ib3VuY2U7XG4gICAgICAgIFxuICAgICAgICAvLyBJZiB3ZSdyZSB1c2luZyBnbGlkZSBzaW11bGF0aW9uIHdlIGhhdmUgdG8gZmxpcCBvdXIgdGFyZ2V0IHRvb1xuICAgICAgICBpZiAodmFsdWUuc2ltdWxhdGUgPT09ICdnbGlkZScpIHtcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdG8gLSBjdXJyZW50O1xuICAgICAgICAgICAgdmFsdWUudG8gPSBjdXJyZW50IC0gKGRpc3RhbmNlICogYm91bmNlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHZhbHVlLnZlbG9jaXR5ICo9IC0gYm91bmNlO1xuICAgIH0sXG5cbiAgICBjYXB0dXJlOiBmdW5jdGlvbiAodmFsdWUsIHRhcmdldCkge1xuICAgICAgICB2YWx1ZS50byA9IHRhcmdldDtcbiAgICAgICAgdmFsdWUuc2ltdWxhdGUgPSAnc3ByaW5nJztcbiAgICAgICAgdmFsdWUuY2FwdHVyZSA9IHZhbHVlLm1pbiA9IHZhbHVlLm1heCA9IHVuZGVmaW5lZDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNpbXVsYXRpb25zO1xuIl19

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Action = __webpack_require__(15),
	    Pointer = __webpack_require__(46),
	    calc = __webpack_require__(13);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFUO0lBQ0EsVUFBVSxRQUFRLGtCQUFSLENBQVY7SUFDQSxPQUFPLFFBQVEsYUFBUixDQUFQOztJQUVFOzs7Ozs7Ozs7Ozs7O29CQUlGLHFDQUFhLE9BQU8sZUFBZSxZQUFZO0FBQzNDLGNBQU0sS0FBTixDQUFZLEtBQVosR0FBb0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFuQixDQUFwQixDQUQyQztBQUUzQyxhQUFLLFdBQUwsR0FBbUIsS0FBSyxNQUFMLENBQVksS0FBSyxXQUFMLEVBQWtCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBakQsQ0FGMkM7QUFHM0MsYUFBSyxhQUFMLEdBQXFCLGFBQXJCLENBSDJDOzs7Ozs7Ozs7OztBQUo3QyxvQkFpQkYsMkJBQVEsT0FBTyxPQUFPLEtBQUs7QUFDdkIsWUFBSSxXQUFXLE1BQU0sT0FBTixDQURROztBQUd2QixZQUFJLEtBQUssV0FBTCxDQUFpQixjQUFqQixDQUFnQyxHQUFoQyxDQUFKLEVBQTBDO0FBQ3RDLHVCQUFXLEtBQUMsQ0FBTSxNQUFOLEdBQWdCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBbkIsQ0FBakIsR0FBMkMsTUFBTSxNQUFOLEdBQWdCLEtBQUssV0FBTCxDQUFpQixHQUFqQixJQUF3QixNQUFNLEdBQU4sQ0FEeEQ7U0FBMUM7O0FBSUEsZUFBTyxRQUFQLENBUHVCOzs7Ozs7Ozs7QUFqQnpCLG9CQWdDRiwrQkFBVztBQUNQLGVBQU8sS0FBUCxDQURPOzs7QUFoQ1Qsb0JBb0NGLG1DQUFhO0FBQ1QsMEJBQU0sVUFBTixZQURTOztBQUdULFlBQUksS0FBSyxLQUFMLElBQWMsS0FBSyxLQUFMLENBQVcsSUFBWCxFQUFpQjtBQUMvQixpQkFBSyxLQUFMLENBQVcsSUFBWCxHQUQrQjtTQUFuQzs7QUFJQSxlQUFPLElBQVAsQ0FQUzs7O0FBcENYLG9CQThDRiwrQkFBVSxPQUFPO0FBQ2IsYUFBSyxLQUFMLEdBQWEsQ0FBRSxNQUFNLE9BQU4sR0FBaUIsSUFBSSxPQUFKLENBQVksS0FBWixDQUFuQixHQUF3QyxLQUF4QyxDQURBO0FBRWIsYUFBSyxXQUFMLEdBQW1CLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBbkIsQ0FGYTs7O0FBOUNmLG9CQW1ERiw2Q0FBa0I7QUFDZCxlQUFPO0FBQ0gsaUJBQUssQ0FBTDtBQUNBLHVCQUFXLENBQVg7QUFDQSxvQkFBUSxLQUFSO0FBQ0Esb0JBQVEsQ0FBUjtTQUpKLENBRGM7OztXQW5EaEI7RUFBYzs7QUE2RHBCLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJUcmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBBY3Rpb24gPSByZXF1aXJlKCcuL0FjdGlvbicpLFxuICAgIFBvaW50ZXIgPSByZXF1aXJlKCcuLi9pbnB1dC9Qb2ludGVyJyksXG4gICAgY2FsYyA9IHJlcXVpcmUoJy4uL2luYy9jYWxjJyk7XG5cbmNsYXNzIFRyYWNrIGV4dGVuZHMgQWN0aW9uIHtcbiAgICAvKlxuICAgICAgICBVcGRhdGUgaW5wdXQgb2Zmc2V0XG4gICAgKi9cbiAgICBvbkZyYW1lU3RhcnQoYWN0b3IsIGZyYW1lRHVyYXRpb24sIGZyYW1lc3RhbXApIHtcbiAgICAgICAgYWN0b3Iuc3RhdGUuaW5wdXQgPSB0aGlzLmlucHV0Lm9uRnJhbWUoZnJhbWVzdGFtcCk7XG4gICAgICAgIHRoaXMuaW5wdXRPZmZzZXQgPSBjYWxjLm9mZnNldCh0aGlzLmlucHV0T3JpZ2luLCB0aGlzLmlucHV0LmN1cnJlbnQpO1xuICAgICAgICB0aGlzLmZyYW1lRHVyYXRpb24gPSBmcmFtZUR1cmF0aW9uO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIE1vdmUgVmFsdWUgcmVsYXRpdmUgdG8gSW5wdXQgbW92ZW1lbnRcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbVmFsdWVdOiBDdXJyZW50IHZhbHVlXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXTogS2V5IG9mIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgQHJldHVybiBbbnVtYmVyXTogQ2FsY3VsYXRlZCB2YWx1ZVxuICAgICovXG4gICAgcHJvY2VzcyhhY3RvciwgdmFsdWUsIGtleSkge1xuICAgICAgICB2YXIgbmV3VmFsdWUgPSB2YWx1ZS5jdXJyZW50O1xuXG4gICAgICAgIGlmICh0aGlzLmlucHV0T2Zmc2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gKHZhbHVlLmRpcmVjdCkgPyB0aGlzLmlucHV0LmN1cnJlbnRba2V5XSA6IHZhbHVlLm9yaWdpbiArICh0aGlzLmlucHV0T2Zmc2V0W2tleV0gKiB2YWx1ZS5hbXApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEhhcyB0aGlzIEFjdGlvbiBlbmRlZD8gXG4gICAgICAgIFxuICAgICAgICBAcmV0dXJuIFtib29sZWFuXTogRmFsc2UgdG8gbWFrZSB1c2VyIG1hbnVhbGx5IGZpbmlzaCAudHJhY2soKVxuICAgICovXG4gICAgaGFzRW5kZWQoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICBzdXBlci5kZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5zdG9wKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJpbmRJbnB1dChpbnB1dCkge1xuICAgICAgICB0aGlzLmlucHV0ID0gKCFpbnB1dC5jdXJyZW50KSA/IG5ldyBQb2ludGVyKGlucHV0KSA6IGlucHV0O1xuICAgICAgICB0aGlzLmlucHV0T3JpZ2luID0gdGhpcy5pbnB1dC5nZXQoKTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbXA6IDEsXG4gICAgICAgICAgICBlc2NhcGVBbXA6IDAsXG4gICAgICAgICAgICBkaXJlY3Q6IGZhbHNlLFxuICAgICAgICAgICAgc21vb3RoOiAwXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNrOyJdfQ==

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Input = __webpack_require__(40),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnB1dC9Qb2ludGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUksUUFBUSxRQUFRLFlBQVIsQ0FBUjtJQUNBLGNBREo7OztBQUdJLFlBQVksV0FBWjtJQUNBLFlBQVksV0FBWjs7Ozs7Ozs7Ozs7QUFXQSxlQUFlLFVBQVUsS0FBVixFQUFpQixZQUFqQixFQUErQjtBQUMxQyxRQUFJLGVBQWUsZUFBZSxNQUFNLGNBQU4sQ0FBcUIsQ0FBckIsQ0FBZixHQUF5QyxLQUF6QyxDQUR1Qjs7QUFHMUMsV0FBTztBQUNILFdBQUcsZUFBZSxhQUFhLE9BQWIsR0FBdUIsTUFBTSxLQUFOO0FBQ3pDLFdBQUcsZUFBZSxhQUFhLE9BQWIsR0FBdUIsTUFBTSxLQUFOO0tBRjdDLENBSDBDO0NBQS9COzs7Ozs7Ozs7O0FBaUJmLGlCQUFpQixVQUFVLEtBQVYsRUFBaUI7QUFDOUIsV0FBTyxNQUFNLGFBQU4sSUFBdUIsS0FBdkIsQ0FEdUI7Q0FBakI7Ozs7O0FBUWpCLFVBQVUsVUFBVSxDQUFWLEVBQWE7QUFDbkIsUUFBSSxRQUFRLGVBQWUsQ0FBZixDQUFSOztBQUNBLGNBQVUsS0FBQyxDQUFNLE9BQU4sR0FBaUIsSUFBbEIsR0FBeUIsS0FBekI7UUFDVixhQUFhLGFBQWEsS0FBYixFQUFvQixPQUFwQixDQUFiLENBSGU7O0FBS25CLFNBQUssTUFBTCxDQUFZLFVBQVosRUFMbUI7QUFNbkIsU0FBSyxPQUFMLEdBQWUsT0FBZixDQU5tQjtBQU9uQixTQUFLLFVBQUwsR0FQbUI7Q0FBYjtJQVVWLFFBQVEsUUFBUSxTQUFSLEdBQW9CLElBQUksS0FBSixFQUFwQjs7Ozs7QUFLWixNQUFNLFVBQU4sR0FBbUIsWUFBWTtBQUMzQixTQUFLLFNBQUwsR0FBaUIsS0FBSyxPQUFMLEdBQWUsU0FBZixHQUEyQixTQUEzQixDQURVO0FBRTNCLFNBQUssUUFBTCxHQUFnQixJQUFoQixDQUYyQjs7QUFJM0IscUJBQWlCLElBQWpCLENBSjJCOztBQU0zQixhQUFTLGVBQVQsQ0FBeUIsZ0JBQXpCLENBQTBDLEtBQUssU0FBTCxFQUFnQixLQUFLLE1BQUwsQ0FBMUQsQ0FOMkI7Q0FBWjs7Ozs7QUFZbkIsTUFBTSxZQUFOLEdBQXFCLFlBQVk7QUFDN0IsYUFBUyxlQUFULENBQXlCLG1CQUF6QixDQUE2QyxLQUFLLFNBQUwsRUFBZ0IsS0FBSyxNQUFMLENBQTdELENBRDZCO0NBQVo7Ozs7Ozs7QUFTckIsTUFBTSxNQUFOLEdBQWUsVUFBVSxDQUFWLEVBQWE7QUFDeEIsUUFBSSxXQUFXLGFBQWEsQ0FBYixFQUFnQixlQUFlLE9BQWYsQ0FBM0IsQ0FEb0I7QUFFeEIsUUFBSSxlQUFlLENBQWYsQ0FBSixDQUZ3QjtBQUd4QixNQUFFLGNBQUYsR0FId0I7QUFJeEIsbUJBQWUsTUFBZixDQUFzQixRQUF0QixFQUp3QjtDQUFiOztBQU9mLE1BQU0sSUFBTixHQUFhLFlBQVk7QUFDckIsU0FBSyxZQUFMLEdBRHFCO0NBQVo7O0FBSWIsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6IlBvaW50ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9JbnB1dC5qcycpLFxuICAgIGN1cnJlbnRQb2ludGVyLCAvLyBTb3J0IHRoaXMgb3V0IGZvciBtdWx0aXRvdWNoXG4gICAgXG4gICAgVE9VQ0hNT1ZFID0gJ3RvdWNobW92ZScsXG4gICAgTU9VU0VNT1ZFID0gJ21vdXNlbW92ZScsXG5cbiAgICAvKlxuICAgICAgICBDb252ZXJ0IGV2ZW50IGludG8gcG9pbnRcbiAgICAgICAgXG4gICAgICAgIFNjcmFwZSB0aGUgeC95IGNvb3JkaW5hdGVzIGZyb20gdGhlIHByb3ZpZGVkIGV2ZW50XG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW2V2ZW50XTogT3JpZ2luYWwgcG9pbnRlciBldmVudFxuICAgICAgICBAcGFyYW0gW2Jvb2xlYW5dOiBUcnVlIGlmIHRvdWNoIGV2ZW50XG4gICAgICAgIEByZXR1cm4gW29iamVjdF06IHgveSBjb29yZGluYXRlcyBvZiBldmVudFxuICAgICovXG4gICAgZXZlbnRUb1BvaW50ID0gZnVuY3Rpb24gKGV2ZW50LCBpc1RvdWNoRXZlbnQpIHtcbiAgICAgICAgdmFyIHRvdWNoQ2hhbmdlZCA9IGlzVG91Y2hFdmVudCA/IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdIDogZmFsc2U7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdG91Y2hDaGFuZ2VkID8gdG91Y2hDaGFuZ2VkLmNsaWVudFggOiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHk6IHRvdWNoQ2hhbmdlZCA/IHRvdWNoQ2hhbmdlZC5jbGllbnRZIDogZXZlbnQucGFnZVlcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIFxuICAgIC8qXG4gICAgICAgIEdldCBhY3R1YWwgZXZlbnRcbiAgICAgICAgXG4gICAgICAgIENoZWNrcyBmb3IgalF1ZXJ5J3MgLm9yaWdpbmFsRXZlbnQgaWYgcHJlc2VudFxuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFtldmVudCB8IGpRdWVyeSBldmVudF1cbiAgICAgICAgQHJldHVybiBbZXZlbnRdOiBUaGUgYWN0dWFsIEpTIGV2ZW50ICBcbiAgICAqL1xuICAgIGdldEFjdHVhbEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50O1xuICAgIH0sXG5cbiAgICBcbiAgICAvKlxuICAgICAgICBQb2ludGVyIGNvbnN0cnVjdG9yXG4gICAgKi9cbiAgICBQb2ludGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gZ2V0QWN0dWFsRXZlbnQoZSksIC8vIEluIGNhc2Ugb2YgalF1ZXJ5IGV2ZW50XG4gICAgICAgICAgICBpc1RvdWNoID0gKGV2ZW50LnRvdWNoZXMpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRQb2ludCA9IGV2ZW50VG9Qb2ludChldmVudCwgaXNUb3VjaCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnVwZGF0ZShzdGFydFBvaW50KTtcbiAgICAgICAgdGhpcy5pc1RvdWNoID0gaXNUb3VjaDtcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgfSxcbiAgICBcbiAgICBwcm90byA9IFBvaW50ZXIucHJvdG90eXBlID0gbmV3IElucHV0KCk7XG5cbi8qXG4gICAgQmluZCBtb3ZlIGV2ZW50XG4qL1xucHJvdG8uYmluZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdmVFdmVudCA9IHRoaXMuaXNUb3VjaCA/IFRPVUNITU9WRSA6IE1PVVNFTU9WRTtcbiAgICB0aGlzLmF1dG9TdG9wID0gdHJ1ZTtcbiAgICBcbiAgICBjdXJyZW50UG9pbnRlciA9IHRoaXM7XG4gICAgXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5tb3ZlRXZlbnQsIHRoaXMub25Nb3ZlKTtcbn07XG5cbi8qXG4gICAgVW5iaW5kIG1vdmUgZXZlbnRcbiovXG5wcm90by51bmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5tb3ZlRXZlbnQsIHRoaXMub25Nb3ZlKTtcbn07XG5cbi8qXG4gICAgUG9pbnRlciBvbk1vdmUgZXZlbnQgaGFuZGxlclxuICAgIFxuICAgIEBwYXJhbSBbZXZlbnRdOiBQb2ludGVyIG1vdmUgZXZlbnRcbiovXG5wcm90by5vbk1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBuZXdQb2ludCA9IGV2ZW50VG9Qb2ludChlLCBjdXJyZW50UG9pbnRlci5pc1RvdWNoKTtcbiAgICBlID0gZ2V0QWN0dWFsRXZlbnQoZSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGN1cnJlbnRQb2ludGVyLnVwZGF0ZShuZXdQb2ludCk7XG59O1xuXG5wcm90by5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50ZXI7Il19

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Actor = __webpack_require__(5),
	    Iterator = __webpack_require__(42),
	    selectDom = __webpack_require__(11);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvc2VsZWN0LWFjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBUjtJQUNBLFdBQVcsUUFBUSxzQkFBUixDQUFYO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjs7QUFFSixJQUFNLFlBQVksYUFBWjs7QUFFTixPQUFPLE9BQVAsR0FBaUIsVUFBVSxRQUFWLEVBQStCO1FBQVgsNkRBQU8sa0JBQUk7O0FBQzVDLFFBQUksTUFBTSxVQUFVLFFBQVYsQ0FBTjtRQUNBLFNBQVMsRUFBVCxDQUZ3Qzs7QUFJNUMsUUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQWE7QUFDckIsWUFBSSxRQUFRLFFBQVEsU0FBUixDQUFSLENBRGlCOztBQUdyQixZQUFJLENBQUMsS0FBRCxFQUFRO0FBQ1IsaUJBQUssT0FBTCxHQUFlLE9BQWYsQ0FEUTtBQUVSLG9CQUFRLFFBQVEsU0FBUixJQUFxQixJQUFJLEtBQUosQ0FBVSxJQUFWLENBQXJCLENBRkE7U0FBWjs7QUFLQSxlQUFPLElBQVAsQ0FBWSxLQUFaLEVBUnFCO0tBQWIsQ0FBWixDQUo0Qzs7QUFlNUMsV0FBTyxNQUFDLENBQU8sTUFBUCxHQUFnQixDQUFoQixHQUFxQixJQUFJLFFBQUosQ0FBYSxNQUFiLENBQXRCLEdBQTZDLE9BQU8sQ0FBUCxDQUE3QyxDQWZxQztDQUEvQiIsImZpbGUiOiJzZWxlY3QtYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQWN0b3IgPSByZXF1aXJlKCcuLi9hY3Rvci9BY3RvcicpLFxuICAgIEl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaXRlcmF0b3IvSXRlcmF0b3InKSxcbiAgICBzZWxlY3REb20gPSByZXF1aXJlKCcuL3NlbGVjdC1kb20nKTtcblxuY29uc3QgU0FWRV9QUk9QID0gJ19fcG1fYWN0b3JfJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdHMgPSB7fSkge1xuICAgIHZhciBkb20gPSBzZWxlY3REb20oc2VsZWN0b3IpLFxuICAgICAgICBhY3RvcnMgPSBbXTtcblxuICAgIGRvbS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGxldCBhY3RvciA9IGVsZW1lbnRbU0FWRV9QUk9QXTtcblxuICAgICAgICBpZiAoIWFjdG9yKSB7XG4gICAgICAgICAgICBvcHRzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgYWN0b3IgPSBlbGVtZW50W1NBVkVfUFJPUF0gPSBuZXcgQWN0b3Iob3B0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBhY3RvcnMucHVzaChhY3Rvcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKGFjdG9ycy5sZW5ndGggPiAxKSA/IG5ldyBJdGVyYXRvcihhY3RvcnMpIDogYWN0b3JzWzBdO1xufTtcbiJdfQ==

/***/ },
/* 48 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3R3ZWVuL21vZGlmeS1lYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxPQUFQLEdBQWlCLFVBQUMsTUFBRDtvQ0FBWTs7OztTQUFTLFVBQUMsUUFBRDtXQUFjLHlCQUFPLGlCQUFhLEtBQXBCO0dBQWQ7Q0FBckIiLCJmaWxlIjoibW9kaWZ5LWVhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IChlYXNpbmcsIC4uLmFyZ3MpID0+IChwcm9ncmVzcykgPT4gZWFzaW5nKHByb2dyZXNzLCAuLi5hcmdzKTsiXX0=

/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    defaultProps: {
	        min: 0,
	        max: 1
	    }
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9hbHBoYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGtCQUFjO0FBQ1YsYUFBSyxDQUFMO0FBQ0EsYUFBSyxDQUFMO0tBRko7Q0FESiIsImZpbGUiOiJhbHBoYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBtaW46IDAsXG4gICAgICAgIG1heDogMVxuICAgIH1cbn07Il19

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    defaultProps: {
	        unit: 'deg'
	    }
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9hbmdsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGtCQUFjO0FBQ1YsY0FBTSxLQUFOO0tBREo7Q0FESiIsImZpbGUiOiJhbmdsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICB1bml0OiAnZGVnJ1xuICAgIH1cbn07Il19

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    defaultProps: {
	        unit: 'px'
	    }
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9weC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGtCQUFjO0FBQ1YsY0FBTSxJQUFOO0tBREo7Q0FESiIsImZpbGUiOiJweC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICB1bml0OiAncHgnXG4gICAgfVxufTsiXX0=

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(53),
	    getColorValues = __webpack_require__(54),
	    functionCreate = __webpack_require__(57),
	    defaultProps = __webpack_require__(58),
	    terms = __webpack_require__(25).hsl;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9oc2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLGlDQUFSLENBQWxCO0lBQ0EsaUJBQWlCLFFBQVEsaUNBQVIsQ0FBakI7SUFDQSxpQkFBaUIsUUFBUSxnQ0FBUixDQUFqQjtJQUNBLGVBQWUsUUFBUSwwQkFBUixDQUFmO0lBQ0EsUUFBUSxRQUFRLHVCQUFSLEVBQWlDLEdBQWpDOztBQUVaLE9BQU8sT0FBUCxHQUFpQjs7QUFFYixrQkFBYztBQUNWLGFBQUs7QUFDRCxpQkFBSyxDQUFMO0FBQ0EsaUJBQUssR0FBTDtTQUZKO0FBSUEsb0JBQVksYUFBYSxPQUFiO0FBQ1osbUJBQVcsYUFBYSxPQUFiO0FBQ1gsZUFBTyxhQUFhLE9BQWI7S0FQWDs7QUFVQSxVQUFNO2VBQVUsU0FBUyxNQUFNLE9BQU4sQ0FBYyxLQUFkLElBQXVCLENBQUMsQ0FBRDtLQUExQzs7QUFFTixXQUFPO2VBQVMsZUFBZSxLQUFmLEVBQXNCLEtBQXRCO0tBQVQ7O0FBRVAsYUFBUztlQUFVLGVBQWUsZ0JBQWdCLE1BQWhCLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLEVBQXFDLENBQXJDLENBQWYsRUFBd0QsTUFBeEQ7S0FBVjtDQWhCYiIsImZpbGUiOiJoc2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlRGVsaW1pdGVkID0gcmVxdWlyZSgnLi9tYW5pcHVsYXRvcnMvY3JlYXRlLWRlbGltaXRlZCcpLFxuICAgIGdldENvbG9yVmFsdWVzID0gcmVxdWlyZSgnLi9tYW5pcHVsYXRvcnMvZ2V0LWNvbG9yLXZhbHVlcycpLFxuICAgIGZ1bmN0aW9uQ3JlYXRlID0gcmVxdWlyZSgnLi9tYW5pcHVsYXRvcnMvZnVuY3Rpb24tY3JlYXRlJyksXG4gICAgZGVmYXVsdFByb3BzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy9kZWZhdWx0LXByb3BzJyksXG4gICAgdGVybXMgPSByZXF1aXJlKCcuL3NldHRpbmdzL2RpY3Rpb25hcnknKS5oc2w7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIEh1ZToge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAzNjBcbiAgICAgICAgfSxcbiAgICAgICAgU2F0dXJhdGlvbjogZGVmYXVsdFByb3BzLnBlcmNlbnQsXG4gICAgICAgIExpZ2h0bmVzczogZGVmYXVsdFByb3BzLnBlcmNlbnQsXG4gICAgICAgIEFscGhhOiBkZWZhdWx0UHJvcHMub3BhY2l0eVxuICAgIH0sXG5cbiAgICB0ZXN0OiB2YWx1ZSA9PiAodmFsdWUgJiYgdmFsdWUuaW5kZXhPZignaHNsJykgPiAtMSksXG4gICAgXG4gICAgc3BsaXQ6IHZhbHVlID0+IGdldENvbG9yVmFsdWVzKHZhbHVlLCB0ZXJtcyksXG5cbiAgICBjb21iaW5lOiB2YWx1ZXMgPT4gZnVuY3Rpb25DcmVhdGUoY3JlYXRlRGVsaW1pdGVkKHZhbHVlcywgdGVybXMsICcsICcsIDIpLCAnaHNsYScpXG59OyJdfQ==

/***/ },
/* 53 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvY3JlYXRlLWRlbGltaXRlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sT0FBUCxHQUFpQixVQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFNBQWhCLEVBQTJCLElBQTNCLEVBQW9DO0FBQ2pELFFBQUksV0FBVyxFQUFYO1FBQ0EsTUFBTSxFQUFOO1FBQ0EsSUFBSSxDQUFKO1FBQ0EsV0FBVyxNQUFNLE1BQU4sQ0FKa0M7O0FBTWpELFdBQU8sSUFBSSxRQUFKLEVBQWMsR0FBckIsRUFBMEI7QUFDdEIsY0FBTSxNQUFNLENBQU4sQ0FBTixDQURzQjs7QUFHdEIsWUFBSSxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FBSixFQUFnQztBQUM1Qix3QkFBWSxPQUFPLEdBQVAsSUFBYyxTQUFkLENBRGdCO1NBQWhDO0tBSEo7O0FBUUEsUUFBSSxJQUFKLEVBQVU7QUFDTixtQkFBVyxTQUFTLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQUMsSUFBRCxDQUE3QixDQURNO0tBQVY7O0FBSUEsV0FBTyxRQUFQLENBbEJpRDtDQUFwQyIsImZpbGUiOiJjcmVhdGUtZGVsaW1pdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAodmFsdWVzLCB0ZXJtcywgZGVsaW1pdGVyLCBjaG9wKSA9PiB7XG4gICAgdmFyIGNvbWJpbmVkID0gJycsXG4gICAgICAgIGtleSA9ICcnLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbnVtVGVybXMgPSB0ZXJtcy5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IG51bVRlcm1zOyBpKyspIHtcbiAgICAgICAga2V5ID0gdGVybXNbaV07XG5cbiAgICAgICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb21iaW5lZCArPSB2YWx1ZXNba2V5XSArIGRlbGltaXRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaG9wKSB7XG4gICAgICAgIGNvbWJpbmVkID0gY29tYmluZWQuc2xpY2UoMCwgLWNob3ApO1xuICAgIH1cblxuICAgIHJldHVybiBjb21iaW5lZDtcbn07Il19

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var splitCommaDelimited = __webpack_require__(55),
	    functionBreak = __webpack_require__(56);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvZ2V0LWNvbG9yLXZhbHVlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksc0JBQXNCLFFBQVEseUJBQVIsQ0FBdEI7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjs7QUFFSixPQUFPLE9BQVAsR0FBaUIsVUFBQyxLQUFELEVBQVEsS0FBUixFQUFrQjtBQUMvQixRQUFJLGFBQWEsRUFBYjtRQUNBLFdBQVcsTUFBTSxNQUFOO1FBQ1gsU0FBUyxvQkFBb0IsY0FBYyxLQUFkLENBQXBCLENBQVQ7UUFDQSxJQUFJLENBQUosQ0FKMkI7O0FBTS9CLFdBQU8sSUFBSSxRQUFKLEVBQWMsR0FBckIsRUFBMEI7QUFDdEIsbUJBQVcsTUFBTSxDQUFOLENBQVgsSUFBdUIsTUFBQyxDQUFPLENBQVAsTUFBYyxTQUFkLEdBQTJCLE9BQU8sQ0FBUCxDQUE1QixHQUF3QyxDQUF4QyxDQUREO0tBQTFCOztBQUlBLFdBQU8sVUFBUCxDQVYrQjtDQUFsQiIsImZpbGUiOiJnZXQtY29sb3ItdmFsdWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNwbGl0Q29tbWFEZWxpbWl0ZWQgPSByZXF1aXJlKCcuL3NwbGl0LWNvbW1hLWRlbGltaXRlZCcpLFxuICAgIGZ1bmN0aW9uQnJlYWsgPSByZXF1aXJlKCcuL2Z1bmN0aW9uLWJyZWFrJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKHZhbHVlLCB0ZXJtcykgPT4ge1xuICAgIHZhciBzcGxpdFZhbHVlID0ge30sXG4gICAgICAgIG51bVRlcm1zID0gdGVybXMubGVuZ3RoLFxuICAgICAgICBjb2xvcnMgPSBzcGxpdENvbW1hRGVsaW1pdGVkKGZ1bmN0aW9uQnJlYWsodmFsdWUpKSxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBmb3IgKDsgaSA8IG51bVRlcm1zOyBpKyspIHtcbiAgICAgICAgc3BsaXRWYWx1ZVt0ZXJtc1tpXV0gPSAoY29sb3JzW2ldICE9PSB1bmRlZmluZWQpID8gY29sb3JzW2ldIDogMTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BsaXRWYWx1ZTtcbn07Il19

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isString = __webpack_require__(4).isString;

	module.exports = function (value) {
	  return isString(value) ? value.split(/,\s*/) : [value];
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvc3BsaXQtY29tbWEtZGVsaW1pdGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxXQUFXLFFBQVEsaUJBQVIsRUFBMkIsUUFBM0I7O0FBRWpCLE9BQU8sT0FBUCxHQUFpQjtTQUFTLFNBQVMsS0FBVCxJQUFrQixNQUFNLEtBQU4sQ0FBWSxNQUFaLENBQWxCLEdBQXdDLENBQUMsS0FBRCxDQUF4QztDQUFUIiwiZmlsZSI6InNwbGl0LWNvbW1hLWRlbGltaXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnLi4vLi4vaW5jL3V0aWxzJykuaXNTdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUuc3BsaXQoLyxcXHMqLykgOiBbdmFsdWVdOyJdfQ==

/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
	  return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvZnVuY3Rpb24tYnJlYWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLE9BQVAsR0FBaUI7U0FBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBTSxPQUFOLENBQWMsR0FBZCxJQUFxQixDQUFyQixFQUF3QixNQUFNLFdBQU4sQ0FBa0IsR0FBbEIsQ0FBeEM7Q0FBVCIsImZpbGUiOiJmdW5jdGlvbi1icmVhay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4gdmFsdWUuc3Vic3RyaW5nKHZhbHVlLmluZGV4T2YoJygnKSArIDEsIHZhbHVlLmxhc3RJbmRleE9mKCcpJykpOyJdfQ==

/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (value, prefix) {
	  return prefix + "(" + value + ")";
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvZnVuY3Rpb24tY3JlYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxPQUFQLEdBQWlCLFVBQUMsS0FBRCxFQUFRLE1BQVI7U0FBc0IsZUFBVTtDQUFoQyIsImZpbGUiOiJmdW5jdGlvbi1jcmVhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9ICh2YWx1ZSwgcHJlZml4KSA9PiBgJHtwcmVmaXh9KCR7dmFsdWV9KWA7Il19

/***/ },
/* 58 */
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9zZXR0aW5ncy9kZWZhdWx0LXByb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsV0FBTztBQUNILGFBQUssQ0FBTDtBQUNBLGFBQUssR0FBTDtBQUNBLGVBQU8sSUFBUDtLQUhKO0FBS0EsYUFBUztBQUNMLGFBQUssQ0FBTDtBQUNBLGFBQUssQ0FBTDtLQUZKO0FBSUEsYUFBUztBQUNMLGFBQUssQ0FBTDtBQUNBLGFBQUssR0FBTDtBQUNBLGNBQU0sR0FBTjtLQUhKO0NBVkoiLCJmaWxlIjoiZGVmYXVsdC1wcm9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvbG9yOiB7XG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAyNTUsXG4gICAgICAgIHJvdW5kOiB0cnVlXG4gICAgfSxcbiAgICBvcGFjaXR5OiB7XG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAxXG4gICAgfSxcbiAgICBwZXJjZW50OiB7XG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAxMDAsXG4gICAgICAgIHVuaXQ6ICclJ1xuICAgIH1cbn07XG4iXX0=

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(53),
	    getColorValues = __webpack_require__(54),
	    functionCreate = __webpack_require__(57),
	    defaultProps = __webpack_require__(58),
	    colorDefaults = defaultProps.color,
	    terms = __webpack_require__(25).colors;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9yZ2IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLGlDQUFSLENBQWxCO0lBQ0EsaUJBQWlCLFFBQVEsaUNBQVIsQ0FBakI7SUFDQSxpQkFBaUIsUUFBUSxnQ0FBUixDQUFqQjtJQUNBLGVBQWUsUUFBUSwwQkFBUixDQUFmO0lBQ0EsZ0JBQWdCLGFBQWEsS0FBYjtJQUNoQixRQUFRLFFBQVEsdUJBQVIsRUFBaUMsTUFBakM7O0FBRVosT0FBTyxPQUFQLEdBQWlCOztBQUViLGtCQUFjO0FBQ1YsYUFBSyxhQUFMO0FBQ0EsZUFBTyxhQUFQO0FBQ0EsY0FBTSxhQUFOO0FBQ0EsZUFBTyxhQUFhLE9BQWI7S0FKWDs7QUFPQSxVQUFNO2VBQVUsU0FBUyxNQUFNLE9BQU4sQ0FBYyxLQUFkLElBQXVCLENBQUMsQ0FBRDtLQUExQzs7QUFFTixXQUFPO2VBQVMsZUFBZSxLQUFmLEVBQXNCLEtBQXRCO0tBQVQ7O0FBRVAsYUFBUztlQUFVLGVBQWUsZ0JBQWdCLE1BQWhCLEVBQXdCLEtBQXhCLEVBQStCLElBQS9CLEVBQXFDLENBQXJDLENBQWYsRUFBd0QsTUFBeEQ7S0FBVjtDQWJiIiwiZmlsZSI6InJnYi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVEZWxpbWl0ZWQgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9jcmVhdGUtZGVsaW1pdGVkJyksXG4gICAgZ2V0Q29sb3JWYWx1ZXMgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9nZXQtY29sb3ItdmFsdWVzJyksXG4gICAgZnVuY3Rpb25DcmVhdGUgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9mdW5jdGlvbi1jcmVhdGUnKSxcbiAgICBkZWZhdWx0UHJvcHMgPSByZXF1aXJlKCcuL3NldHRpbmdzL2RlZmF1bHQtcHJvcHMnKSxcbiAgICBjb2xvckRlZmF1bHRzID0gZGVmYXVsdFByb3BzLmNvbG9yLFxuICAgIHRlcm1zID0gcmVxdWlyZSgnLi9zZXR0aW5ncy9kaWN0aW9uYXJ5JykuY29sb3JzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBSZWQ6IGNvbG9yRGVmYXVsdHMsXG4gICAgICAgIEdyZWVuOiBjb2xvckRlZmF1bHRzLFxuICAgICAgICBCbHVlOiBjb2xvckRlZmF1bHRzLFxuICAgICAgICBBbHBoYTogZGVmYXVsdFByb3BzLm9wYWNpdHlcbiAgICB9LFxuXG4gICAgdGVzdDogdmFsdWUgPT4gKHZhbHVlICYmIHZhbHVlLmluZGV4T2YoJ3JnYicpID4gLTEpLFxuICAgIFxuICAgIHNwbGl0OiB2YWx1ZSA9PiBnZXRDb2xvclZhbHVlcyh2YWx1ZSwgdGVybXMpLFxuXG4gICAgY29tYmluZTogdmFsdWVzID0+IGZ1bmN0aW9uQ3JlYXRlKGNyZWF0ZURlbGltaXRlZCh2YWx1ZXMsIHRlcm1zLCAnLCAnLCAyKSwgJ3JnYmEnKVxufTsiXX0=

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var rgb = __webpack_require__(59);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9oZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQU47O0FBRUosT0FBTyxPQUFQLEdBQWlCOztBQUViLGtCQUFjLElBQUksWUFBSjs7QUFFZCxVQUFNO2VBQVUsU0FBUyxNQUFNLE9BQU4sQ0FBYyxHQUFkLElBQXFCLENBQUMsQ0FBRDtLQUF4Qzs7QUFFTixXQUFPLGlCQUFTO0FBQ1osWUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7OztBQURZLFlBSVIsTUFBTSxNQUFOLEdBQWUsQ0FBZixFQUFrQjtBQUNsQixnQkFBSSxNQUFNLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLENBQWhCLENBQUosQ0FEa0I7QUFFbEIsZ0JBQUksTUFBTSxNQUFOLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFKLENBRmtCO0FBR2xCLGdCQUFJLE1BQU0sTUFBTixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBSjs7O0FBSGtCLFNBQXRCLE1BTU87QUFDSCxvQkFBSSxNQUFNLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLENBQWhCLENBQUosQ0FERztBQUVILG9CQUFJLE1BQU0sTUFBTixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBSixDQUZHO0FBR0gsb0JBQUksTUFBTSxNQUFOLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFKLENBSEc7QUFJSCxxQkFBSyxDQUFMLENBSkc7QUFLSCxxQkFBSyxDQUFMLENBTEc7QUFNSCxxQkFBSyxDQUFMLENBTkc7YUFOUDs7QUFlQSxlQUFPO0FBQ0gsaUJBQUssU0FBUyxDQUFULEVBQVksRUFBWixDQUFMO0FBQ0EsbUJBQU8sU0FBUyxDQUFULEVBQVksRUFBWixDQUFQO0FBQ0Esa0JBQU0sU0FBUyxDQUFULEVBQVksRUFBWixDQUFOO0FBQ0EsbUJBQU8sQ0FBUDtTQUpKLENBbkJZO0tBQVQ7O0FBMkJQLGFBQVM7ZUFBVSxJQUFJLE9BQUosQ0FBWSxNQUFaO0tBQVY7Q0FqQ2IiLCJmaWxlIjoiaGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJnYiA9IHJlcXVpcmUoJy4vcmdiJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgZGVmYXVsdFByb3BzOiByZ2IuZGVmYXVsdFByb3BzLFxuXG4gICAgdGVzdDogdmFsdWUgPT4gKHZhbHVlICYmIHZhbHVlLmluZGV4T2YoJyMnKSA+IC0xKSxcbiAgICBcbiAgICBzcGxpdDogdmFsdWUgPT4ge1xuICAgICAgICB2YXIgciwgZywgYjtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIDYgY2hhcmFjdGVycywgaWUgI0ZGMDAwMFxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgciA9IHZhbHVlLnN1YnN0cigxLCAyKTtcbiAgICAgICAgICAgIGcgPSB2YWx1ZS5zdWJzdHIoMywgMik7XG4gICAgICAgICAgICBiID0gdmFsdWUuc3Vic3RyKDUsIDIpO1xuXG4gICAgICAgIC8vIE9yIHdlIGhhdmUgMyBjaGFyYWN0ZXJzLCBpZSAjRjAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByID0gdmFsdWUuc3Vic3RyKDEsIDEpO1xuICAgICAgICAgICAgZyA9IHZhbHVlLnN1YnN0cigyLCAxKTtcbiAgICAgICAgICAgIGIgPSB2YWx1ZS5zdWJzdHIoMywgMSk7XG4gICAgICAgICAgICByICs9IHI7XG4gICAgICAgICAgICBnICs9IGc7XG4gICAgICAgICAgICBiICs9IGI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgUmVkOiBwYXJzZUludChyLCAxNiksXG4gICAgICAgICAgICBHcmVlbjogcGFyc2VJbnQoZywgMTYpLFxuICAgICAgICAgICAgQmx1ZTogcGFyc2VJbnQoYiwgMTYpLFxuICAgICAgICAgICAgQWxwaGE6IDFcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tYmluZTogdmFsdWVzID0+IHJnYi5jb21iaW5lKHZhbHVlcylcbn07Il19

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4),
	    rgb = __webpack_require__(59),
	    hsl = __webpack_require__(52),
	    hex = __webpack_require__(60),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9jb2xvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLGNBQVIsQ0FBUjtJQUNBLE1BQU0sUUFBUSxPQUFSLENBQU47SUFDQSxNQUFNLFFBQVEsT0FBUixDQUFOO0lBQ0EsTUFBTSxRQUFRLE9BQVIsQ0FBTjtJQUNBLFlBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBWjtJQUNBLGVBQWUsQ0FBZjtJQUVBLGVBQWUsVUFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCO0FBQ3BDLFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFlBQUosRUFBa0IsR0FBbEMsRUFBdUM7QUFDbkMsWUFBSSxVQUFVLENBQVYsRUFBYSxJQUFiLENBQWtCLEtBQWxCLENBQUosRUFBOEI7QUFDMUIsbUJBQU8sVUFBVSxDQUFWLEVBQWEsTUFBYixFQUFxQixLQUFyQixDQUFQLENBRDBCO1NBQTlCO0tBREo7Q0FEVzs7QUFRbkIsT0FBTyxPQUFQLEdBQWlCO0FBQ2Isa0JBQWMsTUFBTSxLQUFOLENBQVksSUFBSSxZQUFKLEVBQWtCLElBQUksWUFBSixDQUE1Qzs7QUFFQSxVQUFNO2VBQVMsSUFBSSxJQUFKLENBQVMsS0FBVCxLQUFtQixJQUFJLElBQUosQ0FBUyxLQUFULENBQW5CLElBQXNDLElBQUksSUFBSixDQUFTLEtBQVQsQ0FBdEM7S0FBVDs7QUFFTixXQUFPO2VBQVMsYUFBYSxPQUFiLEVBQXNCLEtBQXRCO0tBQVQ7O0FBRVAsYUFBUztlQUFVLE1BQUMsQ0FBTyxHQUFQLEtBQWUsU0FBZixHQUE0QixJQUFJLE9BQUosQ0FBWSxNQUFaLENBQTdCLEdBQW1ELElBQUksT0FBSixDQUFZLE1BQVosQ0FBbkQ7S0FBVjtDQVBiIiwiZmlsZSI6ImNvbG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vaW5jL3V0aWxzJyksXG4gICAgcmdiID0gcmVxdWlyZSgnLi9yZ2InKSxcbiAgICBoc2wgPSByZXF1aXJlKCcuL2hzbCcpLFxuICAgIGhleCA9IHJlcXVpcmUoJy4vaGV4JyksXG4gICAgc3VwcG9ydGVkID0gW3JnYiwgaHNsLCBoZXhdLFxuICAgIG51bVN1cHBvcnRlZCA9IDMsXG5cbiAgICBydW5TdXBwb3J0ZWQgPSBmdW5jdGlvbiAobWV0aG9kLCB2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVN1cHBvcnRlZDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoc3VwcG9ydGVkW2ldLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnRlZFtpXVttZXRob2RdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHRQcm9wczogdXRpbHMubWVyZ2UocmdiLmRlZmF1bHRQcm9wcywgaHNsLmRlZmF1bHRQcm9wcyksXG5cbiAgICB0ZXN0OiB2YWx1ZSA9PiByZ2IudGVzdCh2YWx1ZSkgfHwgaGV4LnRlc3QodmFsdWUpIHx8IGhzbC50ZXN0KHZhbHVlKSxcblxuICAgIHNwbGl0OiB2YWx1ZSA9PiBydW5TdXBwb3J0ZWQoJ3NwbGl0JywgdmFsdWUpLFxuXG4gICAgY29tYmluZTogdmFsdWVzID0+ICh2YWx1ZXMuUmVkICE9PSB1bmRlZmluZWQpID8gcmdiLmNvbWJpbmUodmFsdWVzKSA6IGhzbC5jb21iaW5lKHZhbHVlcylcbn07Il19

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createDelimited = __webpack_require__(53),
	    pxDefaults = __webpack_require__(51).defaultProps,
	    splitSpaceDelimited = __webpack_require__(63),
	    terms = __webpack_require__(25).positions;

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9wb3NpdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLGlDQUFSLENBQWxCO0lBQ0EsYUFBYSxRQUFRLE1BQVIsRUFBZ0IsWUFBaEI7SUFDYixzQkFBc0IsUUFBUSxzQ0FBUixDQUF0QjtJQUNBLFFBQVEsUUFBUSx1QkFBUixFQUFpQyxTQUFqQzs7QUFFWixPQUFPLE9BQVAsR0FBaUI7O0FBRWIsa0JBQWMsVUFBZDs7Ozs7Ozs7OztBQVVBLFdBQU8saUJBQVM7QUFDWixZQUFJLFlBQVksb0JBQW9CLEtBQXBCLENBQVo7WUFDQSxlQUFlLFVBQVUsTUFBVjtZQUNmLGFBQWE7QUFDVCxlQUFHLFVBQVUsQ0FBVixDQUFIO0FBQ0EsZUFBRyxZQUFDLEdBQWUsQ0FBZixHQUFvQixVQUFVLENBQVYsQ0FBckIsR0FBb0MsVUFBVSxDQUFWLENBQXBDO1NBRlAsQ0FIUTs7QUFRWixZQUFJLGVBQWUsQ0FBZixFQUFrQjtBQUNsQix1QkFBVyxDQUFYLEdBQWUsVUFBVSxDQUFWLENBQWYsQ0FEa0I7U0FBdEI7O0FBSUEsZUFBTyxVQUFQLENBWlk7S0FBVDs7QUFlUCxhQUFTO2VBQVUsZ0JBQWdCLE1BQWhCLEVBQXdCLEtBQXhCLEVBQStCLEdBQS9CO0tBQVY7Q0EzQmIiLCJmaWxlIjoicG9zaXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZURlbGltaXRlZCA9IHJlcXVpcmUoJy4vbWFuaXB1bGF0b3JzL2NyZWF0ZS1kZWxpbWl0ZWQnKSxcbiAgICBweERlZmF1bHRzID0gcmVxdWlyZSgnLi9weCcpLmRlZmF1bHRQcm9wcyxcbiAgICBzcGxpdFNwYWNlRGVsaW1pdGVkID0gcmVxdWlyZSgnLi9tYW5pcHVsYXRvcnMvc3BsaXQtc3BhY2UtZGVsaW1pdGVkJyksXG4gICAgdGVybXMgPSByZXF1aXJlKCcuL3NldHRpbmdzL2RpY3Rpb25hcnknKS5wb3NpdGlvbnM7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgZGVmYXVsdFByb3BzOiBweERlZmF1bHRzLFxuICAgICAgICBcbiAgICAvKlxuICAgICAgICBTcGxpdCBwb3NpdGlvbnMgaW4gZm9ybWF0IFwiWCBZIFpcIlxuICAgICAgICBcbiAgICAgICAgQHBhcmFtIFtzdHJpbmddOiBQb3NpdGlvbiB2YWx1ZXNcbiAgICAgICAgICAgIFwiMjAlIDMwJSAwXCIgLT4gezIwJSwgMzAlLCAwfVxuICAgICAgICAgICAgXCIyMCUgMzAlXCIgLT4gezIwJSwgMzAlfVxuICAgICAgICAgICAgXCIyMCVcIiAtPiB7MjAlLCAyMCV9XG4gICAgKi9cbiAgICBzcGxpdDogdmFsdWUgPT4ge1xuICAgICAgICB2YXIgcG9zaXRpb25zID0gc3BsaXRTcGFjZURlbGltaXRlZCh2YWx1ZSksXG4gICAgICAgICAgICBudW1Qb3NpdGlvbnMgPSBwb3NpdGlvbnMubGVuZ3RoLFxuICAgICAgICAgICAgc3BsaXRWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICBYOiBwb3NpdGlvbnNbMF0sXG4gICAgICAgICAgICAgICAgWTogKG51bVBvc2l0aW9ucyA+IDEpID8gcG9zaXRpb25zWzFdIDogcG9zaXRpb25zWzBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmIChudW1Qb3NpdGlvbnMgPiAyKSB7XG4gICAgICAgICAgICBzcGxpdFZhbHVlLlogPSBwb3NpdGlvbnNbMl07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3BsaXRWYWx1ZTtcbiAgICB9LFxuXG4gICAgY29tYmluZTogdmFsdWVzID0+IGNyZWF0ZURlbGltaXRlZCh2YWx1ZXMsIHRlcm1zLCAnICcpXG59OyJdfQ==

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isString = __webpack_require__(4).isString;

	module.exports = function (value) {
	  return isString(value) ? value.split(' ') : [value];
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92YWx1ZS10eXBlcy9tYW5pcHVsYXRvcnMvc3BsaXQtc3BhY2UtZGVsaW1pdGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxXQUFXLFFBQVEsaUJBQVIsRUFBMkIsUUFBM0I7O0FBRWpCLE9BQU8sT0FBUCxHQUFpQjtTQUFTLFNBQVMsS0FBVCxJQUFrQixNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQWxCLEdBQXFDLENBQUMsS0FBRCxDQUFyQztDQUFUIiwiZmlsZSI6InNwbGl0LXNwYWNlLWRlbGltaXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnLi4vLi4vaW5jL3V0aWxzJykuaXNTdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUuc3BsaXQoJyAnKSA6IFt2YWx1ZV07Il19

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var terms = __webpack_require__(25).dimensions,
	    pxDefaults = __webpack_require__(51).defaultProps,
	    createDelimited = __webpack_require__(53),
	    splitSpaceDelimited = __webpack_require__(63);

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9kaW1lbnNpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsdUJBQVIsRUFBaUMsVUFBakM7SUFDUixhQUFhLFFBQVEsTUFBUixFQUFnQixZQUFoQjtJQUNiLGtCQUFrQixRQUFRLGlDQUFSLENBQWxCO0lBQ0Esc0JBQXNCLFFBQVEsc0NBQVIsQ0FBdEI7O0FBRUosT0FBTyxPQUFQLEdBQWlCOztBQUViLGtCQUFjLFVBQWQ7Ozs7Ozs7Ozs7Ozs7QUFhQSxXQUFPLGlCQUFTO0FBQ1osWUFBSSxhQUFhLG9CQUFvQixLQUFwQixDQUFiO1lBQ0EsZ0JBQWdCLFdBQVcsTUFBWDtZQUNoQixXQUFXLGFBQUMsS0FBa0IsQ0FBbEIsR0FBdUIsQ0FBeEIsR0FBNEIsQ0FBNUI7WUFDWCxJQUFJLENBQUo7WUFDQSxJQUFJLENBQUo7WUFDQSxhQUFhLEVBQWIsQ0FOUTs7QUFRWixlQUFPLElBQUksQ0FBSixFQUFPLEdBQWQsRUFBbUI7QUFDZix1QkFBVyxNQUFNLENBQU4sQ0FBWCxJQUF1QixXQUFXLENBQVgsQ0FBdkI7OztBQURlLGFBSWYsR0FKZTtBQUtmLGdCQUFJLENBQUMsS0FBTSxhQUFOLEdBQXVCLElBQUksUUFBSixHQUFlLENBQXZDLENBTFc7U0FBbkI7O0FBUUEsZUFBTyxVQUFQLENBaEJZO0tBQVQ7O0FBbUJQLGFBQVM7ZUFBVSxnQkFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsR0FBL0I7S0FBVjtDQWxDYiIsImZpbGUiOiJkaW1lbnNpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRlcm1zID0gcmVxdWlyZSgnLi9zZXR0aW5ncy9kaWN0aW9uYXJ5JykuZGltZW5zaW9ucyxcbiAgICBweERlZmF1bHRzID0gcmVxdWlyZSgnLi9weCcpLmRlZmF1bHRQcm9wcyxcbiAgICBjcmVhdGVEZWxpbWl0ZWQgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9jcmVhdGUtZGVsaW1pdGVkJyksXG4gICAgc3BsaXRTcGFjZURlbGltaXRlZCA9IHJlcXVpcmUoJy4vbWFuaXB1bGF0b3JzL3NwbGl0LXNwYWNlLWRlbGltaXRlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGRlZmF1bHRQcm9wczogcHhEZWZhdWx0cyxcbiAgICBcbiAgICAvKlxuICAgICAgICBTcGxpdCBkaW1lbnNpb25zIGluIGZvcm1hdCBcIlRvcCBSaWdodCBCb3R0b20gTGVmdFwiXG4gICAgICAgIFxuICAgICAgICBAcGFyYW0gW3N0cmluZ106IERpbWVuc2lvbiB2YWx1ZXNcbiAgICAgICAgICAgIFwiMjBweCAwIDMwcHggNDBweFwiIC0+IHsyMHB4LCAwLCAzMHB4LCA0MHB4fVxuICAgICAgICAgICAgXCIyMHB4IDAgMzBweFwiIC0+IHsyMHB4LCAwLCAzMHB4LCAwfVxuICAgICAgICAgICAgXCIyMHB4IDBcIiAtPiB7MjBweCwgMCwgMjBweCwgMH1cbiAgICAgICAgICAgIFwiMjBweFwiIC0+IHsyMHB4LCAyMHB4LCAyMHB4LCAyMHB4fVxuICAgICAgICBcbiAgICAgICAgQHJldHVybiBbb2JqZWN0XTogT2JqZWN0IHdpdGggVC9SL0IvTCBtZXRyaWNzXG4gICAgKi9cbiAgICBzcGxpdDogdmFsdWUgPT4ge1xuICAgICAgICB2YXIgZGltZW5zaW9ucyA9IHNwbGl0U3BhY2VEZWxpbWl0ZWQodmFsdWUpLFxuICAgICAgICAgICAgbnVtRGltZW5zaW9ucyA9IGRpbWVuc2lvbnMubGVuZ3RoLFxuICAgICAgICAgICAganVtcEJhY2sgPSAobnVtRGltZW5zaW9ucyAhPT0gMSkgPyAyIDogMSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBzcGxpdFZhbHVlID0ge307XG5cbiAgICAgICAgZm9yICg7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHNwbGl0VmFsdWVbdGVybXNbaV1dID0gZGltZW5zaW9uc1tqXTtcblxuICAgICAgICAgICAgLy8gSnVtcCBiYWNrICh0byBzdGFydCkgY291bnRlciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBlbmQgb2Ygb3VyIHZhbHVlc1xuICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgaiA9IChqID09PSBudW1EaW1lbnNpb25zKSA/IGogLSBqdW1wQmFjayA6IGo7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3BsaXRWYWx1ZTtcbiAgICB9LFxuXG4gICAgY29tYmluZTogdmFsdWVzID0+IGNyZWF0ZURlbGltaXRlZCh2YWx1ZXMsIHRlcm1zLCAnICcpXG59OyJdfQ==

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    defaultProps: {
	        init: 1
	    }
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9zY2FsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGtCQUFjO0FBQ1YsY0FBTSxDQUFOO0tBREo7Q0FESiIsImZpbGUiOiJzY2FsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBpbml0OiAxXG4gICAgfVxufTsiXX0=

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var color = __webpack_require__(61),
	    utils = __webpack_require__(4),
	    pxDefaults = __webpack_require__(51).defaultProps,
	    terms = __webpack_require__(25).shadow,
	    splitSpaceDelimited = __webpack_require__(63),
	    createDelimited = __webpack_require__(53),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9zaGFkb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVI7SUFDQSxRQUFRLFFBQVEsY0FBUixDQUFSO0lBQ0EsYUFBYSxRQUFRLE1BQVIsRUFBZ0IsWUFBaEI7SUFDYixRQUFRLFFBQVEsdUJBQVIsRUFBaUMsTUFBakM7SUFDUixzQkFBc0IsUUFBUSxzQ0FBUixDQUF0QjtJQUNBLGtCQUFrQixRQUFRLGlDQUFSLENBQWxCO0lBQ0EsY0FBYyxNQUFNLEtBQU4sQ0FBWSxDQUFaLEVBQWMsQ0FBZCxDQUFkOztBQUVKLE9BQU8sT0FBUCxHQUFpQjs7QUFFYixrQkFBYyxNQUFNLEtBQU4sQ0FBWSxNQUFNLFlBQU4sRUFBb0I7QUFDMUMsV0FBRyxVQUFIO0FBQ0EsV0FBRyxVQUFIO0FBQ0EsZ0JBQVEsVUFBUjtBQUNBLGdCQUFRLFVBQVI7S0FKVSxDQUFkOzs7Ozs7OztBQWFBLFdBQU8saUJBQVM7QUFDWixZQUFJLE9BQU8sb0JBQW9CLEtBQXBCLENBQVA7WUFDQSxVQUFVLEtBQUssTUFBTDtZQUNWLGtCQUFrQixLQUFsQjtZQUNBLFlBQVksRUFBWjtZQUNBLE9BSko7WUFLSSxJQUFJLENBQUo7WUFDQSxhQUFhLEVBQWIsQ0FQUTs7QUFTWixlQUFPLElBQUksT0FBSixFQUFhLEdBQXBCLEVBQXlCO0FBQ3JCLHNCQUFVLEtBQUssQ0FBTCxDQUFWOzs7QUFEcUIsZ0JBSWpCLG1CQUFtQixNQUFNLElBQU4sQ0FBVyxPQUFYLENBQW5CLEVBQXdDO0FBQ3hDLGtDQUFrQixJQUFsQixDQUR3QztBQUV4Qyw2QkFBYSxPQUFiLENBRndDO2FBQTVDLE1BSU87QUFDSCwyQkFBVyxNQUFNLENBQU4sQ0FBWCxJQUF1QixPQUF2QixDQURHO2FBSlA7U0FKSjs7QUFhQSxlQUFPLE1BQU0sS0FBTixDQUFZLFVBQVosRUFBd0IsTUFBTSxLQUFOLENBQVksU0FBWixDQUF4QixDQUFQLENBdEJZO0tBQVQ7O0FBeUJQLGFBQVM7ZUFBVSxnQkFBZ0IsTUFBaEIsRUFBd0IsV0FBeEIsRUFBcUMsR0FBckMsSUFBNEMsTUFBTSxPQUFOLENBQWMsTUFBZCxDQUE1QztLQUFWO0NBeENiIiwiZmlsZSI6InNoYWRvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjb2xvciA9IHJlcXVpcmUoJy4vY29sb3InKSxcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4uL2luYy91dGlscycpLFxuICAgIHB4RGVmYXVsdHMgPSByZXF1aXJlKCcuL3B4JykuZGVmYXVsdFByb3BzLFxuICAgIHRlcm1zID0gcmVxdWlyZSgnLi9zZXR0aW5ncy9kaWN0aW9uYXJ5Jykuc2hhZG93LFxuICAgIHNwbGl0U3BhY2VEZWxpbWl0ZWQgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9zcGxpdC1zcGFjZS1kZWxpbWl0ZWQnKSxcbiAgICBjcmVhdGVEZWxpbWl0ZWQgPSByZXF1aXJlKCcuL21hbmlwdWxhdG9ycy9jcmVhdGUtZGVsaW1pdGVkJyksXG4gICAgc2hhZG93VGVybXMgPSB0ZXJtcy5zbGljZSgwLDQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGRlZmF1bHRQcm9wczogdXRpbHMubWVyZ2UoY29sb3IuZGVmYXVsdFByb3BzLCB7XG4gICAgICAgIFg6IHB4RGVmYXVsdHMsXG4gICAgICAgIFk6IHB4RGVmYXVsdHMsXG4gICAgICAgIFJhZGl1czogcHhEZWZhdWx0cyxcbiAgICAgICAgU3ByZWFkOiBweERlZmF1bHRzXG4gICAgfSksXG5cbiAgICAvKlxuICAgICAgICBTcGxpdCBzaGFkb3cgcHJvcGVydGllcyBcIlggWSBSYWRpdXMgU3ByZWFkIENvbG9yXCJcbiAgICAgICAgXG4gICAgICAgIEBwYXJhbSBbc3RyaW5nXTogU2hhZG93IHByb3BlcnR5XG4gICAgICAgIEByZXR1cm4gW29iamVjdF1cbiAgICAqL1xuICAgIHNwbGl0OiB2YWx1ZSA9PiB7XG4gICAgICAgIHZhciBiaXRzID0gc3BsaXRTcGFjZURlbGltaXRlZCh2YWx1ZSksXG4gICAgICAgICAgICBudW1CaXRzID0gYml0cy5sZW5ndGgsXG4gICAgICAgICAgICBoYXNSZWFjaGVkQ29sb3IgPSBmYWxzZSxcbiAgICAgICAgICAgIGNvbG9yUHJvcCA9ICcnLFxuICAgICAgICAgICAgdGhpc0JpdCxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgc3BsaXRWYWx1ZSA9IHt9O1xuXG4gICAgICAgIGZvciAoOyBpIDwgbnVtQml0czsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzQml0ID0gYml0c1tpXTtcblxuICAgICAgICAgICAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGUgY29sb3IgcHJvcGVydHksIGFwcGVuZCB0byBjb2xvciBzdHJpbmdcbiAgICAgICAgICAgIGlmIChoYXNSZWFjaGVkQ29sb3IgfHwgY29sb3IudGVzdCh0aGlzQml0KSkge1xuICAgICAgICAgICAgICAgIGhhc1JlYWNoZWRDb2xvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29sb3JQcm9wICs9IHRoaXNCaXQ7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3BsaXRWYWx1ZVt0ZXJtc1tpXV0gPSB0aGlzQml0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoc3BsaXRWYWx1ZSwgY29sb3Iuc3BsaXQoY29sb3JQcm9wKSk7XG4gICAgfSxcblxuICAgIGNvbWJpbmU6IHZhbHVlcyA9PiBjcmVhdGVEZWxpbWl0ZWQodmFsdWVzLCBzaGFkb3dUZXJtcywgJyAnKSArIGNvbG9yLmNvbWJpbmUodmFsdWVzKVxufTsiXX0=

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4),
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9jb21wbGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsY0FBUixDQUFSO0lBQ0EsT0FBTyxNQUFNLElBQU47SUFDUCxhQUFhLGtCQUFiO0lBRUEsZ0JBQWdCLFVBQVUsR0FBVixFQUFlO0FBQzNCLFdBQU8sT0FBTyxHQUFQLEdBQWEsR0FBYixDQURvQjtDQUFmOztBQUlwQixPQUFPLE9BQVAsR0FBaUI7QUFDYixVQUFNLFVBQVUsS0FBVixFQUFpQjtBQUNuQixZQUFJLFVBQVUsTUFBTSxLQUFOLENBQVksVUFBWixDQUFWLENBRGU7QUFFbkIsZUFBUSxNQUFNLE9BQU4sQ0FBYyxPQUFkLEtBQTBCLFFBQVEsTUFBUixHQUFpQixDQUFqQixDQUZmO0tBQWpCOztBQUtOLGNBQVUsVUFBVSxLQUFWLEVBQWlCO0FBQ3ZCLFlBQUksVUFBVSxDQUFWLENBRG1CO0FBRXZCLGVBQU8sTUFBTSxPQUFOLENBQWMsVUFBZCxFQUEwQjttQkFBTSxjQUFjLFNBQWQ7U0FBTixDQUFqQyxDQUZ1QjtLQUFqQjs7QUFLVixXQUFPLFVBQVUsS0FBVixFQUFpQjtBQUNwQixZQUFJLGFBQWEsRUFBYjtZQUNBLFVBQVUsTUFBTSxLQUFOLENBQVksVUFBWixDQUFWO1lBQ0EsYUFBYSxRQUFRLE1BQVIsQ0FIRzs7QUFLcEIsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksVUFBSixFQUFnQixHQUFoQyxFQUFxQztBQUNqQyx1QkFBVyxDQUFYLElBQWdCLFFBQVEsQ0FBUixDQUFoQixDQURpQztTQUFyQzs7QUFJQSxlQUFPLFVBQVAsQ0FUb0I7S0FBakI7O0FBWVAsYUFBUyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEI7QUFDakMsWUFBSSxnQkFBZ0IsUUFBaEIsQ0FENkI7O0FBR2pDLGFBQUssTUFBTCxFQUFhLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDekIsNEJBQWdCLGNBQWMsT0FBZCxDQUFzQixjQUFjLEdBQWQsQ0FBdEIsRUFBMEMsS0FBMUMsQ0FBaEIsQ0FEeUI7U0FBaEIsQ0FBYixDQUhpQzs7QUFPakMsZUFBTyxhQUFQLENBUGlDO0tBQTVCO0NBdkJiIiwiZmlsZSI6ImNvbXBsZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi9pbmMvdXRpbHMnKSxcbiAgICBlYWNoID0gdXRpbHMuZWFjaCxcbiAgICBmbG9hdFJlZ2V4ID0gLygtKT8oXFxkW1xcZFxcLl0qKS9nLFxuXG4gICAgZ2VuZXJhdGVUb2tlbiA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuICckeycgKyBrZXkgKyAnfSc7XG4gICAgfTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdGVzdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gdmFsdWUubWF0Y2goZmxvYXRSZWdleCk7XG4gICAgICAgIHJldHVybiAodXRpbHMuaXNBcnJheShtYXRjaGVzKSAmJiBtYXRjaGVzLmxlbmd0aCA+IDEpO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoZmxvYXRSZWdleCwgKCkgPT4gZ2VuZXJhdGVUb2tlbihjb3VudGVyKyspKTtcbiAgICB9LFxuXG4gICAgc3BsaXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgc3BsaXRWYWx1ZSA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZsb2F0UmVnZXgpLFxuICAgICAgICAgICAgbnVtTWF0Y2hlcyA9IG1hdGNoZXMubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1NYXRjaGVzOyBpKyspIHtcbiAgICAgICAgICAgIHNwbGl0VmFsdWVbaV0gPSBtYXRjaGVzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNwbGl0VmFsdWU7XG4gICAgfSxcblxuICAgIGNvbWJpbmU6IGZ1bmN0aW9uICh2YWx1ZXMsIHRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBjb21iaW5lZFZhbHVlID0gdGVtcGxhdGU7XG5cbiAgICAgICAgZWFjaCh2YWx1ZXMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb21iaW5lZFZhbHVlID0gY29tYmluZWRWYWx1ZS5yZXBsYWNlKGdlbmVyYXRlVG9rZW4oa2V5KSwgdmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29tYmluZWRWYWx1ZTtcbiAgICB9XG59OyJdfQ==

/***/ }
/******/ ]);