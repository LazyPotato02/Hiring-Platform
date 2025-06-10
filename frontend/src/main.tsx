import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContect.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import RegisterPage from "./components/RegisterPage/Registerage.tsx";
import {HomePage} from "./components/HomePage/HomePage.tsx";
import {LoggedGuard} from "./guards/LoggedGuard.tsx";
import {JobDisplay} from "./components/JobDisplay/JobDisplay.tsx";
import {AddJobPage} from "./components/AddJobPage/AddJobPage.tsx";
import {RequireRole} from "./guards/roleGuard.tsx";
import JobDetailPage from "./components/JobDetailPage/JobDetailPage.tsx";
import ProfilePage from "./components/ProfilePage/ProfilePage.tsx";
import PostedJobsPage from "./UserPostedJobsPage/PostedJobsPage.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>

                <Routes>
                    <Route path={''} element={<HomePage/>}/>
                    <Route path="/jobs" element={<JobDisplay/>}/>
                    <Route path="/jobs/:techName" element={<JobDisplay/>}/>
                    <Route path="/jobs/search/:id" element={<JobDetailPage/>}/>
                    <Route path="/jobs/add" element={<RequireRole><AddJobPage/></RequireRole>}/>
                    <Route path="/profile" element={<ProfilePage/>}></Route>
                    <Route path="/user/posted-jobs" element={<PostedJobsPage/>}></Route>
                    <Route path="login" element={<LoggedGuard><LoginPage/></LoggedGuard>}/>
                    <Route path="register" element={<LoggedGuard><RegisterPage/></LoggedGuard>}/>
                </Routes>

            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)

