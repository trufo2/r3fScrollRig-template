import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./sections/Home-layout";
import SitesLayout from "./sections/Sites-layout";
import Home from "./sections/Home-html";
import Sites from "./sections/Sites-html";
import Animations from "./sections/Animations";
import Videos from "./sections/Videos";
import Art from "./sections/Art";

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
                <Route path="/sites" element={<SitesLayout><Sites /></SitesLayout>} />
                <Route path="/animations" element={<HomeLayout><Animations /></HomeLayout>} />
                <Route path="/videos" element={<HomeLayout><Videos /></HomeLayout>} />
                <Route path="/art" element={<HomeLayout><Art /></HomeLayout>} />
            </Routes>
        </HashRouter>
    );
};

export default App;
