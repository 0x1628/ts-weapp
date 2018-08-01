import {enhance, createStore, createAction, createPartialAction, AppComponent} from './utils/midi'

export interface Model {
  count: number
}

export namespace Actions {
  export const addCount = createAction((state: Model) => {
    return {
      ...state,
      count: state.count + 1,
    }
  })

  export const setCount = createAction<number>((state: Model, count: number) => {
    return {
      ...state,
      count,
    }
  })

  export const minusCount = createPartialAction('count', (state: number) => {
    return state - 1
  })

}

const store = createStore({
  count: 0,
}, Actions)


/*  clearCount: function* (state: any) {
    yield {
      ...state,
      count: 0,
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...state,
          count: 3,
        })
      }, 3000)
    })*/



App(enhance(store, new class extends AppComponent<typeof Actions> implements AppOpts {
  onLaunch = () => {
  }
}))