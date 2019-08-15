import { Alert } from 'react-native';
import _ from 'lodash';

const ServerName = 'https://stage-leyser9.leyserplus.jp';
const Path = '/WebAMAPI/MobileService/';

const LoginAPI = ServerName + Path + 'Login';
const GetUserAPI = ServerName + Path + 'GetUser';
const LogoutAPI = ServerName + Path + 'Logout';

const GetListAPI = ServerName + Path + 'GetAccountList';
const GetDetailAPI = ServerName + Path + 'GetAccountDetail';

const DeleteItemAPI = ServerName + Path + 'DeleteAccount';
const AddItemAPI = ServerName + Path + 'CreateAccount';
const UpdateItemAPI = ServerName + Path + 'UpdateAccount';

const ValidateCode = ServerName + Path + 'ValidateAccountCode';
const ValidateName = ServerName + Path + 'ValidateAccountName';

const Error_Title_Network = 'ネットワークエラー';
const Error_Title_Server = 'サーバーエラー';

export const login = (data) => {
    return fetch(LoginAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        body: JSON.stringify(data),
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return {
                    id: json.Data.USID,
                    name: json.Data.Name,
                    minid: json.Data.MinAvailableAccountCode,
                    maxid: json.Data.MaxAvailableAccountCode
                };
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

//服务端暂不需要userId这个参数来获取当前用户，因为会通过cookies中记录的信息来获取当前用户
export const getUser = (userId) => {
    return fetch(GetUserAPI, {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return {
                    id: json.Data.USID,
                    name: json.Data.Name,
                    minid: json.Data.MinAvailableAccountCode,
                    maxid: json.Data.MaxAvailableAccountCode
                };
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

export const logout = () => {
    return fetch(LogoutAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return true;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

//服务端暂不需要userId这个参数来获取当前用户的Account数据，因为会通过cookies中记录的信息来获取当前用户
export const getList = (userId) => {
    return fetch(GetListAPI, {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                let list = [];
                _.forEach(json.Data, (item) => {
                    list.push({
                        id: item.Id,
                        code: item.Code,
                        name: item.Name,
                        date: item.EndDate
                    })
                });
                return list;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

export const getDetail = (id) => {
    return fetch(GetDetailAPI + '?accountid=' + id, {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return {
                    basic: {
                        code: json.Data.BasicInfo.Code + '',
                        name: json.Data.BasicInfo.Name,
                        date: json.Data.BasicInfo.EndDate,
                        remark: json.Data.BasicInfo.Remark
                    },
                    kaikei: json.Data.KaikeiServices,
                    shisan: json.Data.ShisanServices,
                    kyuyo: json.Data.PayrollServices,
                    jinji: json.Data.JinjiServices,
                    gakuhi: json.Data.GakuhiServices,
                    plus: json.Data.PlusServices,
                };
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}


export const deleteItem = (id) => {
    return fetch(DeleteItemAPI + '?accountid=' + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return true;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}
export const addItem = (data) => {
    return fetch(AddItemAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        body: JSON.stringify(data),
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return json.Data.accountId;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}
export const updateItem = (data) => {
    return fetch(UpdateItemAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        body: JSON.stringify(data),
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return true;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

export const validateCode = (code) => {
    return fetch(ValidateCode + '?code=' + code, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return json.Data.enable;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

export const validateName = (name) => {
    return fetch(ValidateName + '?name=' + name, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", },
        credentials: "include"
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.Success === true) {
                return json.Data.enable;
            } else {
                Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}