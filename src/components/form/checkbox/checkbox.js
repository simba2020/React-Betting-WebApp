import { FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.palette.text.secondary,
  },
}));

const Checkbox = (props) => {
  const { className, checked, value, onChange, name = '', color = 'secondary', children } = props;

  const classes = useStyles();

  return (
    <FormControlLabel
      classes={classes}
      className={className}
      control={<MuiCheckbox checked={checked} onChange={onChange} name={name} color={color} value={value} />}
      label={children}
    />
  );
};

export default Checkbox;
