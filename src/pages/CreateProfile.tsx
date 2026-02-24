import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, 
  Image as ImageIcon, 
  Store, 
  FileText, 
  ArrowRight, 
  Loader2,
  X,
  Star
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CreateProfile = () => {
  const { user, hasProfile, isLoading: authLoading, updateProfile, uploadProfileImage, uploadBackgroundImage } = useAuth();
  const navigate = useNavigate();
  
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin', { replace: true });
    }
    if (!authLoading && hasProfile) {
      navigate('/admin', { replace: true });
    }
  }, [user, hasProfile, authLoading, navigate]);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert('Ukuran file maksimal 5MB');
      return false;
    }
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return false;
    }
    return true;
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!storeName.trim()) {
      newErrors.storeName = 'Nama toko wajib diisi';
    } else if (storeName.length < 3) {
      newErrors.storeName = 'Nama toko minimal 3 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      let profileImagePath = null;
      let backgroundImagePath = null;

      // Upload profile image jika ada
      if (profileImage) {
        const { path, error } = await uploadProfileImage(profileImage);
        if (error) throw error;
        profileImagePath = path;
      }

      // Upload background image jika ada
      if (backgroundImage) {
        const { path, error } = await uploadBackgroundImage(backgroundImage);
        if (error) throw error;
        backgroundImagePath = path;
      }

      // Update profile
      const { error } = await updateProfile({
        store_name: storeName.trim(),
        description: description.trim() || undefined,
        image_profile: profileImagePath || undefined,
        image_background: backgroundImagePath || undefined,
        ratings: 5.0,
      });

      if (error) throw error;

      // Redirect ke dashboard
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Gagal membuat profil. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            Setup Profil Toko
          </h1>
          <p className="text-gray-500">
            Lengkapi informasi bisnis Anda untuk memulai
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-6 md:p-10 border border-gray-100 space-y-8">
          
          {/* Background Image Upload */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} /> Foto Sampul (Opsional)
            </label>
            <div className="relative">
              <div 
                className="h-40 rounded-2xl bg-gray-100 overflow-hidden relative group cursor-pointer"
                onClick={() => backgroundInputRef.current?.click()}
              >
                {backgroundImagePreview ? (
                  <img 
                    src={backgroundImagePreview} 
                    alt="Background preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Klik untuk upload foto sampul</span>
                    <span className="text-xs text-gray-300 mt-1">Rekomendasi 1200x400px</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              {backgroundImagePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBackgroundImage(null);
                    setBackgroundImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition shadow-sm"
                >
                  <X size={16} />
                </button>
              )}
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} /> Foto Profil (Opsional)
            </label>
            <div className="flex items-center gap-6">
              <div 
                className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden group cursor-pointer border-4 border-white shadow-lg"
                onClick={() => profileInputRef.current?.click()}
              >
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Camera size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  {profileImagePreview ? 'Ganti foto' : 'Upload foto profil'}
                </button>
                <p className="text-xs text-gray-400 mt-1">Rekomendasi 400x400px, Max 5MB</p>
              </div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Store Name */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Store size={14} /> Nama Toko <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Toko Sejahtera"
              className={`w-full bg-gray-50 border-2 ${errors.storeName ? 'border-red-200' : 'border-transparent'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm font-medium`}
            />
            {errors.storeName && (
              <p className="text-xs text-red-500 font-medium">{errors.storeName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Deskripsi Toko (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang bisnis Anda..."
              rows={4}
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm font-medium resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{description.length}/500 karakter</p>
          </div>

          {/* Rating Preview (Static) */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Star size={14} /> Rating Awal
            </label>
            <div className="flex items-center gap-2 bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-bold text-yellow-700">5.0</span>
              <span className="text-xs text-yellow-600">Rating akan diupdate otomatis berdasarkan review pelanggan</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  Lanjutkan ke Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};