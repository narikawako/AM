import React from 'react';
import { AsyncStorage, View} from 'react-native';
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
    //获取到本地的Token数据之后，再决定进入到哪个画面
    const userId = await AsyncStorage.getItem('APPAM_LoginFlag');
    if (_.isNil(userId)) {
      //本地没有用户数据，去登录
      this.props.navigation.navigate('AnthStack');
    } else {
      //本地有用户数据，那么直接根据ID获取对象
      let user = await getUser(userId);
      if (!_.isNil(user)) {
        this.props.updateUserAction(user);
        this.props.navigation.navigate('HomeStack');
      } else {
        await AsyncStorage.removeItem('APPAM_LoginFlag');
        this.props.navigation.navigate('AnthStack');
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