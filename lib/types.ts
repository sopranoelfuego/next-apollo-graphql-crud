export interface ITask {
 id: number
 title: string
 status: string
}

export interface ITaskResponse {
 success: boolean
 data: ITask[]
}
