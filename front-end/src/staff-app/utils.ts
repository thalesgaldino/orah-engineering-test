import { filter, orderBy } from "lodash";
import { Person } from "shared/models/person";
import { RolllStateType } from "shared/models/roll";


export type PayloadGetStudentsType = { students: Person[] };

//similar tipe as RollInput
export interface RollStateDict {
  [idx: number]: RolllStateType
}

export const sortStudents = (students: Person[], flipLastName: boolean, mode: "desc" | "asc") => {
  const target = flipLastName ? 'last_name' : 'first_name';
  const secondaryTarget = flipLastName ? 'first_name' : 'last_name';
  return orderBy(students, [target, secondaryTarget], mode);
}

export const doSearch: (data: Person[] | undefined, query: string) => Person[] | undefined = (data: Person[] | undefined, query: string) => {
  if (!data) return;
  return filter(data, (student) => {
    const firstNamelc = student.first_name.toLowerCase();
    const lastNamelc = student.last_name.toLowerCase();
    const fullNamelc = `${firstNamelc} ${lastNamelc}`
    return firstNamelc.indexOf(query.toLowerCase()) !== -1
            || lastNamelc.indexOf(query.toLowerCase()) !== -1
            || fullNamelc.indexOf(query.toLowerCase()) !== -1;
  });
}