import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import firebase from '../Firebase';
import GLOBALS from '../Globals'

export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            userEmail: null,
            userPassword: null,
            unsubscribe: null
        }

        this.showAlert = this.showAlert.bind(this)
        this.loginUser = this.loginUser.bind(this)
    }

    componentDidMount = () => {
        console.log("componentDidMount")
        var auth = firebase.auth().onAuthStateChanged(function (user) {
            if (user) { // User is signed in.
                console.log(user);
                Actions.replace("home");
            } else { // User is signed out.
                console.log("User is not signed in.");
            }
        });
        this.setState({
            unsubscribe: auth
        });
    }

    componentWillUnmount = () => {
        console.log("componentWillUnmount");
        if (this.state.unsubscribe) {
            console.log("unsubscribe");
            this.state.unsubscribe()
        }
    }

    showAlert = (message) => {
        Alert.alert(
            "LOGIN FAILED",
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
        )
    }

    loginUser() {
        console.log("loginUser");
        console.log(this.state)
        var self = this;

        if (this.state.userEmail && this.state.userPassword) {

            firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage)

                    switch (errorCode) {
                        case "auth/invalid-email": {
                            console.log("auth/invalid-email");
                            self.showAlert("Invalid email")
                            break;
                        }
                        case "auth/user-disabled": {
                            console.log("auth/user-disabled");
                            self.showAlert("User diabled")
                            break;
                        }
                        case "auth/user-not-found": {
                            console.log("auth/user-not-found");
                            self.showAlert("User not found. Please sign up")
                            break;
                        }
                        case "auth/wrong-password": {
                            console.log("auth/wrong-password");
                            self.showAlert("Wrong password")
                            break;
                        }
                        case "auth/network-request-failed": {
                            self.showAlert("No internet connection")
                            break;
                        }
                    }
                });
        } else {
            console.log("Email & Password cannot be empty");
            self.showAlert("Please enter email & password")
        }
    }

    gotoSignup = () => {
        console.log("gotoSignup");
        Actions.signup();
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.logoSection}>
                    <Text style={styles.welcome}>LOGO</Text>
                </View>
                <View style={styles.loginSection}>

                    <TextInput
                        onChangeText={(email) => this.setState({ userEmail: email })}
                        placeholder="Email"
                        keyboardType="email-address"
                        style={{ width: 200, borderBottomWidth: 0.5, borderBottomColor: GLOBALS.COLOR.GRAY }}
                    />
                    <TextInput
                        onChangeText={(password) => this.setState({ userPassword: password })}
                        secureTextEntry={true}
                        placeholder="Password"
                        style={{ width: 200, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: GLOBALS.COLOR.GRAY }}
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={this.loginUser}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <Text style={{margin: 10}}>OR</Text>

                    <TouchableOpacity style={styles.loginButton} onPress={this.gotoSignup}>
                        <Text style={styles.loginButtonText}>SIGN UP</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },

    logoSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    loginSection: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginButton: {
        backgroundColor: GLOBALS.COLOR.PRIMARY,
        alignItems: 'center',
        width: 200,
        padding: 10
    },
    loginButtonText: {
        color: GLOBALS.COLOR.WHITE
    }

});