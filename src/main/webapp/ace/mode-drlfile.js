/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Contributor(s):
 *
 *
 *
 * ***** END LICENSE BLOCK ***** */

 
ace.define('ace/mode/drlfile', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/drlfile_highlight_rules', 'ace/mode/folding/cstyle'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var drlFileHighlightRules = require("./drlfile_highlight_rules").drlFileHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
//var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var Mode = function() {
    var highlighter = new drlFileHighlightRules();
    this.foldingRules = new FoldMode();
    //this.$outdent = new MatchingBraceOutdent();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.$keywordList = highlighter.$keywordList
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "::";
    this.blockComment = "";
}).call(Mode.prototype);

exports.Mode = Mode;
});

ace.define('ace/mode/drlfile_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var drlFileHighlightRules = function() {
    var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";
    var opRe=/(=|<|<=|>|>=|==|!=|\+=|\+|-|\/|%|\^|\*|\||>>>|>>|<<|\?|\|\||\.|&&|\-=)/;
    var opWords =/\b(not|contains|matches|memberof|soundslike|in|instanceof|and)\b/;
    var opDeprecatedRe="eval";
    var builtinConstants=/(true|false|null)(\s|$)/;
    var numericRe=/\b[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/;
    var keywordMapper = this.createKeywordMapper({
        "keyword" : "\\b(?:entry-point|package|import|" +
                    "attributes|rule|extend|when|then|template|query|declare|" +
                    "function|global|eval|not|in|or|and|exists|forall|accumulate|" +
                    "collect|from|action|reverse|result|end|over|init)\\b"
      },"identifier");
    
     this.$rules = { 
       start:
       [ 
         { token: "meta.tag",
           regex: /@(?=[a-zA-Z0-9_]*)+/,
           next : "meta_data"},
         { token: "storage.type",
           regex: "declare",
           next : "type" },
         { token: "comment",
           regex: /\/\*/,
           push : "block_comment" },
         { token: "comment",
           regex: /#|\/\//,
           push : "line_comment" },
         { token: "keyword",
           regex: /(rule)/,
           push :  "rule"},
         { token: "keyword",
           regex: /(function)/,
           push :  "function"},
         { token: "keyword.global", 
           regex: /\b(import|global|package)\b/},
         { token:  "punctuation.global", 
           regex: /\.|;/},
         { defaultToken:"identifier"}
        ],
        "block_comment" : [
            {token : "comment", regex : /\*\//, next : "pop"},
            {defaultToken : "comment"}
        ],
        "line_comment" : [
            {token : "comment", regex : /($|^)/, next : "pop"},
            {defaultToken : "comment"}
        ],
        "type" : [
            {token : "storage.type",regex:/\b(end)\b/,next:"pop"},
            {token : "keyword",regex:/\s*\b(extends)/},
            {token : "support.class",regex :/\s*[a-zA-Z0-9_]+\s*$/,next:"type_attributes"},
            {defaultToken: "support.class"}
        ],
        "type_attributes" :[
            {token: "storage.type",regex:/\bend\b/,next:"start"},
            {token: "meta.tag",regex:/@(?=[a-zA-Z0-9_]+)+/,push:"meta_data"},
            {token: "operator",regex : /\s*:\s*/},
            {token: "operator",regex : /\./},
            {token: "entity.other.attribute-name", regex : /[A-z]+\s*(?=\:)/},
            {token: "constant.library",regex :/(\s*[a-zA-Z0-9_]*(?=\.))+/},
            {token: "variable.language.type",regex: /[a-zA-Z0-9_]+(\s*|$)/},
            {token: "comment",regex: /#|\/\//,push : "line_comment" },
            {token: "comment",regex: /\/\*/,push: "block_comment" }
          ],
        "meta_data": [
            {token : "meta.tag.recur",regex:/@/},
            {token : "meta.tag.key",regex:/[a-zA-Z0-9_]+/},
            {token : "paren.lparen",regex : /\(/,
             push:[{token: "variable.parameter",
                    regex:/[a-zA-Z0-9_\s\-,]*/,
                    next:"pop"}]}, 
            {token : "paren.rparen",regex : /\)|\n/,next:"pop" },
            {token : "meta.tag.value",regex : /\[a-zA-Z0-9_\s,]+/}
          ],
        "function" :[
            {token : "paren.rparen",regex:/}/,next:"pop"},
            {token : "keyword",regex: /\breturn\b/},
            {include:"baselanguage"},
            {defaultToken: "identifier"}
          ],
        "rule":[
            {token : "keyword",regex:/\bend\b/,next:"pop"},
            {token : "keyword.attribute-name",regex:/(agenda|ruleflow|activation)-group(\s|$)/},
            {token : "keyword.attribute-name",regex:/date-(effective|expires)\b/},
            {token : "keyword.attribute-name",regex:/(no-loop|lock-on-active|salience|enabled|duration)(\s|$)/},
            {include: "baselanguage"},
            {token :  keywordMapper,regex : identifierRe},
            {defaultToken: "identifier"}
          ],
        "baselanguage":[
            {token : "comment",regex: /#|\/\//,push : "line_comment" },
            {token : "comment",regex: /\/\*/,push: "block_comment" },
            {token : "constant.language",regex: builtinConstants},
            {token : "support.function",regex: /(average|min|max|count|sum|collectList|collectSet)(\s|$)/},
            {token : "punctuation.operator", regex: /(\.|\:|,)/},
            {token : "constant.language.boolean",regex: /\b(true|false)\b/},
            {token : "constant.language",regex: /\bnull\b/},
            {token : "paren.lparen",regex : /\(|{/},
            {token : "paren.rparen",regex : /\)|}/},
            {token : "keyword.operator", regex: opWords},
            {token : "keyword.operator",regex:opRe},
            {token : "constant.numeric",regex: numericRe },
            {token : "punctuation.definition.string.begin",regex: '"',
             push: [ 
                { token: 'punctuation.definition.string.end', regex: '"', next: 'pop' },
                { include: 'variable' },
                { defaultToken: 'string.quoted.double' } ] },
            {token : "punctuation.definition.string.begin",regex: '\'',
             push: [ 
                { token: 'punctuation.definition.string.end', regex: '\'', next: 'pop' },
                { include: 'variable' },
                { defaultToken: 'string.quoted.single' } ] }
          ]
        };
    
    this.normalizeRules();
};

drlFileHighlightRules.metaData = { name: 'Batch File',
      scopeName: 'source.dosbatch',
      fileTypes: [ 'bat' ] };


oop.inherits(drlFileHighlightRules, TextHighlightRules);

exports.drlFileHighlightRules = drlFileHighlightRules;
});

ace.define('ace/mode/folding/cstyle', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(require, exports, module) {


var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i + match[0].length, 1);
        }

        if (foldStyle !== "markbeginend")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };

}).call(FoldMode.prototype);

});