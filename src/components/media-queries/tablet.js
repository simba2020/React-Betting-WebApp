import { useMediaQuery } from 'react-responsive'

export const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1199 })

  return isTablet ? children : null
}