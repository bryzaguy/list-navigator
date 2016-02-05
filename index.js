var outTimer;
var hintcss = require('hint.css/hint.min.css');
var style = require('./style.css');
var ui = require('popmotion');
var DATA_PROP = 'data-depth';
var FLYUP_DURATION = 500;
var STAGGER_DURATION = 100;
var FLYUP_EASE = 'easeInOut';

var search = window.location.search.toLowerCase();
var useTopNav = search.indexOf('topnav=true') > -1;
var useSideNav = search.indexOf('sidenav=true') > -1;

///////       WIDTH OF NAV IS ADJUSTED TO KEEP ITEMS IN SCROLL VIEW.

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

var minis = [],
    elements = relations.map(div),
    fragment = document.createDocumentFragment();

elements.forEach(fragment.appendChild, fragment);

document.getElementById('cards')
        .appendChild(fragment);
    
if (useTopNav) {
    minis = relations.map(mini);
    var minisFragment = document.createDocumentFragment();
    minis.forEach(minisFragment.appendChild, minisFragment);

    document.getElementById('nav-view')
            .appendChild(minisFragment);

}

var absoluteCards = {
    values: {
        x: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return (depth * 100) + '%';
        }
    }
};

var largeCards = {
    values: {
        borderRight: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return depth == 0 ? '2px solid white' : '0px solid white';
        },
        y: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d == 0 || d == 1 ? 0 : 48;
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
        }
    }
};

var smallCards = {
    values: {
        borderLeft: {
            ease: new ui.Easing(function(progress) {
                return Math.round(progress);
            }),
            to: (e) => {
                var depth = parseInt(e.element.getAttribute(DATA_PROP));
                return depth == 1 ? '1px solid white' : '0px solid white';
            }
        },
        boxShadow: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            switch (depth) {
                case 1:
                    return '3px 5px 7px rgba(0,0,0,0.25)';
                case 0:
                    return '-3px 5px 7px rgba(0,0,0,0.25)';
                default:
                    return '0 2px 2px rgba(0,0,0,.15)';
            }
        },
        transformOrigin: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d > 0 ? '0% 100%' : '100% 100%';
        },
        scale: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d == 0 || d == 1 ? 1 : .95;
        }
    }
};

var hoverSmall = new ui.Tween({
    duration: 150,
    values: {
        opacity: 1
    }
});

var base = new ui.Tween({
    ease: FLYUP_EASE,
    duration: FLYUP_DURATION
});

