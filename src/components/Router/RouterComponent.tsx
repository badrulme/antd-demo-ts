import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from '../../App';
import ContactComponent from '../Content/Contact/ContactComponent';
type Props = {}

const RouterComponent: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<App />} />
                {/* <Route path="blogs" element={<Blogs />} /> */}
                <Route path="contact" element={<ContactComponent />} />
                {/* <Route path="*" element={<NoPage />} /> */}
            </Route>
        </Routes>
    </BrowserRouter>
)

export default RouterComponent;