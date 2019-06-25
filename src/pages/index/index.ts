import { PageClass } from '../../utils/midi'
import request from '../../utils/request'

type Data = {
  name: String,
}

const app = getApp()

Page(new class extends PageClass<Data> {
  data: Data = {
    name: 'fragment0',
  }
  onLoad() {
    // tslint:disable-next-line
    console.log('index page onLoad, app:', app)
    request({
      url: '/test',
    }).then(e => {
      console.log(e)
    })
  }
}())
