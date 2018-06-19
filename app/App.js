import React from 'react';
import { View, StatusBar } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import GLOBALS from './Globals'
import Splash from './layouts/Splash';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Home from './layouts/Home';
import GroupDetails from './layouts/GroupDetails';
import Search from './layouts/Search';
import Profile from './layouts/Profile';
import CreateGroup from './layouts/CreateGroup';
import Chat from './layouts/Chat';
import Users from './layouts/Users';
import ViewUser from './layouts/ViewUser'

export default App = () => {

  const onBackAndroid = () => {
    return Actions.pop(); // Return true to stay, or return false to exit the app.
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={GLOBALS.COLOR.PRIMARYDARK}
        barStyle="light-content"
      />
      <Router tintColor={GLOBALS.COLOR.WHITE} sceneStyle={{ backgroundColor: '#fff' }} backAndroidHandler={onBackAndroid}>
        <Scene key="root">
          <Scene key="splash" hideNavBar={true} initial component={Splash} />
          <Scene key="login" hideNavBar={true} component={Login} />
          <Scene key="signup" hideNavBar={true} component={Signup} />
          <Scene key="home" hideNavBar={true} component={Home} />
          <Scene key="groupdetails" hideNavBar={true} component={GroupDetails} />
          <Scene key="search" hideNavBar={true} component={Search} />
          <Scene key="profile" hideNavBar={true} component={Profile}/>
          <Scene key="creategroup" hideNavBar={true} component={CreateGroup}/>
          <Scene key="chat" hideNavBar={true} component={Chat}/>
          <Scene key="users" hideNavBar={true} component={Users}/>
          <Scene key="viewuser" hideNavBar={true} component={ViewUser}/>
        </Scene>
      </Router>
    </View>
  );

}