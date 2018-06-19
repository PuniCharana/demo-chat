import React, { Component } from 'react';

import { Text, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Container, Content, Item, Input, Left, Right, Button, Icon, List, ListItem, Body } from 'native-base';
import GLOBALS from '../Globals';
import { Actions } from 'react-native-router-flux';
import GroupItem from '../components/GroupItem'
import firebase from '../Firebase';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            searchTerm: null,
            groups: [],
            groupsRef: null
        }
    }

    componentDidMount() {
        var groupsRef = firebase.database().ref("groups");

        groupsRef.on("value", (snapshot) => {
            if (snapshot.val()) {
                var groups = [];
                snapshot.forEach(element => {
                    console.log(element.val());
                    groups.push(element.val());
                });

                this.setState({
                    groups: groups
                })
            }
            this.setState({
                isLoading: false
            })
        })

        this.setState({
            groupsRef: groupsRef
        });
    }

    componentWillUnmount() {
        if (this.state.groupsRef) {
            console.log("Remove user groups event listener");
            this.state.groupsRef.off();
        }
    }

    _renderSearchResult() {
        console.log(this.state);
        if (this.state.isLoading) {
            return <ActivityIndicator size="large" color={GLOBALS.COLOR.PRIMARY} />
        } else {
            var groups = this.state.groups;

            return groups.length > 0 ? (
                <List dataArray={groups}
                    renderRow={(group, index) => <GroupItem key={index} group={group} />}>
                </List>
            ) : (
                    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'center' }}>Groups not found</Text>
                    </View>
                )
        }
    }

    _onTextChange = (text) => {

        if (text.length > 1) {
            const filteredAssets = this.state.groups.filter(group => group.groupname.indexOf(text) !== -1);

            this.setState({
                searchTerm: text,
                groups: filteredAssets
            });
        }
    }

    render() {
        return (
            <Container>
                <AppHeader searchBar rounded>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                        </Button>
                    </Left>
                    <Item style={{ flex: 3, borderBottomWidth: 0 }}>
                        <Input
                            style={{ color: GLOBALS.COLOR.WHITE }}
                            selectionColor={GLOBALS.COLOR.WHITE}
                            placeholderTextColor={GLOBALS.COLOR.GRAY}
                            onChangeText={(text) => this._onTextChange(text)} placeholder="Search Group" />
                    </Item>
                    <Right>
                        <Button transparent onPress={this._searchGroup}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name="ios-search" />
                        </Button>
                    </Right>

                </AppHeader>

                <ScrollView style={{ flexGrow: 1 }}>

                    <View >
                        <ListItem icon noBorder style={{ margin: 16 }} onPress={() => Actions.creategroup()}>
                            <Left>
                                <Icon name="people" />
                            </Left>
                            <Body>
                                <Text>Create New Group</Text>
                            </Body>
                            <Right />
                        </ListItem>

                        {this._renderSearchResult()}

                    </View>

                </ScrollView>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
})