var defaults = {
    values: {
        opacity: (e) => {
            var depth = parseInt(e.element.getAttribute(DATA_PROP));
            return depth == 0 || depth == 1 ? 1 : .5;
        },
        y: 0
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
        transformOrigin: function(t) {
            var d = t.element.getAttribute(DATA_PROP);
            return d > 0 ? '0% 0%' : '100% 0%';
        },
        scale: 1,
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

var lockInput = document.getElementById('lock');
var navContainer = document.getElementById('nav-container');

iterator.stagger('start', STAGGER_DURATION, flyup);

if (useTopNav) {
    miniIterator.stagger('start', STAGGER_DURATION, carousel);

    outTimer = setTimeout(() => {
        navContainer.className = '';
    }, STAGGER_DURATION * minis.length + 200);

    navContainer.className = 'nav-is-open';
}


lockInput.onchange = () => {
    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    if (!lockInput.checked) {
        if (useTopNav) {
            navContainer.className = 'nav-is-open';
        }

        orderUnlocked(elements, zIndexing);
        orderUnlocked(minis, zIndexing);

        iterator.each('start', flyup);
        miniIterator.each('start', carousel);
    }
}

function orderUnlocked (items, zIndexing) {
    var current = findCurrentElement(items)
    orderFrom(items, items.indexOf(current), zIndexing);
}

function findCurrentElement (items) {
    return items.reduce((p, n) => {
        return n.getAttribute(DATA_PROP) == 0 ? n : p;
    }, undefined);
}

function orderFrom (items, index, zIndexing) {
    items.forEach((e, i) => {
        updateElement(e, i - index, zIndexing[i - index] || 0);
    });
}

function updateElement (element, depth, zIndex) {
    element.setAttribute(DATA_PROP, depth);
    ui.css.set(element, 'z-index', zIndex);
}

function getDepth (currentDepth, direction) {
    var jump = Math.abs(direction + direction) * -direction;
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

var downstream = document.getElementById('downstream');
var upstream = document.getElementById('upstream');

function move (e, zIndexing, direction) {
    e.stopPropagation();
    e.preventDefault();

    elements.forEach(transformElements(zIndexing, direction));
    minis.forEach(transformElements(zIndexing, direction));

    iterator.each('start', flyup);
    miniIterator.each('start', carousel);
}

function findActor(actorItems, element) {
    return actorItems.filter((a) => a.element === element)[0];
}

downstream.onclick = (e) => {
    clearTimeout(outTimer);
    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    move(e, zIndexing, 1);
};

upstream.onclick = (e) => {
    clearTimeout(outTimer);
    var zIndexing = lockInput.checked ?
        { 0: 3, 1: 2, 2: 1 } :
        { 1: 3, 0: 2, 2: 1 };

    move(e, zIndexing, -1);
};

if (useSideNav) {

    var sideSpread = new ui.Tween({
        values: {
            x: (t) => {
                var depth = parseInt(t.element.getAttribute(DATA_PROP));
                return depth < 0 ? 
                    (((depth + 1) * 25) + 75) + '%' :
                    ((depth + 1) * 100) + '%';
            },
            y: function(t) {
                var d = t.element.getAttribute(DATA_PROP);
                return d == 0 || d == 1 ? 0 : d < 0 ? Math.abs(d * 5) : 48;
            },
            opacity: (t) => {
                var depth = parseInt(t.element.getAttribute(DATA_PROP));
                return depth < 2 ? 1 : .5;
            }
        }
    });

    var handleHover = function handleHover (event) {
        var e = event.toElement || event.relatedTarget;
        iterator.each('start', sideSpread);

        var current = findCurrentElement(elements);
        current.onmouseover = function (event) {
            iterator.each('start', flyup);
            current.onmouseover = null;
        };
    };

    var leftSide = upstream.parentNode;
    leftSide.onmouseover = handleHover;

}

if (useTopNav) {

    downstream.onmouseover = (e) => {
        clearTimeout(outTimer);
        navContainer.className = 'nav-is-open';
    };

    upstream.onmouseover = (e) => {
        clearTimeout(outTimer);
        navContainer.className = 'nav-is-open';
    };

    navContainer.onmouseover = (event) => {
        var e = event.toElement || event.relatedTarget;
        miniIterator.each('start', carousel.extend({duration: 150}));

        if (e.className.indexOf('mini') > -1) {
            findActor(miniActors, e).start(hoverSmall);
        }
    };

    navContainer.onclick = (event) => {
        clearTimeout(outTimer);
        var e = event.target;
        var zIndexing = { 0: 3, 1: 2, '-1': 1 };
        if (e.className.indexOf('mini') > -1) {
            e.setAttribute(DATA_PROP, 0);
            var index = minis.indexOf(e);
            orderFrom(minis, index, zIndexing);
            orderFrom(elements, index, zIndexing);

            iterator.each('start', flyup);
            miniIterator.each('start', carousel);
        }
    };

    navContainer.onmouseout = (event) => {
        clearTimeout(outTimer); 
        var e = event.toElement || event.relatedTarget;

        while(e && e.parentNode && e.parentNode != window) {
            e = e.parentNode;
            if (e == navContainer) {
                if(e.preventDefault) e.preventDefault();
                return;
            }
        }

        outTimer = setTimeout(() => {
            navContainer.className = '';
        }, 200);
    };

}

