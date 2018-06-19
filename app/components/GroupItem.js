import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import { Left, Body, Right, ListItem, Thumbnail } from 'native-base';

import CustomThumbnail from '../components/CustomThumbnail';

export default GroupItem = (props) => {

    _onViewGroup = (item) => {
        console.log(item);
        Actions.groupdetails({ group: item });
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1);
        }
        return str.slice(0, 2);
    }

    return (
        <ListItem avatar button onPress={() => this._onViewGroup(props.group)}>
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
            <Right/>
            {/* <Right style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 12 }} note>169 m</Text>
                <Text style={{ fontSize: 12 }} note>1.2 km</Text>
            </Right> */}
        </ListItem>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});