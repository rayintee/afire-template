/**
 * @description 文件上传的service封装
 * @author Tim 
 * @since 2020/04/13
 */
import Services from './service';
import modal from "@/utils/modal";
// import ptype from "@/utils/ptype";

const TAG = "upload_service.js";

/**
 * 上传核心函数
 * @param {*} opt 
 */
function upload(opt = {}) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: opt.url,
            filePath: opt.filePath,
            name: opt.name,
            header: opt.header,
            formData: {
                param: JSON.stringify(opt.formData)
            },
            success: (uploadFileRes) => {
                const {
                    statusCode,
                    errMsg,
                    data = {}
                } = uploadFileRes;

                console.logger(TAG, 'req()', uploadFileRes);
                let retData;

                try {
                    if (typeof data === 'string') {
                        retData = JSON.parse(data.substr(data.indexOf("{")));
                    }

                    console.logger(TAG, 'req()', retData);
                    if (statusCode == 200) {
                        resolve({
                            errMsg: 'BUSI_SUCCESS',
                            retData
                        });
                    } else reject({
                        errMsg,
                        retData
                    });
                } catch (err) {
                    modal.toast('返回数据JSON格式问题');
                    reject({
                        errMsg: '返回数据JSON格式问题',
                        retData: ''
                    });
                }
            },
            fail: (errData) => {
                reject(errData);
            }
        });
    });
}

/**
 * 上传service类
 */
export default class UploadService extends Services {
    constructor() {
        super();

        //上传文件名key，默认的
        this.name = "file";

        //image/video/audio,默认的是image图片
        this.fileType = "image";

        //上传文件携带表单参数
        this.formData = {};

        //文件上传的资源
        this.filePath = "";

        this.header = {
            'content-type': 'multipart/form-data'
        };

        // body参数
        this.body = {};
    }

    async req() {
        try {
            let flag = this.beforeReq();

            if (!flag) {
                throw "权限拦截异常~";
            }

            let res = await upload({
                url: this.domain + this.url,
                filePath: this.filePath,
                name: this.name,
                header: this.header,
                formData: this.formData
            });

            let {
                retData,
                errMsg
            } = res;

            ///成功的业务标志
            if (errMsg != "BUSI_SUCCESS") {
                let err_msg = errMsg || '上传失败';
                throw err_msg;
            }

            let is_success = this.afterReq(retData);

            ///成功的业务
            if (!is_success) {
                if (this.showToast) modal.toast(res.msg || "");
            } else {
                if (this.successToast) modal.toast(retData.msg || '上传成功~');
            }

            return retData;
        } catch (err) {
            modal.toast(err || '上传失败~');
            console.errer(TAG, err || '上传失败~');

            return null;
        }
    }

}