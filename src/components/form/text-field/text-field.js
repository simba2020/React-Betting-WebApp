import { makeStyles } from '@material-ui/core/styles';
import { FormControl, OutlinedInput, InputLabel, FormHelperText } from '@material-ui/core';
import clsx from 'clsx';

const useInputStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    borderWidth: '1px',
    borderColor: theme.palette.border.default,
    borderStyle: `solid`,
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  focused: {},
  notchedOutline: {},
  input: {
    position: 'relative',
    fontSize: theme.typography.input.fontSize,
    padding: '14px 16px',
    '&::placeholder': {
      fontSize: theme.typography.placeholder.fontSize,
      letterSpacing: theme.typography.placeholder.letterSpacing,
      color: theme.palette.text.secondary,
    },
  },
  margins: {
    marginBottom: (props) => theme.spacing(props.mb),
  },
}));

const useLabelStyles = makeStyles((theme) => ({
  root: {
    letterSpacing: '0.06em',
    '&$disabled': {
      color: theme.palette.text.secondary,
    },
  },
  disabled: {},
}));

const TextField = (props) => {
  const {
    name,
    className,
    label,
    placeholder,
    type,
    endAdornment,
    value,
    onChange,
    disabled,
    errors = {},
    mb = 0,
  } = props;

  const classes = useInputStyles({ endAdornment, mb });
  const labelClasses = useLabelStyles();

  return (
    <FormControl
      className={clsx(className, classes.margins)}
      variant="outlined"
      disabled={disabled}
      error={!!name && !!errors && !!errors[name]}
    >
      {label && (
        <InputLabel classes={labelClasses} shrink>
          {label}
        </InputLabel>
      )}
      <OutlinedInput
        name={name}
        classes={{
          root: classes.root,
          input: classes.input,
        }}
        notched={false}
        type={type}
        placeholder={placeholder}
        endAdornment={endAdornment}
        value={value}
        onChange={onChange}
      />
      {!!errors && typeof errors[name] === 'string' && (
        <FormHelperText variant="outlined">{errors[name]}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TextField;
