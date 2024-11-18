import React, { createContext, useContext, useState } from "react";

// Create the context
const ProfileContext = createContext();

// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  return (
    <ProfileContext.Provider value={{ profilePhotoUrl, setProfilePhotoUrl }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export default ProfileContext;
