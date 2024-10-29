import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleRegister = async () => {
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                setModalVisible(true);
            } else if (response.status === 409) {
                setErrorMessage("Email này đã được sử dụng!");
            } else {
              setErrorMessage("Email này đã được sử dụng!");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setErrorMessage("Không thể kết nối. Vui lòng thử lại sau.");
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logoapp}
                source={require('@/assets/images/dashboard-logo.png')}
            />
            <ThemedView style={styles.text}>
                <ThemedText type="title">Đăng Ký</ThemedText>
            </ThemedView>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Tên"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Xác nhận lại mật khẩu"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <Text style={styles.abc}>----Hoặc----</Text>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="white" />
                <Text style={styles.socialButtonText}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Ionicons name="logo-facebook" size={24} color="white" />
                <Text style={styles.socialButtonText}>Đăng nhập bằng Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.textLogin}>Quay lại trang đăng nhập</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Đăng ký thành công!</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push('/');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Quay lại trang đăng nhập</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 20,
    },
    text: {
        marginVertical: 20,
        backgroundColor: 'black',

    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#222', // Nền input tối hơn
    },
    loginButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 35,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#db4437',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 10,
    },
    facebookButton: {
        backgroundColor: '#4267B2',
    },
    socialButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    logoapp: {
        width: 300,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    abc: {
        color: '#FFFFFF',
        marginBottom: 20,
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    textLogin: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền tối cho modal
    },
    modalView: {
        width: '80%',
        backgroundColor: '#333', // Màu nền tối cho ô cửa sổ
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },
    modalText: {
        color: '#E0E0E0', // Màu chữ sáng hơn
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 10,
        width: '48%', // Đặt độ rộng cho các nút
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
