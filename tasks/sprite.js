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
const sizeOf = require('image-size');

module.exports = function(grunt) {

  const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/;

  grunt.registerMultiTask('sprite', 'The best Grunt plugin ever.', function() {
    let done = this.async();
    var options = this.options({
    });

    let map = {};
    let assets = {};
    let files = this.files;

    let parsedFiles = {};

    // Iterate over all specified file groups.
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

        if(ele.bgSize){
          let size = sizeOf(patch);
          ele.orginSize = size;
        }

        if(!map[sheet]){
          map[sheet] = [];
        }
        if(map[sheet].indexOf(patch) < 0){
          map[sheet].push(patch);
        }
      });


      /**
       * 文件路径
       * 发布路径
       * 内容数组
       * 解析结果 { patch, sheet, bgSize, orginSize, absPath, absSheet}
       *
       */
      return {filepath, destpath, contentStack, parseResult};

    });

    console.log(parsedFiles);

    const Spritesmith = require('spritesmith');

    let update = (assets, done) => {
      files.forEach((f) => {
        // console.log(f);
        let cwd = f.orig.cwd;
        let dest = f.orig.dest;
        var src = f.src.map((filepath) => {
          let content = grunt.file.read(filepath);

          let result = null;

          return content.replace(URL_REGEXP, function(full, $1, $2){
            //{ x: 197, y: 112, width: 12, height: 12,
              // spritesheet: 'D:\\projects\\grunt-projects\\grunt-sprite\\test\\images\\sec-icos.png' },
              var coor = assets[path.resolve(cwd, $1)];
              return full.replace($1, $2) + "\r\nbackground-position: -" + coor.x + 'px -' + coor.y + 'px;';
          });

        }).join('');

        grunt.file.write(f.dest, src);
        grunt.log.writeln('File "' + f.dest + '" created.');
      });

      done(true);

    };

    let reference = 0;

    for(let key in map){
      reference++;
      // console.log(map[key]);
      Spritesmith.run({src: map[key]}, (err, result)=> {
        console.log(result);
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
