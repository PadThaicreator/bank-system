import { Outlet } from "react-router-dom";



export default function AuthenComponent(){


    return(
        <div>
            <div>
                Authen
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}