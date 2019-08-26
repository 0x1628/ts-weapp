import {ComponentClass} from '../..//utils/midi'

type Data = {
  name: string,
}

Component(new class extends ComponentClass<Data> {
  options: any = {}

  data: Data = {
    name: '',
  }
}())
