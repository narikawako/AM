import React from 'react';
import { connect } from 'react-redux';
import { loadAccountDetailAction, clearAccountDetailAction, updateAccountDetailBasicAction, updateAccountDetailServiceAction } from '../actions/RootAction';
import { getDetail, validateCode, validateName } from '../assets/DBAction';
import { bindActionCreators } from 'redux';
import { Modal, View, TextInput, Platform, DatePickerIOS, Switch, Text, DatePickerAndroid, ActivityIndicator, StatusBar, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import {
  ACCOUNTACTION_ADD,
  ACCOUNTACTION_EDIT,
  hasService,
  fixServices,
  plusKaikeiServices,
  plusShisanServices,
  plusKyuyoServices,
  plusJinjiServices,
  plusGakuhiServices,
  formatDate
} from '../assets/Consts';
import { WizardHeader } from './ComponentUtilities';
import productStyles from './CommonStyles';
import _ from "lodash";
class AccountDetailBasic extends React.Component {
  constructor(props) {
    super(props);

    //计算下下个月的最后一天
    let dt = new Date();
    let lastDay = new Date(dt.getFullYear(), dt.getMonth() + 3, 0);

    this.state = {
      chosenDate: lastDay, //方便取消日付编辑（ios）
      modalVisible: false, //方便实施日付编辑（ios）
      isLoading: false,
      oldname: '', //方便验证Account名是否重复

      //store里面的id不需要在这里调整，接下来的7个属性都和store里的属性一一匹配
      action: this.props.navigation.getParam('accountId') === -1 ? ACCOUNTACTION_ADD : ACCOUNTACTION_EDIT,
      code: '',
      name: '',
      date: lastDay,
      license: '3',
      demo: true,
      remark: '',

      //和store里的products属性匹配
      kaikei: true,
      shisan: true,
      kyuyo: true,
      jinji: true,
      gakuhi: true,

      //和store里的plusproducts属性匹配
      pluskaikei: true,
      plusshisan: true,
      pluskyuyo: true,
      plusjinji: true,
      plusgakuhi: true,
    };
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
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}>
          <View style={styles.modalContainer}>
            <View style={styles.popupContainer}>
              <View style={styles.datePickerContainer}>
                <DatePickerIOS
                  date={this.state.chosenDate}
                  mode="date"
                  locale="ja"
                  onDateChange={(text) => this.setState({ chosenDate: text })}
                />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false, chosenDate: this.state.date }) }} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false, date: this.state.chosenDate }) }} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <StatusBar
          hidden={true}
        />
        <WizardHeader
          title={'基本情報'}
          onBack={this._onBack}
          onForwards={this._onForwards2Detail}
          rightButtonContent={'詳細 ＞'}
        />
        <ScrollView>
          <View style={styles.textContainer}>
            <Text style={styles.text}>アカウントコード：自動付番範囲（{this.props.minid} - {this.props.maxid}）</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputReadonly}
              placeholder='アカウントコード'
              value={this.state.code}
              editable={false}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>アカウント名：</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
              placeholder='アカウント名'
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>利用期限：</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={this._onselectDate} style={styles.dateArea}>
              <Text style={styles.dateAreaText}>{formatDate(this.state.date)}</Text>
            </TouchableOpacity>
          </View>
          {
            this.state.action === ACCOUNTACTION_ADD &&
            <View style={styles.textContainer}>
              <Text style={styles.text}>ライセンス数：</Text>
            </View>
          }
          {
            this.state.action === ACCOUNTACTION_ADD &&
            <View style={styles.inputContainer}>
              <TextInput style={styles.input}
                placeholder='ライセンス数'
                onChangeText={(text) => this.setState({ license: text })}
                value={this.state.license}
                keyboardType={"numeric"}
              />
            </View>
          }
          {
            this.state.action === ACCOUNTACTION_ADD &&
            <View style={styles.textContainer}>
              <Text style={styles.text}>オプション：</Text>
            </View>
          }
          {
            this.state.action === ACCOUNTACTION_ADD &&
            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>標準データを利用する。</Text>
              <Switch
                onValueChange={(text) => this.setState({ demo: text })}
                value={this.state.demo}
              />
            </View>
          }
          <View style={styles.textContainer}>
            <Text style={styles.text}>備考：</Text>
          </View>
          <View style={styles.multilineInputContainer}>
            <TextInput style={styles.multilineInput}
              multiline={true}
              placeholder='備考'
              onChangeText={(text) => this.setState({ remark: text })}
              value={this.state.remark}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>製品一覧：</Text>
          </View>
          <View style={[styles.serviceContainer, productStyles.kaikeiColor]}>
            <View style={styles.serviceLabel}>
              <Text style={styles.serviceLabelContent} >会計システム</Text>
            </View>
            <View style={[styles.itemContainer]}>
              <Text >本体</Text>
              <Switch
                onValueChange={(text) => this.setState({ kaikei: text, pluskaikei: text })}
                value={this.state.kaikei}
              />
            </View>
            <View style={[styles.itemContainer]}>
              <Text >ﾌﾟﾗｽ</Text>
              <Switch
                onValueChange={(text) => this.setState({ pluskaikei: text })}
                value={this.state.pluskaikei}
                disabled={this.state.kaikei !== true}
              />
            </View>
          </View>
          <View style={[styles.serviceContainer, productStyles.shisanColor]}>
            <View style={styles.serviceLabel}>
              <Text style={styles.serviceLabelContent} >資産システム</Text>
            </View>
            <View style={[styles.itemContainer]}>
              <Text >本体</Text>
              <Switch
                onValueChange={(text) => this.setState({ shisan: text, plusshisan: text })}
                value={this.state.shisan}
              />
            </View>
            <View style={[styles.itemContainer]}>
              <Text >ﾌﾟﾗｽ</Text>
              <Switch
                onValueChange={(text) => this.setState({ plusshisan: text })}
                value={this.state.plusshisan}
                disabled={this.state.shisan !== true}
              />
            </View>
          </View>
          <View style={[styles.serviceContainer, productStyles.kyuyoColor]}>
            <View style={styles.serviceLabel}>
              <Text style={styles.serviceLabelContent} >給与システム</Text>
            </View>
            <View style={[styles.itemContainer]}>
              <Text >本体</Text>
              <Switch
                onValueChange={(text) => this.setState({ kyuyo: text, pluskyuyo: text })}
                value={this.state.kyuyo}
              />
            </View>
            <View style={[styles.itemContainer]}>
              <Text >ﾌﾟﾗｽ</Text>
              <Switch
                onValueChange={(text) => this.setState({ pluskyuyo: text })}
                value={this.state.pluskyuyo}
                disabled={this.state.kyuyo !== true}
              />
            </View>
          </View>
          <View style={[styles.serviceContainer, productStyles.jinjiColor]}>
            <View style={styles.serviceLabel}>
              <Text style={styles.serviceLabelContent} >人事システム</Text>
            </View>
            <View style={[styles.itemContainer]}>
              <Text >本体</Text>
              <Switch
                onValueChange={(text) => this.setState({ jinji: text, plusjinji: text })}
                value={this.state.jinji}
              />
            </View>
            <View style={[styles.itemContainer]}>
              <Text >ﾌﾟﾗｽ</Text>
              <Switch
                onValueChange={(text) => this.setState({ plusjinji: text })}
                value={this.state.plusjinji}
                disabled={this.state.jinji !== true}
              />
            </View>
          </View>
          <View style={[styles.serviceContainer, productStyles.gakuhiColor]}>
            <View style={styles.serviceLabel}>
              <Text style={styles.serviceLabelContent} >学費システム</Text>
            </View>
            <View style={[styles.itemContainer]}>
              <Text >本体</Text>
              <Switch
                onValueChange={(text) => this.setState({ gakuhi: text, plusgakuhi: text })}
                value={this.state.gakuhi}
              />
            </View>
            <View style={[styles.itemContainer]}>
              <Text >ﾌﾟﾗｽ</Text>
              <Switch
                onValueChange={(text) => this.setState({ plusgakuhi: text })}
                value={this.state.plusgakuhi}
                disabled={this.state.gakuhi !== true}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._onForwards2Summary} style={styles.button}>
            <Text style={styles.buttonTextBig}>{this.state.action === ACCOUNTACTION_ADD ? ' 新しいアカウントを作成する ' : ' アカウント情報を更新する '}</Text>
            <Text style={styles.buttonTextSmall}>（　選択している製品のすべてのサービスで　）</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  //---------------数据--------------- 
  componentDidMount = async () => {

    //this.props.basic在一开始一定是空的，所以要考虑默认值
    if (_.isNil(this.props.basic)) {

      //编辑的场合，要从数据库获取新数据
      if (this.state.action === ACCOUNTACTION_EDIT) {

        this.setState({ isLoading: true });
        const currentId = this.props.navigation.getParam('accountId');
        let detail = await getDetail(currentId);
        if (!_.isNil(detail)) {
          //然后加载到画面上的state里
          this.setState({
            isLoading: false,

            code: detail.basic.code,
            name: detail.basic.name,
            oldname: detail.basic.name, //这是辅助用的
            date: new Date(detail.basic.date),
            chosenDate: new Date(detail.basic.date), //这是辅助用的
            remark: detail.basic.remark,

            //编辑的时候license和demo两个不需要显示

            //根据各自的service集合来判定是否默认check上radiobutton
            kaikei: !_.isNil(detail.kaikei) && detail.kaikei.length > 0,
            shisan: !_.isNil(detail.shisan) && detail.shisan.length > 0,
            kyuyo: !_.isNil(detail.kyuyo) && detail.kyuyo.length > 0,
            jinji: !_.isNil(detail.jinji) && detail.jinji.length > 0,
            gakuhi: !_.isNil(detail.gakuhi) && detail.gakuhi.length > 0,

            pluskaikei: !_.isNil(detail.plus) && detail.plus.length > 0 && hasService(detail.plus, plusKaikeiServices),
            plusshisan: !_.isNil(detail.plus) && detail.plus.length > 0 && hasService(detail.plus, plusShisanServices),
            pluskyuyo: !_.isNil(detail.plus) && detail.plus.length > 0 && hasService(detail.plus, plusKyuyoServices),
            plusjinji: !_.isNil(detail.plus) && detail.plus.length > 0 && hasService(detail.plus, plusJinjiServices),
            plusgakuhi: !_.isNil(detail.plus) && detail.plus.length > 0 && hasService(detail.plus, plusGakuhiServices),

          });
          //通过Action更新State
          this.props.loadAccountDetailAction(detail);
        } else {
          this.setState({ isLoading: false });
        };
      } else {
        //因为默认的state就是按照新规来设置的，所以这里可以什么都不做
        //仅仅给自动付番的默认Code即可
        let validCode = await this._computeAutoCode();
        this.setState({ code: validCode });
        if (validCode === '') {
          Alert.alert(
            'エラー',
            "申し訳ございませんが、自動付番はできません。付番範囲の調整を管理者へご連絡ください。",
            [
              { text: 'OK' }
            ],
            { cancelable: false },
          );
        }
      }
    } else {

      //如果store里面已经有值了的话，使用store里面的值来设置画面的state
      //例如从后边的页面返回到这个页面的场合
      this.setState({

        code: this.props.basic.code,
        name: this.props.basic.name,
        date: new Date(this.props.basic.date),
        chosenDate: new Date(this.props.basic.date),//这是辅助用的
        license: this.props.basic.license,
        demo: this.props.basic.demo,
        remark: this.props.basic.remark,

        //这个时候action和isLoading不需要调整

        kaikei: _.includes(this.props.basic.products, "kaikei"),
        shisan: _.includes(this.props.basic.products, "shisan"),
        kyuyo: _.includes(this.props.basic.products, "kyuyo"),
        jinji: _.includes(this.props.basic.products, "jinji"),
        gakuhi: _.includes(this.props.basic.products, "gakuhi"),

        pluskaikei: _.includes(this.props.basic.plusproducts, "pluskaikei"),
        plusshisan: _.includes(this.props.basic.plusproducts, "plusshisan"),
        pluskyuyo: _.includes(this.props.basic.plusproducts, "pluskyuyo"),
        plusjinji: _.includes(this.props.basic.plusproducts, "plusjinji"),
        plusgakuhi: _.includes(this.props.basic.plusproducts, "plusgakuhi"),

      });
    }
  }

  //---------------操作---------------
  //自动付番处理
  _computeAutoCode = async () => {
    let validCode = '';
    let checkResult = false;
    for (var i = this.props.minid; i <= this.props.maxid; i++) {
      if (!_.includes(this.props.existids, i)) {
        checkResult = await validateCode(i);
        if (checkResult === true) {
          validCode = String(i);
          return validCode;
        }
      }
    }
    return validCode;
  }
  //验证重名
  _validName = async (name) => {
    let checkResult = false;
    checkResult = await validateName(name);
    return checkResult;
  }
  //选择日付
  _onselectDate = () => {
    if (Platform.OS === 'ios') {
      this._onselectDate4iOS();
    } else {
      this._onselectDate4Android();
    }

  }
  _onselectDate4iOS = () => {
    this.setState({ modalVisible: true });
  }
  _onselectDate4Android = async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: this.state.date,
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      const returnDate = new Date(year, month, day)
      this.setState({ date: returnDate, chosenDate: returnDate });
    }
  }
  //导航
  _onBack = () => {
    //后退离开这个画面的时候，一定要先清理state，保证下次来的时候数据是干净的
    this.props.clearAccountDetailAction();
    this.props.navigation.navigate('list');
  };
  _onForwards2Detail = () => {
    this._onForwards(true);
  }
  _onForwards2Summary = () => {
    this._onForwards(false);
  }
  _onForwards = async (forwards2Detail) => {

    //必须入力项目的check
    let inputError = false;
    if (_.isNil(this.state.code) || _.isEmpty(this.state.code)) inputError = true;
    if (_.isNil(this.state.name) || _.isEmpty(this.state.name)) inputError = true;
    if (_.isNil(this.state.date)) inputError = true;
    if (this.state.action === ACCOUNTACTION_ADD && _.isNil(this.state.license) || _.isEmpty(this.state.license)) inputError = true;
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
    //只有新规的时候，才需要验证名字是否重复。
    //或者编辑的时候，只有用户改了名字才需要验证是否重复（改了名字之后，肯定和自己的原名字不一样，所以此时验证的刚好就是和别人是否重复）
    if ((this.state.action === ACCOUNTACTION_ADD) || (this.state.action === ACCOUNTACTION_EDIT && this.state.oldname !== this.state.name)) {
      let validResult = await this._validName(this.state.name);
      if (validResult === false) {
        Alert.alert(
          'エラー',
          "アカウント名は重複ですが、ご確認ください。",
          [
            { text: 'OK' }
          ],
          { cancelable: false },
        );
        return;
      }
    }
    //组建保存用的数据
    let basic = {
      action: this.state.action,
      //通过页面调整传递过来的参数
      id: this.props.navigation.getParam('accountId'),
      code: this.state.code,
      name: this.state.name,
      date: formatDate(this.state.date),
      license: this.state.license,
      demo: this.state.demo,
      remark: this.state.remark,
    }
    let products = [];
    //这个必须是有序的，因为后面会根据这个决定下一步到哪个画面
    if (this.state.kaikei) products.push("kaikei");
    if (this.state.shisan) products.push("shisan");
    if (this.state.kyuyo) products.push("kyuyo");
    if (this.state.jinji) products.push("jinji");
    if (this.state.gakuhi) products.push("gakuhi");
    basic.products = products;

    let plusproducts = [];
    //这个不一定要有序，因为仅仅缓存选择了什么
    if (this.state.pluskaikei) plusproducts.push("pluskaikei");
    if (this.state.plusshisan) plusproducts.push("plusshisan");
    if (this.state.pluskyuyo) plusproducts.push("pluskyuyo");
    if (this.state.plusjinji) plusproducts.push("plusjinji");
    if (this.state.plusgakuhi) plusproducts.push("plusgakuhi");
    basic.plusproducts = plusproducts;

    //先更新State(无论新规还是编辑，都需要更新)
    this.props.updateAccountDetailBasicAction(basic);

    if (forwards2Detail) {
      //页面跳转到详细设定
      //state的详细信息都是空的
      //在详细画面进行逐一设定
      if (products.length === 0) {
        this.props.navigation.navigate('summary');
      } else {
        this.props.navigation.navigate(products[0]);
      }
    } else {
      //无论新规编辑，凡是通过快速创建按钮点击的，都是state的详细信息都是全Service
      _.forEach(products, (pro) => {
        let fixServiceData = _.map(_.find(fixServices, { 'product': pro }).services, 'id');
        this.props.updateAccountDetailServiceAction({
          product: pro,
          services: fixServiceData
        });
      })
      //强制跳转到Summary画面
      this.props.navigation.navigate('summary', { directAction: 1 });
    }
  };
}

