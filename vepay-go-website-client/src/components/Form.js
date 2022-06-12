import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button2';
import { Link } from 'react-router-dom';
import { Container, Grid } from '@mui/material';

export default function BasicTextFields({ title, setPassword, setEmail, handleAction,}) {
  
    return (
        <div>
            <Container component="main" maxWidth="xs">
            <div className="heading-container">
                <h3>
                    {title} Form
                </h3>
            </div>

            <Box
                component="form"
               
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    id="email"
                    label="Enter the Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    id="password"
                    label="Enter the Password"
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Link to='/register'>
                 Register
                 </Link>
                 or
                 <Link to='/'>
                 Login
                 </Link>
                 </Grid>
                 </Grid>
            </Box>
            <Button title={title} handleAction={handleAction} />
            </Container>
        </div>
        
    );
}