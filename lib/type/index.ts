export interface IUser {
    Name:string,
    email:string,
    categories:ICategory[]
}

export interface ICategory {
    Content:string,
    id:number,
    onDone:number,
    list:IList[]
}

export interface IList{
    id:number,
    content:string,
    isDone:boolean
}