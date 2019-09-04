type Data = {
  mockData: string,
}

class #{name}Component {
  properties = {
    mockProperty: {
      type: String,
      value: '',
      observer: (newVal: string, oldVal: string) => {
        console.log({newVal, oldVal})
      },
    },
  }

  data: Data = {
    mockData: '',
  }
}

Component(new #{name}Component())
