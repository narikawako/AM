import React from 'react';
import { ServiceList, WizardHeader } from './ComponentUtilities';
import { View, StatusBar } from 'react-native';
import _ from 'lodash';
import { defaultOffServices, nextPage } from '../assets/Consts';
import { getStatusBarHeight } from 'react-native-status-bar-height';
//这是5个产品页面处理业务的核心组件，是共通的，产品仅仅需要将数据流绑定到这个组件即可
export default class AccountDetailProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //当前画面的核心数据，哪些service被选中了
      services: this.props.services,
      //是否处于全选状态
      all: true
    };
  }
  static navigationOptions = () => {
    return {
      header: null,
    };
  };
  render() {
    return (
      <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
        <StatusBar
          barStyle="default"
        />
        <WizardHeader
          title={this.props.ProductName}
          onBack={this._onBack}
          onForwards={this._onForwards}
        />
        <ServiceList
          services={this.state.services}
          FixedServices={this.props.FixedServices}
          onChangeStatus={this._onChangeStatus}
          onChangeAllStatus={this._onChangeAllStatus}
          all={this.state.all}
          backgroundColor={this.props.ProductStyle}
        />
      </View>
    );
  }
  //单个radiobutton点击事件的响应
  _onChangeStatus = (id, value) => {
    if (value) {
      let newServices = _.concat(this.state.services, id);
      if (newServices.length === _.map(this.props.FixedServices, 'id').length) {
        this.setState({ services: newServices, all: true });
      } else {
        this.setState({ services: newServices });
      }
    } else {
      let newServices = _.pull(this.state.services, id);
      if (newServices.length === 0) {
        this.setState({ services: newServices, all: false });
      } else {
        this.setState({ services: newServices });
      }
    }
  }
  //全选择radiobutton点击事件的响应
  _onChangeAllStatus = (value) => {
    if (value) {
      this.setState({ services: _.map(this.props.FixedServices, 'id'), all: true });
    } else {
      this.setState({ services: [], all: false });
    }
  }
  //默认值是全选,然后除去那些强制要Off的(前提是用户没有选择过service数据，如果选择过了，那么就以用户选择的为准)
  //都已经进入这个画面了，但是Service又是空的，那就默认按照默认来设定吧
  componentDidMount() {
    if (_.isNil(this.state.services) || _.isEmpty(this.state.services)) {
      let allFixedServices = _.map(this.props.FixedServices, 'id');
      _.remove(allFixedServices, (id) => { return _.includes(defaultOffServices, id) })
      this.setState({ services: allFixedServices });
    }
  }

  _onBack = () => {
    this.props.navigation.navigate(nextPage(this.props.products, this.props.ProductKey, 0))
  };
  _onForwards = () => {
    //更新store的数据
    const productServices = {
      product: this.props.ProductKey,
      services: this.state.services
    }
    this.props.updateAccountDetailServiceAction(productServices);
    //页面跳转
    this.props.navigation.navigate(nextPage(this.props.products, this.props.ProductKey, 1))
  };
}