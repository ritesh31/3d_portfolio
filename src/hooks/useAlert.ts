import { useState } from 'react'
import { AlertPropsType } from '../types';

function useAlert() {
  const [alert, setAlert] = useState({
    show: false,
    text: '',
    type: 'danger'
  });

  const showAlert = ({ text, type = 'danger' }: AlertPropsType) => setAlert({
    show: true,
    text,
    type
  })

  const hideAlert = () => setAlert({
    show: false,
    text: '',
    type: ''
  })
  return { alert, showAlert, hideAlert }
}

export default useAlert