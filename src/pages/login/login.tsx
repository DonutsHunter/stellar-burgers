import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store/store';
import {
  loginAsyncThunk,
  resetRequestState
} from '../../services/store/features/auth/authSlice';
import { Modal } from '@components';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange, setValues } = useForm({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const requestState = useSelector((state) => state.auth.requestState);

  // Обёртки для setEmail и setPassword, соответствующие типу Dispatch<SetStateAction<string>>
  const setEmail: React.Dispatch<React.SetStateAction<string>> = (val) => {
    setValues((prev) => ({
      ...prev,
      email: typeof val === 'function' ? val(prev.email) : val
    }));
  };

  const setPassword: React.Dispatch<React.SetStateAction<string>> = (val) => {
    setValues((prev) => ({
      ...prev,
      password: typeof val === 'function' ? val(prev.password) : val
    }));
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginAsyncThunk({ email: values.email, password: values.password })
    );
  };

  return (
    <>
      {requestState && requestState === 'failed' ? (
        <Modal
          title='Неверный email или пароль'
          onClose={() => {
            dispatch(resetRequestState());
          }}
        />
      ) : null}
      <LoginUI
        errorText=''
        email={values.email}
        setEmail={setEmail}
        password={values.password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
