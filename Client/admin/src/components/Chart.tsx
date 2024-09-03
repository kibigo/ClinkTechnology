import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const data = [
  {
    name: 'Page A',
    Expense: 4000,
    Income: 2400
  },
  {
    name: 'Page B',
    Expense: 3000,
    Income: 1398,
  },
  {
    name: 'Page C',
    Expense: 2000,
    Income: 9800
  },
  {
    name: 'Page D',
    Expense: 2780,
    Income: 3908
  },
  {
    name: 'Page E',
    Expense: 1890,
    Income: 4800
  },
  {
    name: 'Page F',
    Expense: 2390,
    Income: 3800
  },
  {
    name: 'Page G',
    Expense: 3490,
    Income: 4300
  },
];

function Chart() {
  return (
    <div className="bg-white p-4 h-[20rem] md:h-[23rem] lg:h-[40rem] rounded-sm border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Transactions</strong>
      <div className="mt-3 flex-1 w-5/6 md:w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Expense" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart