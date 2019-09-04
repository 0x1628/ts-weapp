import {PageClass} from '../../utils/midi'
import request from '../../utils/request'

type Data = {
  name: string,
}

const app = getApp()

class IndexPage extends PageClass<Data> {
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

Page(new IndexPage())
