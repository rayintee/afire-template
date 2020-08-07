/**
 * @description 数据类型判断工具类: object、string、function、number、date等等
 * @author Tim
 */

// 定义基础的类型字段
const STRING_PROTOTYPE = "[object String]";
const NUMBER_PROTOTYPE = "[object Number]";
const REGEXP_PROTOTYPE = "[object RegExp]";
const DATE_PROTOTYPE = "[object Date]";
const BOOL_PROTOTYPE = "[object Boolean]";
const ARRAY_PROTOTYPE = "[object Array]";
const OBJECT_PROTOTYPE = "[object Object]";
const FUNCTION_PROTOTYPE = "[object Function]";

/**
 * @description 获取对象prototype
 * @param {object} 参数对象
 * @return {string} prototype
 */
const protoString = obj => {
  return Object.prototype.toString.call(obj);
};

export default {
  /**
   * @description 判断是否是字符串
   */
  isString(str) {
    return protoString(str) === STRING_PROTOTYPE;
  },

  /**
   * @description 判断是否为数字
   */
  isNumber(num) {
    return protoString(num) === NUMBER_PROTOTYPE;
  },

  /**
   * @description 判断是否是正则表达式
   */
  isRegExp(reg) {
    return protoString(reg) === REGEXP_PROTOTYPE;
  },

  /**
   * @description 判断是否是布尔类型
   */
  isBool(bool) {
    return protoString(bool) === BOOL_PROTOTYPE;
  },

  /**
   * @description 判断是否为日期类型
   */
  isDate(date) {
    return protoString(date) === DATE_PROTOTYPE;
  },

  /**
   * @description 判断是否为数组类型
   */
  isArray(arr) {
    return protoString(arr) === ARRAY_PROTOTYPE;
  },

  /**
   * @description 判断是否为对象类型
   */
  isObject(obj) {
    return protoString(obj) === OBJECT_PROTOTYPE;
  },

  /**
   * @description 判断是否为函数类型
   */
  isFunction(fn) {
    return protoString(fn) === FUNCTION_PROTOTYPE;
  }
};
