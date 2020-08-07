/**
 * @description 打电话操作封装
 * @author Tim 
 * @since 2020/04/15
 */
import modal from '@/utils/modal';

const TAG = 'makePhone.js';
export default {
    data() {
        return {}
    },

    methods: {
        makePhone(e) {
            if (!e) {
                modal.toast('phone字段不能为空');
                return;
            }

            //预定义字段
            let tel = "";
            if (typeof e === 'string') {
                tel = e;
            } else {
                let {
                    phone
                } = e.currentTarget.dataset || {};

                if (typeof phone === 'undefined' || !phone) {
                    modal.toast('phone字段不能为空');
                    return;
                }
                tel = phone;
            }

            console.logger(TAG, 'makePhone()', tel);

            //拨打电话api
            uni.makePhoneCall({
                phoneNumber: tel
            });
        }
    }
}