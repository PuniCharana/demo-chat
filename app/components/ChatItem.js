import React from 'react';
import { Text, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux'
import { Left, Body, Right, Icon, ListItem, Thumbnail } from 'native-base';

import CustomThumbnail from '../components/CustomThumbnail'
export default ChatItem = (props) => {

    _onViewGroupChat = (group) => {
        console.log("ChatItem", group);
        Actions.chat({ group: group });
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1);
        }
        return str.slice(0, 2);
    }

    return (
        <ListItem avatar button onPress={() => this._onViewGroupChat(props.group)}>
            <Left>
                {
                    props.group.thumbnail ? (
                        <Thumbnail small source={{ uri: props.group.thumbnail }} />
                    ) : (
                            <CustomThumbnail text={this.getText(props.group.groupname)} />
                        )
                }
            </Left>
            <Body>
                <Text>{props.group.groupname}</Text>
                <Text style={{ fontSize: 12 }}>{props.group.location}</Text>
            </Body>
            <Right style={{ justifyContent: 'center' }}>
                <Icon name="ios-arrow-forward" />
            </Right>
        </ListItem>
    );
}