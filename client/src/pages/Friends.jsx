import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../components/FriendsModals/DeleteModal';
import AddFriendModal from '../components/FriendsModals/AddFriendModal';
import EditFriendModal from '../components/FriendsModals/EditFriendModal';

// Reusable Components
const MobileHeader = ({ title, onBack, onAction, actionIcon: ActionIcon }) => (
  <div className="sticky top-0 z-20 bg-white border-b border-gray-100 py-4 px-4 flex items-center justify-between">
    <button 
      onClick={onBack} 
      className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ChevronLeft size={24} />
    </button>
    <h1 className="text-lg font-semibold flex-grow text-center">{title}</h1>
    {onAction && ActionIcon && (
      <button 
        onClick={onAction} 
        className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ActionIcon size={20} />
      </button>
    )}
  </div>
);

const SearchBar = ({ value, onChange, placeholder = "Search" }) => (
  <div className="px-4 py-3 sticky top-0 z-10 bg-white">
    <div className="relative">
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <Search 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
      />
    </div>
  </div>
);

const FriendItem = ({ friend, onEdit, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="px-4 py-3 border-b border-gray-100 relative">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">{friend.name}</h3>
          <p className="text-sm text-gray-600">{friend.email}</p>
        </div>
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {showOptions && (
        <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
          <button 
            onClick={() => {
              onEdit(friend);
              setShowOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => {
              onDelete(friend);
              setShowOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ onAddFriend }) => (
  <div className="text-center px-6 py-12">
    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
      <Plus size={48} className="text-gray-600" />
    </div>
    <h2 className="text-xl font-semibold mb-2">No Friends Added</h2>
    <p className="text-gray-600 mb-6">
      Add friends to split bills and manage shared expenses easily
    </p>
    <button 
      onClick={onAddFriend}
      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Add First Friend
    </button>
  </div>
);

const FriendsPage = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const BaseUrl = 'bulk-mailer-mej8.vercel.app';

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/friends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch friends');
      
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.email || '').includes(searchQuery)
  );

  const handleAddFriend = async (friendData) => {
    try {
      const response = await fetch(`${BaseUrl}/api/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(friendData)
      });
  
      if (!response.ok) throw new Error('Failed to add friend');
  
      await fetchFriends();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleEditFriend = async (friendData) => {
    try {
      const response = await fetch(`${BaseUrl}/api/friends/${currentFriend._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(friendData)
      });
      
      if (!response.ok) throw new Error('Failed to update friend');
      
      await fetchFriends();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating friend:', error);
    }
  };

  const handleDeleteFriend = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/friends/${currentFriend._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete friend');
      
      await fetchFriends();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader 
        title="Friends" 
        onBack={() => navigate(-1)}
        onAction={() => setShowAddModal(true)}
        actionIcon={Plus}
      />

      <SearchBar 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search friends"
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredFriends.length > 0 ? (
        filteredFriends.map(friend => (
          <FriendItem 
            key={friend._id}
            friend={friend}
            onEdit={(f) => {
              setCurrentFriend(f);
              setShowEditModal(true);
            }}
            onDelete={(f) => {
              setCurrentFriend(f);
              setShowDeleteModal(true);
            }}
          />
        ))
      ) : (
        <EmptyState onAddFriend={() => setShowAddModal(true)} />
      )}

      {showAddModal && (
        <AddFriendModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddFriend}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    
      {showEditModal && (
        <EditFriendModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditFriend}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          friend={currentFriend}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteFriend}
        />
      )}
    </div>
  );
};

export default FriendsPage;