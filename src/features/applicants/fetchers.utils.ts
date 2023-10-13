import axios from 'axios'
import { StatusEnum } from '../participants/types/Participant'
export const fetchApplicants = async () => {
  try {
    const response = await axios.get(
      'https://semicolon-backend.onrender.com/applicant'
    )
    return response.data.data
  } catch (e) {
    console.error(e)
    return []
  }
}
export const fetchCommittees = async () => {
  try {
    const response = await axios.get(
      'https://semicolon-backend.onrender.com/committee'
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
