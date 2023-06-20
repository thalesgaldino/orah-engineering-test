import React, {useEffect} from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ActivityListTile } from "staff-app/components/activity-list-tile/activity-list-tile.component"
import { Person } from "shared/models/person"

export const ActivityPage: React.FC = () => {
  
  const [getActivities, activityData, activityLoadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [getStudents, studentsData, studentLoadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])
  
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  return (
    <>
      <S.PageContainer>
        <h1>Activity Page</h1>
        
        {activityLoadState === "loading" && studentLoadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {activityLoadState === "loaded" && studentLoadState === "loaded" && activityData && studentsData && (
          <>
            {activityData?.activity?.map((record, index) => {
              return <ActivityListTile key={`activity-${index}`} 
                date={record.date} 
                name={record.entity.name}
                student_roll_states={record.entity.student_roll_states}
                students={studentsData.students}
              />
            })}
          </>
        )}

        {(activityLoadState === "error" || studentLoadState === "error") && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}

      </S.PageContainer>
    </>
  );
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
