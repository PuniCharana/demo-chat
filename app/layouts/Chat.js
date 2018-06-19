import React, { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    View,
    Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Subtitle, Left, Body, Right, Button, Thumbnail, Icon, Title } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import AppHeader from '../components/AppHeader';
import GLOBALS from '../Globals';
import firebase from '../Firebase';
import CustomThumbnail from '../components/CustomThumbnail';

const initialProps = {
    messages: [],
    chatMessagesRef: null,
    isLoading: true,
}
export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = initialProps;
    }

    componentDidMount() {
        var messagesRef = firebase.database().ref("groupmessages/" + this.props.group.groupid);
        messagesRef.orderByChild("createdAt").once("value", (snapshot) => {
            this.setState({
                isLoading: false,
            })
        })
        messagesRef.orderByChild("createdAt").on("child_added", (snapshot) => {
            console.log("child_added");
            if (snapshot.val()) {
                // console.log(snapshot.val());
                var newMessages = [];
                newMessages.push(snapshot.val());
                // console.log(newMessages);

                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, newMessages),
                }))
            }

        }, (error) => {
            console.log(error);
        });

        console.log(messagesRef);

        this.setState({
            chatMessagesRef: messagesRef
        })
    }

    componentWillUnmount() {
        if (this.state.chatMessagesRef) {
            console.log("Remove chat messages listener");
            this.state.chatMessagesRef.off();
        }
    }

    onSend(messages = []) {
        var message = messages[0];
        message.createdAt = new Date().toString();
        console.log(message);
        firebase.database().ref("groupmessages/" + this.props.group.groupid + "/" + message._id).set(message);
    }

    _gotoGroupDetails = (group) => {
        Actions.groupdetails({ group: group })
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUpperCase();
        }
        return str.slice(0, 2).toUpperCase();
    }

    renderUserAvatar(messages = []) {
        if(messages.currentMessage.user.avatar){
            return <Thumbnail small source={{ uri: messages.currentMessage.user.avatar }} />
        }
        return <CustomThumbnail text={this.getText(messages.currentMessage.user.displayName)} />
    }

    getKey = () => {
        return firebase.database().ref("chats").push().key;
    }
    render() {
        const group = this.props.group;
        var user = firebase.auth().currentUser;

        var currentUser = {
            _id: user.uid,
            displayName: user.displayName,
            email: user.email,
            avatar: user.photoURL
        }

        // console.log('state: ', this.state.messages);

        return (

            <Container>
                <AppHeader>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: GLOBALS.COLOR.WHITE }} onPress={() => this._gotoGroupDetails(group)}>{group.groupname}</Title>
                        <Subtitle style={{ color: GLOBALS.COLOR.WHITE, fontSize: 12 }} onPress={() => this._gotoGroupDetails(group)} >tap here to view details</Subtitle>
                    </Body>
                    <Right />
                </AppHeader>

                <View style={{ flex: 1 }}>

                    {
                        this.state.isLoading ? (
                            <ActivityIndicator size="large" color={GLOBALS.COLOR.PRIMARY} />
                        ) : null
                    }

                    <GiftedChat
                        inverted={true}
                        onPressAvatar={(user) => console.log(user)}
                        messages={this.state.messages}
                        showAvatarForEveryMessage={false}
                        onSend={messages => this.onSend(messages)}
                        renderAvatar={messages => this.renderUserAvatar(messages)}
                        user={currentUser}
                    />

                </View>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});