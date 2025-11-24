using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API_TI.Swagger
{
    public class ErrorResponsesOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            operation.Responses ??= new OpenApiResponses();

            // Success responses
            if (!operation.Responses.ContainsKey("200"))
            {
                operation.Responses["200"] = new OpenApiResponse
                {
                    Description = "Operación exitosa",
                    Content = new Dictionary<string, OpenApiMediaType>
                    {
                        ["application/json"] = new OpenApiMediaType
                        {
                            Example = new OpenApiObject
                            {
                                ["success"] = new OpenApiBoolean(true),
                                ["data"] = new OpenApiObject(),
                                ["message"] = new OpenApiString("Operación exitosa"),
                                ["error"] = new OpenApiNull()
                            }
                        }
                    }
                };
            }

            // Authentication required
            var hasAuthorize = context.MethodInfo.DeclaringType?.GetCustomAttributes(true)
                .Union(context.MethodInfo.GetCustomAttributes(true))
                .Any(attr => attr.GetType().Name == "AuthorizeAttribute") ?? false;

            if (hasAuthorize)
            {
                operation.Responses["401"] = new OpenApiResponse
                {
                    Description = "No autenticado",
                    Content = BuildErrorResponse(100, "Autenticación requerida", 3)
                };

                operation.Responses["403"] = new OpenApiResponse
                {
                    Description = "No autorizado",
                    Content = BuildErrorResponse(101, "Acceso no autorizado", 3)
                };
            }

            // Common error responses
            operation.Responses["400"] = new OpenApiResponse
            {
                Description = "Solicitud inválida",
                Content = BuildErrorResponse(2, "Parámetro inválido", 2)
            };

            operation.Responses["404"] = new OpenApiResponse
            {
                Description = "Recurso no encontrado",
                Content = BuildErrorResponse(300, "El recurso no existe", 3)
            };

            operation.Responses["500"] = new OpenApiResponse
            {
                Description = "Error interno del servidor",
                Content = BuildErrorResponse(9000, "Error interno de base de datos", 3)
            };
        }

        private Dictionary<string, OpenApiMediaType> BuildErrorResponse(int code, string message, int severity)
        {
            return new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Example = new OpenApiObject
                    {
                        ["success"] = new OpenApiBoolean(false),
                        ["data"] = new OpenApiNull(),
                        ["message"] = new OpenApiNull(),
                        ["error"] = new OpenApiObject
                        {
                            ["code"] = new OpenApiInteger(code),
                            ["message"] = new OpenApiString(message),
                            ["severity"] = new OpenApiInteger(severity)
                        }
                    }
                }
            };
        }
    }
}