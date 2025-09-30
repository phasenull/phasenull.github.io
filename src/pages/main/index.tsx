import { useParams } from "react-router";
import ProjectsBody from "./components/projects-body"
import UrlConsent from "./components/url-consent"
export default function IndexPage() {
	const { id, tag } = useParams<{ id: string; tag?:string}>()
	return (
		<div className="">
			<UrlConsent/>
			
			<ProjectsBody id={id} tag={tag} />
		</div>
	)
}
