using ResourceAuthServer.EFCore.Interfaces;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class UsersPagingParamsVM: IPagingParams
    {
        public int PageNumber { get; set; } = 1;
        private const int maxPageSize = 50;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > maxPageSize ? maxPageSize : value); }
        }
    }
}