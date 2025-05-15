import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/admin/login');
      else {
        setUser(user);
        fetchData();
      }
    }
    checkUser();
  }, [navigate]);

  async function fetchData() {
    setLoading(true);
    try {
      const [{ data: blogs, error: blogsError }, { data: posts, error: postsError }, { data: metadata, error: metadataError }] =
        await Promise.all([
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('posts').select('*').order('created_at', { ascending: false }),
          supabase.from('website_metadata').select('id, key, value'),
        ]);
      if (blogsError || postsError || metadataError) throw new Error(blogsError?.message || postsError?.message || metadataError?.message);
      setBlogs(blogs);
      setPosts(posts);
      setMetadata(metadata.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}));
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'read_time' ? Number(value) || 0 : value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  async function uploadFile(bucket, file) {
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from(bucket).upload(`public/${fileName}`, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(`public/${fileName}`).data.publicUrl;
  }

  const handleSubmit = async (e, type, id = null) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let imageUrl = formData.image_url || '';
      if (file) {
        const bucket = type === 'blogs' ? 'blog-images' : type === 'posts' ? 'image-url' : 'website-assets';
        if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error('Use JPEG or PNG.');
        imageUrl = await uploadFile(bucket, file);
      }

      const config = {
        blogs: {
          table: 'blogs',
          required: ['title', 'subtitle', 'author', 'date', 'full_description'],
          data: { title: formData.title, subtitle: formData.subtitle, image_url: imageUrl, author: formData.author, date: formData.date, read_time: formData.read_time, full_description: formData.full_description },
        },
        posts: {
          table: 'posts',
          required: ['title', 'url'],
          data: { title: formData.title, url: formData.url, image_url: imageUrl },
        },
        metadata: {
          table: 'website_metadata',
          required: ['key', 'value'],
          data: { key: formData.key, value: JSON.parse(formData.value || '{}') },
        },
      };

      const { table, required, data } = config[type];
      if (required.some((field) => !formData[field])) throw new Error(`Fill all required ${type} fields`);

      const { error } = id ? await supabase.from(table).update(data).eq('id', id) : await supabase.from(table).insert([data]);
      if (error) throw error;

      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} ${id ? 'updated' : 'added'} successfully!`);
      setFormData({});
      setFile(null);
      fetchData();
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const { error } = await supabase.from(type).delete().eq('id', id);
      if (error) throw error;
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      fetchData();
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const formFields = {
    blogs: [
      { name: 'title', type: 'text', placeholder: 'Title', required: true },
      { name: 'subtitle', type: 'text', placeholder: 'Subtitle', required: true },
      { name: 'image', type: 'file', accept: 'image/*' },
      { name: 'author', type: 'text', placeholder: 'Author', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'read_time', type: 'number', placeholder: 'Read Time (min)', min: 0, required: true },
      { name: 'full_description', type: 'textarea', placeholder: 'Description (Markdown)', required: true },
    ],
    posts: [
      { name: 'title', type: 'text', placeholder: 'Title', required: true },
      { name: 'url', type: 'url', placeholder: 'URL', required: true },
      { name: 'image', type: 'file', accept: 'image/*' },
    ],
    metadata: [
      { name: 'key', type: 'text', placeholder: 'Key', required: true },
      { name: 'value', type: 'textarea', placeholder: 'Value (JSON)', required: true },
    ],
  };

  const renderForm = (type, data = {}) => (
    <form onSubmit={(e) => handleSubmit(e, type, data.id)} className="space-y-4">
      {formFields[type].map(({ name, type: inputType, placeholder, required, accept, min }) => (
        <div key={name}>
          {inputType === 'textarea' ? (
            <textarea
              name={name}
              value={formData[name] || data[name] || (name === 'value' && data.value ? JSON.stringify(data.value) : '')}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded h-32"
              required={required}
            />
          ) : inputType === 'file' ? (
            <input type="file" name={name} onChange={handleFileChange} accept={accept} className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded" />
          ) : (
            <input
              type={inputType}
              name={name}
              value={formData[name] || data[name] || ''}
              onChange={handleInputChange}
              placeholder={placeholder}
              min={min}
              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
              required={required}
            />
          )}
          {name === 'image' && data.image_url && <img src={data.image_url} alt="Current" className="w-32 h-32 object-cover rounded my-2" />}
        </div>
      ))}
      <button type="submit" className="w-full p-2 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded hover:bg-[#FF5722]/80">
        {data.id ? 'Update' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    </form>
  );

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-neutral-900 font-sans text-neutral-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-serif font-bold bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] text-transparent">Admin Dashboard</h1>
          <button onClick={handleLogout} className="p-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
        </div>
        {error && <div className="p-4 bg-red-600/50 rounded mb-4">{error}</div>}
        {success && <div className="p-4 bg-green-600/50 rounded mb-4">{success}</div>}
        {loading && <div className="p-4 bg-neutral-800 rounded mb-4">Loading...</div>}
        <div className="flex space-x-4 mb-6">
          {['blogs', 'posts', 'metadata'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({});
                setFile(null);
              }}
              className={`p-2 rounded ${activeTab === tab ? 'bg-gradient-to-r from-[#FF5722] to-[#FFC107]' : 'bg-neutral-800 text-neutral-300'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Blogs</h2>
            {renderForm('blogs')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded">
                  <h3 className="text-xl font-bold">{blog.title}</h3>
                  <p className="text-neutral-300">{blog.subtitle}</p>
                  {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-full h-32 object-cover my-2 rounded" />}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFormData({ ...blog, id: blog.id })}
                      className="p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete('blogs', blog.id)} className="p-2 bg-red-600 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Posts</h2>
            {renderForm('posts')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                    {post.url}
                  </a>
                  {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-32 object-cover my-2 rounded" />}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFormData({ ...post, id: post.id })}
                      className="p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete('posts', post.id)} className="p-2 bg-red-600 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'metadata' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Metadata</h2>
            {renderForm('metadata')}
            <div className="space-y-4">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded">
                  <h3 className="text-xl font-bold">{key}</h3>
                  <pre className="text-neutral-300">{JSON.stringify(value, null, 2)}</pre>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={async () => {
                        const { data } = await supabase.from('website_metadata').select('id').eq('key', key).single();
                        if (data) setFormData({ key, value: JSON.stringify(value), id: data.id });
                      }}
                      className="p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const { data } = await supabase.from('website_metadata').select('id').eq('key', key).single();
                        if (data) handleDelete('website_metadata', data.id);
                      }}
                      className="p-2 bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Admin;