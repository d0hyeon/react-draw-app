export interface Config {
  width: number;
  height: number;
  title: string;
}

export type ActionPayload<P> = {
  type: string;
  payload: P;
};

export type Reducer<S> = (state: S, payload: ActionPayload<S>) => S;

export interface StrokeEvent {
  strokeY: number;
  strokeX: number;
  strokeWidth: number;
  strokeHeight: number;
}

/************
 * @TODO StrokeEvent
 * [[x,y], [x,y], [x,y], [x,y]]
 * or
 * [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
 */
