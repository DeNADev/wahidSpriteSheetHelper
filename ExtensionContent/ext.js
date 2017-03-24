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
 * @fileoverview wahidSpriteSheetHelper is a extension of Adobe Flash
 * Professional CC 2014.
 * This extension makes sprite sheet more easy to use with the Wahid library.
 */

(function(extension) {
  /**
   * This extension uses fs module of Node.js to read/write local files.
   */
  var fs = require('fs');
  /**
   * This extension uses path module of Node.js to manipulate.file/dir path.
   */
  var path = require('path');

  /**
   * Jed instance, as a internationalization module.
   */
  var i18n = null;
  
  /**
   * A error header string of return value of CSInterface.eval().
   */
  var ERROR_STRING_HEADER = 'error:';

  /**
   * Initialize this extension on loaded the extension panel.
   */
  extension.initialize = function() {
    var csInterface = new CSInterface();
    initializeFlashVM(nullcallback);
    // Locale contents.
    // ResourceBundle is only used for locale detection.
    // We use Jed as a internationalization module.
    // In this moment, we only support ja/en locales.
    var resourceBundle = csInterface.initResourceBundle();
    var lang = resourceBundle.lang;
    i18n = getI18N(lang);

    var appName = csInterface.hostEnvironment.appName;

    if (appName != 'FLPR') {
      loadJSX();
    }

    var appNames = ['FLPR'];
    for (var i = 0; i < appNames.length; i++) {
      var name = appNames[i];
      if (appName.indexOf(name) >= 0) {
        var btn = document.getElementById('btn' + name);
        if (btn)
          btn.disabled = false;
      }
    }

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT,
                                 onAppThemeColorChanged);

    //^^^^^ template code

    locationInfo = {};

    // Register entry points.
    var replaceButton = window.document.getElementById('btnReplace');
    replaceButton.onclick = function() {
      modifyPublishedFile();
    };

    //csInterface.addEventListener('com.adobe.events.flash.postPublish',
    //                             modifyPublishedFile);

    return i18n;
  };

  /**
   * Update the theme with the AppSkinInfo retrieved from the host product.
   */
  var updateThemeWithAppSkinInfo = function(appSkinInfo) {

    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);

    var styleId = 'ppstyle';

    var csInterface = new CSInterface();
    var appName = csInterface.hostEnvironment.appName;

    if (appName == 'PHXS') {
      addRule(styleId,
              'button, select, input[type=button], input[type=submit]',
              'border-radius:3px;');
    }
    if (appName == 'PHXS' || appName == 'PPRO' || appName == 'PRLD') {
      //////////////////////////////////////////////////////////////////////
      // NOTE: Below theme related code are only suitable for Photoshop.  //
      // If you want to achieve same effect on other products please make //
      // your own changes here.                                           //
      //////////////////////////////////////////////////////////////////////

      var gradientBg = 'background-image: -webkit-linear-gradient(top, ' +
          toHex(panelBackgroundColor, 40) + ' , ' +
          toHex(panelBackgroundColor, 10) + ');';
      var gradientDisabledBg = 'background-image: -webkit-linear-gradient' +
          '(top, ' +
          toHex(panelBackgroundColor, 15) +
          ' , ' +
          toHex(panelBackgroundColor, 5) + ');';
      var boxShadow = '-webkit-box-shadow: inset 0 1px 0 ' +
          'rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);';
      var boxActiveShadow = '-webkit-box-shadow: inset 0 1px 4px ' +
          'rgba(0, 0, 0, 0.6);';

      var isPanelThemeLight = panelBackgroundColor.red > 127;
      var fontColor, disabledFontColor;
      var borderColor;
      var inputBackgroundColor;
      var gradientHighlightBg;
      if (isPanelThemeLight) {
        fontColor = '#000000;';
        disabledFontColor = 'color:' + toHex(panelBackgroundColor, -70) + ';';
        borderColor = 'border-color: ' + toHex(panelBackgroundColor, -90) + ';';
        inputBackgroundColor = toHex(panelBackgroundColor, 54) + ';';
        gradientHighlightBg = 'background-image: -webkit-linear-gradient' +
            '(top, ' +
            toHex(panelBackgroundColor, -40) +
            ' , ' +
            toHex(panelBackgroundColor, -50) + ');';
      } else {
        fontColor = '#ffffff;';
        disabledFontColor = 'color:' + toHex(panelBackgroundColor, 100) + ';';
        borderColor = 'border-color: ' + toHex(panelBackgroundColor, -45) + ';';
        inputBackgroundColor = toHex(panelBackgroundColor, -20) + ';';
        gradientHighlightBg = 'background-image: -webkit-linear-gradient' +
            '(top, ' +
            toHex(panelBackgroundColor, -20) +
            ' , ' +
            toHex(panelBackgroundColor, -30) + ');';
      }

      //Update the default text style with pp values

      addRule(styleId, '.default', 'font-size:' + appSkinInfo.baseFontSize +
          'px' + '; color:' + fontColor + '; background-color:' +
          toHex(panelBackgroundColor) + ';');
      addRule(styleId,
              'button, select, input[type=text], input[type=button], ' +
              'input[type=submit]',
              borderColor);
      addRule(styleId,
              'button, select, input[type=button], input[type=submit]',
              gradientBg);
      addRule(styleId,
              'button, select, input[type=button], input[type=submit]',
              boxShadow);
      addRule(styleId,
              'button:enabled:active, input[type=button]:enabled:active, ' +
              'input[type=submit]:enabled:active',
              gradientHighlightBg);
      addRule(styleId,
              'button:enabled:active, input[type=button]:enabled:active, ' +
              'input[type=submit]:enabled:active',
              boxActiveShadow);
      addRule(styleId, '[disabled]', gradientDisabledBg);
      addRule(styleId, '[disabled]', disabledFontColor);
      addRule(styleId, 'input[type=text]', 'padding:1px 3px;');
      addRule(styleId, 'input[type=text]', 'background-color: ' +
          inputBackgroundColor) +
          ';';
      addRule(styleId, 'input[type=text]:focus', 'background-color: #ffffff;');
      addRule(styleId, 'input[type=text]:focus', 'color: #000000;');

    } else {
      // For AI, ID and FL use old implementation
      addRule(styleId, '.default', 'font-size:' + appSkinInfo.baseFontSize +
          'px' + '; color:' + reverseColor(panelBackgroundColor) +
          '; background-color:' + toHex(panelBackgroundColor, 20));
      addRule(styleId, 'button', 'border-color: ' +
          toHex(panelBackgroundColor, -50));
    }
  };

  var addRule = function(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);

    if (stylesheet) {
      stylesheet = stylesheet.sheet;
      if (stylesheet.addRule) {
        stylesheet.addRule(selector, rule);
      } else if (stylesheet.insertRule) {
        stylesheet.insertRule(selector + ' { ' + rule + ' }',
                              stylesheet.cssRules.length);
      }
    }
  };

  var reverseColor = function(color, delta) {
    return toHex({
      red: Math.abs(255 - color.red),
      green: Math.abs(255 - color.green),
      blue: Math.abs(255 - color.blue)
    }, delta);
  };

  /**
   * Convert the Color object to string in hexadecimal format;
   */
  var toHex = function(color, delta) {
    function computeValue(value, delta) {
      var computedValue = !isNaN(delta) ? value + delta : value;
      if (computedValue < 0) {
        computedValue = 0;
      } else if (computedValue > 255) {
        computedValue = 255;
      }

      computedValue = (computedValue | 0).toString(16);
      return computedValue.length == 1 ? '0' + computedValue : computedValue;
    }

    var hex = '';
    if (color) {
      with (color) {
        hex = computeValue(red, delta) + computeValue(green, delta) +
            computeValue(blue, delta);
      }
    }
    return '#' + hex;
  };

  var onAppThemeColorChanged = function(event) {
    // Should get a latest HostEnvironment object from application.
    var hostenv = window.__adobe_cep__.getHostEnvironment();
    var skinInfo = JSON.parse(hostenv).appSkinInfo;
    // Gets the style information such as color info from the skinInfo,
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
  };

  /**
   * Load JSX file into the scripting context of the product. All the jsx files
   * in folder [ExtensionRoot]/jsx will be loaded.
   */
  var loadJSX = function() {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +
        '/jsx/';
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
  };

  var evalScript = function(script, callback) {
    new CSInterface().evalScript(script, callback);
  };

  //^^^^^^ template code.

  /**
   * A callback function object that will do nothing.
   */
  var nullcallback = function(res) {
    //clog(res);
  };

  /**
   * Invoke 'fl.trace' method on the FlashCC side JavaScript VM.
   * @param {string} log
   */
  var flog = function(log) {
    log = log.replace(/\\/g, '/');
    (new CSInterface()).evalScript('fl.trace("' + log + '")');
  };

  /**
   * Invoke 'alert' function on the Flash JSVM.
   * @param {string} msg
   */
  var falert = function(msg) {
    msg = msg.replace(/\\/g, '/');
    (new CSInterface()).evalScript('alert("' + msg + '")');
  };

  var clog = function(log) {
    log = log.replace(/\\/g, '/');
    console.log(log);
  };

  /**
   * Retrieves a URI for which a constant is defined in the system.
   * @param {string} pathType The path-type constant defined in \c #SystemPath ,
   * @return {string} The platform-specific system path string.
   */
  var getSystemUri = function(pathType) {
    //Attention: This is a private method.
    return window.__adobe_cep__.getSystemPath(pathType);
  };

  /**
   * Invoke a function in utils.jsfl.
   * @param {string} funcName Name of function.
   * @param {string} argsString Arguments as a string, like this:
   * "'arg1', 'arg2'". The strings must be surrounded by single or
   * double quatations.
   * @param {Function} callback
   */
  var callUtils = function(funcName, argsString, callback) {
    var csInterface = new CSInterface();
    var scriptPath = getSystemUri(SystemPath.EXTENSION) + '/utils.jsfl';
    if (callback == null) {
      callback = nullcallback;
    }
    if (argsString == null) {
      //alert('fl.runScript("'+scriptPath+'", "'+funcName+'")');
      csInterface.evalScript('fl.runScript("' + scriptPath + '", "' + funcName +
          '")', callback);
    } else {
      //alert('fl.runScript("'+scriptPath+'", "'+funcName+'", '+argsString+')');
      csInterface.evalScript('fl.runScript("' + scriptPath + '", "' + funcName +
          '", ' + argsString + ')', callback);
    }
  };

  /**
   * Show error alert dialog.
   * @param {string} errorString An error response of CSInterface.evalScript().
   */
  var showErrorAlert = function (errorString) {
    var errorCode = errorString.substr(ERROR_STRING_HEADER.length);
    var message = null;
    switch(errorCode) {
    case 'no_fla_doc':
      message = i18n.gettext('Could not find current Flash document.');
      break;
    case 'doc_never_saved':
      message =
        i18n.gettext('This Flash document is never saved.  Save and retry.');
      break;
    case 'change_output_path':
      message = 
        i18n.gettext('Change the path of OutputFile.');
      break;
    default:
      flog('Unknown localized message key:'+errorString);
      break;
    }
    if (message) {
      falert(message);
    }
  };

  /**
   * Initialize the Flash JSVM.
   * @param {Function} callback
   */
  var initializeFlashVM = function(callback) {
    var rootDir = getSystemUri(SystemPath.EXTENSION);
    //'file://' + csInterface.getSystemPath(SystemPath.EXTENSION);
    callUtils('initialize', '"' + rootDir + '"', callback);
  };

  /**
   * Actual entry point.
   * This plugin modifies the published JS file to fit for Wahid.
   */
  var modifyPublishedFile = function() {

    fetchPublishedLocations(function(locations) {
      if (locations) {
        //flog("locations")
        //for(var n in locations) flog(n+":"+locations[n]);
        replaceSpriteSheet(locations);
      }
    });
  }

  /**
   * Retrieve the publish settings object.
   * It contains several location info:
   *  'docPath' - Platform absolute path to this fla document.
   *  'docDir' - Platform absolute path to the directory contains this fla document.
   *  'rootDir' - Platform absolute path to the published root directory.
   *  'mainJs' - Platform absolute path to the published JS file.
   *  'imagesDir' - Platform absolute path to images directory.
   * @param {Function} callback
   */
  var fetchPublishedLocations = function(callback) {

    // Read document root directory.
    callUtils('fetchDocumentInfo', null, function(res) {
      if (res.indexOf(ERROR_STRING_HEADER, 0) == 0) {
        showErrorAlert(res);
        callback(null);
        return;
      } else {
        var documentInfo = JSON.parse(res);

        callUtils('fetchProfile', null, function(res) {
          var retval = null;
          // 'res' is the publishing settings as XML format.
          if (res == null || res == 'null') {
            falert('Could not fetch the publish profile.');
            callback(null);
            return;
          } else if (res.lastIndexOf(ERROR_STRING_HEADER, 0) == 0) {
            showErrorAlert(res);
            callback(null);
            return;
          } else {

            var locations = parsePublishProfile(res, documentInfo.docPath);
            if (!locations) {
              falert(i18n.gettext('Could not load the publishing settings.'));
              callback(null);
              return;
            } else {
              callback(locations);
              return;
            }
          }
        });
      }
    });
  };

  /**
   * Retrieve paths from the publish profile xml string.
   * @param {String} xml A publish profile as a XML string.
   * @param {String} docPath The path to current Flash document.
   * @return {Object} paths.
   */
  var parsePublishProfile = function(xml, docPath) {
    var docDir = path.dirname(docPath) + path.sep;

    /* 'xml' XML structure.
     * <profile>
     *   <PublishFormatProperties/>
     *   <PublishJpegProperties/>
     *   <PublishProperties name="SVG Image"/>
     *   <PublishProperties name="JavaScript/HTML">
     *     <Property name="filename">relative-path-to-js-file</Property>
     *     <Property name="imagesPath">
     *       relative-path-to-image-dir</Property>
     *   </PublishProperties>
     */
    var domParser = new window.DOMParser();
    var publishProfile =
        domParser.parseFromString(xml, 'application/xml');
    var publishProperties =
        publishProfile.getElementsByTagName('PublishProperties');
    
    if (!publishProperties) {
      return null;
    }

    var htmlSetting;
    for (var i = 0; i < publishProperties.length; ++i) {
      var property = publishProperties[i];
      if (property.getAttribute('name') == 'JavaScript/HTML') {
        htmlSetting = property;
        break;
      }
    }
    if (!htmlSetting) {
      return null;
    }

    var mainJsPath;
    var imagesPath;
    var properties = htmlSetting.getElementsByTagName('Property');
    for (var i = 0; i < properties.length; ++i) {
      var property = properties[i];
      var name = property.getAttribute('name');
      if (name == 'filename') {
        mainJsPath = property.textContent;
      } else if (name == 'imagesPath') {
        imagesPath = property.textContent;
      }
    }

    if (!(mainJsPath && imagesPath)) {
      return null;
    }

    // Make absolute path from relative one if needed.
    if (path.resolve(mainJsPath) != mainJsPath) {
      //It's relative path!!
      if (path.basename(mainJsPath) == mainJsPath) {
        // If the "output file" path is only a file name,
        // this document will be published to the "default" directory.
        // We cannot resolve this "default" directory, so user must
        // set other path to output it.
        showErrorAlert(ERROR_STRING_HEADER+"change_output_path");
        return null;
      }
      // The base directory is the document directory.
      mainJsPath = path.normalize(docDir + mainJsPath);
    }
    var rootDir = path.dirname(mainJsPath) + path.sep;
    if (path.resolve(imagesPath) != imagesPath) {
      imagesPath = path.normalize(rootDir + imagesPath);
      //imagesPath = imagesPath.replace(rootDir, '');
    }

    var retval = {};
    retval.docPath = docPath;
    retval.docDir = docDir;
    retval.rootDir = rootDir;
    retval.mainJs = mainJsPath;
    retval.imagesDir = imagesPath;
    return retval;
  }

  /**
   * Replace code and resources of sprite sheets.
   */
  var replaceSpriteSheet = function(locationInfo) {

    var checkDeleteImages = window.document.getElementById('chkDeleteImages');
    var deleteFlag = checkDeleteImages.checked;
    
    var spriteSheetDir = locationInfo.imagesDir;

    // Read sprite sheet json files.
    loadSpriteSheetData(spriteSheetDir, function(spriteSheets) {
      if (spriteSheets == null) {
        var msg = i18n.translate('Could not find JSON-ARRAY ' +
                                 'formatted sprite sheet file.%s').
                                 fetch(spriteSheetDir);
        falert(msg);
        return;
      }

      // Insert sprite sheet data into main JS.
      var imagesDirRelative = 
        locationInfo.imagesDir.replace(locationInfo.rootDir, '');

      replaceSpriteSheetCode(locationInfo.mainJs, imagesDirRelative,
          spriteSheets, function(res) {
            if (res) {
              // Copy the sprite sheet image file into the images directory,
              // remove individual image files.
              replaceImages(spriteSheetDir,
                  locationInfo.imagesDir,
                  spriteSheets, deleteFlag,
                  function(res) {
                    falert(i18n.gettext('Rewriting ended normally.'));
                  });
            } else {
              var jsname = path.basename(locationInfo.mainJs);
              var msg = i18n.translate('Failed in rewriting of %s.').
                fetch(jsname);
              falert(msg);
            }
        });
    });
  };

  /**
   * Load sprite sheet JSON files and parse them.
   * @param {string} spriteSheetsDir Directory path that contains sprite sheet
   * JSON files.
   * @param {Function} callback
   */
  var loadSpriteSheetData = function(spriteSheetsDir, callback) {
    if (callback == null) {
      callback = nullcallback;
    }

    // search and parse spritesheet jsons.
    fs.readdir(spriteSheetsDir, function(err, filelist) {
      if (err) {
        flog('Could not read directory:' + err);
        callback(null);
      }

      var jsons = [];
      filelist = filelist || [];
      for (var i = 0; i < filelist.length; ++i) {
        var filename = filelist[i];
        if (path.extname(filename).toLowerCase() == '.json') {
          var filepath = spriteSheetsDir + filename;
          var filecontent = fs.readFileSync(filepath, 'utf8');
          //chop head and tail double quatations.
          var parsed = JSON.parse(filecontent.substr(1,
                                                     filecontent.length - 2));
          jsons.push(parsed);
        }
      }
      if (jsons.length == 0) {
        flog('Could not load spritesheet data.');
        callback(null);
      } else {
        callback(jsons);
      }
    });
  };

  /**
   * Search javascript codes that contains reference to individual image files,
   * replate that with references to sprite sheet image files.
   * @param {string} jsPath Path to published JS file.
   * @param {string} imagesDir Path to the directory that contains published
   * image files.
   * @param {Array} Array of sprite sheet object.
   */
  var replaceSpriteSheetCode = function(jsPath, imagesDir, spriteSheets,
                                        callback) {
    var csInterface = new CSInterface();
    readMainJs(jsPath, function(res) {
      if (res == null) {
        callback(false);
        return;
      }

      var code = res;
      var manifest = readManifest(code);
      var modified = false;
      var failedFiles = [];
      for (var i = 0; i < spriteSheets.length; ++i) {
        try {
          var resarr =
              replaceSprite(code, manifest, spriteSheets[i], imagesDir);
          code = resarr[0];
          manifest = resarr[1];
          if (spriteSheets[i].meta.modified) {
            modified = true;
          }
        } catch (e) {
          if (e.name && e.name == 'IllegalFileNameError') {
            failedFiles.push(e);
          } else {
            throw e;
          }
        }
      }

      if (failedFiles.length > 0) {
        for (var i = 0; i < failedFiles.length; ++i) {
          var msg = i18n.translate('Could not process %1s in %2s').
              fetch(failedFiles[i].illegalFileName,
                  failedFiles[i].spriteSheetName);
          flog(msg);
        }
        flog(i18n.gettext('Rename the image file, ' +
                          'regenerate the sprite sheet and retry.'));
        falert(i18n.gettext('Could not process some image files.  ' +
                            'Check the Output window'));
        fallback(false);
        return;
      }

      if (modified) {
        code = writeManifest(code, manifest);
        writeMainJs(jsPath, code, callback);
      } else {
        clog('No modification found.');
        falert(i18n.gettext('There is no need to rewrite. ' + 
                'Please re-execute after re-publishing.'));
        callback(false);
      }
    });
  };

  /**
   * Read published JS file from local file system.
   * @param {string} jsPath Path to published JS file.
   * @param {Function} callback
   */
  var readMainJs = function(jsPath, callback) {
    if (callback == null) {
      callback = nullcallback;
    }

    fs.readFile(jsPath, 'utf8', function(err, data) {
      if (err) {
        flog('Could not read main JS:');
        flog(err);
        data = null;
      }
      mainjs = data;
      callback(data);
    });
  };

  /**
   * Write modified JS file to local file system.
   * @param {string} jsPath Path to published JS file.
   * @param {string} code Modified JS code.
   * @param {Function} callback
   */
  var writeMainJs = function(jsPath, code, callback) {
    if (callback == null) {
      callback = nullcallback;
    }
    var bakPath = jsPath + '.bak';
    try {
      fs.unlinkSync(bakPath);
    } catch (e) {
      // nothing to do here.
    }
    try {
      fs.renameSync(jsPath, bakPath);
    } catch (e) {
      flog('Could not back-up original main JS file:' + e);
      // nothing to do here.
    }
    fs.writeFile(jsPath, code, function(err) {
      if (err) {
        flog('Could not write main JS:');
        flog(err);
        callback(false);
      } else {
        callback(true);
      }
    });
  };

  /**
   * Parse "Manifest" object from JavaScript code.
   * @param {string} code Published JS code string.
   * @return {Array} Array of manifest object.
   */
  var readManifest = function(code) {
    var template = 'manifest: [';
    // manifest: [
    //           ^
    var begin = code.indexOf(template) + template.length - 1;
    //           ]
    //            ^
    var end = code.indexOf(']', begin) + 1;
    var manifestArrayCode = code.substr(begin, end - begin);
    var manifestArray = eval(manifestArrayCode);
    return manifestArray;
  };

  /**
   * Replace "Manifest" code block in JavaScript code.
   * @param {string} code Published JS code string.
   * @param {Object} manifest Modified manifest object.
   * @return {string} Modified JavaScript code string
   */
  var writeManifest = function(code, manifest) {
    var template = 'manifest: [';
    // manifest: [
    //            ^
    var begin = code.indexOf(template) + template.length;
    //           ]
    //           ^
    var end = code.indexOf(']', begin);
    var manifestArrayCode = code.substr(begin, end - begin);

    var newCode;
    for (var i = 0; i < manifest.length; ++i) {
      if (i > 0) {
        newCode += ',\n\t\t';
      } else if (i == 0) {
        newCode = '\n\t\t';
      }
      var element = manifest[i];
      newCode += '{src:"' + element.src + '", id:"' + element.id + '"}';
    }
    newCode += '\n\t';

    code = code.replace(manifestArrayCode, newCode);
    return code;
  };

  /**
   * Custom exception class for IllegalFileName error.
   * @constructor
   * @param {string} name File name that occured the error.
   * @param {string} spriteSheetName File name of sprite sheet that contains the
   * errored file.
   */
  var IllegalFileNameError = function(name, spriteSheetName) {
    Error.apply(this);
    this.name = 'IllegalFileNameError';
    this.illegalFileName = name;
    this.spriteSheetName = spriteSheetName;
  };
  IllegalFileNameError.prototype = new Error();

  /**
   * Check the file name is valid image file name.
   * The file name must be valid JavaScript identifier.
   * @param {string} filename
   * @return {boolean} Returns true if the file name is valid.
   */
  var isValidImageFileName = function(filename) {
    var dummy = {};
    var basename = path.basename(filename, path.extname(filename));
    if (basename in dummy) {
      clog(filename + ' is duplicated by Object\'s property.');
      return false;
    }

    try {
      // Is the basename valid identifier of JavaScript?
      // It's improper use of eval(), but very easy way to check.
      eval('dummy.' + basename + '=0;');
    } catch (e) {
      clog(e);
      clog(filename + ' is not valid JavaScript identifier.');
      return false;
    }

    return true;
  };

  /**
   * Convert original image file name to sprite ID
   * that will be used in the main JS.
   * @param {string} filename
   * @return {string} Sprite id.
   */
  var originalImageFileNameToPublishedIds = function(originalFileName, 
                                                     spriteSheetName) {
    var id = path.basename(originalFileName, path.extname(originalFileName));
    var filename = originalFileName;
    // Flash CC will rename some image files when it exports fla doc to HTML5.
    if (!isValidImageFileName(filename)) {
      throw new IllegalFileNameError(filename, spriteSheetName);
    }
    var ret = {};
    ret.id = id;
    ret.filename = filename;
    return ret;
  };

  /**
   * Replace sprite image code with texture atlas image code.
   * And set Bitmap.sourceRect attribute.
   * @param {string} code
   * @param {Object} manifest
   * @param {Object} spriteSheet
   * @param {string} imagesDir
   * @return {Array} Array contains modified code and manifest.
   */
  var replaceSprite = function(code, manifest, spriteSheet, imagesDir) {
    // Replace non-ascii charactor with underscore due to limitation of
    // JavaScript identifer specs.
    var spriteSheetId = spriteSheet.meta.image.replace(/\W/g, '_');
    var needInsertToManifest = false;

    for (var i = 0; i < spriteSheet.frames.length; ++i) {
      var frame = spriteSheet.frames[i];
      var filename = frame.filename;
      var publishedIds =
          originalImageFileNameToPublishedIds(filename, spriteSheet.meta.image);
      var msg = i18n.translate('Replacing %1s with %2s...').
          fetch(publishedIds.filename, spriteSheet.meta.image);
      //flog(msg);

      // delete definition of the sprite image file.
      for (var j = 0; j < manifest.length; ++j) {
        if (manifest[j].id == publishedIds.id) {
          manifest.splice(j, 1); //erase this element.
          needInsertToManifest = true;
        }
      }

      // replace sprite code
      var oldString = 'this.initialize(img.' + publishedIds.id + ')';
      var newString = 'this.sourceRect=new cjs.Rectangle(' + frame.frame.x +
          ',' + frame.frame.y + ',' + frame.frame.w + ',' + frame.frame.h +
          ');\n' + '\tthis.initialize(img.' + spriteSheetId + ')';
      code = code.replace(oldString, newString);
    }

    if (needInsertToManifest) {
      var element = {};
      element.id = spriteSheetId;
      element.src = imagesDir + spriteSheet.meta.image;
      element.src = element.src.replace(/\\/g, '/'); // For Windows.
      manifest.push(element);

      spriteSheet.meta.modified = true;
    }

    return [code, manifest];
  };

  /**
   * Replace image piece files to texture atlas file.
   * @param {string} spriteSheetsDir
   * @param {string} imagesDirPath
   * @param {Array} spriteSheets
   * @param {boolean} deleteFlag
   * @param {Function} callback
   */
  var replaceImages = function(spriteSheetsDir, imagesDirPath, spriteSheets,
                               deleteFlag, callback) {

    // Some tiny utility functions.
    var copyFile = function(src, dest, cb) {
      if (src == dest) {
        cb(true);
        return;
      }
      var isDone = false;
      var done = function(isSuccess, msg) {
        if (!isDone) {
          if (msg) {
            flog(msg);
          }
          cb(isSuccess);
          isDone = true;
        }
      };
      var rs = fs.createReadStream(src);
      var ws = fs.createWriteStream(dest);
      rs.on('error', function(err) {
        clog("readstream error:"+err)
        done(false, err);
      });
      ws.on('error', function(err) {
        clog("writestream error:"+err)
        done(false, err);
      });
      ws.on('close', function() {
        done(true);
      });

      rs.pipe(ws);
    };

    var copyFiles = function(srcList, destDir, cb) {
      var counter = 0;
      var successFlag = true;
      for (var i = 0; i < srcList.length; ++i) {
        var src = srcList[i];
        var dest = destDir + path.basename(src);
        var msg = i18n.translate('Copying %1s to %2s...').
            fetch(path.basename(src), destDir);
        copyFile(src, dest, function(isSuccess) {
          successFlag = successFlag && isSuccess;
          ++counter;
          if (counter >= srcList.length) {
            cb(successFlag);
          }
        });
      }
    };

    var removeFiles = function(fileList, fileDir, cb) {
      var counter = 0;
      var successFlag = true;
      for (var i = 0; i < fileList.length; ++i) {
        var filepath = fileDir + fileList[i];
        fs.unlink(filepath, function(err) {
          if (err) {
            flog('Skip ' + err);
            // It's ok.
            //successFlag = false;
          }
          ++counter;
          if (counter >= fileList.length) {
            cb(successFlag);
          }
        });
      }
    };

    // Build copy file list.
    var srcList = [];
    var imageList = [];
    for (var i = 0; i < spriteSheets.length; ++i) {
      var sheet = spriteSheets[i];
      if (sheet.meta.modified) {
        srcList.push(spriteSheetsDir + sheet.meta.image);
        for (var j = 0; j < sheet.frames.length; ++j) {
          var publishedIds =
              originalImageFileNameToPublishedIds(sheet.frames[j].filename,
              sheet.meta.image);
          imageList.push(publishedIds.filename);
        }
      }
    }

    if (callback == null) {
      callback = nullcallback;
    }

    // Copy files in the list to imagesDirPath.
    copyFiles(srcList, imagesDirPath, function(res) {
      if (res) {
        if (deleteFlag) {
          // If 'deleteFlag' is on, remove individual image file
          // that is included in a sprite sheet.
          removeFiles(imageList, imagesDirPath, function(flag) {
            callback(flag);
          });
        } else {
          callback(true);
        }
      } else {
        flog('Could not copy sprite sheet images.');
        callback(false);
      }
    });
  };

  var onMissingMessageKey = function(key) {
    clog(key + ' is missing.');
  };

  var getI18N = function(locale) {
    var options = {
      domain: 'messages',
      missing_key_callback: onMissingMessageKey,
      debug: false
    };

    var csInterface = new CSInterface();
    var filepath =
        csInterface.getSystemPath(SystemPath.EXTENSION) +
        '/locales/' + locale + '.json';
    try {
      var localeData = fs.readFileSync(filepath, 'utf8');
      options.locale_data = JSON.parse(localeData);
    } catch (e) {
      flog(e);
      return null;
    }

    var jed = require('jed');
    return new jed(options);
  };
})(extension = extension||{}); // Everything is in the anonymous function.

var extension;