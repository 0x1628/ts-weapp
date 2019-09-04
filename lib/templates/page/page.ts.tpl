type Data = {
  name: string,
}

class #{name}Page {
  data: Data = {
    name: '',
  }
  onLoad() {}
}

Page(new #{name}Page())
