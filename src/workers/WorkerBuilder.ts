
interface TypedMessageEvent<Data = any> extends MessageEvent {
  data: Data;
}

export default class WorkerBuilder<Payload, Response> extends Worker {
  static fromModule<Payload = unknown, Response = unknown>(module) {
    const code = module.toString();
    const blob = new Blob([`(${code})()`]);
    
    return new WorkerBuilder<Payload, Response>(URL.createObjectURL(blob));
  }  

  postMessage (payload: Payload) {
    super.postMessage(payload);
  }
  addEventListener (
    type: 'message', 
    observer: (this: Worker, event: TypedMessageEvent<Response>) => void
  ) {
    super.addEventListener(type, observer);
  }
}