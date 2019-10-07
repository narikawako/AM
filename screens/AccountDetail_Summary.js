import React from 'react';
import { connect } from 'react-redux';
import { addAccountItemAction, updateAccountItemAction, clearAccountDetailAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { View, AsyncStorage, StatusBar, StyleSheet, ScrollView, Alert } from 'react-native';
import _ from 'lodash';
import { addItem, updateItem } from '../assets/DBAction';
import { ACCOUNTACTION_ADD, kaikeiServices, shisanServices, kyuyoServices, jinjiServices, gakuhiServices, plusCommonServices, plusKaikeiServices, plusShisanServices, plusKyuyoServices, plusJinjiServices, plusGakuhiServices } from '../assets/Consts';
import { BasicDisplayTable, ServiceDisplayTable, WizardHeader, RemarkDisplayTable } from '../screens/ComponentUtilities';
import productStyles from './CommonStyles';
import { Timer } from './Timer';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const AllServices = _.concat(kaikeiServices, shisanServices, kyuyoServices, jinjiServices, gakuhiServices, plusCommonServices, plusKaikeiServices, plusShisanServices, plusKyuyoServices, plusJinjiServices, plusGakuhiServices);

class AccountDetailSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directAction: !_.isNil(this.props.navigation.getParam('directAction')) ? 1 : 0,
      isLoading: false,
      totalTime: 45
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
        <Timer totalTime={this.state.totalTime} />
      )
    }
    let saveContent = '';
    if (!_.isNil(this.props.basic)) {
      saveContent = this.props.basic.action === ACCOUNTACTION_ADD ? '作成' : '更新';
    }
    return (
      <View style={{ flex: 1 ,paddingTop: getStatusBarHeight()  }}>
        <StatusBar
          backgroundColor="blue" barStyle="light-content"
        />
        <WizardHeader
          title={'内容一覧'}
          onBack={this._onBack}
          onForwards={this._onSave}
          rightButtonContent={saveContent}
        />
        <ScrollView>
          <View style={styles.container}>
            {!_.isNil(this.props.basic) &&
              <BasicDisplayTable
                basic={this.props.basic}
              />}
            {!_.isNil(this.props.basic) &&
              <RemarkDisplayTable
                remark={this.props.basic.remark}
              />}
            {!_.isNil(this.props.basic) && _.includes(this.props.basic.products, "kaikei") && !_.isNil(this.props.kaikei) && this.props.kaikei.length > 0 &&
              <ServiceDisplayTable
                productName={"会計"}
                backgroundColor={productStyles.kaikeiColor}
                services={this.prepareServices(this.props.kaikei)}
              />
            }
            {!_.isNil(this.props.basic) && _.includes(this.props.basic.products, "shisan") && !_.isNil(this.props.shisan) && this.props.shisan.length > 0 &&
              <ServiceDisplayTable
                productName={"資産"}
                backgroundColor={productStyles.shisanColor}
                services={this.prepareServices(this.props.shisan)}
              />
            }
            {!_.isNil(this.props.basic) && _.includes(this.props.basic.products, "kyuyo") && !_.isNil(this.props.kyuyo) && this.props.kyuyo.length > 0 &&
              <ServiceDisplayTable
                productName={"給与"}
                backgroundColor={productStyles.kyuyoColor}
                services={this.prepareServices(this.props.kyuyo)}
              />
            }
            {!_.isNil(this.props.basic) && _.includes(this.props.basic.products, "jinji") && !_.isNil(this.props.jinji) && this.props.jinji.length > 0 &&
              <ServiceDisplayTable
                productName={"人事"}
                backgroundColor={productStyles.jinjiColor}
                services={this.prepareServices(this.props.jinji)}
              />
            }
            {!_.isNil(this.props.basic) && _.includes(this.props.basic.products, "gakuhi") && !_.isNil(this.props.gakuhi) && this.props.gakuhi.length > 0 &&
              <ServiceDisplayTable
                productName={"学費"}
                backgroundColor={productStyles.gakuhiColor}
                services={this.prepareServices(this.props.gakuhi)}
              />
            }
            {!_.isNil(this.props.basic) && !_.isEmpty(this.props.basic.plusproducts) && !_.isNil(this.props.plus) && this.props.plus.length > 0 &&
              <ServiceDisplayTable
                productName={"ﾌﾟﾗｽ"}
                backgroundColor={productStyles.plusColor}
                services={this.prepareServices(this.props.plus)}
              />
            }
          </View >
        </ScrollView>
      </View>
    );
  }
  componentDidMount = async () => {
    let lastTime = null;
    if (this.props.basic.action === ACCOUNTACTION_ADD) {
      lastTime = await AsyncStorage.getItem('APPAM_LastAddTime');
      if (!_.isNil(lastTime)) {
        this.setState({ totalTime: lastTime });
      } else {
        this.setState({ totalTime: 45 });
      }
    } else {
      lastTime = await AsyncStorage.getItem('APPAM_LastUpdateTime');
      if (!_.isNil(lastTime)) {
        this.setState({ totalTime: lastTime });
      } else {
        this.setState({ totalTime: 20 });
      }
    }
  }
  prepareServices(services) {
    //把serviceid列表转换成service对象列表
    let servicesData = [];
    _.forEach(services, (id) => {
      const index = _.findIndex(AllServices, (s) => { return s.id === id; });
      servicesData = _.concat(servicesData, AllServices[index])
    });
    return servicesData;
  }
  //---------------操作---------------
  _onBack = () => {
    if (this.state.directAction === 1) {
      this.props.navigation.navigate('basic');
    } else {
      if (this.props.basic.products.length === 0) {
        this.props.navigation.navigate('basic');
      } else {
        this.props.navigation.navigate(this.props.basic.products[this.props.basic.products.length - 1]);
      }
    }
  };
  _onSave = () => {
    let saveTitle = this.props.basic.action === ACCOUNTACTION_ADD ? '新規作成' : '情報更新';
    let saveContent = this.props.basic.action === ACCOUNTACTION_ADD ? '新しいアカウントを新規作成します、よろしいですか？' : 'アカウント情報を更新します、よろしいですか？';
    Alert.alert(
      saveTitle,
      saveContent,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'OK', onPress: this._onForwards
        }
      ],
      { cancelable: false },
    )
  };
  _onForwards = async () => {

    //把所有的service整理成一个大集合，这个集合是目前这个Account契约的最新的所有service
    let services = [];
    if (!_.isNil(this.props.plus) && this.props.plus.length > 0) {
      services = _.concat(services, this.props.plus)
    };
    if (_.includes(this.props.basic.products, "kaikei") && !_.isNil(this.props.kaikei) && this.props.kaikei.length > 0) {
      services = _.concat(services, this.props.kaikei)
    };
    if (_.includes(this.props.basic.products, "shisan") && !_.isNil(this.props.shisan) && this.props.shisan.length > 0) {
      services = _.concat(services, this.props.shisan)
    };
    if (_.includes(this.props.basic.products, "kyuyo") && !_.isNil(this.props.kyuyo) && this.props.kyuyo.length > 0) {
      services = _.concat(services, this.props.kyuyo)
    };
    if (_.includes(this.props.basic.products, "jinji") && !_.isNil(this.props.jinji) && this.props.jinji.length > 0) {
      services = _.concat(services, this.props.jinji)
    };
    if (_.includes(this.props.basic.products, "gakuhi") && !_.isNil(this.props.gakuhi) && this.props.gakuhi.length > 0) {
      services = _.concat(services, this.props.gakuhi)
    };

    //提交服务端用的数据
    const detail = {
      basic: this.props.basic,
      service: services
    }

    if (this.props.basic.action === ACCOUNTACTION_ADD) {
      //新规时的业务包括：创建Account基础情报，创建数据库，添加service数据
      this.setState({ isLoading: true });
      let addDetail = {
        BasicInfo: {
          Code: detail.basic.code,
          Name: detail.basic.name,
          EndDate: detail.basic.date,
          Remark: detail.basic.remark
        },
        License: detail.basic.license,
        UseDemoData: detail.basic.demo,
        Services: detail.service
      }
      let start = new Date();
      let newid = await addItem(addDetail);
      if (!_.isNil(newid)) {
        const item = {
          id: newid,
          code: detail.basic.code,
          name: detail.basic.name,
          date: detail.basic.date
        }
        //把这次存储的时间记录下来，方便下次给默认值
        let end = new Date();
        let diff = end.getTime() - start.getTime();
        diff = Math.abs(Math.round(diff / 1000));
        if (diff > 0) {
          await AsyncStorage.setItem('APPAM_LastAddTime', String(diff + 1));
        }
        //通过Action更新State
        this.props.addAccountItemAction(item);
        this.props.clearAccountDetailAction();
        this.props.navigation.navigate('list')
      };
      this.setState({ isLoading: false });
    } else {
      //编辑时的业务包括：删除既有的service数据，然后添加新的service数据
      this.setState({ isLoading: true });
      let editDetail = {
        BasicInfo: {
          Code: detail.basic.code,
          Name: detail.basic.name,
          EndDate: detail.basic.date,
          Remark: detail.basic.remark
        },
        Services: detail.service
      }
      let start = new Date();
      let result = await updateItem(editDetail);
      if (!_.isNil(result)) {
        const item = {
          id: detail.basic.id,
          code: detail.basic.code,
          name: detail.basic.name,
          date: detail.basic.date
        }
        //把这次存储的时间记录下来，方便下次给默认值
        let end = new Date();
        let diff = end.getTime() - start.getTime();
        diff = Math.abs(Math.round(diff / 1000));
        if (diff > 0) {
          await AsyncStorage.setItem('APPAM_LastUpdateTime', String(diff + 1));
        }
        //通过Action更新State
        this.props.updateAccountItemAction(item);
        this.props.clearAccountDetailAction();
        this.props.navigation.navigate('list')
      };
      this.setState({ isLoading: false });
    };

  };
}
//---------------数据流相关---------------
const mapStateToProps = (state) => {
  //这个组件订阅哪些State??
  //订阅所有的明细数据，因为要保存了
  return {
    basic: state.basic,
    kaikei: state.kaikei,
    shisan: state.shisan,
    kyuyo: state.kyuyo,
    jinji: state.jinji,
    gakuhi: state.gakuhi,
    plus: state.plus
  };
}
const mapDispatchToProps = (dispatch) => {
  //这个组件对State有哪些CUID操作？？
  //添加新元素到list集合，更新list集合中的某一个元素，清空明细数据数据
  return bindActionCreators({ updateAccountItemAction, addAccountItemAction, clearAccountDetailAction }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailSummary);

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: '#f0f0f0',
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      paddingBottom: 10,
    },
  }
)