import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, View, Text, ActivityIndicator, StatusBar, FlatList, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { loadAccountListAction, deleteAccountItemAction, userLogoutAction } from '../actions/RootAction'
import { deleteItem, getList, logout, getUser } from '../assets/DBAction'
import { WizardHeader } from './ComponentUtilities';
import _ from 'lodash';
import { formatDate } from '../assets/Consts';
import { getStatusBarHeight } from 'react-native-status-bar-height';
class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    this._onBack = this._onBack.bind(this);
    this._onForwards = this._onForwards.bind(this);
  }
  //---------------导航--------------- 
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  //---------------渲染---------------
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#F47224" style={{ paddingTop: 200 }} animating={true} />
        </View>
      )
    }
    if (!_.isNil(this.props.list) && _.isEmpty(this.props.list)) {
      return (
        <View style={[styles.container, { paddingTop: getStatusBarHeight() }]}>
          <StatusBar
            barStyle="default"
          />
          <WizardHeader
            title={_.isNil(this.props.user) ? "" : this.props.user.name}
            onBack={this._onBack}
            onForwards={this._onForwards}
            leftButtonContent={'ﾛｸﾞｱｳﾄ'}
            rightButtonContent={'新規'}
          />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitleContent}>アカウントデータはありません。
            </Text>
            <Image
              style={styles.emptyImage}
              source={require('../assets/empty.png')}
            />
            <Text style={styles.emptyContent}>右上の「新規」ボタンをクリックして、新規作成してください。
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={[styles.container, { paddingTop: getStatusBarHeight() }]}>
        <StatusBar
          barStyle="default"
        />
        <WizardHeader
          title={_.isNil(this.props.user) ? "" : this.props.user.name}
          onBack={this._onBack}
          onForwards={this._onForwards}
          leftButtonContent={'ﾛｸﾞｱｳﾄ'}
          rightButtonContent={'新規'}
        />
        <FlatList style={styles.flatList}
          data={this.props.list}
          renderItem={this._renderItem}
          onRefresh={() => this._onRefresh()}
          refreshing={this.state.isLoading}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }}
        />
      </View>
    );
  }
  _renderItem = ({ item }) => (
    <ListItem
      id={item.id}
      key={item.id}
      accountItem={item}
      onDeleteItem={this._onDeleteAccount}
      onEditItem={this._onEditAccount}
    />
  );
  //---------------操作---------------
  _fetchData = async () => {
    //从DB获取数据
    let dblist = await getList(this.props.user.id);
    if (!_.isNil(dblist)) {
      //通过Action更新State
      this.props.loadAccountListAction(dblist);
    }
    this.setState({ isLoading: false });
  }
  componentDidMount() {
    if (_.isNil(this.props.list)) {
      this.setState({ isLoading: true });
      this._fetchData();
    }
  }
  _onRefresh() {
    this.setState({ isLoading: true });
    this._fetchData();
  }
  _onBack = async () => {
    //从服务器端先退出
    let result = await logout();
    if (!_.isNil(result)) {
      //先清理state
      this.props.userLogoutAction();
      //再清空本地缓存
      await AsyncStorage.removeItem('APPAM_LoginFlag');
      this.props.navigation.navigate('AnthStack');
    }
  };
  _onForwards = () => {
    this.props.navigation.navigate('basic', { accountId: -1 })
  };
  _onDeleteAccount = async (id, name) => {
    Alert.alert(
      '削除',
      "[" + name + "]を削除します、よろしいですか？",
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'OK', onPress: async () => {
            this.setState({ isLoading: true });
            //先从DB删除，然后更新State
            let result = await deleteItem(id);
            if (!_.isNil(result)) {
              this.props.deleteAccountItemAction(id);
            };
            this.setState({ isLoading: false });
          }
        }
      ],
      { cancelable: false },
    )
  };
  _onEditAccount = (id) => {
    this.props.navigation.navigate('basic', { accountId: id })
  };
}
//---------------数据流---------------
const mapStateToProps = (state) => {
  //这个组件订阅User数据和AccountList数据
  return {
    user: state.user,
    list: state.list
  };
}
const mapDispatchToProps = (dispatch) => {
  //这个组件对State有如下操作：
  //查询Account操作（第一把默认查询）
  //删除Account操作
  //Logout操作
  return bindActionCreators({ loadAccountListAction, deleteAccountItemAction, userLogoutAction }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountList);


//---------------纯显示组件---------------

class ListItem extends React.PureComponent {
  _onDeletePress = () => {
    this.props.onDeleteItem(this.props.id, this.props.accountItem.name);
  };
  _onEditPress = () => {
    this.props.onEditItem(this.props.id);
  };
  render() {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._onEditPress}>
          <View style={styles.itemRow}>
            <Text style={styles.code}>
              コード：{this.props.accountItem.code}
            </Text>
            <Text style={styles.date}>
              利用期限：{formatDate(new Date(this.props.accountItem.date))}
            </Text>
          </View>
          <View style={styles.itemRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {this.props.accountItem.name}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this._onDeletePress} style={styles.delete}>
                <Text style={styles.deleteText}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    flatList: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    item: {
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      shadowColor: '#a6a6a6',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    code: {
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    date: {
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    nameContainer: {
      flex: 1
    },
    name: {
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      fontSize: 20,
    },
    buttonContainer: {
      width: 70,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    delete: {
      width: 70,
      backgroundColor: '#F47224',
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0,
      borderRadius: 2,
      paddingTop: 2,
      paddingBottom: 2,

    },
    deleteText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: 'bold'
    },
    emptyContainer: {
      //paddingTop: 20,
      paddingLeft: 10,
      paddingRight: 10,
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    emptyTitleContent: {
      color: "#bababa",
      fontSize: 15,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 50
    },
    emptyContent: {
      color: "#bababa",
      fontSize: 12,
      paddingLeft: 10,
      paddingRight: 10,
    },
    emptyImage: {
      width: 200,
      height: 200
    }
  }
)