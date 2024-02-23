import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { globalStyle } from '../../../globalStyle';
import { useUser } from '../../context/user';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
    const navigation = useNavigation();
    const { userInfo, setUserInfo } = useUser();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '912342881556-j7sdnns4tmmlmibkcih1k83ddr4pg4r3.apps.googleusercontent.com',
        });
    }, []);

    const signIn = async () => {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const user_sign_in = auth().signInWithCredential(googleCredential);
            user_sign_in
                .then((user) => {
                    setUserInfo(user);
                })
                .catch((err) => {
                    console.log({ err });
                });
        } catch (error) {
            console.log({ error });
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigation.replace('Home', {
                userInfo,
            });
        }
    }, [userInfo]);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: globalStyle.color.primary }}
            edges={['top']}
        >
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={globalStyle.color.primary}
                animated={true}
            />
            <View style={[styles.container]}>
                <TouchableWithoutFeedback onPress={() => signIn()}>
                    <View style={[styles.loginBtn, { ...globalStyle.shadow }]}>
                        <Image
                            source={require('../../../assets/google_icon.png')}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text
                            style={{
                                fontFamily: globalStyle.font.semibold,
                                marginTop: -4,
                                fontSize: 16,
                                color: globalStyle.color.primary,
                            }}
                        >
                            Sign in with Google
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fefefe',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
    },
});
