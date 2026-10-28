import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, FileText, X, AlertCircle, Camera, Loader2, ExternalLink } from 'lucide-react';
import api from '../../api/axiosClient';

interface FileUploadCardProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  icon?: string | React.ReactNode;
  subtitle?: string;
  required?: boolean;
  isCamera?: boolean;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  label,
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  icon,
  subtitle,
  required = false,
  isCamera = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setFileName(file.name);

    // Create immediate local object URL for preview
    if (file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }

    // Upload file via FormData to /api/upload/single
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res: any = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = res.data?.url || res.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err: any) {
      console.error('File upload failed:', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setFileName(null);
    setUploadError(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPdf = fileName?.endsWith('.pdf') || (value && value.endsWith('.pdf'));

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        {subtitle && <span className="text-[10px] text-slate-500 font-medium">{subtitle}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        capture={isCamera ? 'user' : undefined}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone / Preview Card */}
      {previewUrl || (value && !uploadError) ? (
        <div className="relative p-2.5 rounded-xl border border-cloudy-200 dark:border-slate-800 bg-cloudy-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {isPdf ? (
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            ) : (
              <img
                src={previewUrl || value}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-cloudy-200 dark:border-slate-700 shrink-0 bg-white"
              />
            )}

            <div className="overflow-hidden">
              <span className="font-bold text-slate-900 dark:text-white truncate block text-xs">
                {fileName || 'Uploaded Document'}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isUploading ? 'Uploading to server...' : 'Uploaded & Ready'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="View full file"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-cloudy-100 font-bold text-[10px] transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
              title="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl border-2 border-dashed border-cloudy-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-900 cursor-pointer transition-all flex items-center justify-center gap-2.5 text-center group"
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading image...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-0.5">
              <div className="w-6 h-6 rounded-md bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                {isCamera ? <Camera className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                {isCamera ? 'Take Live Photo or Upload' : 'Upload Image File'}
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">(JPG, PNG, PDF)</span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
