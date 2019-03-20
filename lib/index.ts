import quantumState from './quantum-state'

export function useQuantumState(id: string, initialValue: any = "", returnValue: boolean = true) {
  return quantumState(id, initialValue, returnValue)
}