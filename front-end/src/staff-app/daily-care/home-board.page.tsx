import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { useNavigate } from "react-router-dom";
import { StudentListTile, StateChangeParamType } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { PayloadGetStudentsType, RollStateDict, doSearch, sortStudents } from "staff-app/utils"

export const HomeBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<PayloadGetStudentsType>({ url: "get-homeboard-students" })
  
  const [saveRoll] = useApi({ url: "save-roll" })

  const { students: studentsInitialData } = data || {};
  
  const [students, setStudents] = useState<never[] | Person[] | undefined>(undefined);
  
  const [ascOrder, setAscOrder] = useState(false);
  const [flipLastName, setFlipLastName] = useState(false);
  const [searchModeOn, setSearchModeOn] = useState(false);
  
  const [currentQuery, setCurretQuery] = useState("");
  const [rollStates, setRollStates] = useState<RollStateDict>({});
  const [filteredRollState, filterByRollState] = useState<string | undefined>("all");
  
  const [sumRollStates, setSumRollStates] = useState({present: 0, late: 0, absent: 0, unmark: 0});
  
  if (studentsInitialData && studentsInitialData.length > 0 && !students){
    setStudents(studentsInitialData);
    setSumRollStates({...sumRollStates, unmark: studentsInitialData.length })
    filterByRollState("all")
  }

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  type sortType = { 
    ascOrder: boolean
    students: Person[] | never[] | undefined
    flipLastName: boolean
  };

  const actions = {
    sort: ({ ascOrder, students, flipLastName }: sortType) => {
      if (students){
        if (!ascOrder){
          setStudents(sortStudents(students, flipLastName, 'asc'));
          setAscOrder(true);
        }else {
          setStudents(sortStudents(students, flipLastName, 'desc'));
          setAscOrder(false);
        }
      }
    },
    flip: (flipLastName: boolean) => {
      setFlipLastName(!flipLastName)
    },
    roll: () => setIsRollMode(true),
    searchModeOn:() => setSearchModeOn(true),
    searchModeOff:() => setSearchModeOn(false)
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "sort") {
      actions[`${action}`]({ ascOrder, students, flipLastName })
    }
    if (action === "flip"){
      actions[`${action}`](flipLastName)
    }
    if (action === "roll" || action === "searchModeOn" || action === "searchModeOff") {
      actions[`${action}`]();
    }
  }

  const onActiveRollAction = (action: ActiveRollAction, value: string | undefined) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
    if (action === "filter" && value){
      filterByRollState(value)
    }
    if (action === "save") {
      saveRoll({ student_roll_states: rollStates }).then(() => {
        console.log("successfully saved!!!")
        setIsRollMode(false)
        navigate("/staff/activity");
      }).catch((err) => {
        console.log("error!!! ", err)
      });
    }
  }

  const onSearch = (query: string) => {
    if (query === ""){
      setStudents(studentsInitialData);
    }else{
        setStudents(doSearch(studentsInitialData, query));
    }
    setCurretQuery(query)
  }

  const onStateChange: ({ rollType, studentId }: StateChangeParamType) => void = ({ rollType: nextRollType, studentId }) => {
    const prevRollType: RolllStateType = rollStates[studentId] || "unmark"
    setSumRollStates({ ...sumRollStates, [prevRollType]: sumRollStates[prevRollType] - 1, [nextRollType]: sumRollStates[nextRollType] + 1 })
    setRollStates({ ...rollStates, [studentId]: nextRollType })
  }

  return (
    <>
      <S.PageContainer>
        <h1>Daily Care</h1>
        <Toolbar
          onItemClick={onToolbarAction} 
          flipLastName={flipLastName}
          searchModeOn={searchModeOn}
          onSearch={onSearch}
          currentQuery={currentQuery}
          />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && students && (
          <>
            {students.map((s, index) => {
                if (filteredRollState !== "all"){
                  if (rollStates[s.id] === filteredRollState){
                    return <StudentListTile key={`student-${index}`} id={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} initialRollState={rollStates[s.id]}/>
                  }
                }else{
                  return <StudentListTile key={`student-${index}`} id={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} initialRollState={rollStates[s.id]}/>
                }
              }
            )}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay 
        isActive={isRollMode} 
        onItemClick={onActiveRollAction}
        studentQnt={studentsInitialData?.length}
        presentQnt={sumRollStates.present}
        lateQnt={sumRollStates.late}
        absentQnt={sumRollStates.absent}
        />
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "flip" | "searchModeOn" | "searchModeOff"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  flipLastName: boolean
  searchModeOn: boolean
  onSearch: Function
  currentQuery: string
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, flipLastName, searchModeOn, onSearch, currentQuery } = props
  return (
    <S.ToolbarContainer>
      <S.SortWrapper>
        <S.RightIcon onClick={() => onItemClick("sort")} >
          <FontAwesomeIcon icon={"sort"} />
        </S.RightIcon>
        <S.SortAction onClick={() => onItemClick("sort")} data-testid="test-id-flip-label">{flipLastName? "Last Name" : "First Name"}</S.SortAction>
        <S.LeftIcon onClick={() => onItemClick("flip")} data-testid="test-id-flip">
          <FontAwesomeIcon icon={"rotate"} />
        </S.LeftIcon>
      </S.SortWrapper>
      {searchModeOn ?
        <div>
          <input
            type="search"
            id="dcsearch"
            name="dcsearch"
            onChange={(param) => {
              onSearch(param.currentTarget.value);
            }}
            onBlur={() => currentQuery === "" && onItemClick("searchModeOff")}
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
