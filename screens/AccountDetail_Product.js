import React from 'react';
import { ServiceList, WizardHeader } from './ComponentUtilities';
import { View, StatusBar } from 'react-native';
import _ from 'lodash';
import { defaultOffServices, nextPage, defaultofflicenses } from '../assets/Consts';
import { getStatusBarHeight } from 'react-native-status-bar-height';
//这是5个产品页面处理业务的核心组件，是共通的，产品仅仅需要将数据流绑定到这个组件即可
export default class AccountDetailProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //当前画面的核心数据，哪些service被选中了。例如 [1001,1002]
      services: this.props.services,
      //是否处于全选状态
      all: true,
      //License详情。。例如 [{id:1001,license:3},{id:1002,license:5}]
      licenses: this.props.licenses,
    };
  }
  static navigationOptions = () => {
    return {
      header: null,
    };
  };
  render() {
    return (
      <View style={{ flex: 1, paddingTop: getStatusBarHeight(true) }}>
        <StatusBar
          barStyle="default"
        />
        <WizardHeader
          title={this.props.ProductName}
          onBack={this._onBack}
          onForwards={this._onForwards}
        />
        <ServiceList
          services={this.state.services}   //哪些服务是Checkon的？
          licenses={this.state.licenses}   //Checkon的服务的license都各有多少？
          FixedServices={this.props.FixedServices} //当前产品共有多少个标准服务？（全集）
          offlicenses ={defaultofflicenses} //哪些service是OP？（OP不允许设置license）
          onChangeStatus={this._onChangeStatus}
          onChangeAllStatus={this._onChangeAllStatus}
          onChangeLicense={this._onChangeLicense}
          onChangeLicenseQuick={this._onChangeLicenseQuick}
          onBlurLicense={this._onBlurLicense}
          all={this.state.all}
          backgroundColor={this.props.ProductStyle}
        />
      </View>
    );
  }
  _onBlurLicense = (id) => {
    let licenselist = this.state.licenses;
    let index = _.findIndex(licenselist, (item) => item.id === id);
    let olditem = licenselist[index];
    if (_.isEmpty(olditem.license)) {
      let newitem = { ...olditem, license: 3 } //焦点离开时，如果没有输入任何数据，那么填充默认值3
      this.setState({ licenses: [...licenselist.slice(0, index), newitem, ...licenselist.slice(index + 1)] });
    }
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
  _onChangeLicense = (id, value) => {
    let licenselist = this.state.licenses;
    let index = _.findIndex(licenselist, (item) => item.id === id);
    let olditem = licenselist[index];
    let newitem = { ...olditem, license: _.isEmpty(value) ? value : value < 1 ? 1 : value } //直接更新license数据
    this.setState({ licenses: [...licenselist.slice(0, index), newitem, ...licenselist.slice(index + 1)] });
  }
  _onChangeLicenseQuick = (id, value) => {
    let licenselist = this.state.licenses;
    let index = _.findIndex(licenselist, (item) => item.id === id);
    let olditem = licenselist[index];
    let newitem
    if (value) {
      newitem = { ...olditem, license: Number(olditem.license) + 1 } //直接更新license数据，快速加一
    } else {
      newitem = { ...olditem, license: Number(olditem.license) === 1 ? Number(olditem.license) : Number(olditem.license) - 1 } //直接更新license数据，快速减一
    }
    this.setState({ licenses: [...licenselist.slice(0, index), newitem, ...licenselist.slice(index + 1)] });
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
    if (_.isNil(this.state.services)) {
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
      services: this.state.services,
      licenses: this.state.licenses //未选择的service的license信息就算更新到全局state也没关系，因为最后在入库的时候会过滤，仅仅传输签约的service的license数据
    }
    this.props.updateAccountDetailServiceAction(productServices);
    //页面跳转
    this.props.navigation.navigate(nextPage(this.props.products, this.props.ProductKey, 1))
  };
}