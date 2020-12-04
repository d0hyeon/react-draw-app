export interface Config {
  width: number;
  height: number;
  title: string;
}
  

export type ActionPayload<P> = {
  type: string;
  payload: P
}

export type Reducer<S> = (state: S, payload: ActionPayload<S>) => S;