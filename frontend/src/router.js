import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';

import Home from './pages/home/home';
import Load from './pages/load/load';
import View from './pages/view/view';

export default class Routing extends React.Component{
    render(){
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/loading" element={<Load />} />
                    <Route path='/view' element={<View />} />
                </Routes>
            </Router>
        )
    }
}