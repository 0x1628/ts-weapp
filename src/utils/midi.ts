let store: Store
const STORE_CHANGE_KEY = 'storechange'

function isPromise(target: any): boolean {
  return (target && typeof target.then === 'function') || false
}

function shallowEqual(o1: object, o2: object): boolean {
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

function omit<T>(o: T, names: string | string[]): Partial<T> {
  if (typeof names === 'string') {
    names = [names]
  }
  return Object.getOwnPropertyNames(o).reduce((target: any, key) => {
    if (names.indexOf(key) === -1) {
      target[key] = (<any>o)[key]
    }
    return target
  // tslint:disable-next-line
  }, <T>{})
}

function getValueByNamespace(target: any, namespace: string): any {
  const namespaceArr = namespace.split('.')
  let result: any
  while (target && namespaceArr.length) {
    const key = <string>namespaceArr.shift()
    target = result = target[key]
  }
  return result
}

function updateValueByNamespace(target: any, namespace: string, value: any): any {
  const namespaceArr = namespace.split('.')
  const result = {...target}
  let current = result
  while (namespaceArr.length > 1) {
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

  export function addEventListener(name: string, callback: Callback): void {
    if (!listeners[name]) {
      listeners[name] = []
    }
    listeners[name].push(callback)
  }

  export function removeEventListener(name: string, callback: Callback): void {
    if (!listeners[name]) return
    listeners[name] = listeners[name].filter(it => it !== callback)
  }

  export function dispatchEvent(name: string, ...rest: any[]): void {
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

interface Store {
  state: MidiModel,
  actions: ActionMap,
  getState(): MidiModel
  setState(state: MidiModel): void
  dispatch(at: ActionType): Promise<any>
}

// tslint:disable-next-line
interface AppComponent<C extends WrappedActionMap> extends App.AppInstance {}
class AppComponent<C extends WrappedActionMap> {
  // tslint:disable-next-line
  public actions: C = <C>{}
  getState(): MidiModel { return {} }
  getStore(): any { return undefined }
}
interface PageClass<T, C extends WrappedActionMap = {}> extends Page.PageInstance {
  getInitialData?(): Partial<T>
}
class PageClass<T, C extends WrappedActionMap = {}> {
  // tslint:disable-next-line
  public actions: C = <C>{}
  // tslint:disable-next-line
  public data = <T>{}
  constructor() {
    if (this.getInitialData) {
      this.data = <T>this.getInitialData()
    }
    Object.getOwnPropertyNames(this.constructor.prototype).forEach((method: string) => {
      if (['constructor', 'getInitialData'].indexOf(method) !== -1) return

      (<any>this)[method] = this.constructor.prototype[method]
    })
  }
  setData(data: Partial<T>, callback?: () => any): void {
    // nothing
  }
  onUpdate() {
    // nothing
  }
}

type PropertyDefinition = {
  type: any
  value: any,
  observer?(): void
}

interface ComponentClass<T, P = {}> {
  getInitialData?(): Partial<T>
  getPropertiesDefinition?(): Record<keyof P, PropertyDefinition>
  attached?(): void
  ready?(): void
  moved?(): void
  detached?(): void
}
class ComponentClass<T, P = {}> {

  static reserved: string[] = ['attached', 'ready', 'moved', 'detached']
  // tslint:disable-next-line
  public properties = <P>{}
  // tslint:disable-next-line
  public data = <T>{}
  methods: {[key: string]: any} = {}

  constructor() {
    if (this.getInitialData) {
      this.data = <T>this.getInitialData()
    }
    if (this.getPropertiesDefinition) {
      this.properties = this.transformProperties(this.getPropertiesDefinition())
    }
    Object.getOwnPropertyNames(this.constructor.prototype).forEach((method: string) => {
      if (['constructor', 'transformProperties', 'getInitialData',
        'getPropertiesDefinition'].indexOf(method) !== -1) return

      if (ComponentClass.reserved.indexOf(method) !== -1) {
        (<any>this)[method] = this.constructor.prototype[method]
        return
      }

      this.methods[method] = this.constructor.prototype[method]
    })
  }
  setData(data: Partial<T>): void {
    // nothing
  }
  transformProperties(arg: any): P {
    return <P>arg
  }
}

interface ActionType {
  namespace: string | null
  action: ActionAny,
  params: any[],
}

/* tslint:disable:no-invalid-this */
function createStore(initState: MidiModel, actions: WrappedActionMap): Store {
  store = {
    state: initState,
    actions,
    getState() {
      return this.state
    },
    setState(state: MidiModel) {
      this.state = state
    },
    dispatch(actionType: ActionType) {
      let state = this.getState()
      if (actionType.namespace) {
        state = getValueByNamespace(state, actionType.namespace)
      }
      state = actionType.action(state, ...actionType.params)

      const update = () => {
        if (actionType.namespace) {
          store.setState(updateValueByNamespace(
            this.getState(), actionType.namespace, state))
        } else {
          store.setState(state)
        }
        EventEmitter.dispatchEvent(STORE_CHANGE_KEY)
        return Promise.resolve()
      }

      if (isPromise(state)) {
        return state.then((res: any) => {
          state = res
          return update()
        })
      } else {
        return update()
      }
    },
  }
  return store
}
/* tslint:enable */

/* tslint:disable:max-line-length */
function createAction(action: Action0): WrappedAction0
function createAction<T1>(action: Action1<T1>): WrappedAction1<T1>
function createAction<T1, T2>(action: Action2<T1, T2>): WrappedAction2<T1, T2>
function createAction<T1, T2, T3>(action: Action3<T1, T2, T3>): WrappedAction3<T1, T2, T3>
function createAction<T1, T2, T3, T4>(action: Action4<T1, T2, T3, T4>): WrappedAction4<T1, T2, T3, T4>
function createAction(action: ActionAny): WrappedActionAny {
  return (...args: any[]) => {
    return store.dispatch({
      // tslint:disable-next-line
      namespace: null,
      action,
      params: args,
    })
  }
}
/* tslint:enable */

/* tslint:disable:max-line-length */
function createPartialAction(namespace: string, action: Action0): WrappedAction0
function createPartialAction<T1>(namespace: string, action: Action1<T1>): WrappedAction1<T1>
function createPartialAction<T1, T2>(namespace: string, action: Action2<T1, T2>): WrappedAction2<T1, T2>
function createPartialAction<T1, T2, T3>(namespace: string, action: Action3<T1, T2, T3>): WrappedAction3<T1, T2, T3>
function createPartialAction<T1, T2, T3, T4>(namespace: string, action: Action4<T1, T2, T3, T4>): WrappedAction4<T1, T2, T3, T4>
function createPartialAction(namespace: string, action: ActionAny): WrappedActionAny {
  return (...args: any[]) => {
    return store.dispatch({
      namespace,
      action,
      params: args,
    })
  }
}
/* tslint:enable */

function enhance(initStore: Store, app: AppComponent<WrappedActionMap>) {
  app.getState = () => initStore.getState()
  app.getStore = () => initStore
  app.actions = initStore.actions
  return {
    ...omit(app.constructor.prototype, ['constructor', '__proto__']),
    ...app,
  }
}
type MapStateToData<T extends MidiModel> =
  (state: T, props?: any, cachedData?: any) => {[key: string]: any}

/* tslint:disable:no-invalid-this no-unbound-method */
function inject(mapStateToData: MapStateToData<any>, page: PageClass<any, WrappedActionMap>): any {
  return {
    ...page,
    actions: store.actions,
    onLoad(props: any) {
      this.cachedProps = props || {}
      this.cachedData = this.data || {}
      this._checkData()
      const onLoad = page.onLoad
      if (onLoad) {
        onLoad.call(this)
      }
    },
    _onChange() {
      this._checkData()
    },
    _checkData() {
      const data = mapStateToData(store.getState(), this.cachedProps, this.cachedData)
      if (!shallowEqual(data, this.cachedData)) {
        this.setData(data)
        if (page.onUpdate) {
          page.onUpdate()
        }
      }
    },
    onShow() {
      EventEmitter.addEventListener(STORE_CHANGE_KEY, this._onChange)
      const onShow = page.onShow
      if (onShow) {
        onShow.call(this)
      }
    },
    onHide() {
      EventEmitter.removeEventListener(STORE_CHANGE_KEY, this._onChange)
      const onHide = page.onHide
      if (onHide) {
        onHide.call(this)
      }
    },
    onUnload() {
      EventEmitter.removeEventListener(STORE_CHANGE_KEY, this._onChange)
      const onUnload = page.onUnload
      if (onUnload) {
        onUnload.call(this)
      }
    },
  }
}

export {enhance, inject, createStore, createAction, createPartialAction, PageClass, ComponentClass, AppComponent}
