/**
 * @description 蓝牙操作封装
 * @author Tim 
 * @since 2020/04/14
 */
import modal from './modal';

const TAG = 'Bluetooth.js';
export default class Bluetooth {
    constructor() {
        //蓝牙是否开启
        this.isOpenBle = false;

        //设备ID
        this.deviceId = "";

        //service ID
        this.serviceId = "";

        //写入ID
        this.writeId = "";

        //通知ID
        this.notifyId = "";

        this.init();
    }

    /**
     * 初始化Blutooth 对象
     */
    init() {
        return new Promise((resolve, reject) => {
            try {
                uni.openBluetoothAdapter({
                    success: res => {
                        this.isOpenBle = true;
                        modal.toast("初始化蓝牙模块成功");
                        console.logger(TAG, 'init()', res);
                        resolve(res)
                    },
                    fail: err => {
                        modal.toast(`初始化蓝牙模块失败` + JSON.stringify(err));
                        reject(err);
                    }
                });
            } catch (err) {
                console.errer(TAG, `uni.openBluetoothAdapter方法调用失败: ` + JSON.stringify(err));
                reject(err);
            }
        });
    }

    /**
     * 搜索蓝牙设备
     */
    startSearch() {
        uni.showLoading({
            title: '蓝牙搜索中'
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                uni.startBluetoothDevicesDiscovery({
                    success: res => {
                        resolve(res)
                    },
                    fail: res => {
                        modal.toast(`搜索设备失败` + JSON.stringify(err));
                        reject(err);
                    }
                })
            }, 100)
        });
    }

    /**
     * 停止蓝牙设备搜索
     */
    stopSearch() {
        return new Promise((resolve, reject) => {
            uni.stopBluetoothDevicesDiscovery({
                success: e => {
                    uni.hideLoading();
                },
                fail: e => {
                    uni.hideLoading();
                    modal.toast(`停止搜索蓝牙设备失败` + JSON.stringify(err));
                }
            })
        });
    }

    /**
     * 创建蓝牙连接
     */
    createBLEConnection() {
        //设备deviceId
        let deviceId = this.deviceId;
        let self = this;
        uni.showLoading({
            mask: true,
            title: '蓝牙连接中,请稍候...'
        });

        console.logger(TAG, 'createBlueConnection()', this.deviceId);
        return new Promise((resolve, reject) => {
            uni.createBLEConnection({
                deviceId,
                success: (res) => {
                    // setTimeout(() => {
                    //     self.getBLEDeviceServices();
                    // }, 500);
                    uni.hideLoading();
                    console.logger(TAG, "res:createBLEConnection " + JSON.stringify(res));
                    resolve(res)
                },
                fail: err => {
                    uni.hideLoading();
                    modal.toast(`停止搜索蓝牙设备失败` + JSON.stringify(err));
                    reject(err);
                }
            })
        });
    }

    /**
     * 获取蓝牙设备所有服务(service)
     */
    getBLEDeviceServices() {
        let _serviceList = [];
        let deviceId = this.deviceId;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                uni.getBLEDeviceServices({
                    deviceId,
                    success: res => {
                        for (let service of res.services) {
                            if (service.isPrimary) {
                                _serviceList.push(service);
                            }
                        }
                        uni.hideLoading();
                        console.logger(TAG, 'getBLEDeviceServices()', "_serviceList: " + JSON.stringify(_serviceList));
                        resolve(_serviceList)
                    },
                    fail: err => {
                        uni.hideLoading();
                        modal.toast(`获取设备Services` + JSON.stringify(err));
                        reject(err);
                    }
                })
            }, 200);
        });
    }

    /**
     * 获取蓝牙设备某个服务中所有特征值(characteristic)
     */
    getBLEDeviceCharacteristics() {
        let deviceId = this.deviceId;
        let serviceId = this.serviceId;

        return new Promise((resolve, reject) => {
            uni.getBLEDeviceCharacteristics({
                deviceId,
                serviceId,
                success: res => {
                    for (let _obj of res.characteristics) {
                        //获取notify
                        if (_obj.properties.notify) {
                            uni.setStorageSync('notifyId', _obj.uuid);
                        }
                        //获取writeId
                        if (_obj.properties.write) {
                            uni.setStorageSync('writeId', _obj.uuid);
                        }
                    }

                    console.log("res:getBLEDeviceCharacteristics " + JSON.stringify(res));

                    modal.toast("获取服务中所有特征值OK");
                    resolve(res)
                },
                fail: err => {
                    modal.toast(`getBLEDeviceCharacteristics` + JSON.stringify(err));
                    reject(err);
                }
            })
        });
    }

    /**
     * 断开联链接
     */
    closeBLEConnection() {
        let deviceId = this.deviceId;
        uni.closeBLEConnection({
            deviceId,
            success(res) {
                console.logger(TAG, 'closeBLEConnection()', res)
            }
        })
    }

    /**
     * 
     */
    notifyBLECharacteristicValue() {
        let deviceId = this.deviceId;
        let serviceId = this.serviceId;
        let characteristicId = this.notifyId;

        uni.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能
            deviceId,
            serviceId,
            characteristicId,
            success(res) {
                uni.onBLECharacteristicValueChange(function (res) {

                });
            },
            fail(res) {
                console.logger(TAG, 'notifyBLECharacteristicValueChange failed:' + res.errMsg);

            }
        });
    }

    /**
     * 写入蓝牙特征值
     * @param {*} buffer 
     */
    writeBLECharacteristicValue(buffer) {
        let deviceId = this.deviceId;
        let serviceId = this.serviceId;
        let characteristicId = this.writeId;

        console.logger(TAG, "this: " + JSON.stringify(this));

        uni.writeBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId,
            value: buffer,
            success(res) {
                console.logger(TAG, 'message发送成功', JSON.stringify(res));
            },
            fail(err) {
                console.logger(TAG, 'message发送失败', JSON.stringify(err));
            }
        });
    }

    /**
     * 打开蓝牙适配器
     */
    openBluetoothAdapter() {
        uni.openBluetoothAdapter({
            success(res) {
                console.logger(TAG, res)
            }
        });
    }

    /**
     * 关闭蓝牙适配器
     */
    closeBluetoothAdapter() {
        uni.closeBluetoothAdapter({
            success: res => {
                console.logger(TAG, res)
            }
        });
    }

    //若APP在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。
    async reconnect() {
        this.deviceId = uni.getStorageSync("deviceId");
        this.serviceId = uni.getStorageSync("serviceId");

        let result1 = await this.createBLEConnection();
        console.logger(TAG, "result1: " + JSON.stringify(result1));

        let result2 = await this.getBLEDeviceServices();
        console.logger(TAG, "result2: " + JSON.stringify(result2));

        let result3 = await this.getBLEDeviceCharacteristics();
        console.logger(TAG, "result3: " + JSON.stringify(result3));

        this.writeId = uni.getStorageSync("writeId");
        this.notifyId = uni.getStorageSync("notifyId");
    }
}