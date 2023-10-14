import axios from 'axios'
import { StatusEnum } from '../participants/types/Participant'
import { InterviewCriteriaObject } from '../participants/types/InterviewNotes'
export const fetchApplicants = async (token: string) => {
  try {
    const response = await axios.get(
      'https://semicolon-backend.onrender.com/applicant',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data.data
  } catch (e) {
    console.error(e)
    return []
  }
}
export const fetchCommittees = async (token: string) => {
  try {
    const response = await axios.get(
      'https://semicolon-backend.onrender.com/committee',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data.data.map((committee: any) => committee.title)
  } catch (e) {
    console.error(e)
    return []
  }
}
export const updateStatus = async (
  status: StatusEnum,
  id: string,
  token: string
) => {
  try {
    await axios.patch(
      `https://semicolon-backend.onrender.com/applicant/${id}`,
      { acceptanceStatus: status },
      { headers: { Authorization: 'Berar ' + token } }
    )
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
export const saveApplicantNotes = async ({
  id,
  interviewData,
  token,
}: {
  id: string
  interviewData: InterviewCriteriaObject
  token: string
}) => {
  try {
    const response = await axios.patch(
      `https://semicolon-backend.onrender.com/applicant/interview/note`,
      { note: interviewData, _id: id },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    return response.data.data.InterviewerNote
  } catch (e) {
    console.error(e)
    return false
  }
}
