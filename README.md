# grunt-srpite

> 用于处理css中的小图片，生成精灵图片。  
目前现有的工具做的都较为强大，但是配置和使用都比较复杂，不够易用灵活。  
本插件旨在最小配置的情况下，实现较为灵活的应用。本插件要求需要添加到精灵图片的小图片必须以

````css
background:url(your-image-path.png);//sprite(your-new-image-path.png)
````

的形式出现，插件会自动匹配以此模式出现的背景图片，生成以`sprite(your-new-image-path.png)`括号中的新路径为文件名的图片。不同的小图片可以添加至相同文件名的精灵图片中。

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install https://github.com/dukai/grunt-sprite.git --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-srpite');
```

## The "srpite" task

### Overview
In your project's Gruntfile, add a section named `srpite` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sprite: {
    default_options: {
      files: [
        {
          expand: true,     
          cwd: 'test/less/',  //less or css file to be processed dir
          src: ['*.less'], 
          dest: 'test/less-dest/', //dest dir
          ext: '.less',  
          extDot: 'first' 
        }
      ]
    }
  },
});
```

### Options

采用默认最小配置，目前仅支持png图片，二叉树方式布局



### Usage Examples

#### a.less 处理前

````less
.img{
  .rect(165px, 106px);
  background: url(../images/show-shield.png);//sprite(../images/sec-icos.png)
  margin: 80px auto 10px;
}
.ico-check{
  .rect(22px);
  background:url(../images/ico-check.png);//sprite(../images/pay-icos.png)
  .mr(4px);
}
.ico-alert{
  .rect(22px);
  background:url(../images/ico-alert.png);//sprite(../images/pay-icos.png)
  .mr(4px);
}
.ico-sec-shield{
  .rect(32px);
  background:url(../images/ico-sec-shield.png);//sprite(../images/mem-icos.png)
}	
.ico-mem-arrow{
  .rect(12px);
}

.ico-check{
  .rect(22px);
  background:url(../images/ico-check.png);//sprite(../images/pay-icos.png)
  .mr(4px);
}
.ico-mem-arrow{
  background: url(../images/ico-member-arrow-white.png);//sprite(../images/mem-icos.png)
}
````

#### a.less 处理后

````less
.img{
  .rect(165px, 106px);
  background: url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
  background-position: -0px -0px;
  margin: 80px auto 10px;
}
.ico-check{
  .rect(22px);
  background:url(../images/pay-icos.png);//sprite(../images/pay-icos.png)
  background-position: -0px -0px;
  .mr(4px);
}
.ico-alert{
  .rect(22px);
  background:url(../images/pay-icos.png);//sprite(../images/pay-icos.png)
  background-position: -22px -0px;
  .mr(4px);
}
.ico-sec-shield{
  .rect(32px);
  background:url(../images/mem-icos.png);//sprite(../images/mem-icos.png)
  background-position: -165px -112px;
}	
.ico-mem-arrow{
  .rect(12px);
}

.ico-check{
  .rect(22px);
  background:url(../images/pay-icos.png);//sprite(../images/pay-icos.png)
  background-position: -0px -0px;
  .mr(4px);
}
.ico-mem-arrow{
  background: url(../images/mem-icos.png);//sprite(../images/mem-icos.png)
  background-position: -32px -12px;
}

````

#### b.less 处理前

````less
.ico-sec-shield{
  .rect(32px);
  background:url(../images/ico-sec-shield.png);//sprite(../images/sec-icos.png)
  .abs;
  left: -40px;
  top: 6px;
}

.ico-sec-check{
  .rect(56px);
  background:url(../images/ico-sec-check-disable.png);//sprite(../images/sec-icos.png)
}

.ico-check{
  .rect(22px);
  background:url(../images/ico-check.png);//sprite(../images/pay-icos.png)
  .mr(4px);
}
.img{
  .rect(165px, 106px);
  background: url(../images/show-shield.png);//sprite(../images/sec-icos.png)
  margin: 80px auto 10px;
}
.ico-step{
  background: url(../images/ico-sec-cicle-disable.png);//sprite(../images/sec-icos.png)
  .rect(56px);
  line-height: 56px;
  text-align: center;


  &.active{
    background: url(../images/ico-sec-circle.png);//sprite(../images/sec-icos.png)
    span,strong{
      color: #00c4b4;
    }
  }

  &.checked{
    background: url(../images/ico-sec-check.png);//sprite(../images/sec-icos.png)
    span,strong{
      color: #00c4b4;
    }
    span{
      text-indent: -999em;
    }
  }

  span{
    .d-b;
    .fc(24px, #fff);
  }

  strong{
    .d-b;
    .fc(18px, #000);
    width: 100px;
    .abs;
    left: 50%;
    .ml(-50px);
  }
}

````

#### b.less 处理后

````less
.ico-sec-shield{
  .rect(32px);
  background:url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
  background-position: -165px -112px;
  .abs;
  left: -40px;
  top: 6px;
}

.ico-sec-check{
  .rect(56px);
  background:url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
  background-position: -0px -106px;
}

.ico-check{
  .rect(22px);
  background:url(../images/pay-icos.png);//sprite(../images/pay-icos.png)
  background-position: -0px -0px;
  .mr(4px);
}
.img{
  .rect(165px, 106px);
  background: url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
  background-position: -0px -0px;
  margin: 80px auto 10px;
}
.ico-step{
  background: url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
  background-position: -56px -106px;
  .rect(56px);
  line-height: 56px;
  text-align: center;


  &.active{
    background: url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
    background-position: -165px -0px;
    span,strong{
      color: #00c4b4;
    }
  }

  &.checked{
    background: url(../images/sec-icos.png);//sprite(../images/sec-icos.png)
    background-position: -165px -56px;
    span,strong{
      color: #00c4b4;
    }
    span{
      text-indent: -999em;
    }
  }

  span{
    .d-b;
    .fc(24px, #fff);
  }

  strong{
    .d-b;
    .fc(18px, #000);
    width: 100px;
    .abs;
    left: 50%;
    .ml(-50px);
  }
}
````

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