//---------------数据流相关---------------
const mapStateToProps = (state) => {
  //这个组件订阅哪些State??
  //订阅明细的basic数据和用户数据以及Account数据，因为要连续付番
  //basic里面的products数据，无论对于新规还是编辑，都没有用，在basic里面追加products属性，仅仅是为了记录下画面上的选择，方便之后的画面做跳转
  //同样，plusproducts也没有用，仅仅是记录哪些plus服务被选中了
  return {
    minid: _.isNil(state.user) ? '0' : state.user.minid,
    maxid: _.isNil(state.user) ? '0' : state.user.maxid,
    existids: _.isNil(state.list) ? [] : _.map(state.list, 'id'),
    basic: state.basic
  };
}
const mapDispatchToProps = (dispatch) => {
  //这个组件对State有哪些CUID操作？？
  //加载明细数据
  //清理明细数据
  //保存Basic数据
  //保存明细数据（快速创建的场合）
  return bindActionCreators({ loadAccountDetailAction, clearAccountDetailAction, updateAccountDetailBasicAction, updateAccountDetailServiceAction }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailBasic);

const styles = StyleSheet.create(
  {
    leftHeaderButton: {
      paddingLeft: 5
    },
    rightHeaderButton: {
      paddingRight: 5
    },
    container: {
      backgroundColor: '#f0f0f0',
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flex: 1,

    },
    textContainer: {
      height: 30,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch",
    },
    text: {
      fontSize: 13,
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 2,
      color: '#555555',

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
    inputReadonly: {
      fontWeight: 'bold',
      height: 50,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#d3d3d3',
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 5,
      marginRight: 5,
      fontSize: 16
    },
    multilineInputContainer: {
      height: 100,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch",

    },
    multilineInput: {
      fontWeight: 'bold',
      height: 100,
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
    radioContainer: {
      height: 50,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
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
    },
    radioLabel: {
      fontWeight: 'bold',
    },
    serviceContainer: {
      height: 50,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",

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
      marginBottom: 10,
    },
    serviceLabel: {
      width: 100,
    },
    serviceLabelContent: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      width: 98,
    },
    buttonContainer: {
      height: 70,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: '#ffffff',
      marginLeft: 0,
      marginRight: 0,
    },
    button: {
      width: 300,
      height: 50,
      backgroundColor: '#F47224',
      borderWidth: 0,
      borderRadius: 5,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonTextBig: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: 'bold'
    },
    buttonTextSmall: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight: 'bold'
    },
    dateArea: {
      height: 50,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      paddingRight: 10,
      paddingLeft: 10,
      marginLeft: 5,
      marginRight: 5,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    dateAreaText: {
      fontWeight: 'bold',
      fontSize: 16
    },
    modalContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupContainer: {
      width: 300,
      height: 270,
      backgroundColor: '#ffffff',
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    datePickerContainer: {
      width: 300,
      height: 220,
    },
    modalButtonContainer: {
      width: 300,
      height: 50,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-start",
    },
    modalButton: {
      width: 100,
      height: 40,
      backgroundColor: '#F47224',
      borderWidth: 0,
      borderRadius: 5,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    modalButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: 'bold'
    }
  }
)