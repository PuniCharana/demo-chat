import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Container, Content, Left, Body, Right, Button, Icon, Title, List, Fab } from 'native-base';

import GLOBALS from '../Globals';
import firebase from '../Firebase';
import AppHeader from '../components/AppHeader';
import ChatItem from '../components/ChatItem';
import { Actions } from 'react-native-router-flux';


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            usergroups: [],
            groupsRef: null
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
        var user = firebase.auth().currentUser;
        if (user != null) {
            console.log("User found: ", user)
            this._loadUserGroups(user);
        } else {
            console.log("User not found");
            Actions.login();
        }
    }

    componentWillUnmount() {
        if (this.state.groupsRef) {
            console.log("Remove user groups event listener");
            this.state.groupsRef.off();
        }
    }

    _loadUserGroups = (user) => {
        var groupsRef = firebase.database().ref("usergroups/" + user.uid);
        groupsRef.on("value", (snapshot) => {
            console.log("snapshot", snapshot.val());
            var groups = []
            if (snapshot.val()) {
                console.log("User groups found")

                snapshot.forEach((groupSnapshot) => {
                    groups.push(groupSnapshot.val());
                })
            }
            this.setState({
                isLoading: false,
                usergroups: groups
            })
        }, (error) => {
            // TODO
            console.log(error);
        })

        this.setState({
            groupsRef: groupsRef
        });
    }

    _renderGroups(groups) {
        if (this.state.isLoading) {
            return <ActivityIndicator size="large" color={GLOBALS.COLOR.PRIMARY} />
        }

        if (groups.length > 0) {
            return (
                <List dataArray={groups}
                    renderRow={(group) => <ChatItem group={group} />}>
                </List>
            );
        } else {
            return (
                <View>
                    <Text>Please join a group</Text>
                </View>
            );
        }
    }

    render() {
        var usergroups = this.state.usergroups;

        var user = firebase.auth().currentUser;

        return (

            <Container>
                <AppHeader>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.profile({ user: user })}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='person' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: GLOBALS.COLOR.WHITE }} >Chats</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => console.log("j")}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='search' />
                        </Button>
                    </Right>
                </AppHeader>

                <View style={{ flex: 1 }}>

                    {this._renderGroups(usergroups)}

                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: GLOBALS.COLOR.ACCENT }}
                        position="bottomRight"
                        onPress={() => Actions.search()}>
                        <Icon name="add" />
                    </Fab>
                </View>

            </Container>
        );
    }
}