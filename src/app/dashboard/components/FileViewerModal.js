'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '../endpoint/endpoint';

export default function FileViewerModal({ isOpen, onClose, attachment, projectId, fileUrl }) {
  const [zoom, setZoom] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cleanup blob URL when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  useEffect(() => {
    if (!attachment || !isOpen) {
      setBlobUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchFile = async () => {
      try {
        // Use direct file URL if provided (for leave documents), otherwise use project endpoint
        const url = fileUrl || `${API_URL}/projects/${projectId}/attachments/${attachment.id}/download`;
        const response = await fetch(url, {
          credentials: 'include',
        });
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setBlobUrl(blobUrl);
        } else {
          setError(`Failed to load file: ${response.status}`);
        }
      } catch (error) {
        setError('Network error while loading file');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [attachment?.id, isOpen, projectId, fileUrl]);

  if (!isOpen || !attachment) return null;

  // Get file type
  const getFileType = () => {
    if (attachment.file_type && attachment.file_type !== 'Unknown') {
      return attachment.file_type;
    }
    const fileName = attachment.file_name || attachment.name || '';
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  };

  const fileType = getFileType();
  const isImage = fileType.startsWith('image/');
  const isPdf = fileType === 'application/pdf';

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Use direct file URL if provided (for leave documents), otherwise use project endpoint
      const url = fileUrl || `${API_URL}/projects/${projectId}/attachments/${attachment.id}/download`;
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = attachment.file_name || attachment.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const fileName = attachment.file_name || attachment.name || 'File';
  const fileSize = formatFileSize(attachment.file_size || attachment.size);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {/* Left: File Info */}
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-base font-semibold text-gray-900 truncate">{fileName}</h3>
            <p className="text-sm text-gray-500">
              • {fileType}
            </p>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Zoom controls for images */}
            {isImage && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="Zoom Out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h6"/>
                  </svg>
                </button>
                <span className="text-sm text-gray-500 min-w-[2.5rem] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="Zoom In"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 8v6m-3-3h6"/>
                  </svg>
                </button>
              </>
            )}
            
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Download"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center p-8">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-1">Failed to Load</h3>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Download File
                </button>
              </div>
            </div>
          ) : isImage && blobUrl ? (
            <div className="flex items-center justify-center min-h-[50vh] bg-gray-100 p-4">
              <img
                src={blobUrl}
                alt={fileName}
                style={{ transform: `scale(${zoom / 100})`, maxWidth: '100%', maxHeight: '70vh' }}
                className="object-contain transition-transform shadow-lg"
              />
            </div>
          ) : isPdf && blobUrl ? (
            <div className="w-full h-[70vh] bg-gray-100">
              <iframe
                src={blobUrl}
                className="w-full h-full border-0"
                title={fileName}
                style={{ backgroundColor: 'white' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center p-8">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-1">{fileName}</h3>
                <p className="text-gray-500 text-sm mb-4">Preview not available for this file type.</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500">
            {attachment.uploaded_at && (
              <>
                Uploaded on {formatDate(attachment.uploaded_at)} at{' '}
                {new Date(attachment.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {attachment.uploaded_by && ` by ${attachment.uploaded_by}`}
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
