export interface RpcExceptionMessage {
  status: number;
  message: string | object;
  details?: string | object;
}
