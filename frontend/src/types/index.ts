export type User={username:string;role:'Admin'|'Project Manager'|'HR Manager'|'Employee';employee_id?:number;demo?:boolean};
export type ManagedUser={id:number;full_name:string;username:string;role:User['role'];status:'Active'|'Inactive';created_at:string;updated_at:string};
export type ApiData=Record<string, any>;
