export type Component<Sources, Sinks> = (sources: Sources) => Sinks

export type EffectfulComponent<Sinks, Sources> = (sinks: Sinks) => Sources

export interface RunReturn<Sources, Sinks> {
  readonly sources: Sources
  readonly sinks: Sinks
  readonly dispose: Function
}
