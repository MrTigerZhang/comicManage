import CryptoJS from 'crypto-js'
import axios from 'axios'
import { UserModule } from '@/store/modules/user'

async function getImageDataAsBase64(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'text' })
    return response.data
}

// 对base64编码的图像数据进行加密
export function encryptImageData(data: string): string {
    const key = UserModule.systemConfig.imageEncryptionKey;
    const iv = UserModule.systemConfig.imageEncryptionIv;
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

// 对加密后的图像数据进行解密
export function decryptImageData(data: string): string {
    const key = UserModule.systemConfig.imageEncryptionKey;
    const iv = UserModule.systemConfig.imageEncryptionIv;

    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    const decrypted = CryptoJS.AES.decrypt(data, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

// 加载并解密图像
export async function decryptImage(imageUrl: string) {
    // 如果系统配置了加密，则对图像进行解密
    if (UserModule.systemConfig.imageEncryptionEnabled == 1) {



        const imageData = await getImageDataAsBase64(imageUrl)
        const decryptedImageData = decryptImageData(imageData)

        return decryptedImageData
    } else {
        return imageUrl;
    }
}
