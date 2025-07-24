export default function ProjectsBody() {
	return (
		<div className="bg-red-400">
			+ project filterer here
			{new Array(100).fill(true).map((e, i) => (
				<a>
					Random Project-{i}
					<br />
				</a>
			))}
		</div>
	)
}
