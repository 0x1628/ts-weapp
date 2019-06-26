import config from './config'
import {AppComponent} from './utils/midi'

class MyApp extends AppComponent<any>{

  globalData: any = {
    config,
  }

  onLaunch(options: any) {
    // Do something initial when launch.
  }

  onShow(options: any) {
    // Do something when show.
  }

  onHide() {
    // Do something when hide.
  }

  onError(msg: any) {
    console.error(msg)
  }
}

App(new MyApp())
