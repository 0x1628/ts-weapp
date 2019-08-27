import {ComponentClass} from '../../utils/midi'

type Data = {
  name: string,
}

type Properties = {
  nickname: PropertyOption,
}

Component(new class extends ComponentClass<Data, Properties> {
  properties: Properties = {
    nickname: {
      type: String,
      value: '',
    },
  }

  data: Data = {
    name: '',
  }
}())
