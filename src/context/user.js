import React, { createContext, useState, useContext } from 'react';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { useNavigation } from '@react-navigation/native';

const storage = new MMKVLoader().initialize();

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useMMKVStorage('user', storage, null);

    React.useEffect(() => {
        if (userInfo) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
