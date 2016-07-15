"use strict"
const fs = require('fs');
const path = require('path');
const utils = require('../tasks/lib/utils');

var content = fs.readFileSync([__dirname, 'less', 'base.less'].join(path.sep), {encoding: 'utf8'});

//console.log(content);


let result = utils.getStack(content);

let obj = utils.parseStack(result);


console.log(obj.result.map(ele => result[ele]));

console.log(obj.result);

console.log(obj.matches);
//console.log(path.resolve([__dirname, 'less'].join(path.sep), '../images'));
