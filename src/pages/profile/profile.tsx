import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { TRegisterData } from '@api';
import {
  resetRequestState,
  updateUserDataAsyncThunk
} from '../../services/store/features/auth/authSlice';
import { Modal } from '@components';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const requestState = useSelector((state) => state.auth.requestState);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    if (requestState === 'success') {
      setFormValue((prevState) => ({
        ...prevState,
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      }));
    }
  }, [requestState]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const readyData: Partial<TRegisterData> = {};

    if (user && user.name !== formValue.name) {
      readyData.name = formValue.name;
    }

    if (user && user.email !== formValue.email) {
      readyData.email = formValue.email;
    }

    if (formValue.password.trim() && formValue.password.length > 0) {
      readyData.password = formValue.password;
    }

    if (Object.keys(readyData).length > 0) {
      dispatch(updateUserDataAsyncThunk(readyData))
        .then((data) => {
          console.log(data.payload);
          if (data.payload) {
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {requestState && requestState === 'failed' ? (
        <Modal
          title='Произошла ошибка'
          onClose={() => dispatch(resetRequestState())}
        />
      ) : null}
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
