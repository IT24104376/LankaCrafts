import React from 'react';

/**
 * Batik Background - Final Fixed Version
 * - No clipping
 * - Proper staggered rows
 * - Balanced spacing
 */
export const BatikBackground: React.FC = () => {
	return (
		<div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
			<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">

				{/* Light green background */}
				<rect width="100%" height="100%" fill="#E6F4F1" />

				<defs>
					<pattern
						id="batik-staggered"
						x="0"
						y="0"
						width="75"
						height="85"
						patternUnits="userSpaceOnUse"
					>
						{/* Top centered flower (pushed down slightly) */}
						<g transform="translate(55,25)" fill="#2F5D50" opacity="0.06">
							<ellipse cx="0" cy="-10.5" rx="3.8" ry="9" />
							<ellipse cx="10.5" cy="0" rx="9" ry="3.8" />
							<ellipse cx="0" cy="10.5" rx="3.8" ry="9" />
							<ellipse cx="-10.5" cy="0" rx="9" ry="3.8" />

							{/* Diagonal petals */}
							<ellipse cx="6.8" cy="-6.8" rx="3" ry="6.8" transform="rotate(45)" />
							<ellipse cx="-6.8" cy="-6.8" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="6.8" cy="6.8" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="-6.8" cy="6.8" rx="3" ry="6.8" transform="rotate(45)" />

							<ellipse cx="0" cy="-10.5" rx="3" ry="6.8" transform="rotate(45)" />
							<ellipse cx="0" cy="-10.5" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="0" cy="10.5" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="0" cy="10.5" rx="3" ry="6.8" transform="rotate(45)" />

							{/* Center */}
							<circle cx="0" cy="0" r="2" />
						</g>

						{/* Offset flower (pushed inward to avoid cut) */}
						<g transform="translate(25,65)" fill="#2F5D50" opacity="0.06">
							<ellipse cx="0" cy="-10.5" rx="3.8" ry="9" />
							<ellipse cx="10.5" cy="0" rx="9" ry="3.8" />
							<ellipse cx="0" cy="10.5" rx="3.8" ry="9" />
							<ellipse cx="-10.5" cy="0" rx="9" ry="3.8" />

							{/* Diagonal petals */}
							<ellipse cx="6.8" cy="-6.8" rx="3" ry="6.8" transform="rotate(45)" />
							<ellipse cx="-6.8" cy="-6.8" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="6.8" cy="6.8" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="-6.8" cy="6.8" rx="3" ry="6.8" transform="rotate(45)" />

							<ellipse cx="0" cy="-10.5" rx="3" ry="6.8" transform="rotate(45)" />
							<ellipse cx="0" cy="-10.5" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="0" cy="10.5" rx="3" ry="6.8" transform="rotate(-45)" />
							<ellipse cx="0" cy="10.5" rx="3" ry="6.8" transform="rotate(45)" />

							{/* Center */}
							<circle cx="0" cy="0" r="2" />
						</g>
					</pattern>
				</defs>

				<rect width="100%" height="100%" fill="url(#batik-staggered)" />
			</svg>
		</div>
	);
};