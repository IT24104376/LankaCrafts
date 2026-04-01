import { useState, useEffect } from 'react';
import { TouristNavbar } from './TouristNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyBlogs, updateBlog } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UploadCloudIcon, AlertCircleIcon, Trash2Icon, XIcon } from 'lucide-react';
import { TRENDING_TAGS } from '../../constants/touristConstants';

const TOTAL_LIMIT = 40 * 1024 * 1024; // 40 MB — matches backend

interface MediaItem {
  _id?: string;
  url: string;
  publicId: string;
  mediaType: 'image' | 'video';
  order: number;
}

export function TouristBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tourist } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    workshop: '',
    content: '',
    status: 'published'
  });

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);        // newly staged uploads
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]); // current saved media
  const [removeIds, setRemoveIds] = useState<string[]>([]);    // publicIds to delete on save
  const [uploadError, setUploadError] = useState('');

  // Fetch initial blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getMyBlogs();
        const myBlog = res.data.blogs?.find((b: any) => b._id === id);
        if (myBlog) {
          if (myBlog.author !== tourist?.id) {
            setError("You don't have permission to edit this blog.");
            return;
          }
          setFormData({
            title: myBlog.title,
            workshop: myBlog.workshopTag || '',
            content: myBlog.content,
            status: myBlog.status
          });
          setSelectedHashtags(myBlog.hashtags || []);
          if (myBlog.media && myBlog.media.length > 0) {
            setExistingMedia([...myBlog.media].sort((a: MediaItem, b: MediaItem) => a.order - b.order));
          } else if (myBlog.mediaUrl) {
            setExistingMedia([{ url: myBlog.mediaUrl, publicId: myBlog.mediaPublicId || '', mediaType: myBlog.mediaType || 'image', order: 0 }]);
          }
        } else {
          setError('Blog not found.');
        }
      } catch (err) {
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    if (tourist && id) {
      fetchBlog();
    }
  }, [id, tourist]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    const next = [...newFiles, ...selected];
    const totalSize = next.reduce((s, f) => s + f.size, 0);
    if (totalSize > TOTAL_LIMIT) {
      setUploadError(`Total size exceeds 40 MB. Current: ${(totalSize / 1024 / 1024).toFixed(1)} MB.`);
      return;
    }
    setUploadError('');
    setNewFiles(next);
    e.target.value = '';
  };

  const removeNewFile = (idx: number) => setNewFiles((p) => p.filter((_, i) => i !== idx));

  const toggleRemoveExisting = (publicId: string) => {
    setRemoveIds((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const handlePublish = async (newStatus?: string) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and story content are required.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('content', formData.content.trim());
      fd.append('workshopTag', formData.workshop);
      fd.append('status', newStatus || formData.status);
      fd.append('hashtags', JSON.stringify(selectedHashtags));
      newFiles.forEach((f) => fd.append('media', f));
      if (removeIds.length > 0) fd.append('removeMediaIds', removeIds.join(','));

      await updateBlog(id!, fd);
      navigate('/tourist/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update blog.');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setDeleting(true);
    try {
      const fd = new FormData();
      fd.append('status', 'deleted');
      await updateBlog(id!, fd);
      navigate('/tourist/profile');
    } catch (err) {
      setError('Failed to delete blog.');
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FAF6F0] pt-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <TouristNavbar activeTab="profile" />

      <div className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-2">Edit Story</h1>
            <p className="text-sm text-gray-500 mb-8">Update your cultural experience.</p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-body flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Blog Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] outline-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Workshop Tag</label>
                <select value={formData.workshop} onChange={e => setFormData({ ...formData, workshop: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] outline-none text-sm bg-white">
                  <option value="">Select a workshop (optional)</option>
                  <option>Batik Workshop — Kandy</option>
                  <option>Pottery Class — Kelaniya</option>
                  <option>Wood Carving — Ambalangoda</option>
                  <option>Weaving — Jaffna</option>
                  <option>Lacquer Work — Kandy</option>
                  <option>Drumming — Kandy</option>
                  <option>Cooking — Colombo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                  Hashtags
                  <span className="text-gray-400 font-normal ml-1">(tap to select)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => {
                    const active = selectedHashtags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setSelectedHashtags((prev) =>
                            active ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className="px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-all duration-150"
                        style={{
                          backgroundColor: active ? '#C1440E' : '#FAF6F0',
                          color: active ? 'white' : '#1E1E1E',
                          borderColor: active ? '#C1440E' : '#E5E7EB',
                          fontWeight: active ? 700 : 500,
                          boxShadow: active ? '0 2px 8px rgba(193,68,14,0.25)' : 'none',
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {selectedHashtags.length > 0 && (
                  <p className="text-xs text-gray-400 font-body mt-2">
                    Selected: {selectedHashtags.join(' ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Your Story</label>
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] outline-none text-sm resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Media</label>

                {/* Existing media thumbnails */}
                {existingMedia.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {existingMedia.map((m) => {
                      const markedForRemoval = removeIds.includes(m.publicId);
                      return (
                        <div key={m._id || m.publicId} className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${markedForRemoval ? 'border-red-400 opacity-50' : 'border-gray-200'
                          }`}>
                          {m.mediaType === 'video' ? (
                            <video src={m.url} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={m.url} alt="media" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => toggleRemoveExisting(m.publicId)}
                            title={markedForRemoval ? 'Undo remove' : 'Remove this media'}
                            className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors ${markedForRemoval ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                              }`}>
                            <XIcon className="w-3 h-3" />
                          </button>
                          {markedForRemoval && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-red-600 font-bold bg-white/80 px-1 rounded">Remove</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* New file previews */}
                {newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newFiles.map((f, i) => (
                      <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border-2 border-[#1A6B6B] bg-gray-50">
                        {f.type.startsWith('video/') ? (
                          <video src={URL.createObjectURL(f)} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeNewFile(i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <XIcon className="w-4 h-4 text-white" />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-white bg-[#1A6B6B]/80 py-0.5">New</span>
                      </div>
                    ))}
                  </div>
                )}

                <label className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border-gray-200 hover:border-[#C1440E]/40">
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  <UploadCloudIcon className={`w-7 h-7 ${newFiles.length > 0 ? 'text-[#1A6B6B]' : 'text-gray-300'}`} />
                  {newFiles.length > 0 ? (
                    <p className="text-sm font-semibold text-[#1A6B6B]">
                      {newFiles.length} new file{newFiles.length !== 1 ? 's' : ''} staged — {(newFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB
                      <span className="font-normal text-gray-400 ml-1">(click to add more)</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">Click to add media <span className="text-gray-300 text-xs">(40 MB total, up to 10 files)</span></p>
                  )}
                </label>
                {uploadError && <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>}
              </div>

              <div className="pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => navigate('/tourist/profile')} disabled={submitting || deleting} className="px-6 py-3 rounded-xl border bg-white font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="button" onClick={() => handlePublish('draft')} disabled={submitting || deleting} className="px-6 py-3 rounded-xl border font-semibold text-[#1A6B6B] border-[#1A6B6B] hover:bg-[#1A6B6B] hover:text-white transition-colors">Save as Draft</button>
                  <button type="button" onClick={() => handlePublish('published')} disabled={submitting || deleting} className="px-8 py-3 rounded-xl bg-[#C1440E] text-white font-semibold hover:bg-[#A33A0C] transition-colors">
                    {submitting ? 'Saving...' : 'Publish'}
                  </button>
                </div>

                <button onClick={handleDelete} disabled={submitting || deleting} className="flex items-center gap-2 text-red-500 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto justify-center">
                  <Trash2Icon className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete Blog'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
