using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;
using ResourceAuthServer.Infrastructure.Enums;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Reflection;

namespace ResourceAuthServer.Infrastructure
{
    public class GenericControllerFeatureProvider : IApplicationFeatureProvider<ControllerFeature>
    {
        public void PopulateFeature(IEnumerable<ApplicationPart> parts, ControllerFeature feature)
        {
            var controllers = typeof(GenericControllers).GetEnumValues() as GenericControllers[];
            Type controllerType;
            ImmutableArray<TypeInfo> typeArguments;
            string ctrlName;

            foreach (var ctrl in controllers)
            {
                ctrlName = ctrl + "Controller";
                if (!feature.Controllers.Any(t => t.Name == ctrlName))
                {
                    EntityTypes.ControllerTypes.TryGetValue(ctrl, out controllerType);
                    EntityTypes.TypeArguments.TryGetValue(ctrl, out typeArguments);
                    feature.Controllers.Add(
                        controllerType
                        .MakeGenericType(typeArguments.Select(t => t.AsType()).ToArray())
                        .GetTypeInfo()
                    );
                }
            }
        }
    }
}
