import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Root, Container, Content, Left, Body, Right, Button, Icon, Thumbnail, ActionSheet } from 'native-base';
import GLOBALS from '../Globals';
import AppHeader from '../components/AppHeader';
import { Actions } from 'react-native-router-flux';
import firebase from '../Firebase';


export default class ViewUser extends Component {

    constructor(props){
        super(props);
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUppercase()
        }
        return str.slice(0, 2).toUppercase();
    }


    render() {
        var user = firebase.auth().currentUser;

        return (
            <Container>
                <AppHeader>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </AppHeader>

                <Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: GLOBALS.COLOR.PRIMARY }}>

                        {
                            user.thumbnail ? (
                                <Thumbnail large source={{ uri: user.thumbnail }} style={{ marginRight: 16 }} />
                            ) : (
                                    <View style={{
                                        backgroundColor: GLOBALS.COLOR.GRAY,
                                        padding: 10,
                                        width: 70,
                                        height: 70,
                                        marginRight: 16,
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 50
                                    }}>
                                        <Text style={{ flex: 1, textAlign: 'center', color: GLOBALS.COLOR.PRIMARY, fontWeight: 'bold', alignSelf: 'center' }}>
                                            {getText(user.displayName)}
                                        </Text>
                                    </View>
                                )
                        }

                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={[styles.textColor, { fontWeight: 'bold', fontSize: 18 }]}>{user.displayName}</Text>
                            <Text style={[styles.textColor]}>{user.email}</Text>
                        </View>

                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    textColor: {
        color: GLOBALS.COLOR.WHITE,
    },

    button: {
        maxHeight: 40,
        padding: 10,
        alignItems: 'center',
        backgroundColor: GLOBALS.COLOR.ACCENT
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },

});