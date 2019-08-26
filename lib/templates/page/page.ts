import {PageClass} from '../../utils/midi'

type Data = {
  name: string,
}

Page(new class extends PageClass<Data> {
  data: Data = {
    name: '',
  }
  onLoad() {}
}())
