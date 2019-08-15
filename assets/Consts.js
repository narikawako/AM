import _ from "lodash";

export const kaikeiServices = [
    { id: 1, name: '	学校会計	' },
    { id: 2, name: '	幼稚園会計	' },
    { id: 3, name: '	出納帳	' },
    { id: 5, name: '	部所管理	' },
    { id: 6, name: '	目的管理	' },
    { id: 7, name: '	配分管理	' },
    { id: 12, name: '	支払管理	' },
    // { id: 13, name: '	税別経理	' },
    { id: 16, name: '	電子預金	' },
    { id: 17, name: '	財務分析	' },
    { id: 504000, name: '	（OP）他校データ送付	' },
    { id: 504010, name: '	（OP）内部予算執行管理	' }
]

export const shisanServices = [
    { id: 1001, name: '	資産管理	' },
    // { id: 1002, name: '	資産管理ライト	' }
]

export const kyuyoServices = [
    { id: 120, name: '	学校給与	' },
    { id: 121, name: '	等級号俸	' },
    { id: 122, name: '	ベースアップ	' },
    { id: 123, name: '	人件費シミュレーション	' },
    { id: 124, name: '	退職金管理	' },
    { id: 125, name: '	人事情報	' },
    { id: 126, name: '	電子明細	' },
    { id: 509004, name: '	（OP）電子明細	' }
]

export const jinjiServices = [
    { id: 3001, name: '	人事管理	' }
]

export const gakuhiServices = [
    { id: 2001, name: '	学費管理	' },
    { id: 2002, name: '	預り金管理	' }
]

export const plusCommonServices = [
    { id: 610000, name: '	LS+共通（Web）	' },
    { id: 610001, name: '	LS+キャビNet	' }
]
export const plusKaikeiServices = [
    { id: 504020, name: '	LS+会計	' },
    { id: 620000, name: '	LS+会計（Web）	' },
    { id: 670000, name: '	LS+周辺会計（Web）	' }
]
export const plusShisanServices = [
    { id: 511003, name: '	LS+資産	' },
    { id: 630000, name: '	LS+資産（Web）	' }
]
export const plusKyuyoServices = [
    { id: 509005, name: '	LS+給与	' },
    { id: 509006, name: '	LS+給与明細	' },
    { id: 640000, name: '	LS+給与（Web）	' },
    { id: 641000, name: '	教職員サイト	' },
    { id: 641001, name: '	教職員サイト（給与明細閲覧）	' }
]
export const plusJinjiServices = [
    { id: 513001, name: '	LS+人事	' },
    { id: 650000, name: '	LS+人事（Web）	' }
]
export const plusGakuhiServices = [
    { id: 505001, name: '	LS+学費	' },
    { id: 660000, name: '	LS+学費（Web）	' },
    { id: 661000, name: '	学費サイト	' }
]

export const fixServices = [
    { product: "kaikei", services: kaikeiServices },
    { product: "shisan", services: shisanServices },
    { product: "kyuyo", services: kyuyoServices },
    { product: "jinji", services: jinjiServices },
    { product: "gakuhi", services: gakuhiServices }
]

export const ACCOUNTACTION_ADD = 'ACCOUNTACTION_ADD'
export const ACCOUNTACTION_EDIT = 'ACCOUNTACTION_EDIT'

export const nextPage = (products, current, forwards) => {
    let currentIndex = _.indexOf(products, current)
    if (forwards === 0) {
        if (currentIndex === 0) {
            return "basic";
        }
        return products[currentIndex - 1];
    } else {
        if (currentIndex === products.length - 1) {
            return "summary";
        }
        return products[currentIndex + 1];
    }
}

export const hasService = (servicesids, keyservices) => {
    let hasData = false;
    _.forEach(_.map(keyservices, "id"), (id) => {
        if (_.includes(servicesids, id)) {
            hasData = true;
        }
    });
    return hasData;
}

export const formatDate = (date) => {
    let format = 'YYYY/MM/DD';
    format = format.replace('YYYY', date.getFullYear());
    format = format.replace('MM', date.getMonth() + 1);
    format = format.replace('DD', date.getDate());
    return format;
}
