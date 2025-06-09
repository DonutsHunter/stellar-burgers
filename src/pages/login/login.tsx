import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store/store';
import {
  loginAsyncThunk,
  resetRequestState
} from '../../services/store/features/auth/authSlice';
import { Modal } from '@components';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const requestState = useSelector((state) => state.auth.requestState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginAsyncThunk({ email, password }));
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
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
