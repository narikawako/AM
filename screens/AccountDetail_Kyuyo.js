import { connect } from 'react-redux';
import { updateAccountDetailServiceAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { kyuyoServices, ACCOUNTACTION_ADD } from '../assets/Consts';
import AccountDetailProduct from './AccountDetail_Product';
import productStyles from './CommonStyles';
import _ from 'lodash';
const mapStateToProps = (state) => {
  return {
    action: _.isNil(state.basic) ? ACCOUNTACTION_ADD : state.basic.action,
    products: _.isNil(state.basic) ? [] : state.basic.products,
    services: state.kyuyo || [],
    FixedServices: kyuyoServices,
    ProductName: '給与サービス',
    ProductKey: 'kyuyo',
    ProductStyle: productStyles.kyuyoColor
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateAccountDetailServiceAction }, dispatch);
};
const AccountDetailkyuyo = connect(mapStateToProps, mapDispatchToProps)(AccountDetailProduct);
export default AccountDetailkyuyo;