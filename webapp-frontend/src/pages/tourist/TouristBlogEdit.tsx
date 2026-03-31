import { useState, useEffect } from 'react';
import { TouristNavbar } from './TouristNavbar';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyBlogs, updateBlog } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UploadCloudIcon, AlertCircleIcon, Trash2Icon } from 'lucide-react';

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

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentMediaUrl, setCurrentMediaUrl] = useState('');

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
          setCurrentMediaUrl(myBlog.mediaUrl);
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
    const file = e.target.files?.[0];
    if (file && file.size <= 30 * 1024 * 1024) {
      setUploadedFile(file);
    }
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
      if (newStatus) {
        fd.append('status', newStatus);
      } else {
        fd.append('status', formData.status);
      }
      if (uploadedFile) fd.append('media', uploadedFile);

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
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Your Story</label>
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] outline-none text-sm resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Media</label>
                {currentMediaUrl && !uploadedFile && (
                  <div className="mb-3 relative w-48 h-32 rounded-lg overflow-hidden border">
                    <img src={currentMediaUrl} alt="Current media" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border-gray-200 hover:border-[#C1440E]/40">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  <UploadCloudIcon className={`w-8 h-8 ${uploadedFile ? 'text-[#1A6B6B]' : 'text-gray-300'}`} />
                  {uploadedFile ? (
                    <p className="text-sm font-semibold text-[#1A6B6B]">New file: {uploadedFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Click to upload new media (replaces old)</p>
                  )}
                </label>
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
