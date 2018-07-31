import {PageClass} from '../../utils/midi'

type Data = {
  name: String,
}

Page(new class extends PageClass<Data> {
  data = {
    name: 'fragment0',
  }
  onLoad() {
    console.log('Onload')
  }
})