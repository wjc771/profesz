
import { FileDownloadOptions } from "./types";

export class FileDownloader {
  static async downloadFile({ filename, content, type, actualContentType = 'text' }: FileDownloadOptions): Promise<void> {
    let blob: Blob;
    let mimeType: string;
    let finalFilename = filename;

    const mimeTypes = {
      pdf: 'application/pdf',
      doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      json: 'application/json;charset=utf-8',
      txt: 'text/plain;charset=utf-8'
    };

    mimeType = mimeTypes[type] || mimeTypes.txt;
    
    if (!finalFilename.endsWith(`.${type}`)) {
      finalFilename = filename.replace(/\.[^.]+$/, `.${type}`) || `${filename}.${type}`;
    }

    if (content instanceof Blob) {
      blob = content;
    } else if (typeof content === 'string') {
      const bom = type === 'pdf' || type === 'doc' ? '\uFEFF' : '';
      const textContent = bom + content;
      blob = new Blob([textContent], { type: mimeType });
    } else {
      const stringContent = JSON.stringify(content, null, 2);
      blob = new Blob([stringContent], { type: 'application/json;charset=utf-8' });
      finalFilename = filename.replace(/\.[^.]+$/, '.json');
    }

    this.triggerDownload(blob, finalFilename);
  }

  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
