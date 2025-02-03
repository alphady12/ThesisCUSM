
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './Login.css';
import loginImage from './Dashboard.png';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');  // Reset previous error on new attempt


        try {
            const response = await axios.post('http://localhost:3001/api/agents/login', {
                email,
                password,
            });


            // Save the token in localStorage
            localStorage.setItem("token", JSON.stringify(response.data.token));


            // Navigate to the agent dashboard
            navigate('/agent/home');
        } catch (error) {
            // Set error message based on response status
            if (error.response && error.response.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('Login failed. Please try again later.');
            }
            console.error('Login Failed', error);
        }
        setLoading(false);
    };


    return (
        <div className="login-page">
            <div className="container">
                <div className="image-holder">
                    <img src={loginImage} alt="Login" />
                </div>


                <div className="login-container">
                    <h2 className="login-title">LOGIN-AGENT</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="input"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="position-relative">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                required
                            />
                            <span
                                className="password-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                            </span>
                        </Form.Group>
                        <Button variant="danger" type="submit" className="login-button" disabled={loading}>
                            {loading ? (
                                <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </Form>
                    {error && <div className="error">{error}</div>}


                    <div className="signup-link">
                        <span>Don't have an account? </span>
                        <Link to="/Register">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;
