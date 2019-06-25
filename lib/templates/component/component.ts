import { ComponentClass } from '../../../src/utils/midi'

/**
 * 组件模板
 * 注意：请手动修改组件名称，即将类名 CustomComponent 修改为你所需要的组件名称
 */

type Data = {
    name: String,
}

class CustomComponent extends ComponentClass<Data> {
    options: any = {}

    data: Data = {
        name: '',
    }
}

Component(new CustomComponent())
