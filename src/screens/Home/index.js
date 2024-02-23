import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { globalStyle } from '../../../globalStyle';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useUser } from '../../context/user';
import { useAppState } from '../../context/appState';
import Toast from 'react-native-root-toast'
import Header from '../../components/Header';

const Home = () => {

    const { userInfo, setUserInfo } = useUser();
    const [isLoading, setIsLoading] = React.useState(true);
    const [coords, setCoords] = React.useState({
        latitude: 12.956033,
        longitude: 77.709168,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [hospitals, setHospitals] = React.useState([]);

    const { userLocationPermission, setUserLocationPermission } = useAppState();
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

    const mapRef = React.useRef();
    const getCurrentPosition = () => {
        setIsLoading(true);
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=hospital&keyword=hospital&key=${apiKey}
                `)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log({ result })
                        if (result.results?.length === 0) {
                            Toast.show('No hospitals near you', {
                                fontFamily: globalStyle.font.medium
                            });
                        }
                        setHospitals(result.results);
                        setIsLoading(false);
                    });
                setCoords({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                mapRef?.current?.animateToRegion(
                    {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    3 * 1000
                );
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            }
        );
    };

    const getLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            setUserLocationPermission('granted');
        }
        if (status === 'denied') {
            setIsLoading(false);
            setUserLocationPermission('denied');
        }
    };
    React.useEffect(() => {
        getLocationPermission();
    }, []);

    React.useEffect(() => {
        if (userLocationPermission === 'granted') {
            getCurrentPosition();
        } else {
            setUserLocationPermission('denied');
        }
    }, [userLocationPermission]);

    return (
        <View style={styles.container}>
            <Header userInfo={userInfo} setUserInfo={setUserInfo} />
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size='small' color={globalStyle.color.primary} />
                    <Text style={{ fontFamily: globalStyle.font.medium }}>Loading</Text>
                </View>
            ) : userLocationPermission === 'granted' ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={coords}
                >
                    <Marker coordinate={coords} title='You are here' pinColor={'blue'} />
                    {hospitals?.length > 0 &&
                        hospitals?.map((hospital, index) => {
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: hospital?.geometry?.location?.lat,
                                        longitude: hospital?.geometry?.location?.lng,
                                    }}
                                    title={hospital?.name}
                                    description={hospital?.vicinity}
                                />
                            );
                        })}
                </MapView>
            ) : (
                <TouchableOpacity
                    onPress={() => Linking.openSettings()}
                    style={[
                        styles.button,
                        { backgroundColor: globalStyle.color.primary },
                    ]}
                >
                    <Text
                        style={{
                            fontFamily: globalStyle.font.semibold,
                            fontSize: 16,
                            color: '#fefefe',
                        }}
                    >
                        Enable Location Permission
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 8,
        paddingTop: 2,
        paddingBottom: 5,
        borderRadius: 16,
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loader: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
});
