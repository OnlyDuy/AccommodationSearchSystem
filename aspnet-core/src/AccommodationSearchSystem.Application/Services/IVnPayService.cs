using AccommodationSearchSystem.VnPayment.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(HttpContext context, VnPaymentRequestDto model);
        VnPaymentResponseDto PaymentExcute(IQueryCollection collections);
    }
}
