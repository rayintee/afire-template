/**
 * @description 格式化日期字符串，按照需要格式格式化
 * @author Tim
 * @since 2020/04/01
 */

import ptype from "./ptype";

/**
 * @description 核心的日期处理函数：获取各部分参数值
 * @param {*} date
 */
const format = date => {
  let year, month, day, hour, minute, second;
  try {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
  } catch (error) {
    console.error(error);
    return null;
  }

  return {
    year,
    month,
    day,
    hour,
    minute,
    second
  };
};

/**
 * @description 补全2位，高位补0字符串
 * @param {*} n
 */
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/**
 * @description 格式化日期，默认日期 用{-}链接 & 时间
 * @param {*} date
 * @param {*} type
 */
const formatDate = (date, type = "-") => {
  if (!ptype.isDate(date)) return null;
  const {
    year,
    month,
    day,
    hour,
    minute,
    second
  } = format(date);
  let d = [year, month, day].map(formatNumber).join(type);
  let h = [hour, minute, second].map(formatNumber).join(":");
  return `${d} ${h}`;
};

/**
 * @description 格式化日期，默认日期 用{-}链接 & 时间
 * @param {*} date
 * @param {*} type
 */
const formatM = (date, type = "-") => {
  if (!ptype.isDate(date)) return null;
  const {
    year,
    month
  } = format(date);
  return [year, month].map(formatNumber).join(type);
};

/**
 * @description 只格式化日期，默认用{-}链接
 * @param {*} date
 * @param {*} type
 */
const formatD = (date, type = "-") => {
  if (!ptype.isDate(date)) return null;
  const {
    year,
    month,
    day
  } = format(date);
  return [year, month, day].map(formatNumber).join(type);
};

/**
 * @description 获取时分秒字符串
 * @param {*} date
 */
const formatH = date => {
  if (!ptype.isDate(date)) return null;
  const {
    hour,
    minute,
    second
  } = format(date);
  return [hour, minute, second].map(formatNumber).join(":");
};

/**
 * 增加/减去 x天返回的日期字符串
 * @param {*} days 
 * @param {*} type 
 */
const getXDate = (days, type = "-") => {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return formatD(d, type)
}

/**
 * 获取今天日期
 * @param {*} type 
 */
const getToday = (type = "-") => {
  let currentTime = new Date();
  return formatD(currentTime, type);
}

/**
 * 获取明天日期
 * @param {*} type 
 */
const getTomorrow = (type = "-") => {
  let currentTime = new Date();
  return getXDate(currentTime, 1, type);
}

/**
 * 获取昨天日期
 * @param {*} type 
 */
const getYesterday = (type = "-") => {
  let currentTime = new Date();
  return getXDate(currentTime, -1, type);
}

export default {
  getXDate,
  getToday,
  getTomorrow,
  getYesterday,
  formatD,
  formatM,
  formatH,
  formatDate
};