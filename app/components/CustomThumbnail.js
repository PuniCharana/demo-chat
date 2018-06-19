import React from 'react';
import { Text, View } from 'react-native';
import GLOBALS from '../Globals'

export default CustomThumbnail = (props) => {
    return (
        <View style={{ backgroundColor: GLOBALS.COLOR.PRIMARY, padding: 10, alignContent: 'center', alignItems: 'center', borderRadius: 50 }}>
            <Text style={{ color: GLOBALS.COLOR.WHITE, fontWeight: 'bold', alignSelf: 'center' }}>{props.text.toUpperCase()}</Text>
        </View>
    );
}