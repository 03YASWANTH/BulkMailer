// FriendsPage.jsx
import React, { useState, useEffect } from 'react';
import { GlassPanel, GlassButton, GlassInput } from "../components/ui/glassMorphic";
import { Plus, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../components/FriendsModals/DeleteModal';
import FriendCard from '../components/FriendsModals/FriendCard';
import AddFriendModal from '../components/FriendsModals/AddFriendModal';
import EditFriendModal from '../components/FriendsModals/EditFriendModal';

const FriendsPage = () => {
  const BaseUrl = 'http://localhost:3000';
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    upiId: ''
  });

  // Extract token from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (tokenParam) {
      // Store the token in local storage
      localStorage.setItem('accessToken', tokenParam);
      
      // Remove token from URL by navigating to the same page without query params
      navigate('/dashboard', { replace: true });
    }
    
    // Fetch user data and friends regardless of whether token was in URL
    if (localStorage.getItem('accessToken')) {
      fetchMe();
      fetchFriends();
    } else {
      // Redirect to login if no token is available
      navigate('/');
    }
  }, [navigate]);

  const fetchMe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      setInfo(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If unauthorized, clear token and redirect to login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log("Friends data received:", data);
      // Extract the friends array from the response
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFriend = async (formData) => {
    try {
      const response = await fetch(`${BaseUrl}/api/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phone,
          upiId: formData.upiId
        })
      });
  
      if (!response.ok) throw new Error('Failed to add friend');
  
      await fetchFriends();
      setShowAddForm(false);
      setFormData({ name: '', email: '', phone: '', upiId: '' });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  
  const handleEditFriend = async (formData) => {
    try {
      const response = await fetch(`${BaseUrl}/api/friends/${currentFriend._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phone,
          upiId: formData.upiId
        })
      });
      
      if (!response.ok) throw new Error('Failed to update friend');
      
      await fetchFriends();
      setShowEditForm(false);
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
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  const openEditForm = (friend) => {
    setCurrentFriend(friend);
    setFormData({
      name: friend.name,
      email: friend.email || '',
      phone: friend.phoneNumber || '',
      upiId: friend.upiId || ''
    });
    setShowEditForm(true);
  };

  const openDeleteConfirm = (friend) => {
    setCurrentFriend(friend);
    setShowDeleteConfirm(true);
  };

  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (friend.email && friend.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (friend.phoneNumber || '').includes(searchQuery)
      )
    : friends;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16 pb-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-altpay-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft animate-delay-300"></div>
      
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Friends</h1>
            <p className="text-sm text-gray-500">Manage your backup payment contacts</p>
          </div>
          <div className="relative">
            <GlassButton 
              className="w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={24} />
            </GlassButton>
          </div>
        </header>
        
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <GlassInput 
              className="pl-10" 
              placeholder="Search friends..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-altpay-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your friends...</p>
          </div>
        ) : (
          <>
            {Array.isArray(filteredFriends) && filteredFriends.length > 0 ? (
              <div className="space-y-4">
                {filteredFriends.map((friend) => (
                  <FriendCard 
                    key={friend._id} 
                    friend={friend} 
                    onEdit={openEditForm} 
                    onDelete={openDeleteConfirm} 
                  />
                ))}
              </div>
            ) : (
              <GlassPanel className="p-8 text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No friends found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? "Try a different search term" : "Add friends to get started with backup payments"}
                </p>
                <GlassButton 
                  className="bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Your First Friend
                </GlassButton>
              </GlassPanel>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      {showAddForm && (
        <AddFriendModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddFriend}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      
      {showEditForm && (
        <EditFriendModal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditFriend}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          friend={currentFriend}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteFriend}
        />
      )}
    </div>
  );
};

export default FriendsPage;






















// import React, { useState, useEffect } from 'react';
// import { GlassPanel, GlassButton, GlassCard, GlassInput } from "../components/ui/glassMorphic";
// import { ArrowRight, Plus, Edit, Trash2, X, Check, User, Users, Search } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import DeleteConfirmModal from '../components/FriendsModals/DeleteModal';

// const FriendsPage = () => {
//   const BaseUrl = 'http://localhost:3000';
//   const navigate = useNavigate();
//   const [info, setInfo] = useState({});
//   const [friends, setFriends] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [currentFriend, setCurrentFriend] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     upiId: ''
//   });

//   // Extract token from URL parameters on component mount
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const tokenParam = urlParams.get('token');
    
//     if (tokenParam) {
//       // Store the token in local storage
//       localStorage.setItem('accessToken', tokenParam);
      
//       // Remove token from URL by navigating to the same page without query params
//       navigate('/dashboard', { replace: true });
//     }
    
//     // Fetch user data and friends regardless of whether token was in URL
//     if (localStorage.getItem('accessToken')) {
//       fetchMe();
//       fetchFriends();
//     } else {
//       // Redirect to login if no token is available
//       navigate('/');
//     }
//   }, [navigate]);

