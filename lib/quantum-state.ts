import { useState } from "react";

class Store {
  value: any = ""
  setters: Array<any> = []
  setValue = (value: any) => {
    this.value = value
    this.setters.forEach((setter: any) => setter(this.value))
  }
  addSetter = (setter: any) => {
    this.setters = [...this.setters, setter]
  }
}

const stores: any = {}

export default function (id: string, initialValue: any = "", returnValue: boolean = true) {
  const [_, set] = useState("")

  if (!stores.hasOwnProperty(id)) {
    stores[id] = new Store()
    stores[id].setValue(initialValue)
  }

  if (!stores[id].setters.includes(set) && returnValue) {
    stores[id].addSetter(set)
  }

  const { value, setValue } = stores[id]

  if (!returnValue) {
    return [null, setValue]
  }

  return [value, setValue]
}