import React, { useContext, useState } from 'react'; // ✅ added useState
import { useForm } from 'react-hook-form';
import Layout from '../common/Layout';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuth';
import Loader from '../common/Loader';

const Login = () => {
    const [loader, setLoader] = useState(false); // ✅ start with false
    const { login } = useContext(AdminAuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoader(true); // ✅ start loader

        try {
            const response = await fetch(`${apiUrl}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 200) {
                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                };

                localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                login(adminInfo);

                // ✅ delay navigation so loader is visible
                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 500);

            } else {
                toast.error(result.message || 'Login failed');
            }

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoader(false); // ✅ stop loader
        }
    };

    return (
        <Layout>

            {/* ✅ SHOW LOADER */}
            {loader && <Loader />}

            <div className={`container d-flex justify-content-center py-5 ${loader ? 'form-disabled' : ''}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card shadow border-0 login">
                        <div className="card-body p-4">
                            <h3>Admin Login</h3>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    id="email"
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
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password"
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
                                disabled={loader} // ✅ prevent multiple clicks
                            >
                                {loader ? 'Logging in...' : 'Login'}
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;