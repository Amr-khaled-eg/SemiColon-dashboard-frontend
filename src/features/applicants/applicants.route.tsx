import { useEffect, useRef, useState } from 'react'
import classes from '../participants/Participants/AllPars.module.css'
import participantClasses from '../participants/Participants/Participants.module.css'
import detailsClasses from '../participants/Participants/ParDetails.module.css'
import InputBar from '../../common/components/InputBar/InputBar'
import DropDown from '../../common/components/DropDown/DropDown'
import { StatusEnum } from '../participants/types/Participant'
import ParItem from '../participants/Participants/ParItem'
import Card from '../../common/components/Card/Card'
import Button from '../../common/components/Button/Button'
import InterviewNotesUI from '../participants/Participants/InterviewNotesUI'
import axios from 'axios'
import { useAppSelector } from '../../app/typings'
import { selectAuth } from '../auth/authSlice'

const ApplicantsRoute = () => {
  const [search, setSearch] = useState<string>('')
  const [committees, setCommittees] = useState<string[]>([])
  const originalData = useRef<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [chosenApplicant, setChosenApplicant] = useState<any>()
  const [committee, setCommittee] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')
  const { token } = useAppSelector(selectAuth)
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          'https://semicolon-backend.onrender.com/applicant'
        )
        setFilteredData(response.data.data)
        originalData.current = response.data.data
      } catch (e) {}
    }
    const fetchCommittees = async () => {
      try {
        const response = await axios.get(
          'https://semicolon-backend.onrender.com/committee'
        )
        setCommittees(response.data.data.map((item: any) => item.title))
      } catch (e) {}
    }
    fetchApplicants()
    fetchCommittees()
  }, [])
  useEffect(() => {
    let temp = originalData.current
    if (search) {
      temp = temp.filter((item) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.toLowerCase().includes(search.toLowerCase())
        )
      })
    }
    if (committee !== 'All') {
      temp = temp.filter((item) => {
        return item.first_preference === committee
      })
    }
    if (status !== 'All') {
      temp = temp.filter((item) => {
        return item.acceptanceStatus === status
      })
    }
    setFilteredData(temp)
  }, [search, committee, status])
  const statusChangeHandler = async (status: StatusEnum) => {
    try {
      await axios.patch(
        `https://semicolon-backend.onrender.com/applicant/${chosenApplicant?._id}`,
        { acceptanceStatus: status },
        { headers: { Authorization: 'Berar ' + token } }
      )
      setChosenApplicant({ ...chosenApplicant, acceptanceStatus: status })
      originalData.current = originalData.current.map((item) =>
        item._id === chosenApplicant?._id
          ? { ...item, acceptanceStatus: status }
          : item
      )
    } catch (e) {}
  }
  return (
    <Card className={participantClasses['par-container']}>
      <div className={classes['all-pars']}>
        <div>
          <div className={classes['sidebar-header']}>
            <InputBar
              type="text"
              placeholder="Phone or Name"
              onChange={(value) => setSearch(value)}
              value={search}
            />
            <DropDown
              choices={['All', ...committees]}
              onChange={(value) => setCommittee(value)}
            />
            <DropDown
              choices={['All', ...Object.values(StatusEnum)]}
              onChange={(value) => setStatus(value)}
            />
            <p className={classes['total']}>
              Total: {filteredData.length} Participant
            </p>
          </div>
          {filteredData.map((item) => (
            <ParItem
              key={item._id}
              name={item.name}
              onChoose={() => setChosenApplicant(item)}
              chosen={chosenApplicant?._id === item._id}
            />
          ))}
        </div>
      </div>
      {chosenApplicant && (
        <div className={detailsClasses.parContainer}>
          <div className={detailsClasses.details}>
            <h2>{chosenApplicant?.name}</h2>
            <div className={detailsClasses.parData}>
              <p>
                <span className={detailsClasses.bold}>Email: </span>
                {chosenApplicant?.email}
              </p>

              <p>
                <span className={detailsClasses.bold}>Phone: </span>
                {chosenApplicant?.phone}
              </p>
              <p>
                <span className={detailsClasses.bold}>Academic Year: </span>
                {chosenApplicant?.academic_year}
              </p>
              <p>
                <span className={detailsClasses.bold}>First Preference: </span>
                {chosenApplicant?.first_preference}
              </p>
              <p>
                <span className={detailsClasses.bold}>Reason: </span>
                {chosenApplicant?.first_preference_reason}
              </p>
              <p>
                <span className={detailsClasses.bold}>Second Preference: </span>
                {chosenApplicant?.second_preference}
              </p>
              <p>
                <span className={detailsClasses.bold}>Reason: </span>
                {chosenApplicant?.second_preference_reason}
              </p>

              <p>
                <span className={detailsClasses.bold}>Past Experiences: </span>
                {chosenApplicant?.previousExperience}
              </p>
            </div>
            <div className={detailsClasses.status}>
              {chosenApplicant?.acceptanceStatus && (
                <p
                  className={`${detailsClasses.pending} ${
                    detailsClasses[chosenApplicant?.acceptanceStatus]
                  }`}
                >
                  {chosenApplicant?.acceptanceStatus}
                </p>
              )}
            </div>
          </div>
          <hr className={detailsClasses.line}></hr>
          <InterviewNotesUI
            data={chosenApplicant?.InterviewerNote}
            _id={chosenApplicant?._id}
            link="'https://semicolon-registration-backend.onrender.com/participants/interview/note'"
          />
          <hr className={detailsClasses.line}></hr>
          <div className={detailsClasses.buttons}>
            <Button
              onClick={() => statusChangeHandler(StatusEnum.FILTERED)}
              className={detailsClasses.rejectBtn}
            >
              Filter
            </Button>
            <Button
              onClick={() => statusChangeHandler(StatusEnum.EMAILED)}
              className={detailsClasses.passiveBtn}
            >
              Emailed
            </Button>
            <Button
              onClick={() => statusChangeHandler(StatusEnum.SCHEDULED)}
              className={detailsClasses.passiveBtn}
            >
              Scheduled
            </Button>
            <Button
              onClick={() => statusChangeHandler(StatusEnum.ACCEPTED)}
              className={detailsClasses.acceptBtn}
            >
              Accept
            </Button>
            <Button
              onClick={() => statusChangeHandler(StatusEnum.REJECTED)}
              className={detailsClasses.rejectBtn}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
export default ApplicantsRoute
