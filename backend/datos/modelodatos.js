require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de diagnóstico
const config = {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
            enableArithAbort: true,
            validateBulkLoadParameters: false,
            connectTimeout: 60000, // 60 segundos
            requestTimeout: 60000,
            port: 1433  // Especificar el puerto explícitamente
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    logging: (msg) => console.log('Sequelize Log:', msg)
};

console.log('Intentando conectar a la base de datos con la siguiente configuración:', {
    host: config.host,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    dialect: config.dialect,
    port: config.dialectOptions.options.port
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    config
);

// Prueba de conexión inicial
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión establecida correctamente a:', process.env.DB_SERVER);
        console.log('   Base de datos:', process.env.DB_NAME);
        console.log('   Usuario:', process.env.DB_USER);
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:');
        console.error('   Servidor:', process.env.DB_SERVER);
        console.error('   Base de datos:', process.env.DB_NAME);
        console.error('   Usuario:', process.env.DB_USER);
        console.error('   Error:', err.message);
        if (err.parent) {
            console.error('   Error detallado:', err.parent.message);
        }
    });

// Tabla: Roles (Admin, Profesor, Alumno)
const Rol = sequelize.define('Roles', {
    IdRol: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    NombreRol: { 
        type: DataTypes.STRING(50), 
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Roles',
    timestamps: false
});

// Tabla: Usuarios
const Usuario = sequelize.define('Usuarios', {
    IdUsuario: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    NombreCompleto: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    Correo: { 
        type: DataTypes.STRING(100), 
        allowNull: false,
        unique: true
    },
    Contrasena: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    Telefono: { 
        type: DataTypes.STRING(20), 
        allowNull: true 
    },
    Distrito: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },
    FechaRegistro: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
    },
    EstadoCuenta: { 
        type: DataTypes.STRING(20), 
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
            isIn: [['pendiente', 'activo', 'rechazado']]
        }
    },
    RolId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Roles',
            key: 'IdRol'
        }
    }
}, {
    tableName: 'Usuarios',
    timestamps: false
});

// Tabla: Cursos
const Curso = sequelize.define('Cursos', {
    IdCurso: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    ProfesorId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'IdUsuario'
        }
    },
    NombreCurso: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    Descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    FechaInicio: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    FechaFin: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    Horario: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },
    FechaCreacion: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
    }
}, {
    tableName: 'Cursos',
    timestamps: false
});

// Tabla: SolicitudesCurso
const SolicitudCurso = sequelize.define('SolicitudesCurso', {
    IdSolicitud: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    CursoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Cursos',
            key: 'IdCurso'
        }
    },
    AlumnoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'IdUsuario'
        }
    },
    FechaSolicitud: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
    },
    EstadoSolicitud: { 
        type: DataTypes.STRING(20), 
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
            isIn: [['pendiente', 'aceptado', 'rechazado']]
        }
    }
}, {
    tableName: 'SolicitudesCurso',
    timestamps: false
});

// Tabla: MaterialesCurso
const MaterialCurso = sequelize.define('MaterialesCurso', {
    IdMaterial: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    CursoId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Cursos',
            key: 'IdCurso'
        }
    },
    Titulo: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    Enlace: { 
        type: DataTypes.STRING(500), 
        allowNull: false 
    },
    FechaPublicacion: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
    }
}, {
    tableName: 'MaterialesCurso',
    timestamps: false
});

// Definir las relaciones
Usuario.belongsTo(Rol, { 
    foreignKey: 'RolId',
    targetKey: 'IdRol',
    as: 'Rol'  // Alias explícito
});

Rol.hasMany(Usuario, { 
    foreignKey: 'RolId',
    sourceKey: 'IdRol',
    as: 'Usuarios'  // Alias explícito
});

Curso.belongsTo(Usuario, { as: 'Profesor', foreignKey: 'ProfesorId' });
Usuario.hasMany(Curso, { as: 'CursosImpartidos', foreignKey: 'ProfesorId' });

SolicitudCurso.belongsTo(Curso, { 
    foreignKey: { 
        name: 'CursoId',
        allowNull: false
    }, 
    onDelete: 'CASCADE' 
});
Curso.hasMany(SolicitudCurso, { 
    foreignKey: { 
        name: 'CursoId',
        allowNull: false
    }, 
    onDelete: 'CASCADE' 
});

SolicitudCurso.belongsTo(Usuario, { 
    as: 'Alumno', 
    foreignKey: 'AlumnoId' 
});
Usuario.hasMany(SolicitudCurso, { 
    as: 'SolicitudesCurso', 
    foreignKey: 'AlumnoId' 
});

MaterialCurso.belongsTo(Curso, { 
    foreignKey: { 
        name: 'CursoId',
        allowNull: false
    }, 
    onDelete: 'CASCADE' 
});
Curso.hasMany(MaterialCurso, { 
    foreignKey: { 
        name: 'CursoId',
        allowNull: false
    }, 
    onDelete: 'CASCADE' 
});

// Exportar los modelos
module.exports = {
    sequelize,
    Rol,
    Usuario,
    Curso,
    SolicitudCurso,
    MaterialCurso
};
