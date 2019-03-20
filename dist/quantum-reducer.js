"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
class Reducer {
    constructor(props) {
        this.setters = [];
        this.mappers = {};
        this.dispatch = (action) => {
            const oldState = this.state;
            //can check if the current state is going to be like the upcoming state,
            //if so -> dont loop over setters to prevent unnessessary rerender
            this.state = this.reducer(this.state, action);
            this.setters.forEach((setter, index) => {
                if (this.mappers[index]) {
                    const connect = this.mappers[index];
                    const mappedOldState = connect(oldState);
                    const mappedNewState = connect(this.state);
                    if (JSON.stringify(mappedOldState) !== JSON.stringify(mappedNewState)) {
                        return setter(this.state);
                    }
                    else {
                        return;
                    }
                }
                return setter(this.state);
            });
        };
        this.addSetter = (setter) => {
            this.setters = [...this.setters, setter];
        };
        this.reducer = props.reducer;
        this.state = props.initialState;
        this.actions = {};
        Object.keys(props.actions).forEach(action => {
            this.actions = Object.assign({}, this.actions, { [action]: (options) => __awaiter(this, void 0, void 0, function* () { return yield props.actions[action](options)(this.dispatch); }) });
        });
    }
}
const reducers = {};
function default_1(id, connect = "", reducer = null, initialState = null, actions = {}) {
    const [_, set] = react_1.useState({});
    if (!reducers.hasOwnProperty(id)) {
        reducers[id] = new Reducer({ reducer, initialState, actions });
    }
    if (!reducers[id].setters.includes(set)) {
        reducers[id].addSetter(set);
        if (connect !== "" && connect !== null) {
            reducers[id].mappers[reducers[id].setters.length - 1] = connect;
        }
    }
    const { state, dispatch, actions: reducerActions } = reducers[id];
    if (connect === false || connect === null) {
        return [null, null, reducerActions];
    }
    if (connect !== "") {
        return [connect(state), dispatch, reducerActions];
    }
    return [state, dispatch, reducerActions];
}
exports.default = default_1;
