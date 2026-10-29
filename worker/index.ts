// SEO front for the static site: every page gets real HTML on first load (title, description, canonical,
// Open Graph, JSON-LD and the page's text and links), plus /robots.txt and /sitemap.xml built from the
// live project data. The React app takes over in the browser exactly as before.
import { slugify } from "../src/common/slug"

interface Env {
	ASSETS: Fetcher
	API_URL: string
}

const SITE = "https://phasenull.dev"
const NAME = "phasenull"
const TAGLINE = "Roblox & Fullstack Developer"
const OG_IMAGE = `${SITE}/og/phasenull.jpg`
const BIRTHDATE = new Date("2007-06-01")
const SOCIALS = [
	{ label: "GitHub", url: "https://github.com/phasenull" },
	{ label: "YouTube", url: "https://www.youtube.com/@phasenulldev" },
	{ label: "Twitter", url: "https://x.com/phasenull" },
	{ label: "Roblox", url: "https://www.roblox.com/users/409950512/profile" },
	{ label: "Discord", url: "https://discord.com/users/465101652018593803" }
]
const EMAIL = "contact@phasenull.dev"

// same as public/_headers; worker-generated responses don't get those automatically
const SECURITY_HEADERS: Record<string, string> = {
	"Content-Security-Policy":
		"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; font-src 'self' data:; connect-src 'self' https://api.phasenull.dev https://cdn.phasenull.dev; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}

interface Project {
	id: number
	title: string
	description: string | null
	project_start_date: string | null
	project_end_date: string | null
	created_at: string | null
	thumbnail_url: string | null
	disclaimer: string | null
	url: string | null
	repo_url: string | null
}
interface Stack {
	id: number
	key: string
	url: string | null
}
interface ProjectsData {
	projects: Project[]
	stacks: Stack[]
	relations: { project_id: number; stack_id: number }[]
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (url.hostname.startsWith("www.")) return Response.redirect(`${SITE}${url.pathname}${url.search}`, 301)
		if (url.pathname === "/robots.txt") return robots()
		if (url.pathname === "/sitemap.xml") return sitemap(env)

		if (url.pathname === "/" || url.pathname === "/index.html") {
			const data = await loadProjects(env)
			return renderPage(request, env, home(data), 200)
		}

		// anything after the id is a slug; old links (e.g. "/projects/29/@rbxts/react-query") redirect to the canonical one
		const project_route = url.pathname.match(/^\/projects\/(\d+)(?:\/.*)?$/)
		if (project_route) {
			const data = await loadProjects(env)
			const project = data?.projects.find((p) => p.id === Number(project_route[1]))
			if (!project) return renderPage(request, env, notFound(), 404)
			const canonical = projectPath(project)
			if (url.pathname !== canonical) return Response.redirect(`${SITE}${canonical}`, 301)
			return renderPage(request, env, projectPage(project, data!), 200)
		}

		if (url.pathname.startsWith("/admin")) {
			const response = await env.ASSETS.fetch(new Request(new URL("/", request.url), request))
			return withHeaders(response, { "X-Robots-Tag": "noindex, nofollow" })
		}

		const asset = await env.ASSETS.fetch(request)
		if (asset.status === 404 && (request.headers.get("Accept") || "").includes("text/html"))
			return renderPage(request, env, notFound(), 404)
		return asset
	}
} satisfies ExportedHandler<Env>

// ---------- data ----------

async function loadProjects(env: Env): Promise<ProjectsData | null> {
	try {
		const response = await fetch(`${env.API_URL}/projects/all`, {
			cf: { cacheTtl: 300, cacheEverything: true }
		})
		if (!response.ok) return null
		const data = (await response.json()) as ProjectsData
		data.projects = [...data.projects].sort((a, b) => {
			if (a.project_end_date === null) return -1
			if (b.project_end_date === null) return 1
			return new Date(b.project_end_date).getTime() - new Date(a.project_end_date).getTime()
		})
		return data
	} catch {
		// the page still renders with its meta tags if the API is down
		return null
	}
}

const projectPath = (project: Project) => `/projects/${project.id}/${slugify(project.title)}`

// ---------- description markup (same tags as the app's tokenizer) ----------

const TAG = /%\{(GHOSTLINK|IMAGE|IMAGE_CAROUSEL|VIDEO|HEADLINE)\}%([^|]+)\|([^%]+)%\{\1\}%/g

function safeUrl(value: string) {
	try {
		const url = new URL(value.trim())
		return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
	} catch {
		return null
	}
}

// plain text, for meta descriptions and summaries
function toText(description: string | null) {
	return (description || "")
		.replace(TAG, (_, kind: string, label: string) => (kind === "GHOSTLINK" || kind === "HEADLINE" ? label.trim() : ""))
		.replace(/^\s*-\s+/gm, "")
		.replace(/\s+/g, " ")
		.trim()
}

