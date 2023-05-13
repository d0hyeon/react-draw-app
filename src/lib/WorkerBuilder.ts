import { nanoid } from "nanoid";
import { ID } from "src/types/common";
import { TypedMessageEvent, TypedWorker } from "./TypedWorker";


export class WorkerBuilder<Payload, Response> {
  static fromModule<Payload, Response>(fn: (data: Payload) => Response) {
    const code = createWorkerGateway(fn).toString();
    const blob = new Blob([`(${code})()`]);

    return new WorkerBuilder<Parameters<typeof fn>[0], ReturnType<typeof fn>>(URL.createObjectURL(blob));
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
    return new Promise((resolve: (response: R) => void) => {
      const id = nanoid();
      const onMessage = ({ data }: TypedMessageEvent<R & { id: ID }>) => {
        if(id === data.id) {
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