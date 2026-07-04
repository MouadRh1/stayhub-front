import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Upload, X, Loader2,
  Check, AlertCircle, Home, MapPin, Euro,
  Bed, Bath, Users, Wifi, Car, Waves,
  Utensils, Wind, Dumbbell, Tv, Coffee,
  Snowflake, Flower2, Sparkles, ImagePlus, Star,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// Types
interface ExistingGalleryImage {
  id: number;
  image_path: string;
}

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
  featured_image: File | null;
  existing_featured_image?: string | null;
  gallery_images: File[];
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_GALLERY_IMAGES = 10;

export function CreateSpace() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isEditMode = !!id;

  // Form data
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
    featured_image: null,
    existing_featured_image: null,
    gallery_images: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Gallery state
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]); // previews for newly added files
  const [existingGallery, setExistingGallery] = useState<ExistingGalleryImage[]>([]); // images already on the server
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]); // ids marked for soft-delete, applied on submit

  // UI states
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const totalSteps = 3;

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/spaces/create' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load data in edit mode
  useEffect(() => {
    if (isEditMode && isAuthenticated && id) {
      fetchSpaceData();
    }
  }, [isEditMode, isAuthenticated, id]);

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        featured_image: null,
        existing_featured_image: space.featured_image || null,
        gallery_images: [],
      });

      if (space.featured_image) {
        setImagePreview(space.featured_image);
      }

      // space.images comes from SpaceController@show — excludes the featured one if you
      // chose to keep them separate, or includes everything if you used the fallback.
      // Here we filter out anything flagged is_primary to avoid duplicating the featured image.
      if (Array.isArray(space.images)) {
        const gallery = space.images
          .filter((img: any) => !img.is_primary)
          .map((img: any) => ({ id: img.id, image_path: img.image_path }));
        setExistingGallery(gallery);
      }
    } catch (err) {
      console.error('Erreur fetchSpaceData:', err);
      setError('Impossible de charger les données du logement');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
        : [...prev.amenities, amenityId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    setFormData(prev => ({ ...prev, featured_image: file }));
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    e.target.value = '';
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: null, existing_featured_image: null }));
    setImagePreview(null);
  };

  // --- Gallery handlers ---

  const totalGalleryCount = () =>
    existingGallery.length - imagesToDelete.length + formData.gallery_images.length;

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - totalGalleryCount();
    if (remainingSlots <= 0) {
      setError(`Vous ne pouvez pas ajouter plus de ${MAX_GALLERY_IMAGES} photos de détail`);
      e.target.value = '';
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        setError('Tous les fichiers doivent être des images');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Chaque image ne doit pas dépasser 5 MB');
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...validFiles] }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
      setError(null);
    }

    e.target.value = '';
  };

  // Remove a newly-added (not yet uploaded) gallery image
  const removeNewGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Soft-delete: mark an existing server-side image for removal, only applied on submit
  const toggleExistingGalleryDelete = (imageId: number) => {
    setImagesToDelete(prev =>
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) { setError('Veuillez saisir un titre'); return false; }
        if (formData.description.length < 20) { setError('La description doit faire au moins 20 caractères'); return false; }
        if (!formData.location.trim()) { setError('Veuillez saisir une localisation'); return false; }
        break;
      case 2:
        if (formData.price_per_night <= 0) { setError('Veuillez saisir un prix valide'); return false; }
        if (formData.bedrooms < 1) { setError('Minimum 1 chambre'); return false; }
        if (formData.bathrooms < 1) { setError('Minimum 1 salle de bain'); return false; }
        if (formData.max_guests < 1) { setError('Minimum 1 voyageur'); return false; }
        break;
      case 3:
        if (!formData.featured_image && !formData.existing_featured_image && !isEditMode) {
          setError('Veuillez ajouter une image principale');
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

      // Basic fields
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('location', formData.location);
      form.append('price_per_night', formData.price_per_night.toString());
      form.append('space_type', formData.space_type);
      form.append('bedrooms', formData.bedrooms.toString());
      form.append('bathrooms', formData.bathrooms.toString());
      form.append('max_guests', formData.max_guests.toString());
      formData.amenities.forEach(a => form.append('amenities[]', a));

      // Featured image
      if (formData.featured_image) {
        form.append('featured_image', formData.featured_image);
      }

      let spaceId = id;

      if (isEditMode) {
        const response = await api.post(`/spaces/${id}?_method=PUT`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 50) / (e.total || 1))); // first half of progress bar
          },
        });
        spaceId = response.data.space.id;
      } else {
        const response = await api.post('/spaces', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(Math.round((e.loaded * 50) / (e.total || 1)));
          },
        });
        spaceId = response.data.space.id;
      }

      // Upload new gallery images, if any
      if (formData.gallery_images.length > 0 && spaceId) {
        const galleryForm = new FormData();
        formData.gallery_images.forEach(file => galleryForm.append('images[]', file));

        await api.post(`/spaces/${spaceId}/gallery`, galleryForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            setUploadProgress(50 + Math.round((e.loaded * 50) / (e.total || 1)));
          },
        });
      }

      // Apply soft-deletes for existing gallery images marked for removal
      if (imagesToDelete.length > 0 && spaceId) {
        await Promise.all(
          imagesToDelete.map(imageId =>
            api.delete(`/spaces/${spaceId}/gallery/${imageId}`)
          )
        );
      }

      setUploadProgress(100);
      setSuccess(true);
      setTimeout(() => navigate(`/space/${spaceId}`), 2000);
    } catch (err: any) {
      console.error('Erreur submit:', err);
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' — ')
        : err.response?.data?.message || 'Erreur lors de la sauvegarde';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {['Informations', 'Détails & Prix', 'Photos'].map((label, i) => {
          const step = i + 1;
          const done = currentStep > step;
          const active = currentStep === step;
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                done ? 'bg-green-500 text-white'
                : active ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground'
              }`}>
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={`hidden sm:block text-sm ${active ? 'font-semibold' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {step < totalSteps && (
                <div className={`hidden sm:block h-0.5 w-16 mx-2 transition-all ${currentStep > step ? 'bg-green-500' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isEditMode ? 'Logement modifié !' : 'Logement créé !'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isEditMode
              ? 'Votre logement a été mis à jour avec succès.'
              : "Votre annonce a été soumise pour validation. Vous serez notifié dès qu'elle sera approuvée."}
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
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Modifier le logement' : 'Ajouter un logement'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Modifiez les informations de votre annonce'
                : 'Remplissez les informations pour créer votre annonce'}
            </p>
          </div>
        </div>

        {!isEditMode && <ProgressBar />}

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
                  placeholder="Ex : Magnifique Villa avec Vue Mer"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <p className="text-sm text-muted-foreground mt-1">{formData.title.length}/100</p>
              </div>

              <div>
                <label className="block font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre logement en détail…"
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">{formData.description.length}/2000</p>
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
                  {SPACE_TYPES.map(type => {
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
                        <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : ''}`}>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isEditMode && (
                <button type="button" onClick={nextStep} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                  Continuer
                </button>
              )}
            </div>
          )}

          {/* Step 2: Details & Price */}
          {(currentStep === 2 || isEditMode) && (
            <div className={`space-y-6 ${isEditMode && currentStep !== 2 ? 'mt-8 pt-8 border-t border-border' : ''}`}>
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
                  <label className="block font-semibold mb-2">Voyageurs max *</label>
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
                  <label className="block font-semibold mb-2">Chambres *</label>
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
                  <label className="block font-semibold mb-2">Salles de bain *</label>
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
                  {AMENITIES_LIST.map(amenity => {
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
                        <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : ''}`}>{amenity.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isEditMode && (
                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 py-3 border border-border rounded-xl hover:bg-accent transition-colors">
                    Retour
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                    Continuer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Photos */}
          {(currentStep === 3 || isEditMode) && (
            <div className={`space-y-8 ${isEditMode ? 'mt-8 pt-8 border-t border-border' : ''}`}>

              {/* Featured image */}
              <div>
                <label className="block font-semibold mb-3">
                  Image principale {!isEditMode && '*'}
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  C'est l'image affichée dans les résultats de recherche et les miniatures.
                </p>

                {imagePreview ? (
                  <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Image principale du logement"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Photo principale
                    </span>
                  </div>
                ) : (
                  <label className="relative w-full max-w-md aspect-video rounded-xl border-2 border-dashed border-border hover:border-blue-400 cursor-pointer transition-colors flex flex-col items-center justify-center">
                    <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour ajouter une image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · Max 5 MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                )}

                {isEditMode && imagePreview && (
                  <p className="text-sm text-muted-foreground mt-2">
                    L'image actuelle sera remplacée si vous en téléchargez une nouvelle.
                  </p>
                )}
              </div>

              {/* Gallery / detail images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-semibold">Photos de détail</label>
                  <span className="text-sm text-muted-foreground">
                    {totalGalleryCount()}/{MAX_GALLERY_IMAGES}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Ajoutez plusieurs photos (chambres, salle de bain, cuisine, vue…) pour la galerie affichée sur la page de détail.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Existing images already saved on the server (edit mode) */}
                  {existingGallery.map(img => {
                    const markedForDeletion = imagesToDelete.includes(img.id);
                    return (
                      <div
                        key={`existing-${img.id}`}
                        className={`relative aspect-square rounded-xl overflow-hidden border border-border transition-opacity ${
                          markedForDeletion ? 'opacity-40' : ''
                        }`}
                      >
                        <img
                          src={img.image_path}
                          alt="Photo de détail"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleExistingGalleryDelete(img.id)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full text-white transition-colors ${
                            markedForDeletion ? 'bg-muted-foreground hover:bg-muted-foreground/80' : 'bg-red-500 hover:bg-red-600'
                          }`}
                          title={markedForDeletion ? 'Annuler la suppression' : 'Supprimer'}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {markedForDeletion && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg">
                              À supprimer
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Newly added images, not yet uploaded */}
                  {galleryPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                      <img
                        src={preview}
                        alt={`Nouvelle photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-lg">
                        Nouvelle
                      </span>
                    </div>
                  ))}

                  {/* Add button, hidden once the max is reached */}
                  {totalGalleryCount() < MAX_GALLERY_IMAGES && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-blue-400 cursor-pointer transition-colors flex flex-col items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground text-center px-2">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  )}
                </div>

                {isEditMode && imagesToDelete.length > 0 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-3">
                    {imagesToDelete.length} photo{imagesToDelete.length > 1 ? 's' : ''} sera{imagesToDelete.length > 1 ? 'ont' : ''} supprimée{imagesToDelete.length > 1 ? 's' : ''} à l'enregistrement.
                  </p>
                )}
              </div>

              {/* Upload progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload en cours…</span>
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
                  <button type="button" onClick={prevStep} className="flex-1 py-3 border border-border rounded-xl hover:bg-accent transition-colors">
                    Retour
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || (!formData.featured_image && !formData.existing_featured_image && !isEditMode)}
                  className={`${!isEditMode ? 'flex-1' : 'w-full'} py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isEditMode ? 'Modification en cours…' : 'Création en cours…'}
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