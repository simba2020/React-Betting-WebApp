import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(249, 190, 0)',
    },
    secondary: {
      main: 'rgb(15, 171, 15)',
    },
    background: {
      paper: '#232529',
      default: '#32353B',
    },
    border: {
      default: '#6D7380',
    },
    text: {
      primary: '#ffffff',
      secondary: '#C9C9CC',
    },
    action: {},
  },
  shape: {
    borderRadiusPaper: '8px',
  },
  typography: {
    h3: {
      fontSize: '2.5rem',
      letterSpacing: '0.06em',
    },
    placeholder: {
      fontSize: 'inherit',
      letterSpacing: '0.075em',
    },
    input: {
      fontSize: '1rem',
    },
    button: {
      fontSize: '1.25rem',
      letterSpacing: '0.072em',
      textTransform: 'none',
    },
  },
  overrides: {
    MuiLink: {
      root: {
        '&:hover': {
          color: 'rgb(249, 190, 0)', // bootstrap fix, main color
        },
      },
    },
  },
});

export default theme;
