import React from 'react';
import { Route } from 'react-router-dom';
import Home from 'components/Home';

const routes = [
    {
        path: '/',
        component: Home
    }
    // {
    //     path: '/login',
    //     component : Login
    // },
    // {
    //     path: '/employee',
    //     component : EmployeeApp
	// },
	// {
    //     path: '/dashboard',
    //     component : Dashboard
	// },
	// {
    //     path: '/request',
    //     component : Request
    // }
];

export default routes;