//   const fetchMe = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${BaseUrl}/api/auth/me`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch data');
      
//       const data = await response.json();
//       setInfo(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       // If unauthorized, clear token and redirect to login
//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem('accessToken');
//         navigate('/');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchFriends = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${BaseUrl}/api/friends`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch friends');
      
//       const data = await response.json();
//       console.log("Friends data received:", data); // This shows the nested structure
      
//       // Extract the friends array from the response object
//       if (data.success && Array.isArray(data.friends)) {
//         setFriends(data.friends);
//       } else {
//         setFriends([]);
//       }
//     } catch (error) {
//       console.error('Error fetching friends:', error);
//       setFriends([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddFriend = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${BaseUrl}/api/friends`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           phoneNumber: formData.phone,
//           upiId: formData.upiId
//         })
//       });
  
//       if (!response.ok) throw new Error('Failed to add friend');
  
//       await fetchFriends();
//       setShowAddForm(false);
//       setFormData({ name: '', email: '', phone: '', upiId: '' });
//     } catch (error) {
//       console.error('Error adding friend:', error);
//     }
//   };
  
//   const handleEditFriend = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${BaseUrl}/api/friends/${currentFriend._id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phoneNumber: formData.phone,
//           upiId: formData.upiId
//         })
//       });
      
//       if (!response.ok) throw new Error('Failed to update friend');
      
//       await fetchFriends();
//       setShowEditForm(false);
//     } catch (error) {
//       console.error('Error updating friend:', error);
//     }
//   };

//   const handleDeleteFriend = async () => {
//     try {
//       const response = await fetch(`${BaseUrl}/api/friends/${currentFriend._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
      
//       if (!response.ok) throw new Error('Failed to delete friend');
      
//       await fetchFriends();
//       setShowDeleteConfirm(false);
//     } catch (error) {
//       console.error('Error deleting friend:', error);
//     }
//   };

//   const openEditForm = (friend) => {
//     setCurrentFriend(friend);
//     setFormData({
//       name: friend.name,
//       email: friend.email || '',
//       phone: friend.phone || friend.phoneNumber || '',
//       upiId: friend.upiId || ''
//     });
//     setShowEditForm(true);
//   };

//   const openDeleteConfirm = (friend) => {
//     setCurrentFriend(friend);
//     setShowDeleteConfirm(true);
//   };

//   const filteredFriends = searchQuery 
//     ? friends.filter(friend => 
//         friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (friend.email && friend.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (friend.phone || friend.phoneNumber || '').includes(searchQuery)
//       )
//     : friends;

//   // FriendCard component defined inside the FriendsPage component
//   const FriendCard = ({ friend }) => {
//     const [swiped, setSwiped] = useState(false);

//     const handleSwipe = (eventData) => {
//       if (eventData.dir === 'Left') {
//         setSwiped(true);
//       }
//     };

//     const handleClose = () => {
//       setSwiped(false);
//     };

//     return (
//       <div className="mb-4 relative">
//         <div 
//           className="absolute top-0 right-0 h-full flex items-center bg-gray-100 rounded-r-xl z-10"
//           style={{ width: swiped ? '120px' : '0px', transition: 'width 0.3s' }}
//         >
//           <div className="flex justify-around w-full">
//             <button 
//               onClick={() => openEditForm(friend)}
//               className="w-12 h-12 rounded-full bg-altpay-100 flex items-center justify-center text-altpay-600"
//             >
//               <Edit size={20} />
//             </button>
//             <button 
//               onClick={() => openDeleteConfirm(friend)}
//               className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
//             >
//               <Trash2 size={20} />
//             </button>
//           </div>
//         </div>
        
//         <div 
//           className="relative z-20"
//           style={{ transform: swiped ? 'translateX(-120px)' : 'translateX(0)', transition: 'transform 0.3s' }}
//         >
//           <div className="w-full" onTouchEnd={handleClose}>
//             <GlassCard className="p-4 relative">
//               {swiped && (
//                 <button 
//                   onClick={handleClose}
//                   className="absolute -right-4 -top-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center z-30"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//               <div className="flex items-center">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-altpay-500 to-altpay-600 flex items-center justify-center text-white mr-3">
//                   {friend.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-800">{friend.name}</h3>
//                   <p className="text-sm text-gray-500">{friend.email}</p>
//                 </div>
//               </div>
//               <div className="mt-3 grid grid-cols-2 gap-2">
//                 <div className="text-xs">
//                   <span className="text-gray-500">Phone: </span>
//                   <span className="font-medium">{friend.phone || friend.phoneNumber}</span>
//                 </div>
//                 <div className="text-xs">
//                   <span className="text-gray-500">UPI ID: </span>
//                   <span className="font-medium">{friend.upiId}</span>
//                 </div>
//               </div>
//             </GlassCard>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16 pb-24 px-4 relative overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute top-20 right-0 w-72 h-72 bg-altpay-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
//       <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-soft animate-delay-300"></div>
      
