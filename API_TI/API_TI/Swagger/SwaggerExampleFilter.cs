
using API_TI.Models.DTOs.CarritoDTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API_TI.Swagger
{
    public class SwaggerExampleFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type == typeof(LoginRequest))
            {
                schema.Example = new OpenApiObject
                {
                    ["correo"] = new OpenApiString("admin@example.com"),
                    ["contrasena"] = new OpenApiString("Admin123!")
                };
            }
            else if (context.Type == typeof(AddToCartRequest))
            {
                schema.Example = new OpenApiObject
                {
                    ["productoId"] = new OpenApiInteger(1),
                    ["cantidad"] = new OpenApiInteger(2)
                };
            }
            else if (context.Type == typeof(ApplyCouponDto))
            {
                schema.Example = new OpenApiObject
                {
                    ["codigoCupon"] = new OpenApiString("SUMMER2024")
                };
            }
        }
    }
}