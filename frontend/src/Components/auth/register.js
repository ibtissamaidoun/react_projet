// src/pages/login.jsx
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from './button';
import { Input } from './input';
import axios from 'axios';
import * as React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import './form.css'; // Assurez-vous que ce fichier existe

// Schéma de validation du formulaire
const formSchema = z.object({
    name: z.string()
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name must be at most 30 characters'),
    email: z.string()
      .email('Invalid email address')
      .min(8, 'Email must be at least 8 characters')
      .max(30, 'Email must be at most 30 characters'),
    password: z.string()
      .min(5, 'Password must be at least 5 characters')
      .max(17, 'Password must be at most 17 characters'),
    confirmPassword: z.string()
      .min(5, 'Password must be at least 5 characters')
      .max(17, 'Password must be at most 17 characters'),
    profile: z.any()
});

export function Register() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: null
    },
  });
  const navigate = useNavigate(); 
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', values, {
        withCredentials: true // Envoyer les cookies avec la requête
      });
      console.log(response.status);
      if (response.status === 204) {
       //window.localStorage.setItem('ACCES_TOKEN','test')
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    console.log(methods.getValues()); // Log form values on render
  }, [methods]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Register Now</h1>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <div className="form-item">
            <label htmlFor="name">your name <span>*</span></label>
            <Controller
              name="name"
              control={methods.control}
              render={({ field }) => (
                <Input id="name" placeholder="enter your name" {...field} />
              )}
            />
            {methods.formState.errors.name && (
              <p>{methods.formState.errors.name.message}</p>
            )}
          </div>
          <div className="form-item">
            <label htmlFor="email">your email <span>*</span></label>
            <Controller
              name="email"
              control={methods.control}
              render={({ field }) => (
                <Input id="email" placeholder="enter your email" {...field} />
              )}
            />
            {methods.formState.errors.email && (
              <p>{methods.formState.errors.email.message}</p>
            )}
          </div>
          <div className="form-item">
            <label htmlFor="password">your password <span>*</span></label>
            <Controller
              name="password"
              control={methods.control}
              render={({ field }) => (
                <Input id="password" type="password" placeholder="enter your password" {...field} />
              )}
            />
            {methods.formState.errors.password && (
              <p>{methods.formState.errors.password.message}</p>
            )}
          </div>
          <div className="form-item">
            <label htmlFor="confirmPassword">confirm password <span>*</span></label>
            <Controller
              name="confirmPassword"
              control={methods.control}
              render={({ field }) => (
                <Input id="confirmPassword" type="password" placeholder="confirm your password" {...field} />
              )}
            />
            {methods.formState.errors.confirmPassword && (
              <p>{methods.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="form-item">
            <label htmlFor="profile">select profile</label>
            <Controller
              name="profile"
              control={methods.control}
              render={({ field }) => (
                <Input id="profile" type="file" {...field} />
              )}
            />
            {methods.formState.errors.profile && (
              <p>{methods.formState.errors.profile.message}</p>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-button">
            <Button type="submit" disabled={loading}>
              {loading ? <div className="loader"></div> : 'Register'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default Register;
