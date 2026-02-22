"use client";

import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    return (
        <div className="markdown-editor-wrapper">
            <MDEditor
                value={value}
                onChange={(v) => onChange(v || "")}
                preview="edit"
                height={400}
                style={{
                    backgroundColor: "transparent",
                }}
                textareaProps={{
                    style: {
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        color: "#fafafa",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        lineHeight: "1.6",
                    },
                }}
            />
            <style jsx global>{`
                .markdown-editor-wrapper .w-md-editor {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .markdown-editor-wrapper .w-md-editor-toolbar {
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                }
                .markdown-editor-wrapper .w-md-editor-toolbar button {
                    color: #64748b;
                }
                .markdown-editor-wrapper .w-md-editor-toolbar button:hover {
                    color: #fafafa;
                }
                .markdown-editor-wrapper .w-md-editor-main {
                    background: transparent;
                }
                .markdown-editor-wrapper .w-md-editor-content {
                    background: transparent;
                }
                .markdown-editor-wrapper .w-md-editor-text {
                    background: transparent !important;
                }
                .markdown-editor-wrapper .w-md-editor-text-pre {
                    background: transparent !important;
                    color: #94a3b8;
                }
                .markdown-editor-wrapper .w-md-editor-text-input {
                    background: transparent !important;
                    caret-color: #fafafa;
                }
            `}</style>
        </div>
    );
}
