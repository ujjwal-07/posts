import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Posts = ({fetchPosts}) => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // Loading state
  const [menuOpen, setMenuOpen] = useState(null); // Tracks which card menu is open
  const navigate = useNavigate(); // For navigation
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/posts/getpost');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch posts from the API
  useEffect(() => {


    fetchPosts();
  }, []);

  // Handle Delete
  const handleDelete = async (postId) => {
    console.log(postId)
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
        const response = await axios.post('http://localhost:3002/posts/delete', {
            public_id: { postId }, // Pass postId in the request body
          });      alert('Post deleted successfully!');     fetchPosts();


      setPosts(posts.filter((post) => post._id !== postId)); // Update state to reflect deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post.');
    }
  };

  // Handle Update
  const handleUpdate = (postId) => {
    navigate(`/update/${postId}`); // Redirect to update page
  };

  if (loading) {
    return <p>Loading posts...</p>; // Show loading state
  }

  return (
    <div className="p-4 overflow-y-auto h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 relative"
          >
            {/* Card Image */}
            <div className="relative pb-56">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>

            {/* Hamburger Menu */}
            <div className="absolute top-2 right-2">
              <button
                className="text-gray-700 bg-white p-2 rounded-full shadow-lg hover:text-indigo-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12h.01M12 12h.01M18 12h.01"
                  />
                </svg>
              </button>
              {menuOpen === post._id && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-10">
                  <button
                    onClick={() => handleUpdate(post.imageName)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post.imageName)}
                    className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
