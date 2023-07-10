import { useEffect } from "react"
import PortfolioContainer from "../../components/PortfolioContainer"
import ExternalLink from "../../components/external_link"
function LedoWelcome(props) {
	useEffect(() => {
		document.title = "LEDO | What we have"
	})
	return (
		<div className="grid grid-flow-row grid-cols-1 md:max-xl:grid-cols-2 xl:grid-cols-3 gap-10 p-10 place-items-center">
			<container className="col-span-full max-h-96 overflow-hidden bg-white drop-shadow-2xl rounded-2xl
			grid grid-rows-2 grid-flow-col md:grid-rows-1 place-content-center">
				<img className="max-w-[200px] p-4 rounded-full drop-shadow-2xl shadow-2xl w-[100%] place-self-center md:rounded-[30px]" src="/media/Asdas.png" alt="" />
				<div className="align-top py-4 place-items-center">
					<p className="font-bold text-primary-dark text-center text-2xl px-4">
						phasenull
					</p>
					<p className="relative font-bold text-secondary-darkest text-sm py-2 px-5 max-w-[100%] overflow-ellipsis md:max-w-xs xl:max-w-sm">
						{"PLACE HOLDER TEXT".repeat(10)}
					</p>
				</div>
			</container>
			<PortfolioContainer type="roblox">
				<img className="p-4 rounded-full drop-shadow-2xl shadow-2xl h-max max-h-60 place-self-center md:rounded-[30px]" src="https://media.discordapp.net/attachments/736926100206125058/1121036369515511880/image.png" alt="" />
				<div className="align-top mx-10 py-4">
					<p className="font-bold text-primary-dark text-center text-2xl">
						Morph System
					</p>
					<p className="font-bold text-secondary-darkest text-sm text-center my-2 max-w-[300px]">
						Morph System for <ExternalLink href="https://www.roblox.com/users/128618486/profile">FireAtacck</ExternalLink>
					</p>
				</div>
			</PortfolioContainer>
		</div>)
}
export default LedoWelcome