import QRCode from "qrcode";

export async function generateQrCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error: any) {
    throw new Error(`Error generating QR code: ${error.message}`);
  }
}
