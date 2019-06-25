/**
 * 模板页面逻辑文件
 * 注意：请手动修改组件名称，即将类名 CustomComponent 修改为你所需要的组件名称；请手动添加页面路径到 app.json 中；
 */

import {PageClass} from '../../utils/midi'
import request from '../../utils/request'

type Data = {
  name: String,
}

const app = getApp()

class Index extends PageClass<Data> {
  data: Data = {
    name: 'fragment0',
  }
  onLoad() {
    // tslint:disable-next-line
    console.log("index page onLoad, app:", app);
    request({
      url: '/test',
    }).then(e => {
      // tslint:disable-next-line: no-console
      console.log('request success', e)
    }).catch(e => {
      console.error('request error', e)
    })
  }
}

Page(new Index())
