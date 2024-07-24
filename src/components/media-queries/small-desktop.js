import { useMediaQuery } from 'react-responsive'

export const SmallDesktop = ({ children }) => {
  const isSmallDesktop = useMediaQuery({ minWidth: 1200, maxWidth: 1299 })

  return isSmallDesktop ? children : null
}