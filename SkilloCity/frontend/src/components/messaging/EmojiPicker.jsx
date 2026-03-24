import { useState, useRef, useEffect } from 'react';

const EMOJI_LIST = [
    '😀','😂','😍','🥰','😊','😎','🤩','😇','🤗','🤔',
    '😅','😆','😁','😄','😃','🙂','😉','😌','😏','😜',
    '🤭','🤫','🤐','😶','😑','😒','🙄','😤','😠','😡',
    '🥺','😢','😭','😱','😰','😓','🤯','😳','🥵','🥶',
    '👍','👎','👏','🙌','🤝','💪','✌️','🤞','🤟','👋',
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','💗','💕',
    '🔥','⭐','✨','💯','🎉','🎊','🏆','🎯','💡','📚',
    '✅','❌','⚡','💬','🙏','👀','😸','🌟','🚀','💪',
];

export default function EmojiPicker({ onSelect, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-xl border border-border/60 shadow-2xl p-3 z-50"
            style={{ animation: 'fadeInUp 0.15s ease-out' }}
        >
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto hide-scrollbar">
                {EMOJI_LIST.map((emoji, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(emoji)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors text-lg cursor-pointer"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
