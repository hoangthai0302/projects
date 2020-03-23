import React from 'react';
import { Route } from 'react-router-dom';
import Home from 'components/Home';
import RenderArrayTest from 'components/RenderArrayTest';

const routes = [
    {
        path: '/home',
        component: Home
    },
    {
        path: '/render-array',
        component: RenderArrayTest
    },
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