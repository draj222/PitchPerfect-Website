import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    avatarUrl?: string;
  }[];
  lastMessage: {
    sender: string;
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setConversations(response.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (diff < oneDay) {
      // Today
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } else if (diff < 2 * oneDay) {
      // Yesterday
      return 'Yesterday';
    } else if (diff < 7 * oneDay) {
      // This week
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short'
      }).format(date);
    } else {
      // Older
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };
  
  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = localStorage.getItem('userId');
    return conversation.participants.find(p => p._id !== currentUserId) || conversation.participants[0];
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {conversations.length === 0 && !error ? (
        <Card className="text-center py-12">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-2">No messages yet</h2>
          <p className="text-gray-500 mb-6">
            When you connect with others, your conversations will appear here.
          </p>
          <Link to="/matches" className="text-primary-600 hover:text-primary-700 font-medium">
            Find matches to start a conversation
          </Link>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {conversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              const isUnread = conversation.unreadCount > 0;
              
              return (
                <li key={conversation._id}>
                  <Link 
                    to={`/messages/${conversation._id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0 relative">
                          {otherParticipant.avatarUrl ? (
                            <img 
                              className="h-12 w-12 rounded-full object-cover"
                              src={otherParticipant.avatarUrl}
                              alt={`${otherParticipant.name}'s avatar`}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-lg text-gray-500">{otherParticipant.name.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          
                          {isUnread && (
                            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-primary-600"></span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {otherParticipant.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(conversation.lastMessage.createdAt)}
                            </p>
                          </div>
                          <p className={`mt-1 text-sm truncate ${isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            {conversation.lastMessage.sender === localStorage.getItem('userId') ? (
                              <span className="text-gray-400">You: </span>
                            ) : null}
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                      <div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Messages; 