import qrCode from 'qrcode'

export const qrCodeFunction = async({data = ''} = {})=>{
    const qrCodeResult = qrCode.toDataURL(JSON.stringify(data),{errorCorrectionLevel:'H'})
    return qrCodeResult
}
