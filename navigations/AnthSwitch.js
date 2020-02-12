import React from 'react';
import { AsyncStorage, View } from 'react-native';
import _ from "lodash";
import { getUser } from '../assets/DBAction';
import { updateUserAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class AuthSwitch extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    //获取到本地的Token数据（userId）之后，再决定进入到哪个画面
    const userId = await AsyncStorage.getItem('APPAM_LoginFlag');
    if (_.isNil(userId)) {
      //------------------场合1：首次登录，本地没有用户Token数据（userId），一定要去登录画面认证-----------------
      this.props.navigation.navigate('AnthStack');
    } else {
      //本地有用户数据Token数据（userId），那么直接根据Token数据获取User对象
      let user = await getUser(userId);
      if (!_.isNil(user)) {
        //------------------场合2：服务器端判定Token还没有过期，那么直接进入主页面-----------------
        this.props.updateUserAction(user);
        this.props.navigation.navigate('HomeStack');
      } else {
        //服务器端判定Token已经过期了，那么再尝试用本地的用户名密码（如果保存了的话）重新登录一次
        let localUserName = await AsyncStorage.getItem('APPAM_LocalUserName');
        let localPassword = await AsyncStorage.getItem('APPAM_LocalPassword');
        if (!_.isNil(localUserName) && !_.isEmpty(localUserName) && !_.isNil(localPassword) && !_.isEmpty(localPassword)) {
          //------------------场合3：服务端提示Token过期，但是本地还有登录信息，可以尝试静默登录-----------------
          if (_.endsWith(localUserName, '@stage')) {
            localUserName = _.replace(localUserName, '@stage', '');
            await AsyncStorage.setItem('APPAM_ServerType', 'stage');
          } else if (_.endsWith(localUserName, '@dev')) {
            localUserName = _.replace(localUserName, '@dev', '');
            await AsyncStorage.setItem('APPAM_ServerType', 'dev');
          } else {
            await AsyncStorage.setItem('APPAM_ServerType', 'cloud');
          }
          const data = {
            LogonName: localUserName,
            Password: localPassword
          }
          let loginUser = await login(data);
          if (!_.isNil(loginUser)) {
            this.props.updateUserAction(loginUser);
            await AsyncStorage.setItem('APPAM_LoginFlag', loginUser.id);
            this.props.navigation.navigate('HomeStack');
          }
        } else {
          //------------------场合4：服务端提示Token过期，而且本地还没有保存用户名和密码，那么只能去登录页面认证了-----------------
          await AsyncStorage.removeItem('APPAM_LoginFlag');
          this.props.navigation.navigate('AnthStack');
        }
      }
    }
  };
  render() {
    return (
      <View></View>
    );
  }
}

const mapStateToProps = (state) => {
  //这个组件不用订阅任何全局state数据
  return {};
}
const mapDispatchToProps = (dispatch) => {
  //这个组件需要更新全局state下的User信息
  return bindActionCreators({ updateUserAction }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthSwitch);