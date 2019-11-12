import { connect } from 'react-redux';
import { updateAccountDetailServiceAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { gakuhiServices, ACCOUNTACTION_ADD } from '../assets/Consts';
import AccountDetailProduct from './AccountDetail_Product';
import { productStyles } from './CommonStyles';
import _ from 'lodash';
const mapStateToProps = (state) => {
  return {
    action: _.isNil(state.basic) ? ACCOUNTACTION_ADD : state.basic.action,
    products: _.isNil(state.basic) ? [] : state.basic.products,
    services: state.gakuhi || [],
    FixedServices: gakuhiServices,
    ProductName: '学費サービス',
    ProductKey: 'gakuhi',
    ProductStyle: productStyles.gakuhiColor
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateAccountDetailServiceAction }, dispatch);
};
const AccountDetailgakuhi = connect(mapStateToProps, mapDispatchToProps)(AccountDetailProduct);
export default AccountDetailgakuhi;