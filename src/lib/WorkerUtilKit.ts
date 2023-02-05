import { nanoid } from "nanoid";
import { ID } from "src/types/common";

interface TypedMessageEvent<Data = any> extends MessageEvent {
  data: Data;
}
export class WorkerUtilKit<Payload, Response> {
  static fromModule<Payload, Response>(fn: (data: Payload) => Response) {
    const code = createWorkerGateway(fn).toString();
    const blob = new Blob([`(${code})()`]);

    return new WorkerUtilKit<Parameters<typeof fn>[0], ReturnType<typeof fn>>(URL.createObjectURL(blob));
  }
  
  worker: TypedWorker<Payload, Response>;
  constructor(src: string) {
    this.worker = new TypedWorker(src);
  }

  subscribe<R = Response> (observer: (response: R) => void) {
    const onMessage = (event: TypedMessageEvent<R>) => {
      observer(event.data);
    };
    this.worker.addEventListener('message', onMessage);

    return () => {
      this.worker.removeEventListener('message', onMessage);
    };
  }

  request<P = Payload, R = Response>(payload: P) {
    return new Promise((resolve) => {
      const id = nanoid();
      const onMessage = (message: TypedMessageEvent<R & { id: ID }>) => {
        const { id: _id, ...data } = message.data;
        if(id === _id) {
          resolve(data);

          this.worker.removeEventListener('message', onMessage);
        }
      };
      this.worker.postMessage({ id, payload });
      this.worker.addEventListener('message', onMessage);
    });
  }

  terminate () {
    this.worker.terminate();
  }
}


class TypedWorker<Payload, Response> extends Worker {

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


function createWorkerGateway<Payload, Response>(fn: (payload: Payload) => Response) {
  return () => {
    self.addEventListener('message', event => {
      try {
        const response = fn(event.data);
        
        self.postMessage(response);
      } catch(error) {
        close();
      }
    });
  };
}