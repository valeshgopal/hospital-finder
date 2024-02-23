import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { globalStyle } from "../../globalStyle";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window')

const Header = ({ userInfo, setUserInfo }) => {
    const navigation = useNavigation();
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null);
            navigation.replace('Login'); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View
            style={[
                styles.header,
                { backgroundColor: '#fefefe', ...globalStyle.shadow },
            ]}
        >
            <View style={styles.userInfo}>
                {userInfo?.user?.photoURL ? (
                    <Image
                        source={{ uri: userInfo?.user?.photoURL }}
                        style={{ width: 40, height: 40, borderRadius: 50 }}
                    />
                ) : null}

                <Text style={{ fontFamily: globalStyle.font.medium }}>
                    {userInfo?.user?.displayName}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => signOut()}
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
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        zIndex: 1000,
    },
    button: {
        paddingHorizontal: 8,
        paddingTop: 2,
        paddingBottom: 5,
        borderRadius: 16,
        alignItems: 'center',
    },
})