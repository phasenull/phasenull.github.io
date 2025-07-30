export default function ProjectsBody() {
	return (
		<div className="">
			<h4 className="text-2xl lg:text-4xl font-bold font-sans text-center">projects i'm proud to display</h4>
			{new Array(100).fill(true).map((e, i) => (
				<a>
					<br />
					Random Project-{i}
				</a>
			))}
		</div>
	)
}
