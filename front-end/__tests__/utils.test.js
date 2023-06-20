import { sortStudents, doSearch } from "src/staff-app/utils"
import { generateStudents } from "src/shared/helpers/data-generation"

test("should sort ascending", () => {
  
  const students = [
    {first_name: "Lee", last_name: "Paul"},
    {first_name: "Jeff", last_name: "Ducan"}
    ]
  expect(sortStudents(students, false, "asc")).toStrictEqual([
    {first_name: "Jeff", last_name: "Ducan"},
    {first_name: "Lee", last_name: "Paul"}
    ]);

})

test("should sort descending", () => {
  
  const students = [
    {first_name: "Jeff", last_name: "Ducan"},
    {first_name: "Lee", last_name: "Paul"}
    ]
  expect(sortStudents(students, false, "desc")).toStrictEqual([
    {first_name: "Lee", last_name: "Paul"},
    {first_name: "Jeff", last_name: "Ducan"}
    ]);

})

test("search for student", () => {

  let students = generateStudents(10)

  expect(doSearch(students, "jeff")).toStrictEqual([]);
  students = [
    {first_name: "Jeff", last_name: "Ducan"},
    {first_name: "Lee", last_name: "Paul"}
    ]
  expect(doSearch(students, "jeff")).toStrictEqual([
    {first_name: "Jeff", last_name: "Ducan"}
  ]);

})