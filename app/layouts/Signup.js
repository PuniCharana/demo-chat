import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Button,
    Alert,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import firebase from '../Firebase';
import GLOBALS from '../Globals'

export default class Signup extends Component {

    constructor() {
        super();
        this.state = {
            userName: null,
            userEmail: null,
            userPassword: null
        }

        this.validateUserInputs = this.validateUserInputs.bind(this);

    }

    showAlert = (message) => {
        Alert.alert(
            "SIGNUP FAILED",
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
        )
    }

    validateUserInputs() {
        if (this.state.userName && this.state.userEmail && this.state.userPassword) {
            return true;
        }
        return false;
    }

    signupUser = () => {
        console.log(this.state);

        var self = this;

        if (self.validateUserInputs()) {
            console.log("User input valid");

            firebase.auth()
                .createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
                .then((response) => {
                    console.log(response);

                    self._updateUserProfile()
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                    self.showAlert(errorMessage)
                });
        } else {
            console.log("User input not correct");
            this.showAlert("Please enter name, email & password");
        }
    }

    _updateUserProfile = () => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: this.state.userName
        }).then(function () {
            // Update successful.
            Actions.home();
            console.log("Update successful.");
        }).catch(function (error) {
            // An error happened.
            console.log("An error happened.");
        });
    }

    gotoLogin = () => {
        console.log("gotoLogin")
        Actions.login();
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.logoSection}>
                    <Text style={styles.welcome}>LOGO</Text>
                </View>
                <View style={styles.loginSection}>

                    <TextInput
                        onChangeText={(name) => this.setState({ userName: name })}
                        placeholder="Full Name"
                        style={{ width: 200, borderBottomWidth: 0.5, borderBottomColor: GLOBALS.COLOR.GRAY }}
                    />
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

                    <TouchableOpacity style={styles.loginButton} onPress={this.signupUser}>
                        <Text style={styles.loginButtonText}>SIGN UP</Text>
                    </TouchableOpacity>

                    <Text style={{ margin: 10 }}>OR</Text>

                    <TouchableOpacity style={styles.loginButton} onPress={this.gotoLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
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