//       <div className="max-w-md mx-auto">
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">My Friends</h1>
//             <p className="text-sm text-gray-500">Manage your backup payment contacts</p>
//           </div>
//           <div className="relative">
//             <GlassButton 
//               className="w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
//               onClick={() => setShowAddForm(true)}
//             >
//               <Plus size={24} />
//             </GlassButton>
//           </div>
//         </header>
        
//         <div className="mb-6">
//           <div className="relative">
//             <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <GlassInput 
//               className="pl-10" 
//               placeholder="Search friends..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
        
//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="w-12 h-12 border-2 border-altpay-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-500">Loading your friends...</p>
//           </div>
//         ) : (
//           <>
//             {Array.isArray(filteredFriends) && filteredFriends.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredFriends.map((friend) => (
//                   <FriendCard key={friend._id} friend={friend} />
//                 ))}
//               </div>
//             ) : (
//               <GlassPanel className="p-8 text-center">
//                 <Users size={48} className="mx-auto mb-4 text-gray-400" />
//                 <h3 className="text-xl font-medium text-gray-700 mb-2">No friends found</h3>
//                 <p className="text-gray-500 mb-6">
//                   {searchQuery ? "Try a different search term" : "Add friends to get started with backup payments"}
//                 </p>
//                 <GlassButton 
//                   className="bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
//                   onClick={() => setShowAddForm(true)}
//                 >
//                   Add Your First Friend
//                 </GlassButton>
//               </GlassPanel>
//             )}
//           </>
//         )}
//       </div>
      
//       {/* Add Friend Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 pb-4 animate-fade-in">
//           <GlassPanel className="w-full max-w-md p-6 mx-4 animate-slide-up">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800">Add New Friend</h2>
//               <button onClick={() => setShowAddForm(false)}>
//                 <X size={24} className="text-gray-500" />
//               </button>
//             </div>
            
//             <form onSubmit={handleAddFriend}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
//                     Name
//                   </label>
//                   <GlassInput
//                     id="name"
//                     name="name"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
//                     Email
//                   </label>
//                   <GlassInput
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
//                     Phone
//                   </label>
//                   <GlassInput
//                     id="phone"
//                     name="phone"
//                     placeholder="+1 (555) 123-4567"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="upiId">
//                     UPI ID
//                   </label>
//                   <GlassInput
//                     id="upiId"
//                     name="upiId"
//                     placeholder="john@upi"
//                     value={formData.upiId}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="mt-8 flex space-x-3">
//                 <GlassButton
//                   type="button"
//                   className="flex-1"
//                   onClick={() => setShowAddForm(false)}
//                 >
//                   Cancel
//                 </GlassButton>
//                 <GlassButton
//                   type="submit"
//                   className="flex-1 bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
//                 >
//                   Add Friend
//                 </GlassButton>
//               </div>
//             </form>
//           </GlassPanel>
//         </div>
//       )}
      
//       {/* Edit Friend Modal */}
//       {showEditForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 pb-4 animate-fade-in">
//           <GlassPanel className="w-full max-w-md p-6 mx-4 animate-slide-up">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800">Edit Friend</h2>
//               <button onClick={() => setShowEditForm(false)}>
//                 <X size={24} className="text-gray-500" />
//               </button>
//             </div>
            
//             <form onSubmit={handleEditFriend}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-name">
//                     Name
//                   </label>
//                   <GlassInput
//                     id="edit-name"
//                     name="name"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-email">
//                     Email
//                   </label>
//                   <GlassInput
//                     id="edit-email"
//                     name="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-phone">
//                     Phone
//                   </label>
//                   <GlassInput
//                     id="edit-phone"
//                     name="phone"
//                     placeholder="+1 (555) 123-4567"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-upiId">
//                     UPI ID
//                   </label>
//                   <GlassInput
//                     id="edit-upiId"
//                     name="upiId"
//                     placeholder="john@upi"
//                     value={formData.upiId}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="mt-8 flex space-x-3">
//                 <GlassButton
//                   type="button"
//                   className="flex-1"
//                   onClick={() => setShowEditForm(false)}
//                 >
//                   Cancel
//                 </GlassButton>
//                 <GlassButton
//                   type="submit"
//                   className="flex-1 bg-gradient-to-r from-altpay-600 to-altpay-500 text-white border-0"
//                 >
//                   Save Changes
//                 </GlassButton>
//               </div>
//             </form>
//           </GlassPanel>
//         </div>
//       )}
      
//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <DeleteConfirmModal
//           isOpen={showDeleteConfirm}
//           friend={currentFriend}
//           onClose={() => setShowDeleteConfirm(false)}
//           onConfirm={handleDeleteFriend}
//         />
//       )}
//     </div>
//   );
// };

// export default FriendsPage;