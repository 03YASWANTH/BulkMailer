import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  UserPlus, 
  Paperclip, 
  Send, 
  X, 
  User as UserIcon, 
  File,
  Edit,
  Trash2,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useUser } from "../context/UserContext.jsx";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BulkMailer = () => {
    const BaseUrl = 'http://localhost:3000';
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [recipients, setRecipients] = useState([]);
    const [subject, setSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [friendList, setFriendList] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
    ]);
    const [showFriendList, setShowFriendList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [sendSuccess, setSendSuccess] = useState(false);
    
    const fileInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const mainContentRef = useRef(null);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        if (tokenParam) {
          localStorage.setItem('accessToken', tokenParam);
          navigate('/Mail', { replace: true });
        }
        if (localStorage.getItem('accessToken')) {
          fetchMe();
        } else {
          navigate('/');
        }
    }, [navigate]);
    
    useEffect(() => {
        fetchFriends();
    }, []);
    
    // Add smooth scroll when changing steps
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [currentStep]);
    
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
            setUser(data.user);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            setFriendList(data.friends || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRecipient = () => {
        const emailInput = emailInputRef.current.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailInput && emailRegex.test(emailInput) && !recipients.includes(emailInput)) {
            setRecipients([...recipients, emailInput]);
            emailInputRef.current.value = '';
            
            // Show success toast with animation
            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur-lg text-green-600 p-4 rounded-lg shadow-lg border border-green-100 flex items-center"
                >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Email added successfully!</span>
                </motion.div>
            ), { duration: 2000 });
        } else if (!emailRegex.test(emailInput)) {
            toast.error("Invalid email format");
        } else if (recipients.includes(emailInput)) {
            toast.error("Email already added");
        }
    };

    const handleRemoveRecipient = (emailToRemove) => {
        setRecipients(recipients.filter(email => email !== emailToRemove));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            const allowedTypes = [
                'image/jpeg', 'image/png', 'image/gif', 
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const maxSize = 10 * 1024 * 1024; // 10MB
            return allowedTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.error("Some files were not added. Check file type and size.");
        }

        setAttachments([...attachments, ...validFiles]);
    };

    const handleRemoveAttachment = (fileToRemove) => {
        setAttachments(attachments.filter(file => file !== fileToRemove));
    };

    const handleAddFriend = (friend) => {
        if (!recipients.includes(friend.email)) {
            setRecipients([...recipients, friend.email]);
            setShowFriendList(false);
            
            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur-lg text-indigo-600 p-4 rounded-lg shadow-lg border border-indigo-100 flex items-center"
                >
                    <UserPlus className="h-5 w-5 mr-2" />
                    <span>{friend.name} added to recipients!</span>
                </motion.div>
            ), { duration: 2000 });
        } else {
            toast.error("Friend's email already added");
        }
    };

    const handleSendEmail = async () => {
        if (recipients.length === 0) {
            toast.error("Please add at least one recipient");
            return;
        }

        if (!subject.trim()) {
            toast.error("Email subject cannot be empty");
            return;
        }

        if (!emailBody.trim()) {
            toast.error("Email body cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('recipients', JSON.stringify(recipients));
            formData.append('subject', subject);
            formData.append('body', emailBody);
            
            attachments.forEach((file) => {
                formData.append('attachments', file);
            });

            const response = await fetch(`${BaseUrl}/api/mail/send-bulk-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (response.ok) {
                setSendSuccess(true);
                setTimeout(() => {
                    // Reset form
                    setRecipients([]);
                    setSubject('');
                    setEmailBody('');
                    setAttachments([]);
                    setCurrentStep(1);
                    setSendSuccess(false);
                }, 3000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to send emails');
            }
        } catch (error) {
            console.error('Email send error:', error);
            toast.error('Failed to send emails');
        } finally {
            setIsLoading(false);
        }
    };

    const getStepLabel = (step) => {
        switch(step) {
            case 1: return "Recipients";
            case 2: return "Compose";
            case 3: return "Review & Send";
            default: return "";
        }
    };

    const getProgressBarWidth = () => {
        return `${((currentStep - 1) / 2) * 100}%`;
    };

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Recipients Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Who would you like to email?</h2>
                            <div className="flex space-x-2 mb-2">
                                <div className="flex-grow relative">
                                    <input
                                        ref={emailInputRef}
                                        type="email"
                                        placeholder="Enter email address"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                                        className="w-full px-4 py-3 border border-indigo-100 bg-white/70 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-sm"
                                    />
                                    <div className="absolute right-2 top-2.5">
                                        <button
                                            onClick={() => setShowFriendList(!showFriendList)}
                                            className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-300 ml-1"
                                            title="Add from contacts"
                                        >
                                            <UserPlus className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddRecipient}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Friend List Dropdown */}
                            <AnimatePresence>
                                {showFriendList && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-2 border border-indigo-100 rounded-xl max-h-48 overflow-y-auto bg-white/90 backdrop-blur-sm shadow-xl"
                                    >
                                        {friendList.length > 0 ? (
                                            friendList.map(friend => (
                                                <motion.div 
                                                    key={friend.id} 
                                                    className="flex justify-between items-center p-4 hover:bg-indigo-50 cursor-pointer border-b border-indigo-50 last:border-b-0"
                                                    onClick={() => handleAddFriend(friend)}
                                                    whileHover={{ backgroundColor: "rgba(238, 242, 255, 0.9)" }}
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">{friend.name}</p>
                                                        <p className="text-sm text-gray-500">{friend.email}</p>
                                                    </div>
                                                    <motion.div 
                                                        whileHover={{ scale: 1.1 }}
                                                        className="text-indigo-500 hover:text-indigo-700"
                                                    >
                                                        <UserPlus className="h-5 w-5" />
                                                    </motion.div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No contacts found
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Recipients Tag List */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Recipients ({recipients.length})</h3>
                                <div className="flex flex-wrap gap-2 min-h-16 p-2 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/50">
                                    <AnimatePresence>
                                        {recipients.map(email => (
                                            <motion.div 
                                                key={email}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center bg-white border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-full text-sm shadow-sm"
                                            >
                                                <Mail className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
                                                {email}
                                                <button 
                                                    onClick={() => handleRemoveRecipient(email)}
                                                    className="ml-1.5 text-indigo-400 hover:text-indigo-700 transition-colors p-0.5 rounded-full hover:bg-indigo-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {recipients.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-4">
                                            No recipients added yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentStep(2)}
                                disabled={recipients.length === 0}
                                className={`flex items-center px-6 py-3 rounded-xl shadow-md transition-all duration-300 ${
                                    recipients.length === 0 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                                }`}
                            >
                                Continue to Compose
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4">Compose Your Message</h2>
                        
                        {/* Subject Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Subject Line
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject..."
                                className="w-full px-4 py-3 border border-indigo-100 bg-white/70 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-sm"
                            />
                        </div>
                        
                        {/* Email Body */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <textarea
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your email message here..."
                                rows="8"
                                className="w-full px-4 py-3 border border-indigo-100 bg-white/70 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-sm resize-none"
                            />
                        </div>

                        {/* Attachments */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Attachments ({attachments.length})
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                multiple
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full px-4 py-3 border border-dashed border-indigo-300 bg-indigo-50/70 text-indigo-700 rounded-xl hover:bg-indigo-100/70 transition-colors flex items-center justify-center"
                            >
                                <Paperclip className="mr-2 h-5 w-5" /> 
                                Select Files to Attach
                            </button>
                            
                            {/* Attachment List */}
                            <div className="space-y-2 mt-3">
                                <AnimatePresence>
                                    {attachments.map((file, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-between bg-white border border-blue-100 p-3 rounded-lg shadow-sm"
                                        >
                                            <div className="flex items-center">
                                                {file.type.startsWith('image/') ? (
                                                    <ImageIcon className="h-5 w-5 text-pink-500 mr-3" />
                                                ) : file.type === 'application/pdf' ? (
                                                    <FileText className="h-5 w-5 text-red-500 mr-3" />
                                                ) : (
                                                    <File className="h-5 w-5 text-blue-500 mr-3" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveAttachment(file)}
                                                className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-50"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                        
                        <div className="flex justify-between pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentStep(1)}
                                className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                Back
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentStep(3)}
                                disabled={!subject.trim() || !emailBody.trim()}
                                className={`flex items-center px-6 py-3 rounded-xl shadow-md transition-all duration-300 ${
                                    !subject.trim() || !emailBody.trim()
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                                }`}
                            >
                                Review & Send
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4">Review & Send</h2>
                        
                        {/* Email Preview */}
                        <div className="bg-white/80 border border-indigo-100 rounded-xl p-6 shadow-md">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">To:</h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {recipients.map((email, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {email}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Subject:</h3>
                                    <p className="mt-1 text-gray-900 font-medium">{subject}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Message:</h3>
                                    <div className="mt-1 text-gray-700 whitespace-pre-wrap border-l-2 border-indigo-200 pl-3 py-1">
                                        {emailBody}
                                    </div>
                                </div>
                                
                                {attachments.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Attachments ({attachments.length}):</h3>
                                        <ul className="mt-1 space-y-1">
                                            {attachments.map((file, idx) => (
                                                <li key={idx} className="text-sm text-blue-600 flex items-center">
                                                    <Paperclip className="h-3.5 w-3.5 mr-1" />
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-between pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentStep(2)}
                                className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                Back to Edit
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSendEmail}
                                disabled={isLoading}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <Send className="mr-2 h-5 w-5" />
                                )}
                                Send to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
                            </motion.button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8 px-4">
        <AnimatePresence>
          {sendSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Sparkles className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your emails have been sent successfully to {recipients.length}{" "}
                  recipient{recipients.length !== 1 ? "s" : ""}.
                </p>
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400">Redirecting...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-semibold">Bulk Mailer</h1>
                  <p className="text-indigo-100 text-sm">
                    Send personalized emails to multiple recipients
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-2"
                >
                  <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm mr-2">
                    {user?.name?.charAt(0) || <UserIcon className="h-5 w-5" />}
                  </div>
                  <span className="text-sm mr-1">{user?.name || "User"}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-indigo-100 z-10"
                    >
                      <div className="p-3 border-b border-indigo-100">
                        <p className="font-medium text-gray-800">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md flex items-center"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Friends
                        </button>

                        <button
                          onClick={() => {
                            localStorage.removeItem("accessToken");
                            navigate("/");
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => {
                    // Only allow going back or to completed steps
                    if (step <= currentStep || step === 1) {
                      setCurrentStep(step);
                    }
                  }}
                  disabled={step > currentStep && step !== 1}
                  className={`flex items-center ${
                    step === currentStep
                      ? "text-indigo-700 font-medium"
                      : step < currentStep
                      ? "text-indigo-500"
                      : "text-gray-400"
                  } transition-colors ${
                    step > currentStep && step !== 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      step === currentStep
                        ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-2"
                        : step < currentStep
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className="hidden sm:inline">{getStepLabel(step)}</span>
                </button>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: getProgressBarWidth() }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div
            ref={mainContentRef}
            className="px-6 pb-6 max-h-[calc(100vh-240px)] overflow-y-auto"
          >
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </motion.div>

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#4B5563",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            },
          }}
        />
      </div>
    );
};

export default BulkMailer;