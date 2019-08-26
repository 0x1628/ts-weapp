import {ComponentClass} from '../..//utils/midi'

type Data = {
  name: String,
}

Component(new class extends ComponentClass<Data> {
  properties: any = {}

  data: Data = {
    name: '',
  }

  methods: {}
}())
