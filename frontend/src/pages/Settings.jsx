import React, { useEffect, useState, useRef } from 'react';
import { settingService } from '../services/settingService';
import { mediaService } from '../services/mediaService';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import Skeleton from '../components/Skeleton';
import { Settings as SettingsIcon, Save, Globe, Share2, PhoneCall, HardDrive, Loader2, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const { logoUrl, defaultLogoAsset, updateSettingsState, reloadSettings } = useSettings();
  const toast = useToast();

  const [settings, setSettings] = useState({
    general: { siteName: '', logo: '', tagline: '', copyrightText: '' },
    seo: { defaultSeoTitle: '', defaultMetaDescription: '', metaKeywords: '' },
    contact: { email: '', phone: '', address: '', workingHours: '' },
    socialMedia: { linkedin: '', twitter: '', facebook: '', youtube: '' },
    storage: { activeDriver: 'LOCAL', maxUploadSizeBytes: 10485760 }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingService.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      toast.error('Failed to load global site settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', 'Site Brand Logo');

      const res = await mediaService.uploadMedia(formData);
      if (res.success && res.data) {
        const uploadedUrl = res.data.url;
        setSettings((prev) => ({
          ...prev,
          general: { ...prev.general, logo: uploadedUrl }
        }));
        toast.success('Logo uploaded successfully! Click Save to apply changes.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload logo image');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetLogo = () => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, logo: '' }
    }));
    toast.info('Reset to default asset logo. Click Save Settings to confirm.');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await settingService.updateSettings(settings);
      if (res.success && res.data) {
        updateSettingsState(res.data);
        await reloadSettings();
      }
      toast.success('Site settings & brand logo saved successfully!');
    } catch (err) {
      toast.error('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const tabs = [
    { id: 'general', label: 'General & Logo', icon: Globe },
    { id: 'seo', label: 'SEO Metadata', icon: Save },
    { id: 'contact', label: 'Contact Info', icon: PhoneCall },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'storage', label: 'Storage Engine', icon: HardDrive }
  ];

  const currentPreviewLogo = settings.general?.logo && settings.general.logo.trim() !== ''
    ? settings.general.logo
    : defaultLogoAsset;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-emerald-600" />
          Global CMS Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure site metadata, brand logo, contact details, and platform defaults.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs text-xs text-slate-700">
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Site Logo Section */}
            <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    Website & CMS Brand Logo
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload a custom logo image or reset to default asset logo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-all text-xs"
                  title="Reset to default logo asset"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Reset to Default Asset
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                {/* Logo Preview Box */}
                <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center p-3 relative overflow-hidden group shrink-0">
                  <img
                    src={currentPreviewLogo}
                    alt="Brand Logo Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold text-center p-1 backdrop-blur-xs">
                    Current Active Logo
                  </div>
                </div>

                {/* Upload & Control Actions */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Upload New Logo Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={uploadingLogo}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Uploading Logo...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Choose & Upload Image
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WebP, SVG up to 10MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Site Brand Name</label>
              <input
                type="text"
                value={settings.general?.siteName || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Platform Tagline</label>
              <input
                type="text"
                value={settings.general?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, tagline: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Copyright Notice</label>
              <input
                type="text"
                value={settings.general?.copyrightText || ''}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, copyrightText: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Default SEO Title</label>
              <input
                type="text"
                value={settings.seo?.defaultSeoTitle || ''}
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, defaultSeoTitle: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Default Meta Description</label>
              <textarea
                rows="3"
                value={settings.seo?.defaultMetaDescription || ''}
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, defaultMetaDescription: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.contact?.phone || ''}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={settings.socialMedia?.linkedin || ''}
                onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, linkedin: e.target.value } })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-slate-700">
              <span className="font-bold text-emerald-900 text-sm block mb-1">Active Media Storage Driver: Cloud Storage</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cloud media storage is active. All brand logos, product images, technical datasheets, whitepapers, and project PDFs uploaded in the CMS are stored securely on the global cloud media driver.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
