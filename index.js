var ui = require('popmotion');
var DATA_PROP = 'data-depth';
var velocityRange = [-1000, 1000];
var maxRotate = 30;
var smoothing = 100;
var source;
var div = (i) => {
        var e = document.createElement('div');
        e.className = i.depth === 0 
            ? 'card source'
            : 'card';
        e.setAttribute(DATA_PROP, i.depth);
        if (i.depth === 0) {
            source = e;
        }
        return e;
    },
    relations = [
        { depth: -1 }, 
        { depth: 0 }, 
        { depth: 1 }, 
        { depth: 2 }
    ];

var elements = relations.map(div),
    fragment = document.createDocumentFragment();
    
elements.forEach(fragment.appendChild, fragment);
document.getElementById('cards')
        .appendChild(fragment);

var resizeAdjust = new ui.Simulate({
    simulate: 'spring',
    duration: 100,
    spring: 1000,
    friction: 0.35,
    values: {
        x: {
            to: function(e) {
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
            to: function(e) {
                var depth = parseInt(e.element.getAttribute(DATA_PROP));
                var width = parseInt(ui.css.get(e.element, 'width'));
                return depth * width;
            }
        },
        y: {
            to: function(t) {
                var d = t.element.getAttribute(DATA_PROP);
                return d == 0 || d == 1 ? 0 : 48;
            }
        },
        boxShadow: {
            to: (e) => {
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
            to: (e) => {
                var depth = parseInt(e.element.getAttribute(DATA_PROP));
                return depth == 0 ? '2px solid white' : '0px solid white';
            }  
        }
    }
});

var actors = elements.map((e) => {
    var depth = parseInt(e.getAttribute(DATA_PROP));
    var width = parseInt(ui.css.get(e, 'width'));
    var values = {
        x: depth * width,
        y: 100,
        opacity: 0,
        zIndex: (e) => { 
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

document.getElementById('downstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    elements.forEach((i) => {
        var depth = parseInt(i.getAttribute(DATA_PROP));
        //if source do nothing, if below source subtract 2;
        i.setAttribute(DATA_PROP, depth - 1);
        //endif
        ui.css.set(i, 'z-index', depth == 1 ? 2 : depth == 0 || depth == 2 ? 1 : 0);
    });
    
    iterator.each('start', flyup);
};

document.getElementById('upstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    elements.forEach((i) => {
        var depth = parseInt(i.getAttribute(DATA_PROP));
        i.setAttribute(DATA_PROP, depth + 1);
        ui.css.set(i, 'z-index', depth == 0 ? 2 : depth == 1 || depth == -1 ? 1 : 0);
    });
    
    iterator.each('start', flyup);
};