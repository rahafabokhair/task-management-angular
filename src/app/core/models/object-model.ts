////////////////////////////////////////////////////////////////////////////////////////////
// public projects: Project[],
// public tasks: Task[],
export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public mobNumber: string,
    public gender: string,
    public role: string,
    public age: string,
    public image: string,
    public id?: number
  ) {}
}

export class Project {
  constructor(
    public name: string,
    public users: number[],
    public id?: number,
    public description?: string
  ) {}
}

export class Status {
  constructor(public name: string, public id?: number) {}
}

export class Task {
  constructor(
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public status: Status,
    public projectid: number,
    public assignedUsers: number[],
    public checkCompleted:boolean,
    public id?: number,
    public description?: string
  ) {}
}




// export class userProject {
//   constructor(public userId: number, public projectId: number) {}
// }

// export class userTask {
//   constructor(public userId: number, public taskId: number) {}
// }

///////////////////////////////////////////////////chatGPT
// export interface Task {
//   id: number;
//   name: string;
//   description: string;
//   assignedUsers: User[];
// }

// export interface User {
//   id: number;
//   name: string;
// }

// export interface Project {
//   id: number;
//   name: string;
//   description: string;
//   tasks: Task[];
// }
