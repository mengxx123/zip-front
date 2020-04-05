/* ================================================================
 * md-list-tree-parser by bruce_jcw[at]gmail.com
 *
 * first created at : Mon Nov 07 2016 17:34:37 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2016 bruce_jcw
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */
/* eslint-disable */

'use strict';

function parse2Json(mdTree) {

  // var mdTree = getMdTree.apply(null, arguments)
  return doParse(mdTree)
}

function doParse(mdTree) {
  var jsonTree = []
  var lines = mdTree.split('\n')
  console.log('lines', lines)
  var regex = /^(\s*)(.+)$/
  lines.forEach(function(line, i) {
    var matchs = line.match(regex)
    if (matchs) {
      console.log('matchs', matchs)
      var level = matchs[1].length / 4
      var title = matchs[2]
      var link = matchs[4]
      var node = {
        text: matchs[2]
      }

      if (level === 0) {
        jsonTree.push(node)
      } else {
        var p = getParentNode(level, jsonTree)
        p.children.push(node)
      }
    }
  })
  return jsonTree
}

function getParentNode(level, jsonTree) {
  var i = 0
  var node = jsonTree[jsonTree.length -1]
  while(i < level - 1) {
    var children = node.children
    node = children[children.length - 1]
    i++
  }

  if (!node.children) {
    node.children = []
  }
  return node
}

function Node(title, link) {
  this.title = title
  this.link = link || ''
}

export { parse2Json }
