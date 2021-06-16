import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required!")
      .max(50, "Max length for the Title is 50."),    
    description: Yup.string().required("Required!").max(100, "Max length for the description is 100."), 
})