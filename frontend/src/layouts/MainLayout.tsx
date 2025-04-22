import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PuzzlePieceIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface MainLayoutProps {
  setIsAuthenticated: (value: boolean) => void;
}

const MainLayout = ({ setIsAuthenticated }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch unread message count here
    // For now, just use a mock value
    setUnreadMessages(3);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary-600">ConnectUp</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <HomeIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                Dashboard
              </NavLink>
              
              <NavLink 
                to="/jobs"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <BriefcaseIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                Browse Jobs
              </NavLink>
              
              <NavLink 
                to="/my-jobs"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <BriefcaseIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                My Jobs
              </NavLink>
              
              <NavLink 
                to="/matches"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <PuzzlePieceIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                Matches
              </NavLink>
              
              <NavLink 
                to="/messages"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <ChatBubbleLeftRightIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                Messages
                {unreadMessages > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </NavLink>
              
              <NavLink 
                to="/profile"
                className={({ isActive }) => 
                  `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                }
              >
                <UserIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 flex z-40">
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
              mobileMenuOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ${
              mobileMenuOpen
                ? 'transform ease-out duration-300 translate-x-0'
                : 'transform ease-in duration-200 -translate-x-full'
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-2xl font-bold text-primary-600">ConnectUp</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <NavLink 
                  to="/dashboard"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HomeIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  Dashboard
                </NavLink>
                
                <NavLink 
                  to="/jobs"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BriefcaseIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  Browse Jobs
                </NavLink>
                
                <NavLink 
                  to="/my-jobs"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BriefcaseIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  My Jobs
                </NavLink>
                
                <NavLink 
                  to="/matches"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PuzzlePieceIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  Matches
                </NavLink>
                
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ChatBubbleLeftRightIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </NavLink>
                
                <NavLink 
                  to="/profile"
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} 
                    group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="mr-4 flex-shrink-0 h-6 w-6" />
                  Profile
                </NavLink>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="absolute right-2 top-2 flex items-center space-x-2">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <BellIcon className="h-6 w-6" />
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>
        </div>
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 