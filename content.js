// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
("use strict");

/* Function to add style element */
function addStyle(styles) {
  /* Create style document */
  var css = document.createElement("style");

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  /* Append style to the tag name */
  document.getElementsByTagName("head")[0].appendChild(css);
}

function tokenize(textNode) {
  return textNode.data
    .trim()
    .split(/\ /)
    .filter((s) => s.length > 0);
}

function wrap(s, className) {
  const span = document.createElement("span");
  span.className = className;
  if (s === '"') {
    span.innerHTML = s;
  } else if (s === ",") {
    span.innerHTML = s;
  } else {
    span.innerHTML = " " + s;
  }
  return span;
}

function processWithSideEffects(node, container) {
  if (node.nodeType === Node.TEXT_NODE) {
    const tokens = tokenize(node);
    tokens.map((token) =>
      container.appendChild(wrap(token, "highlighter"))
    );
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    container.appendChild(wrap(node.outerHTML, "highlighter"));
  }
}

var styles =
  ".highlighter:hover, .highlighter:hover + span, .highlighter:hover + span + span  { background-color: #FFD567 !important; cursor:none; }";
addStyle(styles);

let P = document.querySelectorAll("p");

for (const i in P) {
  // NodeList
  let nodes = P[i].childNodes;
  let p_container = document.createElement("p");

  for (const e in nodes) {
    processWithSideEffects(nodes[e], p_container);
  }
  if (nodes) replace(nodes[0], p_container);

  function replace(oldNode, newNode) {
    if (oldNode.parentNode.parentNode) {
      oldNode.parentNode.parentNode.replaceChild(
        p_container,
        oldNode.parentNode
      );
    }
  }
}
