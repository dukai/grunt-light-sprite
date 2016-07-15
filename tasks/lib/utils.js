"use strict"
module.exports = {
  getStack (content) {
    const reg = /\{|\}/g;
    const maxIndex = content.length - 1;

    let origin = [];
    let stack = [];
    let result = null;
    let last = 0;

    while(result = reg.exec(content)){
      if(result[0] == "{"){
        origin.push(content.substring(last, result.index));
        origin.push("{");
        last = result.index + 1;
      }

      if(result[0] == "}"){
        origin.push(content.substring(last, result.index));
        origin.push("}");
        last = result.index + 1;
      }
    }

    if(last < maxIndex){
      origin.push(content.substring(last, maxIndex));
    }

    console.log(origin);
    return origin;
  },

  /**
   * 解析生成的栈
   * @param {Array} stack
   */
  parseStack(stack){

    let tmp = []

    let result = [];
    let matches = [];
    //let resultIndexes = [];

    stack.forEach((ele, index) => {
      if(ele == "{"){
        tmp.push(index);
      }else if (ele == "}"){
        let tt = [];
        while(stack[tmp[tmp.length - 1]] !== "{" && tmp.length > 0){
          tt.unshift(tmp.pop());
        }
        let letBucket = tmp.pop();

        if(stack[letBucket] !== "{"){
          throw "Unmatched {}";
        }
        let ttString = tt.map(current => stack[current]);
        let r = this.getBgImage(ttString.join(''));

        if( r ){
          result.push(tt);
          matches.push(r);
        }

      }else {
        tmp.push(index);
      }

    });


    return {result, matches};

  },

  /**
   * 获取背景图片以及背景图片尺寸
   * @param content
     */
  getBgImage (content) {
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
          if(bsResult[1] !== 'cover' && bsResult[1] !== 'contain' && bsResult !== 'auto'){
            target.bgSize = [parseInt(bsResult[1])];
          }
        }else{
          let x = bsResult[1];
          let y = bsResult[2];
          if(x !== 'auto' || y !== 'auto'){
            if(x == 'auto'){
              x = y;
            }

            if(y == 'auto'){
              y = x;
            }
            target.bgSize = [parseInt(x), parseInt(y)];
          }
        }
      }

      return target;
    }

    return false;
  }
};