using ResourceAuthServer.EFCore.Interfaces;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace ResourceAuthServer.EFCore.Entities
{
    internal class JoinCollection<TOwnerEntity, TRelatedEntity, TJoinEntity> : ICollection<IUser>
        where TOwnerEntity : class, IUser
        where TRelatedEntity : class, IUser
        where TJoinEntity : IJoinEntity<TOwnerEntity>, IJoinEntity<TRelatedEntity>, new()
    {
        private readonly TOwnerEntity ownerEntity;
        private readonly ICollection<TJoinEntity> collection;

        public JoinCollection(
            TOwnerEntity ownerEntity,
            ICollection<TJoinEntity> collection)
        {
            this.ownerEntity = ownerEntity;
            this.collection = collection;
        }

        public IEnumerator<IUser> GetEnumerator()
            => collection.Select(e => ((IJoinEntity<TRelatedEntity>)e).Navigation).GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator()
            => GetEnumerator();

        public void Add(IUser item)
        {
            var entity = new TJoinEntity();
            ((IJoinEntity<TOwnerEntity>)entity).Navigation = ownerEntity;
            ((IJoinEntity<TRelatedEntity>)entity).Navigation = (TRelatedEntity)item;
            collection.Add(entity);
        }

        public void Clear()
            => collection.Clear();

        public bool Contains(IUser item)
            => collection.Any(e => Equals(item, e));

        public void CopyTo(IUser[] array, int arrayIndex)
            => this.ToList().CopyTo(array, arrayIndex);

        public bool Remove(IUser item)
            => collection.Remove(
                collection.FirstOrDefault(e => Equals(item, e)));

        public int Count
            => collection.Count;

        public bool IsReadOnly
            => collection.IsReadOnly;

        private static bool Equals(IUser item, TJoinEntity e)
            => Equals(((IJoinEntity<TRelatedEntity>)e).Navigation, item);
    }
}