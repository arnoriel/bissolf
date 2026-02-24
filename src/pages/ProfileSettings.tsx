import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, 
  Image as ImageIcon, 
  Store, 
  FileText, 
  Save,
  Loader2,
  X,
  Star,
  ArrowLeft
} from 'lucide-react';
import { getProfileImageUrl, getBackgroundImageUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ProfileSettings = () => {
  const { profile, updateProfile, uploadProfileImage, uploadBackgroundImage } = useAuth();
  const navigate = useNavigate();
  
  const [storeName, setStoreName] = useState(profile?.store_name || '');
  const [description, setDescription] = useState(profile?.description || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
  profile?.image_profile
    ? getProfileImageUrl(profile.image_profile) ?? null
    : null
    );
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(
  profile?.image_background
    ? getBackgroundImageUrl(profile.image_background) ?? null
    : null
    );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

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
    setSuccessMessage('');

    try {
      let profileImagePath = profile?.image_profile || null;
      let backgroundImagePath = profile?.image_background || null;

      // Upload profile image jika ada file baru
      if (profileImage) {
        const { path, error } = await uploadProfileImage(profileImage);
        if (error) throw error;
        profileImagePath = path;
      }

      // Upload background image jika ada file baru
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
      });

      if (error) throw error;

      setSuccessMessage('Profil berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-[#fcfcfd] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Pengaturan Profil
            </h1>
            <p className="text-sm text-gray-500">
              Kelola informasi toko Anda
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Save size={16} />
            </div>
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-6 md:p-10 border border-gray-100 space-y-8">
          
          {/* Background Image Upload */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} /> Foto Sampul
            </label>
            <div className="relative">
              <div 
                className="h-48 rounded-2xl bg-gray-100 overflow-hidden relative group cursor-pointer"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image Upload */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Camera size={14} /> Foto Profil
              </label>
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden group cursor-pointer border-4 border-white shadow-lg"
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
                      <Camera size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  {profileImagePreview ? 'Ganti foto' : 'Upload foto'}
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-6">
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
                  <FileText size={14} /> Deskripsi Toko
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan tentang bisnis Anda..."
                  rows={4}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm font-medium resize-none"
                />
              </div>

              {/* Rating Display (Read-only) */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Star size={14} /> Rating Toko
                </label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        fill={star <= Math.round(profile?.ratings || 5) ? "currentColor" : "none"}
                        className={star <= Math.round(profile?.ratings || 5) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-black text-gray-900">{profile?.ratings || 5.0}</span>
                  <span className="text-xs text-gray-400">Rating dihitung otomatis dari review pelanggan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};