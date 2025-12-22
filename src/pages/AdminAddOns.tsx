import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';
import { Loader2, Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
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

const AdminAddOns = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'diy-kits'>('activities');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [diyKits, setDiyKits] = useState<DIYKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [activityForm, setActivityForm] = useState({
    name: '',
    description: '',
    image_url: ''
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/activities`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/diy-kits`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;

          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/upload/image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            credentials: 'include',
            body: JSON.stringify({
              image: base64Image,
              folder: folder,
              filename: selectedImageFile.name
            })
          });

          const data = await response.json();

          if (data.success && data.imageUrl) {
            console.log('✅ Image uploaded successfully!');
            console.log('   URL:', data.imageUrl);
            console.log('   File name:', data.fileName);
            
            // Verify it's a URL, not base64
            if (data.imageUrl.startsWith('data:image')) {
              console.error('❌ Upload returned base64 instead of URL!');
              setError('Image upload failed. Please try again.');
              return;
            }
            
            // Update the form with the uploaded image URL
            if (activeTab === 'activities') {
              const updatedForm = { ...activityForm, image_url: data.imageUrl };
              console.log('   Updated activity form:', updatedForm);
              setActivityForm(updatedForm);
              setImagePreview(data.imageUrl); // Set to URL, not base64
            } else {
              const updatedForm = { ...diyKitForm, image_url: data.imageUrl };
              console.log('   Updated DIY kit form:', updatedForm);
              setDiyKitForm(updatedForm);
              setImagePreview(data.imageUrl); // Set to URL, not base64
            }
            setSelectedImageFile(null);
            // Reset file input
            const fileInputActivity = document.getElementById('image-upload-activity') as HTMLInputElement;
            const fileInputDIY = document.getElementById('image-upload-diy') as HTMLInputElement;
            if (fileInputActivity) fileInputActivity.value = '';
            if (fileInputDIY) fileInputDIY.value = '';
          } else {
            setError(data.message || 'Failed to upload image');
          }
        } catch (err: any) {
          console.error('Error uploading image:', err);
          setError(err.message || 'Failed to upload image');
        } finally {
          setUploadingImage(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setUploadingImage(false);
      };

      reader.readAsDataURL(selectedImageFile);
    } catch (err: any) {
      console.error('Error processing image:', err);
      setError(err.message || 'Failed to process image');
      setUploadingImage(false);
    }
  };

  const handleAddActivity = () => {
    setIsAdding(true);
    setEditingId(null);
    setActivityForm({
      name: '',
      description: '',
      image_url: ''
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
      image_url: imageUrl
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
      }
      
      const payload = {
        name: activityForm.name,
        description: activityForm.description,
        image_url: imageUrl
      };
      
      console.log('💾 Saving activity with payload:', payload);
      console.log('   Image preview state:', imagePreview);
      console.log('   Form image_url state:', activityForm.image_url);
      console.log('   Final image URL being saved:', imageUrl);
      
      const url = editingId
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/activities/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/activities`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      console.log('📥 Save response:', data);
      if (data.success && data.activity) {
        console.log('✅ Activity saved successfully!');
        console.log('   Saved activity data:', data.activity);
        console.log('   Image URL in saved data:', data.activity.image_url);
        console.log('   Image URL type:', typeof data.activity.image_url);
        console.log('   Image URL length:', data.activity.image_url?.length);
      }
      
      if (data.success) {
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        // Refresh data to get updated activities
        await fetchData();
        setEditingId(null);
        setIsAdding(false);
        setActivityForm({
          name: '',
          description: '',
          image_url: ''
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
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchData();
      } else {
        setError(data.message || 'Failed to delete activity');
      }
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      setError(err.message || 'Failed to delete activity');
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
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/diy-kits/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/diy-kits`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
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
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        // Refresh data to get updated DIY kits
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
    }
  };

  const handleDeleteDIYKit = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/addons/diy-kits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchData();
      } else {
        setError(data.message || 'Failed to delete DIY kit');
      }
    } catch (err: any) {
      console.error('Error deleting DIY kit:', err);
      setError(err.message || 'Failed to delete DIY kit');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setActivityForm({
      name: '',
      description: '',
      image_url: ''
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Add Ons Management</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab('activities');
              cancelEdit();
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'activities'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => {
              setActiveTab('diy-kits');
              cancelEdit();
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'diy-kits'
                ? 'border-b-2 border-purple-600 text-purple-600'
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activities</h2>
              {!isAdding && !editingId && (
                <button
                  onClick={handleAddActivity}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Activity</span>
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {editingId ? 'Edit Activity' : 'Add New Activity'}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Activity name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Activity description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="space-y-2">
                      {/* Image Preview */}
                      {(imagePreview || (activityForm.image_url && activityForm.image_url.trim() !== '')) && (
                        <div 
                          ref={(el) => {
                            scrollContainerRef.current = el;
                          }}
                          className="relative w-full h-48 border border-gray-300 rounded-lg overflow-auto bg-gray-100 dark:bg-gray-700"
                          style={{ scrollbarWidth: 'thin' }}
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
                          <div className="sticky top-2 right-2 float-right flex gap-2 z-10 clear-both">
                            <button
                              type="button"
                              onClick={resetImagePosition}
                              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                              title="Reset position"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
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
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="sticky bottom-2 left-2 float-left text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded z-10">
                            Drag to reposition • Use scrollbars to adjust view
                          </div>
                        </div>
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
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  {activity.image_url && (
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {activity.name}
                      </h3>
                      {editingId !== activity.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="499"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="space-y-2">
                      {/* Image Preview */}
                      {(imagePreview || (diyKitForm.image_url && diyKitForm.image_url.trim() !== '')) && (
                        <div 
                          ref={(el) => {
                            scrollContainerRef.current = el;
                          }}
                          className="relative w-full h-48 border border-gray-300 rounded-lg overflow-auto bg-gray-100 dark:bg-gray-700"
                          style={{ scrollbarWidth: 'thin' }}
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
                          <div className="sticky top-2 right-2 float-right flex gap-2 z-10 clear-both">
                            <button
                              type="button"
                              onClick={resetImagePosition}
                              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                              title="Reset position"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
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
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="sticky bottom-2 left-2 float-left text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded z-10">
                            Drag to reposition • Use scrollbars to adjust view
                          </div>
                        </div>
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
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={5}
                      placeholder="Detailed description of the DIY kit..."
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSaveDIYKit}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diyKits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  {kit.image_url && (
                    <img
                      src={kit.image_url}
                      alt={kit.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {kit.name}
                      </h3>
                      {editingId !== kit.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDIYKit(kit)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDIYKit(kit.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xl font-bold text-orange-600 mb-2">₹{kit.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {kit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAddOns;

