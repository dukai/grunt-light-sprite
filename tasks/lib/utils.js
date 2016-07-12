"use strict"
module.exports = {
  getStack: function (content) {

    const reg = /\{|\}/g;
    const maxIndex = content.length - 1;

    let origin = [];
    let stack = [];
    let result = null;
    let last = 0;

    while(result = reg.exec(content)){
      if(result[0] == "{"){
        if(stack.length != 0){
          stack.push(content.substring(last, result.index));
        }
        origin.push(content.substring(last, result.index));
        stack.push("{");
        origin.push("{");
        last = result.index + 1;
      }

      if(result[0] == "}"){
        let temp = [];
        stack.push(content.substring(last, result.index));
        origin.push(content.substring(last, result.index));
        origin.push("}");

        while(stack[stack.length - 1] != "{"){
          temp.unshift(stack.pop());
        }

        let sum = temp.join('');
        last = result.index + 1;
      }
    }

    origin.push(content.substring(last, maxIndex));
    return origin;
  },

  getBgImage: function (content) {
    let target = {};
    const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/g;

    let result = null;

    while((result = URL_REGEXP.exec(content))){

      let patchPath = result[1];
      let sheetPath = result[2];

      target.patch = piecePath;
      target.sheet = sheetPath;

      let bsResult = content.match(/background\-size\:[ \t]*?([\w\d]+)[ \t]*?([\w\d]*);/);

    }
  }
};