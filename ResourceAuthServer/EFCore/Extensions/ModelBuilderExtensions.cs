using Microsoft.EntityFrameworkCore;
using ResourceAuthServer.EFCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace ResourceAuthServer.EFCore.Extensions
{
    internal static class ModelBuilderExtensions
    {
        private static Dictionary<string, IEnumerable<string>> includeProps;
        public static ReadOnlyDictionary<string, IEnumerable<string>> IncludeProps;

        static ModelBuilderExtensions()
        {
            includeProps = new Dictionary<string, IEnumerable<string>>();
            IncludeProps = new ReadOnlyDictionary<string, IEnumerable<string>>(includeProps);
        }

        public static void AddIncludeProps<FromEntity, ToEntity, TJoinEntity>(
            this ModelBuilder builder,
            Expression<Func<FromEntity, ICollection<IUser>>> fromCollection,
            Expression<Func<ToEntity, ICollection<IUser>>> toCollection
        )
            where FromEntity : class
            where ToEntity : class
            where TJoinEntity : class, new()
        {
            setIncludeProps<FromEntity, TJoinEntity>(
                (fromCollection.Body as MemberExpression).Member.Name,
                getJoinProps<FromEntity, TJoinEntity>()
            );

            setIncludeProps<ToEntity, TJoinEntity>(
                (toCollection.Body as MemberExpression).Member.Name,
                getJoinProps<ToEntity, TJoinEntity>()
            );
        }

        private static void setIncludeProps<TEntity, TJoinEntity>(
            string navName,
            IEnumerable<PropertyInfo> joinProps
        )
        {
            if (!includeProps.ContainsKey(navName))
            {
                IEnumerable<string> joinNames = joinProps.Select(p => p.Name);
                IEnumerable<string> joinInnerProps = typeof(TJoinEntity)
                    .GetProperties().Where(p => !p.Name.Contains("Id")).Select(p => p.Name);

                IEnumerable<string> props = joinNames.SelectMany(
                    (n, i) => joinInnerProps.Select(jn => n + "." + jn)
                );

                includeProps[navName] = props;
            }
        }

        private static IEnumerable<PropertyInfo> getJoinProps<TEntity, TJoinEntity>()
        {
            return typeof(TEntity)
                   .GetProperties(BindingFlags.Instance | BindingFlags.NonPublic)
                   .Where(isTJoinEntity<TJoinEntity>);
        }

        private static bool isTJoinEntity<TJoinEntity>(PropertyInfo prop)
        {
            return typeof(TJoinEntity).Name ==
                prop.PropertyType.GetInterface("IEnumerable`1")?.GetGenericArguments()[0]?.Name;
        }
    }
}