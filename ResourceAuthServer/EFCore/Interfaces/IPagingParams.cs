namespace ResourceAuthServer.EFCore.Interfaces
{
    public interface IPagingParams
    {
        int PageNumber { get; set; }
        int PageSize { get; set; }
    }
}