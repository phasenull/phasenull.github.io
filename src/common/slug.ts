// url slug for a project title, shared by the app and the worker (worker/index.ts) so links and canonical URLs match
export function slugify(title: string | null | undefined) {
	return (
		(title || "")
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[̀-ͯ]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "project"
	)
}
