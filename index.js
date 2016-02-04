var hintcss = require('hint.css/hint.min.css');
var style = require('./style.css');
var ui = require('popmotion');
var DATA_PROP = 'data-depth';
var FLYUP_DURATION = 500;
var STAGGER_DURATION = 150;
var FLYUP_EASE = 'easeInOut';


/////// TODO: CLOSE NAV AFTER INTRO ANIMATION.  
///////       OPEN NAV ON BUTTON HOVER.


var div = (i) => {
        var e = document.createElement('div');
        e.className = i.depth === 0 
            ? 'card source'
            : 'card';
        e.setAttribute(DATA_PROP, i.depth);
        return e;
    },
    mini = (i) => {
        var e = document.createElement('div');
        e.className = i.depth === 0 
            ? 'mini source'
            : 'mini';
        e.setAttribute(DATA_PROP, i.depth);
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
    fragment = document.createDocumentFragment(),
    minis = relations.map(mini),
    minisFragment = document.createDocumentFragment();
    
elements.forEach(fragment.appendChild, fragment);
minis.forEach(minisFragment.appendChild, minisFragment);

document.getElementById('cards')
        .appendChild(fragment);

document.getElementById('nav-view')
        .appendChild(minisFragment);

var absoluteCards = {
    values: {
        x: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return (depth * 100) + '%';
        }
    }
};

var relativeCards = {
    values: {
        x: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return (depth * 1) + '%';
            return 0;
        }
    }
}

var largeCards = {
    values: {
        borderRight: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return depth == 0 ? '2px solid white' : '0px solid white';
        },
        boxShadow: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            switch (depth) {
                case 1:
                    return '10px 5px 10px rgba(0,0,0,0.25)';
                case 0:
                    return '-10px 5px 10px rgba(0,0,0,0.25)';
                default:
                    return '0 5px 5px rgba(0,0,0,.15)';
            }
        },
        y: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d == 0 || d == 1 ? 0 : 48;
        }
    }
};

var smallCards = {
    values: {
        boxShadow: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            switch (depth) {
                case 1:
                    return '2px 5px 7px rgba(0,0,0,0.25)';
                case 0:
                    return '-2px 5px 7px rgba(0,0,0,0.25)';
                default:
                    return '0 2px 2px rgba(0,0,0,.15)';
            }
        },
        y: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d == 0 || d == 1 ? 0 : 5;
        }
    }
};

var base = new ui.Tween({
    ease: FLYUP_EASE,
    duration: FLYUP_DURATION
});

var defaults = {
    values: {
        opacity: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return depth == 0 || depth == 1 ? 1 : .5;
        }
    }
};


var flyup = base.extend(defaults)
                .extend(absoluteCards)
                .extend(largeCards);

var carousel = base .extend(defaults)
                    .extend(absoluteCards)
                    .extend(smallCards);

var toActors = (y, e) => {
    var depth = parseInt(e.getAttribute(DATA_PROP));
    var values = {
        x: (depth * 100) + '%',
        y: y,
        opacity: 0,
        zIndex: depth == 0 || depth == 1 ? 1 : 0,
        boxShadow: '0 5px 5px rgba(0,0,0,.15)'
    };
    
    var actor = new ui.Actor({ 
        element: e,
        values: values
    });
    
    return actor;
};

var actors = elements.map(toActors.bind(null, 100));
var iterator = new ui.Iterator(actors);

var miniActors = minis.map(toActors.bind(null, 50));
var miniIterator = new ui.Iterator(miniActors);


iterator.stagger('start', STAGGER_DURATION, flyup);
miniIterator.stagger('start', STAGGER_DURATION, carousel);

var lockInput = document.getElementById('lock');
var navInput = document.getElementById('nav');
var navContainer = document.getElementById('nav-container');

navInput.onchange = () => {
    navContainer.className = navInput.checked ? 'nav-is-open' : '';
};

navInput.checked = true;
navContainer.className = 'nav-is-open';

lockInput.onchange = () => {
    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    if (!lockInput.checked) {
        var leftIndex = elements.reduce((p, n, i) => n.getAttribute(DATA_PROP) == 0 ? i : p, 0);
        elements.forEach((e, i) => updateElement(e, i - leftIndex, zIndexing[i - leftIndex] || 0));
        iterator.each('start', flyup);

        var miniLeftIndex = elements.reduce((p, n, i) => n.getAttribute(DATA_PROP) == 0 ? i : p, 0);
        minis.forEach((e, i) => updateElement(e, i - miniLeftIndex, zIndexing[i - miniLeftIndex] || 0));
        miniIterator.each('start', carousel);
    }
}

function updateElement (element, depth, zIndex) {
    element.setAttribute(DATA_PROP, depth);
    ui.css.set(element, 'z-index', zIndex);
}

function getDepth(currentDepth, direction) {
    var jump = Math.abs(direction + direction) * -direction;
    console.log(jump);
    if (lockInput.checked && (currentDepth == 0 || currentDepth == direction)) {
        return currentDepth == direction ? currentDepth + jump : 0;
    } else {
        return currentDepth - direction;
    }
}

function transformElements (zIndexing, direction) {
    return (i) => {
        var depth = getDepth(parseInt(i.getAttribute(DATA_PROP)), direction);

        updateElement(i, depth, zIndexing[depth] || 0);
    }
}

document.getElementById('downstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    
    elements.forEach(transformElements(zIndexing, 1));
    minis.forEach(transformElements(zIndexing, 1));

    iterator.each('start', flyup);
    miniIterator.each('start', carousel);
};

document.getElementById('upstream').onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    var zIndexing = lockInput.checked ?
        { 0: 3, 1: 2, 2: 1 } :
        { 1: 3, 0: 2, 2: 1 };

    elements.forEach(transformElements(zIndexing, -1));
    minis.forEach(transformElements(zIndexing, -1));
    
    iterator.each('start', flyup);
    miniIterator.each('start', carousel);
};