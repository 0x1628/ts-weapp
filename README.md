# TypeScript Wechat MiniApp Boilerplate

基于 TypeScript 的微信小程序模板。

## 使用

```
git clone https://github.com/fragment0/ts-weapp.git YOUR_PROJECT_NAME
npm run dev
```

使用微信开发者工具打开目录下 dist 文件夹即可预览。

## 辅助命令

辅助命令通过运行 scripts 文件夹下 `.js` 文件执行。

### page

```
node scripts/page.js YOUR_PAGE_NAME
```

通过模板创建 page。注意不会修改 app.json，需要手动添加。

### component

```
node scripts/component.js YOUR_COMPONENT_NAME
```

通过模板创建 component。

## midi

模板内置了 midi 工具，修改和增强了微信内置函数，并借助 TypeScript 在编译期发现问题，并达到更快的开发效果。

### PageClass

将 PageClass 的实例传入 Page 函数可以初始化页面。

实例方法和[注册页面](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html)基本一致。除了 data 需要通过 `getInitialData` 声明。

```javascript
type Data = {
  name: string
  age: number
}

class IndexPage extends PageClass<Data> {
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
}

Page(new IndexPage)
```

### ComponentClass

将 ComponentClass 的实例传入 Component 可以实例化自定义组件。

实例方法拍平了 [Component 构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)中 methods，同时需要使用 `getInitialData` 初始化 data，通过 `getPropertiesDefinition` 获取 properties 定义。

```javascript
type Data = {
  name: string
  color: string
}

type Properties = {
  show: boolean
}

class ButtonComponent extends ComponentClass<Data, Properties> {
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
}
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