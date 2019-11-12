import { connect } from 'react-redux';
import { updateAccountDetailServiceAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { kaikeiServices, ACCOUNTACTION_ADD } from '../assets/Consts';
import AccountDetailProduct from './AccountDetail_Product';
import { productStyles } from './CommonStyles';
import _ from 'lodash';
const mapStateToProps = (state) => {
  return {
    //这个参数决定当前页面是新规还是编辑
    action: _.isNil(state.basic) ? ACCOUNTACTION_ADD : state.basic.action,
    //这个参数确定跳转到哪里
    products: _.isNil(state.basic) ? [] : state.basic.products,
    //画面核心数据
    services: state.kaikei || [],
    FixedServices: kaikeiServices,
    //画面辅助数据
    ProductName: '会計サービス',
    ProductKey: 'kaikei',
    ProductStyle: productStyles.kaikeiColor
  };
};
const mapDispatchToProps = (dispatch) => {
  //仅仅更新store里面的detail数据，记录选择了哪些service
  return bindActionCreators({ updateAccountDetailServiceAction }, dispatch);
};
const AccountDetailKaikei = connect(mapStateToProps, mapDispatchToProps)(AccountDetailProduct);
export default AccountDetailKaikei;