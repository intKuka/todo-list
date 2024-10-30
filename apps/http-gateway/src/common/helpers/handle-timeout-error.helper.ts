import { catchError, Observable, timeout, TimeoutError } from 'rxjs';
import { CustomGatewayTimeoutException } from '../exceptions/custom-gateway-timeout.exception';

export function handleTimeoutError<T = unknown>(timeoutInMs: number) {
  return (source$: Observable<T>) =>
    source$.pipe(
      timeout(timeoutInMs),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          throw new CustomGatewayTimeoutException();
        } else {
          throw error;
        }
      }),
    );
}
