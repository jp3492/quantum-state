"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quantum_state_1 = require("./quantum-state");
function useQuantumState(id, initialValue = "", returnValue = true) {
    return quantum_state_1.default(id, initialValue, returnValue);
}
exports.useQuantumState = useQuantumState;
