import { useEffect, useState } from 'react'
import { AlertPropsType } from '../types';

function useAlert(autoHideMs?: number) {
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

  useEffect(() => {
    if (!autoHideMs || !alert.show) return;
    const timeout = setTimeout(hideAlert, autoHideMs);
    return () => clearTimeout(timeout);
  }, [alert.show, autoHideMs]);

  return { alert, showAlert, hideAlert }
}

export default useAlert