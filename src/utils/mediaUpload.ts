/**
 * Media & Image Processing Utility for Iconic Awards Africa
 * Converts, optimizes, and prepares uploaded files for persistent storage and lightning-fast rendering.
 */

export interface ProcessedMedia {
  dataUrl: string;
  name: string;
  size: number;
  originalSize: number;
  type: string;
  width?: number;
  height?: number;
  isVideo?: boolean;
  isAudio?: boolean;
}

export interface UploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.85)
  format?: 'image/webp' | 'image/jpeg' | 'image/png' | 'preserve';
  maxSizeBytes?: number; // default 20MB
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.85,
  format: 'image/webp',
  maxSizeBytes: 30 * 1024 * 1024 // 30MB
};

/**
 * Reads a File or Blob and optimizes images using Canvas API.
 * For SVG, video, and audio, preserves data with base64 conversion.
 */
export async function processMediaFile(
  file: File,
  options: UploadOptions = {}
): Promise<ProcessedMedia> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (file.size > (opts.maxSizeBytes || 30 * 1024 * 1024)) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is 30MB.`);
  }

  // Handle Video
  if (file.type.startsWith('video/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: file.type,
          isVideo: true
        });
      };
      reader.onerror = () => reject(new Error('Failed to read video file.'));
      reader.readAsDataURL(file);
    });
  }

  // Handle Audio
  if (file.type.startsWith('audio/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: file.type,
          isAudio: true
        });
      };
      reader.onerror = () => reject(new Error('Failed to read audio file.'));
      reader.readAsDataURL(file);
    });
  }

  // Handle SVG (preserve vector text/code)
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: 'image/svg+xml'
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
    });
  }

  // Handle GIF
  if (file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: 'image/gif'
        });
      };
      reader.onerror = () => reject(new Error('Failed to read GIF file.'));
      reader.readAsDataURL(file);
    });
  }

  // Handle Standard Raster Images (JPEG, PNG, WebP, AVIF, HEIC/converted)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const originalWidth = img.naturalWidth || img.width;
          const originalHeight = img.naturalHeight || img.height;

          let targetWidth = originalWidth;
          let targetHeight = originalHeight;
          const maxWidth = opts.maxWidth || 1600;
          const maxHeight = opts.maxHeight || 1600;

          // Compute aspect-ratio preserved downscaling
          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const widthRatio = maxWidth / targetWidth;
            const heightRatio = maxHeight / targetHeight;
            const scale = Math.min(widthRatio, heightRatio);
            targetWidth = Math.round(targetWidth * scale);
            targetHeight = Math.round(targetHeight * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to raw dataUrl if canvas context failed
            resolve({
              dataUrl: reader.result as string,
              name: file.name,
              size: file.size,
              originalSize: file.size,
              type: file.type,
              width: originalWidth,
              height: originalHeight
            });
            return;
          }

          // High-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Determine export format
          let outputMime = 'image/webp';
          if (opts.format === 'preserve') {
            outputMime = file.type || 'image/jpeg';
          } else if (opts.format) {
            outputMime = opts.format;
          }

          // Test if browser supports WebP canvas export
          let dataUrl = canvas.toDataURL(outputMime, opts.quality || 0.85);
          if (dataUrl.indexOf(outputMime) === -1 && outputMime === 'image/webp') {
            // Fallback to JPEG if WebP not supported in this browser
            outputMime = 'image/jpeg';
            dataUrl = canvas.toDataURL('image/jpeg', opts.quality || 0.85);
          }

          // Calculate estimated byte size from base64
          const stringLength = dataUrl.length - (dataUrl.indexOf(',') + 1);
          const compressedBytes = Math.round(stringLength * 0.75);

          resolve({
            dataUrl,
            name: file.name,
            size: compressedBytes,
            originalSize: file.size,
            type: outputMime,
            width: targetWidth,
            height: targetHeight
          });
        } catch (err: any) {
          // Fallback to raw file dataURL if canvas manipulation encountered an issue
          resolve({
            dataUrl: reader.result as string,
            name: file.name,
            size: file.size,
            originalSize: file.size,
            type: file.type
          });
        }
      };
      img.onerror = () => reject(new Error('Invalid image data. Could not decode file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 1.2 MB or 420 KB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
