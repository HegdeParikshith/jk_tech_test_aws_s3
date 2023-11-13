export interface ResponseStatus {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  ResponsePayload?: object;
  buckets?: object[];
  owner?: object;
  bucket?: object;
}
