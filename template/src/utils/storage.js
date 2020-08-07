/*
 * @Author: Tim
 * @Date: 2020-07-16 15:30:40
 * @LastEditTime: 2020-08-07 18:03:13
 * @LastEditors: Please set LastEditors
 * @Description: storage存储操作集合
 * @FilePath: /afire-template/template/src/utils/storage.js
 */
import {
  SKEY,
  UPHONE
} from "@/config/var.conf";

const TAG = 'storage.js';

/**
 * @description 设置本地skey
 * @return {*} bool
 */

const setSkey = function (val) {
  if (!val) {
    console.logger(TAG, 'skey不能为空～');
    return;
  }

  uni.setStorageSync(SKEY, val);
}

/**
 * 获取本地skey
 */
const getSkey = function () {
  return uni.getStorageSync(SKEY);
}

/**
 * 获取本地数据中心的用户phone
 */
const getUPhone = function () {
  return uni.getStorageSync(UPHONE);
}

/**
 * 设置用户phone等关键信息
 * @param {*} phone 
 */
const setUPhone = function (phone) {
  return uni.setStorageSync(UPHONE, phone);
}

export default {
  setSkey,
  getSkey,
  getUPhone,
  setUPhone,

  /**
   * @description 获取本地storage
   * @param {*} key
   */
  get(key) {
    if (!key) return null;
    return uni.getStorageSync(key);
  },

  /**
   * @description 设置本地的storage
   * @param {*} key
   * @param {*} data : {string/object}
   */
  set(key, data) {
    if (!key || !data) return;

    uni.setStorageSync(key, data);
  },

  /**
   * @description 清除本地的storage
   * @param {*} key
   */
  clear(key) {
    if (!key) {
      return;
    }
    uni.removeStorageSync(key);
  },

  /**
   * @description 清除本地所有storage
   */
  clearAll() {
    uni.clearStorageSync();
  }
};