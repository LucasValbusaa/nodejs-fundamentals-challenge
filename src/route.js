import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { Validation } from "./validations/validation.js"
import { formattedError } from "./utils/format-error.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: async (req, res) => {
            try {        
                await Validation.validate(['title', 'description'], req.body)
                
                const { title, description } = req.body
            
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    created_at: new Date(),
                    update_at: new Date(),
                    completed_at: null 
                }

                database.insert('tasks', task)

                return res.writeHead(201).end()
            } catch (error) {
                return res.writeHead(400).end(JSON.stringify(formattedError(error, 400)))
            }

        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params   
            const data = req.body

            try {
                database.update('tasks', id, data)    
                return res.writeHead(200).end()
            } catch (error) {
                return res.writeHead(404).end(JSON.stringify(formattedError(error, 404)))   
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params   

            try {
                database.delete('tasks', id)    
                return res.writeHead(204).end()
            } catch (error) {
                return res.writeHead(404).end(JSON.stringify(formattedError(error, 404)))   
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params   

            console.log(id)

            try {
                database.completed('tasks', id)    
                return res.writeHead(204).end()
            } catch (error) {
                return res.writeHead(404).end(JSON.stringify(formattedError(error, 404)))   
            }
        }
    },
  
]