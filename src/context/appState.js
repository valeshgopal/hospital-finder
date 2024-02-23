import React, { useState, useEffect, useRef, useReducer } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
    const appState = useRef(AppState.currentState);
    const [userLocationPermission, setUserLocationPermission] = useState(null);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            async (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    let { status } = await Location.getForegroundPermissionsAsync();
                    if (status !== userLocationPermission) {
                        setUserLocationPermission(status);
                    }
                }

                appState.current = nextAppState;
                setAppStateVisible(appState.current);
            }
        );

        return () => {
            subscription.remove();
        };
    }, [appState.current]);

    return (
        <AppStateContext.Provider
            value={{ userLocationPermission, setUserLocationPermission }}
        >
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => React.useContext(AppStateContext);
