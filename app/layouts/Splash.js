import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase from '../Firebase';

export default class Splash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unsubscribe: null
        }
    }

    componentDidMount = () => {
        console.log("componentDidMount")
        var auth = firebase.auth().onAuthStateChanged(function (user) {
            if (user) { // User is signed in.
                console.log("User: ", user);
                Actions.replace("home");
            } else { // User is signed out.
                console.log("User is not signed in.");
                Actions.replace("login");
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
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.logo}>Splash</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    logo: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});