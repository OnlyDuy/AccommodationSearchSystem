using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class GetAllSchedulesDto : Entity<long?>
    {
        public string HostName { get; set; }
        public string HostPhoneNumber { get; set; }
        public string RenterHostName { get; set; }
        public string RenterHostPhoneNumber { get; set; }
        public DateTime Day { get; set; }
        public DateTime Hour { get; set; }
        public bool Confirm { get; set; }
        public bool Cancel { get; set; }
    }
}
