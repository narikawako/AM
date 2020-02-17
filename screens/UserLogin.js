import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, TextInput, AsyncStorage, StyleSheet, StatusBar, Text, Alert, Switch, ActivityIndicator } from 'react-native';
import { login } from '../assets/DBAction';
import { updateUserAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getStatusBarHeight } from 'react-native-status-bar-height';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, userName: "", password: "", holdUserName: false, holdPassword: false };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#F47224" style={{ paddingTop: 200 }} animating={true} />
        </View>
      )
    }
    return (
      <View style={[styles.container, { paddingTop: getStatusBarHeight() }]}>
        <StatusBar
          barStyle="default"
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {"担当者ログイン"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>担当者名：</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="担当者名" onChangeText={(text) => this.setState({ userName: text })} value={this.state.userName} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>パスワード：</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} secureTextEntry={true} placeholder="パスワード" onChangeText={(text) => this.setState({ password: text })} value={this.state.password} />
        </View>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('SignStack') }} style={styles.buttonLink}>
            <Text style={styles.buttonText}>{" 登録画面へ "}</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
          </TouchableOpacity> */}
          <View style={styles.switchContainer}>
            <Switch
              onValueChange={(value) => { this.setState({ holdUserName: value }) }}
              value={this.state.holdUserName}
            />
            <Text style={styles.smallText}>担当者名を記憶</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              onValueChange={(value) => { this.setState({ holdPassword: value }) }}
              value={this.state.holdPassword}
            />
            <Text style={styles.smallText}>パスワードを記憶</Text>
          </View>
          <TouchableOpacity onPress={this._signInAsync} style={styles.button}>
            <Text style={styles.buttonText}>{" ログイン "}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>
              {"Version: 1.0.7"}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  componentDidMount = async () => {
    //从本地获取数据，决定是否默认加载用户名信息和密码信息
    let localUserName = await AsyncStorage.getItem('APPAM_LocalUserName');
    let localPassword = await AsyncStorage.getItem('APPAM_LocalPassword');
    let holdUserName = await AsyncStorage.getItem('APPAM_HoldUserName');
    let holdPassword = await AsyncStorage.getItem('APPAM_HoldPassword');
    if (holdUserName === "true") {
      this.setState({ userName: localUserName, holdUserName: true });
    } else {
      this.setState({ userName: "", holdUserName: false });
    }
    if (holdPassword === "true") {
      this.setState({ password: localPassword, holdPassword: true });
    } else {
      this.setState({ password: "", holdPassword: false });
    }
    this.setState({ isLoading: false });
  }
  _signInAsync = async () => {

    //Login前先验证是否有空数据
    let inputError = false;
    if (_.isNil(this.state.userName) || _.isEmpty(this.state.userName)) inputError = true;
    if (_.isNil(this.state.password) || _.isEmpty(this.state.password)) inputError = true;
    if (inputError === true) {
      Alert.alert(
        'エラー',
        "未入力項目があります、ご確認ください。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }

    //调起加载数据的动画，避免让用户认为APP卡死。
    this.setState({ isLoading: true });

    let innerUserName = _.trim(this.state.userName);
    let innerPassword = _.trim(this.state.password);

    //如果用户输入的是注册的临时信息，表示用户在使用刚刚注册的信息登录，那么还是用内置的用户验证身份
    let testUserName = await AsyncStorage.getItem('APPAM_TestUserName');
    let testPassword = await AsyncStorage.getItem('APPAM_TestPassword');

    if (innerUserName === testUserName && innerPassword === testPassword) {
      //----------------------------------Start：这是模拟分支，方便APPStore审核---------------------
      await AsyncStorage.setItem('APPAM_ServerType', 'stage');
      const data = {
        LogonName: 'LeySerCustomer',
        Password: '123qwe'
      }
      let user = await login(data);
      if (!_.isNil(user)) {
        //成功的场合，更新State（非异步）
        this.props.updateUserAction(user);
        //保存User到本地（异步）
        await AsyncStorage.setItem('APPAM_LoginFlag', user.id);
        //全部结束之后，跳转页面
        this.props.navigation.navigate('HomeStack');
      }
      //----------------------------------End：这是模拟分支，方便APPStore审核---------------------
    } else {
      //----------------------------------Start：这是正常Login分支---------------------
      //先识别服务器类型
      if (_.endsWith(innerUserName, '@stage')) {
        innerUserName = _.replace(innerUserName, '@stage', '');
        await AsyncStorage.setItem('APPAM_ServerType', 'stage');
      } else if (_.endsWith(innerUserName, '@dev')) {
        innerUserName = _.replace(innerUserName, '@dev', '');
        await AsyncStorage.setItem('APPAM_ServerType', 'dev');
      } else {
        await AsyncStorage.setItem('APPAM_ServerType', 'cloud');
      }
      //调用API验证身份
      const data = {
        LogonName: innerUserName,
        Password: innerPassword
      }
      let user = await login(data);
      if (!_.isNil(user)) {
        //成功的场合，更新State（非异步） //失败的场合，会在Login方法里面提示Message
        this.props.updateUserAction(user);
        //保存User到本地（异步）
        await AsyncStorage.setItem('APPAM_LoginFlag', user.id);
        //成功登录之后强制把设定保存到本地
        await AsyncStorage.setItem('APPAM_LocalUserName', this.state.userName);
        await AsyncStorage.setItem('APPAM_LocalPassword', this.state.password);
        await AsyncStorage.setItem('APPAM_HoldUserName', this.state.holdUserName.toString());
        await AsyncStorage.setItem('APPAM_HoldPassword', this.state.holdPassword.toString());
        //全部结束之后，跳转页面
        this.props.navigation.navigate('HomeStack');
        //----------------------------------End：这是正常Login分支---------------------
      }
    }
  };
}

const mapStateToProps = (state) => {
  //这个组件不用订阅任何全局state数据
  return {};
}
const mapDispatchToProps = (dispatch) => {
  //这个组件需要更新全局state下的User信息
  return bindActionCreators({ updateUserAction }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create(
  {
    textContainer: {
      height: 30,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch",
    },
    text: {
      fontSize: 13,
      color: '#555555',
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 2,
    },
    smallText: {
      fontSize: 10,
      color: '#555555',
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 2,
    },
    container: {
      backgroundColor: '#f0f0f0',
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flex: 1,
    },
    header: {
      height: 50,
      backgroundColor: '#ffffff',
      borderColor: '#a6a6a6',
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      color: "#000000",
      fontSize: 20,
      fontWeight: 'bold',
    },
    inputContainer: {
      height: 50,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch"
    },
    input: {
      fontWeight: 'bold',
      height: 50,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      fontSize: 16
    },
    switchContainer: {
      height: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: '#ffffff',
      paddingRight: 0,
      paddingLeft: 0,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#a6a6a6'
    },
    buttonContainer: {
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 5,
      paddingLeft: 5
    },
    buttonLink: {
      width: 160,
      height: 40,
      backgroundColor: '#9173BE',
      borderWidth: 0,
      borderRadius: 5,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: 80,
      height: 40,
      backgroundColor: '#F47224',
      borderWidth: 0,
      borderRadius: 5,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: 'bold'
    },
    footerContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    footer: {
      height: 50,
      borderWidth: 0,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
    },
    footerTitle: {
      color: "#000000",
      fontSize: 10,
    }
  }
)