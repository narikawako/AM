import React from 'react';
import { connect } from 'react-redux';
import { Modal, AsyncStorage, View, Text, ActivityIndicator, StatusBar, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { loadAccountListAction, deleteAccountItemAction, userLogoutAction } from '../actions/RootAction'
import { deleteItem, getList, logout, getUser } from '../assets/DBAction'
import { WizardHeader } from './ComponentUtilities';
import _ from 'lodash';
import { formatDate } from '../assets/Consts';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { itemStyles } from './CommonStyles'
class AccountList extends React.Component {
  constructor(props) {
    super(props);
    //因为有Popup，所以要向Popup传递值的话，需要追加新的变量
    this.state = { isLoading: false, modalVisible: false, deleteId: -1, deleteName: '', deleteWaitTime: 0 };
    this._onBack = this._onBack.bind(this);
    this._onForwards = this._onForwards.bind(this);
    this._onDeleteAction = this._onDeleteAction.bind(this);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}>
          <View style={styles.modalContainer}>
            <View style={styles.popupContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.textTitle} >削除</Text>
                <Text style={styles.textContent} >[{this.state.deleteName}] を削除します、よろしいですか？</Text>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }); this.interval && clearInterval(this.interval); }} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onDeleteAction} style={styles.modalButton} disabled={this.state.deleteWaitTime > 0}>
                  <Text style={this.state.deleteWaitTime > 0 ? styles.modalButtonDisableText : styles.modalButtonText}>OK {this.state.deleteWaitTime > 0 && "(" + this.state.deleteWaitTime + ")"} </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  _onDeleteAccount = (id, name) => {
    //显示Popup画面，开始计时
    this.setState({ modalVisible: true, deleteId: id, deleteName: name, deleteWaitTime: 10 });
    //更新计时器，计时结束，清空计时器
    this.interval = setInterval(() => {
      if (this.state.deleteWaitTime == 0) {
        this.interval && clearInterval(this.interval);
      } else {
        this.setState({ deleteWaitTime: this.state.deleteWaitTime - 1 });
      }
    }, 1000);
  };
  _onDeleteAction = async () => {
    //关闭Popup，显示动画，加载数据
    this.setState({ modalVisible: false, isLoading: true });
    //先从DB删除，然后更新State
    let result = await deleteItem(this.state.deleteId);
    if (!_.isNil(result)) {
      this.props.deleteAccountItemAction(this.state.deleteId);
    };
    //无论如何，要清空计时器
    this.interval && clearInterval(this.interval);
    //回到画面
    this.setState({ isLoading: false });
  }
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
    let dt = new Date();
    let deleteVisible = false;
    if ((this.props.accountItem.date === '') || (this.props.accountItem.date.toString() === 'Invalid Date')) {
      //空表示永远不过期
      deleteVisible = false;
    } else {
      deleteVisible = new Date(this.props.accountItem.date) <= dt;
    }
    let itemStyle = itemStyles.commonColor;
    if (deleteVisible) itemStyle = itemStyles.deleteColor
    return (
      <View style={[styles.item, itemStyle]}>
        <TouchableOpacity onPress={this._onEditPress}>
          <View style={[styles.itemRow, itemStyle]}>
            <Text style={[styles.code, itemStyle]}>
              コード：{this.props.accountItem.code}
            </Text>
            <Text style={[styles.date, itemStyle]}>
              利用期限：{formatDate(new Date(this.props.accountItem.date))}
            </Text>
          </View>
          <View style={[styles.itemRow, itemStyle]}>
            <View style={[styles.nameContainer, itemStyle]}>
              <Text style={[styles.name, itemStyle]} numberOfLines={1}>
                {this.props.accountItem.name}
              </Text>
            </View>
            {
              deleteVisible &&
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this._onDeletePress} style={styles.delete}>
                  <Text style={styles.deleteText}>削除</Text>
                </TouchableOpacity>
              </View>
            }
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
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      padding: 1,
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
      borderWidth: 0,
      borderRadius: 5,
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
      flex: 1,
      borderWidth: 0,
      borderRadius: 5,
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
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupContainer: {
      width: 300,
      height: 160,
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
      borderRadius: 2,
    },
    textContainer: {
      width: 300,
      height: 110,
    },
    textTitle: {
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      fontSize: 20,
      height:30,
    },
    textContent: {
      marginTop: 10,
      marginLeft: 20,
      marginRight: 20,
      fontSize: 16,
      height:50,
    },
    modalButtonContainer: {
      width: 300,
      height: 50,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalButton: {
      width: 80,
      height: 30,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    modalButtonText: {
      color: "#0057e5",
    },
    modalButtonDisableText: {
      color: "#a6a6a6",
    }

  }
)