import { cleanURL } from "@common/util"
import ExternalLink from "@common/external-link"
import type { ReactNode } from "react"
import ImageCarousel from "./image-carousel"
import VideoWrapper from "./video-wrapper"

type Token = { type: string; text?: string; url?: string }
const MEDIA_TYPES = ["image", "image_carousel", "video"]

// groups the tokenizer output into lines, then lines into blocks:
// headlines, bullet lists ("- " lines), paragraphs, spacers (blank lines) and media
type Block =
	| { kind: "headline"; text: string }
	| { kind: "list"; items: Token[][] }
	| { kind: "paragraph"; lines: Token[][] }
	| { kind: "spacer" }
	| { kind: "media"; token: Token }

function toLines(tokens: Token[]) {
	const lines: Token[][] = [[]]
	for (const token of tokens) {
		if (token.type === "br") lines.push([])
		else lines[lines.length - 1].push(token)
	}
	return lines
}

function toBlocks(tokens: Token[]) {
	const blocks: Block[] = []
	for (const line of toLines(tokens)) {
		const last = blocks[blocks.length - 1]
		if (line.length === 0) {
			if (last && last.kind !== "spacer") blocks.push({ kind: "spacer" })
			continue
		}
		const media = line.find((t) => MEDIA_TYPES.includes(t.type))
		if (media) {
			blocks.push({ kind: "media", token: media })
			continue
		}
		if (line[0].type === "headline") {
			blocks.push({ kind: "headline", text: line[0].text || "" })
			continue
		}
		if (line[0].type === "text" && /^\s*-\s/.test(line[0].text || "")) {
			const item = [{ ...line[0], text: line[0].text!.replace(/^\s*-\s/, "") }, ...line.slice(1)]
			if (last?.kind === "list") last.items.push(item)
			else blocks.push({ kind: "list", items: [item] })
			continue
		}
		if (last?.kind === "paragraph") last.lines.push(line)
		else blocks.push({ kind: "paragraph", lines: [line] })
	}
	while (blocks[blocks.length - 1]?.kind === "spacer") blocks.pop()
	return blocks
}

function Inline({ tokens }: { tokens: Token[] }) {
	return (
		<>
			{tokens.map((token, i) => {
				if (token.type === "ghostlink" && token.url)
					return (
						<ExternalLink key={i} href={token.url.trim()}>
							{token.text}
						</ExternalLink>
					)
				return <span key={i}>{token.text}</span>
			})}
		</>
	)
}

// "Label: details" bullets get a bold label
function ListItem({ tokens }: { tokens: Token[] }) {
	const match = tokens[0]?.type === "text" ? tokens[0].text?.match(/^([^:]{2,40}):\s+(.*)$/s) : null
	if (!match) return <Inline tokens={tokens} />
	return (
		<>
			<span className="font-semibold text-slate-800">{match[1]}:</span>{" "}
			<Inline tokens={[{ ...tokens[0], text: match[2] }, ...tokens.slice(1)]} />
		</>
	)
}

function Media({ token }: { token: Token }) {
	// single images use the carousel too, so they open in the full screen viewer
	if (token.type === "image") return <ImageCarousel urls={[token.url || ""]} alt={token.text} />
	if (token.type === "image_carousel")
		return <ImageCarousel urls={(token.url || "").split(",")} alt={token.text} />
	return (
		<VideoWrapper controls className="w-full rounded-xl border border-slate-200">
			<source src={cleanURL(token.url?.trim())} type="video/mp4" />
			Your browser does not support the video tag.
		</VideoWrapper>
	)
}

function renderBlock(block: Block, i: number): ReactNode {
	switch (block.kind) {
		case "headline":
			return (
				<h4 key={i} className="mt-4 mb-1.5 text-sm font-bold uppercase tracking-wider text-slate-400 first:mt-0">
					{block.text}
				</h4>
			)
		case "list":
			return (
				<ul key={i} className="space-y-1.5">
					{block.items.map((item, j) => (
						<li key={j} className="flex gap-2.5">
							<span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-slime-500" />
							<span>
								<ListItem tokens={item} />
							</span>
						</li>
					))}
				</ul>
			)
		case "paragraph":
			return (
				<p key={i}>
					{block.lines.map((line, j) => (
						<span key={j}>
							{j > 0 ? <br /> : null}
							<Inline tokens={line} />
						</span>
					))}
				</p>
			)
		case "spacer":
			return <div key={i} className="h-1" aria-hidden />
		case "media":
			return null
	}
}

export default function ProjectsBodyContainer(props: { tokens: any[]; hideMedia?: boolean }) {
	const blocks = toBlocks(props.tokens)
	const media = props.hideMedia ? [] : (blocks.filter((b) => b.kind === "media") as Extract<Block, { kind: "media" }>[])
	const text = (
		<div className="space-y-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
			{blocks.filter((b) => b.kind !== "media").map(renderBlock)}
		</div>
	)
	if (!media.length) return text
	// text on the left, media on the right on desktop
	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<div className="lg:flex-1">{text}</div>
			<div className="space-y-4 lg:w-[45%] lg:shrink-0">
				{media.map((b, i) => (
					<Media key={i} token={b.token} />
				))}
			</div>
		</div>
	)
}
