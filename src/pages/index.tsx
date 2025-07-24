import ProjectsBody from "@components/projects-body"
import banner from "../assets/phasenull/banner.jpg"
import Header from "../components/header"
import DashboardPanel from "@components/dashboard-panel"
export default function IndexPage() {
	return (
		<div className="flex flex-col space-y-10 justify-center overflow-x-clip overflow-y-scroll">
			<img style={{objectFit:"cover"}} className="top-0 h-150 lg:h-80 overflow-x-hidden scale-100 -z-10 absolute" src={banner} />
			<Header />
			{/* <DashboardPanel/> */}
			<ProjectsBody/>
		</div>
	)
}
