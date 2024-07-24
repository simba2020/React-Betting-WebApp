import { Button as MuiButton, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useProgressStyles = makeStyles({
  progress: {
    position: 'absolute',
  },
});

const useButtonStyles = makeStyles((theme) => ({
  root: {
    transition: theme.transitions.create(['opacity', 'background-color', 'box-shadow', 'border'], {
      duration: theme.transitions.duration.short,
    }),
    opacity: 0.9,
    '&:hover': {
      opacity: 1,
    },
  },
  contained: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  margins: (props) => ({
    marginBottom: theme.spacing(props.mb),
  }),
}));

const Button = (props) => {
  const { className, children, variant = 'contained', color = 'primary', loading, disabled, onClick, mb = 0 } = props;

  const classes = useStyles({ mb });
  const buttonClasses = useButtonStyles();
  const progressClasses = useProgressStyles();

  return (
    <MuiButton
      classes={buttonClasses}
      className={clsx(className, classes.margins)}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {loading && <CircularProgress size={24} className={progressClasses.progress} />}
    </MuiButton>
  );
};

export default Button;
