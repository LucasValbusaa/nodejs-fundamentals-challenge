import fs from 'node:fs/promises'
import { NotFoundError } from './errors/not-found.error.js'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    #getIndex(table, id) {
        return this.#database[table].findIndex(row => row.id === id)
    }

    select(table) {
        const data = this.#database[table] ?? []
        return data
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        }else {
            this.#database[table] = [data]
        }   
        
        this.#persist()

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#getIndex(table,id)
        if(rowIndex > -1) {
            const task = this.#database[table][rowIndex]
 
            const taskPayload = {
                ...task,
                id,
                title: data.title ?? task.title,
                description: data.description ?? task.description,
            }

            this.#database[table][rowIndex] = taskPayload
            this.#persist()
            return
        }

       throw new NotFoundError('Task Not Found') 
    }

    delete(table, id){
        const rowIndex = this.#getIndex(table, id)
        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
            return
        }

       throw new NotFoundError('Task Not Found') 
    }

    completed(table, id) {
        const rowIndex = this.#getIndex(table, id)
        
        if(rowIndex > -1) {
            const task = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {...task, completed_at: task.completed_at ? null : new Date() }
            this.#persist()
            return
        }

       throw new NotFoundError('Task Not Found') 
    }
}