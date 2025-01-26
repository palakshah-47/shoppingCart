'use client';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Heading from '../components/Heading';
import { Button } from '../components/Button';
import { AiOutlineGoogle } from 'react-icons/ai';
import Input from '../components/inputs/input';
import Link from 'next/link';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ defaultValues: { name: '', email: '', password: '' } });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
  };
  return (
    <>
      <Heading title="Sign in to fingerhut" />
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {}}></Button>
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required></Input>
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"></Input>
      <Button label={isLoading ? 'Loading' : 'Login'} onClick={handleSubmit(onSubmit)}></Button>
      <p className="text-sm mt-4 text-slate-500">
        Do not have an account?{' '}
        <Link className="underline" href="/register">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
