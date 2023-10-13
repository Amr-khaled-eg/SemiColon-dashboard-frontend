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
import { useAppSelector } from '../../app/typings'
import { selectAuth } from '../auth/authSlice'
import useApplicants from './applicants.hooks'
import { updateStatus } from './fetchers.utils'
const ApplicantsRoute = () => {
  const {
    filteredData,
    search,
    setSearch,
    committees,
    setCommittee,
    setStatus,
    originalData,
  } = useApplicants()
  const [chosenApplicant, setChosenApplicant] = useState<any>()
  const { token } = useAppSelector(selectAuth)
  const statusChangeHandler = async (status: StatusEnum) => {
    const successed = await updateStatus(status, chosenApplicant?._id, token)
    if (!successed) {
      alert('Something went wrong')
      return
    }
    setChosenApplicant({ ...chosenApplicant, acceptanceStatus: status })
    originalData.current = originalData.current.map((item) =>
      item._id === chosenApplicant?._id
        ? { ...item, acceptanceStatus: status }
        : item
    )
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
