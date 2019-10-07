import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, TextInput, AsyncStorage, StyleSheet, StatusBar, Text, Alert } from 'react-native';
import { login } from '../assets/DBAction';
import { updateUserAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getStatusBarHeight } from 'react-native-status-bar-height';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: "", password: "", passwordAgain: "" };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  render() {
    return (
      <View style={[styles.container, { paddingTop: getStatusBarHeight() }]}>
        <StatusBar
          backgroundColor="blue" barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {"担当者登録"}
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
        <View style={styles.textContainer}>
          <Text style={styles.text}>パスワード確認：</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} secureTextEntry={true} placeholder="パスワード" onChangeText={(text) => this.setState({ passwordAgain: text })} value={this.state.passwordAgain} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('AnthStack') }} style={styles.buttonLink}>
            <Text style={styles.buttonText}>{" ログイン画面へ "}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._signInAsync} style={styles.button}>
            <Text style={styles.buttonText}>{" 登録 "}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  componentDidMount() {
    this.setState({ userName: "", password: "", passwordAgain: "" });
  }
  _signInAsync = async () => {

    let inputError = false;
    if (_.isNil(this.state.userName) || _.isEmpty(this.state.userName)) inputError = true;
    if (_.isNil(this.state.password) || _.isEmpty(this.state.password)) inputError = true;
    if (_.isNil(this.state.passwordAgain) || _.isEmpty(this.state.passwordAgain)) inputError = true;
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
    if (this.state.password !== this.state.passwordAgain) {
      Alert.alert(
        'エラー',
        "パスワードとパスワード確認は同じではないので、ご確認ください。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }
    if (_.size(this.state.password) < 8) {
      Alert.alert(
        'エラー',
        "パスワードは弱いので、ご確認ください。",
        [
          { text: 'OK' }
        ],
        { cancelable: false },
      );
      return;
    }

    Alert.alert(
      'お知らせ',
      "ご登録、どうもありがとうございました。これから、レーザーアカウントを作成してください。",
      [
        { text: 'OK' }
      ],
      { cancelable: false },
    );

    await AsyncStorage.setItem('APPAM_ServerType', 'stage');
    await AsyncStorage.setItem('APPAM_TestUserName', this.state.userName);
    await AsyncStorage.setItem('APPAM_TestPassword', this.state.password);

    //调用API验证身份
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup);

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
  }
)