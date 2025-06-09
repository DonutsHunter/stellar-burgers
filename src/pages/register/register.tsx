import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store/store';
import { Preloader } from '@ui';
import { Modal } from '@components';
import {
  registerAsyncThunk,
  resetRequestState
} from '../../services/store/features/auth/authSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.app.isLoading);
  const requestState = useSelector((state) => state.auth.requestState);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerAsyncThunk({
        name: userName,
        email,
        password
      })
    );
  };

  useEffect(() => {
    switch (requestState) {
      case 'success':
        setUserName('');
        setEmail('');
        setPassword('');
        break;
    }
  }, [requestState]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <RegisterUI
        errorText=''
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />

      {requestState && requestState === 'failed' ? (
        <Modal
          title={'Ошибка регистрации'}
          onClose={() => {
            dispatch(resetRequestState());
          }}
        />
      ) : null}
    </>
  );
};
