"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
class Store {
    constructor() {
        this.value = "";
        this.setters = [];
        this.setValue = (value) => {
            this.value = value;
            this.setters.forEach((setter) => setter(this.value));
        };
        this.addSetter = (setter) => {
            this.setters = [...this.setters, setter];
        };
    }
}
const stores = {};
function default_1(id, initialValue = "", returnValue = true) {
    const [_, set] = react_1.useState("");
    if (!stores.hasOwnProperty(id)) {
        stores[id] = new Store();
        stores[id].setValue(initialValue);
    }
    if (!stores[id].setters.includes(set) && returnValue) {
        stores[id].addSetter(set);
    }
    const { value, setValue } = stores[id];
    if (!returnValue) {
        return [null, setValue];
    }
    return [value, setValue];
}
exports.default = default_1;
