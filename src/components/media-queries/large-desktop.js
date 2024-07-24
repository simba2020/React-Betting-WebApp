import { useMediaQuery } from 'react-responsive'

export const LargeDesktop = ({ children }) => {
  const isLargeDesktop = useMediaQuery({ minWidth: 1400 })

  return isLargeDesktop ? children : null
}