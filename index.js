var style = require('./style.css');
var ui = require('popmotion');
var DATA_PROP = 'data-depth';
var FLYUP_DURATION = 500;
var FLYUP_EASE = 'easeInOut';

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
        { depth: -4 }, 
        { depth: -3 }, 
        { depth: -2 },
        { depth: -1 }, 
        { depth: 0 }, 
        { depth: 1 }, 
        { depth: 2 },
        { depth: 3 }, 
        { depth: 4 }, 
        { depth: 5 }, 
        { depth: 6 }
    ];

var elements = relations.map(div),
    fragment = document.createDocumentFragment();
    
elements.forEach(fragment.appendChild, fragment);
document.getElementById('cards')
        .appendChild(fragment);

var flyup = new ui.Tween({
    ease: FLYUP_EASE,
    duration: FLYUP_DURATION,
    values: {
        opacity: 1,
        x: {
            to: function(e) {
                var depth = parseInt(e.element.getAttribute(DATA_PROP));
                var width = parseInt(ui.css.get(e.element, 'width'));
                return depth * width;
            }
        },
        left: {
            to: 0
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
        zIndex: depth == 0 || depth == 1 ? 1 : 0,
        boxShadow: '0 5px 5px rgba(0,0,0,.15)'
    };
    
    var actor = new ui.Actor({ 
        element: e,
        values: values
    });
    
    return actor;
});

var moveDone = new ui.Tween({
    values: {
        left: function(e) {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return (depth * 50) + '%';
        },
        x: 0
    }
});

var iterator = new ui.Iterator(actors);
var sequence = new ui.Sequence();
var STAGGER_DURATION = 150;

iterator.stagger('start', STAGGER_DURATION, flyup);

setTimeout(() => {
    iterator.each('start', moveDone);
}, (elements.length * STAGGER_DURATION) + FLYUP_DURATION);

var input = document.getElementById('lock');
var navView = document.getElementById('navview');

function updateList (element, depth, zIndex) {
    element.setAttribute(DATA_PROP, depth);
    ui.css.set(element, 'z-index', zIndex);
}

document.getElementById('downstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    elements.forEach((i) => {
        var depth, currentDepth = parseInt(i.getAttribute(DATA_PROP));

        if (input.checked && (currentDepth == 0 || currentDepth == 1)) {
            depth = currentDepth == 1 ? currentDepth - 2 : 0;
        } else {
            depth = currentDepth - 1;
        }

        var zIndexing = { 0: 3, 1: 2, '-1': 1 };

        updateList(i, depth, zIndexing[depth] || 0);
    });

    iterator.each('start', flyup);

    setTimeout(() => {
        iterator.each('start', moveDone);
    }, FLYUP_DURATION);
};

document.getElementById('upstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    elements.forEach((i) => {        
        var depth, currentDepth = parseInt(i.getAttribute(DATA_PROP));

        if (input.checked && (currentDepth == 0 || currentDepth == -1)) {
            depth = currentDepth == -1 ? currentDepth + 2 : 0;
        } else {
            depth = currentDepth + 1;
        }

        var zIndexing = input.checked ?
            { 0: 3, 1: 2, 2: 1 } :
            { 1: 3, 0: 2, 2: 1 };

        updateList(i, depth, zIndexing[depth] || 0);
    });
    
    iterator.each('start', flyup);

    setTimeout(() => {
        iterator.each('start', moveDone);
    }, FLYUP_DURATION);

};