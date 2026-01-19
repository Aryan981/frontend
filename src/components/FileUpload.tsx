"use client";

import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            onFileSelect(droppedFile);
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            onFileSelect(selectedFile);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${dragActive
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".pdf,.txt"
                    disabled={isLoading}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-900">
                            {file ? file.name : "Upload your resume"}
                        </p>
                        <p className="text-sm text-slate-500">
                            PDF or Text files (Max 5MB)
                        </p>
                    </div>
                </div>

                {file && !isLoading && (
                    <div className="mt-4 flex items-center justify-center text-green-600 space-x-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Ready to analyze</span>
                    </div>
                )}
            </div>
        </div>
    );
};
