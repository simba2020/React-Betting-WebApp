import { useMediaQuery } from 'react-responsive'

export const MediumDesktop = ({ children }) => {
  const isMediumDesktop = useMediaQuery({ minWidth: 1300, maxWidth: 1399 })

  return isMediumDesktop ? children : null
}