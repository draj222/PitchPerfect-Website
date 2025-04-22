import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
}

interface Participant {
  _id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
}

function Conversation() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState<Participant | null>(null);
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userId');
  
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMessages(response.data.messages);
        
        // Find the other participant
        const currentUserId = localStorage.getItem('userId');
        const other = response.data.participants.find((p: Participant) => p._id !== currentUserId);
        setOtherUser(other || response.data.participants[0]);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again later.');
        toast.error('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
    
    // Set up Socket.io connection
    const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
      query: {
        token: localStorage.getItem('token')
      }
    });
    
    socketRef.current = socket;
    
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', { conversationId: id });
    });
    
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });
    
    socket.on('error', (socketError: Error) => {
      console.error('Socket error:', socketError);
      toast.error('Connection error. Please refresh the page.');
    });
    
    return () => {
      socket.disconnect();
    };
  }, [id]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/messages`, {
        conversationId: id,
        content: newMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // The message will be added via socket.io
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const formatMessageDate = (dateString: string, index: number) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
    
    if (index === 0) {
      return formattedDate;
    }
    
    const prevDate = new Date(messages[index - 1].createdAt);
    const prevFormattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(prevDate);
    
    if (formattedDate !== prevFormattedDate) {
      return formattedDate;
    }
    
    return null;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !otherUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-xl text-red-600 mb-4">{error || 'Conversation not found'}</h2>
          <Link to="/messages">
            <Button variant="primary">Return to Messages</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/messages" className="text-primary-600 hover:text-primary-700 mr-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center">
            {otherUser.avatarUrl ? (
              <img 
                src={otherUser.avatarUrl} 
                alt={`${otherUser.name}'s avatar`}
                className="w-10 h-10 rounded-full object-cover mr-3" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="text-lg text-gray-500">{otherUser.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{otherUser.name}</h1>
              {otherUser.title && <p className="text-sm text-gray-600">{otherUser.title}</p>}
            </div>
          </div>
        </div>
        
        <Card className="mb-4 p-0 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">
                    No messages yet. Start the conversation by sending a message below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isCurrentUser = message.sender._id === currentUserId;
                  const dateHeader = formatMessageDate(message.createdAt, index);
                  
                  return (
                    <div key={message._id}>
                      {dateHeader && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                            {dateHeader}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          {!isCurrentUser && (
                            <div className="flex-shrink-0 mr-2">
                              {message.sender.avatarUrl ? (
                                <img 
                                  src={message.sender.avatarUrl} 
                                  alt={`${message.sender.name}'s avatar`}
                                  className="w-8 h-8 rounded-full object-cover" 
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm text-gray-500">{message.sender.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <div 
                              className={`px-4 py-2 rounded-lg ${
                                isCurrentUser 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="whitespace-pre-line">{message.content}</p>
                            </div>
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-right' : ''} text-gray-500`}>
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Type a message..."
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                loading={sending}
                className="rounded-l-none"
              >
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Conversation; 