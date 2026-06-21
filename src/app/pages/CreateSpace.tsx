// pages/CreateSpace.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, Upload, X, Plus, Loader2, 
  Check, AlertCircle, Home, MapPin, Euro,
  Bed, Bath, Users, Wifi, Car, Waves,
  Utensils, Wind, Dumbbell, Tv, Coffee,
  Snowflake, Flower2, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Types
interface SpaceFormData {
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  images: File[];
}

const SPACE_TYPES = [
  { value: 'appartement', label: 'Appartement', icon: Home },
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'maison', label: 'Maison', icon: Home },
  { value: 'chalet', label: 'Chalet', icon: Home },
  { value: 'studio', label: 'Studio', icon: Home },
  { value: 'loft', label: 'Loft', icon: Home },
  { value: 'penthouse', label: 'Penthouse', icon: Home },
  { value: 'bureau', label: 'Bureau', icon: Home },
  { value: 'salle', label: 'Salle', icon: Home },
];

const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'piscine', label: 'Piscine', icon: Waves },
  { id: 'cuisine', label: 'Cuisine équipée', icon: Utensils },
  { id: 'climatisation', label: 'Climatisation', icon: Wind },
  { id: 'salle_de_sport', label: 'Salle de sport', icon: Dumbbell },
  { id: 'television', label: 'Télévision', icon: Tv },
  { id: 'cafetiere', label: 'Cafetière', icon: Coffee },
  { id: 'chauffage', label: 'Chauffage', icon: Snowflake },
  { id: 'jardin', label: 'Jardin', icon: Flower2 },
  { id: 'terrasse', label: 'Terrasse', icon: Home },
  { id: 'jacuzzi', label: 'Jacuzzi', icon: Waves },
];

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CreateSpace() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<SpaceFormData>({
    title: '',
    description: '',
    location: '',
    price_per_night: 0,
    space_type: 'appartement',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    amenities: [],
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);

  const totalSteps = 3;

  // Rediriger si non connecté - Vérification améliorée
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/spaces/create' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Charger les données si en mode édition
  useEffect(() => {
    if (isEditMode && isAuthenticated && id) {
      fetchSpaceData();
    }
  }, [isEditMode, isAuthenticated, id]);

  const fetchSpaceData = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(`/spaces/${id}`);
      const space = response.data;
      
      setFormData({
        title: space.title || '',
        description: space.description || '',
        location: space.location || '',
        price_per_night: space.price_per_night || 0,
        space_type: space.space_type || 'appartement',
        bedrooms: space.bedrooms || 1,
        bathrooms: space.bathrooms || 1,
        max_guests: space.max_guests || 2,
        amenities: space.amenities || [],
        images: [],
      });

      // Afficher les images existantes
      if (space.images) {
        setImagePreviews(space.images.map((img: any) => img.image_path || img));
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les données du logement');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > MAX_IMAGES) {
      setError(`Vous ne pouvez pas ajouter plus de ${MAX_IMAGES} images`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} n'est pas une image`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} dépasse 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError(null);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          setError('Veuillez saisir un titre');
          return false;
        }
        if (!formData.description.trim() || formData.description.length < 20) {
          setError('La description doit faire au moins 20 caractères');
          return false;
        }
        if (!formData.location.trim()) {
          setError('Veuillez saisir une localisation');
          return false;
        }
        break;
      case 2:
        if (formData.price_per_night <= 0) {
          setError('Veuillez saisir un prix valide');
          return false;
        }
        if (formData.bedrooms < 1) {
          setError('Minimum 1 chambre');
          return false;
        }
        if (formData.bathrooms < 1) {
          setError('Minimum 1 salle de bain');
          return false;
        }
        if (formData.max_guests < 1) {
          setError('Minimum 1 voyageur');
          return false;
        }
        break;
      case 3:
        if (formData.images.length === 0 && !isEditMode) {
          setError('Veuillez ajouter au moins une image');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError(null);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('location', formData.location);
      form.append('price_per_night', formData.price_per_night.toString());
      form.append('space_type', formData.space_type);
      form.append('bedrooms', formData.bedrooms.toString());
      form.append('bathrooms', formData.bathrooms.toString());
      form.append('max_guests', formData.max_guests.toString());
      
      formData.amenities.forEach(amenity => {
        form.append('amenities[]', amenity);
      });

      formData.images.forEach(image => {
        form.append('images[]', image);
      });

      let response;
      if (isEditMode) {
        response = await api.post(`/spaces/${id}?_method=PUT`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(progress);
          },
        });
      } else {
        response = await api.post('/spaces', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(progress);
          },
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/space/${response.data.space.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Afficher le loader pendant la vérification de l'authentification
  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (la redirection se fait dans le useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isEditMode ? 'Logement modifié avec succès !' : 'Logement créé avec succès !'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isEditMode 
              ? 'Votre logement a été mis à jour avec succès.'
              : 'Votre logement a été soumis pour validation. Vous serez notifié dès qu\'il sera approuvé.'
            }
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Modifier le logement' : 'Ajouter un logement'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? 'Modifiez les informations de votre annonce' 
                : 'Remplissez les informations pour créer votre annonce'
              }
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isEditMode && progressBar()}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 md:p-8">
          {/* Step 1: General Info */}
          {(currentStep === 1 || isEditMode) && (
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Titre de l'annonce *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Magnifique Villa avec Vue Mer"
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.title.length}/100 caractères
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre logement en détail..."
                  rows={6}
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.description.length}/2000 caractères
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">Localisation *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ville, Pays"
                    className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Type de logement *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPACE_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.space_type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, space_type: type.value }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-600/10'
                            : 'border-border hover:border-blue-400'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : ''}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isEditMode && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Continuer
                </button>
              )}
            </div>
          )}

          {/* Step 2: Details & Price */}
          {(currentStep === 2 || isEditMode) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">Prix par nuit (€) *</label>
                  <div className="relative">
                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="price_per_night"
                      value={formData.price_per_night || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Nombre de voyageurs max *</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="max_guests"
                      value={formData.max_guests || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Nombre de chambres *</label>
                  <div className="relative">
                    <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Nombre de salles de bain *</label>
                  <div className="relative">
                    <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Équipements</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES_LIST.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-border hover:border-blue-400'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : ''}`}>
                          {amenity.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isEditMode && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 border border-border rounded-xl hover:bg-accent transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Continuer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Photos */}
          {(currentStep === 3 || isEditMode) && (
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3">Photos du logement {!isEditMode && '*'}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Upload Zone */}
                  {formData.images.length < MAX_IMAGES && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-blue-400 cursor-pointer transition-colors flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center px-2">
                        Ajouter une photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  )}

                  {/* Image Previews */}
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {formData.images.length} / {MAX_IMAGES} photos · Format JPG, PNG, WEBP · Max 5MB
                </p>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 border border-border rounded-xl hover:bg-accent transition-colors"
                  >
                    Retour
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || (formData.images.length === 0 && !isEditMode)}
                  className={`${!isEditMode ? 'flex-1' : 'w-full'} py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isEditMode ? 'Modification en cours...' : 'Création en cours...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {isEditMode ? 'Modifier le logement' : 'Créer le logement'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Fonction helper pour la barre de progression
function progressBar() {
  // La fonction est définie à l'intérieur du composant
  return null;
}