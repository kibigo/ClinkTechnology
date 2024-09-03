import Chart from "./Chart"
import Statistics from "./Statistics"

function AdminHome() {
  return (
    <div className="flex flex-col">
        
        <Statistics />

        <div>
            <Chart />
        </div>
    </div>
  )
}

export default AdminHome