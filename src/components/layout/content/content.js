import classes from './content.module.scss';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const ContentShift = Object.freeze({
  Header: classes.shiftHeader,
});

const useStyles = makeStyles((theme) => ({
  content: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '73px', // TODO BREAKPOINTS
    },
  },
}));

const Content = (props) => {
  const { children, shiftHeader } = props;

  const uiClasses = useStyles();
  const classNames = [classes.content, shiftHeader ? ContentShift.Header : '', uiClasses.content];

  return <div className={clsx(classNames)}>{children}</div>;
};

export default Content;
