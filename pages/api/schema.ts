import { IResolvers } from '@graphql-tools/utils'
import { gql } from 'apollo-server-core'
import { ApolloError } from 'apollo-server-micro'
import mysqlServer from 'serverless-mysql'
import db from '../../lib/db'
import mysql from 'mysql'
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
  id: Int!
  title: String!
  status: TaskStatus!
 }
 type Query {
  hello: String!
  task(id: Int): Task!
  tasks(status: TaskStatus): [Task!]
 }
 type Mutation {
  createTask(input: TaskInput!): Task
  updateTask(input: UpdateTaskInput): Task
  deleteTask(input: Int!): Task
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
  async task(parents, args: { id: number }, context): Promise<ITask[]> {
   const task = await db.query<ITask[]>('select * from Task where id=?', [
    args.id,
   ])
   await db.end()
   return task
  },
  async tasks(
   parents,
   args: { status?: taskStatus },
   context
  ): Promise<ITask[]> {
   const { status } = args
   let qry = 'select * from Task'
   if (status) qry += ' where status=?'
   else qry += ' order by id desc'
   const tasks = await db.query<ITask[]>(qry, [status])
   await db.end()
   return tasks
  },
 },
 Mutation: {
  async createTask(
   parent,
   args: { title: string; status: taskStatus },
   context
  ): Promise<mysql.OkPacket> {
   const { title, status } = args
   const result = await db.query<mysql.OkPacket>('insert into Task set ?', [
    { title, status },
   ])
   console.log('task created insertedId', result.insertId)
   return result
  },
  updateTask(parent, args, context) {
   return null
  },
  deleteTask(parent, args, context) {
   return null
  },
 },
}
