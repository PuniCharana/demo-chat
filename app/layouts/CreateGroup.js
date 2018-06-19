import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import GLOBALS from '../Globals';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

import { Container, Thumbnail, Textarea, List, Input, Content, Left, Body, Right, Button, Icon, Title, ListItem } from 'native-base';

const initialState = {
    groupName: null,
    groupLocation: null,
    locationId: null,
    groupDescription: null,
    autocompletePlaces: [],
}

export default class CreateGroup extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    _createNewGroup = () => {

        if (!this.state.groupName || this.state.groupName.length < 3) {
            this.showAlert("Group name should be atleast three characters");
            return
        }

        if (!this.state.groupLocation) {
            this.showAlert("Location cannot be empty")
            return
        }

        console.log("_createNewGroup");
        console.log(this.state);

        var user = firebase.auth().currentUser;
        console.log(user);
        if (!user) Actions.login();

        var newGroupRef = firebase.database().ref("groups")
        const groupId = newGroupRef.push().key;

        var groupDetails = {
            groupid: groupId,
            groupname: this.state.groupName,
            location: this.state.groupLocation,
            description: this.state.groupDescription,
            latitude: 212121,
            longitude: 1788868,
            thumbnail: null,
            createdbyid: user.uid,
            createdbyname: user.displayName,
            createddate: Date.now(),
            locationId: this.state.locationId,
        }

        var currentuser = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email
        }

        var updates = {};
        updates['/groups/' + groupId] = groupDetails;
        updates['/usergroups/' + currentuser.uid + '/' + groupId] = groupDetails;
        updates['/groupusers/' + groupId + '/' + currentuser.uid] = currentuser;

        firebase.database().ref().update(updates)
            .then(() => {
                console.log("Done creating new group");
                Actions.pop();
                Actions.groupdetails({ group: groupDetails });

            });


    }

    showAlert = (message) => {
        Alert.alert(
            "FAILED TO CREATE",
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: true }
        )
    }

    getPlaces = (text) => {

        // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Vict&types=geocode&language=fr&key=YOUR_API_KEY


        var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&key=AIzaSyAmXYP7FoNnYafHd2jB0AyQHj3d4-YHDkI'

        fetch(url).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    autocompletePlaces: responseJson.predictions
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    selectPlace = (place) => {
        this.setState({
            groupLocation: place.description,
            locationId: place.id,
            autocompletePlaces: []
        })
    }

    renderAutoComplete = (places = []) => {
        return (
            <List style={{ backgroundColor: GLOBALS.COLOR.GRAY }}>
                {
                    places.map((place) => (
                        <ListItem key={place.id} onPress={() => this.selectPlace(place)}>
                            <Text>{place.description}</Text>
                        </ListItem>
                    ))
                }
            </List>
        )
    }

    render() {
        return (
            <Container>
                <AppHeader>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: GLOBALS.COLOR.WHITE }} >Create New Group</Title>
                    </Body>
                    <Right />
                </AppHeader>

                <Content style={{ padding: 16 }}>

                    {/* <Thumbnail large square source={{ uri: 'https://picsum.photos/300' }} style={{ alignSelf: 'center' }} /> */}

                    <Input
                        style={{ color: GLOBALS.COLOR.BLACK, borderBottomWidth: 1, borderBottomColor: GLOBALS.COLOR.GRAY }}
                        selectionColor={GLOBALS.COLOR.BLACK}
                        placeholderTextColor={GLOBALS.COLOR.GRAY}
                        onChangeText={(text) => this.setState({ groupName: text })} placeholder="Group Name" />

                    <Input
                        style={{ color: GLOBALS.COLOR.BLACK, borderBottomWidth: 1, borderBottomColor: GLOBALS.COLOR.GRAY }}
                        selectionColor={GLOBALS.COLOR.BLACK}
                        placeholderTextColor={GLOBALS.COLOR.GRAY}
                        value={this.state.groupLocation}
                        onChangeText={(text) => {
                            this.setState({
                                groupLocation: text
                            })

                            this.getPlaces(text);
                        }} placeholder="Location" />

                    {
                        this.renderAutoComplete(this.state.autocompletePlaces)
                    }
                    <Textarea
                        style={{ color: GLOBALS.COLOR.BLACK, borderBottomWidth: 1, borderBottomColor: GLOBALS.COLOR.GRAY }}
                        selectionColor={GLOBALS.COLOR.BLACK}
                        placeholderTextColor={GLOBALS.COLOR.GRAY}
                        rowSpan={4}
                        placeholder="Description (optional)"
                        onChangeText={(text) => this.setState({ groupDescription: text })} />

                    <TouchableOpacity style={{ marginTop: 10, padding: 10, alignSelf: 'flex-end', backgroundColor: GLOBALS.COLOR.PRIMARY }} onPress={this._createNewGroup}>
                        <Text style={{ color: GLOBALS.COLOR.WHITE }}>Create Group</Text>
                    </TouchableOpacity>

                </Content>

            </Container>
        );
    }
}