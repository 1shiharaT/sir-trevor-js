"use strict";

/*
 Heading Block
 */

var Block = require('../block');
var stToHTML = require('../to-html');

var template = _.template([
  '<<%= getElementType() %> class="st-required st-text-block st-text-block--heading" contenteditable="true"></<%= getElementType() %>> <select class="st-block--heading-type" name="element"><%= elementSelectRender() %></select>'
].join("\n"));


module.exports = Block.extend({


  type: 'Heading',

  title: function () {
    return i18n.t('blocks:heading:title');
  },

  getElementType: function(){
    if ( typeof this.blockStorage.data.element === 'undefined' ){
      return 'h2';
    }
    return  this.blockStorage.data.element;
  },
  elementSelectRender: function(){
    var html = '';
    var data = this.blockStorage.data.element || 'h2';
    _.each(this.elementType,function(element,key){
      if ( data === key ){
        html += '<option value="' + key +  '" selected>' +element+  '';
      } else {
        html += '<option value="' + key +  '">' +element+  '';
      }

    });

    return html;
  },

  elementType : {
    h1 : 'h1',
    h2 : 'h2',
    h3 : 'h3',
    h4 : 'h4',
    h5 : 'h5',
    h6 : 'h6',

  },

  editorHTML: function(){
    return template(this);
  },

  scribeOptions: {
    allowBlockElements: false,
    tags: {
      p: false
    }
  },

  icon_name: 'heading',

  loadData: function (data) {
    if (this.options.convertFromMarkdown && data.format !== "html") {
      this.setTextBlockHTML(stToHTML(data.text, this.type));
    } else {
      this.setTextBlockHTML(data.text);
    }
  }
});
