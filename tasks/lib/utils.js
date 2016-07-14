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

  /**
   * 解析生成的栈
   * @param {Array} stack
   */
  parseStack(stack){

    let tmp = []

    let result = [];

    stack.forEach((ele, index) => {
      if(ele == "{"){
        tmp.push(index);
      }else if (ele == "}"){
        let tt = [];
        while(stack[tmp[tmp.length - 1]] !== "{"){
          tt.unshift(tmp.pop());
        }
        tmp.pop();

        let ttString = tt.map(current => stack[current]);
        let r = this.getBgImage(ttString.join(''));

        if( r ){
          result.push(tt);
        }

      }else {
        tmp.push(index);
      }

    });


    return result;

  },

  /**
   * 获取背景图片以及背景图片尺寸
   * @param content
     */
  getBgImage: function (content) {
    let target = {};
    const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/;

    let result = null;
    let bsResult = null;


    result = content.match(URL_REGEXP);

    if(result){
      let patchPath = result[1];
      let sheetPath = result[2];

      target.patch = patchPath;
      target.sheet = sheetPath;

      bsResult = content.match(/background\-size\:[ \t]*?([\w\d]+)[ \t]*?([\w\d]*);/);
      if(bsResult){
        if(bsResult.length == 2){
          target.bgSize = [bsResult[1]];
        }else{
          target.bgSize = [bsResult[1], bsResult[2]];
        }
      }

      return target;
    }

    return false;
  }
};