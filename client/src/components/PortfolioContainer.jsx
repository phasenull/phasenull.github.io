import { BiLinkExternal } from "react-icons/bi"
import { Fragment } from "react"
function PortfolioContainer(props) {
	const { tag } = props
	function convert_to_tags(tags) {
		return tags.split(";")
	}
	return (
		<div tag={props.tag} className="h-60 w-full max-h-96 overflow-hidden bg-white drop-shadow-2xl rounded-2xl grid grid-rows-2 grid-flow-col sm:grid-rows-1">
			{props.children[0]}
			<div className="align-top mx-2 mr-2 mt-3 py-4">
				<p className="font-bold text-primary-dark text-center text-2xl">
					{props.title}
				</p>
				<p className="font-bold text-secondary-darkest text-sm text-center my-2 max-w-[300px]">
					{props.children.slice(1)}
				</p>
			</div>
			<div className="absolute bottom-0 right-0 my-3 mx-1">

				{convert_to_tags(tag).map((tag) => {
					return (
						<Fragment>
							<a className="text-center relative bottom-0 h-6 mr-2 mb-2 p-1 rounded-xl bg-primary opacity-30 right-0 font-bold text-sm select-none text-secondary-darkest hover:bg-primary-dark hover:opacity-100" href={"?filter=" + tag}>
								#{tag}
							</a>

						</Fragment>
					)
				})}
			</div>
			{props.href && <a className="absolute right-0 m-3 group hover:scale-105" href={props.href} target="_blank" rel="noreferrer">
				<BiLinkExternal className="text-secondary-darkest text-2xl group-hover:animate-shakerotation" />
			</a>}
		</div>)
}
export default PortfolioContainer