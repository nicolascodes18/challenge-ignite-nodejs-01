import { randomUUID } from 'crypto';
import { Database } from './database.js';
import { routePathBuild } from './utils/routePathBuild.js';

/**
 * POST => Criar uma task
 * GET => Listar todas as tasks
 * PUT => Atualizar uma task
 * DELETE => Deletar uma task
 * PATCH => Marcar uma task como concluída
 */

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: routePathBuild('/tasks'),
    handler: async (req, res) => {
      const { search } = req.query;
      console.log(search);

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      );

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: routePathBuild('/tasks'),
    handler: async (req, res) => {
      try {
        const { title, description } = req.body;

        const tasks = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: Date.now(),
          update_at: Date.now(),
        };

        database.insert('tasks', tasks);

        return res.writeHead(201).end('Tarefa criada com sucesso!');
      } catch (error) {
        return res.writeHead(404).end(`Erro ao criar a tarefa: ${error}`);
      }
    },
  },
  {
    method: 'PUT',
    path: routePathBuild('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.update('tasks', id, {
        title,
        description,
        update_at: Date.now(),
      });

      return res.writeHead(204).end('Tarefa atualizada com sucesso!');
    },
  },
  {
    method: 'PATCH',
    path: routePathBuild('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      database.update('tasks', id);

      return res.writeHead(200).end('Tarefa concluída com sucesso!');
    },
  },
  {
    method: 'DELETE',
    path: routePathBuild('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(200).end('Tarefa deletada com sucesso!');
    },
  },
];
