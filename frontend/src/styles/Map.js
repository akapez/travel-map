import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  fontSize: {
    fontSize: '13px',
    borderBottom: '1px solid #D8E3E7',
  },
}))
