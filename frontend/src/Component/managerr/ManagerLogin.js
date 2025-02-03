
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
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', {
                email,
                password,
            });
            localStorage.setItem("token", JSON.stringify(response.data.token));
            navigate('/manager/agentusers');
        } catch (error) {
            setError('Login Failed. Please check your credentials and try again.');
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
                    <h2 className="login-title">LOGIN-MANAGER</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="position-relative">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                            </span>
                        </Form.Group>
                        <Button variant="danger" type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
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
