"use strict";

function Menu() {
  this.$toggle = document.getElementById('menu-toggle');
  this.$menu = document.getElementById('menu');
  this.$searchBox = document.getElementById('menu-search-box');
  this.$searchResults = document.getElementById('menu-search-results');
  this.initSearch();

  this.$toggle.addEventListener('click', this.toggle.bind(this));

  this.$searchBox.addEventListener('keydown', function (e) {
    if (e.keyCode === 191 && e.target.value.length === 0) {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.selectResult();
    }
  }.bind(this));

  this.$searchBox.addEventListener('keyup', debounce(function (e) {
    e.stopPropagation();
    this.search(e.target.value);
  }.bind(this)));


  var tocItems = this.$menu.querySelectorAll('#menu-toc li');
  for (var i = 0; i < tocItems.length; i++) {
    var $item = tocItems[i];
    $item.addEventListener('click', function($item, event) {
      $item.classList.toggle('active');
      event.stopPropagation();
    }.bind(null, $item));
  }

  var tocLinks = this.$menu.querySelectorAll('#menu-toc li > a');
  for (var i = 0; i < tocLinks.length; i++) {
    var $link = tocLinks[i];
    $link.addEventListener('click', function(event) {
      this.toggle();
      event.stopPropagation();
    }.bind(this));
  }
}

Menu.prototype.toggle = function () {
  this.$menu.classList.toggle('active');
}

Menu.prototype.show = function () {
  this.$menu.classList.add('active');
}

Menu.prototype.hide = function () {
  this.$menu.classList.remove('active');
}

Menu.prototype.isVisible = function() {
  return this.$menu.classList.contains('active');
}

Menu.prototype.initSearch = function () {
  var $biblio = document.getElementById('menu-search-biblio');
  if (!$biblio) {
    this.biblio = {};
  } else {
    this.biblio = JSON.parse($biblio.textContent);
  }

  this.biblio.ops = this.biblio.filter(function (e) { return e.type === 'op' });
  this.biblio.clauses = this.biblio.filter(function (e) { return e.type === 'clause' });
  this.biblio.productions = this.biblio.filter(function (e) { return e.type === 'production' });

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 191) {
      e.preventDefault();
      e.stopPropagation();

      if(this.isVisible()) {
        this._closeAfterSearch = false;
      } else {
        this._closeAfterSearch = true;
        this.show();
      }

      this.show();
      this.$searchBox.focus();
    }
  }.bind(this))
}

Menu.prototype.search = function (needle) {
  if (needle.length < 2) {
    this.hideSearch();
  } else {
    this.showSearch();
  }

  needle = needle.toLowerCase();

  var results = {};
  var seenClauses = {};

  results.ops = this.biblio.ops.filter(function(op) {
    return fuzzysearch(needle, op.aoid.toLowerCase());
  });

  results.ops.forEach(function(op) {
    seenClauses[op.refId] = true;
  });

  results.productions = this.biblio.productions.filter(function(prod) {
    return fuzzysearch(needle, prod.name.toLowerCase());
  });

  results.clauses = this.biblio.clauses.filter(function(clause) {
    return !seenClauses[clause.id] && (clause.number.indexOf(needle) === 0 || fuzzysearch(needle, clause.title.toLowerCase()));
  });

  if (results.length > 50) {
    results = results.slice(0, 50);
  }

  this.displayResults(results);
}

Menu.prototype.displayResults = function (results) {
  var totalResults = Object.keys(results).reduce(function (sum, record) { return sum + record.length }, 0);

  if (totalResults > 0) {
    this.$searchResults.classList.remove('no-results');

    var html = '<ul>';

    results.ops.forEach(function (op) {
      html += '<li class=menu-search-result-op><a href="#' + op.refId + '">' + op.aoid + '</a></li>'
    });

    results.productions.forEach(function (prod) {
      html += '<li class=menu-search-result-prod><a href="#' + prod.id + '">' + prod.name + '</a></li>'
    });

    results.clauses.forEach(function (clause) {
      html += '<li class=menu-search-result-clause><a href="#' + clause.id + '">' + clause.number + ' ' + clause.title + '</a></li>'
    })

    html += '</ul>'

    this.$searchResults.innerHTML = html;
  } else {
    this.$searchResults.classList.add('no-results');
  }
}

Menu.prototype.hideSearch = function () {
  this.$searchResults.classList.add('inactive');
}

Menu.prototype.showSearch = function () {
  this.$searchResults.classList.remove('inactive');
}

Menu.prototype.selectResult = function () {
  var $first = this.$searchResults.querySelector('li:first-child a');

  if ($first) {
    document.location = $first.getAttribute('href');
  }

  this.$searchBox.value = '';
  this.$searchBox.blur();
  this.hideSearch();

  if (this._closeAfterSearch) {
    this.hide();
  }
}

function init() {
  var menu = new Menu();
}

document.addEventListener('DOMContentLoaded', init);

function debounce(fn) {
  var timeout;
  return function() {
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      timeout = null;
      fn.apply(this, args);
    }.bind(this), 150);
  }
}

// The following license applies to the fuzzysearch function
// The MIT License (MIT)
// Copyright © 2015 Nicolas Bevacqua
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function fuzzysearch (needle, haystack) {
  var tlen = haystack.length;
  var qlen = needle.length;
  if (qlen > tlen) {
    return false;
  }
  if (qlen === tlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < qlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < tlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
var CLAUSE_NODES = ['EMU-CLAUSE', 'EMU-INTRO', 'EMU-ANNEX'];
function findLocalReferences ($elem) {
  var name = $elem.innerHTML;
  var references = [];

  var parentClause = $elem.parentNode;
  while (parentClause && CLAUSE_NODES.indexOf(parentClause.nodeName) === -1) {
    parentClause = parentClause.parentNode;
  }

  if(!parentClause) return;

  var vars = parentClause.querySelectorAll('var');

  for (var i = 0; i < vars.length; i++) {
    var $var = vars[i];

    if ($var.innerHTML === name) {
      references.push($var);
    }
  }

  return references;
}

function toggleFindLocalReferences($elem) {
  var references = findLocalReferences($elem);
  if ($elem.classList.contains('referenced')) {
    references.forEach(function ($reference) {
      $reference.classList.remove('referenced');
    });
  } else {
    references.forEach(function ($reference) {
      $reference.classList.add('referenced');
    });
  }
}

function installFindLocalReferences () {
  document.addEventListener('click', function (e) {
    if (e.target.nodeName === 'VAR') {
      toggleFindLocalReferences(e.target);
    }
  });
}

document.addEventListener('DOMContentLoaded', installFindLocalReferences);
