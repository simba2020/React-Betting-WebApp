import { useMediaQuery } from 'react-responsive'

export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 })

  return isMobile ? children : null
}