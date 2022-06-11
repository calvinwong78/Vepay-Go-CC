import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button2';
import { Link } from 'react-router-dom';

export default function BasicTextFields({ title, setPassword, setEmail, handleAction, setFullname}) {
  
    return (
        <div>
            <div className="heading-container">
                <h3>
                    {title} Form
                </h3>
            </div>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="email"
                    label="Enter the Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="password"
                    label="Enter the Password"
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    id="fullname"
                    label="Fullname"
                    variant="outlined"
                    onChange={(e) => setFullname(e.target.value)}
                />
                <Link to='/register'>
                 Register
                 </Link>
                 or
                 <Link to='/'>
                 Login
                 </Link>
            </Box>
            <Button title={title} handleAction={handleAction} />
        </div>
    );
}