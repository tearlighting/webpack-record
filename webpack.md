# webpack

## 为什么要工程化？

**注:node 环境是读取本地文件,不存在此问题**
`devtime`:

1. 模块细粒度
2. 直接不同模块标准 **CommonJs,ESModule**
3. 使用新语法 **ESNext**

`runtime`:

1. 文件越少越好:请求少
2. 体积小：压缩
3. 越乱越好：不想被篡改逻辑，不想被抄
4. 执行效率高

## 原理

编译结果

```ts
//通过函数环境来避免污染全局变量
;(function (modules) {
  const cachedModules = {}
  //定义一个类似于node环境的require,运行js代码,返回exports
  function __webpack_require(path) {
    if (cachedModules[path]) {
      return cachedModules[path].exports
    }
    const module = (cachedModules[path] = {
      id: path,
      loaded: false,
      exports: {},
    })
    const exports = module.exports
    modules[path].call(exports, module, exports, __webpack_require)
    module.loaded = true
    return module.exports
  }
  __webpack_require.entry = ""
  __webpack_require.cache = cachedModules
  return __webpack_require((__webpack_require.entry = "./src/index.js"))
})({
  //类似于node环境的commonjs导入
  // _temp(module,exports, require,__dirname,__filename)只能说除了__dirname,__filename,都一样
  "./src/a.js": function (module, exports, require) {
    //  const a = 1
    //  console.log(a);
    //  module.exports = {
    // 	a
    //  }
    //但是这样做会让使用的控制台输出都在当前的js里面,
    //这肯定是不行的,我们是想去模块里面,eval相当于新开了一个虚拟环境
    eval(
      `
			const a = 1
			console.log(a);
			module.exports = {
			   a
			} 
			` + "//# sourceURL=webpack:///./src/a.js?"
    )
  },
  "./src/b.js": function (module, exports, require) {
    const b = 2
    exports.b = 2
  },
  "./src/index.js": function (module, exports, require) {
    const a = require("./src/a.js")
    const b = require("./src/b.js")
    console.log(a)
    console.log(b)
  },
})
```

## 编译原理

### 1. 初始化

**加载配置**

类似于 css 计算 `computed style`,会将 cli 参数,webpack.config.js,默认配置进行融合,生成最终配置对象
依托于 `yargs` 库

### 2. 编译

1. 创建 chunk
   what’s chunk?
   根据入口,找所有依赖。每个入口对应一个 chunk

   ```ts
   interface chunk {
     name: "main" //只有一个入口就是main
     id: string //开发环境就是name,生产环境会变成数字
     hash: string //产生chunk assets时,根据所有文件内容生成chunk hash
   }
   ```

2. 构建依赖

```ts
interface IChunkModules {
  //一般是路径,统一转换完整相对路径./src/**/* ./node_modules/**/*
  [moduleId: string]: string //转换后的代码
}
const moduleCache: IChunkModules = {}
function createDepencies(entryPath) {
  //1. 判断是否已经加载过该模块
  if (moduleCache[entryPath]) {
    return
  }
  //2. 没用加载就开始解析
  // 1) 读取内容
  const content = fs.readFileSync(entryPath)
  // 2) AST 抽象语法数分析 这是一棵树
  const astResult = AST(content)
  // 3) 遍历树 获取所有依赖 require,import,记录为完整相对路径
  const dependencies: string[] = loopTree(astResult)
  // 4) 替换依赖函数 require=>__webpack_require
  // 5）保存替换后的代码
  moduleCache[entryPath] = content.replaceAll("require", "__webpack_require") //肯定不能这样写吧
  // 6) 递归dependencies,深度优先
  dependencies.forEach((path) => createDepencies(path))
}
```

3. 产生 chunk assets(资源列表) `bundle`
   根据 chunk 的 modules 生成资源列表。每个项就是对应一个具体文件。也叫 bundle

```ts
{
	[文件名: string]:文件内容
	'./dist/bundle.js':(function (modules){})({
	   './src/a.js':function (module,exports,require){
			//  const a = 1
         //  console.log(a);
			//  module.exports = {
			// 	a
			//  }
			 //但是这样做会让使用的控制台输出都在当前的js里面,
			 //这肯定是不行的,我们是想去模块里面,eval相当于新开了一个虚拟环境
			eval(`
			const a = 1
			console.log(a);
			module.exports = {
			   a
			}
			`+"//# sourceURL=webpack:///./src/a.js?");
		},
})
```

4. 合并 chunk assets(可能有多个 chunk)
   合并 chunk assets,生成总 hash

## 3. 输出 emit

将合并后 chunk assets 通过 fs 模块输出

## loader

本质: 文件内容=>可以别分析(js 内容)

```ts 配置
  module: {
    rules: [
      {
        test: /\.tsx?$/, //路径匹配
        // use: ["ts-loader"],//loader路径配置,其实用的就是node的require
        use: [
          {
            loader: ["ts-loader"],
            options: {
				//配置通过loader-utils取this上读取
			},
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
```

**注:loaders 是倒着执行的,类似于 decorator**

```ts
{
  module: {
    rules: [
      {
        test: /\.js/,
        use: ["./src/loaders/testloader/loader", "./src/loaders/testloader/loader2"],
      },
      {
        test: /test\.js/,
        use: ["./src/loaders/testloader/loader3", "./src/loaders/testloader/loader2"],
      },
    ]
  }
}

// 输出结果
2
3
2
1

// 原理

let fscontent = xxx
const rules = []
///\.js/匹配成功
rules.push(...["./src/loaders/testloader/loader", "./src/loaders/testloader/loader2"])
///test\.js/ 匹配成功
rules.push(...["./src/loaders/testloader/loader3", "./src/loaders/testloader/loader2"])

for (let i = rules.length - 1; i + 1; i--) {
  const loader = require(rules[i])
  //将fs读取内容交给loader
  fscontent = loader(fscontent)
}
return fscontent
```

例 css loader

```ts
//entry.js
require("./style/index.css")
//require本身肯定是不能读取css
//webpack是肯定能读取出来文件内容的,错误发生在抽象AST分析那块
//也就是说只有通过loader,将文件内容=>可以别分析(js内容)就行

// webpack.config.js
//
 {
        test: /\.css/,
        use: ["./src/loaders/cssLoader"],
 }

 //loader
 module.exports = function (sourceCode) {
  const res = `
    const style = document.createElement("style")
    style.innerHTML = \`${sourceCode}\`
    document.head.appendChild(style)
    module.exports = \`${sourceCode}\`
  `
  //   console.log(res)
  return res
}
```

## plugins

与 loaders 不同,plugins 是用于处理 webpack 编译过程中的 hooks

```ts
import { Compilation, Compiler } from "webpack"

class Compiler {
  //创建于初始化阶段
  //编译与输出这些操作是内部创建的Compilation完成
  // watch时,重新编译只是重新创建Compilation
}
//统计bundle大小的plugins
class MyPlugin {
  //创建Compiler之后就会运行apply
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap("MyFilePlugin", (compilation) => {
      const assets = Object.keys(compilation.assets)
      const res = assets
        .map((x) => {
          const size = compilation.assets[x].size()

          return `[${x}]:
    	  size:${size / 1000}kb
    	`
        })
        .join("\n\n")
      compilation.assets[this.filmeName] = {
        source() {
          return res
        },
        size() {
          return Buffer.from(res).byteLength
        },
      }
    })
  }
}
```

## webpack.config

导出可以使用函数,增加可操作性

```ts
module.export = (env) => {
  return {
    entry: {
      main: "./src/index.js",
    },
  }
}
```

## 优化
