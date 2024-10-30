export const RmqCommands = {
  user: {
    create: 'user-create',
    findAll: 'user-find-all',
    checkCredentials: 'user-check-credentials',
    delete: 'user-delete',
  },
  token: {
    verify: 'token-verify',
    create: 'token-create',
  },
  todo: {
    project: {
      create: 'project-create',
      update: 'project-update',
      findAll: 'project-find-all',
      findByTitle: 'project-find-by-title',
      delete: 'project-delete',
    },
    columns: {
      create: 'columns-create',
      update: 'columns-update',
      shift: 'columns-shift',
      findAll: 'columns-find-all',
      delete: 'columns-delete',
    },
    tasks: {
      create: 'tasks-create',
      update: 'tasks-update',
      shift: 'tasks-shift',
      findAll: 'tasks-find-all',
      delete: 'tasks-delete',
    },
  },
};
