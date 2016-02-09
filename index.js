var locked = false;
var hintcss = require('hint.css/hint.min.css');
var fontawesome = require('font-awesome/css/font-awesome.min.css');
var style = require('./style.css');
var ui = require('popmotion');
var DATA_PROP = 'data-depth';
var HOVER_PROP = 'data-hint';
var HOVER_CLASS = ' hint hint--top-right';
var FLYUP_DURATION = 500;
var STAGGER_DURATION = 100;
var FLYUP_EASE = 'easeInOut';
var times = 0;

var hash = window.location.hash.toLowerCase();
var useTopNav = hash.indexOf('topnav') > -1;
var useSideNav = hash.indexOf('sidenav') > -1;

window.onhashchange = () => {
    location.reload(); 
};

///////       WIDTH OF NAV IS ADJUSTED TO KEEP ITEMS IN SCROLL VIEW.

var hoverDiv = (e, i) => {
        var eInner = document.createElement('div');
        eInner.className = 'inner-card';
        eInner.setAttribute(HOVER_PROP, i.types);
        e.appendChild(eInner);
    }, 
    div = (i) => {
        var e = document.createElement('div');
        var eInner = document.createElement('div');
        e.className = i.depth === 0 
            ? 'card source'
            : 'card';
        e.setAttribute(DATA_PROP, i.depth);

        hoverDiv(e, i);

        return e;
    },
    mini = (i) => {
        var e = document.createElement('div');
        e.className = i.depth === 0 
            ? 'mini source'
            : 'mini';
        e.setAttribute(DATA_PROP, i.depth);

        hoverDiv(e, i);

        return e;
    },
    relations = [
        { depth: -4, types: 'Requirements' }, 
        { depth: -3, types: 'Requirements, Epics' }, 
        { depth: -2, types: 'Epics' },
        { depth: -1, types: 'Epics, Stories' }, 
        { depth: 0, types: 'Epics, Stories' }, 
        { depth: 1, types: 'Stories' }, 
        { depth: 2, types: 'Stories' },
        { depth: 3, types: 'Stories, Testcases' }, 
        { depth: 4, types: 'Testcases' }, 
        { depth: 5, types: 'Defects, Testcases' }, 
        { depth: 6, types: 'Defects' }
    ];

var minis = [],
    elements = relations.map(div),
    fragment = document.createDocumentFragment();

elements.forEach(fragment.appendChild, fragment);

var cardsContainer = document.getElementById('cards');
cardsContainer.appendChild(fragment);
    
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
            return depth == 0 || depth == 1 ? 1 : 0.5;
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

    navContainer.className = 'nav-is-open';

    setTimeout(() => {
        navContainer.className = '';
        initTopNav();
    }, STAGGER_DURATION * minis.length + 200);
}


lockInput.onclick = () => {
    locked = !locked;

    lockInput.firstChild.className = locked ? 'fa fa-lock' : 'fa fa-unlock-alt';

    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    if (!locked) {
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
    if (locked && (currentDepth == 0 || currentDepth == direction)) {
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
    var zIndexing = { 0: 3, 1: 2, '-1': 1 };
    move(e, zIndexing, 1);
};

upstream.onclick = (e) => {
    var zIndexing = locked ?
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
                return d == 0 || d == 1 ? 0 : d < 0 ? Math.abs(d * 5) + 20 : 48;
            },
            opacity: (t) => {
                var depth = parseInt(t.element.getAttribute(DATA_PROP));
                return depth < 2 ? 1 : .5;
            },
            boxShadow: (e) => {
                var depth = parseInt(e.element.getAttribute(DATA_PROP));
                switch (depth) {
                    case 1:
                        return '10px 5px 10px rgba(0,0,0,0.25)';
                    case 0:
                        return '-10px 5px 10px rgba(0,0,0,0.25)';
                    default: {
                        if (depth < 0 && depth > -5) {
                            var size = 10 + (depth * 2);
                            return `-${size}px 5px ${size}px rgba(0,0,0,0.25)`
                        } else {
                            return '0 5px 5px rgba(0,0,0,.15)';
                        }
                    }
                }
            }
        }
    });

    var handleHover = function handleHover (event) {
        var e = event.toElement || event.relatedTarget;
        var current = findCurrentElement(elements);
        var previousElements = elements.filter((i) => 
            parseInt(i.getAttribute(DATA_PROP)) < parseInt(current.getAttribute(DATA_PROP))
        );

        function clearSpread() {
            elements.forEach((e) => {
                var i = e.firstChild;
                if (i.className.indexOf(HOVER_CLASS) > -1) {
                    i.className = i.className.replace(HOVER_CLASS, '');
                }
            });

            iterator.each('start', flyup);
            miniIterator.each('start', carousel);
            current.onmouseover = null;
        }

        iterator.each('start', sideSpread);

        previousElements.forEach((e) => {
            var i = e.firstChild;
            if (i.className.indexOf(HOVER_CLASS) < 0) {
                i.className = i.className + HOVER_CLASS;
            }

            i.onclick = (ev) => {
                var zIndexing = { 0: 3, 1: 2, '-1': 1 };
                var p = ev.target.parentNode;
                p.setAttribute(DATA_PROP, 0);
                var index = elements.indexOf(p);

                orderFrom(minis, index, zIndexing);
                orderFrom(elements, index, zIndexing);

                clearSpread();
            };
        });

        current.onmouseover = () => clearSpread();
    };

    var leftSide = upstream.parentNode;
    leftSide.onmouseover = handleHover;

}

function initTopNav() {

    var openNav = () => {
        navContainer.className = 'nav-is-open';

        setTimeout(() => {
            cardsContainer.onmouseover = (event) => {
                navContainer.className = '';
                cardsContainer.onmouseover = null;
            };
        }, 200);
    };

    downstream.onmouseover = openNav;
    upstream.onmouseover = openNav;

    navContainer.onmouseover = (event) => {
        var e = event.toElement || event.relatedTarget;
        miniIterator.each('start', carousel.extend({duration: 150}));

        var p = e.parentNode;
        if (e.className.indexOf('mini') > -1 || ((e = p) && e.className.indexOf('mini') > -1)) {
            findActor(miniActors, e).start(hoverSmall);
        }
    };

    navContainer.onclick = (event) => {
        var e = event.target;
        var p = e.parentNode;
        var zIndexing = { 0: 3, 1: 2, '-1': 1 };
        if (e.className.indexOf('mini') > -1 || ((e = p) && e.className.indexOf('mini') > -1)) {
            e.setAttribute(DATA_PROP, 0);
            var index = minis.indexOf(e);
            orderFrom(minis, index, zIndexing);
            orderFrom(elements, index, zIndexing);

            iterator.each('start', flyup);
            miniIterator.each('start', carousel);
        }
    };
}

