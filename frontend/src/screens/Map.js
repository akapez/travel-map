import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { format } from 'timeago.js'
import {
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  CardActions,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle'
import StarIcon from '@material-ui/icons/Star'
import axios from 'axios'

//validations
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { validationSchema } from '../validations/map'

//styles
import '../styles/Map.css'
import { useStyles } from '../styles/Map'

import Register from '../components/Register'
import Login from '../components/Login'

const Map = () => {
  const classes = useStyles()

  const myStorage = window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'))

  //database
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [rating, setRating] = useState(0)

  const [currentPlaceId, setCurrentPlaceId] = useState(null)

  const [pins, setPins] = useState([])

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 6.927079,
    longitude: 79.861244,
    zoom: 6,
  })

  useEffect(() => {
    const getPin = async () => {
      try {
        const res = await axios.get('/pin')
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPin()
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat
    setNewPlace({
      lat,
      long,
    })
  }

  const submit = async (e) => {
    const newPin = {
      userName: currentUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    try {
      const res = await axios.post('/pin', newPin)
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUser(null)
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle='mapbox://styles/ak96/ckpwhl7a800oz17nu0rag7231'
      onDblClick={handleAddClick}
      transitionDuration='100'
    >
      {pins.map((pin) => (
        <div key={pin._id}>
          <Marker
            latitude={pin.lat}
            longitude={pin.long}
            offsetLeft={-viewport.zoom * 3.5}
            offsetTop={-viewport.zoom * 7}
          >
            <div>
              <PersonPinCircleIcon
                style={{
                  fontSize: viewport.zoom * 7,
                  color: pin.userName === currentUser ? '#CF0000' : '#1EAE98',
                  cursor: 'pointer',
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              />
            </div>
          </Marker>
          {pin._id === currentPlaceId && (
            <Popup
              latitude={pin.lat}
              longitude={pin.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor='left'
            >
              <div className='card'>
                <Typography className={classes.fontSize} color='textSecondary'>
                  Title
                </Typography>
                <Typography variant='h5' component='h2'>
                  {pin.title}
                </Typography>
                <Typography className={classes.fontSize} color='textSecondary'>
                  Review
                </Typography>
                <Typography variant='body2' component='p'>
                  {pin.description}
                </Typography>
                <Typography className={classes.fontSize} color='textSecondary'>
                  Rating
                </Typography>
                <div>
                  {Array(pin.rating).fill(<StarIcon className='star' />)}
                </div>
                <Typography className={classes.fontSize} color='textSecondary'>
                  Information
                </Typography>
                <div className={classes.root}>
                  <Chip
                    size='small'
                    label={pin.userName}
                    style={{
                      backgroundColor:
                        pin.userName === currentUser ? '#CF0000' : '#1EAE98',
                      color: '#fff',
                    }}
                  />
                  <Chip size='small' label={format(pin.createdAt)} />
                </div>
              </div>
            </Popup>
          )}
        </div>
      ))}
      {newPlace && (
        <Popup         
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor='left'
        >
          <Formik
            initialValues={{ title: '', description: '' }}
            onSubmit={submit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ isValid, dirty }) => {
              return (
                <Form>
                  <Card elevation={0}>
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12}>
                          <Field
                            label='Title'
                            name='title'
                            size='small'
                            component={TextField}
                            variant='outlined'
                            fullWidth
                            onKeyUp={(e) => setTitle(e.target.value)}
                          ></Field>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <Field
                            label='Review'
                            name='description'
                            multiline
                            rows={3}
                            size='small'
                            component={TextField}
                            variant='outlined'
                            fullWidth
                            onKeyUp={(e) => setDescription(e.target.value)}
                          ></Field>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                          <Typography component='legend' color='textSecondary'>
                            Rating
                          </Typography>
                          <Rating
                            name='simple-controlled'
                            value={rating}
                            onChange={(event, newValue) => {
                              setRating(newValue)
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        size='small'
                        variant='contained'
                        color='primary'
                        type='submit'
                        disabled={!dirty || !isValid || !currentUser}
                      >
                        Add Pin
                      </Button>
                    </CardActions>
                  </Card>
                </Form>
              )
            }}
          </Formik>
        </Popup>
      )}
      {currentUser ? (
        <Grid className='logout'>
          <Button variant='contained' color='secondary' onClick={handleLogout}>
            Logout
          </Button>
        </Grid>
      ) : (
        <div className='buttons'>
          <Grid
            container
            direction='row-reverse'
            justify='flex-start'
            alignItems='center'
          >
            <Register/>
            <Login myStorage={myStorage} setCurrentUser={setCurrentUser}/>
          </Grid>
        </div>
      )}
    </ReactMapGL>
  )
}

export default Map
