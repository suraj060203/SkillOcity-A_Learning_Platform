import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Edit3, MessageSquare, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Avatar from '../../components/common/Avatar';
import MessageBubble from '../../components/messaging/MessageBubble';
import MeetLinkCard from '../../components/messaging/MeetLinkCard';
import QuickReplies from '../../components/messaging/QuickReplies';
import ChatInput from '../../components/messaging/ChatInput';
import Spinner from '../../components/common/Spinner';
import messageService from '../../services/messageService';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import { formatRelativeTime, truncateText } from '../../utils/formatters';

export default function MessagesPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { emit, on, off, connected } = useSocketContext();
    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(conversationId || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(!conversationId);
    const messagesEndRef = useRef(null);

    const currentUserId = user?.id;

    // Auto-scroll to bottom when messages change
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeConvId, scrollToBottom]);

    // Fetch conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await messageService.getConversations();
                setConversations(data);
                if (!activeConvId && data.length > 0) {
                    setActiveConvId(data[0].id);
                }
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Load messages when active conversation changes
    useEffect(() => {
        if (!activeConvId) return;
        setShowSidebarOnMobile(false);
        const fetchMessages = async () => {
            try {
                const msgs = await messageService.getMessages(activeConvId);
                setMessages(prev => ({ ...prev, [activeConvId]: msgs }));
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };
        if (!messages[activeConvId]) {
            fetchMessages();
        }
    }, [activeConvId]);

    // Listen for real-time messages via Socket.io
    useEffect(() => {
        if (!connected) return;

        const handleNewMessage = (msg) => {
            const convId = msg.conversation || msg.conversationId;
            if (!convId) return;

            setMessages(prev => {
                const existing = prev[convId] || [];
                // Avoid duplicates
                if (existing.some(m => m.id === msg.id)) return prev;
                return { ...prev, [convId]: [...existing, msg] };
            });

            // Update conversation list's last message
            setConversations(prev => prev.map(c => {
                if (c.id === convId) {
                    return {
                        ...c,
                        lastMessage: msg.text,
                        lastMessageTime: msg.createdAt || new Date().toISOString(),
                        unreadCount: convId === activeConvId ? c.unreadCount : (c.unreadCount || 0) + 1,
                    };
                }
                return c;
            }));
        };

        on('message:receive', handleNewMessage);
        return () => off('message:receive', handleNewMessage);
    }, [connected, on, off, activeConvId]);

    // Mark messages as read when opening a conversation
    useEffect(() => {
        if (!activeConvId || !connected) return;
        emit('message:read', { conversationId: activeConvId });
        // Clear unread count locally
        setConversations(prev => prev.map(c =>
            c.id === activeConvId ? { ...c, unreadCount: 0 } : c
        ));
    }, [activeConvId, connected, emit]);

    const activeConv = conversations.find(c => c.id === activeConvId);
    const activeMessages = messages[activeConvId] || [];

    const filteredConvs = conversations.filter(c =>
        c.with.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSend = async (text) => {
        if (!text.trim()) return;

        // Send via Socket.io for real-time delivery
        if (connected) {
            emit('message:send', { conversationId: activeConvId, text, type: 'text' });
        } else {
            // Fallback to HTTP
            try {
                const newMsg = await messageService.sendMessage(activeConvId, text);
                setMessages(prev => ({
                    ...prev,
                    [activeConvId]: [...(prev[activeConvId] || []), newMsg],
                }));
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    const handleSendFile = async (file) => {
        try {
            const newMsg = await messageService.sendFileMessage(activeConvId, file);
            setMessages(prev => ({
                ...prev,
                [activeConvId]: [...(prev[activeConvId] || []), newMsg],
            }));
            // Update conversation sidebar
            setConversations(prev => prev.map(c =>
                c.id === activeConvId
                    ? { ...c, lastMessage: newMsg.text, lastMessageTime: newMsg.timestamp || new Date().toISOString() }
                    : c
            ));
        } catch (err) {
            console.error('Error sending file:', err);
            throw err; // Let ChatInput show the error
        }
    };

    const handleQuickReply = (text) => handleSend(text);

    if (loading) return <PageWrapper><Spinner className="py-32" /></PageWrapper>;

    return (
        <PageWrapper>
            <div className="flex h-[calc(100vh-100px)] -mx-4 sm:mx-0 sm:rounded-2xl border border-border/60 bg-white shadow-xl overflow-hidden glassmorphism">
                
                {/* ─── Sidebar (Conversation List) ─── */}
                <div className={`w-full md:w-[320px] bg-gray-50/50 border-r border-border/40 flex flex-col shrink-0 ${!showSidebarOnMobile ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-5 border-b border-border/40 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-display text-text">Messages</h2>
                            <button className="h-8 w-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-primary transition-colors bg-primary/5">
                                <Edit3 size={16} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full h-10 pl-10 pr-4 bg-gray-100/80 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        {filteredConvs.length === 0 ? (
                            <div className="p-8 text-center text-muted text-sm pb-20">
                                <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                                No conversations found
                            </div>
                        ) : (
                            filteredConvs.map((conv) => {
                                const isActive = activeConvId === conv.id;
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveConvId(conv.id)}
                                        className={`w-full flex items-center gap-3 p-4 transition-all text-left relative ${isActive
                                                ? 'bg-white shadow-sm z-10'
                                                : 'hover:bg-white/60'
                                            }`}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />}
                                        
                                        <div className="relative">
                                            <Avatar name={conv.with.name} size={48} online={conv.with.isOnline} />
                                            {conv.unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-text'}`}>
                                                    {conv.with.name}
                                                </span>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider shrink-0 ${conv.unreadCount > 0 ? 'text-text' : 'text-muted/60'}`}>
                                                    {formatRelativeTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-text' : 'text-muted'}`}>
                                                    {truncateText(conv.lastMessage, 35)}
                                                </p>
                                                {conv.urgency && (
                                                    <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ─── Active Chat Window ─── */}
                <div className={`flex-1 flex flex-col bg-[#F8F9FB] relative ${showSidebarOnMobile ? 'hidden md:flex' : 'flex'}`}>
                    {activeConv ? (
                        <>
                            {/* Chat header */}
                            <div className="h-[73px] flex items-center px-4 sm:px-6 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                <button 
                                    className="mr-3 md:hidden p-2 -ml-2 text-muted hover:text-text"
                                    onClick={() => setShowSidebarOnMobile(true)}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                
                                <div className="flex items-center gap-4 flex-1">
                                    <Avatar name={activeConv.with.name} size={40} online={activeConv.with.isOnline} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-bold text-text truncate">{activeConv.with.name}</h3>
                                            {activeConv.with.isOnline && <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">Online</span>}
                                        </div>
                                        <p className="text-xs text-muted truncate">{activeConv.with.subject}</p>
                                    </div>
                                    <button 
                                        className="hidden sm:flex h-9 px-4 items-center justify-center rounded-xl bg-gray-50 hover:bg-primary/10 text-xs font-bold text-text hover:text-primary transition-colors border border-border/60"
                                        onClick={() => navigate(user?.role === 'student' ? `/tutor/${activeConv.with.id}` : '#')}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                                {/* Welcome message */}
                                <div className="flex justify-center my-6">
                                    <span className="px-3 py-1 bg-white border border-border/40 rounded-full text-[10px] font-bold text-muted uppercase tracking-widest shadow-sm">
                                        Conversation Started
                                    </span>
                                </div>

                                {activeMessages.map((msg, idx) => {
                                    const prevMsg = idx > 0 ? activeMessages[idx - 1] : null;
                                    const isSameAsPrev = prevMsg && (prevMsg.senderId || prevMsg.sender) === (msg.senderId || msg.sender);
                                    
                                    const msgSenderId = msg.senderId || msg.sender;

                                    if (msg.type === 'meet-link') {
                                        return (
                                            <div key={msg.id} className={`flex ${msgSenderId === currentUserId ? 'justify-end' : 'justify-start'} ${isSameAsPrev ? 'mt-1' : 'mt-4'}`}>
                                                <MeetLinkCard meetLink={msg.meetLink} />
                                            </div>
                                        );
                                    }
                                    // Both text and file messages use MessageBubble (it handles file rendering internally)
                                    return (
                                        <div key={msg.id} className={isSameAsPrev ? 'mt-1' : 'mt-4'}>
                                            <MessageBubble
                                                message={msg}
                                                isSent={msgSenderId === currentUserId}
                                                senderName={msgSenderId === currentUserId ? 'You' : activeConv.with.name}
                                                showAvatar={!isSameAsPrev}
                                            />
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="bg-white border-t border-border/40 pb-safe">
                                <div className="px-4 pt-3 flex gap-2 overflow-x-auto hide-scrollbar">
                                    <QuickReplies onSelect={handleQuickReply} />
                                </div>
                                <div className="p-4">
                                    <ChatInput onSend={handleSend} onSendFile={handleSendFile} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/50 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <MessageSquare size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-display text-text mb-2">Your Messages</h3>
                            <p className="text-sm text-muted max-w-sm">Select a conversation from the sidebar to view chat history and send messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
