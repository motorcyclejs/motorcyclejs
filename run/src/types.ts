export interface Component<Sources, Sinks> {
  (sources: Sources): Sinks;
}

export interface EffectfulComponent<Sinks, Sources> {
  (sinks: Sinks): Sources;
}

export interface RunReturn<Sources, Sinks> {
  sources: Sources;
  sinks: Sinks;
  dispose: Function;
}
