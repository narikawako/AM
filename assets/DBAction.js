import { Alert,AsyncStorage } from 'react-native';
import _ from 'lodash';

const CloudServerAddress = 'https://leyser9webam.grapecity.com';
const CloudServerPath = '/WebAMAPI/MobileService/';

const StageServerAddress = 'https://stage-leyser9.leyserplus.jp';
const StageServerPath = '/WebAMAPI/MobileService/';

const DevServerAddress ='http://xa-lsr-xfdev';
const DevServerPath = '/AMAPI/MobileService/';

const serverPath = async () => {
    const serverType = await AsyncStorage.getItem('APPAM_ServerType');
    switch (serverType) {
        case 'stage':
            return StageServerAddress + StageServerPath;
        case 'cloud':
            return CloudServerAddress + CloudServerPath;
        default:
            return DevServerAddress + DevServerPath;;
    }
}

const LoginAPI = async () => { return await serverPath() + 'Login'; }
const GetUserAPI = async () => { return await serverPath() + 'GetUser'; }
const LogoutAPI = async () => { return await serverPath() + 'Logout'; }

const GetListAPI = async () => { return await serverPath() + 'GetAccountList'; }
const GetDetailAPI = async () => { return await serverPath() + 'GetAccountDetail'; }

const DeleteItemAPI = async () => { return await serverPath() + 'DeleteAccount'; }
const AddItemAPI = async () => { return await serverPath() + 'CreateAccount'; }
const UpdateItemAPI = async () => { return await serverPath() + 'UpdateAccount'; }

const ValidateCode = async () => { return await serverPath() + 'ValidateAccountCode'; }
const ValidateName = async () => { return await serverPath() + 'ValidateAccountName'; }

const Error_Title_Network = 'ネットワークエラー';
const Error_Title_Server = 'サーバーエラー';

export const login = async (data) => {
    return fetch(await LoginAPI(), {
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
export const getUser = async (userId) => {
    return fetch(await GetUserAPI(), {
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
                //无法获取身份后会尝试静默登录，所以这里不再提示错误。
                //Alert.alert(Error_Title_Server, json.Error, [{ text: 'OK' }], { cancelable: false });
                return null;
            };
        })
        .catch((error) => {
            Alert.alert(Error_Title_Network, JSON.stringify(error), [{ text: 'OK' }], { cancelable: false });
            return null;
        });
}

export const logout = async () => {
    return fetch(await LogoutAPI(), {
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
export const getList = async (userId) => {
    return fetch(await GetListAPI(), {
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

export const getDetail = async (id) => {
    return fetch(await GetDetailAPI() + '?accountid=' + id, {
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


export const deleteItem = async (id) => {
    return fetch(await DeleteItemAPI() + '?accountid=' + id, {
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
export const addItem = async (data) => {
    return fetch(await AddItemAPI(), {
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
export const updateItem = async (data) => {
    return fetch(await UpdateItemAPI(), {
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

export const validateCode = async (code) => {
    return fetch(await ValidateCode() + '?code=' + code, {
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

export const validateName = async (name) => {
    return fetch(await ValidateName() + '?name=' + name, {
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