/*
 * grunt-srpite
 * https://github.com/dukai/grunt-srpite
 *
 * Copyright (c) 2016 Kyle
 * Licensed under the MIT license.
 */

'use strict';


const path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('sprite', 'The best Grunt plugin ever.', function() {
    let done = this.async();
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });


    const URL_REGEXP = /background:.*url\(['"]{0,1}(.+?)['"]{0,1}\);\/\/sprite\(['"]{0,1}(.+?)['"]{0,1}\)/g;
    const OPEN_TAG_RE = /\{/;
    const CLOSE_TAG_RE = /\}/;
    let map = {};
    let assets = {};

    let files = this.files;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      let cwd = f.orig.cwd;
      let dest = f.orig.dest;
      // console.log(cwd);
      // console.log(dest);
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        let content = grunt.file.read(filepath);

        //content.replace(/([^@]\{ *\t*[^\r\n])/g, function () {
        //  console.log(arguments);
        //}).replace(/(\} *?\t*?[^\r\n])/g, function () {
          //console.log(arguments);
        //})

        var stack = [];

        let openclose = null;
        let reg = /\{|\}/g;
        let last = 0;

        while(openclose = reg.exec(content)){
          //console.log(openclose[0],openclose.index, last, stack);
          if(openclose[0] == "{"){
            if(stack.length != 0){
              stack.push(content.substring(last, openclose.index));
            }
            stack.push("{");
            last = openclose.index + 1;
          }

          if(openclose[0] == "}"){
            let temp = [];
            stack.push(content.substring(last, openclose.index));
            while(stack[stack.length - 1] != "{"){
              temp.unshift(stack.pop());
            }

            let sum = temp.join('');
            console.log(sum);
            //stack.push("}");
            last = openclose.index + 1;
          }
          //console.log(openclose[0],openclose.index, last, stack);
        }


        let result = null;

        while((result = URL_REGEXP.exec(content))){

          let piece = path.resolve(cwd, result[1]);
          let total = path.resolve(cwd, result[2]);
          // console.log(piece);
          // console.warn(total);
          grunt.file.write(total, grunt.file.read(piece, {encoding: null}));

          if(!map[total]){
            map[total] = [];
          }


          if(map[total].indexOf(piece) < 0){
            map[total].push(piece);
          }

        }

      });

      // Handle options.
      // src += options.punctuation;

      // Write the destination file.
      // grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });

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
      });

      done(true);

    };

    let reference = 0;

    for(let key in map){
      reference++;
      // console.log(map[key]);
      Spritesmith.run({src: map[key]}, (err, result)=> {
        grunt.file.write(key, result.image);
        reference--;
        let obj = {};
        for(let p in result.coordinates){
          obj[p] = result.coordinates[p];
          obj[p].spritesheet = key;
        }

        assets = Object.assign(assets, obj);

        if(reference === 0){
          update(assets, done);
        }
      });
    }



  });

};
