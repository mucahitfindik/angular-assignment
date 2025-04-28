// src/app/models/user.model.ts
export interface Skill {
    id: number;
    text: string;
}

export interface UserBackend {
    first_name: string;
    last_name: string;
    age: number | null;
    email: string;
    skills: Skill[];
  }
  
  export interface User extends UserBackend {
    full_name: string;
  }
  