using System;
using System.Collections.Generic;
using ResourceAuthServer.EFCore.Interfaces;

namespace ResourceAuthServer.EFCore
{
    public class PagedList<TEntity>: List<TEntity>
    {
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }
        public bool HasNext => CurrentPage < TotalPages;
        public bool HasPrevious => CurrentPage > 1;

        public PagedList(IPagingParams collectionParams, int count)
        {
            CurrentPage = collectionParams.PageNumber;
            PageSize = collectionParams.PageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)collectionParams.PageSize);
        }
    }
}