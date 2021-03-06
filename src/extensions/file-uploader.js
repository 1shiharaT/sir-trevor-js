"use strict";

/*
*   Sir Trevor Uploader
*   Generic Upload implementation that can be extended for blocks
*/

var _ = require('../underscore');
var $ = require('jquery');
var config = require('../config');
var utils = require('../utils');

var EventBus = require('../event-bus');

module.exports = function(block, file, success, error) {

  EventBus.trigger('onUploadStart');

  var uid  = [block.blockID, (new Date()).getTime(), 'raw'].join('-');
  var data = new FormData();

  data.append('attachment[name]', file.name);
  data.append('attachment[file]', file);
  data.append('attachment[uid]', uid);

  block.resetMessages();

  var callbackSuccess = function(data) {
    utils.log('Upload callback called');
    EventBus.trigger('onUploadStop', data);

    if (!_.isUndefined(success) && _.isFunction(success)) {
      success.apply(block, arguments, data);
    }
  };

  var callbackError = function(jqXHR, status, errorThrown) {
    utils.log('Upload callback error called');
    EventBus.trigger('onUploadStop', undefined, errorThrown, status, jqXHR);

    if (!_.isUndefined(error) && _.isFunction(error)) {
      error.call(block, status);
    }
  };


  var url = block.uploadUrl || config.defaults.uploadUrl;

  var xhr = $.ajax({
    url: url,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    type: 'POST'
  });

  block.addQueuedItem(uid, xhr);

  xhr.done(callbackSuccess)
     .fail(callbackError)
     .always(block.removeQueuedItem.bind(block, uid));

  return xhr;
};
