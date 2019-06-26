/**
 * 模板页面逻辑文件
 * 注意：请手动修改组件名称，即将类名 CustomComponent 修改为你所需要的组件名称；请手动添加页面路径到 app.json 中；
 */

import { PageClass } from '../../utils/midi'

type Data = {
  name: String,
}

class CustomPage extends PageClass<Data> {
  data: Data = {
    name: '',
  }
  onLoad() {
      // Do something
  }
}

Page(new CustomPage())
