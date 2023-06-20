import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { RolllStateType } from "shared/models/roll"
import { Person } from "shared/models/person"
import {map} from "lodash";
import { formatRelative, parseISO } from 'date-fns';

interface Props {
  date: Date
  name: string
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
  students: Person[]
}

export const ActivityListTile: React.FC<Props> = (props: Props) => {
  const {
    student_roll_states,
    students,
    date
  } = props
  
  return (
    <S.Container>
      <div>
      <S.Content>
          <>{`Date: ${formatRelative(new Date(parseISO(`${date}`)), new Date())}`}</>
          <ul>
            {map( students, ((student, index) => {
              if (student_roll_states && student_roll_states[student.id])
                return <li key={`keys-${index}`} >{`${student.first_name} ${student.last_name}: ${student_roll_states[student.id]}`}</li>
            }))}
          </ul>
        </S.Content>
      </div>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
}
