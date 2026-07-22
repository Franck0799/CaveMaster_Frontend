/** Aligné sur CaveMaster1_Backend.Service.Dtos.Identity.UserDto */
export interface UserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  isEnabled: boolean;
  roles: string[];
  workingHours: number;
  isPartTime: boolean;
  hireDate?: string;
  gender?: string;
  contractType?: string;
  numberOfChildren?: number;
  maritalStatus?: string;
  residence?: string;
  postalAddress?: string;
  photoUrl?: string;
  photoId?: string;
  avatar?: string;
  caveId?: string;
}

/** Aligné sur CaveMaster1_Backend.Service.Dtos.Identity.CreateUserRequest */
export interface CreateUserRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roles: string[];
  workingHours: number;
  isPartTime: boolean;
  hireDate?: string;
  gender?: string;
  contractType?: string;
  numberOfChildren?: number;
  maritalStatus?: string;
  residence?: string;
  postalAddress?: string;
  caveId?: string;
}
