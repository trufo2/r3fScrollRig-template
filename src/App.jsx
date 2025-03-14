/* eslint-disable no-unused-vars */
import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./sections/Home";
import Sites from "./sections/Sites";
import Animations from "./sections/Animations";
import Videos from "./sections/Videos";
import Art from "./sections/Art";

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/sites" element={<Layout><Sites /></Layout>} />
                <Route path="/animations" element={<Layout><Animations /></Layout>} />
                <Route path="/videos" element={<Layout><Videos /></Layout>} />
                <Route path="/art" element={<Layout><Art /></Layout>} />
            </Routes>
        </HashRouter>
    );
};

export default App;
