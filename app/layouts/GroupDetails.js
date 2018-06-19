import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Root, Container, Content, Left, Body, Right, Button, Icon, ListItem, List, Thumbnail, ActionSheet } from 'native-base';
import GLOBALS from '../Globals';
import AppHeader from '../components/AppHeader';
import { Actions } from 'react-native-router-flux';
import firebase from '../Firebase';
import CustomThumbnail from '../components/CustomThumbnail';

var BUTTONS = [
    { text: "Edit", icon: "create", iconColor: GLOBALS.COLOR.PRIMARY },
    { text: "Delete", icon: "trash", iconColor: "#fa213b" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var EDIT_INDEX = 0;
var DELETE_INDEX = 1;
var CANCEL_INDEX = 2;

const initialState = {
    isUserInGroup: false,
    groupUsers: [],
    isUserInGroupRef: null
}

export default class GroupDetails extends Component {


    constructor(props) {
        super(props);
        this.state = initialState;

    }
    // initialize state

    componentDidMount() {
        var user = firebase.auth().currentUser;
        console.log("componentDidMount: ", this.props.group, user);

        var ref = firebase.database().ref("groupusers/" + this.props.group.groupid);
        ref.on("value", (snapshot) => {
            if (snapshot.val()) {

                var users = snapshot.val();
                console.log(users);
                if (user.uid in users) {
                    console.log("User is in the group");
                    this.setState({
                        isUserInGroup: true,
                        groupUsers: users
                    });
                } else {
                    this.setState({
                        isUserInGroup: false,
                        groupUsers: users
                    });
                }
            } else {
                console.log("User is not in the group");
                this.setState(initialState);
            }
        }, (error) => {
            console.log(error);
        });

        this.setState({
            isUserInGroupRef: ref
        })
    }

    componentWillUnmount() {
        if (this.state.isUserInGroupRef) {
            console.log("Remove user isUserInGroupRef event listener");
            this.state.isUserInGroupRef.off();
        }
    }


    showAlert = (message) => {
        Alert.alert(
            "FAILED TO DELETE",
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
        )
    }

    showActionSheet = () => {
        console.log(this.state);
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: this.props.group.groupname
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case EDIT_INDEX: {
                        console.log("Edit");
                        break;
                    }
                    case DELETE_INDEX: {
                        console.log(typeof this.state.groupUsers);
                        if (Object.keys(this.state.groupUsers).length <= 1) {
                            console.log("Delete");

                            var user = firebase.auth().currentUser;
                            var groupId = this.props.group.groupid;

                            var updates = {};
                            updates['/groups/' + groupId] = null;
                            updates['/usergroups/' + user.uid + '/' + groupId] = null;
                            updates['/groupusers/' + groupId + '/' + user.uid] = null;

                            firebase.database().ref().update(updates).then(() => {
                                Actions.popTo('home');
                            });

                        } else {
                            this.showAlert("Cannot delete group because there are two or more user");
                        }
                        break;
                    }
                    case CANCEL_INDEX: {
                        console.log("Cancel");
                        break;
                    }
                }
            }
        )
    }

    onJoinPress = () => {
        var user = firebase.auth().currentUser;

        var group = this.props.group;

        console.log(user, group, this.state);
        if (user) {

            var currentuser = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email
            }

            var updates = {};
            updates['/usergroups/' + currentuser.uid + '/' + group.groupid] = group;
            updates['/groupusers/' + group.groupid + '/' + currentuser.uid] = currentuser;

            firebase.database().ref().update(updates)
                .then(() => {
                    console.log("Joined");
                }, (error) => {
                    console.log(error);
                });
        }
    }

    onExitPress = () => {
        var user = firebase.auth().currentUser;
        var group = this.props.group;
        if (user) {
            var updates = {};
            updates['/usergroups/' + user.uid + '/' + group.groupid] = null;
            updates['/groupusers/' + group.groupid + '/' + user.uid] = null;

            firebase.database().ref().update(updates)
                .then(() => {
                    console.log("Exited");
                }, (error) => {
                    console.log(error);
                });
        }
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUpperCase();
        } else {
            console.log(str)
            var shortText = str.slice(0, 2);
            console.log(shortText)
            return shortText.toUpperCase();
        }

    }

    render() {
        var user = firebase.auth().currentUser;

        var group = this.props.group;

        return (
            <Root>
                <Container>
                    <AppHeader>
                        <Left style={{ flex: 1 }}>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            {/* <Title style={{ color: GLOBALS.COLOR.WHITE }} >{group.groupname}</Title> */}
                        </Body>

                        <Right >
                            {
                                user.uid != group.createdbyid ? null : (
                                    <Button transparent onPress={() => this.showActionSheet()}>
                                        <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='settings' />
                                    </Button>
                                )
                            }
                        </Right>
                    </AppHeader>

                    <Content>

                        <View style={{ flexDirection: 'row', padding: 16, backgroundColor: GLOBALS.COLOR.PRIMARY }}>

                            {
                                group.thumbnail ? (
                                    <Thumbnail large source={{ uri: group.thumbnail }} style={{ marginRight: 16 }} />
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
                                                {this.getText(group.groupname)}
                                            </Text>
                                        </View>
                                    )
                            }

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.textColor, { fontWeight: 'bold', fontSize: 18 }]}>{group.groupname}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={[styles.textColor]}>{group.location}</Text>
                                        <Text style={[styles.textColor]}>Created by {group.createdbyname}</Text>
                                    </View>

                                    {
                                        this.state.isUserInGroup ? (
                                            <Button rounded style={styles.button} onPress={() => this.onExitPress()}>
                                                <Text style={styles.buttonText}>EXIT</Text>
                                            </Button>
                                        ) : (
                                                <Button rounded style={styles.button} onPress={() => this.onJoinPress()}>
                                                    <Text style={styles.buttonText}>JOIN</Text>
                                                </Button>
                                            )
                                    }

                                </View>
                            </View>
                        </View>


                        <View style={{ padding: 16, flexDirection: 'column', borderBottomWidth: 0.5, borderBottomColor: GLOBALS.COLOR.GRAY }}>
                            <Text style={{ color: GLOBALS.COLOR.PRIMARY, fontWeight: 'bold', flex: 1 }}>Description</Text>
                            {
                                group.description ? (
                                    <Text>{group.description}</Text>
                                ) : (
                                        <Text>No description</Text>
                                    )
                            }
                        </View>

                        <List>
                            <ListItem icon onPress={() => Actions.users({ title: group.groupname, users: this.state.groupUsers })}>
                                <Left>
                                    <Icon name="people" />
                                </Left>
                                <Body>
                                    <Text>{Object.keys(this.state.groupUsers).length} participants</Text>
                                </Body>
                                <Right>
                                    <Text style={{ color: GLOBALS.COLOR.PRIMARY }}>View</Text>
                                </Right>
                            </ListItem>
                            {
                                this.state.isUserInGroup ? (

                                    <ListItem icon onPress={() => Actions.chat({ group: group })}>
                                        <Left>
                                            <Icon name="chatbubbles" />
                                        </Left>
                                        <Body>
                                            <Text>Conversation</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{ color: GLOBALS.COLOR.PRIMARY }}>View</Text>
                                        </Right>
                                    </ListItem>
                                ) : null
                            }

                        </List>

                    </Content>

                </Container>
            </Root>
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