export interface ChaosToggles {
  simulateDbFailure: boolean;
  simulateRedisFailure: boolean;
  simulateThirdParty500: boolean;
  simulateWorkerCrash: boolean;
}

const chaosState: ChaosToggles = {
  simulateDbFailure: false,
  simulateRedisFailure: false,
  simulateThirdParty500: false,
  simulateWorkerCrash: false,
};

export function setChaosToggle<K extends keyof ChaosToggles>(key: K, value: boolean): void {
  chaosState[key] = value;
}

export function getChaosToggle<K extends keyof ChaosToggles>(key: K): boolean {
  return chaosState[key];
}

export function resetChaosToggles(): void {
  chaosState.simulateDbFailure = false;
  chaosState.simulateRedisFailure = false;
  chaosState.simulateThirdParty500 = false;
  chaosState.simulateWorkerCrash = false;
}
