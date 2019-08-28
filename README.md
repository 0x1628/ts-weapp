# TypeScript Wechat MiniApp Boilerplate

基于 TypeScript 的微信小程序模板。

## 目录结构

```
.
├── README.md
├── dist // 小程序目标产物目录
├── lib
│   ├── global.d.ts
│   ├── templates // 模板页面/组件目录
│   ├── wx
│   │   ├── index.d.ts
│   │   ├── lib.wx.api.d.ts
│   │   ├── lib.wx.app.d.ts
│   │   ├── lib.wx.cloud.d.ts
│   │   ├── lib.wx.component.d.ts
│   │   └── lib.wx.page.d.ts
│   └── wx.d.ts
├── package.json
├── postcss.config.js
├── scripts
│   ├── add.js
│   └── cpx.js
├── src
│   ├── 3rd
│   │   └── http.wx
│   │       ├── Http.d.ts
│   │       ├── agent.d.ts
│   │       ├── base.d.ts
│   │       ├── fake.d.ts
│   │       ├── index.d.ts
│   │       ├── index.js
│   │       └── utils.d.ts
│   ├── app.css
│   ├── app.json
│   ├── app.ts
│   ├── components // 自建组件目录
│   ├── config.ts // 配置信息文件
│   ├── pages
│   │   └── index // 示例页面目录
│   │       ├── index.css
│   │       ├── index.json
│   │       ├── index.ts
│   │       └── index.wxml
│   ├── utils
│   │   ├── md5.js
│   │   ├── midi.ts
│   │   └── request.ts
│   └── var.config.css // 全局样式表变量文件
├── tsconfig.json
└── tslint.json
```

## 使用

```
$ git clone https://github.com/fragment0/ts-weapp.git YOUR_PROJECT_NAME

$ cd ./YOUR_PROJECT_NAME

$ npm i

# 按需修改 config.ts 文件中的配置信息、按需修改 scripts/cpx.js 文件中后缀枚举值

$ npm run start
```

使用微信开发者工具打开目录下 dist 文件夹即可预览。

## 规范

- 创建独立页面后，页面顶层样式名应与页面名称一致。

## 辅助命令

辅助命令通过运行 scripts 文件夹下 `.js` 文件执行。

### 根据模板创建 Page 或 Component

```bash
$ npm run add-page PAGE_NAME
$ npm run add-component COMPONENT_NAME
```

通过模板创建 `page` 或 `component`。

## midi

模板内置了 midi 工具，修改和增强了微信内置函数，并借助 TypeScript 在编译期发现问题，并达到更快的开发效果。

### PageClass

将 PageClass 的实例传入 Page 函数可以初始化页面。

实例方法和[注册页面](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html)基本一致。除了 data 需要通过 `getInitialData` 声明。

```javascript
type Data = {
  name: string,
  age: number,
}

Page(new class extends PageClass<Data> {
  getInitialData() {
    return {
      name: 'fragment0'
    }
  }

  onLoad() {
    console.log(this.data.name) // fragment0

    this.setData({
      name: 'fragment0 + 1',
    })

    // type not match
    // will throw compile error
    this.setData({
      name: 123123
    })
  }
}())
```

### ComponentClass

将 ComponentClass 的实例传入 Component 可以实例化自定义组件。

实例方法拍平了 [Component 构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)中 methods，同时需要使用 `getInitialData` 初始化 data，通过 `getPropertiesDefinition` 获取 properties 定义。

```javascript
type Data = {
  name: string,
  color: string,
}

type Properties = {
  show: boolean,
}

Component(new class extends ComponentClass<Data, Properties> {
  getInitialData() {
    return {
      name: 'fragment0'
    }
  }
  getPropertiesDefinition() {
    return {
      show: {
        type: boolean,
        value: false,
        observer(this: ButtonComponent) {
          this.setData({
            color: this.properties.show ? 'light': 'dark',
          })
        }
      }
    }
  }
  attached() {
    this.logSth()
  }

  // logSth 原本应该在 methods 字段里
  logSth() {
    console.log(this.data.name, this.properties.show)
  }
}())
```

### 状态管理

虽然在任何脚本内都可以通过 getApp 获取 app 中定义的函数和数据，但所有数据的变动需要手动检测。
所以 midi 内置了状态管理器，可以方便且简单的创建状态管理器，实现数据的全局管理和自动更新。

主要是通过 app.ts 内的 `enhance` 和 page.ts 内的 `inject` 来实现。

```javascript
// app.ts
export interface Model {
  userInfo: any
  token: string
}
export namespace Actions {
  export const updateUserInfo = createAction((state: Model, userInfo: any) => {
    return {
      ...state,
      userInfo,
    }
  })
  export const updateToken = createPartialAction('token', (originToken, newToken) => {
    return newToken
  })
}
const store = createStore({
  userInfo: null,
  token: '',
}, Actions)
App(enhance(store, new class extends AppComponent<typeof Actions>{

})

// page.ts
Page(inject((state: Model) => {
  return {
    userInfo: state.userInfo,
  }
}, new class extends PageClass {
  onLoad() {
    console.log(userInfo)
  }
}))
```

## CSS

模板内置的 postcss 处理器。你也可以对引入的插件进行修改。
