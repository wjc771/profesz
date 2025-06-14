
export interface FileDownloadOptions {
  filename: string;
  content: string | Blob;
  type: 'pdf' | 'doc' | 'txt' | 'json';
  actualContentType?: 'text' | 'binary';
}

export interface WebhookPayload {
  [key: string]: any;
}

export interface WebhookResponse {
  success: boolean;
  data?: any;
  files?: Array<{
    filename: string;
    content: string;
    format: string;
  }>;
  avaliacao?: any;
  message?: string;
  error?: string;
}
