using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Immutable;
using System.Linq;
using System.Reflection;

namespace ResourceAuthServer.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class GenericControllerNameConvention : Attribute, IControllerModelConvention
    {
        private static readonly ImmutableArray<Type> controllerTypes;
        private static readonly ImmutableArray<TypeInfo>[] typeArguments;

        static GenericControllerNameConvention()
        {
            controllerTypes = EntityTypes.ControllerTypes.Values.ToImmutableArray();
            typeArguments = EntityTypes.TypeArguments.Values.ToArray();
        }

        public void Apply(ControllerModel controller)
        {
            if (controller.ControllerType.IsGenericType)
            {
                string name = "";

                for (int i = 0; i < controllerTypes.Length; i++)
                {
                    if (controllerTypes[i].Name == controller.ControllerName &&
                        typeArguments[i].SequenceEqual(controller.ControllerType.GenericTypeArguments))
                    {
                        name = EntityTypes.ControllerTypes.ElementAt(i).Key.ToString();
                        break;
                    }
                }
                controller.ControllerName = name;
            }
        }
    }
}
