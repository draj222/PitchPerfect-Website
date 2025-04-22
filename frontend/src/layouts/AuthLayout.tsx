import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-600">ConnectUp</h1>
            <p className="mt-2 text-gray-600">Connecting founders and talent</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 