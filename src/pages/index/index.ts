import {PageClass} from '../../utils/midi'

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
  }
}())
