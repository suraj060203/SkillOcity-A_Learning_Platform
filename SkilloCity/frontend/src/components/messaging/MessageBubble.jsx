import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/formatters';

const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            const url = part.startsWith("http") ? part : `https://${part}`;
            return (
                <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline break-words"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function MessageBubble({ message, isSent, senderName }) {
    const isFile = message.type === 'file' && message.fileUrl;
    const isImage = isFile && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(message.fileName || message.fileUrl);

    return (
        <div className={`flex gap-2 mb-3 ${isSent ? 'flex-row-reverse' : ''}`}>
            {!isSent && <Avatar name={senderName} size={32} className="mt-1" />}
            <div className={`max-w-[70%] ${isSent ? 'items-end' : ''}`}>
                {message.urgency && (
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-danger bg-red-50 px-2 py-0.5 rounded-full">🔴 Urgent</span>
                    </div>
                )}

                {isFile ? (
                    // ─── File Attachment Bubble ───
                    <div
                        className={`rounded-2xl overflow-hidden ${isSent
                            ? 'bg-primary/10 border border-primary/20 rounded-br-md'
                            : 'bg-gray-100 border border-border/40 rounded-bl-md'
                        }`}
                    >
                        {isImage ? (
                            // Image preview
                            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                    src={message.fileUrl}
                                    alt={message.fileName || 'Image'}
                                    className="max-w-full max-h-60 object-cover rounded-t-2xl"
                                    loading="lazy"
                                />
                            </a>
                        ) : (
                            // Generic file card
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSent ? 'bg-primary/20' : 'bg-gray-200'}`}>
                                    <FileText size={20} className={isSent ? 'text-primary' : 'text-text'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text truncate">{message.fileName || 'File'}</p>
                                    <p className="text-xs text-muted">Attachment</p>
                                </div>
                                <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className={`p-2 rounded-lg transition-colors ${isSent ? 'hover:bg-primary/20 text-primary' : 'hover:bg-gray-200 text-text'}`}
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        )}
                        {isImage && (
                            <div className="flex items-center gap-2 px-3 py-2 border-t border-border/20">
                                <ImageIcon size={14} className="text-muted" />
                                <span className="text-xs text-muted truncate">{message.fileName || 'Image'}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    // ─── Normal Text Bubble ───
                    <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isSent
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-gray-100 text-text rounded-bl-md'
                        } ${message.urgency ? 'border-l-2 border-danger' : ''}`}
                    >
                        {formatMessage(message.text)}
                    </div>
                )}

                <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : ''}`}>
                    <span className="text-[11px] text-muted">{formatTime(message.timestamp)}</span>
                    {isSent && (
                        <span className={`text-[11px] ${message.read ? 'text-cyan-500' : 'text-muted'}`}>
                            ✓✓
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
