// Author : Shital Gayakwad
// Created Date : 27 May 2023
// Description : ERPX_PPC ->user controller
const express = require('express');
const { varifyToken } = require('../../Middlewares/varify_auth_token');
const { tryCatch } = require('../../Utils/ErrorHandling/tryCatch');
const { errorHandler } = require('../../Middlewares/error_handler');
const AppError = require('../../Utils/ErrorHandling/appErrors');
const { authorizeToken } = require('../../Middlewares/generate_auth_token');
const userRouter = express.Router();
const properties = require('properties');
const { queryPath } = require('../../Utils/Constants/query.path');
const { selectQuery, insertQuery, insertMultipleRecords, updateQuery, deleteQuery } = require('../../Utils/file_read');
const { NOT_FOUND } = require('../../Utils/Constants/errorCodes');
const { query } = require('express');

userRouter.get('/employee-fullname', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[3].HR_EMPLOYEE, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.empFullName.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/create-user-credentials', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.username == undefined) {
            throw new AppError(NOT_FOUND, 'Username not found', 404);
        } else if (req.body.password == undefined) {
            throw new AppError(NOT_FOUND, 'Password not found', 404);
        } else if (req.body.mobileno == undefined) {
            throw new AppError(NOT_FOUND, 'Mobile not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerUserCredentials.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{username}/gim, req.body.username.trim());
                query = query.replace(/{password}/gim, req.body.password.trim());
                query = query.replace(/{mobile}/gim, req.body.mobileno.trim());
                insertQuery(query, resp);
            });
        }
    }
}));

userRouter.get('/employee-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allroles.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/register-emp-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not fonud', 404);
        } else if (req.body.role == undefined) {
            throw new AppError(NOT_FOUND, 'Role not fonud', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerRole.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{rolename}/gim, req.body.role.trim());
                query = query.replace(/{caption}/gim, req.body.role.trim());
                insertQuery(query, resp);
            });
        }

    }
}));

userRouter.get('/user', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allusers.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/assign-user-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.userid == undefined) {
            throw new AppError(NOT_FOUND, 'User id not found', 404);
        } else if (req.body.roleid == undefined) {
            throw new AppError(NOT_FOUND, 'Role id not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.assignRoleToUserQuery.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{user_id}/gim, req.body.userid.trim());
                query = query.replace(/{role_id}/gim, req.body.roleid.trim());
                insertQuery(query, resp);
            });
        }
    }
}));

userRouter.post('/register-program', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.programname == undefined) {
            throw new AppError(NOT_FOUND, 'Program name not found', 404);
        } else if (req.body.schemaname == undefined) {
            throw new AppError(NOT_FOUND, 'Schema name not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerPrograms.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{programname}/gim, req.body.programname.trim());
                query = query.replace(/{caption}/gim, req.body.programname.trim());
                query = query.replace(/{schemaname}/gim, req.body.schemaname.trim());
                insertQuery(query, resp);
            });
        }
    }
}));

userRouter.get('/all-programs', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allPrograms.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.get('/all-folders', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.allFolders.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/register-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.foldername == undefined) {
            throw new AppError(NOT_FOUND, 'Program name not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.registerFolder.replace(/\n/g, ' ');
                query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                query = query.replace(/{foldername}/gim, req.body.foldername.trim());
                query = query.replace(/{caption}/gim, req.body.foldername.trim());
                insertQuery(query, resp);
            });
        }
    }
}));

userRouter.get('/programs-in-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.programsInFolder.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/add-programs-in-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.folderid == undefined) {
            throw new AppError(NOT_FOUND, 'Folder id not found', 404);
        } else if (req.body.programs == undefined) {
            throw new AppError(NOT_FOUND, 'Programs not found', 404);
        } else {
            const ids = req.body.programs.map(program => program.id);
            ids.forEach(async (id) => {
                properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                    if (error) {
                        throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.addPrograminFolder.replace(/\n/g, ' ');
                    query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                    query = query.replace(/{folder_id}/gim, req.body.folderid.trim());
                    query = query.replace(/{program_id}/gim, id.trim());
                    insertMultipleRecords(query);
                });
            });
            resp.send('Inserted successfully');
        }
    }
}));

userRouter.get('/programs-assigned-to-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.programsAssignedToRole.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.get('/programs-not-in-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.programsNotInFolder.replace(/\n/g, ' ');
            selectQuery(query, resp);
        });
    }
}));

