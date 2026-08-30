import { logger } from "./logger";
import { errorTracker } from "./error-tracker";

export type UploadStage =
  "validation" | "prepare" | "transfer" | "finalize" | "cleanup" | "signed_url_refresh";

/**
 * Ghi nhận lỗi trong pipeline tải lên media theo từng giai đoạn (P25-T09)
 * Tuyệt đối không log dữ liệu ảnh nhị phân, Base64 hoặc Signed URLs.
 */
export function recordUploadFailure(options: {
  stage: UploadStage;
  errorCode: string;
  message: string;
  requestId?: string;
  fileSizeBytes?: number;
  mimeCategory?: string;
  error?: unknown;
}): void {
  const { stage, errorCode, message, requestId, fileSizeBytes, mimeCategory, error } = options;

  const metadata = {
    stage,
    mimeCategory: mimeCategory || "unknown",
    sizeBucket: fileSizeBytes ? `${Math.round(fileSizeBytes / 1024)}KB` : undefined,
  };

  if (stage === "finalize" || stage === "prepare") {
    logger.error({
      event: `upload.${stage}_failed`,
      message: `Upload error in stage [${stage}]: ${message}`,
      requestId,
      errorCode,
      error,
      metadata,
    });

    if (error) {
      errorTracker.captureException(error, {
        requestId,
        tags: { uploadStage: stage, errorCode },
        metadata,
      });
    }
  } else {
    logger.warn({
      event: `upload.${stage}_failed`,
      message: `Upload rejected in stage [${stage}]: ${message}`,
      requestId,
      errorCode,
      metadata,
    });
  }
}
