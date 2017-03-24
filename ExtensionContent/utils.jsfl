/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 DeNA Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @fileoverview A JavaScript functions library for wahidSpriteSheetHelper.
 * Those code will run on Adobe Flash CC JavaScript VM.
 */


/**
 * Initialize this toolkit.
 * Load some libraries.
 * @param {string} rootDir Path to root directory of the extension.
 */
var initialize = function(rootDir) {
  useJson(rootDir);
};


/**
 * Load JSON library.
 * @param {string} rootDir Path to root directory of the extension.
 */
var useJson = function(rootDir) {
  if (typeof JSON == 'undefined') {
    fl.runScript(rootDir + '/lib/json3.js');
  }
};


/**
 * Retrieve the publish profile of current Flash document.
 * @return {string} Publish profile as XML format string.
 */
var fetchProfile = function() {
  var documentDOM = fl.getDocumentDOM();
  if (documentDOM == null) {
    return "error:no_fla_doc";
  }

  var xml = fl.getDocumentDOM().exportPublishProfileString();
  return xml;
};


/**
 * Retrieve current Flash document information.
 * @return {string} Document info as JSON format string.
 */
var fetchDocumentInfo = function() {
  var documentDOM = fl.getDocumentDOM();
  if (documentDOM == null) {
    return "error:no_fla_doc";
  }

  var flaUri = fl.getDocumentDOM().pathURI;
  if (!flaUri) {
    return "error:doc_never_saved";
  }

  var info = {};
  info.docPath = uriToPath(flaUri);
  return JSON.stringify(info);
};


/**
 * Convert a file URI to a platform path.
 * @return {string} Platform path string.
 */
var uriToPath = function(uri) {
  if (uri && (uri.indexOf("file://") == 0)) {
    return FLfile.uriToPlatformPath(uri);
  } else {
    return uri;
  }
}
