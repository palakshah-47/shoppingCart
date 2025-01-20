'use client';
import { useState } from 'react';
import Heading from '../components/Heading';
import Input from '../components/inputs/input';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../components/Button';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
const RegisterFrom = () => {
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
      <Heading title="Sign up for fingerhut" />
      <Button outline label="Sign up with Google" icon={AiOutlineGoogle} onClick={() => {}}></Button>
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required></Input>
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required></Input>
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"></Input>
      <Button label={isLoading ? 'Loading' : 'Sign Up'} onClick={handleSubmit(onSubmit)}></Button>
      <p className="text-sm mt-4 text-slate-500">
        Already have an account?{' '}
        <Link className="underline" href="/login">
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterFrom;
