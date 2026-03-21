import React, { useContext, useState } from 'react'
import Layout from './common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from './common/http';
import { toast } from 'react-toastify';
import { AuthContext } from './context/Auth';
import Loader from './common/Loader';

const Login = () => {
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const { login } = useContext(AuthContext)

    const onSubmit = async (data) => {
        setLoader(true);
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 200) {
                const userInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                };

                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                login(userInfo);
                setInterval(() => {
                    navigate('/account');
                }, 500);
            } else {
                toast.error(result.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoader(false); // ✅ stop loader
        }
    };
  return (
    <Layout>

        {loader && <Loader />}

        <div className={`container d-flex justify-content-center py-5 ${loader ? 'form-disabled' : ''}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card shadow border-0 login">
                        <div className="card-body p-4">
                            <h3 className='border-bottom pb-2 mb-3'>Login</h3>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Email</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                    placeholder="Email"
                                    {...register('email', {
                                        required: "The email field is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                                    placeholder="Password"
                                    {...register('password', {
                                        required: "The password field is required."
                                    })}
                                />
                                {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-secondary w-100"
                                disabled={loader}
                            >
                                {loader ? 'Logging in...' : 'Login'}
                            </button>

                            <div className='d-flex justify-content-center pt-4 pb-2'>
                                    Don't have an account? &nbsp; <Link to="/account/register">Register</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
    </Layout>
  )
}

export default Login
