import {PageClass} from '../../utils/midi'
import request from '../../utils/request'

type Data = {
  name: String,
}

Page(new class extends PageClass<Data> {
  data: Data = {
    name: 'fragment0',
  }
  onLoad() {
    // tslint:disable-next-line
    console.log('Onload')
    request({
      url: '/test',
    }).then(e => {
      console.log(e)
    })
  }
}())
