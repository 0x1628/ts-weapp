import config from './config'

App({
  onLaunch(options: any) {
    // Do something initial when launch.
  },
  onShow(options: any) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg: any) {
    console.error(msg)
  },
  globalData: {
    config,
  },
})
