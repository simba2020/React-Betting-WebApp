import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grid: {
    flex: 1,
  },
  itemGuy: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      justifyContent: 'center',
    },
  },
  guyWrapper: {
    [theme.breakpoints.down('sm')]: {
      height: '275px',
      overflow: 'hidden',
    },
  },
  guy: {
    height: '500px',
    width: 'auto',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      margin: [[0, theme.spacing(1), theme.spacing(5), theme.spacing(1)]],
      padding: [[theme.spacing(1), theme.spacing(2)]],
    },
    [theme.breakpoints.only('sm')]: {
      marginLeft: theme.spacing(8),
    },
  },
  title: {
    marginBottom: (props) => (!!props.subtitle ? theme.spacing(3) : theme.spacing(8)),
  },
  subtitle: {
    marginBottom: theme.spacing(6),
  },
}));

const AuthContent = (props) => {
  const { children, title, subtitle } = props;

  const classes = useStyles({ subtitle });

  return (
    <Grid container className={classes.grid}>
      <Grid item xs={12} md={4} className={classes.itemGuy}>
        <div className={classes.guyWrapper}>
          <img src="/assets/auth/guy.png" className={classes.guy} alt="Football player" />
        </div>
      </Grid>
      <Grid item xs={12} md={8} lg={6} xl={5} className={classes.contentWrapper}>
        <Box
          className={classes.content}
          display="flex"
          flex={1}
          flexDirection="column"
          bgcolor="background.paper"
          borderRadius="borderRadiusPaper"
          mt={{ xs: 0, md: 7 }}
          mb={7}
          mr={{ xs: 4, sm: 8, md: 0 }}
        >
          <Typography variant="h3" color="textPrimary" className={classes.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" className={classes.subtitle}>
              {subtitle}
            </Typography>
          )}
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export { AuthContent };
