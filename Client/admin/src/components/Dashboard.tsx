import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"


function Dashboard() {


  return (
    <div className="flex flex-row overflow-auto">
        <Sidebar />

        <div className="flex-1">
            <Header />
            <div>{<Outlet />}</div>
        </div>
    </div>
  )
}

export default Dashboard



