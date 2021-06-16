import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  userName: Yup.string().required('Required'),
})
