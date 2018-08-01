let app: any
let store: Store<MidiModel, ActionMap>
const STORE_CHANGE_KEY = 'storechange'

function shallowEqual(o1: object, o2: object) {
  const k1 = Object.keys(o1)
  const k2 = Object.keys(o2)

  if (k1.length !== k2.length) {
    return false
  }
  if (k1.sort().join(',') !== k2.sort().join(',')) {
    return false
  }
  return k1.every(k => {
    if ((<any>o1)[k] !== (<any>o2)[k]) {
      return false
    }
    return true
  })
}

function getValueByNamespace(target: any, namespace: string): any {
  const namespaceArr = namespace.split('.')
  let result: any = null
  while(target && namespaceArr.length) {
    const key = <string>namespaceArr.shift()
    target = result = target[key]
  }
  return result
}

function updateValueByNamespace(target: any, namespace: string, value: any): any {
  const namespaceArr = namespace.split('.')
  const result = {...target}
  let current = result
  while(namespaceArr.length > 1) {
    const key = <string>namespaceArr.shift()
    if (current[key]) {
      current[key] = {...result[key]}
    } else {
      current[key] = {}
    }
    current = current[key]
  }
  current[namespaceArr[0]] = value
  return result
}

namespace EventEmitter {
  type Callback = (...args: any[]) => void
  
  const listeners: {[key: string]: Callback[]} = {}

  export function addEventListener(name: string, callback: Callback) {
    if (!listeners[name]) {
      listeners[name] = []
    }
    listeners[name].push(callback)
  }

  export function removeEventListener(name: string, callback: Callback) {
    if (!listeners[name]) return
    listeners[name] = listeners[name].filter(it => it !== callback)
  }

  export function dispatchEvent(name: string, ...rest: any[]) {
    if (!listeners[name]) return
    listeners[name].forEach(it => it(...rest))
  }
}

export type PartialPick<T, K extends keyof T> = Pick<T, K>
type MidiModelValue = any
type MidiModel = {[key: string]: MidiModelValue}

type Action0 = (state: MidiModel | MidiModelValue) => any
type Action1<T1> = (state: MidiModel | MidiModelValue, v: T1) => any
type Action2<T1, T2> = (state: MidiModel | MidiModelValue, v: T1, v2: T2) => any
type Action3<T1, T2, T3> = (state: MidiModel | MidiModelValue, v: T1, v2: T2, v3: T3) => any
type Action4<T1, T2, T3, T4> = (state: MidiModel | MidiModelValue, v: T1, v2: T2, v3: T3, v4: T4) => any
type ActionAny = (state: MidiModel | MidiModelValue, ...args: any[]) => any

type WrappedAction0 = () => Promise<any>
type WrappedAction1<T1> = (v: T1) => Promise<any>
type WrappedAction2<T1, T2> = (v: T1, v2: T2) => Promise<any>
type WrappedAction3<T1, T2, T3> = (v: T1, v2: T2, v3: T3) => Promise<any>
type WrappedAction4<T1, T2, T3, T4> = (v: T1, v2: T2, v3: T3, v4: T4) => Promise<any>
type WrappedActionAny = (...args: any[]) => Promise<any>

type ActionMap = {[key: string]: ActionAny}
type WrappedActionMap = {[key: string]: WrappedActionAny}

interface Store<MidiModel, ActionMap> {
  state: MidiModel,
  actions: ActionMap,
  getState(): MidiModel
  setState(state: MidiModel): void
  dispatch(at: ActionType): Promise<any>
}
export class AppComponent<C extends WrappedActionMap> {
  actions: C = <C>{}
  getState(): MidiModel {
    return {}
  }
}
export class PageComponent<C extends WrappedActionMap, T> {
  actions: C = <C>{}
  data:T = <T>{}
}

interface ActionType {
  namespace: string | null
  action: ActionAny,
  params: any[],
}

function createStore(state: MidiModel, actions: WrappedActionMap): Store<MidiModel, ActionMap> {
  store = {
    state,
    actions,
    getState() {
      return this.state
    },
    setState(state: MidiModel) {
      this.state = state
    },
    dispatch(actionType) {
      let state = this.getState()
      if (actionType.namespace) {
        state = getValueByNamespace(state, actionType.namespace)
      }
      state = actionType.action(state, ...actionType.params)
      if (actionType.namespace) {
        store.setState(updateValueByNamespace(
          this.getState(), actionType.namespace, state))
      } else {
        store.setState(state)
      }
      EventEmitter.dispatchEvent(STORE_CHANGE_KEY)
      return Promise.resolve()
    },
  }
  return store
}

function createAction(action: Action0): WrappedAction0
function createAction<T1>(action: Action1<T1>): WrappedAction1<T1>
function createAction(action: ActionAny): WrappedActionAny {
  return (...args: any[]) => {
    return store.dispatch({
      namespace: null,
      action,
      params: args,
    })
  }
}

function createPartialAction(namespace: string, action: Action0): WrappedAction0
function createPartialAction<T1>(namespace: string, action: Action1<T1>): WrappedAction1<T1> 
function createPartialAction(namespace: string, action: ActionAny): WrappedActionAny {
  return (...args: any[]) => {
    return store.dispatch({
      namespace,
      action,
      params: args,
    })
  }
}

function enhance(store: Store<MidiModel, ActionMap>, app: AppComponent<WrappedActionMap>): AppOpts {
  app.getState = () => store.getState()
  app.actions = store.actions
  return app
}

interface mapStateToData<T extends MidiModel> {
  (state: T, props?: any, cachedData?: any): {[key: string]: any}
}

function inject(mapStateToData: mapStateToData<any>, page: PageComponent<WrappedActionMap, any>): PageOpts {
  return {
    ...page,
    actions: store.actions,
    onLoad(props) {
      this.cachedProps = props || {}
      this.cachedData = this.data || {}
    },
    _onChange() {
      console.log('change')
      this._checkData()
    },
    _checkData() {
      const data = mapStateToData(store.getState(), this.cachedProps, this.cachedData)
      if (!shallowEqual(data, this.cachedData)) {
        console.log(this)
        this.setData(data)
      }
    },
    onShow() {
      EventEmitter.addEventListener(STORE_CHANGE_KEY, this._onChange)
      this._checkData()
      const onShow = (<any>page).onShow
      if (onShow) {
        onShow.call(this)
      }
    },
    onHide() {
      EventEmitter.removeEventListener(STORE_CHANGE_KEY, this._onChange)
    },
    onUnload() {
      EventEmitter.removeEventListener(STORE_CHANGE_KEY, this._onChange)
    },
  }
}

export {enhance, inject, createStore, createAction, createPartialAction}