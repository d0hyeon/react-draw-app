
export interface TypedMessageEvent<Data = any> extends MessageEvent {
  data: Data;
}
export class TypedWorker<Payload, Response> extends Worker {
  postMessage<T = Payload>(payload: T) {
    super.postMessage(payload);
  }
  
  addEventListener<R = Response>(
    type: 'message' | 'error' | 'messageerror',
    observer: (this: Worker, event: TypedMessageEvent<R>) => void,
  ) {
    super.addEventListener(type, observer);
  }
}