import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Video } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

export default function ChatInput({ onSend, onSendFile, onCreateMeetLink, className = '' }) {
    const [text, setText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCreateRoom = () => {
        // Open a real Google Meet "instant meeting" in a new tab
        window.open('https://meet.google.com/new', '_blank');
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5 MB');
            return;
        }

        if (onSendFile) {
            setUploading(true);
            try {
                await onSendFile(file);
            } catch (err) {
                console.error('File upload failed:', err);
                alert('Failed to upload file. Please try again.');
            } finally {
                setUploading(false);
            }
        }

        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const handleEmojiSelect = (emoji) => {
        setText(prev => prev + emoji);
        setShowEmoji(false);
    };

    return (
        <div className={`flex items-center gap-2 p-3 bg-white border-t border-border ${className}`}>
            {/* File attachment */}
            <button
                onClick={handleFileClick}
                disabled={uploading}
                title="Attach a file"
                className="p-2 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary-light disabled:opacity-50"
            >
                {uploading ? (
                    <div className="w-[18px] h-[18px] border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                    <Paperclip size={18} />
                )}
            </button>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* Google Meet room */}
            <button
                onClick={handleCreateRoom}
                title="Open Google Meet"
                className="p-2 text-muted hover:text-green-600 transition-colors rounded-md hover:bg-green-50"
            >
                <Video size={18} />
            </button>

            {/* Text input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={uploading ? 'Uploading file...' : 'Type a message...'}
                className="flex-1 h-10 px-4 border border-border rounded-full text-sm focus:outline-none focus:border-primary focus:shadow-focus"
            />

            {/* Emoji picker */}
            <div className="relative">
                <button
                    onClick={() => setShowEmoji(prev => !prev)}
                    title="Add emoji"
                    className={`p-2 transition-colors rounded-md ${showEmoji ? 'text-primary bg-primary/10' : 'text-muted hover:text-primary hover:bg-primary-light'}`}
                >
                    <Smile size={18} />
                </button>
                {showEmoji && (
                    <EmojiPicker
                        onSelect={handleEmojiSelect}
                        onClose={() => setShowEmoji(false)}
                    />
                )}
            </div>

            {/* Send button */}
            <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={16} />
            </button>
        </div>
    );
}
