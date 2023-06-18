import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faSort } from '@fortawesome/free-solid-svg-icons'
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { orderBy, filter } from "lodash";
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

type Data = { students: Person[] };

const sortStudents = (students: Person[], switchLastName: boolean, mode: "desc" | "asc") => {
  const target = switchLastName ? 'last_name' : 'first_name';
  const secondaryTarget = switchLastName ? 'first_name' : 'last_name';
  return orderBy(students, [target, secondaryTarget], mode);
}

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<Data>({ url: "get-homeboard-students" })
  const { students: studentsData } = data || {};
  
  const [students, setStudents] = useState<never[] | Person[] | undefined>(undefined);
  if (studentsData && studentsData.length > 0 && !students){
    setStudents(studentsData);
  }
  const [ascOrder, setAscOrder] = useState(false);
  const [switchLastName, setSwitchLastName] = useState(false);
  const [searchModeOn, setSearchModeOn] = useState(false);

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort"){
      if (!ascOrder){
        setStudents(sortStudents(students, switchLastName, 'asc'));
        setAscOrder(true);
      }else {
        setStudents(sortStudents(students, switchLastName, 'desc'));
        setAscOrder(false);
      }
    }
    if (action === "switch"){
      setSwitchLastName(!switchLastName)
    }
    if (action === "searchModeOn"){
      setSearchModeOn(true)
    }
    if (action === "searchModeOff"){
      setSearchModeOn(false)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const onSearch = (query: string) => {
    if (query === ""){
      setStudents(studentsData);
    }
    const result = filter(students, (student) => {
      const firstNamelc = student.first_name.toLowerCase();
      const lastNamelc = student.last_name.toLowerCase();
      return firstNamelc.indexOf(query.toLowerCase()) !== -1;
    });
    setStudents(result);
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction} 
          switchLastName={switchLastName}
          searchModeOn={searchModeOn}
          onSearch={onSearch}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && students && (
          <>
            {students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "switch" | "searchModeOn" | "searchModeOff"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  switchLastName: boolean
  searchModeOn: boolean
  onSearch: Function
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, switchLastName, searchModeOn, onSearch } = props
  return (
    <S.ToolbarContainer>
      <S.SortWrapper>
        <S.RightIcon onClick={() => onItemClick("sort")} >
          <FontAwesomeIcon icon={faSort} />
        </S.RightIcon>
        <S.SortAction onClick={() => onItemClick("sort")}>{switchLastName? "Last Name" : "First Name"}</S.SortAction>
        <S.LeftIcon onClick={() => onItemClick("switch")} >
          <FontAwesomeIcon icon={faRotate} />
        </S.LeftIcon>
      </S.SortWrapper>
      {searchModeOn ?
        <div>
          <input
            type="search"
            id="dcsearch"
            name="dcsearch"
            onChange={(param) => onSearch(param.currentTarget.value)}
            placeholder="Search...">
          </input>
        </div> : 
        <div onClick={() => onItemClick("searchModeOn")}>Search</div>
      }
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SortWrapper: styled.div`
    display: flex
  `,
  SortAction: styled.div`
    cursor: pointer;
  `,
  LeftIcon: styled.div`
    width: 15px;
    height: 15px;
    cursor: pointer;
    color: #fff;
    margin-left:6px;
  `,
  RightIcon: styled.div`
    width: 15px;
    height: 15px;
    cursor: pointer;
    color: #fff;
  `,
}
