"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, Trash2, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AvatarPreview } from "./avatar-preview";
import {
  prepareAvatarUploadAction,
  finalizeAvatarUploadAction,
  removeAvatarAction,
} from "../actions/avatar.actions";
import { processAndCompressAvatar } from "../processing/compress-image";
import { signedUrlCache } from "../utils/signed-url-cache";

export interface AvatarUploaderProps {
  treeId: string;
  personId: string;
  fullName: string;
  avatarPath?: string | null;
  expectedVersion?: number;
  onAvatarUpdated?: (newAvatarPath: string | null) => void;
}

export function AvatarUploader({
  treeId,
  personId,
  fullName,
  avatarPath,
  expectedVersion,
  onAvatarUpdated,
}: AvatarUploaderProps) {
  const [currentPath, setCurrentPath] = useState<string | null>(avatarPath || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // 1. Client-side processing (Nén, xóa EXIF, kiểm tra kích thước)
      const processed = await processAndCompressAvatar(file);
      setIsProcessing(false);
      setIsUploading(true);

      // 2. Prepare upload (Server cấp signed upload URLs)
      const prepareRes = await prepareAvatarUploadAction({
        treeId,
        personId,
        mimeType: "image/webp",
        sizeBytes: processed.sizeBytes,
        originalFilename: file.name,
      });

      if (!prepareRes.success) {
        throw new Error(prepareRes.error.message);
      }

      const { uploadId, mediaId, avatarUploadUrl, thumbnailUploadUrl } = prepareRes.data;

      if (!avatarUploadUrl || !thumbnailUploadUrl) {
        throw new Error("Không nhận được đường dẫn cấp quyền tải ảnh lên.");
      }

      // 3. Upload binary trực tiếp lên Supabase Storage qua PUT
      const [avatarUploadRes, thumbUploadRes] = await Promise.all([
        fetch(avatarUploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: processed.avatarBlob,
        }),
        fetch(thumbnailUploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/webp" },
          body: processed.thumbnailBlob,
        }),
      ]);

      if (!avatarUploadRes.ok || !thumbUploadRes.ok) {
        throw new Error("Tải tệp tin lên máy chủ lưu trữ thất bại.");
      }

      // 4. Finalize metadata và kích hoạt avatar
      const finalizeRes = await finalizeAvatarUploadAction({
        treeId,
        personId,
        uploadId,
        mediaId,
        sizeBytes: processed.sizeBytes,
        width: processed.width,
        height: processed.height,
        originalFilename: file.name,
        expectedVersion,
      });

      if (!finalizeRes.success) {
        throw new Error(finalizeRes.error.message);
      }

      // Invalidate cache cũ
      signedUrlCache.invalidate(personId);

      const newPath = finalizeRes.data.objectPath;
      setCurrentPath(newPath);
      onAvatarUpdated?.(newPath);

      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải ảnh.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa ảnh đại diện này không?")) return;

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await removeAvatarAction({
        treeId,
        personId,
        expectedVersion,
      });

      if (!res.success) {
        throw new Error(res.error.message);
      }

      signedUrlCache.invalidate(personId);
      setCurrentPath(null);
      onAvatarUpdated?.(null);

      toast.success("Đã xóa ảnh đại diện thành công.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi xóa ảnh đại diện.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const isBusy = isProcessing || isUploading || isDeleting;

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Ảnh đại diện</h3>
          <p className="text-xs text-neutral-500">
            Hỗ trợ định dạng JPG, PNG, WebP (tối đa 10 MB, tự động nén và xóa GPS).
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Preview Container */}
        <div className="relative">
          <AvatarPreview
            treeId={treeId}
            personId={personId}
            fullName={fullName}
            avatarPath={currentPath}
            size="xl"
          />
          {isBusy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelected}
              disabled={isBusy}
              className="hidden"
              id={`avatar-file-input-${personId}`}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            >
              {currentPath ? (
                <>
                  <Camera className="h-4 w-4" /> Thay ảnh đại diện
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Tải ảnh lên
                </>
              )}
            </Button>

            {currentPath && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={handleRemoveAvatar}
                className="flex items-center gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" /> Xóa ảnh
              </Button>
            )}
          </div>

          {isProcessing && (
            <p className="flex items-center text-xs font-medium text-amber-600">
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang nén và tối ưu hóa hình ảnh...
            </p>
          )}

          {isUploading && (
            <p className="flex items-center text-xs font-medium text-emerald-600">
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang tải ảnh bảo mật lên đám mây...
            </p>
          )}

          {errorMsg && (
            <p className="flex items-center text-xs font-medium text-rose-600">
              <AlertCircle className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
