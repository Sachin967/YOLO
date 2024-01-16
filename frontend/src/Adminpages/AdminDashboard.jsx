import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { admin } from '../config/axios'
const AdminDashboard = () => {
	const [douChartData, setDouChartData] = useState({});
	const [pieChartData, setPieChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});
	const [totalUsers,setTotalUsers]=useState(0)
	const [count, setCount] = useState({
		maleCount: 0,
		femaleCount: 0,
		otherCount: 0
	});
	const [ageCount, setAgeCount] = useState({
		between15and20: 0,
		between20and25: 0,
		between25and30: 0
	});
	const [loading, setLoading] = useState(true);
	const [averagePost,setAveragePost]=useState()
	const fetchPostData = () => {
		admin.get('/userdashboard').then((res) => {
			console.log(res)
			if (res.data) {
				setCount(res.data.response)
				setAgeCount(res.data.resp)
			}
		}).catch((error) => {
			console.log(error)
		}).finally(() => {
			setLoading(false)
		})
	}
	const averagePostsperWeek = () => {
		admin.get('/averagepostcount').then((res) => {
			if (res.data) {
				setAveragePost(res.data.response)
				console.log(res.data)
			}
		}).catch(err => console.log(err))
	}
	useEffect(() => {
		setLoading(true)
		fetchPostData()
		averagePostsperWeek()
	},[])


	useEffect(() => {
		// Calculate total users whenever count is updated
		const calculateTotalUsers = () => {
			setTotalUsers(count.maleCount + count.femaleCount + count.otherCount);
		};

		calculateTotalUsers();
	}, [count]);
	useEffect(() => {
		if (!loading) {
			if (douChartData && douChartData.destroy) {
				douChartData.destroy();
			}
			if (pieChartData && pieChartData.destroy) {
				pieChartData.destroy();
			}
			const data = {
				labels: ["Male", "Female", "Other"],
				
				datasets: [
					{
						label: "Count",
						data: [count.maleCount, count.femaleCount, count.otherCount],
						backgroundColor: [
							"rgba(255, 159, 64, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							// "rgba(153, 102, 255, 0.2)"
						],
						borderColor: ["rgb(255, 159, 64)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
						borderWidth: 1
					}
				]
			};
			const ageData = {
				labels: ["Below-20", "Between 20 and 25", "Between 25 and 30"],
				datasets: [
					{
						label: "Count",
						data: [ageCount.between15and20, ageCount.between20and25, ageCount.between25and30],
						backgroundColor: [
							"rgba(255, 159, 64, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							// "rgba(153, 102, 255, 0.2)"
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
			setDouChartData(data);
			setPieChartData(ageData)
			setChartOptions(options);
		}
	}, [count, loading, ageCount]);
	return (
		
		<div className="card flex flex-col justify-end">
			<div className="flex justify-evenly  w-full">
				<div className="w-60 h-36 my-5 rounded-lg bg-zinc-400">
					<h1 className="text-white text-xl w-full">Average posts per Week</h1>
					<div className="flex justify-center">
						<h1 className="text-8xl">{averagePost}</h1>
					</div>
				</div>
				<div className="w-60 h-36 my-5 rounded-lg bg-gray-400">
					<h1 className="text-white text-xl">Total Users</h1>
					<div className="flex justify-center">
						<h1 className="text-8xl">{totalUsers}</h1>
					</div>
				</div>
			</div>
			<div className="flex justify-evenly w-full">
				<div className="w-[33%] h-[200px]">
				<Chart type="doughnut" data={douChartData} options={chartOptions} />
					<h1 className="text-lg text-white font-bold text-center" font>Age Groups</h1>
				</div>
				<div className="w-[33%]  h-[200px]">
					<Chart type="pie" data={pieChartData} options={chartOptions} />
					<h1 className="text-lg text-white font-bold text-center">Gender-wise Count</h1>
				</div>
			</div>
		</div>
	);
};
export default AdminDashboard;
