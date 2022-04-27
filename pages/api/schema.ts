import { IResolvers } from '@graphql-tools/utils'
import { ApolloError, gql } from 'apollo-server-core'
// import { ApolloException } from 'apollo-server-micro'
import mysqlServer from 'serverless-mysql'
import db from '../../lib/db'
import { OkPacket, MysqlError } from 'mysql'
import { ITask, ITaskResponse } from '../../lib/types'

export const typeDefs = gql`
 enum TaskStatus {
  active
  complete
 }
 type Task {
  id: Int!
  title: String!
  status: TaskStatus!
 }
 input TaskInput {
  title: String!
  status: TaskStatus!
 }

 input UpdateTaskInput {
  id: Int
  title: String!
  status: TaskStatus!
 }
 type Query {
  hello: String!
  task(id: Int): Task
  tasks(status: TaskStatus): [Task!]
 }
 type Mutation {
  createTask(input: TaskInput!): Task
  updateTask(input: UpdateTaskInput): Task
  deleteTask(id: Int!): Task
  deleteAllTask: Int!
 }
`
enum taskStatus {
 active = 'active',
 complete = 'complete',
}
interface ApolloContext {
 db: mysqlServer.ServerlessMysql
}
export const resolvers: IResolvers<any, ApolloContext> = {
 Query: {
  hello(parents, args, context) {
   return 'welcome to our api...'
  },
  async task(parents, args, context): Promise<ITask> {
   try {
    const task = await db.query<ITask[]>('select * from Task where id=?', [
     args.id,
    ])
    await db.end()
    return task['0']
   } catch (error) {
    throw error
   }
  },
  async tasks(parents, args, context): Promise<ITask[]> {
   const { status } = args
   try {
    let qry = 'select * from Task'
    if (status) qry += ' where status=?'
    else qry += ' order by id desc'
    const tasks = await db.query<ITask[]>(qry, [status])
    console.log('tasks here:', tasks)
    await db.end()
    return tasks
   } catch (error) {
    throw error
   }
  },
 },
 Mutation: {
  async createTask(
   parent,
   args: { input: { title: string; status: taskStatus } },
   context
  ): Promise<ITask> {
   try {
    const { input } = args
    const result = await db.query<OkPacket>('insert into Task set ?', [input])
    await db.end()
    return {
     id: result.insertId,
     title: input.title,
     status: input.status,
    }
   } catch (error) {
    throw error
   }
  },
  async updateTask(parent, args, context): Promise<ITask> {
   try {
    const { input } = args
    const result = await db.query<OkPacket>(
     'update Task set title=?,status=? where id=?',
     [input.title, input.status, input.id]
    )
    return input
   } catch (error) {
    throw error
   }
  },
  async deleteTask(parent, args, context): Promise<number> {
   try {
    const result = await db.query<OkPacket>('delete from Task where id=?', [
     args.input.id,
    ])

    return result.changedRows
   } catch (error) {
    throw error
   }
  },
  async deleteAllTask(parents, args, context): Promise<number> {
   const result = await db.query<OkPacket>('delete from Task')
   return result.affectedRows
  },
 },
}
