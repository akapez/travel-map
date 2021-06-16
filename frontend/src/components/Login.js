import React, { useState } from 'react'
import {
  Grid,
  Button,
  createMuiTheme,
  ThemeProvider,
  Dialog,
  DialogActions,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'

//validations
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { validationSchema } from '../validations/login'

import '../styles/Map.css'

import axios from 'axios'

const useStyle = makeStyles((theme) => ({
  login: {
    marginRight: '10px',
    backgroundColor: '#2940d3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2940d3',
      boxShadow: 'none',
    },
  },
}))

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const formLabelsTheme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: '#db3131',
        '&$error': {
          color: '#db3131',
        },
      },
    },
  },
})

//Data
const initialValues = {
  userName: '',
  password: '',
}

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

export default function Login({ myStorage, setCurrentUser }) {
  const classes = useStyle()

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: 'success',
    message: '',
  })

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const submit = async (e) => {
    try {
      const data = await axios.post('/users/login', {
        userName: e.userName,
        password: e.password,
      })
      myStorage.setItem('user', data.data.userName)
      setCurrentUser(data.data.userName)
      setOpen(false)
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: 'error',
          message: 'Invalid user name or password!',
        })
      } else {
        setAlert({
          showAlert: true,
          severity: 'error',
          message: 'Server error!',
        })
      }
    }
  }

  return (
    <div>
      <Button
        variant='contained'
        className={classes.login}
        onClick={handleClickOpen}
      >
        Login
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          SIGN IN
        </DialogTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submit}
        >
          {({ dirty, isValid, values }) => {
            return (
              <ThemeProvider theme={formLabelsTheme}>
                <div>
                  <Form>
                    <DialogContent dividers>
                      <Grid item container spacing={1} justify='center'>
                        <Grid item xs={12} sm={12} md={12}>
                          <Field
                            title='Please fill out this field'
                            label='User Name'
                            variant='outlined'
                            fullWidth
                            name='userName'
                            values={values.userName}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <Field
                            title='Please fill out this field'
                            label='Password'
                            variant='outlined'
                            fullWidth
                            name='password'
                            values={values.password}
                            type='password'
                            component={TextField}
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        disabled={!dirty || !isValid}
                        variant='contained'
                        color='primary'
                        type='Submit'
                      >
                        LOGIN
                      </Button>
                    </DialogActions>
                  </Form>
                </div>
              </ThemeProvider>
            )
          }}
        </Formik>
        {alert.showAlert && (
          <Grid item md={12}>
            <Alert
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, showAlert: false })}
            >
              {alert.message}
            </Alert>
          </Grid>
        )}
      </Dialog>
    </div>
  )
}
