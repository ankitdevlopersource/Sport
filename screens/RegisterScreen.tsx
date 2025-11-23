import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import { User, Role } from '../types';

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onNavigateToLogin: () => void;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const roles: Role[] = ['Athlete', 'Coach', 'Sponsor'];

const sportsList = [
  'Athletics', 'Cricket', 'Football', 'Badminton', 'Kabaddi',
  'Wrestling', 'Basketball', 'Tennis',
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    role: 'Select Role' as Role,
    sport: 'Choose Sport',
    state: indianStates[25], // Default to Uttar Pradesh
    district: '',
    profilePictureUrl: 'https://picsum.photos/seed/default/100/100',
  });
  const [permissions, setPermissions] = useState({
    storage: false,
    location: false,
    messages: false,
    camera: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions(prev => ({ ...prev, [name as keyof typeof permissions]: checked }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, profilePictureUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(permissions).some(p => !p)) {
      alert("Please accept all permissions to continue.");
      return;
    }
    
    const newUser: User = {
      name: formData.fullName,
      role: formData.role,
      sport: formData.sport,
      location: `${formData.district}, ${formData.state}`,
      profilePictureUrl: formData.profilePictureUrl,
      // Default stats for a new user
      districtRank: 0,
      stateRank: 0,
      totalScore: 0,
    };
    onRegister(newUser);
  };

  return (
    <div className="flex flex-col bg-gray-50 text-gray-800 min-h-screen">
      <Header onBack={onNavigateToLogin} logoTitle />
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-y-auto space-y-4">
          <h2 className="text-2xl font-bold mb-2">Create New Account</h2>
          
          <div className="text-center">
            <img src={formData.profilePictureUrl} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200 object-cover" />
            <button type="button" onClick={handleUploadClick} className="mt-2 text-sm text-blue-600 hover:underline">
              Upload Profile Photo
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" required/>
          </div>

          <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="tel" placeholder="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <select name="sport" value={formData.sport} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            {sportsList.map(sport => <option key={sport} value={sport}>{sport}</option>)}
          </select>
          <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          <input type="text" placeholder="District" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">App Permissions</h3>
            <p className="text-sm text-gray-500 mb-3">To provide the best experience, Spark Khoj requires the following permissions:</p>
            <div className="space-y-2">
              {Object.keys(permissions).map(key => (
                  <div key={key} className="bg-gray-100 rounded-lg p-3">
                    <label className="flex items-start cursor-pointer">
                        <input 
                            type="checkbox" 
                            name={key} 
                            checked={permissions[key as keyof typeof permissions]} 
                            onChange={handlePermissionChange} 
                            className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5 flex-shrink-0" 
                        />
                        <div className="ml-3">
                           <span className="font-semibold text-gray-800 capitalize">{key} Access</span>
                           {key === 'camera' && (
                               <p className="text-xs text-gray-600 mt-1">
                                 Required for video uploads and AI performance analysis, the core feature of our talent identification process.
                               </p>
                           )}
                        </div>
                    </label>
                  </div>
              ))}
            </div>
          </div>
        </main>
       <div className="p-6">
         <button type="submit" className="w-full py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            CREATE NEW ACCOUNT
          </button>
       </div>
      </form>
    </div>
  );
};

export default RegisterScreen;