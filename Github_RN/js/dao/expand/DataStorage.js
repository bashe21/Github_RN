import {AsyncStorage} from 'react-native';

export default class DataStore {
    // 保存数据
    savaData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()};
    }

    // 获取本地数据
    fetchLoacalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            });
        })
    }

    /* 
    获取网络数据
    @params url
    @returns {Promise}
     */
    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then((responsData) => {
                    this.savaData(url, responsData, resolve(responsData));
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    /*
    获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
    @params url
    @returns {Promise} 
     */
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLoacalData(url).then((wrapData) => {
                if (wrapData && DataStore.checktimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                } else {
                    this.fetchNetData(url).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }
            }).catch((error) => {
                this.fetchNetData(url).then((data) => {
                    resolve(this._wrapData(data));
                }).catch((error) => {
                    reject(error);
                })
            })
        })
    }

    /* 
    检查timestamp 是否在有效期内
    @params timestamp 项目更新时间
    @return {boolean} true 不需要更新，false需要更新
    */
   static checktimestampValid(timestamp) {
       const currentDate = new Date();
       const targetDate = new Date();
       targetDate.setTime(timestamp);
       if (currentDate.getMonth() !== targetDate.getMonth()) return false;
       if (currentDate.getDate() !== targetDate.getDate()) return false;
       if (currentDate.getHours() - targetDate.getHours() > 4) return false;
       return true;
   }
}