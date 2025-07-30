import { useEffect, useState } from "react"
import { stack } from "../common/constants"

export default function AnimatedStackComponent() {
	const [view_index, set_index] = useState(0)
	useEffect(() => {
		const controller = setInterval(() => {
			set_index((current) => (current + 1) % stack.length)
			console.log("update!")
		}, 1000)
		return () => clearInterval(controller)
	}, [])
	return (
		// <div className="inline-block">
			`${stack[view_index].name}`
		// </div>
	)
}
