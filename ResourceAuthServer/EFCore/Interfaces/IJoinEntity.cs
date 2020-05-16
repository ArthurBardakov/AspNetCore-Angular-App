namespace ResourceAuthServer.EFCore.Interfaces
{
    public interface IJoinEntity<TEntity>
    {
        TEntity Navigation { get; set; }
    }
}