function firstParagraph(description: string | null) {
	const block = (description || "").split(/\n\s*\n|%\{HEADLINE\}%/)[0]
	return toText(block)
}

function truncate(text: string, max: number) {
	if (text.length <= max) return text
	return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…"
}

// the description as simple semantic HTML: paragraphs, headings, lists, links and images
function toHtml(description: string | null) {
	const out: string[] = []
	let list: string[] = []
	let paragraph: string[] = []
	const flushList = () => {
		if (list.length) out.push(`<ul>${list.map((li) => `<li>${li}</li>`).join("")}</ul>`)
		list = []
	}
	const flushParagraph = () => {
		if (paragraph.length) out.push(`<p>${paragraph.join("<br>")}</p>`)
		paragraph = []
	}
	const inline = (line: string) =>
		escapeHtml(line).replace(
			/%\{GHOSTLINK\}%([^|]+)\|([^%]+)%\{GHOSTLINK\}%/g,
			(_, label: string, href: string) => {
				const target = safeUrl(href.replace(/&amp;/g, "&"))
				return target
					? `<a href="${escapeHtml(target)}" rel="noopener noreferrer" target="_blank">${label.trim()}</a>`
					: label.trim()
			}
		)

	for (const raw of (description || "").split("\n")) {
		const line = raw.trimEnd()
		const headline = line.match(/^%\{HEADLINE\}%([^|]+)\|[^%]*%\{HEADLINE\}%$/)
		const media = [...line.matchAll(/%\{(IMAGE|IMAGE_CAROUSEL|VIDEO)\}%([^|]+)\|([^%]+)%\{\1\}%/g)]
		if (!line.trim()) {
			flushList()
			flushParagraph()
		} else if (headline) {
			flushList()
			flushParagraph()
			out.push(`<h2>${escapeHtml(headline[1].trim())}</h2>`)
		} else if (media.length) {
			flushList()
			flushParagraph()
			for (const [, kind, label, urls] of media) {
				if (kind === "VIDEO") continue
				for (const src of urls.split(",")) {
					const image = safeUrl(src)
					if (image) out.push(`<img src="${escapeHtml(image)}" alt="${escapeHtml(label.trim())}" loading="lazy">`)
				}
			}
		} else if (/^\s*-\s+/.test(line)) {
			flushParagraph()
			list.push(inline(line.replace(/^\s*-\s+/, "")))
		} else {
			flushList()
			paragraph.push(inline(line))
		}
	}
	flushList()
	flushParagraph()
	return out.join("\n")
}

function coverImage(project: Project) {
	const match = (project.description || "").match(/%\{(?:IMAGE|IMAGE_CAROUSEL)\}%[^|]+\|([^%,]+)/)
	return (match && safeUrl(match[1])) || safeUrl(project.thumbnail_url || "") || null
}

function dateRange(project: Project) {
	const fmt = (d: string) => new Date(d).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
	if (!project.project_start_date) return ""
	if (project.project_end_date === project.project_start_date) return fmt(project.project_start_date)
	return `${fmt(project.project_start_date)} – ${project.project_end_date ? fmt(project.project_end_date) : "Present"}`
}

// ---------- pages ----------

interface Page {
	title: string
	description: string
	path: string
	image: string
	large_image: boolean
	type: "profile" | "article" | "website"
	json_ld: unknown
	body: string
	noindex?: boolean
}

const person = {
	"@type": "Person",
	"@id": `${SITE}/#person`,
	name: NAME,
	alternateName: ["phase", "phasenull.dev"],
	url: `${SITE}/`,
	image: OG_IMAGE,
	jobTitle: TAGLINE,
	email: `mailto:${EMAIL}`,
	homeLocation: { "@type": "Country", name: "Türkiye" },
	knowsAbout: ["Roblox", "roblox-ts", "TypeScript", "Luau", "React", "React Native", "Cloudflare Workers", "Full-stack development"],
	sameAs: SOCIALS.map((s) => s.url)
}

function age() {
	const now = new Date()
	let years = now.getUTCFullYear() - BIRTHDATE.getUTCFullYear()
	if (now < new Date(Date.UTC(now.getUTCFullYear(), BIRTHDATE.getUTCMonth(), BIRTHDATE.getUTCDate()))) years--
	return years
}

function projectList(projects: Project[]) {
	return `<ul class="projects">${projects
		.map(
			(p) =>
				`<li><a href="${projectPath(p)}"><strong>${escapeHtml(p.title)}</strong></a> <span>${escapeHtml(dateRange(p))}</span><p>${escapeHtml(
					truncate(firstParagraph(p.description), 180)
				)}</p></li>`
		)
		.join("")}</ul>`
}

