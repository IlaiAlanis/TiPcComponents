using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_TI.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioTokenFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "autenticacion_proveedor",
                columns: table => new
                {
                    id_autenticacion_proveedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "local"),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__autentic__214386326E983766", x => x.id_autenticacion_proveedor);
                });

            migrationBuilder.CreateTable(
                name: "categoria",
                columns: table => new
                {
                    id_categoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_categoria = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__categori__CD54BC5A8A88B86A", x => x.id_categoria);
                });

            migrationBuilder.CreateTable(
                name: "descuento",
                columns: table => new
                {
                    id_descuento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_descuento = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    tipo_valor = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    valor = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__descuent__4F9A1A80ACEC2895", x => x.id_descuento);
                });

            migrationBuilder.CreateTable(
                name: "estatus_envio",
                columns: table => new
                {
                    id_estatus_envio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_estatus_envio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    orden = table.Column<int>(type: "int", nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__estatus___558B51D38A801C7B", x => x.id_estatus_envio);
                });

            migrationBuilder.CreateTable(
                name: "estatus_pago",
                columns: table => new
                {
                    id_estatus_pago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_estatus_pago = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__estatus___89D1D33EF4A97F58", x => x.id_estatus_pago);
                });

            migrationBuilder.CreateTable(
                name: "estatus_venta",
                columns: table => new
                {
                    id_estatus_venta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_estatus_venta = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__estatus___E676626AD1DA5EAD", x => x.id_estatus_venta);
                });

            migrationBuilder.CreateTable(
                name: "marca",
                columns: table => new
                {
                    id_marca = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_marca = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__marca__7E43E99EE7C355E7", x => x.id_marca);
                });

            migrationBuilder.CreateTable(
                name: "metodo_pago",
                columns: table => new
                {
                    id_metodo_pago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_metodo_pago = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__metodo_p__85BE0EBC91F715AB", x => x.id_metodo_pago);
                });

            migrationBuilder.CreateTable(
                name: "operador_envio",
                columns: table => new
                {
                    id_operador_envio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_operador = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    codigo_operador = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    sitio_web = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    nota = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__operador__0109F579240AB429", x => x.id_operador_envio);
                });

            migrationBuilder.CreateTable(
                name: "pais",
                columns: table => new
                {
                    id_pais = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_externo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nombre_pais = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    codigo = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__pais__0941A3A7E01C72C5", x => x.id_pais);
                });

            migrationBuilder.CreateTable(
                name: "producto_atributo",
                columns: table => new
                {
                    id_atributo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__3BB14C885B55F4F1", x => x.id_atributo);
                });

            migrationBuilder.CreateTable(
                name: "producto_variacion_historial_precio",
                columns: table => new
                {
                    id_historial_variaon_precio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    precio_anterior = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    precio_nuevo = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    motivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fuente_cambio = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    fecha_cambio = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__FBF5B40B5472F801", x => x.id_historial_variaon_precio);
                });

            migrationBuilder.CreateTable(
                name: "rol",
                columns: table => new
                {
                    id_rol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_rol = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__rol__6ABCB5E0DD9F762C", x => x.id_rol);
                });

            migrationBuilder.CreateTable(
                name: "severidad",
                columns: table => new
                {
                    id_severidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoria_severidad = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__severida__9E59231E6D6E1A69", x => x.id_severidad);
                });

            migrationBuilder.CreateTable(
                name: "suscripcion_newsletter",
                columns: table => new
                {
                    id_suscripcion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    correo = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    fecha_alta = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__suscripc__4E8926BBEEABEBEA", x => x.id_suscripcion);
                });

            migrationBuilder.CreateTable(
                name: "tipo_movimiento_inventario",
                columns: table => new
                {
                    id_tipo_movimiento_inventario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_movimiento_inventario = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    es_entrada = table.Column<bool>(type: "bit", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tipo_mov__D8AF2C3B91AC4AFB", x => x.id_tipo_movimiento_inventario);
                });

            migrationBuilder.CreateTable(
                name: "tipo_token",
                columns: table => new
                {
                    id_tipo_token = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_tipo_token = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tipo_tok__EBA9B06D7ADD5046", x => x.id_tipo_token);
                });

            migrationBuilder.CreateTable(
                name: "descuento_objetivo",
                columns: table => new
                {
                    id_descuento_objetivo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descuento_id = table.Column<int>(type: "int", nullable: false),
                    tipo_objetivo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    objetivo_id = table.Column<int>(type: "int", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__descuent__E32AE812796A7B35", x => x.id_descuento_objetivo);
                    table.ForeignKey(
                        name: "FK_descuento_objetivo_descuento",
                        column: x => x.descuento_id,
                        principalTable: "descuento",
                        principalColumn: "id_descuento");
                });

            migrationBuilder.CreateTable(
                name: "estado",
                columns: table => new
                {
                    id_estado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pais_id = table.Column<int>(type: "int", nullable: false),
                    id_externo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nombre_estado = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__estado__86989FB2AFDD4714", x => x.id_estado);
                    table.ForeignKey(
                        name: "Fk_estado_pais_id_pais",
                        column: x => x.pais_id,
                        principalTable: "pais",
                        principalColumn: "id_pais");
                });

            migrationBuilder.CreateTable(
                name: "categoria_atributo",
                columns: table => new
                {
                    id_categoria_atributo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoria_id = table.Column<int>(type: "int", nullable: false),
                    atributo_id = table.Column<int>(type: "int", nullable: false),
                    es_obligatorio = table.Column<bool>(type: "bit", nullable: false),
                    orden = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__categori__327F2EE2AF8F6198", x => x.id_categoria_atributo);
                    table.ForeignKey(
                        name: "FK_categoria_atributo_categoria",
                        column: x => x.categoria_id,
                        principalTable: "categoria",
                        principalColumn: "id_categoria",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_categoria_atributo_producto",
                        column: x => x.atributo_id,
                        principalTable: "producto_atributo",
                        principalColumn: "id_atributo");
                });

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    id_usuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rol_id = table.Column<int>(type: "int", nullable: false),
                    autenticacion_proveedor_id = table.Column<int>(type: "int", nullable: false),
                    nombre_usuario = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    apellido_paterno = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    apellido_materno = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    fecha_nacimiento = table.Column<DateOnly>(type: "date", nullable: true),
                    correo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    correo_verificado = table.Column<bool>(type: "bit", nullable: false),
                    contrasena_hash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    contrasena_salt = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ultimo_login_usuario = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuario__4E3E04AD117692B2", x => x.id_usuario);
                    table.ForeignKey(
                        name: "Fk_usuario_autenticacion_proveedor_id_autenticacion_proveedor",
                        column: x => x.autenticacion_proveedor_id,
                        principalTable: "autenticacion_proveedor",
                        principalColumn: "id_autenticacion_proveedor");
                    table.ForeignKey(
                        name: "Fk_usuario_rol_id_rol",
                        column: x => x.rol_id,
                        principalTable: "rol",
                        principalColumn: "id_rol");
                });

            migrationBuilder.CreateTable(
                name: "error_codigo",
                columns: table => new
                {
                    codigo = table.Column<int>(type: "int", nullable: false),
                    severidad_id = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    mensaje = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__error_co__40F9A20712DCAFFC", x => x.codigo);
                    table.ForeignKey(
                        name: "Fk_error_codigo_severidad_id_severidad",
                        column: x => x.severidad_id,
                        principalTable: "severidad",
                        principalColumn: "id_severidad");
                });

            migrationBuilder.CreateTable(
                name: "ciudad",
                columns: table => new
                {
                    id_ciudad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    estado_id = table.Column<int>(type: "int", nullable: false),
                    id_externo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    nombre_ciudad = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ciudad__B7DC4CD549A4CE8C", x => x.id_ciudad);
                    table.ForeignKey(
                        name: "Fk_ciudad_estado_id_pais",
                        column: x => x.estado_id,
                        principalTable: "estado",
                        principalColumn: "id_estado");
                });

            migrationBuilder.CreateTable(
                name: "impuesto",
                columns: table => new
                {
                    id_impuesto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_impuesto = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    porcentaje = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    pais_id = table.Column<int>(type: "int", nullable: true),
                    estado_id = table.Column<int>(type: "int", nullable: true),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__impuesto__8546BDFCF037EE54", x => x.id_impuesto);
                    table.ForeignKey(
                        name: "Fk_impuesto_estado_id_estado",
                        column: x => x.estado_id,
                        principalTable: "estado",
                        principalColumn: "id_estado");
                    table.ForeignKey(
                        name: "Fk_impuesto_pais_id_pais",
                        column: x => x.pais_id,
                        principalTable: "pais",
                        principalColumn: "id_pais");
                });

            migrationBuilder.CreateTable(
                name: "auditoria_evento",
                columns: table => new
                {
                    id_auditoria_evento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    tabla_afectada = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    id_registro = table.Column<int>(type: "int", nullable: true),
                    accion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    fecha = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    detalle_json = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ip_origen = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true),
                    dispositivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__auditori__C05175631AC53D78", x => x.id_auditoria_evento);
                    table.ForeignKey(
                        name: "Fk_auditoria_evento_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "carrito",
                columns: table => new
                {
                    id_carrito = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    estatus_venta_id = table.Column<int>(type: "int", nullable: false),
                    cantidad_total = table.Column<int>(type: "int", nullable: false),
                    descuento_total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__carrito__83A2AD9C24F1D044", x => x.id_carrito);
                    table.ForeignKey(
                        name: "Fk_carrito_estatus_venta_id_estatus_venta",
                        column: x => x.estatus_venta_id,
                        principalTable: "estatus_venta",
                        principalColumn: "id_estatus_venta");
                    table.ForeignKey(
                        name: "Fk_carrito_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "configuracion_global",
                columns: table => new
                {
                    id_configuracion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    clave = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    valor = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    tipo_dato = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__configur__16A13EBD3AD90FA7", x => x.id_configuracion);
                    table.ForeignKey(
                        name: "Fk_configuracion_global_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "notificacion_usuario",
                columns: table => new
                {
                    id_notificacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    titulo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    mensaje = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    tipo = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    leido = table.Column<bool>(type: "bit", nullable: false),
                    fecha_envio = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__notifica__8270F9A531482AE2", x => x.id_notificacion);
                    table.ForeignKey(
                        name: "Fk_notificacion_usuario_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "regla_descuento",
                columns: table => new
                {
                    id_regla_descuento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    descuento_id = table.Column<int>(type: "int", nullable: false),
                    prioridad = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    usuarios_nuevos_only = table.Column<bool>(type: "bit", nullable: false),
                    cantidad_max_por_usuario = table.Column<int>(type: "int", nullable: true),
                    cantidad_max_uso = table.Column<int>(type: "int", nullable: true),
                    cantidad_minima = table.Column<int>(type: "int", nullable: true),
                    total_minimo = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    uso_actual = table.Column<int>(type: "int", nullable: false),
                    coupon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    fecha_inicio = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false),
                    fecha_fin = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__regla_de__A5E9FA1E9294B7FB", x => x.id_regla_descuento);
                    table.ForeignKey(
                        name: "Fk_regla_descuento_descuento_id_descuento",
                        column: x => x.descuento_id,
                        principalTable: "descuento",
                        principalColumn: "id_descuento");
                    table.ForeignKey(
                        name: "Fk_regla_descuento_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "usuario_oauth_proveedor",
                columns: table => new
                {
                    id_usuario_oauth = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    autenticacion_proveedor_id = table.Column<int>(type: "int", nullable: false),
                    id_usuario_externo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    access_token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    fecha_expiracion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuario___CB87F6149CDFBD91", x => x.id_usuario_oauth);
                    table.ForeignKey(
                        name: "Fk_usuario_oauth_proveedor_autenticacion_proveedor_id_autenticacion_proveedor",
                        column: x => x.autenticacion_proveedor_id,
                        principalTable: "autenticacion_proveedor",
                        principalColumn: "id_autenticacion_proveedor");
                    table.ForeignKey(
                        name: "Fk_usuario_oauth_proveedor_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "usuario_token",
                columns: table => new
                {
                    id_token = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    token_hash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    created_by_ip = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_expiracion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    usado = table.Column<bool>(type: "bit", nullable: false),
                    revoked = table.Column<bool>(type: "bit", nullable: false),
                    replaced_by_token_hash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuario___3C2FA9C4DF6AF564", x => x.id_token);
                    table.ForeignKey(
                        name: "FK_usuario_token_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "error_log",
                columns: table => new
                {
                    id_error_log = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    codigo = table.Column<int>(type: "int", nullable: false),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    mensaje = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    detalle_tecnico = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    endpoint_app = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__error_lo__565A9BB197F46095", x => x.id_error_log);
                    table.ForeignKey(
                        name: "Fk_error_log_codigo_error_codigo",
                        column: x => x.codigo,
                        principalTable: "error_codigo",
                        principalColumn: "codigo");
                    table.ForeignKey(
                        name: "Fk_error_log_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "direccion",
                columns: table => new
                {
                    id_direccion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    pais_id = table.Column<int>(type: "int", nullable: false),
                    estado_id = table.Column<int>(type: "int", nullable: false),
                    ciudad_id = table.Column<int>(type: "int", nullable: false),
                    codigo_postal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    colonia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    calle = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    numero_interior = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    numero_exterior = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    etiqueta = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    es_default = table.Column<bool>(type: "bit", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__direccio__25C35D074C3E74DF", x => x.id_direccion);
                    table.ForeignKey(
                        name: "Fk_direccion_ciudad_id_ciudad",
                        column: x => x.ciudad_id,
                        principalTable: "ciudad",
                        principalColumn: "id_ciudad");
                    table.ForeignKey(
                        name: "Fk_direccion_estado_id_estado",
                        column: x => x.estado_id,
                        principalTable: "estado",
                        principalColumn: "id_estado");
                    table.ForeignKey(
                        name: "Fk_direccion_pais_id_pais",
                        column: x => x.pais_id,
                        principalTable: "pais",
                        principalColumn: "id_pais");
                    table.ForeignKey(
                        name: "Fk_direccion_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "proveedor",
                columns: table => new
                {
                    id_proveedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pais_id = table.Column<int>(type: "int", nullable: false),
                    estado_id = table.Column<int>(type: "int", nullable: false),
                    ciudad_id = table.Column<int>(type: "int", nullable: false),
                    codigo_postal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    nombre_proveedor = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    nombre_contacto = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    direccion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__proveedo__8D3DFE28152A8916", x => x.id_proveedor);
                    table.ForeignKey(
                        name: "Fk_proveedor_ciudad_id_ciudad",
                        column: x => x.ciudad_id,
                        principalTable: "ciudad",
                        principalColumn: "id_ciudad");
                    table.ForeignKey(
                        name: "Fk_proveedor_estado_id_estado",
                        column: x => x.estado_id,
                        principalTable: "estado",
                        principalColumn: "id_estado");
                    table.ForeignKey(
                        name: "Fk_proveedor_pais_id_pais",
                        column: x => x.pais_id,
                        principalTable: "pais",
                        principalColumn: "id_pais");
                });

            migrationBuilder.CreateTable(
                name: "orden",
                columns: table => new
                {
                    id_orden = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    carrito_id = table.Column<int>(type: "int", nullable: false),
                    metodo_pago_id = table.Column<int>(type: "int", nullable: false),
                    impuesto_id = table.Column<int>(type: "int", nullable: false),
                    estatus_venta_id = table.Column<int>(type: "int", nullable: false, defaultValue: 2),
                    direccion_envio_id = table.Column<int>(type: "int", nullable: false),
                    numero_orden = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    fecha_orden = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    descuento_total = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    impuesto_total = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    subtotal = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    total = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    referencia_metodo_pago = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orden__DD5B8F334A165CC5", x => x.id_orden);
                    table.ForeignKey(
                        name: "Fk_orden_carrito_id_carrito",
                        column: x => x.carrito_id,
                        principalTable: "carrito",
                        principalColumn: "id_carrito");
                    table.ForeignKey(
                        name: "Fk_orden_direccion_envio_id_direccion",
                        column: x => x.direccion_envio_id,
                        principalTable: "direccion",
                        principalColumn: "id_direccion");
                    table.ForeignKey(
                        name: "Fk_orden_estatus_venta_id_estatus_venta",
                        column: x => x.estatus_venta_id,
                        principalTable: "estatus_venta",
                        principalColumn: "id_estatus_venta");
                    table.ForeignKey(
                        name: "Fk_orden_impuesto_id_impuesto",
                        column: x => x.impuesto_id,
                        principalTable: "impuesto",
                        principalColumn: "id_impuesto");
                    table.ForeignKey(
                        name: "Fk_orden_metodo_pago_id_metodo_pago",
                        column: x => x.metodo_pago_id,
                        principalTable: "metodo_pago",
                        principalColumn: "id_metodo_pago");
                    table.ForeignKey(
                        name: "Fk_orden_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "producto",
                columns: table => new
                {
                    id_producto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoria_id = table.Column<int>(type: "int", nullable: false),
                    proveedor_id = table.Column<int>(type: "int", nullable: false),
                    marca_id = table.Column<int>(type: "int", nullable: false),
                    nombre_producto = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    dimensiones = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    es_destacado = table.Column<bool>(type: "bit", nullable: false),
                    precio_base = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    precio_promocional = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    sku = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    codigo_barras = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    stock_total = table.Column<int>(type: "int", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    peso = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__FF341C0D8F9FDEE6", x => x.id_producto);
                    table.ForeignKey(
                        name: "Fk_producto_categoria_id_categoria",
                        column: x => x.categoria_id,
                        principalTable: "categoria",
                        principalColumn: "id_categoria");
                    table.ForeignKey(
                        name: "Fk_producto_marca_id_marca",
                        column: x => x.marca_id,
                        principalTable: "marca",
                        principalColumn: "id_marca");
                    table.ForeignKey(
                        name: "Fk_producto_proveedor_id_proveedor",
                        column: x => x.proveedor_id,
                        principalTable: "proveedor",
                        principalColumn: "id_proveedor");
                });

            migrationBuilder.CreateTable(
                name: "coupon_usado",
                columns: table => new
                {
                    id_coupon_usado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    regla_descuento_id = table.Column<int>(type: "int", nullable: false),
                    codigo_cupon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    descuento_aplicado = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    aplicado = table.Column<bool>(type: "bit", nullable: false),
                    tipo_valor = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    fecha_usado = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__coupon_u__73B19E4FDDDC4BDB", x => x.id_coupon_usado);
                    table.ForeignKey(
                        name: "Fk_coupon_usado_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden");
                    table.ForeignKey(
                        name: "Fk_coupon_usado_regla_descuento_id_regla_descuento",
                        column: x => x.regla_descuento_id,
                        principalTable: "regla_descuento",
                        principalColumn: "id_regla_descuento");
                    table.ForeignKey(
                        name: "Fk_coupon_usado_usuario_id_",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "envio",
                columns: table => new
                {
                    id_envio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    operador_envio_id = table.Column<int>(type: "int", nullable: false),
                    estatus_envio_id = table.Column<int>(type: "int", nullable: false),
                    numero_guia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    costo_envio = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    peso_total = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    fecha_recoleccion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    fecha_estimada_entrega = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    fecha_entrega = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__envio__8C48C8CA965F1076", x => x.id_envio);
                    table.ForeignKey(
                        name: "Fk_envio_estatus_envio_id_estatus_envio",
                        column: x => x.estatus_envio_id,
                        principalTable: "estatus_envio",
                        principalColumn: "id_estatus_envio");
                    table.ForeignKey(
                        name: "Fk_envio_operador_envio_id_operador_envio",
                        column: x => x.operador_envio_id,
                        principalTable: "operador_envio",
                        principalColumn: "id_operador_envio");
                    table.ForeignKey(
                        name: "Fk_envio_orden_id_",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Fk_envio_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "factura",
                columns: table => new
                {
                    id_factura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    numero_factura = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    rfc_cliente = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    razon_social = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    direccion_fiscal = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    subtotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    impuestos = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    total = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    uuid = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    xml_factura = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pdf_factura = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    fecha_emision = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_cancelacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__factura__6C08ED534821C496", x => x.id_factura);
                    table.ForeignKey(
                        name: "Fk_factura_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden");
                    table.ForeignKey(
                        name: "Fk_factura_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "orden_estado_historial",
                columns: table => new
                {
                    id_historial_orden = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    estatus_venta_id = table.Column<int>(type: "int", nullable: false),
                    fecha_cambio = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    comentario = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orden_es__45B1AC094F198BDD", x => x.id_historial_orden);
                    table.ForeignKey(
                        name: "FK_orden_estado_historial_estatus_venta_id_estatus_venta",
                        column: x => x.estatus_venta_id,
                        principalTable: "estatus_venta",
                        principalColumn: "id_estatus_venta");
                    table.ForeignKey(
                        name: "FK_orden_estado_historial_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden");
                    table.ForeignKey(
                        name: "FK_orden_estado_historial_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "pago_transaccion",
                columns: table => new
                {
                    id_pago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    metodo_pago_id = table.Column<int>(type: "int", nullable: false),
                    estatus_pago_id = table.Column<int>(type: "int", nullable: true),
                    monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    referencia_gateway = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    transaccion_gateway_id = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    respuesta_gateway = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fecha_transaccion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__pago_tra__0941B074C1A47E57", x => x.id_pago);
                    table.ForeignKey(
                        name: "Fk_pago_transaccion_estatus_pago_id_estatus_pago",
                        column: x => x.estatus_pago_id,
                        principalTable: "estatus_pago",
                        principalColumn: "id_estatus_pago");
                    table.ForeignKey(
                        name: "Fk_pago_transaccion_metodo_pago_id_metodo_pago",
                        column: x => x.metodo_pago_id,
                        principalTable: "metodo_pago",
                        principalColumn: "id_metodo_pago");
                    table.ForeignKey(
                        name: "Fk_pago_transaccion_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "carrito_item",
                columns: table => new
                {
                    id_carrito_item = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    carrito_id = table.Column<int>(type: "int", nullable: false),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    precio_unitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    descuento_aplicado = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    precio_final = table.Column<decimal>(type: "decimal(19,2)", nullable: true, computedColumnSql: "([precio_unitario]-[descuento_aplicado])", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__carrito___240DF0BEC9E41B3F", x => x.id_carrito_item);
                    table.ForeignKey(
                        name: "Fk_carrito_item_id_carrito_carrito",
                        column: x => x.carrito_id,
                        principalTable: "carrito",
                        principalColumn: "id_carrito");
                    table.ForeignKey(
                        name: "Fk_carrito_item_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                });

            migrationBuilder.CreateTable(
                name: "orden_item",
                columns: table => new
                {
                    id_orden_item = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    precio_unitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    descuento_aplicado = table.Column<decimal>(type: "decimal(18,2)", nullable: true, defaultValue: 0m),
                    subtotal = table.Column<decimal>(type: "decimal(30,2)", nullable: true, computedColumnSql: "(([precio_unitario]-[descuento_aplicado])*[cantidad])", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orden_it__ADF7D768DB5FF162", x => x.id_orden_item);
                    table.ForeignKey(
                        name: "Fk_orden_item_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Fk_orden_item_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                });

            migrationBuilder.CreateTable(
                name: "producto_descuento",
                columns: table => new
                {
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    descuento_id = table.Column<int>(type: "int", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_producto_descuento", x => new { x.producto_id, x.descuento_id });
                    table.ForeignKey(
                        name: "Fk_producto_descuento_descuento_id_descuento",
                        column: x => x.descuento_id,
                        principalTable: "descuento",
                        principalColumn: "id_descuento");
                    table.ForeignKey(
                        name: "Fk_producto_descuento_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "producto_historial_precio",
                columns: table => new
                {
                    id_historial_precio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    precio_anterior = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    precio_nuevo = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    motivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fuente_cambio = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    fecha_cambio = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__5EDBC272DE0727BB", x => x.id_historial_precio);
                    table.ForeignKey(
                        name: "Fk_producto_historial_precio_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                    table.ForeignKey(
                        name: "Fk_producto_historial_precio_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "producto_imagen",
                columns: table => new
                {
                    id_imagen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    url_imagen = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    es_principal = table.Column<bool>(type: "bit", nullable: false),
                    orden = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__27CC2689056832DE", x => x.id_imagen);
                    table.ForeignKey(
                        name: "FK_producto_imagen_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "producto_relacionado",
                columns: table => new
                {
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    producto_relacionado_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_producto_relacionado", x => new { x.producto_id, x.producto_relacionado_id });
                    table.ForeignKey(
                        name: "FK_producto_relacionado_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_producto_relacionado_producto_rel",
                        column: x => x.producto_relacionado_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                });

            migrationBuilder.CreateTable(
                name: "producto_resena",
                columns: table => new
                {
                    id_resena = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    calificacion = table.Column<int>(type: "int", nullable: false),
                    comentario = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__06CD93630D6FB33C", x => x.id_resena);
                    table.ForeignKey(
                        name: "Fk_producto_resena_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                    table.ForeignKey(
                        name: "Fk_producto_resena_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "producto_variacion",
                columns: table => new
                {
                    id_variacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    sku = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    codigo_barras = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    imagen_url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    stock = table.Column<int>(type: "int", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__950135CE35297297", x => x.id_variacion);
                    table.ForeignKey(
                        name: "Fk_producto_variacion_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "usuario_favorito",
                columns: table => new
                {
                    id_favorito = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    fecha_agregado = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    esta_activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuario___78F875AEF7790209", x => x.id_favorito);
                    table.ForeignKey(
                        name: "Fk_usuario_favorito_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                    table.ForeignKey(
                        name: "Fk_usuario_favorito_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "envio_estatus_historial",
                columns: table => new
                {
                    id_envio_historial = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    envio_id = table.Column<int>(type: "int", nullable: false),
                    estatus_envio_id = table.Column<int>(type: "int", nullable: false),
                    usuario_id = table.Column<int>(type: "int", nullable: true),
                    comentario = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fecha_cambio = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__envio_es__C26AFB5CDE5EB8D7", x => x.id_envio_historial);
                    table.ForeignKey(
                        name: "Fk_envio_estatus_historial_envio_id_envio",
                        column: x => x.envio_id,
                        principalTable: "envio",
                        principalColumn: "id_envio",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Fk_envio_estatus_historial_estatus_envio_id_",
                        column: x => x.estatus_envio_id,
                        principalTable: "estatus_envio",
                        principalColumn: "id_estatus_envio");
                });

            migrationBuilder.CreateTable(
                name: "carrito_descuento",
                columns: table => new
                {
                    id_carrito_descuento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    carrito_id = table.Column<int>(type: "int", nullable: false),
                    carrito_item_id = table.Column<int>(type: "int", nullable: true),
                    descuento_id = table.Column<int>(type: "int", nullable: false),
                    regla_descuento_id = table.Column<int>(type: "int", nullable: true),
                    monto_aplicado = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    fecha_aplicacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__carrito___A3FB0E2558FBF0FC", x => x.id_carrito_descuento);
                    table.ForeignKey(
                        name: "Fk_carrito_descuento_carrito_id_carrito",
                        column: x => x.carrito_id,
                        principalTable: "carrito",
                        principalColumn: "id_carrito");
                    table.ForeignKey(
                        name: "Fk_carrito_descuento_carrito_item_id_carrito_item",
                        column: x => x.carrito_item_id,
                        principalTable: "carrito_item",
                        principalColumn: "id_carrito_item");
                    table.ForeignKey(
                        name: "Fk_carrito_descuento_descuento_id_descuento",
                        column: x => x.descuento_id,
                        principalTable: "descuento",
                        principalColumn: "id_descuento");
                    table.ForeignKey(
                        name: "Fk_carrito_descuento_regla_descuento_id_regla_descuento",
                        column: x => x.regla_descuento_id,
                        principalTable: "regla_descuento",
                        principalColumn: "id_regla_descuento");
                });

            migrationBuilder.CreateTable(
                name: "orden_descuento",
                columns: table => new
                {
                    id_orden_descuento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    orden_item_id = table.Column<int>(type: "int", nullable: true),
                    descuento_id = table.Column<int>(type: "int", nullable: false),
                    monto_aplicado = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    fecha_aplicacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orden_de__3432CEA259316832", x => x.id_orden_descuento);
                    table.ForeignKey(
                        name: "Fk_orden_descuento_descuento_id_descuento",
                        column: x => x.descuento_id,
                        principalTable: "descuento",
                        principalColumn: "id_descuento");
                    table.ForeignKey(
                        name: "Fk_orden_descuento_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Fk_orden_descuento_orden_item_id_orden_item",
                        column: x => x.orden_item_id,
                        principalTable: "orden_item",
                        principalColumn: "id_orden_item");
                });

            migrationBuilder.CreateTable(
                name: "orden_devolucion",
                columns: table => new
                {
                    id_devolucion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    orden_id = table.Column<int>(type: "int", nullable: false),
                    orden_item_id = table.Column<int>(type: "int", nullable: true),
                    metodo_reembolso_id = table.Column<int>(type: "int", nullable: true),
                    estatus_venta_id = table.Column<int>(type: "int", nullable: false),
                    motivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    monto_reembolso = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    fecha_solicitud = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_resolucion = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orden_de__0BBAEF8DFA9AD78F", x => x.id_devolucion);
                    table.ForeignKey(
                        name: "Fk_orden_devolucion_estatus_venta_id_estatus_venta",
                        column: x => x.estatus_venta_id,
                        principalTable: "estatus_venta",
                        principalColumn: "id_estatus_venta");
                    table.ForeignKey(
                        name: "Fk_orden_devolucion_metodo_pago_id_metodo_pago",
                        column: x => x.metodo_reembolso_id,
                        principalTable: "metodo_pago",
                        principalColumn: "id_metodo_pago");
                    table.ForeignKey(
                        name: "Fk_orden_devolucion_orden_id_orden",
                        column: x => x.orden_id,
                        principalTable: "orden",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "Fk_orden_devolucion_orden_item_id_orden_item",
                        column: x => x.orden_item_id,
                        principalTable: "orden_item",
                        principalColumn: "id_orden_item");
                    table.ForeignKey(
                        name: "Fk_orden_devolucion_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                });

            migrationBuilder.CreateTable(
                name: "inventario_actual",
                columns: table => new
                {
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    variacion_id = table.Column<int>(type: "int", nullable: false),
                    stock_actual = table.Column<int>(type: "int", nullable: false),
                    stock_minimo = table.Column<int>(type: "int", nullable: true),
                    stock_maximo = table.Column<int>(type: "int", nullable: true),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__inventar__BD553D6577DA8A07", x => new { x.producto_id, x.variacion_id });
                    table.ForeignKey(
                        name: "FK_inventario_actual_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                    table.ForeignKey(
                        name: "FK_inventario_actual_variacion_producto",
                        column: x => x.variacion_id,
                        principalTable: "producto_variacion",
                        principalColumn: "id_variacion");
                });

            migrationBuilder.CreateTable(
                name: "inventario_movimiento",
                columns: table => new
                {
                    id_movimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usuario_id = table.Column<int>(type: "int", nullable: false),
                    producto_id = table.Column<int>(type: "int", nullable: false),
                    variacion_id = table.Column<int>(type: "int", nullable: true),
                    tipo_movimiento_inventario_id = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    id_referencia = table.Column<int>(type: "int", nullable: true),
                    comentario = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    fecha_movimiento = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())"),
                    fecha_creacion = table.Column<DateTime>(type: "datetime2(3)", precision: 3, nullable: false, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__inventar__2A071C2442FAE25B", x => x.id_movimiento);
                    table.ForeignKey(
                        name: "Fk_inventario_movimiento_producto_id_producto",
                        column: x => x.producto_id,
                        principalTable: "producto",
                        principalColumn: "id_producto");
                    table.ForeignKey(
                        name: "Fk_inventario_movimiento_tipo_movimiento_inventario_id_tipo_movimiento_inventario",
                        column: x => x.tipo_movimiento_inventario_id,
                        principalTable: "tipo_movimiento_inventario",
                        principalColumn: "id_tipo_movimiento_inventario");
                    table.ForeignKey(
                        name: "Fk_inventario_movimiento_usuario_id_usuario",
                        column: x => x.usuario_id,
                        principalTable: "usuario",
                        principalColumn: "id_usuario");
                    table.ForeignKey(
                        name: "Fk_inventario_movimiento_variacion_id_producto_variacion",
                        column: x => x.variacion_id,
                        principalTable: "producto_variacion",
                        principalColumn: "id_variacion");
                });

            migrationBuilder.CreateTable(
                name: "producto_variacion_atributo",
                columns: table => new
                {
                    variacion_id = table.Column<int>(type: "int", nullable: false),
                    atributo_id = table.Column<int>(type: "int", nullable: false),
                    valor = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    orden = table.Column<int>(type: "int", nullable: true),
                    unidad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_producto_variacion_atributo", x => new { x.variacion_id, x.atributo_id });
                    table.ForeignKey(
                        name: "Fk_producto_variacion_atributo_id_atributo_producto_atributo",
                        column: x => x.atributo_id,
                        principalTable: "producto_atributo",
                        principalColumn: "id_atributo");
                    table.ForeignKey(
                        name: "Fk_producto_variacion_atributo_id_variacion_producto_variacion",
                        column: x => x.variacion_id,
                        principalTable: "producto_variacion",
                        principalColumn: "id_variacion");
                });

            migrationBuilder.CreateIndex(
                name: "IX_auditoria_evento_usuario_id",
                table: "auditoria_evento",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_auditoria_tabla_fecha",
                table: "auditoria_evento",
                columns: new[] { "tabla_afectada", "fecha" });

            migrationBuilder.CreateIndex(
                name: "UQ__autentic__72AFBCC6E218EC8A",
                table: "autenticacion_proveedor",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_carrito_estatus_venta_id",
                table: "carrito",
                column: "estatus_venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_usuario",
                table: "carrito",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_descuento_carrito_id",
                table: "carrito_descuento",
                column: "carrito_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_descuento_carrito_item_id",
                table: "carrito_descuento",
                column: "carrito_item_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_descuento_descuento_id",
                table: "carrito_descuento",
                column: "descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_descuento_regla_descuento_id",
                table: "carrito_descuento",
                column: "regla_descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_item_carrito",
                table: "carrito_item",
                column: "carrito_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_item_producto_id",
                table: "carrito_item",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "UQ__categori__4EBF62599EDA684E",
                table: "categoria",
                column: "nombre_categoria",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_categoria_atributo_atributo_id",
                table: "categoria_atributo",
                column: "atributo_id");

            migrationBuilder.CreateIndex(
                name: "UQ_categoria_atributo",
                table: "categoria_atributo",
                column: "categoria_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ciudad_estado_id",
                table: "ciudad",
                column: "estado_id");

            migrationBuilder.CreateIndex(
                name: "UQ__ciudad__109C46F365961A35",
                table: "ciudad",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_ciudad_id_externo",
                table: "ciudad",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_configuracion_global_usuario_id",
                table: "configuracion_global",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__configur__71DCA3DB8484DFF4",
                table: "configuracion_global",
                column: "clave",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_coupon_usado_orden_id",
                table: "coupon_usado",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_coupon_usado_usuario",
                table: "coupon_usado",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__coupon_u__076DC2BBFB4B84F2",
                table: "coupon_usado",
                column: "regla_descuento_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__coupon_u__2ED7D2AE6C359DF3",
                table: "coupon_usado",
                column: "usuario_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_descuento_activo",
                table: "descuento",
                column: "esta_activo");

            migrationBuilder.CreateIndex(
                name: "IX_descuento_objetivo_descuento_id",
                table: "descuento_objetivo",
                column: "descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_direccion_ciudad_id",
                table: "direccion",
                column: "ciudad_id");

            migrationBuilder.CreateIndex(
                name: "IX_direccion_estado_id",
                table: "direccion",
                column: "estado_id");

            migrationBuilder.CreateIndex(
                name: "IX_direccion_pais_id",
                table: "direccion",
                column: "pais_id");

            migrationBuilder.CreateIndex(
                name: "IX_direccion_usuario_id",
                table: "direccion",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_envio_estatus",
                table: "envio",
                column: "estatus_envio_id");

            migrationBuilder.CreateIndex(
                name: "IX_envio_operador_estatus",
                table: "envio",
                columns: new[] { "operador_envio_id", "estatus_envio_id" });

            migrationBuilder.CreateIndex(
                name: "IX_envio_orden",
                table: "envio",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_envio_usuario_id",
                table: "envio",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__envio__FD7B4CA6B15C62DB",
                table: "envio",
                column: "numero_guia",
                unique: true,
                filter: "[numero_guia] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_envio_estatus_historial_envio_id",
                table: "envio_estatus_historial",
                column: "envio_id");

            migrationBuilder.CreateIndex(
                name: "IX_envio_estatus_historial_estatus_envio_id",
                table: "envio_estatus_historial",
                column: "estatus_envio_id");

            migrationBuilder.CreateIndex(
                name: "IX_error_codigo_severidad_id",
                table: "error_codigo",
                column: "severidad_id");

            migrationBuilder.CreateIndex(
                name: "IX_error_log_codigo",
                table: "error_log",
                column: "codigo");

            migrationBuilder.CreateIndex(
                name: "IX_error_log_usuario_id",
                table: "error_log",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_estado_pais_id",
                table: "estado",
                column: "pais_id");

            migrationBuilder.CreateIndex(
                name: "UQ__estado__109C46F3856B99B8",
                table: "estado",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_estado_id_externo",
                table: "estado",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__estatus___40F9A206B2E52408",
                table: "estatus_envio",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__estatus___D653B1FDCBFD39C5",
                table: "estatus_pago",
                column: "nombre_estatus_pago",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__estatus___40F9A206C8C336C0",
                table: "estatus_venta",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_factura_orden_id",
                table: "factura",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_factura_usuario_id",
                table: "factura",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__factura__3DC4B241558193B1",
                table: "factura",
                column: "numero_factura",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_impuesto_estado_id",
                table: "impuesto",
                column: "estado_id");

            migrationBuilder.CreateIndex(
                name: "IX_impuesto_pais_id",
                table: "impuesto",
                column: "pais_id");

            migrationBuilder.CreateIndex(
                name: "IX_inventario_actual_variacion_id",
                table: "inventario_actual",
                column: "variacion_id");

            migrationBuilder.CreateIndex(
                name: "IX_inventario_movimiento_producto",
                table: "inventario_movimiento",
                columns: new[] { "producto_id", "fecha_movimiento" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_inventario_movimiento_tipo_movimiento_inventario_id",
                table: "inventario_movimiento",
                column: "tipo_movimiento_inventario_id");

            migrationBuilder.CreateIndex(
                name: "IX_inventario_movimiento_usuario_id",
                table: "inventario_movimiento",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_inventario_movimiento_variacion_id",
                table: "inventario_movimiento",
                column: "variacion_id");

            migrationBuilder.CreateIndex(
                name: "UQ__marca__6059F572758C505D",
                table: "marca",
                column: "nombre_marca",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__metodo_p__436F61F2B76A257D",
                table: "metodo_pago",
                column: "nombre_metodo_pago",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notificacion_usuario_usuario_id",
                table: "notificacion_usuario",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__operador__2C1428C1C04ECEAC",
                table: "operador_envio",
                column: "codigo_operador",
                unique: true,
                filter: "[codigo_operador] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_orden_carrito_id",
                table: "orden",
                column: "carrito_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_direccion_envio_id",
                table: "orden",
                column: "direccion_envio_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_estatus",
                table: "orden",
                column: "estatus_venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_fecha",
                table: "orden",
                column: "fecha_orden",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_orden_impuesto_id",
                table: "orden",
                column: "impuesto_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_metodo_pago_id",
                table: "orden",
                column: "metodo_pago_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_usuario",
                table: "orden",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_usuario_estatus",
                table: "orden",
                columns: new[] { "usuario_id", "estatus_venta_id" });

            migrationBuilder.CreateIndex(
                name: "IX_orden_descuento_descuento_id",
                table: "orden_descuento",
                column: "descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_descuento_orden_id",
                table: "orden_descuento",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_descuento_orden_item_id",
                table: "orden_descuento",
                column: "orden_item_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_devolucion_estatus_venta_id",
                table: "orden_devolucion",
                column: "estatus_venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_devolucion_metodo_reembolso_id",
                table: "orden_devolucion",
                column: "metodo_reembolso_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_devolucion_orden",
                table: "orden_devolucion",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_devolucion_orden_item_id",
                table: "orden_devolucion",
                column: "orden_item_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_devolucion_usuario",
                table: "orden_devolucion",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_estado_historial_estatus_venta_id",
                table: "orden_estado_historial",
                column: "estatus_venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_estado_historial_orden_id",
                table: "orden_estado_historial",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_estado_historial_usuario_id",
                table: "orden_estado_historial",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_item_orden_id",
                table: "orden_item",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_orden_item_producto_id",
                table: "orden_item",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_pago_gateway",
                table: "pago_transaccion",
                column: "referencia_gateway");

            migrationBuilder.CreateIndex(
                name: "IX_pago_orden",
                table: "pago_transaccion",
                column: "orden_id");

            migrationBuilder.CreateIndex(
                name: "IX_pago_transaccion_estatus_pago_id",
                table: "pago_transaccion",
                column: "estatus_pago_id");

            migrationBuilder.CreateIndex(
                name: "IX_pago_transaccion_metodo_pago_id",
                table: "pago_transaccion",
                column: "metodo_pago_id");

            migrationBuilder.CreateIndex(
                name: "UQ__pais__109C46F35EC1C539",
                table: "pais",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__pais__ACBDCE73BAED01A7",
                table: "pais",
                column: "nombre_pais",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_pais_id_externo",
                table: "pais",
                column: "id_externo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_pais_nombre_pais",
                table: "pais",
                column: "nombre_pais",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_producto_categoria",
                table: "producto",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_categoria_activo",
                table: "producto",
                columns: new[] { "categoria_id", "esta_activo" });

            migrationBuilder.CreateIndex(
                name: "IX_producto_marca",
                table: "producto",
                column: "marca_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_precio",
                table: "producto",
                column: "precio_base");

            migrationBuilder.CreateIndex(
                name: "IX_producto_proveedor",
                table: "producto",
                column: "proveedor_id");

            migrationBuilder.CreateIndex(
                name: "UQ__producto__730FA6ABAEB7578F",
                table: "producto",
                column: "codigo_barras",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__producto__DDDF4BE79CBC60F6",
                table: "producto",
                column: "sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_producto_codigo_barras",
                table: "producto",
                column: "codigo_barras",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_producto_sku",
                table: "producto",
                column: "sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_producto_descuento_descuento_id",
                table: "producto_descuento",
                column: "descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_historial_precio_producto_id",
                table: "producto_historial_precio",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_historial_precio_usuario_id",
                table: "producto_historial_precio",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_imagen_producto_id",
                table: "producto_imagen",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_relacionado_producto_relacionado_id",
                table: "producto_relacionado",
                column: "producto_relacionado_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_resena_producto",
                table: "producto_resena",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_resena_usuario_id",
                table: "producto_resena",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_producto_variacion",
                table: "producto_variacion",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "UQ__producto__730FA6AB6A9571B5",
                table: "producto_variacion",
                column: "codigo_barras",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__producto__DDDF4BE7E7A04E71",
                table: "producto_variacion",
                column: "sku",
                unique: true,
                filter: "[sku] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_producto_variacion_atributo_atributo_id",
                table: "producto_variacion_atributo",
                column: "atributo_id");

            migrationBuilder.CreateIndex(
                name: "IX_proveedor_ciudad_id",
                table: "proveedor",
                column: "ciudad_id");

            migrationBuilder.CreateIndex(
                name: "IX_proveedor_estado_id",
                table: "proveedor",
                column: "estado_id");

            migrationBuilder.CreateIndex(
                name: "IX_proveedor_pais_id",
                table: "proveedor",
                column: "pais_id");

            migrationBuilder.CreateIndex(
                name: "IX_regla_descuento_descuento_id",
                table: "regla_descuento",
                column: "descuento_id");

            migrationBuilder.CreateIndex(
                name: "IX_regla_descuento_usuario_id",
                table: "regla_descuento",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "UQ__regla_de__10C591937EF55A05",
                table: "regla_descuento",
                column: "coupon",
                unique: true,
                filter: "[coupon] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__rol__673CB435B48C2A8F",
                table: "rol",
                column: "nombre_rol",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__suscripc__2A586E0B15B16B06",
                table: "suscripcion_newsletter",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__tipo_mov__5C071637832F1DCB",
                table: "tipo_movimiento_inventario",
                column: "nombre_movimiento_inventario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_tipo_movimiento_inventario",
                table: "tipo_movimiento_inventario",
                column: "nombre_movimiento_inventario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__tipo_tok__AF00178A53EE7703",
                table: "tipo_token",
                column: "nombre_tipo_token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_tipo_token_nombre_tipo_token",
                table: "tipo_token",
                column: "nombre_tipo_token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuario_autenticacion_proveedor_id",
                table: "usuario",
                column: "autenticacion_proveedor_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_correo",
                table: "usuario",
                column: "correo");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_rol_id",
                table: "usuario",
                column: "rol_id");

            migrationBuilder.CreateIndex(
                name: "UQ__usuario__2A586E0B359C0364",
                table: "usuario",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_usuario_correo",
                table: "usuario",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuario_favorito_producto_id",
                table: "usuario_favorito",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_favorito_usuario",
                table: "usuario_favorito",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_oauth_proveedor_autenticacion_proveedor_id",
                table: "usuario_oauth_proveedor",
                column: "autenticacion_proveedor_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_oauth_usuario",
                table: "usuario_oauth_proveedor",
                columns: new[] { "usuario_id", "autenticacion_proveedor_id" });

            migrationBuilder.CreateIndex(
                name: "IX_usuario_token_usuario",
                table: "usuario_token",
                columns: new[] { "usuario_id", "fecha_expiracion" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "auditoria_evento");

            migrationBuilder.DropTable(
                name: "carrito_descuento");

            migrationBuilder.DropTable(
                name: "categoria_atributo");

            migrationBuilder.DropTable(
                name: "configuracion_global");

            migrationBuilder.DropTable(
                name: "coupon_usado");

            migrationBuilder.DropTable(
                name: "descuento_objetivo");

            migrationBuilder.DropTable(
                name: "envio_estatus_historial");

            migrationBuilder.DropTable(
                name: "error_log");

            migrationBuilder.DropTable(
                name: "factura");

            migrationBuilder.DropTable(
                name: "inventario_actual");

            migrationBuilder.DropTable(
                name: "inventario_movimiento");

            migrationBuilder.DropTable(
                name: "notificacion_usuario");

            migrationBuilder.DropTable(
                name: "orden_descuento");

            migrationBuilder.DropTable(
                name: "orden_devolucion");

            migrationBuilder.DropTable(
                name: "orden_estado_historial");

            migrationBuilder.DropTable(
                name: "pago_transaccion");

            migrationBuilder.DropTable(
                name: "producto_descuento");

            migrationBuilder.DropTable(
                name: "producto_historial_precio");

            migrationBuilder.DropTable(
                name: "producto_imagen");

            migrationBuilder.DropTable(
                name: "producto_relacionado");

            migrationBuilder.DropTable(
                name: "producto_resena");

            migrationBuilder.DropTable(
                name: "producto_variacion_atributo");

            migrationBuilder.DropTable(
                name: "producto_variacion_historial_precio");

            migrationBuilder.DropTable(
                name: "suscripcion_newsletter");

            migrationBuilder.DropTable(
                name: "tipo_token");

            migrationBuilder.DropTable(
                name: "usuario_favorito");

            migrationBuilder.DropTable(
                name: "usuario_oauth_proveedor");

            migrationBuilder.DropTable(
                name: "usuario_token");

            migrationBuilder.DropTable(
                name: "carrito_item");

            migrationBuilder.DropTable(
                name: "regla_descuento");

            migrationBuilder.DropTable(
                name: "envio");

            migrationBuilder.DropTable(
                name: "error_codigo");

            migrationBuilder.DropTable(
                name: "tipo_movimiento_inventario");

            migrationBuilder.DropTable(
                name: "orden_item");

            migrationBuilder.DropTable(
                name: "estatus_pago");

            migrationBuilder.DropTable(
                name: "producto_atributo");

            migrationBuilder.DropTable(
                name: "producto_variacion");

            migrationBuilder.DropTable(
                name: "descuento");

            migrationBuilder.DropTable(
                name: "estatus_envio");

            migrationBuilder.DropTable(
                name: "operador_envio");

            migrationBuilder.DropTable(
                name: "severidad");

            migrationBuilder.DropTable(
                name: "orden");

            migrationBuilder.DropTable(
                name: "producto");

            migrationBuilder.DropTable(
                name: "carrito");

            migrationBuilder.DropTable(
                name: "direccion");

            migrationBuilder.DropTable(
                name: "impuesto");

            migrationBuilder.DropTable(
                name: "metodo_pago");

            migrationBuilder.DropTable(
                name: "categoria");

            migrationBuilder.DropTable(
                name: "marca");

            migrationBuilder.DropTable(
                name: "proveedor");

            migrationBuilder.DropTable(
                name: "estatus_venta");

            migrationBuilder.DropTable(
                name: "usuario");

            migrationBuilder.DropTable(
                name: "ciudad");

            migrationBuilder.DropTable(
                name: "autenticacion_proveedor");

            migrationBuilder.DropTable(
                name: "rol");

            migrationBuilder.DropTable(
                name: "estado");

            migrationBuilder.DropTable(
                name: "pais");
        }
    }
}
