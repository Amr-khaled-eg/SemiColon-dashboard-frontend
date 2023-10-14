import { useState, useEffect, useRef } from 'react'
import { fetchApplicants, fetchCommittees } from './fetchers.utils'
import { useAppSelector } from '../../app/typings'
import { selectAuth } from '../auth/authSlice'
const useApplicants = () => {
  const [search, setSearch] = useState<string>('')
  const [committees, setCommittees] = useState<string[]>([])
  const originalData = useRef<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [committee, setCommittee] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')
  const { token } = useAppSelector(selectAuth)

  useEffect(() => {
    if (!token) return
    const initialize = async (token: string) => {
      const applicantsData = await fetchApplicants(token)
      setFilteredData(applicantsData)
      originalData.current = applicantsData
      const committeesData = await fetchCommittees(token)
      setCommittees(committeesData)
    }
    initialize(token)
  }, [token])
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
  return {
    filteredData,
    search,
    setSearch,
    committees,
    setCommittee,
    setStatus,
    originalData,
  }
}
export default useApplicants
