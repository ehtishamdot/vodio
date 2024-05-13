
export type userType={
 userCopy:{
   id:string;
   username:string;
   email:string;
   isVerified:boolean;
   createdAt:string;
   updatedAt:string;
 }
 accessToken:string;
}
export type signupResponse={
    id:string;
    username:string;
    email:string;
    isVerified:boolean;
    createdAt:string;
    updatedAt:string;
}


type doctorSpecialtyType = {
  id: string;
  name: string;
  diseases: Disease[];
  generalPhases: Phase[];
  countryAndLanguage: string;
  addedByUser: userType;
  addedByUserId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type fetchAllSpecialtyApiResponse=doctorSpecialtyType[];
