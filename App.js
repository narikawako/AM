import React from 'react';
//导航
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import  AppStack  from './navigations/AppStack';
import  LoginStack  from './navigations/LoginStack';
import  SignupStack  from './navigations/SignupStack';
import  AuthSwitch  from './navigations/AnthSwitch';
//数据流
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers/RootReducer';

//导航处理：SwitchPage判定是否已经有登录情报，实施跳转
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      SwitchPage: AuthSwitch,
      HomeStack: AppStack,
      AnthStack: LoginStack,
      SignStack: SignupStack,
    },
    {
      initialRouteName: 'SwitchPage',
    }
  )
);
export default class App extends React.Component {
  render() {
    return (
      //数据流处理：通过Provider和createStore将全局的state绑定到组件
      <Provider store={createStore(reducer)}>
        <AppContainer />
      </Provider>
    );
  }
}