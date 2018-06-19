import React from 'react';
import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux'
import { Container, Button, Title, Content, Left, Body, Right, Icon, List, ListItem, Thumbnail } from 'native-base';
import AppHeader from '../components/AppHeader';
import GLOBALS from '../Globals';
import firebase from '../Firebase';

export default Users = (props) => {

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUpperCase();
        }
        return str.slice(0, 2).toUpperCase();
    }

    var currentUser = firebase.auth().currentUser;

    return (

        <Container>
            <AppHeader>
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                    </Button>
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={{ color: GLOBALS.COLOR.WHITE }} >{props.title}</Title>
                </Body>
            </AppHeader>

            <Content>
                <List dataArray={props.users}
                    renderRow={(user) => (
                        <ListItem style={{ padding: 6 }} avatar button onPress={() => {
                            currentUser.uid === user.uid ? Actions.profile({ user: currentUser }) : Actions.viewuser({ user: props.user })

                        }}>
                            <Left>
                                {
                                    user.avatar ? (
                                        <Thumbnail small source={{ uri: user.avatar }} />
                                    ) : (
                                            <CustomThumbnail text={this.getText(user.displayName)} />
                                        )
                                }
                            </Left>
                            <Body>
                                <Text>
                                    {
                                        currentUser.uid === user.uid ? user.displayName + " (You)" : user.displayName
                                    }
                                </Text>
                            </Body>
                            <Right>
                                <Icon name="ios-arrow-forward" />
                            </Right>
                        </ListItem>
                    )}>
                </List>

            </Content>

        </Container>


    );
}