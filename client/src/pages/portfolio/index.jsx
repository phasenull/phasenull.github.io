import { Fragment, useEffect, useState } from "react"
import PortfolioContainer from "../../components/PortfolioContainer"
import ExternalLink from "../../components/external_link"
import TechSwitcher from "../../components/tech_switcher"
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import Helmet from "react-helmet"
import { TbTrash } from "react-icons/tb";
function PortfolioIndex(props) {
	const [chipData, setChipData] = useState(
		[
			{ tag: "ROBLOX", is_visible: true },
			{ tag: "JavaScript", is_visible: true },
			{ tag: "Python", is_visible: true },
			{ tag: "React", is_visible: true },
		]
	);
	useEffect(() => {
		const filter = new URLSearchParams(window.location.search)?.get("filter")?.split(",")
		if (filter) {
			chipData.forEach((data) => {
				if (data.tag === filter.find((tag) => tag === data.tag)) {
					data.is_visible = true
				} else {
					handleDelete(data.tag)
				}
			})
		}
		setChipData([].concat(chipData))
	}, [])
	function clearFilter() {
		chipData.forEach((data) => {
			if (!data.is_visible) {
				handleDelete(data.tag)
			}
		})
		setChipData([].concat(chipData))
	}
	function toggle_visibility(element, bool_enabled) {
		element.classList.remove(bool_enabled ? "hidden" : "block");
		element.classList.add(bool_enabled ? "block" : "hidden");
	}

	function handleDelete(chipToDelete) {
		const data = chipData.find((chip) => chip.tag === chipToDelete)
		chipData.find(
			(chip) => chip.tag === chipToDelete
		).is_visible = !data.is_visible
		document.querySelectorAll("[tag*='" + chipToDelete + "']").forEach(element => {
			let is_visible = false
			element.attributes.tag.value.split(";").forEach((tag_2) => {
				if (chipData.find((chip) => chip.tag === tag_2).is_visible) {
					is_visible = true
					return
				}
			})
			toggle_visibility(element, is_visible)
		});
		setChipData([].concat(chipData));
	};
	return (
		<Fragment>
			<div className="grid grid-flow-row grid-cols-1 md:max-xl:grid-cols-2 xl:grid-cols-3 gap-3 p-10 place-items-center">
				<Helmet>
					<title>phasenull.dev | Portfolio</title>
					<meta name="description" content="Hi! I'm phasenull and this is my portfolio." />
				</Helmet>
				<div id="profile" className="col-span-full max-h-96 overflow-hidden bg-white drop-shadow-2xl rounded-2xl
			grid grid-rows-2 grid-flow-col md:grid-rows-1 place-content-center">
					<img className="max-w-[200px] p-4 rounded-full drop-shadow-2xl shadow-2xl w-[100%] place-self-center md:rounded-[30px]" src="/media/Asdas.png" alt="" />
					<div className="align-top py-4 place-items-center">
						<p className="font-bold text-primary-dark text-center text-2xl px-4">
							phasenull
						</p>
						<div className="relative font-bold text-secondary-darkest text-sm py-2 px-5 max-w-[100%] overflow-ellipsis md:max-w-xs xl:max-w-sm">
							<TechSwitcher /> developer from Turkey.
						</div>
					</div>
				</div>
				<div id="selector" className="md:col-span-full rounded-2xl bg-white p-5 md:mx-32 mt-7">
					<p className="relative my-auto text-sm font-bold text-secondary-darkest text-center">
						Filter Content:
						<button className="select-none absolute left-0 -top-1 text-red-500 group hover:scale-110" onClick={clearFilter}>
							Clear <TbTrash className="inline absolute group-hover:animate-shakerotation" size={20} />
						</button>
					</p>

					<div className="grid grid-flow-row grid-cols-3 md:grid-cols-0 md:grid-flow-col justify-center">
						{
							chipData.map(
								(data) => {
									return (
										<div className="mx-auto" key={data.tag}>
											<ListItem >
												<Chip
													variant="outlined"
													color={data.is_visible ? "primary" : "secondary"}
													label={data.tag}
													onClick={() => handleDelete(data.tag)}
												/>
											</ListItem>
										</div>
									);
								}
							)
						}
					</div>
				</div>
				<PortfolioContainer tag="ROBLOX" href="portfolio/work/100" title="Morph System">
					<img className="p-4 drop-shadow-2xl shadow-2xl h-full w-max place-self-center rounded-[30px]"
						src="https://media.discordapp.net/attachments/736926100206125058/1121036369515511880/image.png" alt="" />
					Morph System for <ExternalLink href="https://twitter.com/FireAtacck">FireAtacck</ExternalLink>
				</PortfolioContainer>
				<PortfolioContainer tag="ROBLOX;JavaScript;React" title="Project Nexus">
					<img className="p-4 drop-shadow-2xl shadow-2xl h-full w-max place-self-center rounded-[30px]"
					src="/media/work/nexus/preview.png" alt="" />
					Remote Roblox Live Server Controller for 
					<ExternalLink href="https://discord.com/users/781001385591701524">north#5920</ExternalLink>
				</PortfolioContainer>
				<PortfolioContainer tag="JavaScript;React" title="phasenull.dev">
					<img className="p-4 drop-shadow-2xl shadow-2xl h-48 w-max place-self-center rounded-[30px]"
					src="/media/work/phasenulldotdev/preview.png" alt="" />
					My personal website, made with <ExternalLink href="https://react.dev/">React</ExternalLink> and <ExternalLink href="https://tailwindcss.com/">TailwindCSS</ExternalLink>
				</PortfolioContainer>
			</div >
		</Fragment >)
}
export default PortfolioIndex