namespace AccommodationSearchSystem.Authentication.External
{
    public class ExternalAuthUserInfo
    {
        public string ProviderKey { get; set; }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        public string EmailAddress { get; set; }

        public string Surname { get; set; }

        public string Provider { get; set; }

        public string[] RoleNames { get; set; } // Thêm thuộc tính RoleNames để lưu trữ danh sách các vai trò được chọn

        public void Normalize()
        {
            if (RoleNames == null)
            {
                RoleNames = new string[0];
            }
        }
    }
}
