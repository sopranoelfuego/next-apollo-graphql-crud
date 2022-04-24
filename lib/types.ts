export interface ITask {
 id: number
 title: string
 content: string
}

export interface ITaskResponse {
 success: boolean
 data: ITask[]
}
