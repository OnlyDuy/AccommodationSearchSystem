export interface VNPayConfig {
    paymentGateway: string; // Thêm thuộc tính này nếu cần
    merchant: string; // Thêm thuộc tính này nếu cần
    secureSecret: string; // Thêm thuộc tính này nếu cần
    vnp_TmnCode: string;
    vnp_HashSecret: string;
    vnp_Url: string;
    returnUrl: string;
    lang: string;
    vnp_Version: string;
  }
