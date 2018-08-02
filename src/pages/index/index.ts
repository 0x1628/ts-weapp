import {inject, PageComponent} from '../../utils/midi'
import {Actions, Model} from '../../app';

type Data = {
  count: number
}

Page(inject((state: Model) => {
  return {
    count: state.count,
  }
}, new class extends PageComponent<Data, typeof Actions> {
  onShow() {
    console.log('page', this.data.count)
    this.actions.setCount(20).then(() => {
      console.log('page', this.data.count)
    })
  }
 }))