'use client';
import { useState } from 'react';
import axios from 'axios';
import Heading from '../components/Heading';
import Input from '../components/inputs/input';
import {
  FieldValues,
  useForm,
  SubmitHandler,
} from 'react-hook-form';
import { Button } from '../components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const RegisterFrom =
  () => {
    const [
      isLoading,
      setIsLoading,
    ] =
      useState(
        false,
      );
    const router =
      useRouter();

    const {
      register,
      handleSubmit,
      formState:
        {
          errors,
        },
    } = useForm<FieldValues>(
      {
        defaultValues:
          {
            name: '',
            email:
              '',
            password:
              '',
          },
      },
    );

    const onSubmit: SubmitHandler<
      FieldValues
    > = (
      data,
    ) => {
      setIsLoading(
        true,
      );
      axios
        .post(
          '/api/register',
          data,
        )
        .then(
          () => {
            toast.success(
              'Account created successfully',
            );
            signIn(
              'credentials',
              {
                email:
                  data.email,
                password:
                  data.password,
                redirect:
                  false,
              },
            ).then(
              (
                resp,
              ) => {
                if (
                  resp?.ok
                ) {
                  router.push(
                    '/cart',
                  );
                  router.refresh();
                  toast.success(
                    'Logged in successfully',
                  );
                }
                if (
                  resp?.error
                ) {
                  toast.error(
                    'Error logging in',
                  );
                }
              },
            );
          },
        )
        .catch(
          () => {
            toast.error(
              'Something went wrong logging in',
            );
          },
        )
        .finally(
          () => {
            setIsLoading(
              false,
            );
          },
        );
    };
    return (
      <>
        <Heading title="Sign up for fingerhut" />
        <Button
          outline
          label="Sign up with Google"
          icon={
            AiOutlineGoogle
          }
          onClick={() => {}}></Button>
        <hr className="bg-slate-300 w-full h-px" />
        <Input
          id="name"
          label="Name"
          disabled={
            isLoading
          }
          register={
            register
          }
          errors={
            errors
          }
          required></Input>
        <Input
          id="email"
          label="Email"
          disabled={
            isLoading
          }
          register={
            register
          }
          errors={
            errors
          }
          required></Input>
        <Input
          id="password"
          label="Password"
          disabled={
            isLoading
          }
          register={
            register
          }
          errors={
            errors
          }
          required
          type="password"></Input>
        <Button
          label={
            isLoading
              ? 'Loading'
              : 'Sign Up'
          }
          onClick={handleSubmit(
            onSubmit,
          )}></Button>
        <p className="text-sm mt-4 text-slate-500">
          Already
          have
          an
          account?{' '}
          <Link
            className="underline"
            href="/login">
            Log
            in
          </Link>
        </p>
      </>
    );
  };

export default RegisterFrom;
