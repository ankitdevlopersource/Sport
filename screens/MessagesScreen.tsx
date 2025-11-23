import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage, User } from '../types';

const mockConversations: Conversation[] = [
    { id: 1, sender: 'Excel Sports', avatar: `https://picsum.photos/seed/sponsor1/40/40`, lastMessage: 'We were impressed with your latest performance.', timestamp: '2:18 PM', type: 'sponsor' },
    { id: 2, sender: 'Ajay Coach', avatar: `https://picsum.photos/seed/coach1/40/40`, lastMessage: 'Great progress, keep it up!', timestamp: '1:45 PM', type: 'team' },
    { id: 3, sender: 'Neha Team', avatar: `https://picsum.photos/seed/team1/40/40`, lastMessage: 'Are you available for a meeting next week?', timestamp: 'Yesterday', type: 'team' },
    { id: 4, sender: 'System', avatar: 'https://picsum.photos/seed/system/40/40', lastMessage: 'Your video has been rated.', timestamp: 'Yesterday', type: 'system' },
    { id: 5, sender: 'Elite Athletics', avatar: `https://picsum.photos/seed/sponsor2/40/40`, lastMessage: 'We have an opportunity for you.', timestamp: 'Jan 28', type: 'sponsor' },
];

const mockChatHistory: Record<number, ChatMessage[]> = {
    1: [
        { id: 1, text: "Hello! We saw your profile and were very impressed.", sender: 'other', timestamp: '2:15 PM' },
        { id: 2, text: "We would like to discuss a potential sponsorship opportunity.", sender: 'other', timestamp: '2:16 PM' },
        { id: 3, text: "Thank you! I'm very interested.", sender: 'me', timestamp: '2:17 PM' },
        { id: 4, text: 'We were impressed with your latest performance.', sender: 'other', timestamp: '2:18 PM' },
    ],
    2: [
        { id: 1, text: "Great progress, keep it up!", sender: 'other', timestamp: '1:45 PM' }
    ],
    3: [
        { id: 1, text: 'Are you available for a meeting next week?', sender: 'other', timestamp: 'Yesterday' }
    ],
    4: [
        { id: 1, text: 'Your video has been rated.', sender: 'other', timestamp: 'Yesterday' }
    ],
    5: [
        { id: 1, text: 'We have an opportunity for you.', sender: 'other', timestamp: 'Jan 28' }
    ]
};

const ChatView: React.FC<{ conversation: Conversation; user: User; onBack: () => void; }> = ({ conversation, user, onBack }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory[conversation.id] || []);
    const [newMessage, setNewMessage] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setSelectedMessageId(null);
    };

    const handleDelete = (messageId: number) => {
        setMessages(messages.filter(msg => msg.id !== messageId));
        setSelectedMessageId(null);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const message: ChatMessage = {
            id: Date.now(),
            text: newMessage.trim(),
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="bg-blue-800 text-white p-4 flex items-center sticky top-0 z-10 shadow-md">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-blue-700">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <img src={conversation.avatar} alt={conversation.sender} className="w-10 h-10 rounded-full mx-3" />
                <h2 className="text-lg font-bold">{conversation.sender}</h2>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4" onClick={() => setSelectedMessageId(null)}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'other' && <img src={conversation.avatar} alt={conversation.sender} className="w-6 h-6 rounded-full object-cover" />}
                         <div className="relative">
                            <div 
                                onClick={(e) => { e.stopPropagation(); setSelectedMessageId(selectedMessageId === msg.id ? null : msg.id); }}
                                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl cursor-pointer ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'} text-right`}>{msg.timestamp}</p>
                            </div>
                             {selectedMessageId === msg.id && (
                                <div className={`absolute z-20 top-full mt-1 w-40 bg-white rounded-md shadow-lg border text-sm py-1 ${msg.sender === 'me' ? 'right-0' : 'left-0'}`}>
                                    <button onClick={() => handleCopy(msg.text)} className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 whitespace-nowrap">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        Copy Message
                                    </button>
                                    <button onClick={() => handleDelete(msg.id)} className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600 whitespace-nowrap">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        Delete Message
                                    </button>
                                </div>
                            )}
                        </div>
                        {msg.sender === 'me' && <img src={user.profilePictureUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-2 bg-white border-t sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={!newMessage.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};


const MessagesScreen: React.FC<{ user: User }> = ({ user }) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    if (selectedConversation) {
        return <ChatView conversation={selectedConversation} user={user} onBack={() => setSelectedConversation(null)} />;
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Messages</h1>
                <button className="p-1 rounded-full hover:bg-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>
            </header>
            
            <div className="p-4 bg-gray-50 border-b">
                <input 
                    type="search"
                    placeholder="Search messages..."
                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {mockConversations.map(conv => (
                    <button 
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className="flex items-center w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                        <img src={conv.avatar} alt={conv.sender} className="w-12 h-12 rounded-full mr-4"/>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-800">{conv.sender}</p>
                                <p className="text-xs text-gray-500">{conv.timestamp}</p>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                 <h3 className="text-lg font-bold text-gray-800 mb-3">Sponsors & Opportunities</h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-blue-800">Excel Sports</p>
                            <p className="text-xs text-blue-600">Professional Team</p>
                        </div>
                        <button className="text-blue-600 font-semibold p-2">{'>'}</button>
                    </div>
                     <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-blue-800">Elite Athletics</p>
                            <p className="text-xs text-blue-600">Training Center</p>
                        </div>
                        <button className="text-blue-600 font-semibold p-2">{'>'}</button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default MessagesScreen;