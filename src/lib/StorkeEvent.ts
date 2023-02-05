
export interface StrokeEvent {
  strokeX: number;
  strokeY: number;
  strokeWidth: number;
  strokeHeight: number;
}


export function createStrokeEvent (detail: StrokeEvent) {
  return new CustomEvent<StrokeEvent>('strokeChange', {
    detail
  });
}