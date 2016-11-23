/*
 * grunt-srpite
 * https://github.com/dukai/grunt-srpite
 *
 * Copyright (c) 2016 Kyle
 * Licensed under the MIT license.
 */

'use strict';


const path = require('path');
const utils = require('./lib/utils');

module.exports = function(grunt) {

  const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/;

  grunt.registerMultiTask('sprite', 'The best Grunt plugin ever.', function() {
    let done = this.async();
    var options = this.options({
      padding: 0
    });

    let map = {};
    let files = this.files;
    const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/;

    let parsedFiles = {};

    /**
     * @param filepath 文件路径
     * @param destpath 发布路径
     * @param contentStack 内容数组
     * @param parseResult 解析结果 [{ patch, sheet, bgSize, orginSize, absPath, absSheet}]
     *
     */
    parsedFiles = this.files.map(function(f) {

      let cwd = f.orig.cwd;
      let dest = f.orig.dest;
      // console.log(cwd);
      // console.log(dest);
      // Concat specified files.
      //console.log(f.src, f.dest);
      let filepath = f.src[0];
      let destpath = f.dest;
      let content = grunt.file.read(filepath);
      let contentStack = utils.getStack(content);
      let parseResult = utils.parseStack(contentStack);

      parseResult.matches.forEach(ele => {
        let patch = path.resolve(cwd, ele.patch);
        let sheet = path.resolve(cwd, ele.sheet);

        ele.absPatch = patch;
        ele.absSheet = sheet;

        if(!map[sheet]){
          map[sheet] = [];
        }
        if(map[sheet].indexOf(patch) < 0){
          map[sheet].push(patch);
        }
      });


      return {filepath, destpath, contentStack, parseResult};

    });

    //console.log(parsedFiles);

    const Spritesmith = require('spritesmith');

    let update = (assets, done) => {

      parsedFiles.map((parsedFile) => {
        //console.log(parsedFile.parseResult);
        parsedFile.parseResult.matches.forEach((match, index) => {
          //{ patch, sheet, bgSize, orginSize, absPath, absSheet}
          let asset = assets[match.absPatch];
          let newWidth, newHeight, newX, newY;

          if(match.bgSize){
            let xPercentage = match.bgSize[0] / asset.width;
            let yPercentage = match.bgSize[1] / asset.height;


            newWidth = asset.sheetSize.width * xPercentage;
            newHeight = asset.sheetSize.height * yPercentage;

            newX = asset.x * xPercentage;
            newY = asset.y * yPercentage;
          }else{
            newX = asset.x;
            newY = asset.y;
          }
          newX = newX === 0 ? newX : -newX;
          newY = newY === 0 ? newY : -newY;
          let bgPosition = "background-position:" + newX + 'px ' + newY + 'px;';
          parsedFile.parseResult.result[index].forEach((ele) => {
            let piece = parsedFile.contentStack[ele];
            if(piece.indexOf(match.patch) >= 0){
              let result = piece.match(/([\t ]*)background/);
              let prefix = result ? result[1] : '';
              //parsedFile.contentStack[ele].replace(match.patch, match.sheet);
              parsedFile.contentStack[ele] = piece.replace(URL_REGEXP, (full, $1, $2) => {
                return full.replace($1, $2) + "\r\n" + prefix + bgPosition + "\r\n";
              })

              //parsedFile.contentStack[ele] += prefix + bgPosition;
            }

            if(/background\-size/.test(piece) && match.bgSize){
              parsedFile.contentStack[ele] = parsedFile.contentStack[ele].replace(/background\-size.+?;/, 'background-size: ' + newWidth + 'px ' + newHeight + 'px;');
            }
          });
        });

        grunt.file.write(parsedFile.destpath, parsedFile.contentStack.join(''));
        grunt.log.writeln('File "' + parsedFile.destpath + '" created.');
      });

      done(true);

    };

    let reference = 0;
    let assets = {};

    for(let key in map){
      reference++;
      // console.log(map[key]);
      Spritesmith.run({src: map[key], padding: options.padding}, (err, result)=> {
        //console.log(result);
        grunt.file.write(key, result.image);
        reference--;
        let obj = {};
        for(let p in result.coordinates){
          obj[p] = result.coordinates[p];
          obj[p].spritesheet = key;
          obj[p].sheetSize = result.properties;
        }

        assets = Object.assign(assets, obj);

        if(reference === 0){
          update(assets, done);
        }
      });
    }

    if(Object.keys(map).length == 0){
      grunt.log.writeln("no sprite to be process");
      update({}, done);
    }

  });

};
