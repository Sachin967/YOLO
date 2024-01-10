import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
const AdminDashboard = () => {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});
	useEffect(() => {
		const data = {
			labels: ["Q1", "Q2", "Q3", "Q4"],
			datasets: [
				{
					label: "Sales",
					data: [540, 325, 702, 620],
					backgroundColor: [
						"rgba(255, 159, 64, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(153, 102, 255, 0.2)"
					],
					borderColor: ["rgb(255, 159, 64)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
					borderWidth: 1
				}
			]
		};
		const options = {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		};

		setChartData(data);
		setChartOptions(options);
	}, []);

	return (
		<div className="card flex bg-white  flex-col justify-end">
			<div className="flex justify-around w-full">
				<div className="w-52 h-32 my-5 bg-black">
					<h1 className="text-white">Post created per day</h1>
				</div>
				<div className="w-52 h-32 my-5 bg-black">
					<h1 className="text-white">Total Users by Month/Year</h1>
					<h1 className="text-white">Age Distribution of Users</h1>
					<h1 className="text-white">Gender Distribution</h1>
				</div>
				<div className="w-52 h-32 my-5 bg-black"></div>
			</div>

			<div className="flex justify-around w-full">
				<div className="w-[36%] h-[200px]">
					<Chart type="pie" data={chartData} options={chartOptions} />
				</div>
				<div className="w-[36%] h-[200px]">
					<Chart type="doughnut" data={chartData} options={chartOptions} />
				</div>
			</div>
		</div>
	);
};
export default AdminDashboard;
