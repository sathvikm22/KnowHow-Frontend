import React, { useMemo, useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api, getBackendBaseUrl } from '@/lib/api';
import { Loader2, Plus, Edit, Trash2, Save, X, Upload, Search } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category?: 'group' | 'individual';
  price?: number;
  created_at: string;
  updated_at: string;
}

interface DIYKit {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

const optimiseImageForUpload = async (file: File): Promise<File> => {
  // SVG/GIF files are deliberately left untouched: drawing them to canvas can
  // remove vector data or animation. JPEG/PNG/WebP photos become a smaller WebP.
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = objectUrl;
    });
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
    if (!blob) return file;
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const AdminAddOns = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'diy-kits'>('activities');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [diyKits, setDiyKits] = useState<DIYKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [activityForm, setActivityForm] = useState({
    name: '',
    description: '',
    image_url: '',
    category: 'group' as 'group' | 'individual',
    price: ''
  });

  const [diyKitForm, setDiyKitForm] = useState({
    name: '',
    price: '',
    image_url: '',
    description: ''
  });

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  
  // Image positioning states for drag and scroll
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const scrollContainerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'activities') {
        const response = await fetch(`${getBackendBaseUrl()}/api/addons/activities?admin=1`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
            // NO Authorization header - tokens are in HttpOnly cookies
          }
        });
        const data = await response.json();
        console.log('📥 Admin: Fetched activities:', data);
        if (data.success) {
          const activities = data.activities || [];
          console.log(`   Found ${activities.length} activities`);
          activities.forEach((activity: Activity) => {
            console.log(`   - ${activity.name}: image_url = ${activity.image_url || 'NULL'}`);
          });
          setActivities(activities);
        } else {
          setError(data.message || 'Failed to fetch activities');
        }
      } else {
        const response = await fetch(`${getBackendBaseUrl()}/api/addons/diy-kits?admin=1`, {
          credentials: 'include',
          headers: {
            // NO Authorization header - tokens are in HttpOnly cookies
          }
        });
        const data = await response.json();
        console.log('📥 Admin: Fetched DIY kits:', data);
        if (data.success) {
          const kits = data.kits || [];
          console.log(`   Found ${kits.length} DIY kits`);
          kits.forEach((kit: DIYKit) => {
            console.log(`   - ${kit.name}: image_url = ${kit.image_url || 'NULL'}`);
          });
          setDiyKits(kits);
        } else {
          setError(data.message || 'Failed to fetch DIY kits');
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const matchesSearch = (name: string, price: number | undefined) => {
    const query = searchInput.trim().toLowerCase();
    return !query || `${name} ${price ?? ''}`.toLowerCase().includes(query);
  };

  const filteredActivities = useMemo(
    () => activities.filter((activity) => matchesSearch(activity.name, activity.price)),
    [activities, searchInput]
  );
  const filteredDIYKits = useMemo(
    () => diyKits.filter((kit) => matchesSearch(kit.name, kit.price)),
    [diyKits, searchInput]
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'activities' | 'diy-kits') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setSelectedImageFile(file);
      setImagePosition({ x: 0, y: 0 }); // Reset position when new image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag handlers for image positioning
  const handleMouseDown = (e: React.MouseEvent, container: HTMLElement | null) => {
    if (!container) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX + container.scrollLeft,
      y: e.clientY + container.scrollTop
    });
  };

  const handleMouseMove = (e: React.MouseEvent, container: HTMLElement | null) => {
    if (isDragging && container) {
      e.preventDefault();
      container.scrollLeft = dragStart.x - e.clientX;
      container.scrollTop = dragStart.y - e.clientY;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset image position (scroll to top-left)
  const resetImagePosition = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }
    setImagePosition({ x: 0, y: 0 });
  };

  const handleImageUpload = async (folder: 'activities' | 'diy-kits') => {
    if (!selectedImageFile) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const optimizedFile = await optimiseImageForUpload(selectedImageFile);
      if (optimizedFile.size > 5 * 1024 * 1024) {
        throw new Error('Image is still larger than 5MB after optimisation. Please choose a smaller image.');
      }

      const signResponse = await fetch(`${getBackendBaseUrl()}/api/upload/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          folder,
          filename: optimizedFile.name,
          contentType: optimizedFile.type,
          size: optimizedFile.size,
        }),
      });
      const signedUpload = await signResponse.json();
      if (!signResponse.ok || !signedUpload.success || !signedUpload.signedUploadUrl) {
        throw new Error(signedUpload.message || 'Could not prepare image upload');
      }

      const uploadResponse = await fetch(signedUpload.signedUploadUrl, {
        method: 'PUT',
        // Each upload gets a unique file name, so it is safe for browsers and
        // the CDN to keep the optimized image for a long time.
        headers: {
          'Content-Type': optimizedFile.type,
          'cache-control': 'public, max-age=31536000, immutable',
        },
        body: optimizedFile,
      });
      if (!uploadResponse.ok) {
        throw new Error('Image upload to storage failed. Please try again.');
      }

      if (activeTab === 'activities') {
        setActivityForm((current) => ({ ...current, image_url: signedUpload.imageUrl }));
      } else {
        setDiyKitForm((current) => ({ ...current, image_url: signedUpload.imageUrl }));
      }
      setImagePreview(signedUpload.imageUrl);
      setSelectedImageFile(null);
      const fileInputActivity = document.getElementById('image-upload-activity') as HTMLInputElement;
      const fileInputDIY = document.getElementById('image-upload-diy') as HTMLInputElement;
      if (fileInputActivity) fileInputActivity.value = '';
      if (fileInputDIY) fileInputDIY.value = '';
    } catch (err: any) {
      console.error('Error processing image:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddActivity = () => {
    setIsAdding(true);
    setEditingId(null);
    setActivityForm({
      name: '',
      description: '',
      image_url: '',
      category: 'group',
      price: ''
    });
    setImagePreview(null);
    setSelectedImageFile(null);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleEditActivity = (activity: Activity) => {
    console.log('✏️ Editing activity:', activity);
    console.log('   Current image_url:', activity.image_url);
    setEditingId(activity.id);
    setIsAdding(false);
    const imageUrl = activity.image_url && activity.image_url.trim() !== '' ? activity.image_url.trim() : '';
    setActivityForm({
      name: activity.name,
      description: activity.description,
      image_url: imageUrl,
      category: activity.category || 'group',
      price: activity.price?.toString() || ''
    });
    // Set image preview to show existing image
    setImagePreview(imageUrl || null);
    setSelectedImageFile(null);
    setImagePosition({ x: 0, y: 0 });
    console.log('   Form state set with image_url:', imageUrl);
    console.log('   Image preview set to:', imageUrl || null);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-lg');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSaveActivity = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Ensure image_url is included in the request
      // Use imagePreview if available (newly uploaded), otherwise use form image_url
      // IMPORTANT: Only send URLs, never base64 data
      const imageUrlToSave = imagePreview || activityForm.image_url;
      let imageUrl = null;
      
      if (imageUrlToSave && imageUrlToSave.trim() !== '') {
        const trimmed = imageUrlToSave.trim();
        // Check if it's base64 data - if so, don't send it (image wasn't uploaded properly)
        if (trimmed.startsWith('data:image')) {
          console.error('❌ Cannot save base64 data! Image must be uploaded first.');
          setError('Please upload the image first before saving. The image upload may have failed.');
          return;
        }
        // It's a URL, safe to save
        imageUrl = trimmed;
      } else {
        // Warn if no image is provided (but allow saving - frontend will show placeholder)
        console.warn('⚠️  No image URL provided for activity. Frontend will show placeholder.');
      }
      
      const payload = {
        name: activityForm.name,
        description: activityForm.description,
        image_url: imageUrl,
        category: activityForm.category,
        price: activityForm.price ? parseFloat(activityForm.price) : 0
      };
      
      console.log('💾 Saving activity with payload:', payload);
      console.log('   Image preview state:', imagePreview);
      console.log('   Form image_url state:', activityForm.image_url);
      console.log('   Final image URL being saved:', imageUrl);
      
      const url = editingId
        ? `${getBackendBaseUrl()}/api/addons/activities/${editingId}`
        : `${getBackendBaseUrl()}/api/addons/activities`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // NO Authorization header - tokens are in HttpOnly cookies
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save activity');
      }
      
      console.log('📥 Save response:', data);
      if (data.success && data.activity) {
        console.log('✅ Activity saved successfully!');
        console.log('   Saved activity data:', data.activity);
        console.log('   Image URL in saved data:', data.activity.image_url);
        console.log('   Image URL type:', typeof data.activity.image_url);
        console.log('   Image URL length:', data.activity.image_url?.length);
      }
      
      if (data.success) {
        api.invalidatePublicCatalog();
        await fetchData();
        setEditingId(null);
        setIsAdding(false);
        setActivityForm({
          name: '',
          description: '',
          image_url: '',
          category: 'group',
          price: ''
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setImagePosition({ x: 0, y: 0 });
      } else {
        setError(data.message || 'Failed to save activity');
      }
    } catch (err: any) {
      console.error('Error saving activity:', err);
      setError(err.message || 'Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const activity = activities.find((item) => item.id === id);
    if (!window.confirm(`Delete “${activity?.name || 'this workshop'}”? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      setError(null);
      const response = await fetch(`${getBackendBaseUrl()}/api/addons/activities/${id}`, {
        method: 'DELETE',
        headers: {
          // NO Authorization header - tokens are in HttpOnly cookies
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete activity');
      }
      
      if (data.success) {
        setActivities((current) => current.filter((item) => item.id !== id));
        api.invalidatePublicCatalog();
        await fetchData();
      } else {
        setError(data.message || 'Failed to delete activity');
      }
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      setError(err.message || 'Failed to delete activity');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddDIYKit = () => {
    setIsAdding(true);
    setEditingId(null);
    setDiyKitForm({
      name: '',
      price: '',
      image_url: '',
      description: ''
    });
    setImagePreview(null);
    setSelectedImageFile(null);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleEditDIYKit = (kit: DIYKit) => {
    console.log('✏️ Editing DIY kit:', kit);
    console.log('   Current image_url:', kit.image_url);
    setEditingId(kit.id);
    setIsAdding(false);
    const imageUrl = kit.image_url && kit.image_url.trim() !== '' ? kit.image_url.trim() : '';
    setDiyKitForm({
      name: kit.name,
      price: kit.price.toString(),
      image_url: imageUrl,
      description: kit.description
    });
    // Set image preview to show existing image
    setImagePreview(imageUrl || null);
    setSelectedImageFile(null);
    setImagePosition({ x: 0, y: 0 });
    console.log('   Form state set with image_url:', imageUrl);
    console.log('   Image preview set to:', imageUrl || null);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-lg');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSaveDIYKit = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Ensure image_url is included in the request
      // Use imagePreview if available (newly uploaded), otherwise use form image_url
      // IMPORTANT: Only send URLs, never base64 data
      const imageUrlToSave = imagePreview || diyKitForm.image_url;
      let imageUrl = null;
      
      if (imageUrlToSave && imageUrlToSave.trim() !== '') {
        const trimmed = imageUrlToSave.trim();
        // Check if it's base64 data - if so, don't send it (image wasn't uploaded properly)
        if (trimmed.startsWith('data:image')) {
          console.error('❌ Cannot save base64 data! Image must be uploaded first.');
          setError('Please upload the image first before saving. The image upload may have failed.');
          return;
        }
        // It's a URL, safe to save
        imageUrl = trimmed;
      }
      
      const payload = {
        name: diyKitForm.name,
        price: parseFloat(diyKitForm.price),
        description: diyKitForm.description,
        image_url: imageUrl
      };
      
      console.log('💾 Saving DIY kit with payload:', payload);
      console.log('   Image preview state:', imagePreview);
      console.log('   Form image_url state:', diyKitForm.image_url);
      console.log('   Final image URL being saved:', imageUrl);
      
      const url = editingId
        ? `${getBackendBaseUrl()}/api/addons/diy-kits/${editingId}`
        : `${getBackendBaseUrl()}/api/addons/diy-kits`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // NO Authorization header - tokens are in HttpOnly cookies
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save DIY kit');
      }
      
      console.log('📥 Save response:', data);
      if (data.success && (data.kit || data.diyKit)) {
        const savedKit = data.kit || data.diyKit;
        console.log('✅ DIY kit saved successfully!');
        console.log('   Saved DIY kit data:', savedKit);
        console.log('   Image URL in saved data:', savedKit.image_url);
        console.log('   Image URL type:', typeof savedKit.image_url);
        console.log('   Image URL length:', savedKit.image_url?.length);
      }
      
      if (data.success) {
        api.invalidatePublicCatalog();
        await fetchData();
        setEditingId(null);
        setIsAdding(false);
        setDiyKitForm({
          name: '',
          price: '',
          image_url: '',
          description: ''
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setImagePosition({ x: 0, y: 0 });
      } else {
        setError(data.message || 'Failed to save DIY kit');
      }
    } catch (err: any) {
      console.error('Error saving DIY kit:', err);
      setError(err.message || 'Failed to save DIY kit');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDIYKit = async (id: string) => {
    const kit = diyKits.find((item) => item.id === id);
    if (!window.confirm(`Delete “${kit?.name || 'this DIY kit'}”? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      setError(null);
      const response = await fetch(`${getBackendBaseUrl()}/api/addons/diy-kits/${id}`, {
        method: 'DELETE',
        headers: {
          // NO Authorization header - tokens are in HttpOnly cookies
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete DIY kit');
      }
      
      if (data.success) {
        setDiyKits((current) => current.filter((item) => item.id !== id));
        api.invalidatePublicCatalog();
        await fetchData();
      } else {
        setError(data.message || 'Failed to delete DIY kit');
      }
    } catch (err: any) {
      console.error('Error deleting DIY kit:', err);
      setError(err.message || 'Failed to delete DIY kit');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setActivityForm({
      name: '',
      description: '',
      image_url: '',
      category: 'group',
      price: ''
    });
    setDiyKitForm({
      name: '',
      price: '',
      image_url: '',
      description: ''
    });
    setImagePreview(null);
    setSelectedImageFile(null);
    setImagePosition({ x: 0, y: 0 });
  };

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white">Add Ons Management</h1>
          <label className="relative block w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name or price"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </label>
        </div>
        {loading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-orange-600" /> Loading add-ons…
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab('activities');
              setSearchInput('');
              cancelEdit();
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'activities'
                ? 'border-b-2 border-purple-600 text-orange-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => {
              setActiveTab('diy-kits');
              setSearchInput('');
              cancelEdit();
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'diy-kits'
                ? 'border-b-2 border-purple-600 text-orange-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            DIY Kits
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Activities Section */}
        {activeTab === 'activities' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Workshops</h2>
              {!isAdding && !editingId && (
                <button
                  onClick={handleAddActivity}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Workshop</span>
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {editingId ? 'Edit Workshop' : 'Add New Workshop'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={activityForm.name}
                      onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Workshop name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={activityForm.price}
                      onChange={(e) => setActivityForm({ ...activityForm, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Workshop description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {(imagePreview || (activityForm.image_url && activityForm.image_url.trim() !== '')) && (
                        <>
                          {/* Control Buttons - Outside Image Frame */}
                          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>💡 Drag image or use scrollbars to adjust position</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={resetImagePosition}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                title="Reset position to center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Reset</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setSelectedImageFile(null);
                                  setActivityForm({ ...activityForm, image_url: '' });
                                  setImagePosition({ x: 0, y: 0 });
                                  const fileInput = document.getElementById('image-upload-activity') as HTMLInputElement;
                                  if (fileInput) fileInput.value = '';
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Image Container with Improved Scrollbar */}
                        <div 
                          ref={(el) => {
                            scrollContainerRef.current = el;
                          }}
                            className="relative w-full h-64 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-auto bg-gray-100 dark:bg-gray-700 custom-image-scrollbar shadow-inner"
                        >
                          <div
                            className="relative"
                            style={{
                              cursor: isDragging ? 'grabbing' : 'grab',
                              userSelect: 'none',
                              width: 'max-content',
                              height: 'max-content',
                              minWidth: '100%',
                              minHeight: '100%'
                            }}
                            onMouseDown={(e) => {
                              const container = e.currentTarget.closest('.overflow-auto') as HTMLElement;
                              handleMouseDown(e, container);
                            }}
                            onMouseMove={(e) => {
                              const container = e.currentTarget.closest('.overflow-auto') as HTMLElement;
                              handleMouseMove(e, container);
                            }}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          >
                            <img
                              key={imagePreview || activityForm.image_url}
                              src={imagePreview || activityForm.image_url || ''}
                              alt="Preview"
                              className="block"
                              style={{
                                pointerEvents: 'none',
                                maxWidth: 'none',
                                height: 'auto',
                                display: 'block'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                console.error('❌ Preview image failed to load:', imagePreview || activityForm.image_url);
                                target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                console.log('✅ Preview image loaded:', imagePreview || activityForm.image_url);
                                const img = e.target as HTMLImageElement;
                                // Make image larger to enable scrolling - scale to 1.5x container size minimum
                                const container = img.closest('.overflow-auto') as HTMLElement;
                                if (container) {
                                  const containerWidth = container.clientWidth;
                                  const containerHeight = container.clientHeight;
                                  const scale = 1.5; // Scale factor to ensure scrolling is possible
                                  // Ensure image is at least scale times the container size
                                  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                                    if (containerWidth / containerHeight > aspectRatio) {
                                      // Container is wider, scale based on height
                                      img.style.height = `${containerHeight * scale}px`;
                                      img.style.width = 'auto';
                                    } else {
                                      // Container is taller, scale based on width
                                      img.style.width = `${containerWidth * scale}px`;
                                      img.style.height = 'auto';
                                    }
                                  }
                                }
                                // Reset position when image loads
                                resetImagePosition();
                              }}
                              draggable={false}
                            />
                          </div>
                          </div>
                        </>
                      )}
                      
                      {/* File Upload */}
                      <div className="flex space-x-2">
                        <input
                          id="image-upload-activity"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, 'activities')}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-activity"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {selectedImageFile ? selectedImageFile.name : 'Choose Image File'}
                        </label>
                        {selectedImageFile && (
                          <button
                            type="button"
                            onClick={() => handleImageUpload('activities')}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSaveActivity}
                    disabled={saving || uploadingImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{saving ? 'Saving…' : 'Save'}</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Activities List */}
            {filteredActivities.length === 0 && !loading ? (
              <p className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 shadow">No workshops match this search.</p>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="min-w-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  {activity.image_url && (
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="w-full h-28 sm:h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="min-w-0 truncate pr-1 text-sm sm:text-lg font-semibold text-gray-800 dark:text-white" title={activity.name}>
                        {activity.name}
                      </h3>
                      {editingId !== activity.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditActivity(activity)}
                            disabled={saving || deletingId !== null}
                            aria-label={`Edit ${activity.name}`}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            disabled={saving || deletingId !== null}
                            aria-label={`Delete ${activity.name}`}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === activity.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-end mt-2">
                      {activity.price !== undefined && activity.price > 0 && (
                        <span className="text-sm font-semibold text-orange-600">₹{activity.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* DIY Kits Section */}
        {activeTab === 'diy-kits' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">DIY Kits</h2>
              {!isAdding && !editingId && (
                <button
                  onClick={handleAddDIYKit}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add DIY Kit</span>
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {editingId ? 'Edit DIY Kit' : 'Add New DIY Kit'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={diyKitForm.name}
                      onChange={(e) => setDiyKitForm({ ...diyKitForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="DIY Kit name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={diyKitForm.price}
                      onChange={(e) => setDiyKitForm({ ...diyKitForm, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="499"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {(imagePreview || (diyKitForm.image_url && diyKitForm.image_url.trim() !== '')) && (
                        <>
                          {/* Control Buttons - Outside Image Frame */}
                          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>💡 Drag image or use scrollbars to adjust position</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={resetImagePosition}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                title="Reset position to center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Reset</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setSelectedImageFile(null);
                                  setDiyKitForm({ ...diyKitForm, image_url: '' });
                                  setImagePosition({ x: 0, y: 0 });
                                  const fileInput = document.getElementById('image-upload-diy') as HTMLInputElement;
                                  if (fileInput) fileInput.value = '';
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Image Container with Improved Scrollbar */}
                        <div 
                          ref={(el) => {
                            scrollContainerRef.current = el;
                          }}
                            className="relative w-full h-64 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-auto bg-gray-100 dark:bg-gray-700 custom-image-scrollbar shadow-inner"
                        >
                          <div
                            className="relative"
                            style={{
                              cursor: isDragging ? 'grabbing' : 'grab',
                              userSelect: 'none',
                              width: 'max-content',
                              height: 'max-content',
                              minWidth: '100%',
                              minHeight: '100%'
                            }}
                            onMouseDown={(e) => {
                              const container = e.currentTarget.closest('.overflow-auto') as HTMLElement;
                              handleMouseDown(e, container);
                            }}
                            onMouseMove={(e) => {
                              const container = e.currentTarget.closest('.overflow-auto') as HTMLElement;
                              handleMouseMove(e, container);
                            }}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          >
                            <img
                              key={imagePreview || diyKitForm.image_url}
                              src={imagePreview || diyKitForm.image_url || ''}
                              alt="Preview"
                              className="block"
                              style={{
                                pointerEvents: 'none',
                                maxWidth: 'none',
                                height: 'auto',
                                display: 'block'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                console.error('❌ Preview image failed to load:', imagePreview || diyKitForm.image_url);
                                target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                console.log('✅ Preview image loaded:', imagePreview || diyKitForm.image_url);
                                const img = e.target as HTMLImageElement;
                                // Make image larger to enable scrolling - scale to 1.5x container size minimum
                                const container = img.closest('.overflow-auto') as HTMLElement;
                                if (container) {
                                  const containerWidth = container.clientWidth;
                                  const containerHeight = container.clientHeight;
                                  const scale = 1.5; // Scale factor to ensure scrolling is possible
                                  // Ensure image is at least scale times the container size
                                  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                                    if (containerWidth / containerHeight > aspectRatio) {
                                      // Container is wider, scale based on height
                                      img.style.height = `${containerHeight * scale}px`;
                                      img.style.width = 'auto';
                                    } else {
                                      // Container is taller, scale based on width
                                      img.style.width = `${containerWidth * scale}px`;
                                      img.style.height = 'auto';
                                    }
                                  }
                                }
                                // Reset position when image loads
                                resetImagePosition();
                              }}
                              draggable={false}
                            />
                          </div>
                          </div>
                        </>
                      )}
                      
                      {/* File Upload */}
                      <div className="flex space-x-2">
                        <input
                          id="image-upload-diy"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, 'diy-kits')}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-diy"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {selectedImageFile ? selectedImageFile.name : 'Choose Image File'}
                        </label>
                        {selectedImageFile && (
                          <button
                            type="button"
                            onClick={() => handleImageUpload('diy-kits')}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={diyKitForm.description}
                      onChange={(e) => setDiyKitForm({ ...diyKitForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={5}
                      placeholder="Detailed description of the DIY kit..."
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSaveDIYKit}
                    disabled={saving || uploadingImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{saving ? 'Saving…' : 'Save'}</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* DIY Kits List */}
            {filteredDIYKits.length === 0 && !loading ? (
              <p className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 shadow">No DIY kits match this search.</p>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredDIYKits.map((kit) => (
                <div
                  key={kit.id}
                  className="min-w-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  {kit.image_url && (
                    <img
                      src={kit.image_url}
                      alt={kit.name}
                      className="w-full h-28 sm:h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="min-w-0 truncate pr-1 text-sm sm:text-lg font-semibold text-gray-800 dark:text-white" title={kit.name}>
                        {kit.name}
                      </h3>
                      {editingId !== kit.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDIYKit(kit)}
                            disabled={saving || deletingId !== null}
                            aria-label={`Edit ${kit.name}`}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDIYKit(kit.id)}
                            disabled={saving || deletingId !== null}
                            aria-label={`Delete ${kit.name}`}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === kit.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-base sm:text-xl font-bold text-orange-600 mb-2">₹{kit.price}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {kit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAddOns;
