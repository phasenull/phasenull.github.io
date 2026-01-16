import { useState, useEffect } from "react"
import { cleanURL } from "@common/util"
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"

interface ImageCarouselProps {
	urls: string[]
	alt?: string
}

export default function ImageCarousel({ urls, alt }: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isFullscreen, setIsFullscreen] = useState(false)

	const validUrls = urls.map(url => cleanURL(url.trim())).filter(Boolean) as string[]

	useEffect(() => {
		if (!isFullscreen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsFullscreen(false)
			if (e.key === "ArrowLeft") setCurrentIndex(prev => (prev - 1 + validUrls.length) % validUrls.length)
			if (e.key === "ArrowRight") setCurrentIndex(prev => (prev + 1) % validUrls.length)
		}

		document.addEventListener("keydown", handleKeyDown)
		document.body.style.overflow = "hidden"

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.body.style.overflow = ""
		}
	}, [isFullscreen, validUrls.length])

	if (validUrls.length === 0) return null

	const goToPrevious = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setCurrentIndex((prev) => (prev - 1 + validUrls.length) % validUrls.length)
	}

	const goToNext = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setCurrentIndex((prev) => (prev + 1) % validUrls.length)
	}

	return (
		<>
			{/* Carousel Container */}
			<div className="relative w-full my-2">
				{/* Main Image */}
				<div 
					className="relative cursor-pointer group"
					onClick={() => setIsFullscreen(true)}
				>
					<img
						src={validUrls[currentIndex]}
						alt={alt || `Image ${currentIndex + 1}`}
						className="h-96 object-contain mx-auto w-full rounded-2xl transition-opacity"
					/>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl flex items-center justify-center">
						<span className="select-none text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-black/50 px-3 py-1 rounded-full">
							Click to view fullscreen
						</span>
					</div>

					{/* Navigation Arrows (only if multiple images) */}
					{validUrls.length > 1 && (
						<>
							<button
								onClick={(e) => { e.stopPropagation(); goToPrevious() }}
								className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 text-slate-700 p-2 rounded-full shadow-md transition-all active:scale-95"
								aria-label="Previous image"
							>
								<IoChevronBack size={20} />
							</button>
							<button
								onClick={(e) => { e.stopPropagation(); goToNext() }}
								className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 text-slate-700 p-2 rounded-full shadow-md transition-all active:scale-95"
								aria-label="Next image"
							>
								<IoChevronForward size={20} />
							</button>
						</>
					)}

					{/* Image Counter */}
					{validUrls.length > 1 && (
						<div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
							{currentIndex + 1} / {validUrls.length}
						</div>
					)}
				</div>

				{/* Thumbnails (only if multiple images) */}
				{validUrls.length > 1 && (
					<div className="flex gap-2 mt-2 overflow-x-auto pb-2">
						{validUrls.map((url, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
									index === currentIndex 
										? "border-blue-500 shadow-md" 
										: "border-transparent opacity-60 hover:opacity-100"
								}`}
							>
								<img
									src={url}
									alt={`Thumbnail ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Fullscreen Modal */}
			{isFullscreen && (
				<div 
					className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
					onClick={() => setIsFullscreen(false)}
				>
					{/* Close Button */}
					<button
						onClick={() => setIsFullscreen(false)}
						className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
						aria-label="Close fullscreen"
					>
						<IoClose size={28} />
					</button>

					{/* Image Counter */}
					{validUrls.length > 1 && (
						<div className="absolute top-4 left-4 text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full">
							{currentIndex + 1} / {validUrls.length}
						</div>
					)}

					{/* Main Fullscreen Image */}
					<img
						src={validUrls[currentIndex]}
						alt={alt || `Image ${currentIndex + 1}`}
						className="max-w-[90vw] max-h-[85vh] object-contain"
						onClick={(e) => e.stopPropagation()}
					/>

					{/* Navigation Arrows (fullscreen) */}
					{validUrls.length > 1 && (
						<>
							<button
								onClick={goToPrevious}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:scale-110 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
								aria-label="Previous image"
							>
								<IoChevronBack size={32} />
							</button>
							<button
								onClick={goToNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:scale-110 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
								aria-label="Next image"
							>
								<IoChevronForward size={32} />
							</button>
						</>
					)}

					{/* Thumbnail Strip (fullscreen) */}
					{validUrls.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 rounded-xl">
							{validUrls.map((url, index) => (
								<button
									key={index}
									onClick={(e) => { e.stopPropagation(); setCurrentIndex(index) }}
									className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
										index === currentIndex 
											? "border-white shadow-md" 
											: "border-transparent opacity-50 hover:opacity-100"
									}`}
								>
									<img
										src={url}
										alt={`Thumbnail ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					)}

					{/* Keyboard hint */}
					<div className="absolute bottom-4 right-4 text-white/50 text-xs">
						Use ← → arrows to navigate, ESC to close
					</div>
				</div>
			)}
		</>
	)
}
