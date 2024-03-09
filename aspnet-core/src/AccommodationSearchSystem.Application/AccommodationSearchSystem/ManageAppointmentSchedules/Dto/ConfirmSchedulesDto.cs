using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class ConfirmSchedulesDto
    {
        public int HostId { get; set; }
        public BigInteger CreatorUserId { get; set; }
        public bool Confirm { get; set; }
    }
}