function home(data: ProjectsData | null): Page {
	const projects = data?.projects || []
	const highlights = projects.slice(0, 3).map((p) => p.title)
	const description = truncate(
		`${NAME} is a ${age()} year old Roblox and fullstack developer from Türkiye who builds Roblox games and developer tools with roblox-ts and TypeScript${
			highlights.length ? `, including ${highlights.join(", ")}` : ""
		}.`,
		160
	)
	return {
		title: `${NAME} — ${TAGLINE}`,
		description,
		path: "/",
		image: OG_IMAGE,
		large_image: false,
		type: "profile",
		json_ld: {
			"@context": "https://schema.org",
			"@graph": [
				person,
				{ "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: NAME, publisher: { "@id": `${SITE}/#person` } },
				{
					"@type": "ProfilePage",
					"@id": `${SITE}/#profile`,
					url: `${SITE}/`,
					name: `${NAME} — ${TAGLINE}`,
					mainEntity: { "@id": `${SITE}/#person` },
					isPartOf: { "@id": `${SITE}/#website` }
				},
				{
					"@type": "ItemList",
					name: `Projects by ${NAME}`,
					itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${projectPath(p)}`, name: p.title }))
				}
			]
		},
		body: `<header><img src="${OG_IMAGE}" alt="${NAME}'s avatar" width="96" height="96"><h1>${NAME}</h1><p class="tagline">${TAGLINE}</p>
<p>yet another ${age()} year old Roblox and fullstack dev located in Türkiye. Currently majoring in computer engineering. I do fullstack web as more of a hobby, my main focus is Roblox development nowadays. I like TypeScript and prefer roblox-ts (with TypeTorch) over luau.</p>
<p>${SOCIALS.map((s) => `<a href="${s.url}" rel="me noopener" target="_blank">${s.label}</a>`).join(" · ")} · <a href="mailto:${EMAIL}">${EMAIL}</a></p></header>
<main><h2>Projects</h2>${projectList(projects)}</main>`
	}
}

function projectPage(project: Project, data: ProjectsData): Page {
	const summary = firstParagraph(project.description) || toText(project.description)
	const image = coverImage(project)
	const stacks = data.relations
		.filter((r) => r.project_id === project.id)
		.map((r) => data.stacks.find((s) => s.id === r.stack_id)?.key)
		.filter(Boolean) as string[]
	const others = data.projects.filter((p) => p.id !== project.id)
	const links = [project.url, project.repo_url].map((u) => (u ? safeUrl(u) : null)).filter((u, i, a): u is string => !!u && a.indexOf(u) === i)
	const path = projectPath(project)
	return {
		title: `${project.title} — ${NAME}`,
		description: truncate(summary || `${project.title}, a project by ${NAME}.`, 160),
		path,
		image: image || OG_IMAGE,
		large_image: !!image,
		type: "article",
		json_ld: {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "CreativeWork",
					"@id": `${SITE}${path}#project`,
					name: project.title,
					headline: project.title,
					description: truncate(toText(project.description), 500),
					url: `${SITE}${path}`,
					...(image ? { image } : {}),
					...(project.project_start_date ? { dateCreated: project.project_start_date } : {}),
					...(project.created_at ? { dateModified: project.created_at } : {}),
					...(stacks.length ? { keywords: stacks.join(", ") } : {}),
					...(links.length ? { sameAs: links } : {}),
					author: { "@id": `${SITE}/#person` },
					creator: person
				},
				{
					"@type": "BreadcrumbList",
					itemListElement: [
						{ "@type": "ListItem", position: 1, name: NAME, item: `${SITE}/` },
						{ "@type": "ListItem", position: 2, name: project.title, item: `${SITE}${path}` }
					]
				}
			]
		},
		body: `<nav><a href="/">${NAME}</a> › ${escapeHtml(project.title)}</nav>
<article><h1>${escapeHtml(project.title)}</h1><p class="meta">${escapeHtml(dateRange(project))}${stacks.length ? ` · ${escapeHtml(stacks.join(", "))}` : ""}</p>
${project.disclaimer ? `<p class="note">${escapeHtml(project.disclaimer)}</p>` : ""}
${links.length ? `<p>${links.map((u) => `<a href="${escapeHtml(u)}" rel="noopener noreferrer" target="_blank">${escapeHtml(new URL(u).hostname)}</a>`).join(" · ")}</p>` : ""}
${toHtml(project.description)}</article>
<aside><h2>More projects by ${NAME}</h2>${projectList(others)}</aside>`
	}
}

function notFound(): Page {
	return {
		title: `Page not found — ${NAME}`,
		description: `This page doesn't exist. See ${NAME}'s projects instead.`,
		path: "/",
		image: OG_IMAGE,
		large_image: false,
		type: "website",
		json_ld: null,
		body: `<h1>Page not found</h1><p><a href="/">Back to ${NAME}'s projects</a></p>`,
		noindex: true
	}
}

// ---------- rendering ----------

// minimal styling for the brief moment before React replaces the server-rendered content
const SSR_STYLE = `#ssr{max-width:72rem;margin:0 auto;padding:7rem 1.5rem 4rem;font-family:"Nunito Variable",ui-rounded,system-ui,sans-serif;color:#334155;line-height:1.6}#ssr h1{font-size:2.5rem;font-weight:900;color:#0f172a;margin:.25rem 0}#ssr h2{font-size:1.5rem;font-weight:900;color:#0f172a;margin:2rem 0 .75rem}#ssr a{color:#16a35a;font-weight:700}#ssr img{max-width:100%;border-radius:1rem}#ssr header img{border-radius:9999px}#ssr .projects{list-style:none;padding:0;display:grid;gap:1rem}#ssr .projects li{background:#fff;border:1px solid #e2e8f0;border-radius:1.5rem;padding:1rem 1.25rem}#ssr .projects span,#ssr .meta,#ssr .tagline{color:#94a3b8;font-weight:700}#ssr .note{background:#fffbeb;border:1px solid #fde68a;border-radius:1rem;padding:.5rem 1rem;color:#92400e}`

async function renderPage(request: Request, env: Env, page: Page, status: number) {
	const shell = await env.ASSETS.fetch(new Request(new URL("/", request.url), { headers: { Accept: "text/html" } }))
	const canonical = `${SITE}${page.path}`
	const head = [
		`<meta name="description" content="${escapeHtml(page.description)}">`,
		`<link rel="canonical" href="${canonical}">`,
		page.noindex ? `<meta name="robots" content="noindex">` : `<meta name="robots" content="index, follow, max-image-preview:large">`,
		`<meta name="author" content="${NAME}">`,
		`<meta property="og:site_name" content="${NAME}">`,
		`<meta property="og:type" content="${page.type}">`,
		`<meta property="og:title" content="${escapeHtml(page.title)}">`,
		`<meta property="og:description" content="${escapeHtml(page.description)}">`,
		`<meta property="og:url" content="${canonical}">`,
		`<meta property="og:image" content="${escapeHtml(page.image)}">`,
		`<meta property="og:locale" content="en_US">`,
		page.type === "profile" ? `<meta property="profile:username" content="${NAME}">` : "",
		`<meta name="twitter:card" content="${page.large_image ? "summary_large_image" : "summary"}">`,
		`<meta name="twitter:site" content="@phasenull">`,
		`<meta name="twitter:creator" content="@phasenull">`,
		`<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
		`<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
		`<meta name="twitter:image" content="${escapeHtml(page.image)}">`,
		// JSON-LD is a data block, not a script, so the CSP doesn't apply; "<" is escaped so it can't close the tag
		page.json_ld ? `<script type="application/ld+json">${JSON.stringify(page.json_ld).replace(/</g, "\\u003c")}</script>` : "",
		`<style>${SSR_STYLE}</style>`
	]
		.filter(Boolean)
		.join("\n")

	const html = new HTMLRewriter()
		.on("title", {
			element(element) {
				element.setInnerContent(page.title)
			}
		})
		.on("head", {
			element(element) {
				element.append(head, { html: true })
			}
		})
		.on("div#root", {
			element(element) {
				element.setInnerContent(`<div id="ssr">${page.body}</div>`, { html: true })
			}
		})
		.transform(shell)

	const headers = new Headers({
		"Content-Type": "text/html; charset=utf-8",
		"Cache-Control": "public, max-age=0, s-maxage=300",
		...SECURITY_HEADERS
	})
	if (page.noindex) headers.set("X-Robots-Tag", "noindex")
	return new Response(html.body, { status, headers })
}

function robots() {
	return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" }
	})
}

async function sitemap(env: Env) {
	const data = await loadProjects(env)
	const urls = [
		{ loc: `${SITE}/`, lastmod: new Date().toISOString().slice(0, 10), image: OG_IMAGE },
		...(data?.projects || []).map((p) => ({
			loc: `${SITE}${projectPath(p)}`,
			lastmod: (p.created_at || p.project_start_date || new Date().toISOString()).slice(0, 10),
			image: coverImage(p)
		}))
	]
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
	.map(
		(u) =>
			`<url><loc>${escapeHtml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod>${u.image ? `<image:image><image:loc>${escapeHtml(u.image)}</image:loc></image:image>` : ""}</url>`
	)
	.join("\n")}
</urlset>
`
	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" }
	})
}

function withHeaders(response: Response, extra: Record<string, string>) {
	const copy = new Response(response.body, response)
	for (const [key, value] of Object.entries(extra)) copy.headers.set(key, value)
	return copy
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}
