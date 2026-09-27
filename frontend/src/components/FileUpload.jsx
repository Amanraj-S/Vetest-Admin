import React, { useState, useRef } from 'react';
import { mediaService } from '../services/mediaService';
import { useToast } from '../contexts/ToastContext';
import { Upload, Loader2, X, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

const FileUpload = ({
  value,
  onChange,
  accept = 'image/*',
  label = 'Upload Image or File'
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.originalname);

      const res = await mediaService.uploadMedia(formData);
      if (res.success && res.data) {
        const uploadedUrl = res.data.url;
        onChange(uploadedUrl);
        toast.success(`File "${file.originalname}" uploaded successfully!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isImage = value && (value.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || (value.includes('http') && !value.endsWith('.pdf')));
  const isPdf = value && (value.toLowerCase().endsWith('.pdf') || value.toLowerCase().includes('.pdf'));

  return (
    <div className="space-y-2">
      {label && <label className="block text-slate-700 font-bold text-xs mb-1">{label}</label>}

      {/* File Upload Controls & Preview */}
      <div className="space-y-3">
        {value ? (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {isImage ? (
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                  <img src={value} alt="Uploaded asset" className="w-full h-full object-contain" />
                </div>
              ) : isPdf ? (
                <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-red-600 font-bold text-xs">
                  <FileText className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate font-mono">{value}</p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 mt-0.5"
                >
                  <ExternalLink className="w-3 h-3" /> View File in New Tab
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                Uploading File...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                {value ? 'Replace File' : 'Choose & Upload File'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
