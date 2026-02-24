import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chrome, ArrowRight, Sparkles } from 'lucide-react';

export const SignIn = () => {
  const { isAuthenticated, hasProfile, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && !hasProfile) {
        navigate('/create-profile', { replace: true });
      } else if (isAuthenticated && hasProfile) {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, hasProfile, isLoading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Gagal masuk dengan Google. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-200 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
            BISSOLF
          </h1>
          <p className="text-gray-500 font-medium">
            Platform manajemen bisnis modern
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Selamat Datang
            </h2>
            <p className="text-sm text-gray-500">
              Masuk untuk mengelola bisnis Anda
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full group relative bg-white border-2 border-gray-100 hover:border-blue-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-100/50 active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            <span>Lanjutkan dengan Google</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Dengan masuk, Anda menyetujui{' '}
              <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
              {' '}dan{' '}
              <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📦</span>
            </div>
            <p className="text-xs font-bold text-gray-600">Kelola Produk</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📊</span>
            </div>
            <p className="text-xs font-bold text-gray-600">Tracking Order</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🤖</span>
            </div>
            <p className="text-xs font-bold text-gray-600">AI Analyzer</p>
          </div>
        </div>
      </div>
    </div>
  );
};