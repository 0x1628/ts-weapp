import {PageClass} from '../../utils/midi'

type Data = {
  name: string,
}

class #{name}Page extends PageClass<Data> {
  data: Data = {
    name: '',
  }
  onLoad() {}
}

Page(new #{name}Page())