userRouter.post('/assign-programs-to-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.createdby == undefined) {
            throw new AppError(NOT_FOUND, 'Created by not found', 404);
        } else if (req.body.roleid == undefined) {
            throw new AppError(NOT_FOUND, 'Role id not found', 404);
        } else if (req.body.programs == undefined) {
            throw new AppError(NOT_FOUND, 'Programs not found', 404);
        } else {
            const ids = req.body.programs.map(program => program.id);
            ids.forEach(async (id) => {
                properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                    if (error) {
                        throw new AppError(NOT_FOUND, error, 404);
                    }
                    var query = data.assignProgramsToRole.replace(/\n/g, ' ');
                    query = query.replace(/{createdby}/gim, req.body.createdby.trim());
                    query = query.replace(/{role_id}/gim, req.body.roleid.trim());
                    query = query.replace(/{program_id}/gim, id.trim());
                    insertMultipleRecords(query);
                });
            });
            resp.send(`Inserted successfully`);
        }
    }
}));

userRouter.post('/validate-user', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.username == undefined) {
            throw new AppError(NOT_FOUND, 'Username not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.validateUser.replace(/\n/g, ' ');
                query = query.replace(/{username}/gim, req.body.username.trim());
                selectQuery(query, resp);
            });
        }
    }
}));

userRouter.post('/validate-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.rolename == undefined) {
            throw new AppError(NOT_FOUND, 'Rolename not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.validateRoleIsAlreadyRegistered.replace(/\n/g, ' ');
                query = query.replace(/{rolename}/gim, req.body.rolename.trim());
                selectQuery(query, resp);
            });
        }
    }
}));

userRouter.post('/validate-assigned-role-to-user', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.userid == undefined) {
            throw new AppError(NOT_FOUND, 'Rolename not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.validateIfUserAlreadyAssignedRole.replace(/\n/g, ' ');
                query = query.replace(/{user_id}/gim, req.body.userid.trim());
                selectQuery(query, resp);
            });
        }
    }
}));

userRouter.post('/validate-program-registration', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.programname == undefined) {
            throw new AppError(NOT_FOUND, 'Program name not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.validateProgramRegistration.replace(/\n/g, ' ');
                query = query.replace(/{programname}/gim, req.body.programname.trim());
                selectQuery(query, resp);
            });
        }
    }
}));

userRouter.post('/validate-folder-registration', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        if (req.body.foldername == undefined) {
            throw new AppError(NOT_FOUND, 'Folder name not found', 404);
        } else {
            properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
                if (error) {
                    throw new AppError(NOT_FOUND, error, 404);
                }
                var query = data.validateFolder.replace(/\n/g, ' ');
                query = query.replace(/{foldername}/gim, req.body.foldername.trim());
                selectQuery(query, resp);
            });
        }
    }
}));

userRouter.get('/user-designation', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[14].COMMON, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.userDesignation.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.query.id.trim());
            selectQuery(query, resp);
        });
    }
}));

// Programs assigned to users
userRouter.get('/program-access-management-data', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            selectQuery(data.programAccessManagementData, resp);
        });
    }
}));

// Delete user from role 
userRouter.delete('/delete-user-from-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteUserFromRole.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            updateQuery(query, resp);
        });
    }
}));

// Delete program which is assigned to the role
userRouter.delete('/delete-program-assigned-to-the-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteProgramAssignedToRole.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            updateQuery(query, resp);
        });
    }
}));

// Delete role
userRouter.delete('/delete-role', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteRole.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

// Delete program
userRouter.delete('/delete-program', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteProgram.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

// Delete folder
userRouter.delete('/delete-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteFolder.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));

// Delete programs in folder
userRouter.delete('/delete-programs-in-folder', varifyToken, tryCatch(async (req, resp) => {
    const userData = authorizeToken(req.token);
    if (userData) {
        properties.parse(queryPath[16].ALL_ACL, { path: true }, function (error, data) {
            if (error) {
                throw new AppError(NOT_FOUND, error, 404);
            }
            var query = data.deleteProgramsInFolder.replace(/\n/g, ' ');
            query = query.replace(/{id}/gim, req.body.id);
            deleteQuery(query, resp);
        });
    }
}));


const defaultuserRouter = [
    errorHandler, tryCatch, AppError, varifyToken
];

defaultuserRouter.forEach((router) => {
    userRouter.use(router);
});

module.exports = {
    userRouter
}