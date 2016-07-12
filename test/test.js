"use strict"
const fs = require('fs');
const path = require('path');
const utils = require('../tasks/lib/utils');

var content = fs.readFileSync([__dirname, 'less', 'a.less'].join(path.sep), {encoding: 'utf8'});

//console.log(content);


let result = utils.getStack(content);
