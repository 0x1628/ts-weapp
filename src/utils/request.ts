import md5 from './md5'

const base = 'REPLACE_YOUR_URL_BASE'

const ekey = 'REPLACE_YOUR_SECRET_KEY'

const dekey = String.fromCharCode
  .apply(undefined, ekey.split('')
  .map(i => i.charCodeAt(0))
  .map((i, index) => i - index))

type ReqOpt = {
    full?: boolean,
}

export default function (options: wx.RequestOption, reqOpt: ReqOpt = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const data: any = options.data

    if (options.method && options.method.toLowerCase() !== 'get' && data) {
      try {
        const app: any = getApp()
        if (app && app.midiState && app.midiState.token && !data.token) {
          data.token = app.midiState.token
        }
      } catch (e) {
        // nothing
      }
      data.rk = `${Date.now()}${Math.floor(Math.random() * 10000)}`
      const str = Object.keys(data).sort().map(k => {
        let value = data[k]
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        return `${k}=${value}`
      }).concat(dekey).join('&')
      data.sk = md5(str)
    }

    let url = options.url
    if (!url.startsWith('http')) {
      url = `${base}${url}`
    }

    wx.request({
      ...options,
      url,
      data,
      success(res) {
        if (res.statusCode >= 300) {
          reject(res)
          return
        }
        let {data: sdata} = res
        // tslint:disable-next-line
        if (typeof sdata === 'string') {
          try {
            sdata = JSON.parse(sdata)
          } catch (e) {
            sdata = {}
          }
        }
        // eslint
        const header = <{[key: string]: any}>{}
        Object.keys(res.header).forEach(key => {
          const value = res.header[key]
          key = key.toLowerCase()
          if (key.startsWith('x')) {
            header[key] = value
          }
        })
        if (reqOpt.full) {
          resolve({data: sdata, header})
        } else {
          resolve(sdata)
        }
      },
      fail(e) {
        reject(e)
      },
    })
  })
}
