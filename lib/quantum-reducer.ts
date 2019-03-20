import { useState } from 'react'

export interface IState {
  data: object,
  loading: true,
  error: object,
}

class Reducer {
  constructor(props: any) {
    this.reducer = props.reducer
    this.state = props.initialState
    this.actions = {}
    Object.keys(props.actions).forEach(action => {
      this.actions = {
        ...this.actions,
        [action]: async (options: any) => await props.actions[action](options)(this.dispatch)
      }
    })
  }
  state: IState;
  reducer: any
  actions: any
  setters: Array<any> = []
  mappers: any = {}
  dispatch = (action: any) => {
    const oldState = this.state
    //can check if the current state is going to be like the upcoming state,
    //if so -> dont loop over setters to prevent unnessessary rerender
    this.state = this.reducer(this.state, action)

    this.setters.forEach((setter: any, index: number) => {
      if (this.mappers[index]) {
        const connect = this.mappers[index]
        const mappedOldState = connect(oldState)
        const mappedNewState = connect(this.state)
        if (JSON.stringify(mappedOldState) !== JSON.stringify(mappedNewState)) {
          return setter(this.state)
        } else {
          return
        }
      }
      return setter(this.state)
    })
  }
  addSetter = (setter: any) => {
    this.setters = [...this.setters, setter]
  }
}

interface IReducer {
  [key: string]: Reducer
}

const reducers: IReducer = {}

export default function (
  id: string,
  connect: any = "",
  reducer: any = null,
  initialState: any = null,
  actions: any = {},
  //need type that will be passed to the reducer on dispatch
) {

  const [_, set] = useState({})

  if (!reducers.hasOwnProperty(id)) {
    reducers[id] = new Reducer({ reducer, initialState, actions })
  }

  if (!reducers[id].setters.includes(set)) {
    reducers[id].addSetter(set)

    if (connect !== "" && connect !== null) {
      reducers[id].mappers[reducers[id].setters.length - 1] = connect
    }
  }
  const { state, dispatch, actions: reducerActions } = reducers[id]

  if (connect === false || connect === null) {
    return [null, null, reducerActions]
  }

  if (connect !== "") {
    return [connect(state), dispatch, reducerActions]
  }

  return [state, dispatch, reducerActions]
}